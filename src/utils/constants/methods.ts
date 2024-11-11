export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface SelectOption {
  label: Method;
  color: string;
}

export const options: SelectOption[] = [
  { label: 'POST', color: 'text-red-400' },
  { label: 'GET', color: 'text-blue-400' },
  { label: 'PUT', color: 'text-green-400' },
  { label: 'DELETE', color: 'text-yellow-400' },
];
