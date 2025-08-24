import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store' 
import { Card } from '../components/Card'

export default function Home() {
  const { rhfForm, uncontrolledForm, highlightUntil, lastUpdated } = useSelector(
    (s: RootState) => s.forms
  )

  const now = Date.now()
  const rhfHighlight = lastUpdated === 'rhf' && (highlightUntil ?? 0) > now
  const unHighlight = lastUpdated === 'uncontrolled' && (highlightUntil ?? 0) > now

  return (
    <main>
      <section className={`tile ${rhfHighlight ? 'highlight' : ''}`} aria-live="polite">
        <h2>RHF Data</h2>
        {rhfForm ? <Card data={rhfForm} /> : <p>No data</p>}
      </section>

      <section className={`tile ${unHighlight ? 'highlight' : ''}`} aria-live="polite">
        <h2>Uncontrolled Data</h2>
        {uncontrolledForm ? <Card data={uncontrolledForm} /> : <p>No data</p>}
      </section>
    </main>
  )
}
