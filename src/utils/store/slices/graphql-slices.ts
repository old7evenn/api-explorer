import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { checkLastTuple } from '@/utils/features';

export type GraphqlSliceType = {
  headers: ChangeItem[];
  variables: ChangeItem[];
};

const initialState: GraphqlSliceType = {
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

const GraphqlSlice = createSlice({
  name: 'graphql-slice',
  initialState,
  reducers: {
    setGraphHeader(
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
    setGraphHistoryItems(state, action: PayloadAction<ChangeItem[]>) {
      state.headers = action.payload;
    },
  },
});

export const { setGraphHeader, setGraphHistoryItems } = GraphqlSlice.actions;

export default GraphqlSlice;
