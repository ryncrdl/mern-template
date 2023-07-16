const userModel = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

//Start Login Function
const login = async (req, res) => {
  const { username, password } = req.body
  if (
    !username ||
    typeof username !== "string" ||
    !password ||
    typeof password !== "string"
  ) {
    return res.status(400).json({ message: "All fields are required." })
  }

  //find username
  const foundUser = await userModel
    .findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec() //exec - only get data and not save,add or delete data
  if (!foundUser || !foundUser.active) {
    return res.status(401).json({ message: "Unauthorized." })
  }

  //match user password
  const match = await bcrypt.compare(password, foundUser.password)
  if (!match) return res.status(401).json({ message: "Unauthorized." })

  //setup token
  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        role: foundUser.role, //use to protect specific routes
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m", // 10s for dev period, deployed - 15m
    }
  )

  const refreshToken = jwt.sign(
    { username: foundUser.username }, //only username for login session
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" } // 15s for dev period, deployed - 7 day (client requested)
  )

  //set Cookie
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })

  res.json({ accessToken }) // to access protected routes
}
//End of Login Function

//Start of Refresh Function
const refresh = (req, res) => {
  const cookies = req.cookies // get all cookies
  // get jwt cookies
  if (!cookies?.jwt) return res.status(403).json({ message: "Forbidden." }) // cookie expired

  const refreshToken = cookies.jwt

  //verify the cookie - cookie, cookie secret token , handler
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden." })

      const foundUser = await userModel
        .findOne({
          username: decoded.username,
        })
        .exec()
      // const foundUser = await userModel
      //   .findOne({ username: decoded.username })
      //   .exec()

      if (!foundUser) return res.status(401).json({ message: "Unauthorized." })

      //create new access token
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            role: foundUser.role,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      )

      res.json({ accessToken })
    }
  )
}
//End of Refresh Function

//Start of Logout function
const logout = (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204) // No jwt cookie

  //jwt cookie existing then clear this cookie
  res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" })

  res.json({ message: "Cookie has been cleared." })
}
//End of Logout Function

//Exports all module
module.exports = { login, refresh, logout }
