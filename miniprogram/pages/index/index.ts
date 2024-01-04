import { signal, effect } from "../../miniprogram_npm/@preact/signals-core/index";
// import newSvc from "../..//services/newSvc";
// import bannerSvc from "../..//services/bannerSvc";
import tokenUtils from "../../utils/tokenUtils";
import hythrottle from "../../utils/throttle";
import utils from "../../utils/util";
// import host from "../../utils/request/apiConfig";
// import util from "../../utils/dayjsUtils";
import deviceUtil from "../../miniprogram_npm/lin-ui/utils/device-util";

const querySelectThrottle = hythrottle(utils.querySelect, 100);
const articleHome = signal([]);
const bannerList = signal([]);
const news = signal([]);
const userInfo = signal({ name: "" });
const bannerHeight = signal(150);
const isLogin = signal(false);
const version = signal("");

Page({
  onLoad() {
    // this.queryArticleList();
    // this.queryBannerList();
    // this.queryBannersList();
    isLogin.value = tokenUtils.isAuthorized();
    userInfo.value = { ...userInfo.value, name: wx.getStorageSync("name") };
    const ccountInfo = wx.getAccountInfoSync();
    version.value = ccountInfo.miniProgram.version;
  },

  intoLogin() {
    wx.navigateTo({
      url: `/packageA/pages/login/login`
    });
  },

  onNewItemClick(e: any) {
    const id = e.currentTarget?.dataset?.id;
    wx.navigateTo({
      url: `/packageA/pages/newDetail/index?id=${id}`
    });
  },

  // async queryArticleList() {
  //   try {
  //     const res = await newSvc.getArticleList("Notice", 1, 5);
  //     if (res.success) {
  //       news.value = res.data;
  //     }
  //   } catch (error) {
  //     wx.showToast({
  //       title: "请求失败",
  //       icon: "error",
  //       duration: 2000
  //     });
  //   }
  // },

  onBannerClick(e: any) {
    const sourceId = e.currentTarget.dataset.sourceid;
    const source = e.currentTarget.dataset.source;
    const url = () =>
      (() => {
        if (source === 0) return "/packageA/pages/newDetail/index";
        if (source === 1) return "/packageB/pages/negativeDetail/index";
        if (source === 2) return "/packageD/pages/fileDetail/fileDetail";
        if (source === 4) return "/packageB/pages/checklist/checklist";
        return "/packageC/pages/report/report";
      })();
    wx.navigateTo({
      url: `${url()}?id=${sourceId}`
    });
  },

  onBannerImageLoad() {
    querySelectThrottle(".banner-image").then((res: any) => {
      bannerHeight.value = res[0]?.height;
    });
  },

  // queryBannerList: async () => {
  //   try {
  //     const res = await bannerSvc.getList();
  //     if (res.success) {
  //       const list = res.data;
  //       bannerList.value = list?.map(v => ({ ...v, mobilePreview: v.mobilePreview ? `${host.api.baseUrl}/upload${v.mobilePreview}` : "" }));
  //     } else {
  //       bannerList.value = [];
  //     }
  //   } catch (error) {
  //     wx.showToast({
  //       title: "请求失败",
  //       icon: "error",
  //       duration: 2000
  //     });
  //   }
  // },

  // queryBannersList: async () => {
  //   try {
  //     const res = await newSvc.getBannerList(5);
  //     if (res.success) {
  //       const list = res.data?.map(v => ({
  //         ...v,
  //         mainImage: `${host.api.baseUrl}/upload${v.mainImage}`,
  //         postTime: util.formatDateTime(v.postTime)
  //       }));
  //       articleHome.value = list?.slice(0, 2);
  //     } else {
  //       articleHome.value = [];
  //     }
  //   } catch (error) {
  //     wx.showToast({
  //       title: "请求失败",
  //       icon: "error",
  //       duration: 2000
  //     });
  //   }
  // },

  handComplaint() {
    wx.navigateTo({
      url: "/packageE/pages/complaint/complaint"
    });
  },

  onShow() {
    const deviceBarHeight = Math.ceil(deviceUtil.getNavigationBarHeight());
    effect(() => {
      this.setData({
        articleHome: articleHome.value,
        bannerList: bannerList.value,
        capsuleBarHeight: deviceUtil.getNavigationBarHeight(),
        deviceBarHeight: deviceBarHeight,
        firstMarginTop: utils.handMarginTop(deviceBarHeight),
        bannerHeight: bannerHeight.value,
        userInfo: userInfo.value,
        isLogin: isLogin.value,
        news: news.value,
        version: version.value,
        showIndicator: bannerList.value.length > 1 ? true : false
      });
    });
  },

  intoSearch() {
    wx.navigateTo({
      url: "/packageB/pages/search/search"
    });
  },

  onItemClick(e: any) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/packageA/pages/newDetail/index?id=${id}`
    });
  },

  onCkeckClick() {
    wx.navigateTo({
      url: "/packageB/pages/checklist/checklist"
    });
  },

  onClick() {
    wx.navigateTo({
      url: `/packageD/pages/case/index`
    });
  }
});
