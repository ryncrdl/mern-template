import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../App/api/apiSlice"

const notesAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1, //not completed to completed
})
const initialState = notesAdapter.getInitialState()

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: () => ({
        url: "/notes",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      // keepUnusedDataFor: 5, dafault 60s
      transformResponse: (responseData) => {
        if (responseData) {
          const loadedNotes = responseData.map((note) => {
            note.id = note._id
            return note
          })
          return notesAdapter.setAll(initialState, loadedNotes)
        }
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Note", id: "LIST" },
            ...result.ids.map((id) => ({
              type: "Note",
              id,
            })),
          ]
        } else {
          return [{ type: "Note", id: "LIST" }]
        }
      },
    }),
    addNewNote: builder.mutation({
      query: ({ title, text, user }) => ({
        url: "/notes",
        method: "POST",
        body: { title, text, user },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Note", id: arg.id }],
    }),
    updateNote: builder.mutation({
      query: ({ id, user, title, text, completed }) => ({
        url: "/notes",
        method: "PATCH",
        body: { id, user, title, text, completed },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Note", id: arg.id }],
    }),
    deleteNote: builder.mutation({
      query: ({ id }) => ({
        url: "/notes",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Note", id: arg.id }],
    }),
  }),
})

//destructuring
export const {
  useGetNotesQuery,
  useAddNewNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApiSlice

//query result to object
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select()

// creates memoized selector to normalize data
const selectNotesData = createSelector(
  selectNotesResult,
  (notesResult) => notesResult.data // normalized object with ids and entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectNotes,
  selectById: selectNoteById,
  selectByIds: selectNoteByIds,
  // Pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors((state) => selectNotesData(state) ?? initialState)
