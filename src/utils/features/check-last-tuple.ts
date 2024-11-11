export const checkLastTuple = (headers: ChangeItem[]): ChangeItem[] => {
  const lastHeader = headers[headers.length - 1];

  if (lastHeader.key && lastHeader.value) {
    return [...headers, { key: '', value: '' }];
  }

  return headers;
};
