// import { useSelector } from "react-redux"
// import { selectUserById } from "../users/usersApiSlice"

const NoteUser = ({ users }) => {
  const options = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.username}
    </option>
  ))

  return options
}

export default NoteUser
