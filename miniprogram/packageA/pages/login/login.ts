import marketSvc from "../../../services/marketSvc";
import smsVerifySvc from "../../../services/smsVerifySvc";
import { signal, effect, batch } from "../../../miniprogram_npm/@preact/signals-core/index";
import deviceUtil from "../../../miniprogram_npm/lin-ui/utils/device-util";
import authSvc from "../../../utils/authSvc";
import tokenUtils from "../../../utils/tokenUtils";
import util from "../../../utils/util";

const showType = signal(false);
const isCounting = signal(false);
const isCountings = signal(false);
const buttonText = signal("");
const buttonTexts = signal("");
const countdown = signal(60);
const countdowns = signal(60);
const messageCode = signal("");
const messageCodes = signal("");
const codeReceivedTime = signal(null);
const codeReceivedTimes = signal(null);
const key = signal("0");
const openId = signal("");

const phoneNumberRules = [
  {
    type: "number",
    min: 11,
    max: 11,
    message: "手机号输入错误"
  }
];

const defaultValue = {
  phoneNumber: "",
  smsVerifyCode: "",
  password: "",
  openId: ""
};
const defaultValues = {
  phoneNumber: "",
  smsVerifyCode: "",
  password: "",
  openId: ""
};

const passwordRules = [{ required: true, message: "请输入密码" }];
const loginForm = signal(defaultValue);
const loginForms = signal(defaultValues);

