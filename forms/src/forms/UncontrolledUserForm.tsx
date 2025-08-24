import React, { type FormEvent } from 'react'
import { useDispatch } from 'react-redux'
import { addFormData, type UserFormData } from '../../store/formSlice'
import { fileToBase64 } from '../utils/fileToBase64'

interface UncontrolledUserFormProps {
  onSuccessClose: () => void
}

const UncontrolledUserForm: React.FC<UncontrolledUserFormProps> = ({ onSuccessClose }) => {
  const dispatch = useDispatch()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    let imageBase64: string | null = null
    const file = formData.get('image') as File
    if (file && file.size > 0) {
      imageBase64 = await fileToBase64(file)
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
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input type="number" name="age" placeholder="Age" required />
      <input type="email" name="email" placeholder="Email" required />
      <input type="email" name="confirmEmail" placeholder="Confirm Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <input type="password" name="confirmPassword" placeholder="Confirm Password" required />
      <select name="gender" required>
        <option value="">Choose gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <label>
        <input type="checkbox" name="terms" /> Accept Terms & Conditions
      </label>
      <input name="country" placeholder="Country" required />
      <input type="file" name="image" accept="image/png, image/jpeg" />
      <button type="submit">Submit</button>
    </form>
  )
}

export default UncontrolledUserForm
