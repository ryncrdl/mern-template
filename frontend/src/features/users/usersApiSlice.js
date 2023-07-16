import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../App/api/apiSlice"

const usersAdapter = createEntityAdapter({})
const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: "users",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      //keepUnusedDataFor: 5, //default 60s,
      transformResponse: (responseData) => {
        const loadedUsers = responseData.map((user) => {
          user.id = user._id
          return user
        })
        return usersAdapter.setAll(initialState, loadedUsers)
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "User", id: "LIST" },
            ...result.ids.map((id) => ({
              type: "User",
              id,
            })),
          ]
        } else {
          return [{ type: "User", id: "LIST" }]
        }
      },
    }),

    addNewUser: builder.mutation({
      query: ({ username, password, role }) => ({
        url: "/users",
        method: "POST",
        body: { username, password, role },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),

    updateUser: builder.mutation({
      query: (initialState) => ({
        url: "/users",
        method: "PATCH",
        body: { ...initialState },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),

    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: "/users",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice

//query result to object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data // normalized object with ids and entities
)

export const {
  selectAll: selectUsers,
  selectById: selectUserById,
  selectByIds: selectUserByIds,
} = usersAdapter.getSelectors((state) => selectUsersData(state) ?? initialState)
