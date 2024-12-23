'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';

import { AppStore } from '../models/store-types';

import { makeStore } from './store';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
