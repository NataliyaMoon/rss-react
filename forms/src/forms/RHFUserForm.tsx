import UserForm from './UserForm'

export default function RHFUserForm({ onSuccessClose }: { onSuccessClose: () => void }) {
  return <UserForm onSuccessClose={onSuccessClose} formType="rhf" />
}