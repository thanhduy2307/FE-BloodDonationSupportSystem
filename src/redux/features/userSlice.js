import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, actions) => {
      return actions.payload;
    },

    logout: () => {
      return initialState;
    },
          updateUser: (state, action) => {
      state.currentUser = action.payload;
    },

    
  },
});

// Action creators are generated for each case reducer function
export const { login, logout, updateUser } = userSlice.actions;

export default userSlice.reducer;
