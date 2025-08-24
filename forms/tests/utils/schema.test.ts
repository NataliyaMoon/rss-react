import { describe, it, expect } from "vitest"
import { schema, type FormSchema } from "../../src/utils/schema"

describe("Yup FormSchema validation", () => {
  const validData: FormSchema = {
    name: "John",
    age: 25,
    email: "john@example.com",
    confirmEmail: "john@example.com",
    password: "Password1!",
    confirmPassword: "Password1!",
    gender: "male",
    terms: true,
    country: "USA",
  }

  it("passes with valid data", async () => {
    await expect(schema.validate(validData, { stripUnknown: true })).resolves.toMatchObject(validData)
  })

  it("fails if name does not start with uppercase", async () => {
    const invalid = { ...validData, name: "john" }
    await expect(schema.validate(invalid)).rejects.toThrow(
      "First letter uppercase, only letters allowed"
    )
  })

  it("fails if age is negative", async () => {
    const invalid = { ...validData, age: -5 }
    await expect(schema.validate(invalid)).rejects.toThrow(
      "Age must be positive"
    )
  })

  it("fails if emails do not match", async () => {
    const invalid = { ...validData, confirmEmail: "other@example.com" }
    await expect(schema.validate(invalid)).rejects.toThrow(
      "Emails must match"
    )
  })

  it("fails if password does not meet requirements", async () => {
    const invalid = { ...validData, password: "short", confirmPassword: "short" }
    await expect(schema.validate(invalid)).rejects.toThrow(
      "Password must be at least 8 characters"
    )
  })

  it("fails if passwords do not match", async () => {
    const invalid = { ...validData, confirmPassword: "Other123!" }
    await expect(schema.validate(invalid)).rejects.toThrow(
      "Passwords must match"
    )
  })

  it("fails if terms are not accepted", async () => {
    const invalid = { ...validData, terms: false }
    await expect(schema.validate(invalid)).rejects.toThrow(
      "You must accept Terms & Conditions"
    )
  })

  it("fails if file is too large", async () => {
    const fakeFile = new File([""], "test.png", { type: "image/png" })
    Object.defineProperty(fakeFile, "size", { value: 3_000_000 })
    const invalid = { ...validData, image: [fakeFile] as unknown as FileList }
    await expect(schema.validate(invalid)).rejects.toThrow("File too large")
  })

  it("fails if file format is not supported", async () => {
    const fakeFile = new File([""], "test.gif", { type: "image/gif" })
    const invalid = { ...validData, image: [fakeFile] as unknown as FileList }
    await expect(schema.validate(invalid)).rejects.toThrow(
      "Unsupported format"
    )
  })
})
