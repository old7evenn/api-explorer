import GraphqlSlice from '../store/slices/graphql-slices';
import { makeStore } from '../store/store';

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore['getState']>;

export type AppDispatch = AppStore['dispatch'];

export type GraphqlState = typeof GraphqlSlice.getInitialState;
