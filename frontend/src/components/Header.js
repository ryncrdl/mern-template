import { Link, useLocation } from "react-router-dom"

const Header = () => {
  const { pathname } = useLocation()
  let btn_login

  if (pathname === "/") {
    btn_login = (
      <Link to="auth" className="btn_login">
        Login
      </Link>
    )
  }

  return (
    <header className="header">
      <Link to="/" className="logo">
        Note Manager
      </Link>
      {btn_login}
    </header>
  )
}

export default Header
