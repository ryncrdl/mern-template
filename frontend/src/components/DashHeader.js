import { useNavigate, useLocation } from "react-router-dom"
import { useSendLogoutMutation } from "../features/auth/authApiSlice"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import useAuth from "../hooks/useAuth"

// const regexDash = /^\/dash(\/)?$/;
// const regexNotes = /^\/dash\/notes(\/)?$/;
// const regexUsers = /^\/dash\/users(\/)?$/;

const DashHeader = () => {
  const { isManager, isAdmin } = useAuth()

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation()

  useEffect(() => {
    if (isSuccess) navigate("/")
  }, [isSuccess, navigate])

  const logoutButton = (
    <button className="btn_logout" title="Logout" onClick={sendLogout}>
      {isLoading ? "Logging out" : "Logout"}
    </button>
  )

  const [show, setShow] = useState(false)
  return (
    <header className="header dash_header">
      <Link to="/dash" className="logo">
        Note Manager
      </Link>

      <button className="btn_nav" onClick={() => setShow(!show)}></button>
      <div
        className="nav-container"
        id="nav-display"
      >
        <nav>
          <ul>
            <li>
              <Link
                to="notes"
                className={pathname === "/dash/notes" ? "active" : ""}
              >
                Note List
              </Link>
            </li>
            {(isManager || isAdmin) && (
              <li>
                <Link
                  to="users"
                  className={pathname === "/dash/users" ? "active" : ""}
                >
                  User List
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {logoutButton}
      </div>

      {isError && <p className="errMessage">{error?.data?.message}</p>}
    </header>
  )
}

export default DashHeader
