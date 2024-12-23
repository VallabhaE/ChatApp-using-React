import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    authUser: null,
    otherUsers: null,
    selectedUser: null,
    
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.authUser = action.payload; // Directly assign the payload to authUser
    },
    setOtherUsers: (state, action) => {
      state.otherUsers = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    
  },
});

export const { setAuthUser, setOtherUsers, setSelectedUser } =
  userSlice.actions;
export default userSlice.reducer;