import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { setGraphHistoryItems } from '@/utils/store/slices/graphql-slices';
import { FormProps } from 'app/graphql/page';

export interface GraphHistory {
  url: string;
  value: string;
  headers: ChangeItem[];
}

export const useGraphHistory = (formProps: UseFormReturn<FormProps>) => {
  const dispatch = useDispatch();
  const [history, setHistory] = useState<GraphHistory[]>([]);

  useEffect(() => {
    const savedHistory = JSON.parse(
      localStorage.getItem('graph-history') || '[]'
    );
    setHistory(savedHistory);
  }, []);

  const handleHistoryClick = (item: GraphHistory) => {
    const { url, headers, value } = item;
    formProps.setValue('body', value);
    formProps.setValue('url', url);
    dispatch(setGraphHistoryItems(headers));

    return { url, headers, value };
  };

  const saveHistory = (newItem: GraphHistory) => {
    const savedHistory = JSON.parse(
      localStorage.getItem('graph-history') || '[]'
    );

    const updatedHistory = [newItem, ...savedHistory];
    localStorage.setItem('graph-history', JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
  };

  return { history, saveHistory, handleHistoryClick };
};
