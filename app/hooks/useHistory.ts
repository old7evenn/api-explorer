import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { setHistoryItems } from '@/utils/store/slices/rest-slices';
import { History } from 'app/components/History';
import { FormProps } from 'app/page';

import { useSelectOption } from './useSelectOption';

export const useHistory = (formProps: UseFormReturn<FormProps>) => {
  const dispatch = useDispatch();
  const { handleSelect } = useSelectOption();
  const [history, setHistory] = useState<History[]>([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('history') || '[]');
    setHistory(savedHistory);
  }, []);

  const handleHistoryClick = (item: History) => {
    const { url, headers, value, method, variables } = item;
    formProps.setValue('body', value);
    formProps.setValue('url', url);
    handleSelect(item.method);
    dispatch(setHistoryItems({ headers, variables }));

    return { url, headers, value, method, variables };
  };

  const saveHistory = (newItem: History) => {
    const savedHistory = JSON.parse(localStorage.getItem('history') || '[]');

    const updatedHistory = [...savedHistory, newItem];
    localStorage.setItem('history', JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
  };

  return { history, saveHistory, handleHistoryClick };
};
