import { Routes, Route } from "react-router-dom"
import DashLayout from "./components/DashLayout"
import Layout from "./components/Layout"
import Welcome from "./components/Welcome"
import Login from "./features/auth/Login"
import NoteList from "./features/notes/NoteList"
import UserList from "./features/users/UserList"
import DashWelcome from "./components/DashWelcome"
import NoteView from "./features/notes/NoteView"
import NoteAdd from "./features/notes/NoteAdd"
import Prefetch from "./features/auth/Prefetch"
import UserAdd from "./features/users/UserAdd"
import UserView from "./features/users/UserView"
import PersistLogin from "./features/auth/PersistLogin"
import RequireAuth from "./features/auth/RequireAuth"
import { Roles } from "./config/Roles"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Welcome />} />
          <Route path="auth" element={<Login />} />
        </Route>
        <Route element={<PersistLogin />}>
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(Roles)]} />}
          >
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>
                <Route index element={<DashWelcome />} />

                <Route path="notes">
                  <Route index element={<NoteList />} />
                  <Route path=":id" element={<NoteView />} />
                  <Route path="new" element={<NoteAdd />} />
                </Route>

                <Route
                  element={
                    <RequireAuth allowedRoles={[Roles.Manager, Roles.Admin]} />
                  }
                >
                  <Route path="users">
                    <Route index element={<UserList />} />
                    <Route path=":id" element={<UserView />} />
                    <Route path="new" element={<UserAdd />} />
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App
