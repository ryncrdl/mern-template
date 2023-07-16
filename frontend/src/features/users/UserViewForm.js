import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDeleteUserMutation, useUpdateUserMutation } from "./usersApiSlice"
import { Roles } from "../../config/Roles"
import useTitle from "../../hooks/useTitle"

const USER_REGEX = /^[a-z]{3,20}$/
const PASS_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const UserViewForm = ({ user, users }) => {
  useTitle("View User")
  const navigate = useNavigate()
  const { id } = useParams()

  const [deleteUser, { isDelLoading, isDelError, delError }] =
    useDeleteUserMutation()
  const [updateUser, { isUpLoading, isUpError, upError }] =
    useUpdateUserMutation()

  const [username, setUsername] = useState(user?.username)
  const [validUsername, setValidUsername] = useState(false)
  const [password, setPassword] = useState("")
  const [validPassword, setValidPassword] = useState(false)
  const [retypePassword, setRetypePassword] = useState("")

  const [role, setRole] = useState(user?.role)
  const [active, setActive] = useState(user?.active)

  const roleOptions = Object.values(Roles).map((role) => (
    <option key={role} value={role}>
      {role}
    </option>
  ))

  let invalidUsername
  if (users) {
    users.map((user) =>
      user.username === username && user.id !== id
        ? (invalidUsername = (
            <p key={username} className="errMessage">
              {username} is already exists
            </p>
          ))
        : null
    )
  }

  const canSave =
    [username, validUsername, role].every(Boolean) && !invalidUsername

  useEffect(() => {
    if (USER_REGEX.test(username)) {
      setValidUsername(true)
    } else {
      setValidUsername(false)
    }

    if (PASS_REGEX.test(password)) {
      setValidPassword(true)
    } else {
      setValidPassword(false)
    }
  }, [username, password])

  const onDeleteUser = async () => {
    if (id) {
      await deleteUser({ id })
      navigate("/dash/users")
    }
  }

  const onUpdateUser = async () => {
    if (canSave) {
      await updateUser({ id, username, password, role, active })
      navigate("/dash/users")
    }
  }

  return (
    <main className="user_view">
      <h1 className="user_view_title">User</h1>
      {isDelLoading || (isUpLoading && <div className="dots"></div>)}
      {isDelError ||
        (isUpError && (
          <p className="errMessage">
            {delError?.data?.message || upError?.data?.message}
          </p>
        ))}

      <form>
        <div className="input_field">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            placeholder="Enter Username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
            autoComplete="off"
          />
          {!validUsername && (
            <p className="errMessage">3 - 20 Length & Small Letter Only</p>
          )}
          {invalidUsername}
        </div>
        <div className="input_field">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            autoComplete="off"
          />
          {!validPassword && <p className="errMessage">4 - 12 Length</p>}
        </div>
        <div className="input_field">
          <label htmlFor="retype_password">Retype Password</label>
          <input
            type="password"
            placeholder="Confirm Password"
            id="retype_password"
            value={retypePassword}
            onChange={(e) => setRetypePassword(e.currentTarget.value)}
            autoComplete="off"
          />
          {password !== retypePassword && (
            <p className="errMessage">Password doesn't match.</p>
          )}
        </div>

        <div className="input_field">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            defaultValue={role}
            onChange={(e) => setRole(e.currentTarget.value)}
          >
            <option value="">Select Role</option>
            {roleOptions}
          </select>
        </div>
        <div className="input_field">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            defaultValue={active}
            onChange={(e) =>
              setActive(
                e.currentTarget.value === "true"
                  ? true
                  : e.currentTarget.value === "false"
                  ? false
                  : ""
              )
            }
          >
            <option value="">Select Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <div className="user_view_btns">
          <button
            type="button"
            className="user_view_delete_btn"
            onClick={() => onDeleteUser()}
          >
            Delete
          </button>
          <button
            type="button"
            disabled={!canSave}
            style={!canSave ? { background: "var(--color-6)" } : null}
            onClick={() => onUpdateUser()}
          >
            Save
          </button>
        </div>
      </form>
    </main>
  )
}

export default UserViewForm
