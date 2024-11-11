'use client';
import { createContext, useContext, useState } from 'react';

import { options, SelectOption } from '@/utils/constants';

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
