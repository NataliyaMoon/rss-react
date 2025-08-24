import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Card } from "../../src/components/Card"
import type { UserFormData } from "../../src/store/formSlice"

describe("Card component", () => {
  const mockData: UserFormData = {
    name: "John",
    age: 25,
    email: "john@example.com",
    gender: "male",
    country: "USA",
    imageBase64: "data:image/png;base64,abc123",
    confirmEmail: "john@example.com",
    password: "Password1!",
    confirmPassword: "Password1!",
    terms: true,
  }

  it("renders all fields correctly", () => {
    render(<Card data={mockData} />)
    const nameNode = screen.getByText("Name:").parentElement
    expect(nameNode?.textContent).toBe(`Name: ${mockData.name}`)

    const ageNode = screen.getByText("Age:").parentElement
    expect(ageNode?.textContent).toBe(`Age: ${mockData.age}`)

    const emailNode = screen.getByText("Email:").parentElement
    expect(emailNode?.textContent).toBe(`Email: ${mockData.email}`)

    const genderNode = screen.getByText("Gender:").parentElement
    expect(genderNode?.textContent).toBe(`Gender: ${mockData.gender}`)

    const countryNode = screen.getByText("Country:").parentElement
    expect(countryNode?.textContent).toBe(`Country: ${mockData.country}`)
  })

  it("renders image if imageBase64 is provided", () => {
    render(<Card data={mockData} />)
    const img = screen.getByAltText("Uploaded image") as HTMLImageElement
    expect(img).not.toBeNull()
    expect(img.src).toBe(mockData.imageBase64)
  })

  it("does not render image if imageBase64 is not provided", () => {
    const dataWithoutImage: UserFormData = { ...mockData, imageBase64: undefined }
    render(<Card data={dataWithoutImage} />)
    const img = screen.queryByAltText("Uploaded image")
    expect(img).toBeNull()
  })
})
