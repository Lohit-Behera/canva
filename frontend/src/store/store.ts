import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "@/features/UserSlice";
import FormSlice from "@/features/FormSlice";

const store = configureStore({
  reducer: {
    user: UserSlice,
    form: FormSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
