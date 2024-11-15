import Editor from '@monaco-editor/react';
import { GraphQLSchema } from 'graphql';
import React from 'react';
import { Control } from 'react-hook-form';
// import ReactCodeMirror from '@uiw/react-codemirror';

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui';
import { useTheme } from '@/utils';

import { FormProps } from '../page';

export type FormInputProps = {
  control: Control<FormProps> | undefined;
  name: 'url' | 'body';
  placeholder: string;
  readOnly: boolean;
  className?: string;
  isGraphQl?: boolean;
  schema?: GraphQLSchema | null;
  height: string;
  language: 'json' | 'graphql';
};

export const FormBody: React.FC<FormInputProps> = ({
  control,
  name,
  language,
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
                defaultLanguage={language}
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
