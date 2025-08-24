import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import formsReducer, { type FormState } from "../../store/formSlice"
import CountryAutocomplete from "../../src/components/CountryAutocomplete"

const preloadedState: { forms: FormState } = {
  forms: {
    countries: ["USA", "Canada", "Mexico"],
    uncontrolledForm: null,
    rhfForm: null,
    highlightUntil: null,
    lastUpdated: null,
  },
}

const store = configureStore({
  reducer: { forms: formsReducer },
  preloadedState,
})

describe("CountryAutocomplete component", () => {
  it("renders label and input", () => {
    render(
      <Provider store={store}>
        <CountryAutocomplete name="country" label="Country" />
      </Provider>
    )

    const input = screen.getByLabelText("Country")
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute("name", "country")
    expect(input).toHaveAttribute("autocomplete", "country-name")
  })

  it("calls onChange when typing", () => {
    const handleChange = vi.fn()
    render(
      <Provider store={store}>
        <CountryAutocomplete name="country" label="Country" onChange={handleChange} />
      </Provider>
    )

    const input = screen.getByLabelText("Country")
    fireEvent.change(input, { target: { value: "Canada" } })
    expect(handleChange).toHaveBeenCalledWith("Canada")
  })

  it("shows the correct countries in datalist", () => {
    render(
      <Provider store={store}>
        <CountryAutocomplete name="country" label="Country" />
      </Provider>
    )

    const input = screen.getByLabelText("Country") as HTMLInputElement
    const listId = input.getAttribute("list")
    expect(listId).toBeTruthy()

    const datalist = document.getElementById(listId!) as HTMLDataListElement
    expect(datalist).toBeInTheDocument()

    const optionValues = Array.from(datalist.options).map(o => o.value)
    expect(optionValues).toEqual(["USA", "Canada", "Mexico"])
  })
})
