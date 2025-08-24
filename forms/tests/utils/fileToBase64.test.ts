import { describe, it, expect } from "vitest"
import { fileToBase64 } from "../../src/utils/fileToBase64"

describe("fileToBase64", () => {
  it("converts file to base64", async () => {
    const file = new File(["hello"], "hello.txt", { type: "text/plain" })
    const result = await fileToBase64(file)
    expect(result).toContain("base64")
  })
})
