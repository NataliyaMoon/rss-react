import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface UserFormData {
  name: string
  age: number
  email: string
  confirmEmail: string
  password: string
  confirmPassword: string
  gender: string
  terms: boolean
  country: string
  image?: FileList
  imageBase64?: string | null
}

export type FormType = 'uncontrolled' | 'rhf'

interface FormState {
  uncontrolledForm: UserFormData | null
  rhfForm: UserFormData | null
  countries: string[]
  highlightUntil: number | null
  lastUpdated: FormType | null
}

const initialState: FormState = {
  uncontrolledForm: null,
  rhfForm: null,
  countries: ['Kazakhstan', 'Russia', 'USA', 'Germany', 'France'],
  highlightUntil: null,
  lastUpdated: null,
}

const formSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    addFormData: (
      state,
      action: PayloadAction<{ data: UserFormData; formType: FormType }>
    ) => {
      if (action.payload.formType === 'uncontrolled') {
        state.uncontrolledForm = action.payload.data
      } else {
        state.rhfForm = action.payload.data
      }

      state.lastUpdated = action.payload.formType
      state.highlightUntil = Date.now() + 2000
    },
  },
})

export const { addFormData } = formSlice.actions
export default formSlice.reducer
