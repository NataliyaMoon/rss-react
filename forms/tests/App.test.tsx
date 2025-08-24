import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { Provider } from "react-redux"
import { store } from "../src/store/store"
import App from "../src/App"
import { describe, it, expect, beforeEach } from "vitest"

let portalRoot: HTMLElement

beforeEach(() => {
  portalRoot = document.createElement("div")
  portalRoot.setAttribute("id", "modal-root")
  document.body.appendChild(portalRoot)
})

describe("App", () => {
  it("renders header", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    )
    expect(screen.getByText(/React Forms/i)).toBeInTheDocument()
  })

  it("opens uncontrolled modal", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    )
    fireEvent.click(screen.getByRole("button", { name: /uncontrolled/i }))
    expect(screen.getByLabelText(/Uncontrolled components/i)).toBeInTheDocument()
  })
})
