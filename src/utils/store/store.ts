import { configureStore } from '@reduxjs/toolkit';
import GraphqlSlice from './slices/graphql-slices';
import RestSlice from './slices/rest-slices';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [GraphqlSlice.reducerPath]: GraphqlSlice.reducer,
      [RestSlice.reducerPath]: RestSlice.reducer,
    },
  });
};
