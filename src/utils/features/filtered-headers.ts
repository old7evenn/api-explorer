export const filteredHeaders = (headers: ChangeVariableItem[]) => {
  const headersObject = headers.reduce(
    (acc, header) => {
      acc[header.key] = header.value;
      return acc;
    },
    {} as Record<string, string>
  );

  return Object.fromEntries(
    Object.entries(headersObject).filter(([key, value]) => key && value)
  );
};
