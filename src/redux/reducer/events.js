import { createSlice } from "@reduxjs/toolkit";

export const eventSlice = createSlice({
  name: "event",
  initialState: [],
  reducers: {
    setEvents: (state, { payload }) => {
      return payload;
    },
  },
});
export const { setEvents } = eventSlice.actions;
export default eventSlice.reducer;
