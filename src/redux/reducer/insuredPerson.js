import { createSlice } from "@reduxjs/toolkit";

export const insuredPersonSlice = createSlice({
  name: "insuredPerson",
  initialState: [],
  reducers: {
    getPersons: (state, { payload }) => {
      return payload;
    },
  },
});
export const { getPersons } = insuredPersonSlice.actions;
export default insuredPersonSlice.reducer;
