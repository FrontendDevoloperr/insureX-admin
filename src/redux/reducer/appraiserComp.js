import { createSlice } from "@reduxjs/toolkit";

export const appraiserCompaniesSlice = createSlice({
  name: "appraiserCompanies",
  initialState: {
    appraiserCompanies: [],
    loading: false,
    error: null,
  },
  reducers: {
    getAppraiserCompanies: (state, action) => {
      state.appraiserCompanies = action.payload;
    },
  },
});
export const { getAppraiserCompanies } = appraiserCompaniesSlice.actions;
export default appraiserCompaniesSlice.reducer;
