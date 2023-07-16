const jwt = require("jsonwebtoken")

const verifyJWT = (req, res, next) => {
  const authHeaders = req.headers.authorization || req.headers.Authorization
  if (!authHeaders?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized." })
  }

  const token = authHeaders.split(" ")[1]

  //verify token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden." })
    }

    req.username = decoded.UserInfo.username
    req.role = decoded.UserInfo.role

    next()
  })
}

module.exports = verifyJWT
