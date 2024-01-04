// index.ts
import { signal, effect } from "../../miniprogram_npm/@preact/signals-core/index";
// import complaintSvc from "../../services/complaintSvc";
// import messageSvc from "../../services/messageSvc";
import host from "../../utils/request/apiConfig";
import deviceUtil from "../../miniprogram_npm/lin-ui/utils/device-util";
import tokenUtils from "../../utils/tokenUtils";

// eslint-disable-next-line no-undef

const total = signal(0);
const count = signal(0);
const statics = signal([]);
const steps = signal([]);
const isLogin = signal(false);

const userInfo = signal({ name: wx.getStorageSync("name"), avatar: wx.getStorageSync("avatar")  });
// 获取应用实例

Page({
  onLoad() {
    this.getList();
    // this.getComplaintStatics();
    userInfo.value = { ...userInfo.value, name: wx.getStorageSync("name"), type: wx.getStorageSync("type") };
    isLogin.value = tokenUtils.isAuthorized();
  },

  intoregister() {
    wx.navigateTo({
      url: "/packageA/pages/register/register"
    });
  },

  updateUser() {
    wx.navigateTo({
      url: "/packageA/pages/userinfo/userinfo"
    });
  },

  // async getMessageCount() {
  //   try {
  //     const res: any = await messageSvc.getMessageCount();
  //     if (res.success) {
  //       count.value = res.data;
  //     }
  //   } catch (error) {
  //     wx.showToast({
  //       title: "获取失败",
  //       icon: "error",
  //       duration: 2000
  //     });
  //   }
  // },

  // getComplaintStatics: async () => {
  //   try {
  //     const res = await complaintSvc.geStatics();
  //     if (res.success) {
  //       steps.value = res.data?.map(v => ({
  //         text: (() => {
  //           if (v.status === 0) return "研判中";
  //           if (v.status === 1) return "处置中";
  //           if (v.status === 2) return "待评价";
  //           return "已关闭";
  //         })(),
  //         desc: `${v.amount}件`,
  //         inactiveIcon: (() => {
  //           if (v.status === 0) return "../../assets/images/complaint-0.png";
  //           if (v.status === 1) return "../../assets/images/complaint-1.png";
  //           if (v.status === 2) return "../../assets/images/complaint-2.png";
  //           return "../../assets/images/complaint-3.png";
  //         })(),
  //         color: (() => {
  //           if (v.status === 0) return "#8e7aa7";
  //           if (v.status === 1) return "#86c4ba";
  //           if (v.status === 2) return "#4c6aaf";
  //           return "#898d96";
  //         })()
  //       }));
  //     } else {
  //       steps.value = [];
  //     }
  //   } catch (error) {
  //     wx.showToast({
  //       title: "请求失败",
  //       icon: "error",
  //       duration: 2000
  //     });
  //   }
  // },

  getList: async () => {
    try {
      const res = await messageSvc.getList("", 1, 2);
      if (res.success) {
        total.value = res.total;
      }
    } catch (error) {
      wx.showToast({
        title: "失败",
        icon: "error",
        duration: 2000
      });
    }
  },

  intoBind() {
    wx.navigateTo({
      url: "/packageC/pages/bindSubject/bindSubject"
    });
  },

  handSwicthUser() {
    this.intoLogin();
  },

  intoLogin() {
    wx.navigateTo({
      url: `/packageA/pages/login/login`
    });
  },

  onShow() {
    // this.getMessageCount();
    effect(() => {
      this.setData({
        steps: steps.value,
        total: total.value || 0,
        count: count.value,
        isLogin: isLogin.value,
        statics: statics.value,
        userInfo: userInfo.value,
        url: host.api.baseUrl,
        capsuleBarHeight: deviceUtil.getNavigationBarHeight()
      });
    });
  },
  intoPage() {
    wx.navigateTo({
      url: "/packageG/myMessage/myMessage"
    });
  }
});
