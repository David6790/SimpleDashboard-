import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hasNotification: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setHasNotification: (state, action) => {
      state.hasNotification = action.payload;
    },
  },
});

export const { setHasNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
