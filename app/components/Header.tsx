'use client';
import { usePathname, useRouter } from 'next/navigation';

import { LoadingOutlined, UserOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui';

import { useAuth } from '../auth/components/AuthProvider/AuthProvider';

import { ThemeToggle } from './ThemeToggle';

const restOrGraphql = {
  rest: {
    url: '/?method=POST',
    title: 'Rest API',
  },
  graphql: {
    url: '/graphql',
    title: 'GraphiQL API',
  },
};

export type ClientReq = {
  url: string;
  title: string;
};

export const Header = () => {
  const [loadingStates, setLoadingStates] = useState({
    login: false,
    logout: false,
    clientSwitch: false,
  });
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const auth = useAuth();
  const navigation = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.includes('/auth')) {
      setLoadingStates({
        login: false,
        logout: false,
        clientSwitch: false,
      });
    } else if (
      pathname === targetPath ||
      (pathname === '/' && targetPath === '/?method=POST')
    ) {
      console.log('targetPath', targetPath, '\n', 'pathname', pathname);

      setLoadingStates(prev => ({
        ...prev,
        clientSwitch: false,
      }));
      setTargetPath(null);
    }
  }, [pathname, targetPath]);

  const logout = () => {
    setLoadingStates(prev => ({ ...prev, logout: true }));
    navigation.push('/auth');
    auth?.logout();
  };

  const toAuth = () => {
    setLoadingStates(prev => ({ ...prev, login: true }));
    navigation.push('/auth');
  };

  const client = (): ClientReq => {
    if (!pathname?.includes(restOrGraphql.graphql.url)) {
      return restOrGraphql.graphql;
    }

    return restOrGraphql.rest;
  };

  const handleClick = () => {
    const targetUrl = client().url;
    setLoadingStates(prev => ({ ...prev, clientSwitch: true }));
    setTargetPath(targetUrl);
    navigation.push(targetUrl);
  };

  return (
    <header className="flex items-center mb-6">
      {auth?.user && <UserOutlined />}
      {auth?.user && <span className="ml-2">{auth?.user.email}</span>}
      <div className="flex gap-5 items-center mr-0 ml-auto">
        {!auth?.user && !pathname?.includes('/auth') && (
          <Button variant="outline" onClick={toAuth}>
            {loadingStates.login ? (
              <LoadingOutlined className="px-3" />
            ) : (
              'Log in'
            )}
          </Button>
        )}
        {auth?.user && (
          <>
            <Button variant="outline" onClick={handleClick} className="mr-4">
              {loadingStates.clientSwitch ? (
                <LoadingOutlined className="px-3" />
              ) : (
                client().title
              )}
            </Button>
            <Button variant="outline" onClick={logout}>
              {loadingStates.logout ? (
                <LoadingOutlined className="px-3" />
              ) : (
                'Log out'
              )}
            </Button>
          </>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
};
