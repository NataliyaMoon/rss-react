import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'


interface ModalProps {
isOpen: boolean
onClose: () => void
ariaLabel: string
children: React.ReactNode
}

export default function Modal({ isOpen, onClose, ariaLabel, children }: ModalProps) {
const backdropRef = useRef<HTMLDivElement | null>(null)
const previouslyFocused = useRef<HTMLElement | null>(null)


useEffect(() => {
if (!isOpen) return


previouslyFocused.current = document.activeElement as HTMLElement


const handleKey = (e: KeyboardEvent) => {
if (e.key === 'Escape') onClose()
if (e.key === 'Tab') trapFocus(e)
}

document.addEventListener('keydown', handleKey)

const modal = backdropRef.current?.querySelector('[data-modal]') as HTMLElement | null
if (modal) {
const focusables = getFocusable(modal)
;(focusables[0] ?? modal).focus()
}


return () => {
document.removeEventListener('keydown', handleKey)
previouslyFocused.current?.focus()
}
}, [isOpen, onClose])

const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
if (e.target === backdropRef.current) onClose()
}


if (!isOpen) return null


return createPortal(
<div
className="backdrop"
ref={backdropRef}
onMouseDown={onBackdropClick}
aria-hidden={!isOpen}
>
<div
className="modal"
role="dialog"
aria-modal="true"
aria-label={ariaLabel}
data-modal
>
<button className="close" onClick={onClose} aria-label="Закрыть модальное окно">×</button>
{children}
</div>
</div>,
document.getElementById('modal-root') as HTMLElement
)
}


function getFocusable(container: HTMLElement): HTMLElement[] {
const selectors = [
'a[href]', 'button', 'input', 'textarea', 'select', '[tabindex]:not([tabindex="-1"])'
]
const els = Array.from(container.querySelectorAll<HTMLElement>(selectors.join(',')))
return els.filter(el => !el.hasAttribute('disabled'))
}

function trapFocus(e: KeyboardEvent) {
const modal = document.querySelector('[data-modal]') as HTMLElement | null
if (!modal) return
const focusables = getFocusable(modal)
if (focusables.length === 0) return
const first = focusables[0]
const last = focusables[focusables.length - 1]
const active = document.activeElement as HTMLElement


if (e.shiftKey) {
if (active === first) {
e.preventDefault()
last.focus()
}
} else {
if (active === last) {
e.preventDefault()
first.focus()
}
}
}