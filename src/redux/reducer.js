import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    auth: false,
    role: null,
    messages: [],
    insurance_company: {},
    appraisal_company: {},
    read_messages: false,
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
      state.messages = [...state.messages, ...data.payload];
    },
    newMessage: (state, data) => {
      state.read_messages = data.payload;
    },
    oldMessage: (state) => {
      state.read_messages = false;
    },
    isAppraisalCompany: (state, data) => {
      state.appraisal_company = data.payload;
    },
    isInsuranceCompany: (state, data) => {
      state.insurance_company = data.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  login,
  logout,
  setRole,
  message,
  newMessage,
  oldMessage,
  isAppraisalCompany,
  isInsuranceCompany,
} = userSlice.actions;

export default userSlice.reducer;
