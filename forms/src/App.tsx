import { useState } from 'react'
import Home from './pages/Home'
import Modal from './components/Modal'
import RHFUserForm from './forms/RHFUserForm'
import UncontrolledUserForm from './forms/UncontrolledUserForm'
import './App.css'

export default function App() {
  const [open, setOpen] = useState<null | 'rhf' | 'uncontrolled'>(null)


  return (
    <div className="container">
      <header>
        <h1>React Forms</h1>
      </header>


      <div className="actions">
        <button onClick={() => setOpen('uncontrolled')} aria-haspopup="dialog">
          Open uncontrolled components
        </button>
        <button onClick={() => setOpen('rhf')} aria-haspopup="dialog">
          Open React Hook Form
        </button>
      </div>


      <Home />


      <Modal
        isOpen={open === 'uncontrolled'}
        onClose={() => setOpen(null)}
        ariaLabel="Uncontrolled components"
      >
        <UncontrolledUserForm onSuccessClose={() => setOpen(null)} />
      </Modal>


      <Modal
        isOpen={open === 'rhf'}
        onClose={() => setOpen(null)}
        ariaLabel="React Hook Form"
      >
        <RHFUserForm onSuccessClose={() => setOpen(null)} />
      </Modal>
    </div>
  )
}