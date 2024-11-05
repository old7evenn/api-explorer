'use client';
import { useRouter } from 'next/navigation';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { options } from '@/utils/constants';

interface SelectOption {
  value: string;
  label: string;
  color: string;
}

const SelectedOptionContext = createContext<{
  selectedOption: SelectOption | null;
  setSelectedOption: React.Dispatch<React.SetStateAction<SelectOption | null>>;
} | null>(null);

export const SelectedOptionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
    options[0]
  );
  const navigation = useRouter();
  useEffect(() => {
    // navigation.push('/?method=POST');
  }, []);

  return (
    <SelectedOptionContext.Provider
      value={{ selectedOption, setSelectedOption }}
    >
      {children}
    </SelectedOptionContext.Provider>
  );
};

export const useSelectedOption = () => {
  const context = useContext(SelectedOptionContext);

  if (!context) {
    throw new Error(
      'useSelectedOption must be used within a SelectedOptionProvider'
    );
  }

  return context;
};
