const userModel = require("../models/User")
const noteModel = require("../models/Note")
const bcrypt = require("bcrypt")

const getAllUsers = async (req, res) => {
  const users = await userModel.find().select("-password").lean().exec()

  if (!users?.length) {
    return res.status(200).json([])
  }

  res.status(200).json(users)
}

const createUser = async (req, res) => {
  const { username, password, role } = req.body
  if (!username || !password || !role) {
    return res.status(409).json({ message: "All fields are required." })
  }

  const duplicateUsername = await userModel
    .findOne({ username })
    .collation({ locale: "en", strength: 2 }) // required locale, strength for insensitivity
    .lean()
    .exec()
  if (duplicateUsername) {
    return res.status(400).json({ message: `Username is already exists.` })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const userObject = {
    username,
    password: hashedPassword,
    role,
  }

  const createdUser = await userModel.create(userObject)

  if (createdUser) {
    res
      .status(201)
      .json({ message: `${createdUser.username} has been created.` })
  } else {
    res.status(500).json({ message: `Server error.` })
  }
}

const updateUser = async (req, res) => {
  const { id, username, password, role, active } = req.body
  if (!id || !username || !role || typeof active !== "boolean") {
    return res.status(400).json({ message: "All fields are required." })
  }

  const user = await userModel.findById(id)

  if (!user) {
    return res.status(400).json({ message: "Invalid user ID" })
  }

  const duplicateUsername = await userModel
    .findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec()
  if (duplicateUsername && duplicateUsername._id.toString() !== id) {
    return res.status(409).json({ message: "Username is already exists." })
  }

  user.username = username
  user.role = role
  user.active = active

  if (password) {
    user.password = await bcrypt.hash(password, 10)
  }

  const updatedUser = await user.save()

  res.status(202).json({ message: `${updatedUser.username} has been updated` })
}

const deleteUser = async (req, res) => {
  const { id } = req.body
  if (!id) {
    return res.status(409).json({ message: "Required user ID." })
  }

  const note = await noteModel.findOne({ user: id })
  if (note) {
    return res.status(400).json({ message: "User has assigned notes." })
  }

  const user = await userModel.findById(id)

  if (!user) {
    return res.status(400).json(`Invalid user id`)
  }

  const deletedUser = await user.deleteOne()
  res.status(202).json({
    message: `${deletedUser.username} with ID of ${deletedUser._id} has been deleted`,
  })
}

module.exports = { getAllUsers, createUser, updateUser, deleteUser }
