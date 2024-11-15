import Image from 'next/image';

import { LoadingOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import React from 'react';

export type ResponseProps = {
  data: string;
  res: HttpResponse;
  loading: boolean;
};

export const Response: React.FC<ResponseProps> = ({ data, res, loading }) => {
  const statusColor = {
    bgColor:
      res.status >= 200 && res.status < 300
        ? 'bg-green-900'
        : res.status >= 300 && res.status < 400
          ? 'bg-yellow-900'
          : 'bg-red-900',
    textColor:
      res.status >= 200 && res.status < 300
        ? 'text-green-400'
        : res.status >= 300 && res.status < 400
          ? 'text-yellow-400'
          : 'text-red-400',
  };

  return (
    <div className="mt-auto">
      <div className="flex gap-4 items-center justify-between my-2">
        <b>Response</b>
        {res.status > 0 && (
          <div className="flex gap-4 items-center mr-20 text-sm">
            <span
              className={`flex items-center px-2 ${statusColor.bgColor} ${statusColor.textColor} rounded-sm`}
            >
              {res.status}
            </span>
            <div>
              {res.responseTime}
              <span>ms</span>
            </div>
          </div>
        )}
      </div>
      {loading ? (
        <div className="flex items-center justify-center p-[107px]">
          <LoadingOutlined />
        </div>
      ) : (
        <div className="relative">
          <TextArea
            allowClear
            value={data}
            rows={10}
            readOnly={true}
            className="relative bg-border border-none focus:border-none text-foreground"
            style={{
              resize: 'none',
            }}
          />
          {!data && (
            <div className="absolute top-5 left-0 z-10 w-full">
              <Image
                src="/images/await_response.svg"
                className="mx-auto"
                alt="await_response"
                width={200}
                height={200}
              />
              <p className="text-[#949494] font-bold text-center text-sm">
                Click Send to get a response
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
