import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth";

const store = configureStore({
  reducer: {
      // Add your other reducers here.
    [authSlice.name]: authSlice.reducer,
  },  
});

export default store;
