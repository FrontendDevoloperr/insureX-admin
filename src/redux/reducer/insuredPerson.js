import { createSlice } from "@reduxjs/toolkit";

export const insuredPersonSlice = createSlice({
  name: "insuredPerson",
  initialState: {
    insuredPerson: [],
    loading: false,
    error: null,
  },
  reducers: {
    getInsuredPerson: (state, action) => {
      state.insuredPerson = action.payload;
    },
  },
});
export const { getInsuredPerson } = insuredPersonSlice.actions;
export default insuredPersonSlice.reducer;
