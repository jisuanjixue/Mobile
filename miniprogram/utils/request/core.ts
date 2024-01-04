export type IRequestOptions = Omit<WechatMiniprogram.RequestOption, "url" | "success" | "fail" | "complete">;

export type TResponse = WechatMiniprogram.RequestSuccessCallbackResult<string | WechatMiniprogram.IAnyObject | ArrayBuffer>;

type TRequestInterceptorResult = { url: string; options: IRequestOptions };

export type TRequestInterceptor = (
  url: string,
  options: Omit<IRequestOptions, "url">
) => Promise<TRequestInterceptorResult> | TRequestInterceptorResult;
export type TResponseInterceptor = (response: TResponse, url: string, options: IRequestOptions) => Promise<TResponse> | TResponse;

// eslint-disable-next-line no-unused-vars
export type TRequestCore = (url: string, options: IRequestOptions) => Promise<TResponse>;

export default class Core {
  private static requestInterceptors: TRequestInterceptor[] = [];
  private static responseInterceptors: TResponseInterceptor[] = [];
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  static useRequestInterceptor = (...handlers: TRequestInterceptor[]) => Core.requestInterceptors.push(...handlers);

  static useResponseInterceptor = (...handlers: TResponseInterceptor[]) => Core.responseInterceptors.push(...handlers);

  private isPromise(val: any) {
    const isObject = val !== null && typeof val === "object";
    return isObject && typeof val.then === "function" && typeof val.catch === "function";
  }

  private handleRequestInterceptors = async (url: string, options: IRequestOptions): Promise<TRequestInterceptorResult> => {
    let result = { url, options };

    await Core.requestInterceptors.forEach(async interceptor => {
      let currentResult = interceptor(result.url, result.options);
      if (this.isPromise(currentResult)) currentResult = await currentResult;

      result = { ...result, ...currentResult };
    });

    return result;
  };

  private handleResponseInterceptors = async (response: TResponse, url: string, options: IRequestOptions): Promise<TResponse> => {
    let res = response;
    await Core.responseInterceptors.forEach(async interceptor => {
      let currentResponse = interceptor(res, url, options);
      if (this.isPromise(currentResponse)) currentResponse = await currentResponse;

      res = { ...res, ...currentResponse };
    });

    return res;
  };

  request: TRequestCore = (url: string, options: IRequestOptions): Promise<TResponse> => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<TResponse>(async (resolve, reject) => {
      const requstOptions = await this.handleRequestInterceptors(url, options);
      // eslint-disable-next-line no-undef
      const opts: WechatMiniprogram.RequestOption = {
        url: requstOptions.url,
        ...requstOptions.options,
        success: async res => {
          const response = await this.handleResponseInterceptors(res, requstOptions.url, requstOptions.options);
          resolve(response);
        },
        fail: e => {
          reject(e);
        }
      };
      wx.request(opts);
    });
  };
}
