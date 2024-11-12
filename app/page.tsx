'use client';
import { useSearchParams } from 'next/navigation';

import { HistoryOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as zod from 'zod';

import { Button } from '@/components/ui';
import { Method } from '@/utils';
import { filteredItems } from '@/utils/features';
import { RootState } from '@/utils/models/store-types';
import { processResponseData, sendRequest } from '@/utils/rest/send-request';
import { useAppSelector } from '@/utils/store/hooks';
import {
  setRestHeader,
  setRestVariables,
} from '@/utils/store/slices/rest-slices';

import { FormBody } from './components/FormBody';
import { FormInput } from './components/FormInput';
import { HeaderRequest } from './components/HeaderRequest';
import { History } from './components/History';
import { Response } from './components/Response';
import { SelectMethods } from './components/SelectMethods';
import { TabList } from './components/TabList';
import { useHistory } from './hooks';

const formSchemaRestAPi = zod.object({
  url: zod.string().url({ message: 'Invalid URL' }),
  body: zod.string().optional(),
});

export interface FormProps {
  url: string;
  body: string;
  key?: string;
  value?: string;
}

export default function Exploits() {
  const formProps = useForm<FormProps>({
    resolver: zodResolver(formSchemaRestAPi),
    defaultValues: {
      url: '',
      body: '',
    },
  });
  const [data, setData] = useState('');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { history, saveHistory, handleHistoryClick } = useHistory(formProps);
  const { headers, variables } = useAppSelector(
    (state: RootState) => state['rest-slice']
  );
  const searchParams = useSearchParams();
  const [res, setRes] = useState<HttpResponse>({
    data: '',
    status: 0,
    statusText: '',
    parsedHeaders: {},
    success: false,
    responseTime: 0,
  });

  const method = (searchParams ? searchParams.get('method') : null) as Method;

  const filterHeaders = filteredItems(headers);
  const params = filteredItems(variables);

  const onSubmit = async (data: FormProps) => {
    const { url } = data;

    setLoading(true);

    try {
      const res = await sendRequest({
        url,
        value,
        method,
        headers: filterHeaders,
        params,
      });

      if (res) {
        setRes(res);
      }

      const formattedData = processResponseData(res);
      setData(formattedData);
      saveHistory({ url, value, method: method, headers, variables });
    } finally {
      setLoading(false);
    }
  };

  const contentList: Record<string, React.ReactNode> = {
    header: (
      <HeaderRequest
        sliceKey="rest-slice"
        setHeader={setRestHeader}
        field="headers"
      />
    ),
    body: (
      <FormBody
        control={formProps.control}
        setTextareaData={setValue}
        name="body"
        readOnly={false}
        placeholder='{"key": "value"}'
        height="160px"
      />
    ),
    variables: (
      <HeaderRequest
        sliceKey="rest-slice"
        setHeader={setRestVariables}
        field="variables"
      />
    ),
  };

  const tabList = [
    {
      key: 'header',
      label: 'Header',
    },
    {
      key: 'body',
      label: 'Body',
    },
    {
      key: 'variables',
      label: 'Variables',
    },
  ];

  return (
    <>
      <FormProvider {...formProps}>
        <form onSubmit={formProps.handleSubmit(onSubmit)}>
          <div className="flex w-full mb-4">
            <SelectMethods />
            <div className="flex-1">
              <FormInput
                control={formProps.control}
                name="url"
                placeholder="https://example.com"
                type="text"
                className="rounded-r-none rounded-l-none"
              />
            </div>
            <Button className="border rounded-l-none mr-4" type="submit">
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
        </form>
      </FormProvider>
      <History
        history={history}
        onHistory={handleHistoryClick}
        isOpen={isOpen}
        onClose={setIsOpen}
      />
      <Response data={data} res={res} loading={loading} />
    </>
  );
}
