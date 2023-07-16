// import { selectUsers } from "./usersApiSlice"
// import { useSelector } from "react-redux"
// import { selectUserById } from "./usersApiSlice"
import { useParams } from "react-router-dom"
import UserViewForm from "./UserViewForm"

import { useGetUsersQuery } from "./usersApiSlice"

const UserView = () => {
  const { id } = useParams()
  // const user = useSelector((state) => selectUserById(state, id))
  const { user } = useGetUsersQuery("userslist", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id],
    }),
  })
  // const users = useSelector(selectUsers)
  const { users } = useGetUsersQuery("userslist", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  })

  const content =
    user && users ? (
      <UserViewForm user={user} users={users} />
    ) : (
      <div className="dots"></div>
    )
  return content
}

export default UserView
