import authInterceptors from "./utils/request/authInterceptors";
import request from "./utils/request/request";
import requestUrlInterceptor from "./utils/request/requestUrlInterceptor";
import errorHandlerInterceptor from "./utils/request/errorHandlerInterceptor";
import utils from "./utils/util";

// eslint-disable-next-line no-undef
App<IAppOption>({
  globalData: {
    //全局数据管理
    userInfo: {
      name: "",
      avatar: ""
    }
  },
  onLaunch() {
    request.interceptors.useRequest(requestUrlInterceptor, authInterceptors.request);
    request.interceptors.useResponse(authInterceptors.response);
    request.interceptors.useResponse(errorHandlerInterceptor, authInterceptors.response);

    const g: any = utils.isType(window, "undefined") && window?.Math === Math ? window : utils.isType(global, "object") ? global : this;
    /** The way lodash gets the global object is not applicable in WeChat applet, fix as follows */
    if (!g?.Object) {
      g.Object = Object;
    }
    if (!g?.Date) {
      g.Date = Date;
    }

    // Customize the finally of the promis to prevent errors under the applet ios
    if (!Promise.prototype.finally) {
      Promise.prototype.finally = function (callback: any) {
        const P = this.constructor;
        return this.then(
          value => P.resolve(callback()).then(() => value),
          reason =>
            P.resolve(callback()).then(() => {
              throw reason;
            })
        );
      };
    }
    /* Version auto-update code */
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(res => {
      if (res.hasUpdate) {
        updateManager.onUpdateReady(() => {
          wx.showModal({
            title: "您有新的版本！", // Here you can customize the prompt title
            content: "检测到新版本，是否重启小程序？", // Here you can customize the content of the prompt message
            success: resData => {
              if (resData.confirm) {
                // The new version has been downloaded, call applyUpdate to apply the new version and restart
                updateManager.applyUpdate();
              }
            }
          });
        });
      }
      // Callback after requesting new version information true indicates that there is an update
    });
    updateManager.onUpdateFailed(() => {
      // 新的版本下载失败
      wx.showModal({
        title: "更新提示",
        content: "新版本下载失败",
        showCancel: false
      });
    });
  }
});