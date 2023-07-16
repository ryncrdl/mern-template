import { useNavigate } from "react-router-dom"
import { useGetNotesQuery } from "./notesApiSlice"
import Note from "./Note"
import useAuth from "../../hooks/useAuth"
import useTitle from "../../hooks/useTitle"

const NoteList = () => {
  useTitle("Notes")
  const { username, role } = useAuth()
  const {
    data: notes,
    isSuccess,
    isLoading,
    isError,
    error,
  } = useGetNotesQuery("noteslist", {
    pollingInterval: 10000, //60 seconds refetch data
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  })

  const navigate = useNavigate()

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
    const { ids, entities } = notes

    const filterIds =
      role === "Manager" || role === "Admin"
        ? [...ids]
        : ids.filter((noteId) => entities[noteId].username === username)

    const table_content = ids?.length
      ? filterIds.map((noteId) => <Note key={noteId} noteId={noteId} />)
      : null

    content = (
      <table>
        <thead>
          <tr>
            <th>Assigned To</th>
            <th>Title</th>
            <th>Status</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {!filterIds?.length && (
            <tr>
              <td colSpan="6">
                <p style={{ padding: "1rem" }}>No available note.</p>
              </td>
            </tr>
          )}
          {table_content}
        </tbody>
      </table>
    )
  }

  return (
    <main className="notelist">
      <div className="notelist_header">
        <h1>Note List</h1>
        <button className="note_add_btn" onClick={() => navigate("new")}>
          Add Note
        </button>
      </div>
      <div className="table_container">{content}</div>
    </main>
  )
}

export default NoteList
