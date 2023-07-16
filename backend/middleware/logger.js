const { format } = require("date-fns")
const { v4: uuid } = require("uuid")
const fs = require("fs")
const fsPromises = require("fs").promises
const path = require("path")

const logEvents = async (message, fileLogName) => {
  const currentDate = format(new Date(), "MM/dd/yyy HH:MM:ss")
  const logItem = `Date & Time: ${currentDate}\nID: ${uuid()}\n${message}\n\n`

  if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
    await fsPromises.mkdir(path.join(__dirname, "..", "logs"))
  }
  await fsPromises.appendFile(
    path.join(__dirname, "..", "logs", fileLogName),
    logItem
  )
}

const logger = (req, res, next) => {
  logEvents(
    `Request Method: ${req.method}\nRequest Url: ${req.url}\nRequest Origin: ${req.headers.origin}`,
    "reqLog.log"
  )
  console.log(`${req.method} ${req.path}`)
  next()
}

module.exports = { logEvents, logger }
