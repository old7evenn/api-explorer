import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { checkLastTuple } from '@/utils/features';

export type RestSlice = {
  headers: ChangeItem[];
  variables: ChangeItem[];
};

const initialState: RestSlice = {
  headers: [
    {
      key: 'Content-type',
      value: 'application/json',
    },
    {
      key: '',
      value: '',
    },
  ],
  variables: [
    {
      key: '',
      value: '',
    },
  ],
};

const RestSlice = createSlice({
  name: 'rest-slice',
  initialState,
  reducers: {
    setRestHeader(
      state,
      action: PayloadAction<{
        index: number;
        keyOrValue: 'key' | 'value';
        newValue: string;
      }>
    ) {
      const { index, keyOrValue, newValue } = action.payload;
      state.headers[index][keyOrValue] = newValue;

      const filteredItems = state.headers.filter(
        header => header.key || header.value
      );

      state.headers = checkLastTuple(filteredItems);
    },
    setRestVariables(
      state,
      action: PayloadAction<{
        index: number;
        keyOrValue: 'key' | 'value';
        newValue: string;
      }>
    ) {
      const { index, keyOrValue, newValue } = action.payload;
      state.variables[index][keyOrValue] = newValue;

      const filteredItems = state.variables.filter(
        variable => variable.key || variable.value
      );

      state.variables = checkLastTuple(filteredItems);
    },
    setHistoryItems(state, action: PayloadAction<RestSlice>) {
      state.headers = action.payload.headers;
      state.variables = action.payload.variables;
    },
  },
});

export const { setRestHeader, setRestVariables, setHistoryItems } =
  RestSlice.actions;

export default RestSlice;
