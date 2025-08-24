import { useState } from "react"

interface FileInputProps {
  name: string
  onChange?: (file: File | null) => void
}

export default function FileInput({ name, onChange }: FileInputProps) {
  const [fileName, setFileName] = useState("No file selected")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFileName(file ? file.name : "No file selected")
    onChange?.(file)
  }

  return (
    <div style={{ margin: "8px 0" }}>
      <input
        id={name}
        type="file"
        name={name}
        onChange={handleChange}
        style={{ display: "none" }}
      />

      <label htmlFor={name} className="custom-file-upload">
        Choose file
      </label>

      <span style={{ marginLeft: "10px" }}>{fileName}</span>
    </div>
  )
}
