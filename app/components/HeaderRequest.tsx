import React from 'react';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '@/utils/store/hooks';
import GraphqlSlice from '@/utils/store/slices/graphql-slices';
import RestSlice from '@/utils/store/slices/rest-slices';

import { FormInput } from './FormInput';

export interface HeaderRequestProps {
  sliceKey: 'graphql-slice' | 'rest-slice';
  setHeader:
    | typeof RestSlice.actions.setRestHeader
    | typeof GraphqlSlice.actions.setGraphHeader;
}

export const HeaderRequest: React.FC<HeaderRequestProps> = ({
  sliceKey,
  setHeader,
}) => {
  const dispatch = useDispatch();
  const headers = useAppSelector(state => state[sliceKey].headers);

  const handleInputChange = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    dispatch(setHeader({ index, keyOrValue: field, newValue: value }));
  };

  return (
    <div className="h-40 overflow-auto">
      {headers.map((header, index) => (
        <div key={index} className="grid grid-cols-2 gap-4 my-2 items-center">
          <div>
            <FormInput
              name="key"
              placeholder="key"
              type="text"
              value={header.key}
              onChange={e => handleInputChange(index, 'key', e.target.value)}
              variant="underline"
            />
          </div>
          <div>
            <FormInput
              name="value"
              placeholder="value"
              type="text"
              value={header.value}
              onChange={e => handleInputChange(index, 'value', e.target.value)}
              variant="underline"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
