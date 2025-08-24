import "@testing-library/jest-dom"
import * as ReactNamespace from "react"

declare global {
  interface GlobalThis {
    React: typeof ReactNamespace
  }
}

globalThis.React = ReactNamespace
