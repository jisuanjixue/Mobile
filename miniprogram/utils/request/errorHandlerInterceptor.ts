import { TResponseInterceptor } from "./core";

const errorHandlerInterceptor: TResponseInterceptor = async response => {
  // if (response.statusCode === 500) {
  //   if (res && !res.success) {
  //     wx.showToast({
  //       title: `${res.data.errorMessage}`,
  //       icon: "none",
  //       duration: 2000
  //     });
  //   }
  // }
  if (response.statusCode >= 200) {
    const res: any = await response;
    if (res.data.errorCode === 400) {
      if (res && !res.success) {
        wx.showToast({
          title: `${res.data.errorMessage}`,
          icon: "none",
          duration: 2000
        });
      }
    }
  }
  return response;
};

export default errorHandlerInterceptor;
