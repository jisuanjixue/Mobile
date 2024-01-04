import { TRequestInterceptor, TResponse, TResponseInterceptor } from "./core";
import request from "./request";
import tokenUtils from "../tokenUtils";
import authSvc from "../authSvc";

const requestInterceptor: TRequestInterceptor = (url, options) => {
  const token = tokenUtils.getToken();

  const { header = {} } = options;
  const headerAuth: Record<string, string> = {};

  headerAuth["Authorization"] = `bearer ${token?.accessToken || ""}`;

  return {
    url,
    options: {
      ...options,
      header: { ...header, ...headerAuth },
      interceptors: true
    }
  };
};

let isRefreshToken = false;
let requestUrl = false;
let subscribers: (() => void)[] = [];

const responseInterceptor: TResponseInterceptor = async (res, url, options) => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const pageUrl = currentPage.route;
  if (!tokenUtils.isAuthorized() && pageUrl === "packageE/pages/complaint/complaint") {
    requestUrl = false;
    wx.showToast({
      title: "您还没登录，请先登录再投诉！",
      icon: "none",
      duration: 3000
    });
    setTimeout(() => {
      wx.navigateTo({
        url: `/packageA/pages/login/login`
      });
    }, 3000);
  }
  if (!tokenUtils.isAuthorized() && pageUrl === "packageE/pages/consult/index") {
    requestUrl = false;
    wx.showToast({
      title: "您还没登录，请先登录再咨询！",
      icon: "none",
      duration: 3000
    });
    setTimeout(() => {
      wx.navigateTo({
        url: `/packageA/pages/login/login`
      });
    }, 3000);
  }
  if (pageUrl === "packageD/pages/fileDetail/fileDetail") {
    requestUrl = false;
    return res;
  }
  if (pageUrl === "packageD/pages/codingQuestionnaire/codingQuestionnaire") {
    requestUrl = false;
    return res;
  }
  if (res.statusCode === 401 && !requestUrl) {
    wx.clearStorageSync();
    requestUrl = false;
    wx.navigateTo({
      url: `/packageA/pages/login/login`
    });
  }
  if (!res.data.success && res.data.errorCode === 403) {
    const type = tokenUtils.getTab();
    wx.navigateTo({
      url: `/packageA/pages/register/register?type=${type}`
    });
  }
  if (res.statusCode !== 401) return res;

  const retry = new Promise<TResponse>(resolve => {
    subscribers.push(() => resolve(request(url, options)));
  });

  if (!isRefreshToken) {
    isRefreshToken = true;
    try {
      const resRefresh = await authSvc.refreshToken();
      if (!resRefresh.success) return res;
    } catch (e) {
      console.log(e);
    }
    subscribers.forEach(cb => cb());
    subscribers = [];
  }

  return retry;
};

export default { request: requestInterceptor, response: responseInterceptor };
