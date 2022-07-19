import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    auth: false,
    role: null,
    messages: [],
    insurance_company: {
      account_id: "CompanyKKK",
      address: "Namangan",
      email: "frilansicon@yandex.ru",
      id: 77,
      ie_number: 1234567,
      phone: "2323232",
      title: "CompanyKKK",
      user_id: 883,
    },
    appraisal_company: {
      appraisal_company_name: "חברתמאות מגדל1",
      city_id: 208,
      email: "ulugbekmirdadayev1211@gmail.com",
      id: 66,
      insurance_company_ids: [77],
      oao_ie_number: 3255,
      office_address: "בני בר",
      phone: "23454",
      region_id: 5,
    },
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
      state.messages = data.payload;
    },
    newMessage: (state) => {
      state.read_messages = true;
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
