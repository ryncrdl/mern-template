import { useState, useEffect, useRef } from "react"
import { Outlet, Link } from "react-router-dom"
import usePersist from "../../hooks/usePersist"
import { selectCurrentToken } from "./authSlice"
import { useSelector } from "react-redux"
import { useRefreshMutation } from "./authApiSlice"

const PersistLogin = () => {
  const token = useSelector(selectCurrentToken)
  const [refresh, { isUninitialized, isSuccess, isLoading, isError, error }] =
    useRefreshMutation()
  const [persist] = usePersist()
  const effectRan = useRef()
  const [trueSuccess, setTrueSuccess] = useState(false)
  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV === "development") {
      //Strict Mode react 18 only happened in development mode
      const verifyingRefreshToken = async () => {
        console.log("verifying refresh token")
        try {
          //call refresh token
          await refresh()

          setTrueSuccess(true)
        } catch (error) {
          console.log(error)
        }
      }

      if (!token && persist) verifyingRefreshToken()
    }

    //clean up function
    return () => (effectRan.current = true)

    // eslint-disable-next-line
  }, [])

  let content
  if (!persist) {
    //no persist
    console.log("No persist")
    content = <Outlet />
  } else if (isLoading) {
    //persist: yes, token: no
    console.log("Loading...")
    content = <div className="dots"></div>
  } else if (isError) {
    //persist: yes, token: no
    console.log(`Error: ${error?.data?.message}`)
    content = (
      <>
        <p
          style={{
            color: "var(--color-8)",
            padding: "var(--form-padding)",
            background: "var(--color-7)",
          }}
        >
          {`${error?.data?.message} -  Please Try again `}
          <Link to="/" className="btn_login">
            Login
          </Link>
        </p>
      </>
    )
  } else if (isSuccess && trueSuccess) {
    //persist: yes, token: no
    console.log("Successfully login")
    content = <Outlet />
  } else if (token && isUninitialized) {
    //persist: yes, token: no
    console.log("Token and Uninitialized")
    console.log(isUninitialized)
    content = <Outlet />
  }

  return content
}

export default PersistLogin
