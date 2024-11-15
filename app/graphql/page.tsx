'use client';
import { HistoryOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { GraphQLSchema as TSchema } from 'graphql';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as zod from 'zod';

import { Button } from '@/components/ui';
import { processResponseData } from '@/utils/features';
import {
  getGraphSchema,
  getGraphSchemaOnServer,
  sendRequestGraphql,
} from '@/utils/graphql';
import { RootState } from '@/utils/models';
import { useAppSelector } from '@/utils/store/hooks';
import { setGraphHeader } from '@/utils/store/slices/graphql-slices';
import { History } from 'app/components/History';
import { useGraphHistory } from 'app/hooks';

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
  const formProps = useForm<FormProps>({
    resolver: zodResolver(formSchemaGraphql),
    defaultValues: {
      url: '',
      body: '',
    },
  });
  const headers = useAppSelector(
    (state: RootState) => state['graphql-slice'].headers
  );
  const { saveHistory, handleHistoryClick, history } =
    useGraphHistory(formProps);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);
  const [schema, setSchema] = useState<TSchema | null>(null);
  const [res, setRes] = useState<HttpResponse>({
    data: '',
    status: 0,
    statusText: '',
    parsedHeaders: {},
    success: false,
    responseTime: 0,
  });

  const getGraphQLIntrospection = async (url: string) => {
    getGraphSchemaOnServer(url)
      .then(introspectionJSON => {
        const schema = getGraphSchema(introspectionJSON);
        setSchema(schema);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const onSubmit = async (data: FormProps) => {
    const { url, body } = data;

    setLoading(true);

    try {
      await getGraphQLIntrospection(url);

      const res = await sendRequestGraphql({ url, body, headers });

      if (res) {
        setRes(res);
      }

      saveHistory({ url, body, headers });

      setData(processResponseData(res));
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
        className="h-[80vh] flex flex-col justify-between"
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
            <Button className="border mr-4 rounded-l-none" type="submit">
              SEND
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(true)}
            >
              <HistoryOutlined />
            </Button>
          </div>
          <TabList contentList={contentList} tabList={tabList} />
        </div>
        <div className="sm:grid block grid-cols-2 gap-4 items-center">
          <div className="mt-2">
            Body
            <FormBody
              control={formProps.control}
              name="body"
              readOnly={false}
              placeholder='{"key": "value"}'
              className="mt-2 rounded"
              height="230px"
              language="graphql"
            />
          </div>
          <Response data={data} loading={loading} res={res} />
        </div>
      </form>
      <History
        history={history}
        onClose={setIsOpen}
        onHistory={handleHistoryClick}
        isOpen={isOpen}
      />
    </FormProvider>
  );
};

export default GraphQl;
