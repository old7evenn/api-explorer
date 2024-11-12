import React from 'react';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '@/utils/store/hooks';
import GraphqlSlice from '@/utils/store/slices/graphql-slices';
import RestSlice from '@/utils/store/slices/rest-slices';
import type { RestSlice as RestSliceType } from '@/utils/store/slices/rest-slices';

import { FormInput } from './FormInput';

export interface HeaderRequestProps {
  sliceKey: 'graphql-slice' | 'rest-slice';
  setHeader:
    | typeof RestSlice.actions.setRestHeader
    | typeof GraphqlSlice.actions.setGraphHeader
    | typeof RestSlice.actions.setRestVariables;
  field: keyof RestSliceType;
}

export const HeaderRequest: React.FC<HeaderRequestProps> = ({
  sliceKey,
  setHeader,
  field,
}) => {
  const dispatch = useDispatch();
  const fields = useAppSelector(state => state[sliceKey][field]);

  const handleInputChange = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    dispatch(setHeader({ index, keyOrValue: field, newValue: value }));
  };

  return (
    <div className="sm:h-40 h-30 overflow-auto">
      {fields.map((item, index) => (
        <div key={index} className="grid grid-cols-2 gap-4 my-2 items-center">
          <div>
            <FormInput
              name="key"
              placeholder="key"
              type="text"
              value={item.key}
              onChange={e => handleInputChange(index, 'key', e.target.value)}
              variant="underline"
            />
          </div>
          <div>
            <FormInput
              name="value"
              placeholder="value"
              type="text"
              value={item.value}
              onChange={e => handleInputChange(index, 'value', e.target.value)}
              variant="underline"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
