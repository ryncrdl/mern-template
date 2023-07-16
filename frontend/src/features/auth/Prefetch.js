import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { store } from "../../App/store"
import { notesApiSlice } from "../notes/notesApiSlice"
import { usersApiSlice } from "../users/usersApiSlice"

const Prefetch = () => {
  useEffect(() => {
    console.log("Subscribing...")

    // const notes = store.dispatch(notesApiSlice.endpoints.getNotes.initiate());
    // const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate());

    // return () => {
    //   console.log('Unsubscribing...');
    //   notes.unsubscribe();
    //   users.unsubscribe();
    // };

    store.dispatch(
      notesApiSlice.util.prefetch("getNotes", "noteslist", { force: true })
    )
    store.dispatch(
      usersApiSlice.util.prefetch("getUsers", "userslist", { force: true })
    )
  }, [])

  return <Outlet />
}

export default Prefetch
