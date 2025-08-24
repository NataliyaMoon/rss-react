import React, { type FormEvent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addFormData, type UserFormData } from '../../store/formSlice'
import { fileToBase64 } from '../utils/fileToBase64'
import { type RootState } from '../../store/store'

interface UncontrolledUserFormProps {
  onSuccessClose: () => void
}

const UncontrolledUserForm: React.FC<UncontrolledUserFormProps> = ({ onSuccessClose }) => {
  const dispatch = useDispatch()
  const countries = useSelector((state: RootState) => state.forms.countries)
  const [preview, setPreview] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    let imageBase64: string | null = null
    const file = formData.get('image') as File
    if (file && file.size > 0) {
      imageBase64 = await fileToBase64(file)
      setPreview(imageBase64)
    }

    const data: UserFormData = {
      name: formData.get('name') as string,
      age: Number(formData.get('age')),
      email: formData.get('email') as string,
      confirmEmail: formData.get('confirmEmail') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      gender: formData.get('gender') as string,
      terms: Boolean(formData.get('terms')),
      country: formData.get('country') as string,
      image: undefined,
      imageBase64,
    }

    dispatch(addFormData({ data, formType: 'uncontrolled' }))
    onSuccessClose()
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" required />
      </div>

      <div className="field">
        <label htmlFor="age">Age</label>
        <input id="age" name="age" type="number" required />
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>

      <div className="field">
        <label htmlFor="confirmEmail">Confirm Email</label>
        <input id="confirmEmail" name="confirmEmail" type="email" required />
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required />
      </div>

      <div className="field">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input id="confirmPassword" name="confirmPassword" type="password" required />
      </div>

      <fieldset className="field">
        <legend>Gender</legend>
        <label><input type="radio" name="gender" value="male" required /> Male</label>
        <label><input type="radio" name="gender" value="female" required /> Female</label>
      </fieldset>

      <div className="field">
        <label>
          <input type="checkbox" name="terms" required /> I accept Terms & Conditions
        </label>
      </div>

      <div className="field">
        <label htmlFor="country">Country</label>
        <input id="country" name="country" list="countries" required />
        <datalist id="countries">
          {countries.map(c => <option key={c} value={c} />)}
        </datalist>
      </div>

      <div className="field">
        <label htmlFor="image">Upload Image</label>
        <input id="image" type="file" name="image" accept="image/png, image/jpeg" />
        {preview && <img src={preview} alt="Preview" className="preview" />}
      </div>

      <button type="submit">Submit</button>
    </form>
  )
}

export default UncontrolledUserForm
