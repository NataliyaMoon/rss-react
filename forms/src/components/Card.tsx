import type { UserFormData } from '../store/formSlice'

export function Card({ data }: { data: UserFormData }) {
  return (
    <div className="card">
      <ul>
        <li><strong>Name:</strong> {data.name}</li>
        <li><strong>Age:</strong> {data.age}</li>
        <li><strong>Email:</strong> {data.email}</li>
        <li><strong>Gender:</strong> {data.gender}</li>
        <li><strong>Country:</strong> {data.country}</li>
      </ul>
      {data.imageBase64 && (
        <img src={data.imageBase64} alt="Uploaded image" className="preview" />
      )}
    </div>
  )
}
