"use client"

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'

import { addFormData, type FormType, type UserFormData } from '../store/formSlice'
import { type RootState } from '../store/store'
import { schema, type FormSchema } from '../utils/schema'
import { fileToBase64 } from '../utils/fileToBase64'

interface Props {
  onSuccessClose: () => void
  formType: FormType
}

export default function UserForm({ onSuccessClose, formType }: Props) {
  const dispatch = useDispatch()
  const countries = useSelector((state: RootState) => state.forms.countries)

  const [preview, setPreview] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm<FormSchema>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  })

  const onSubmit = async (data: FormSchema) => {
    let imageBase64: string | null = null
    if (data.image && data.image[0]) {
      imageBase64 = await fileToBase64(data.image[0])
      setPreview(imageBase64)
    }

    const submitData: UserFormData = {
      ...data,
      imageBase64,
    }

    dispatch(addFormData({ data: submitData, formType }))
    reset()
    onSuccessClose()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" {...register('name')} />
        <p className="error">{errors.name?.message}</p>
      </div>

      <div className="field">
        <label htmlFor="age">Age</label>
        <input id="age" type="number" {...register('age')} />
        <p className="error">{errors.age?.message}</p>
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register('email')} />
        <p className="error">{errors.email?.message}</p>
      </div>

      <div className="field">
        <label htmlFor="confirmEmail">Confirm Email</label>
        <input id="confirmEmail" type="email" {...register('confirmEmail')} />
        <p className="error">{errors.confirmEmail?.message}</p>
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...register('password')} />
        <p className="error">{errors.password?.message}</p>
      </div>

      <div className="field">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input id="confirmPassword" type="password" {...register('confirmPassword')} />
        <p className="error">{errors.confirmPassword?.message}</p>
      </div>

      <fieldset className="field">
        <legend>Gender</legend>
        <label><input type="radio" value="male" {...register('gender')} /> Male</label>
        <label><input type="radio" value="female" {...register('gender')} /> Female</label>
        <p className="error">{errors.gender?.message}</p>
      </fieldset>

      <div className="field">
        <label htmlFor="country">Country</label>
        <input id="country" list="countries" {...register('country')} />
        <datalist id="countries">
          {countries.map(c => <option key={c} value={c} />)}
        </datalist>
        <p className="error">{errors.country?.message}</p>
      </div>

      <div className="field">
        <label htmlFor="image">Upload Image</label>
        <input id="image" type="file" accept="image/png, image/jpeg" {...register('image')} />
        {preview && <img src={preview} alt="Preview" className="preview" />}
        <p className="error">{errors.image?.message as string}</p>
      </div>

      <div className="field">
        <label>
          <input type="checkbox" {...register('terms')} /> I accept Terms & Conditions
        </label>
        <p className="error">{errors.terms?.message}</p>
      </div>

      <button type="submit" disabled={!isValid}>Submit</button>
    </form>
  )
}
