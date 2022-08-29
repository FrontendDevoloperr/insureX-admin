import { createSlice } from "@reduxjs/toolkit";

export const eventSlice = createSlice({
  name: "cases",
  initialState: [],
  reducers: {
    setCases: (state, { payload }) => {
      return payload;
    },
  },
});
export const { setCases } = eventSlice.actions;
export default eventSlice.reducer;
