import { apiReq } from '../api/instance';
import { filteredItems } from '../features';
import { SendRequestGraphql } from '../models';

export function sendRequestGraphql({
  value,
  url,
  headers,
}: SendRequestGraphql): Promise<HttpResponse | undefined> {
  const filterHeaders = filteredItems(headers);

  return apiReq
    .post(
      url,
      { query: value },
      {
        headers: filterHeaders,
      }
    )
    .then(response => response)
    .then(data => {
      console.log(data);

      return data;
    })
    .catch(err => {
      return err;
    });
}

export const parseResponseData = (res: HttpResponse | undefined) => {
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

  return JSON.stringify(res, null, 2);
};
