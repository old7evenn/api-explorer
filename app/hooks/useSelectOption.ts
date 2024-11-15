import { useRouter } from 'next/navigation';

import { useEffect } from 'react';

import { Method, options } from '@/utils/constants';
import { useSelectedOption } from 'app/components/SelectMethodsProvider';

export const useSelectOption = () => {
  const { selectedOption, setSelectedOption } = useSelectedOption();
  const router = useRouter();

  const handleSelect = (method: Method) => {
    const option = options.find(option => option.label === method);

    if (option) {
      setSelectedOption(option);
      router.push(`/?method=${method}`);
    }
  };

  useEffect(() => {
    const foundOption = options.find(
      option => option.label === selectedOption?.label
    );

    if (foundOption) {
      handleSelect(foundOption.label);
    }
  }, [handleSelect]);

  return { selectedOption, handleSelect };
};