Page({
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    openId.value = options.openId;
    buttonText.value = "发送验证码";
    buttonTexts.value = "发送验证码";
    key.value = "0";
    this.getOpenId();
  },

  onUnload() {
    wx.switchTab({
      url: "/pages/index/index"
    });
  },

  async getOpenId() {
    const result = await wx.login();
    const res: any = await marketSvc.getOpenId(result.code);
    if (res.success) {
      openId.value = res.data;
    } else {
      openId.value = res.data;
    }
  },

  async sendCode() {
    try {
      const res: any = await smsVerifySvc.sendCode(loginForm.value.phoneNumber);
      if (res.success) {
        messageCode.value = res.data;
        codeReceivedTime.value = Date.now();
        const intervalId = setInterval(() => {
          countdown.value--;
          if (countdown.value === 0) {
            clearInterval(intervalId);
            batch(() => {
              countdown.value = 60;
              isCounting.value = false;
              buttonText.value = "发送验证码";
            });
          } else {
            buttonText.value = `${countdown.value}秒后重试`;
          }
        }, 1000);
        batch(() => {
          isCounting.value = true;
          buttonText.value = `${countdown.value}秒后重试`;
        });
      } else {
        wx.showToast({
          title: "次数过多!请稍后再试",
          icon: "error"
        });
        return;
      }
    } catch (error) {
      wx.showToast({
        title: "获取错误",
        icon: "error",
        duration: 2000
      });
    }
  },

  async sendCodes() {
    try {
      const res: any = await smsVerifySvc.sendCode(loginForms.value.phoneNumber);
      if (res.success) {
        messageCodes.value = res.data;
        codeReceivedTimes.value = Date.now();
        const intervalId = setInterval(() => {
          countdowns.value--;
          if (countdowns.value === 0) {
            clearInterval(intervalId);
            batch(() => {
              countdowns.value = 60;
              isCountings.value = false;
              buttonTexts.value = "发送验证码";
            });
          } else {
            buttonTexts.value = `${countdowns.value}秒后重试`;
          }
        }, 1000);
        batch(() => {
          isCountings.value = true;
          buttonTexts.value = `${countdowns.value}秒后重试`;
        });
      } else {
        wx.showToast({
          title: "次数过多!请稍后再试",
          icon: "error"
        });
        return;
      }
    } catch (error) {
      wx.showToast({
        title: "获取错误",
        icon: "error",
        duration: 2000
      });
    }
  },

  handSend() {
    if (!loginForm.value.phoneNumber) {
      wx.showToast({
        title: "请先填写手机号！",
        icon: "error",
        duration: 2000
      });
      return;
    }
    if (!util.isValidChinesePhoneNumber(loginForm.value.phoneNumber)) {
      wx.showToast({
        title: "手机号码不正确！请正确填写",
        icon: "error",
        duration: 2000
      });
      return;
    }
    if (isCounting.value) {
      wx.showToast({
        title: "过后再发送！",
        icon: "error",
        duration: 2000
      });
      return;
    }
    this.sendCode();
  },

  handSends() {
    if (!loginForms.value.phoneNumber) {
      wx.showToast({
        title: "请先填写手机号！",
        icon: "error",
        duration: 2000
      });
      return;
    }
    if (!util.isValidChinesePhoneNumber(loginForms.value.phoneNumber)) {
      wx.showToast({
        title: "手机号码不正确！请正确填写",
        icon: "error",
        duration: 2000
      });
      return;
    }
    if (isCountings.value) {
      wx.showToast({
        title: "过后再发送！",
        icon: "error",
        duration: 2000
      });
      return;
    }
    this.sendCodes();
  },

  async weLogin() {
    tokenUtils.setTab(key.value === "0" ? "one" : "two");
    const type = key.value === "0" ? "个人" : "法人";
    const result: any = await authSvc.getAccessToken(type);
    if (result.success) {
      wx.showToast({
        title: "登录成功",
        icon: "success",
        duration: 2000
      });
      wx.reLaunch({
        url: `/pages/index/index`
      });
    } else {
      wx.navigateTo({
        url: `/packageA/pages/register/register?type=${key.value}`
      });
    }
  },

  handToRegister() {
    wx.navigateTo({
      url: `/packageA/pages/register/register?openId=${""}&type=${key.value === "0" ? "one" : "two"}`
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    effect(() => {
      this.setData({
        loginForm: loginForm.value,
        loginFormRules: {
          passwordRules: passwordRules,
          phoneNumberRules: phoneNumberRules
        },
        loginForms: loginForms.value,
        loginFormsRules: {
          passwordRules: passwordRules,
          phoneNumberRules: phoneNumberRules
        },
        showType: showType.value,
        buttonText: buttonText.value,
        buttonTexts: buttonTexts.value,
        countdown: countdown.value,
        countdowns: countdowns.value,
        isCounting: isCounting.value,
        isCountings: isCountings.value,
        key: key.value,
        capsuleBarHeight: deviceUtil.getNavigationBarHeight()
      });
    });
  },

  onChange(e) {
    const now = Date.now();
    const threeMinutesAgo = now - 3 * 60 * 1000;
    const name = e.currentTarget.id;
    if (name === "smsVerifyCode") {
      if (!codeReceivedTime.value || codeReceivedTime.value < threeMinutesAgo) {
        wx.showToast({
          title: "此验证码已无效，请重新发送验证码",
          icon: "error",
          duration: 2000
        });
      } else {
        loginForm.value[name] = e.detail.value;
      }
    }
    loginForm.value[name] = e.detail.value;
  },

  onChanges(e) {
    const now = Date.now();
    const threeMinutesAgo = now - 3 * 60 * 1000;
    const name = e.currentTarget.id;
    if (name === "smsVerifyCode") {
      if (!codeReceivedTimes.value || codeReceivedTimes.value < threeMinutesAgo) {
        wx.showToast({
          title: "此验证码已无效，请重新发送验证码",
          icon: "error",
          duration: 2000
        });
      } else {
        loginForms.value[name] = e.detail.value;
      }
    }
    loginForms.value[name] = e.detail.value;
  },

  onClear(e) {
    const { name } = e.currentTarget.dataset;
    loginForm.value[name] = "";
  },

  onClears(e) {
    const { name } = e.currentTarget.dataset;
    loginForms.value[name] = "";
  },

  setToken(res: any) {
    const { accessToken, refreshToken, weixinOpenId, name, avatar, phoneNumber, type } = res;
    tokenUtils.setToken({ accessToken: accessToken, refreshToken: refreshToken });
    tokenUtils.setOpenId(weixinOpenId);
    wx.setStorageSync("name", name);
    wx.setStorageSync("type", type);
    wx.setStorageSync("avatar", avatar);
    wx.setStorageSync("phoneNumber", phoneNumber);
  },

  async submitPersonal() {
    const saveData = {
      ...loginForm.value,
      openId: openId.value,
      type: Number(key.value)
    };
    if (!loginForm.value.smsVerifyCode) {
      wx.showToast({
        title: "验证码必填",
        icon: "error",
        duration: 2000
      });
      return;
    }
    try {
      const res: any = await marketSvc.loginByPassword(saveData);
      if (res.success) {
        loginForm.value = defaultValue;
        wx.showToast({
          title: "个人登录成功！",
          icon: "success",
          duration: 2000
        });
        loginForm.value = defaultValue;
        this.setToken(res.data);
        wx.reLaunch({
          url: `/pages/index/index`
        });
      }
      if (!res.success) {
        wx.showToast({
          title: `${res.errorMessage}`,
          icon: "none",
          duration: 2000
        });
      }
    } catch (error) {
      wx.showToast({
        title: "个人登录失败！",
        icon: "error",
        duration: 2000
      });
    }
  },

  async submitCorporate() {
    const saveData = {
      ...loginForms.value,
      openId: openId.value,
      type: Number(key.value)
    };
    if (!loginForms.value.smsVerifyCode) {
      wx.showToast({
        title: "验证码必填",
        icon: "error",
        duration: 2000
      });
      return;
    }
    try {
      const res: any = await marketSvc.loginByPassword(saveData);
      if (res.success) {
        loginForms.value = defaultValue;
        wx.showToast({
          title: "法人登录成功！",
          icon: "success",
          duration: 2000
        });
        loginForms.value = defaultValues;
        this.setToken(res.data);
        wx.reLaunch({
          url: `/pages/index/index`
        });
      }
      if (!res.success) {
        wx.showToast({
          title: `${res.errorMessage}`,
          icon: "none",
          duration: 2000
        });
      }
    } catch (error) {
      wx.showToast({
        title: "法人登录失败！",
        icon: "error",
        duration: 2000
      });
    }
  },

  changeTabs(e: any) {
    const { activeKey } = e.detail;
    key.value = activeKey;
    tokenUtils.setTab(activeKey === "0" ? "one" : "two");
  }
});
