import useAuth from "../hooks/useAuth"

const DashFooter = () => {
  const { username, status } = useAuth()
  return (
    <footer className="dash_footer">
      <p>
        Current User: <span>{username}</span>
      </p>
      <p>
        Current Role: <span>{status}</span>
      </p>
    </footer>
  )
}

export default DashFooter
