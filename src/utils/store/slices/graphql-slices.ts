import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { checkLastTuple } from '@/utils/features';

export type GraphqlSliceType = {
  url: string;
  urlDoc: string;
  query: string;
  schema: string;
  isTrySchemaDownload: boolean;
  headers: ChangeVariableItem[];
  variables: string;
};

const initialState: GraphqlSliceType = {
  url: '',
  urlDoc: '',
  query: '',
  schema: '',
  isTrySchemaDownload: false,
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
  variables: '',
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

      const filteredHeaders = state.headers.filter(
        header => header.key || header.value
      );

      state.headers = checkLastTuple(filteredHeaders);
    },
  },
});

export const { setGraphHeader } = GraphqlSlice.actions;

export default GraphqlSlice;
