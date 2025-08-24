import * as Yup from 'yup'

export interface FormSchema {
  name: string
  age: number
  email: string
  confirmEmail: string
  password: string
  confirmPassword: string
  gender: 'male' | 'female'
  terms: boolean
  country: string
  image?: FileList
}

export const schema: Yup.ObjectSchema<FormSchema> = Yup.object().shape({
  name: Yup.string()
    .matches(/^[A-Z][a-zA-Z]*$/, 'First letter uppercase, only letters allowed')
    .required('Name is required'),
  age: Yup.number()
    .positive('Age must be positive')
    .integer('Age must be a number')
    .required('Age is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  confirmEmail: Yup.string()
    .oneOf([Yup.ref('email')], 'Emails must match')
    .required('Confirm Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[0-9]/, 'Must contain a number')
    .matches(/[A-Z]/, 'Must contain an uppercase letter')
    .matches(/[a-z]/, 'Must contain a lowercase letter')
    .matches(/[^a-zA-Z0-9]/, 'Must contain a special character')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
  gender: Yup.mixed<'male' | 'female'>().required('Gender is required'),
  terms: Yup.boolean()
    .oneOf([true], 'You must accept Terms & Conditions')
    .required('You must accept Terms & Conditions'),
  country: Yup.string().required('Country is required'),
  image: Yup.mixed<FileList>()
    .test('fileSize', 'File too large', (value) => {
      if (!value || value.length === 0) return true
      return value[0].size <= 2000000
    })
    .test('fileFormat', 'Unsupported format', (value) => {
      if (!value || value.length === 0) return true
      return ['image/jpeg', 'image/png'].includes(value[0].type)
    }),
}).required()
