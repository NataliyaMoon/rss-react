import { configureStore } from '@reduxjs/toolkit';
import peopleReducer from './components/slices/peopleSlice';
import themeReducer from './components/slices/themeSlice';

export const store = configureStore({
  reducer: {
    people: peopleReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
