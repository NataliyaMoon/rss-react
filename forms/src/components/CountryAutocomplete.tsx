import { useId } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store' 

interface Props {
id?: string
name: string
label: string
value?: string
onChange?: (v: string) => void
required?: boolean
}

export default function CountryAutocomplete({ id, name, label, value, onChange, required }: Props) {
const listId = useId()
const countries = useSelector((s: RootState) => s.forms.countries)

return (
<div className="field">
<label htmlFor={id ?? name}>{label}</label>
<input
id={id ?? name}
name={name}
list={listId}
value={value}
onChange={e => onChange?.(e.target.value)}
autoComplete="country-name"
required={required}
/>
<datalist id={listId}>
{countries.map(c => (
<option key={c} value={c} />
))}
</datalist>
<div className="error" aria-live="polite" />
</div>
)
}