import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import Modal from "../../src/components/Modal"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import '@testing-library/jest-dom'

let portalRoot: HTMLElement

beforeEach(() => {
  portalRoot = document.createElement("div")
  portalRoot.setAttribute("id", "modal-root")
  document.body.appendChild(portalRoot)
})

afterEach(() => {
  document.body.removeChild(portalRoot)
})

describe("Modal component", () => {
  it("renders when open", () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} ariaLabel="Test Modal">
        <span>Hello</span>
      </Modal>
    )
    const el = screen.getByText("Hello")
    expect(el).toBeInTheDocument()
  })

  it("does not render when closed", () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} ariaLabel="Test Modal">
        <span>Hidden</span>
      </Modal>
    )
    const el = screen.queryByText("Hidden")
    expect(el).not.toBeInTheDocument()
  })

  it("closes on ESC key", () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose} ariaLabel="Test Modal">
        <span>Hello</span>
      </Modal>
    )
    fireEvent.keyDown(document, { key: "Escape" })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("closes on outside click", () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose} ariaLabel="Test Modal">
        <div>Inside</div>
      </Modal>
    )
    const backdrop = portalRoot.querySelector(".backdrop") as HTMLElement
    fireEvent.mouseDown(backdrop)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
