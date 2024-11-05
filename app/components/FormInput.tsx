import { HTMLInputTypeAttribute } from 'react';
import { Control } from 'react-hook-form';

import { FormProps } from '../page';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  inputVariants,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import { VariantProps } from 'class-variance-authority';

export interface FormInputProps extends VariantProps<typeof inputVariants> {
  control?: Control<FormProps> | undefined;
  name: 'url' | 'body' | 'key' | 'value';
  placeholder: string;
  type?: HTMLInputTypeAttribute;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormInput: React.FC<FormInputProps> = ({
  control,
  name,
  placeholder,
  type,
  className,
  variant,
  value,
  onChange,
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormControl>
          <Input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            autoCapitalize="none"
            value={value}
            className={cn('py-2 mb-0', className)}
            onChange={e => {
              field.onChange(e);
              if (onChange) onChange(e);
            }}
            variant={variant}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
