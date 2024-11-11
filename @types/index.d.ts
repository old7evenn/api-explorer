type InputProps = {
  name: string;
  placeholder: string;
  type?: string;
  dependencies?: NamePath[];
};

type ToggleProps = {
  onClick: () => void;
  children: React.ReactNode;
};

type ProfileRole = 'admin' | 'user';

interface Profile {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: ProfileRole;
  country: {
    id: number;
    label: string;
    code: string;
  };
}

interface Confirmation {
  needConfirmation: boolean;
}

interface SignInFormProps {
  email: string;
  password: string;
}

interface SelectOption {
  label: string;
  color: string;
}

type BaseUrl = string;

type RequestMethod = RequestInit['method'];

interface HttpClientSearchParams {
  [key: string]: string | number | boolean | string[];
}

type _RequestConfig = RequestInit & {
  url: string;
  _retry?: boolean;
  headers?: Record<string, string>;
  params?: HttpClientSearchParams;
};

interface InterceptorResponseResult {
  headers: Response['headers'];
  success: Response['ok'];
  status: Response['status'];
  statusText: Response['statusText'];
  url: string;
  data: any;
}

type SuccessResponseFun = (
  res: InterceptorResponseResult
) => InterceptorResponseResult['data'];

type SuccessRequestFun = (
  options: _RequestConfig
) => _RequestConfig | Promise<_RequestConfig>;

type ResponseError = Error & {
  config: _RequestConfig;
  response: InterceptorResponseResult;
};

type FailureResponseFun = (e: ResponseError) => any;

type FailureRequestFun = (e: ResponseError) => any;

interface RequestInterceptor {
  onSuccess?: SuccessRequestFun;
  onFailure?: FailureRequestFun;
}

interface ResponseInterceptor {
  onSuccess?: SuccessResponseFun;
  onFailure?: FailureResponseFun;
}
interface Interceptors {
  request?: RequestInterceptor[];
  response?: ResponseInterceptor[];
}

type RequestBody = Record<string, any> | FormData;

interface RequestOptions extends Omit<RequestInit, 'method'> {
  headers?: Record<string, string>;
  params?: HttpClientSearchParams;
}

type RequestConfig<Params = undefined> = Params extends undefined
  ? { config?: RequestOptions }
  : { params: Params; config?: RequestOptions };

interface BaseResponse {
  message: string;
}

interface HttpResponse {
  data: any;
  statusText: string;
  status: number;
  parsedHeaders: AxiosResponseHeaders | Record<string, string>;
  success: boolean;
  responseTime: number;
}

interface ChangeItem {
  key: string;
  value: string;
}
