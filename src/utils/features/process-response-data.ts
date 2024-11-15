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
