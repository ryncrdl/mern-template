import { selectCurrentToken } from "../features/auth/authSlice"
import { useSelector } from "react-redux"
import jwt_decode from "jwt-decode"

const useAuth = () => {
  const token = useSelector(selectCurrentToken)
  let isManager = false
  let isAdmin = false
  let status = "Employee"

  if (token) {
    const decoded = jwt_decode(token)
    const { username, role } = decoded.UserInfo

    isManager = role === "Manager"
    isAdmin = role === "Admin"

    if (isManager) status = "Manager"
    if (isAdmin) status = "Admin"

    return { username, role, isManager, isAdmin, status }
  }

  return { username: "", role: "", isManager, isAdmin, status }
}

export default useAuth
