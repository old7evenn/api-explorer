'use client';
import { useRouter } from 'next/navigation';

import React, { useEffect, useRef, useState } from 'react';

import { options } from '@/utils/constants';

import { useSelectedOption } from './SelectMethodsProvider';

interface SelectOption {
  value: string;
  label: string;
  color: string;
}

export const SelectMethods = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedOption, setSelectedOption } = useSelectedOption();
  const selectRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleClickOutside = (event: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    router.push(`/?method=${selectedOption?.label}`);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: SelectOption) => {
    setSelectedOption(option);
    setIsOpen(false);

    router.push(`/?method=${option.label}`);
  };

  return (
    <div ref={selectRef} className="relative">
      <div
        className={`bg-border p-2 px-5 rounded-l-md font-medium text-${selectedOption?.color} cursor-pointer ${selectedOption?.color}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption?.label}
      </div>
      {isOpen && (
        <div className="absolute w-full bg-border rounded-md mt-1 z-10">
          {options.map(option => (
            <div
              key={option.value}
              className={`p-2 cursor-pointer ${option.color} hover:opacity-70 transition-colors duration-150 font-medium`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
