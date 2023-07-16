import { format } from "date-fns"
import { selectCurrentToken } from "../features/auth/authSlice"
import { useSelector } from "react-redux"
import jwt_decode from "jwt-decode"
import useTitle from "../hooks/useTitle"

const DashWelcome = () => {
  useTitle("Dashboard")
  const currentDate = format(new Date(), "MMMM dd, yyyy | pp")
  const token = useSelector(selectCurrentToken)
  const jwtDecoded = jwt_decode(token)
  const { username } = jwtDecoded.UserInfo

  return (
    <section className="dash_welcome">
      <div>
        <h1>
          Welcome <span>{username}</span>🥳
        </h1>
        <p>Date Today | Current Time.</p>
        <p className="dateTime">{currentDate}</p>
      </div>
    </section>
  )
}

export default DashWelcome
