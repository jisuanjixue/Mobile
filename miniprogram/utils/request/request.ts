import Core, { IRequestOptions, TRequestInterceptor, TResponseInterceptor } from "./core";

export type IRequestMethodOptions = Omit<IRequestOptions, "method" | "data">;

// eslint-disable-next-line no-undef
type TBaseType = string | WechatMiniprogram.IAnyObject | ArrayBuffer;

const requestCore = new Core().request;

const _request = async <TRes>(url: string, options: IRequestOptions) => {
  const res = await requestCore(url, { dataType: "json", ...options });
  return res.data as TRes;
};

const get = <TRes>(url: string, options?: IRequestMethodOptions) => _request<TRes>(url, { ...options, method: "GET" });

const post = async <TRes, TReq extends TBaseType>(url: string, data?: TReq, options?: IRequestMethodOptions) =>
  _request<TRes>(url, { ...options, method: "POST", data });

const del = <TRes, TReq extends TBaseType>(url: string, data?: TReq, options?: IRequestMethodOptions) =>
  _request<TRes>(url, { ...options, method: "DELETE", data });

const put = <TRes, TReq extends TBaseType>(url: string, data?: TReq, options?: IRequestMethodOptions) =>
  _request<TRes>(url, { ...options, method: "PUT", data });

type TRequest = typeof _request & {
  get: typeof get;
  post: typeof post;
  delete: typeof del;
  put: typeof put;

  interceptors: {
    useRequest: (...handlers: TRequestInterceptor[]) => void;
    useResponse: (...handlers: TResponseInterceptor[]) => void;
  };
};

const request = _request as TRequest;
request.get = get;
request.post = post;
request.delete = del;
request.put = put;

request.interceptors = {
  useRequest: Core.useRequestInterceptor,
  useResponse: Core.useResponseInterceptor
};

export default request;
