import axios, { AxiosError, AxiosHeaders, AxiosResponse } from 'axios';

import { getErrorMessage } from '../ErrorMessage/error-message';

interface HttpClientSearchParams {
  [key: string]: string | number | boolean | string[];
}

interface HttpClientParams {
  baseURL: BaseUrl;
  headers?: Record<string, string>;
}

export class HttpClient {
  public baseURL: BaseUrl;

  public headers: Record<string, string>;

  readonly interceptorHandlers: Interceptors;

  readonly interceptors: {
    request: {
      use: (
        onSuccess?: SuccessRequestFun,
        onFailure?: FailureRequestFun
      ) => RequestInterceptor;
      eject: (interceptor: RequestInterceptor) => void;
    };
    response: {
      use: (
        onSuccess?: SuccessResponseFun,
        onFailure?: FailureResponseFun
      ) => ResponseInterceptor;
      eject: (interceptor: ResponseInterceptor) => void;
    };
  };

  constructor({ baseURL, headers = {} }: HttpClientParams) {
    this.baseURL = baseURL;
    this.headers = headers;
    this.interceptorHandlers = { request: [], response: [] };
    this.interceptors = {
      request: {
        use: (onSuccess, onFailure) => {
          const interceptor = { onSuccess, onFailure };
          this.interceptorHandlers.request?.push(interceptor);

          return interceptor;
        },
        eject: interceptor => {
          this.interceptorHandlers.request =
            this.interceptorHandlers.request?.filter(
              interceptorLink => interceptorLink !== interceptor
            );
        },
      },
      response: {
        use: (onSuccess, onFailure) => {
          const interceptor = { onSuccess, onFailure };
          this.interceptorHandlers.response?.push(interceptor);

          return interceptor;
        },
        eject: interceptor => {
          this.interceptorHandlers.response =
            this.interceptorHandlers.response?.filter(
              interceptorLink => interceptorLink !== interceptor
            );
        },
      },
    };
  }

  setBaseUrl(newBaseUrl: BaseUrl) {
    this.baseURL = newBaseUrl;
  }

  setHeaders(headers: Record<string, string>) {
    this.headers = { ...this.headers, ...headers };
  }

  private createSearchParams(params: HttpClientSearchParams) {
    const searchParams = new URLSearchParams();

    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const value = params[key];

        if (Array.isArray(value)) {
          value.forEach(currentValue => searchParams.append(key, currentValue));
        } else {
          searchParams.set(key, value.toString());
        }
      }
    }

    return `?${searchParams.toString()}`;
  }

  private async runResponseInterceptors<T>(
    initialResponse: Response,
    initialConfig: _RequestConfig
  ) {
    let body = await this.parseJson<T>(initialResponse);
    const response = {
      url: initialResponse.url,
      headers: initialResponse.headers,
      status: initialResponse.status,
      statusText: initialResponse.statusText,
      success: initialResponse.ok,
      data: body,
    };

    this.interceptorHandlers.response?.forEach(({ onSuccess, onFailure }) => {
      try {
        if (!initialResponse.ok)
          throw new Error(initialResponse.statusText, {
            cause: { config: initialConfig, response },
          });

        if (!onSuccess) return;

        body = onSuccess(response);
      } catch (error: unknown) {
        const responseError = error as ResponseError;
        responseError.config = initialConfig;
        responseError.response = response;

        if (onFailure) {
          body = onFailure(responseError);
        } else {
          return Promise.reject(responseError);
        }
      }
    });

    return body;
  }

  private async runRequestInterceptors(initialConfig: _RequestConfig) {
    let config = initialConfig;

    if (!this.interceptorHandlers.request?.length) return config;

    for (const { onSuccess, onFailure } of this.interceptorHandlers.request) {
      try {
        if (!onSuccess) continue;

        config = await onSuccess(config);
      } catch (error: unknown) {
        (error as ResponseError).config = initialConfig;

        if (onFailure) {
          onFailure(error as ResponseError);
        } else Promise.reject(error);
      }
    }

    return config;
  }

  private async parseJson<T>(response: Response): Promise<T> {
    try {
      return (await response.json()) as T;
    } catch {
      return null as T;
    }
  }

  async request<T>(
    endpoint: string,
    method: RequestMethod,
    options: RequestOptions = {}
  ) {
    const defaultConfig: _RequestConfig = {
      ...options,
      url: endpoint,
      method,
      headers: {
        ...this.headers,
        ...(options?.body &&
          !(options.body instanceof FormData) && {
            'Content-Type': 'application/json',
          }),
        ...(options.headers ? { ...options.headers } : {}),
      } as Record<string, string>,
    };

    const config = await this.runRequestInterceptors(defaultConfig);

    let url = endpoint;

    if (options.params) {
      url += this.createSearchParams(options.params);
    }

    try {
      const startTimer = Date.now();
      const axiosHeaders = AxiosHeaders.from(config.headers);
      const response: AxiosResponse<T> = await axios({
        url,
        method: config.method,
        data: config.body,
        headers: axiosHeaders,
      });

      const endTimer = Date.now();

      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        parsedHeaders: response.headers,
        success: response.status >= 200 && response.status < 300,
        responseTime: endTimer - startTimer,
      };
    } catch (error: unknown) {
      const axiosError = error as AxiosError;

      return {
        data: JSON.stringify(axiosError.response?.data || axiosError.message),
        status: axiosError.response?.status || 500,
        statusText: getErrorMessage(
          axiosError,
          axiosError.message || 'Failed to fetch'
        ),
        parsedHeaders: axiosError.response?.headers || {},
        success: false,
        responseTime: 0,
      };
    }
  }

  private getHeaders(response: Response): Record<string, string> {
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    return headers;
  }

  get<T>(endpoint: string, options: Omit<RequestOptions, 'body'> = {}) {
    return this.request<T>(endpoint, 'GET', options);
  }

  delete<T>(endpoint: string, options: Omit<RequestOptions, 'body'> = {}) {
    return this.request<T>(endpoint, 'DELETE', options);
  }

  post<T>(endpoint: string, body?: RequestBody, options: RequestOptions = {}) {
    return this.request<T>(endpoint, 'POST', {
      ...options,
      ...(!!body && {
        body: body instanceof FormData ? body : JSON.stringify(body),
      }),
    });
  }

  put<T>(endpoint: string, body?: RequestBody, options: RequestOptions = {}) {
    return this.request<T>(endpoint, 'PUT', {
      ...options,
      ...(!!body && {
        body: body instanceof FormData ? body : JSON.stringify(body),
      }),
    });
  }

  patch<T>(endpoint: string, body?: RequestBody, options: RequestOptions = {}) {
    return this.request<T>(endpoint, 'PATCH', {
      ...options,
      ...(!!body && {
        body: body instanceof FormData ? body : JSON.stringify(body),
      }),
    });
  }

  call<T>(options: _RequestConfig) {
    return this.request<T>(options.url, options.method, {
      ...options,
    });
  }
}
