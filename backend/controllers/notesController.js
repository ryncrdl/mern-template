const userModel = require("../models/User")
const noteModel = require("../models/Note")

const getAllNotes = async (req, res) => {
  const notes = await noteModel.find().lean().exec()

  if (!notes?.length) {
    return res.status(200).json([])
  }

  // Add username to each note before sending the response
  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await userModel.findById(note.user).lean().exec()
      return { ...note, username: user.username } //add new field with username
    })
  )

  res.status(200).json(notesWithUser)
}

const createNote = async (req, res) => {
  const { user, title, text } = req.body
  if (!user || !title || !text) {
    return res.status(409).json({ message: "All fields are required." })
  }

  const userId = await userModel.findById({ _id: user })
  if (!userId) {
    return res.status(400).json({ message: "User ID doesn't Match." })
  }

  const duplicateTitle = await noteModel
    .findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec()
  if (duplicateTitle) {
    return res.status(400).json({ message: "Title not available." })
  }

  const noteObject = {
    user,
    title,
    text,
  }

  const createdNote = await noteModel.create(noteObject)

  if (createdNote) {
    res.status(201).json({ message: `${createdNote.title} has been created` })
  } else {
    res.status(500).json({ message: `Note server error` })
  }
}

const updateNote = async (req, res) => {
  const { id, user, title, text, completed } = req.body

  if (!id || !user || !title || !text || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All fields are required." })
  }

  const note = await noteModel.findById(id)

  if (!note) {
    return res.status(409).json({ message: "Invalid Note ID." })
  }

  note.user = user
  note.title = title
  note.text = text
  note.completed = completed

  const updatedNote = await note.save()

  res.status(202).json({ message: `${updatedNote.title} has been updated` })
}

const deleteNote = async (req, res) => {
  const { id } = req.body
  if (!id) {
    return res.status(400).json({ message: "Required Note ID." })
  }

  const note = await noteModel.findById(id)
  if (!note) {
    return res.status(400).json({ message: "Invalid Note ID." })
  }

  const deletedNote = await note.deleteOne()

  res.json({ message: `Note with ID of ${deletedNote._id} has been deleted.` })
}

module.exports = { getAllNotes, createNote, updateNote, deleteNote }
