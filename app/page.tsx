'use client';
import { useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as zod from 'zod';

import { Button } from '@/components/ui';
import { apiReq } from '@/utils/api/instance';
import { filteredHeaders } from '@/utils/features';
import { RootState } from '@/utils/models/store-types';
import { useAppSelector } from '@/utils/store/hooks';
import { setRestHeader } from '@/utils/store/slices/rest-slices';

import { FormBody } from './components/FormBody';
import { FormInput } from './components/FormInput';
import { HeaderRequest } from './components/HeaderRequest';
import { Response } from './components/Response';
import { SelectMethods } from './components/SelectMethods';
import { TabList } from './components/TabList';

export const formSchema = zod.object({
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
  const [data, setData] = useState('');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const method = searchParams ? searchParams.get('method') : null;
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

  const headers = useAppSelector(
    (state: RootState) => state['rest-slice'].headers
  );
  const filterHeaders = filteredHeaders(headers);
  const sendRequest = async ({
    url,
  }: {
    url: string;
  }): Promise<HttpResponse | undefined> => {
    try {
      if (method === 'POST') {
        return await apiReq.post(url, value ? JSON.parse(value) : undefined, {
          headers: filterHeaders,
        });
      }

      if (method === 'GET') {
        return await apiReq.get(url);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const processResponseData = (res: HttpResponse | undefined) => {
    if (!res) return '';

    if (typeof res.data === 'string') {
      if (res.data.includes('{')) {
        const parsedData = JSON.parse(res.data);

        return JSON.stringify(parsedData, null, 2);
      }

      return res.data
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/"/g, '');
    }

    return JSON.stringify(res.data, null, 2);
  };

  const onSubmit = async (data: FormProps) => {
    const { url } = data;

    console.log(data);

    setLoading(true);

    try {
      const res = await sendRequest({ url });

      if (res) {
        setRes(res);
      }

      const formattedData = processResponseData(res);
      setData(formattedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const contentList: Record<string, React.ReactNode> = {
    header: <HeaderRequest sliceKey="rest-slice" setHeader={setRestHeader} />,
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
            <Button className="border rounded-l-none" type="submit">
              SEND
            </Button>
          </div>
          <TabList contentList={contentList} tabList={tabList} />
        </form>
      </FormProvider>
      <Response data={data} res={res} loading={loading} />
    </>
  );
}
