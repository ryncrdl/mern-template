// import { useSelector } from "react-redux"
// import { selectNoteById } from "./notesApiSlice"

import { useNavigate } from "react-router-dom"
import { format } from "date-fns"

import { useGetNotesQuery } from "./notesApiSlice"

import { memo } from "react"

const Note = ({ noteId }) => {
  // const note = useSelector((state) => selectNoteById(state, noteId));
  const { note } = useGetNotesQuery("noteslist", {
    selectFromResult: ({ data }) => ({
      note: data?.entities[noteId],
    }),
  })
  const navigate = useNavigate()

  if (note) {
    const handleViewNote = () => navigate(`/dash/notes/${noteId}`)

    const completed = note.completed ? "Completed" : "Not Completed"
    const noteCreatedDate = format(new Date(note.createdAt), "MM/dd/yyyy")
    const noteUpdatedDate = format(new Date(note.updatedAt), "MM/dd/yyyy")
    return (
      <tr>
        <td>{note.username}</td>
        <td>{note.title}</td>
        <td style={note.completed ? { color: "green" } : { color: "red" }}>
          {completed}
        </td>
        <td>{noteCreatedDate}</td>
        <td>{noteUpdatedDate}</td>
        <td>
          <button onClick={handleViewNote} className="note_view_btn">
            View
          </button>
        </td>
      </tr>
    )
  } else return null
}

const memoizedNote = memo(Note)
export default memoizedNote
