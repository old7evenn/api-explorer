import { checkLastTuple } from '@/utils/features';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type RestSliceType = {
  url: string;
  query: string[][];
  body: string;
  method: string;
  headers: ChangeVariableItem[];
  variables: string[][];
  textMode: boolean;
};

const initialState: RestSliceType = {
  url: '',
  query: [['', '']],
  body: '',
  method: 'GET',
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
  variables: [['', '']],
  textMode: false,
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

      const filteredHeaders = state.headers.filter(
        header => header.key || header.value
      );

      state.headers = checkLastTuple(filteredHeaders);
    },
  },
});

export const { setRestHeader } = RestSlice.actions;

export default RestSlice;
