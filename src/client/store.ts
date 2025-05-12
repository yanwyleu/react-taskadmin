import taskSlice from './features/tasks/task.slice';
import { configureStore } from '@reduxjs/toolkit';
import { tasksApi } from './services/apis';
import { setupListeners } from '@reduxjs/toolkit/query';
// src/app/store.ts

const store = configureStore({
  reducer: {
    // Add the API reducer here
    [tasksApi.reducerPath]: tasksApi.reducer,
    'tasks': taskSlice,
  },
  // Adding the api middleware allows caching, invalidation, polling, and other features of RTK Query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(tasksApi.middleware),
});
setupListeners(store.dispatch);

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;