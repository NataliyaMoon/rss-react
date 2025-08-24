import React from "react"
import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { store } from "../../store/store"
import Home from "../../src/pages/Home"
import { describe, it, expect } from "vitest"

describe("Home component", () => {
  it("renders with no data in both sections", () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    )

    const noDataElements = screen.getAllByText(/No data/i)
    expect(noDataElements).toHaveLength(2)

    expect(noDataElements[0].closest("section")).toHaveTextContent("RHF Data")
    expect(noDataElements[1].closest("section")).toHaveTextContent("Uncontrolled Data")
  })
})
