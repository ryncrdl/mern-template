// import { useSelector } from "react-redux"
// import { selectUserById } from "./usersApiSlice"

import { useNavigate } from "react-router-dom"

import { useGetUsersQuery } from "./usersApiSlice"
import { memo } from "react"

const User = ({ userId }) => {
  // const user = useSelector((state) => selectUserById(state, userId))
  const { user } = useGetUsersQuery("userslist", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  })
  const navigate = useNavigate()

  if (user) {
    const handleViewUser = () => navigate(`/dash/users/${userId}`)
    return (
      <tr>
        <td>{user.username}</td>
        <td>{user.role}</td>
        <td style={user?.active ? { color: "green" } : { color: "red" }}>
          {user.active ? "Active" : "Inactive"}
        </td>
        <td>
          <button onClick={handleViewUser} className="user_edit_btn">
            View
          </button>
        </td>
      </tr>
    )
  } else return null
}
//Only re-render if data has changed
const memoizedUser = memo(User)
export default memoizedUser
