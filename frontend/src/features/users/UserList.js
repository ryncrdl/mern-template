import { useNavigate } from "react-router-dom"
import { useGetUsersQuery } from "./usersApiSlice"
import User from "./User"
import useTitle from "../../hooks/useTitle"

const UserList = () => {
  useTitle("Users")
  const navigate = useNavigate()
  const {
    data: users,
    isSuccess,
    isLoading,
    isError,
    error,
  } = useGetUsersQuery("userlist", {
    pollingInterval: 60000, //60 seconds refetch data
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  })

  let content
  if (isLoading) {
    content = <div className="dots"></div>
  } else if (isError) {
    content = (
      <p
        style={{
          color: "red",
          background: "#eee",
          width: "min-content",
          padding: "0.5rem",
          margin: "0.5rem 0rem",
          whiteSpace: "nowrap",
        }}
      >
        {error?.data?.message}
      </p>
    )
  } else if (isSuccess) {
    const { ids } = users
    const table_content =
      ids?.length && ids.map((userId) => <User key={userId} userId={userId} />)

    content = (
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Roles</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {!table_content && (
            <tr>
              <td colSpan="6">
                <p style={{ padding: "1rem" }}>No available user.</p>
              </td>
            </tr>
          )}
          {table_content}
        </tbody>
      </table>
    )
  }
  return (
    <main className="userlist">
      <div className="userlist_header">
        <h1>User List</h1>
        <button className="user_add_btn" onClick={() => navigate("new")}>
          Add User
        </button>
      </div>
      <div className="table_container">{content}</div>
    </main>
  )
}

export default UserList
