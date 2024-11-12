'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { GraphQLSchema as TSchema } from 'graphql';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as zod from 'zod';

import { Button } from '@/components/ui';
import {
  getGraphSchema,
  getGraphSchemaOnServer,
  parseResponseData,
  sendRequestGraphql,
} from '@/utils/graphql';
import { RootState } from '@/utils/models';
import { useAppSelector } from '@/utils/store/hooks';
import { setGraphHeader } from '@/utils/store/slices/graphql-slices';

import { FormBody } from '../components/FormBody';
import { FormInput } from '../components/FormInput';
import { HeaderRequest } from '../components/HeaderRequest';
import { Response } from '../components/Response';
import { TabList } from '../components/TabList';

export interface FormProps {
  url: string;
  body: string;
}

const formSchemaGraphql = zod.object({
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
    resolver: zodResolver(formSchemaGraphql),
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
      <HeaderRequest
        sliceKey="graphql-slice"
        setHeader={setGraphHeader}
        field="headers"
      />
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
      <form
        onSubmit={formProps.handleSubmit(onSubmit)}
        className="min-h-[60vh] flex flex-col justify-between"
      >
        <div>
          <div className="flex w-full mb-4">
            <div className="flex-1">
              <FormInput
                control={formProps.control}
                name="url"
                placeholder="https://example.com"
                type="text"
                className="rounded-r-none"
              />
            </div>
            <Button className="border rounded-l-none" type="submit">
              SEND
            </Button>
          </div>
          <TabList contentList={contentList} tabList={tabList} />
        </div>
        <div className="sm:grid block grid-cols-2 gap-4 items-center">
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
