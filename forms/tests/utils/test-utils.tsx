import React, { PropsWithChildren } from "react"
import { render } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore, EnhancedStore } from "@reduxjs/toolkit"
import formReducer from "../../src/store/formSlice"
import { RootState } from "../../src/store/store"

interface RenderOptions {
  preloadedState?: Partial<RootState>
  store?: EnhancedStore<RootState>
}

export function renderWithRedux(
  ui: React.ReactElement,
  { preloadedState, store }: RenderOptions = {}
) {
  const testStore =
    store ??
    configureStore({
      reducer: { forms: formReducer },
      preloadedState: preloadedState as RootState,
    })

  function Wrapper({ children }: PropsWithChildren) {
    return <Provider store={testStore}>{children}</Provider>
  }

  return render(ui, { wrapper: Wrapper })
}
