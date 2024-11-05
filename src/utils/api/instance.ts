import axios from 'axios';

import { COOKIE } from '../constants';

import { HttpClient } from './http-client';

export const api = axios.create({
  baseURL: 'http://localhost:31299/',
  withCredentials: true,
});

api.interceptors.request.use(async config => {
  const isSSR = typeof window === 'undefined';

  if (isSSR) {
    const { cookies } = await import('next/headers');
    const sessionId = cookies().get(`${COOKIE.SESSION_ID}`)?.value;
    const accessToken = cookies().get(COOKIE.ACCESS_TOKEN)?.value;
    const refreshToken = cookies().get(COOKIE.REFRESH_TOKEN)?.value;

    if (sessionId) {
      config.headers.set('cookie', `${COOKIE.SESSION_ID}=${sessionId};`);
    }

    if (accessToken) {
      config.headers.set(
        'cookie',
        `${COOKIE.ACCESS_TOKEN}=${accessToken};${COOKIE.REFRESH_TOKEN}=${refreshToken}`
      );
    }
  }

  return config;
});

export const apiReq = new HttpClient({ baseURL: '' });
