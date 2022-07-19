import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    auth: false,
    role: null,
    messages: [],
    insurance_company: {
      account_id: "insureX",
      address: "adsdsadsa",
      email: "frilansicon@yandex.ru",
      id: 76,
      ie_number: 3231231,
      phone: "998907972434",
      title: "insureX Client",
      user_id: 882,
    },
    appraisal_company: {
      appraisal_company_name: "farikCompany",
      city_id: 202,
      email: "9999999999999999@gmail.com",
      id: 64,
      insurance_company_ids: [77],
      oao_ie_number: 1454235324,
      office_address: "Namangan",
      phone: "2323232111",
      region_id: 1,
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
