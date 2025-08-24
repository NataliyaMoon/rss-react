import UserForm from './UserForm'

export default function UncontrolledUserForm({ onSuccessClose }: { onSuccessClose: () => void }) {
  return <UserForm onSuccessClose={onSuccessClose} formType="uncontrolled" />
}