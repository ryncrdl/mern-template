import { useLoginMutation } from "./authApiSlice"
import { useDispatch } from "react-redux"
import { setCredentials } from "./authSlice"
import { useNavigate } from "react-router-dom"
import { useState, useRef } from "react"
import usePersist from "../../hooks/usePersist"
import useTitle from "../../hooks/useTitle"
const Auth = () => {
  useTitle("Login")
  const [login, { isLoading }] = useLoginMutation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [username, setUsername] = useState("")
  const [errMessage, setErrMessage] = useState("")
  const errRef = useRef()
  const [password, setPassword] = useState("")
  const [persist, setPersist] = usePersist()

  const onLoginHandler = async (e) => {
    e.preventDefault()

    try {
      const { accessToken } = await login({ username, password }).unwrap() //unwrap to handle error
      //set access token
      dispatch(setCredentials({ accessToken }))
      navigate("/dash")
    } catch (error) {
      if (!error.status) {
        setErrMessage("No server response.")
      } else if (error.status === 400) {
        setErrMessage("All fields are required.")
      } else if (error.status === 401) {
        setErrMessage("Incorrect username or Password")
      } else {
        setErrMessage(error?.data?.message)
      }
      errRef?.current?.focus()
    }
  }

  return (
    <main className="login_form">
      <h1>Login</h1>
      {!isLoading && (
        <form onSubmit={onLoginHandler}>
          <div className="username input_field">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              placeholder="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
              autoComplete="off"
              required
            />
          </div>
          <div className="password input_field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              autoComplete="off"
              required
            />
            {errMessage && (
              <p className="errMessage" ref={errRef} aria-live="assertive">
                {errMessage}
              </p>
            )}
          </div>
          <label id="persist" className="trust_device">
            <input
              type="checkbox"
              id="persist"
              checked={persist}
              onChange={() => setPersist((prev) => !prev)}
            />
            Trust this device.
          </label>

          <button className="btn_login">Login</button>
        </form>
      )}
    </main>
  )
}

export default Auth
