import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import FileInput from "../../src/utils/FileInput"

describe("FileInput component", () => {
  it("shows default text", () => {
    render(<FileInput name="file" />)
    expect(screen.getByText("No file selected")).toBeTruthy()
    expect(screen.getByText("Choose file")).toBeTruthy()
  })

  it("calls onChange and updates filename when file is selected", () => {
    const handleChange = vi.fn()
    render(<FileInput name="file" onChange={handleChange} />)

    const input = screen.getByLabelText("Choose file", { selector: "input" }) as HTMLInputElement
    const file = new File(["content"], "example.png", { type: "image/png" })
    fireEvent.change(input, { target: { files: [file] } })

    expect(screen.getByText("example.png")).toBeTruthy()
    expect(handleChange).toHaveBeenCalledWith(file)
  })

  it("resets to default when no file is selected", () => {
    const handleChange = vi.fn()
    render(<FileInput name="file" onChange={handleChange} />)

    const input = screen.getByLabelText("Choose file", { selector: "input" }) as HTMLInputElement
    fireEvent.change(input, { target: { files: [] } })

    expect(screen.getByText("No file selected")).toBeTruthy()
    expect(handleChange).toHaveBeenCalledWith(null)
  })
})
