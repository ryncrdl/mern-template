// import { useSelector } from "react-redux"
// import { selectNoteById } from "./notesApiSlice"
// import { selectUsers } from "../users/usersApiSlice"
import { useParams } from "react-router-dom"

import NoteViewForm from "./NoteViewForm"

import { useGetNotesQuery } from "./notesApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import useAuth from "../../hooks/useAuth"
const NoteView = () => {
  const { id } = useParams()

  const { username, isManager, isAdmin } = useAuth()

  // const note = useSelector((state) => selectNoteById(state, id))
  const { note } = useGetNotesQuery("noteslist", {
    selectFromResult: ({ data }) => ({
      note: data?.entities[id],
    }),
  })
  // const users = useSelector(selectUsers)

  const { users } = useGetUsersQuery("userslist", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  })

  if (!note || !users.length) return <div className="dots"></div>

  if (!isManager && !isAdmin) {
    if (note.username !== username) {
      return (
        <p
          style={{
            color: "var(--color-8)",
            padding: "var(--form-padding)",
            background: "var(--color-7)",
          }}
        >
          Access Dinied!.
        </p>
      )
    }
  }

  const content =
    note && users ? (
      <NoteViewForm note={note} users={users} />
    ) : (
      <div className="dots"></div>
    )
  return content
}

export default NoteView
