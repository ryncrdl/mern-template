import { useEffect, useState } from "react"
import { selectNotes, useAddNewNoteMutation } from "./notesApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
// import { selectUsers } from "../users/usersApiSlice"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import NoteUser from "./NoteUser"

const NoteAdd = () => {
  const [addNewNote, { isSuccess, isLoading, isError, error }] =
    useAddNewNoteMutation()
  // const users = useSelector(selectUsers)
  const notes = useSelector(selectNotes)
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [text, setText] = useState("")
  const [user, setUser] = useState("")

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  })

  const options = users?.length ? <NoteUser users={users} /> : null

  let invalidTitle
  const onChangeTitle = (e) => {
    setTitle(e.currentTarget.value)
    invalidTitle = notes.map((note) => note.title === title) ? (
      <p className="errMessage">Title already exists.</p>
    ) : null

    console.log(title)
  }

  const invalidText = notes.find((note) => note.text === text) ? (
    <p className="errMessage">Text already exists.</p>
  ) : null

  const canSave =
    [title, text, user, !invalidTitle, !invalidText].every(Boolean) && !isError

  useEffect(() => {
    !isLoading && isSuccess && navigate("/dash/notes")
  }, [isSuccess, isLoading, navigate])

  const onSaveNewNote = async (e) => {
    e.preventDefault()
    if (canSave) await addNewNote({ title, text, user })
  }

  return (
    <main className="note_add">
      <h1 className="note_add_title">Add Note</h1>
      {isLoading && <div className="dots"></div>}
      {isError && <p>{error}</p>}

      {!isLoading && !isError && (
        <form onSubmit={(e) => onSaveNewNote(e)}>
          <div className="input_field">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              placeholder="e.g Repair Laptop"
              id="title"
              value={title}
              onChange={(e) => onChangeTitle(e)}
              autoComplete="off"
            />
            {invalidTitle}
          </div>
          <div className="input_field">
            <label htmlFor="text">Text</label>
            <input
              type="text"
              placeholder="e.g Fix Hard Drive"
              id="text"
              value={text}
              onChange={(e) => setText(e.currentTarget.value)}
              autoComplete="off"
            />
            {invalidText}
          </div>
          <div className="input_field">
            <label htmlFor="assigned_to">Assigned To</label>
            <select
              id="assigned_to"
              value={user}
              onChange={(e) => setUser(e.currentTarget.value)}
            >
              <option value="">Select User</option>
              {options}
            </select>
          </div>
          <button
            type="submit"
            disabled={!canSave}
            style={!canSave ? { background: "var(--color-6)" } : null}
          >
            Save
          </button>
        </form>
      )}
    </main>
  )
}

export default NoteAdd
