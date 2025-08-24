import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import FileInput from "../../src/utils/FileInput"
import { describe, expect, it, vi } from "vitest"

describe("FileInput component", () => {
  it("renders with default state", () => {
    render(<FileInput name="avatar" />)
    expect(screen.getByText(/No file selected/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Choose file/i)).toBeInTheDocument()
  })

  it("updates label when file selected", () => {
    const file = new File(["hello"], "hello.png", { type: "image/png" })
    const onChange = vi.fn()

    render(<FileInput name="avatar" onChange={onChange} />)

    const input = screen.getByLabelText(/Choose file/i) as HTMLInputElement

    fireEvent.change(input, { target: { files: [file] } })

    expect(screen.getByText("hello.png")).toBeInTheDocument()
    expect(onChange).toHaveBeenCalledWith(file)
  })

  it("resets to default label when no file", () => {
    const onChange = vi.fn()
    render(<FileInput name="avatar" onChange={onChange} />)

    const input = screen.getByLabelText(/Choose file/i) as HTMLInputElement
    fireEvent.change(input, { target: { files: [] } })

    expect(screen.getByText(/No file selected/i)).toBeInTheDocument()
    expect(onChange).toHaveBeenCalledWith(null)
  })
})
