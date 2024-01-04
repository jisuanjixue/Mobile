import apiConfig from "./apiConfig";
import { TRequestInterceptor } from "./core";

const requestUrlInterceptor: TRequestInterceptor = (url, options) => ({
  url: `${apiConfig.api.baseUrl}${url}`,
  options
});

export default requestUrlInterceptor;
