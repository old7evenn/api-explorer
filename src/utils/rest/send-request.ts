import { apiReq } from '../api/instance';

export interface SendRequest {
  url: string;
  value: string;
  method: string | null;
  headers: Record<string, string>;
  params: Record<string, string>;
}

export const sendRequest = async ({
  url,
  value,
  method,
  headers,
  params,
}: SendRequest): Promise<HttpResponse | undefined> => {
  try {
    if (method === 'POST') {
      return await apiReq.post(url, value ? JSON.parse(value) : undefined, {
        headers,
      });
    }

    if (method === 'GET') {
      return await apiReq.get(url, {
        headers,
        params,
      });
    }
  } catch (error) {
    console.error('Error during request:', error);
  }
};

export const processResponseData = (res: HttpResponse | undefined) => {
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
