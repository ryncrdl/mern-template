const { logEvents } = require("./logger")

const errorHanlder = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLog.log"
  )
  console.log(`${err.stack}`)

  const status = req.statusCode ? req.statusCode : 500
  res.status(status)
  res.json({ message: err.message, isError: true })
}

module.exports = errorHanlder
