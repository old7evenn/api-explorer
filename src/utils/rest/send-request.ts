import { apiReq } from '../api/instance';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface SendRequest {
  url: string;
  body?: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

export const sendRequest = async ({
  url,
  body,
  method,
  headers = {},
  params = {},
}: SendRequest): Promise<HttpResponse | undefined> => {
  const config = {
    headers,
    params,
  };

  const parsedBody = parseRequestBody(body);

  try {
    const response = await apiReq.request(url, method, {
      ...config,
      ...(!!body && {
        body: method === 'GET' || method === 'DELETE' ? undefined : parsedBody,
      }),
    });

    return response;
  } catch (error) {
    console.error(`[${method}] Request error for ${url}:`, error);
    throw error;
  }
};

const parseRequestBody = (body?: string) => {
  if (!body || body.trim() === '') return undefined;

  try {
    return JSON.parse(body);
  } catch (error) {
    console.warn('Invalid JSON body:', body);

    return undefined;
  }
};
