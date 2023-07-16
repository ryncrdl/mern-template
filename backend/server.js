require("dotenv").config()
//handle all errors
require("express-async-errors")
const express = require("express")
const app = express()
const PORT = process.env.PORT || 3500
const path = require("path")
const { logger, logEvents } = require("./middleware/logger")
const errorHanlder = require("./middleware/errorHandler")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const corsOptions = require("./config/corsOptions")
const mongoose = require("mongoose")
const connectDB = require("./config/dbConn")

mongoose.set("strictQuery", true)
connectDB()

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use(express.static(path.join(__dirname, "public")))

app.use("/", require("./routes/root"))
app.use("/auth", require("./routes/authRoutes"))
app.use("/users", require("./routes/userRoutes"))
app.use("/notes", require("./routes/noteRoutes"))

//404 page
app.all("*", (req, res) => {
  res.status(404)
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"))
  } else if (req.accepts("json")) {
    res.json({ message: "404! Requested page not found" })
  } else {
    res.type("txt").sendFile("404! Requested page not found")
  }
})

app.use(errorHanlder)

mongoose.connection.once("open", () => {
  console.log("Connected to techNotesDB")
  app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`))
})

mongoose.connection.on("error", (err) => {
  logEvents(
    `Err no.: ${err.no}\nErr Code: ${err.code}\nErr systemcall: ${err.syscall}\nErr Hostname: ${err.hostname}`,
    "techNotesDB_ErrLog.log"
  )

  console.log(err.stack)
})
