import { z } from 'zod'

export const passwordStrength = {
  digit: /\d/,
  upper: /[A-ZА-Я]/u,
  lower: /[a-zа-я]/u,
  special: /[^\w\s]/u,
}

export const userSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'Name is required' })
      .regex(/^\p{Lu}/u, { message: 'First letter must be uppercase' }),
    age: z.coerce
      .number()
      .int({ message: 'Must be an integer' })
      .min(0, { message: 'Age cannot be negative' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Minimum 8 characters required' })
      .regex(passwordStrength.digit, { message: 'Must contain at least 1 digit' })
      .regex(passwordStrength.upper, { message: 'Must contain an uppercase letter' })
      .regex(passwordStrength.lower, { message: 'Must contain a lowercase letter' })
      .regex(passwordStrength.special, { message: 'Must contain a special character' }),
    confirmPassword: z.string(),
    gender: z.enum(['male', 'female', 'other'])
      .refine((val) => !!val, { message: 'Please select gender' }),
    terms: z.literal(true).refine((val) => val === true, {
      message: 'You must agree to the terms',
    }),
    country: z.string().min(1, { message: 'Please select a country' }),
    imageBase64: z.string().nullish(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match',
  })

export type UserFormData = z.infer<typeof userSchema>
