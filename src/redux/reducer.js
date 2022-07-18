import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    auth: false,
    role: null,
    messages: [],
  },
  reducers: {
    login: (state, data) => {
      state.auth = data.payload;
    },
    setRole: (state, data) => {
      state.role = data.payload;
    },
    logout: (state) => {
      state.auth = false;
      state.role = null;
    },
    message: (state, data) => {
      state.messages = data.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout, setRole, message } = userSlice.actions;

export default userSlice.reducer;
