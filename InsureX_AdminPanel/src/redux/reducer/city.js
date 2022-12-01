import { createSlice } from "@reduxjs/toolkit";

export const citySlice = createSlice({
  name: "city",
  initialState: {
    city: [],
    loading: false,
    error: null,
  },
  reducers: {
    getCity: (state, action) => {
      state.city = action.payload;
    },
  },
});
export const { getCity } = citySlice.actions;
export default citySlice.reducer;
