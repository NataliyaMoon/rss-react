import { describe, it, expect } from "vitest"
import reducer, { addFormData } from "../../src/store/formSlice"

describe("formSlice", () => {
  it("adds data for uncontrolled form", () => {
    const state = reducer(undefined, addFormData({ 
      data: { name:"A", age:20, email:"a@a.com", confirmEmail:"a@a.com", password:"Aa1!", confirmPassword:"Aa1!", gender:"male", terms:true, country:"USA" },
      formType: "uncontrolled"
    }))
    expect(state.uncontrolledForm?.name).toBe("A")
    expect(state.lastUpdated).toBe("uncontrolled")
  })
})
