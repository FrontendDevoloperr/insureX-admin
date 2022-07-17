import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    auth: true,
    role: 'appraisal_company',
  },
  reducers: {
    login: (state, payload) => {
      state.auth = payload.payload;
    },
    setRole: (state, payload) => {
      state.role = payload.payload;
    },
    logout: (state) => {
      state.auth = false;
      state.role = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout, setRole } = userSlice.actions;

export default userSlice.reducer;
