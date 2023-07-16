import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice"
import useAuth from "../../hooks/useAuth"
import NoteUser from "./NoteUser"
import useTitle from "../../hooks/useTitle"

const NoteViewForm = ({ note, users }) => {
  useTitle("View Note")
  const { isManager, isAdmin } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()

  const [userId, setUserId] = useState(note.user)
  const [title, setTitle] = useState(note.title)
  const [text, setText] = useState(note.text)
  const [completed, setCompleted] = useState(note.completed)

  const option = users.length ? <NoteUser users={users} /> : null

  const [
    deleteNote,
    {
      isSuccess: isDelSuccess,
      isLoading: isDelLoading,
      isError: isDelError,
      error: delError,
    },
  ] = useDeleteNoteMutation()
  const [
    updateNote,
    {
      isSuccess: isUpSuccess,
      isLoading: isUpLoading,
      isError: isUpError,
      error: upError,
    },
  ] = useUpdateNoteMutation()

  const canSave =
    [title, text, userId].every(Boolean) &&
    typeof completed === "boolean" &&
    !isDelError &&
    !isUpError

  const canDelete = isManager || isAdmin
  const onDeleteNote = async () => {
    if (!isDelError && id) {
      await deleteNote({ id })
    }
  }

  const onUpdateNote = async () => {
    if (!isUpError) {
      await updateNote({
        id,
        user: userId,
        title,
        text,
        completed,
      })
      navigate("/dash/notes")
    } else {
      console.log(`Update Error: ${upError}`)
    }
  }

  useEffect(() => {
    if (isUpSuccess || isDelSuccess) {
      navigate("/dash/notes")
    }
  }, [isUpSuccess, isDelSuccess, navigate])

  return (
    <main className="note_view">
      <h1>Note</h1>
      {(isUpLoading || isDelLoading) && <div className="dots"></div>}
      {(isUpError || isDelError) && (
        <p className="errMessage">{upError || delError}</p>
      )}

      {(!isUpLoading || !isDelLoading) && (!isUpError || !isUpError) && (
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="input_field">
            <label htmlFor="assigned_to">Assigned To</label>
            <select
              id="assigned_to"
              defaultValue={userId}
              onChange={(e) => setUserId(e.currentTarget.value)}
            >
              {option}
            </select>
          </div>
          <div className="input_field">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              placeholder="title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              autoComplete="off"
            />
          </div>
          <div className="input_field">
            <label htmlFor="text">Text</label>
            <input
              type="text"
              placeholder="text"
              id="text"
              value={text}
              onChange={(e) => setText(e.currentTarget.value)}
              autoComplete="off"
            />
          </div>
          <div className="input_field">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              defaultValue={completed}
              onChange={(e) =>
                setCompleted(
                  e.currentTarget.value === "true"
                    ? true
                    : e.currentTarget.value === "false"
                    ? false
                    : ""
                )
              }
            >
              <option value="">Select Status</option>
              <option value={true}>Completed</option>
              <option value={false}>Not Completed</option>
            </select>
          </div>
          <div className="note_view_btns">
            <button
              className="note_view_delete_btn"
              onClick={() => onDeleteNote()}
              disabled={!canDelete}
              style={
                !canDelete
                  ? { background: "var(--color-6)", cursor: "not-allowed" }
                  : null
              }
            >
              Delete
            </button>
            <button
              disabled={!canSave}
              style={
                !canSave
                  ? { background: "var(--color-6)", cursor: "not-allowed" }
                  : null
              }
              onClick={() => onUpdateNote()}
            >
              Save
            </button>
          </div>
        </form>
      )}
    </main>
  )
}

export default NoteViewForm
