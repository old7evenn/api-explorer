'use client';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { GraphQLSchema as TSchema } from 'graphql';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

import { TabList } from '../components/TabList';
import { FormInput } from '../components/FormInput';
import { FormBody } from '../components/FormBody';
import { Response } from '../components/Response';
import { HeaderRequest } from '../components/HeaderRequest';
import { Button } from '@/components/ui';

import {
  getGraphSchema,
  getGraphSchemaOnServer,
  parseResponseData,
  sendRequestGraphql,
} from '@/utils/graphql';
import { setGraphHeader } from '@/utils/store/slices/graphql-slices';
import { useAppDispatch, useAppSelector } from '@/utils/store/hooks';
import { RootState } from '@/utils/models';

export interface FormProps {
  url: string;
  body: string;
}

export const formSchema = zod.object({
  url: zod.string().url({ message: 'Invalid URL' }),
  body: zod.string().optional(),
});

const GraphQl = () => {
  const headers = useAppSelector(
    (state: RootState) => state['graphql-slice'].headers
  );

  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const [schema, setSchema] = useState<TSchema | null>(null);
  const [res, setRes] = useState<HttpResponse>({
    data: '',
    status: 0,
    statusText: '',
    parsedHeaders: {},
    success: false,
    responseTime: 0,
  });

  const formProps = useForm<FormProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      body: '',
    },
  });

  const getGraphQLIntrospection = async (url: string) => {
    getGraphSchemaOnServer(url)
      .then(introspectionJSON => {
        const schema = getGraphSchema(introspectionJSON);
        setSchema(schema);
        console.log(schema);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const onSubmit = async (data: FormProps) => {
    const { url } = data;

    setLoading(true);

    try {
      await getGraphQLIntrospection(url);

      const res = await sendRequestGraphql({ url, value, headers });

      console.log(res);

      if (res) {
        setRes(res);
      }

      setData(parseResponseData(res));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const contentList: Record<string, React.ReactNode> = {
    header: (
      <HeaderRequest sliceKey="graphql-slice" setHeader={setGraphHeader} />
    ),
  };

  const tabList = [
    {
      key: 'header',
      label: 'Header',
    },
  ];

  return (
    <FormProvider {...formProps}>
      <form onSubmit={formProps.handleSubmit(onSubmit)}>
        <div className="flex w-full mb-4">
          <div className="flex-1">
            <FormInput
              control={formProps.control}
              name="url"
              placeholder="https://example.com"
              type="text"
            />
          </div>
          <Button className="border rounded-l-none" type="submit">
            SEND
          </Button>
        </div>
        <TabList contentList={contentList} tabList={tabList} />
        <div className="grid grid-cols-2 gap-4 items-center">
          <div className="mt-2">
            Body
            <FormBody
              control={formProps.control}
              setTextareaData={setValue}
              name="body"
              readOnly={false}
              placeholder='{"key": "value"}'
              className="mt-2 rounded"
              height="230px"
            />
          </div>
          <Response data={data} loading={loading} res={res} />
        </div>
      </form>
    </FormProvider>
  );
};

export default GraphQl;
