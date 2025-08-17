import { configureStore } from '@reduxjs/toolkit';
import { swapiApi } from './src/services/swapiApi';
import themeReducer from './components/slices/themeSlice';
import peopleReducer from './components/slices/peopleSlice';

export const store = configureStore({
  reducer: {
    [swapiApi.reducerPath]: swapiApi.reducer,
    people: peopleReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(swapiApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
