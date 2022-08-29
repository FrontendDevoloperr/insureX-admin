import { createSlice } from "@reduxjs/toolkit";

export const appraiserCompaniesSlice = createSlice({
  name: "appraiserCompanies",
  initialState: [],
  reducers: {
    getAppraiserCompanies: (state, { payload }) => {
      return payload;
    },
  },
});
export const { getAppraiserCompanies } = appraiserCompaniesSlice.actions;
export default appraiserCompaniesSlice.reducer;
