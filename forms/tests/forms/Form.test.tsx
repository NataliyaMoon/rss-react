import React from "react"
import { render } from "@testing-library/react"
import RHFUserForm from "../../src/forms/RHFUserForm"
import UncontrolledUserForm from "../../src/forms/UncontrolledUserForm"
import { describe, it, vi } from "vitest"
import { Provider } from "react-redux"
import { store } from "../../store/store"

describe("Form wrappers", () => {
  it("renders RHF form", () => {
    render(
      <Provider store={store}>
        <RHFUserForm onSuccessClose={vi.fn()} />
      </Provider>
    )
  })

  it("renders Uncontrolled form", () => {
    render(
      <Provider store={store}>
        <UncontrolledUserForm onSuccessClose={vi.fn()} />
      </Provider>
    )
  })
})
