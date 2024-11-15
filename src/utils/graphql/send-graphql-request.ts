import { apiReq } from '../api/instance';
import { filteredItems } from '../features';
import { SendRequestGraphql } from '../models';

export function sendRequestGraphql({
  body,
  url,
  headers,
}: SendRequestGraphql): Promise<HttpResponse | undefined> {
  const filterHeaders = filteredItems(headers);

  return apiReq
    .post(
      url,
      { query: body },
      {
        headers: filterHeaders,
      }
    )
    .then(response => response)
    .then(data => {
      return data;
    })
    .catch(err => {
      return err;
    });
}
