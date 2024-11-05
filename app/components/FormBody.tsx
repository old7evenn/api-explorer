import React from 'react';
import { Control } from 'react-hook-form';
import { GraphQLSchema } from 'graphql';
import Editor from '@monaco-editor/react';
// import ReactCodeMirror from '@uiw/react-codemirror';

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui';
import { FormProps } from '../page';

import { useTheme } from '@/utils';

export type FormInputProps = {
  control: Control<FormProps> | undefined;
  setTextareaData: (value: string) => void;
  name: 'url' | 'body';
  placeholder: string;
  readOnly: boolean;
  className?: string;
  isGraphQl?: boolean;
  schema?: GraphQLSchema | null;
  height: string;
};

export const FormBody: React.FC<FormInputProps> = ({
  control,
  setTextareaData,
  name,
  placeholder,
  readOnly,
  className,
  height,
}) => {
  const { theme } = useTheme();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div
              className={`rounded-md overflow-hidden h-[${height}] flex justify-center items-center`}
            >
              <Editor
                {...field}
                height={height}
                value={field.value}
                defaultLanguage="graphql"
                onChange={value => setTextareaData(value ?? '')}
                defaultValue=""
                className={className}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
