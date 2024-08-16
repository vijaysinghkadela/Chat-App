import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth";
import miscSlice from "./reducers/misc";
import api from "./api/api";

const store = configureStore({
  reducer: {
    // Add your other reducers here.
    [authSlice.name]: authSlice.reducer,
    [miscSlice.name]: miscSlice.reducer,
    [api.reducerPath]: api.reducer, 
  },
  middleware: (mid)=>[...mid(),api.middleware ],
});

export default store;
