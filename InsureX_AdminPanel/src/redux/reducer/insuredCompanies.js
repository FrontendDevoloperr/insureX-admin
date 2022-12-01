import { createSlice } from "@reduxjs/toolkit";

export const insuredCompaniesSlice = createSlice({
  name: "insuredCompanies",
  initialState: {
    insuredCompanies: [],
    loading: false,
    error: null,
  },
  reducers: {
    getInsuredCompanies: (state, action) => {
      state.insuredCompanies = action.payload;
    },
  },
});
export const { getInsuredCompanies } = insuredCompaniesSlice.actions;
export default insuredCompaniesSlice.reducer;
