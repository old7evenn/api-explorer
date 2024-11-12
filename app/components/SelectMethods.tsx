'use client';
import { useRouter } from 'next/navigation';

import React, { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui';
import { options } from '@/utils/constants';
import { useSelectOption } from 'app/hooks';

export const SelectMethods = () => {
  const { selectedOption, handleSelect } = useSelectOption();
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <div ref={selectRef} className="relative sm:text-sm text-xs">
      <Button
        className={`rounded-r-none bg-border hover:bg-border hover:opacity-80 text-${selectedOption?.color} cursor-pointer ${selectedOption?.color}`}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {selectedOption?.label}
      </Button>
      {isOpen && (
        <div className="absolute w-full bg-border rounded-md mt-1 z-10">
          {options.map((option, index) => (
            <div
              key={index}
              className={`p-2 cursor-pointer ${option.color} hover:opacity-70 transition-colors duration-150 font-medium`}
              onClick={() => {
                handleSelect(option.label);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
