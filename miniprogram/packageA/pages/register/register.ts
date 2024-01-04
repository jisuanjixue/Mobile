import dataDictionarySvc from "../../../services/dataDictionarySvc";
import marketSvc from "../../../services/marketSvc";
import smsVerifySvc from "../../../services/smsVerifySvc";
import { signal, effect, batch } from "../../../miniprogram_npm/@preact/signals-core/index";
import deviceUtil from "../../../miniprogram_npm/lin-ui/utils/device-util";
import util from "../../../utils/util";

const showType = signal(false);
const showTypes = signal(false);
const showIndustryTypes = signal(false);
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
const idTypeList = signal([]);
const typeIdList = signal([]);
const industryCategory = signal([]);
const idType = signal("");
const typeName = signal("");
const industryTypeName = signal("");
const key = signal("one");
const idTypeId = signal("");
const typeId = signal("");
const industryTypeId = signal("");
const openId = signal("");

const nameRules = [
  { required: true, message: "请输入真实姓名" },
  { min: 2, max: 5, message: "长度在 2 到 5 个字符" }
];

const phoneNumberRules = [
  {
    required: true,
    message: "请输入真实姓名"
  },
  {
    type: "number",
    min: 11,
    max: 11,
    message: "手机号输入错误"
  }
];

const idNumberRules = [
  {
    required: true,
    message: "请输入身份证件号码"
  },
  {
    type: "number",
    min: 18,
    max: 18,
    message: "身份证件号码输入错误"
  }
];

const defaultValue = {
  name: "",
  phoneNumber: "",
  idTypeId: "",
  idNumber: "",
  smsVerifyCode: "",
  password: ""
};
const defaultValues = {
  name: "",
  phoneNumber: "",
  typeId: "",
  industryTypeId: "",
  code: "",
  smsVerifyCode: "",
  password: ""
};

const idTypeRules = [{ required: true, message: "请选择证件类型" }];
const idTypeIndustryRules = [{ required: true, message: "请选择市场主体行业类型" }];
const typeIdRules = [{ required: true, message: "请选市场主体类型" }];
const passwordRules = [{ required: true, message: "请输入密码" }];
const namesRules = [{ required: true, message: "请输入机构名称" }];
const codeRules = [{ required: true, message: "请输入信用统一代码" }];
const registerForm = signal(defaultValue);
const registerForms = signal(defaultValues);

Page({
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    key.value = options.type;
    this.getOpenId();
    this.getIdTypeList();
    this.getTypeIdList();
    this.queryIndustryCategory();
    buttonText.value = "发送验证码";
    buttonTexts.value = "发送验证码";
  },

  async getOpenId() {
    const result = await wx.login();
    const res: any = await marketSvc.getOpenId(result.code);
    if (res.success) {
      openId.value = res.data;
    } else {
      openId.value = "";
    }
  },

  queryIndustryCategory: async () => {
    try {
      const res = await dataDictionarySvc.getLists("IndustryType");
      if (res.success) {
        const list = res.data;
        const delItems = ["00", "22", "21", "99"];
        batch(() => {
          const newList = list?.filter(f => !delItems.includes(f.code));
          industryCategory.value = newList?.map(v => ({ text: v.name, value: v.id }));
        });
      }
    } catch (error) {
      wx.showToast({
        title: "请求失败",
        icon: "error",
        duration: 2000
      });
    }
  },

  async getIdTypeList() {
    try {
      const res: any = await dataDictionarySvc.getLists("IDType");
      if (res.success) {
        idTypeList.value = res.data.map(v => ({ text: v.name, value: v.id }));
      }
    } catch (error) {
      wx.showToast({
        title: "获取错误",
        icon: "error",
        duration: 2000
      });
    }
  },
  async getTypeIdList() {
    try {
      const res: any = await dataDictionarySvc.getLists("MarketSubjectOrganizationType");
      if (res.success) {
        typeIdList.value = res.data.map(v => ({ text: v.name, value: v.id }));
      }
    } catch (error) {
      wx.showToast({
        title: "获取错误",
        icon: "error",
        duration: 2000
      });
    }
  },

  async sendCode() {
    try {
      const res: any = await smsVerifySvc.sendCode(registerForm.value.phoneNumber);
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
      const res: any = await smsVerifySvc.sendCode(registerForms.value.phoneNumber);
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
    if (!registerForm.value.phoneNumber) {
      wx.showToast({
        title: "请先填写手机号！",
        icon: "error",
        duration: 2000
      });
      return;
    }
    if (!util.isValidChinesePhoneNumber(registerForm.value.phoneNumber)) {
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
    if (!registerForms.value.phoneNumber) {
      wx.showToast({
        title: "请先填写手机号！",
        icon: "error",
        duration: 2000
      });
      return;
    }
    if (!util.isValidChinesePhoneNumber(registerForms.value.phoneNumber)) {
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    effect(() => {
      this.setData({
        registerForm: registerForm.value,
        registerFormRules: {
          nameRules: nameRules,
          passwordRules: passwordRules,
          idTypeRules: idTypeRules,
          idNumberRules: idNumberRules,
          phoneNumberRules: phoneNumberRules
        },
        registerForms: registerForms.value,
        registerFormsRules: {
          namesRules: namesRules,
          passwordRules: passwordRules,
          codeRules: codeRules,
          idTypeIndustryRules: idTypeIndustryRules,
          typeIdRules: typeIdRules,
          phoneNumberRules: phoneNumberRules
        },
        showType: showType.value,
        buttonText: buttonText.value,
        buttonTexts: buttonTexts.value,
        countdown: countdown.value,
        countdowns: countdowns.value,
        isCounting: isCounting.value,
        isCountings: isCountings.value,
        showTypes: showTypes.value,
        showIndustryTypes: showIndustryTypes.value,
        idType: idType.value,
        typeName: typeName.value,
        industryTypeName: industryTypeName.value,
        idTypeList: idTypeList.value,
        typeIdList: typeIdList.value,
        industryCategory: industryCategory.value,
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
        registerForm.value[name] = e.detail.value;
      }
    }
    registerForm.value[name] = e.detail.value;
  },

  onChanges(e) {
    const now = Date.now();
    const threeMinutesAgo = now - 3 * 60 * 1000;
    const name = e.currentTarget.id;
    if (name === "smsVerifyCode") {
      if (!codeReceivedTimes.value || codeReceivedTimes.value < threeMinutesAgo) {
        wx.showToast({
          title: "此验证码已无效，请重新发送!",
          icon: "error",
          duration: 2000
        });
      } else {
        registerForms.value[name] = e.detail.value;
      }
    }
    registerForms.value[name] = e.detail.value;
  },

  onClear(e) {
    const { name } = e.currentTarget.dataset;
    registerForm.value[name] = "";
  },

  onClears(e) {
    const { name } = e.currentTarget.dataset;
    registerForms.value[name] = "";
  },

  async submitPersonal() {
    const saveData = {
      ...registerForm.value,
      idTypeId: idTypeId.value,
      openId: openId.value
    };
    if (!registerForm.value.smsVerifyCode) {
      wx.showToast({
        title: "验证码必填",
        icon: "error",
        duration: 2000
      });
      return;
    }
    try {
      const res = await marketSvc.registerByPersonal(saveData);
      if (res.success) {
        registerForm.value = defaultValue;
        wx.showToast({
          title: "个人注册成功！",
          icon: "success",
          duration: 2000
        });
        wx.navigateBack({
          delta: 1
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
        title: "个人注册失败！",
        icon: "error",
        duration: 2000
      });
    }
  },

  async submitCorporate() {
    const saveData = {
      ...registerForms.value,
      typeId: typeId.value,
      openId: openId.value,
      industryTypeId: industryTypeId.value
    };
    if (!registerForms.value.smsVerifyCode) {
      wx.showToast({
        title: "验证码必填",
        icon: "error",
        duration: 2000
      });
      return;
    }
    try {
      const res = await marketSvc.registerByCorporate(saveData);
      if (res.success) {
        registerForms.value = defaultValues;
        wx.showToast({
          title: "法人注册成功！",
          icon: "success",
          duration: 2000
        });
        wx.navigateTo({
          url: "/packageA/pages/login/login"
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
        title: "法人注册失败！",
        icon: "error",
        duration: 2000
      });
    }
  },

  onSelectConfirm(e: any) {
    const { value, text } = e.detail.value;
    batch(() => {
      showType.value = false;
      idType.value = text;
      idTypeId.value = value;
    });
  },

  onSelectsConfirm(e: any) {
    const { value, text } = e.detail.value;
    batch(() => {
      showTypes.value = false;
      typeName.value = text;
      typeId.value = value;
    });
  },

  onSelectIndustryConfirm(e: any) {
    const { value, text } = e.detail.value;
    batch(() => {
      showIndustryTypes.value = false;
      industryTypeName.value = text;
      industryTypeId.value = value;
    });
  },

  onSelectClose() {
    batch(() => {
      showType.value = false;
      idType.value = "";
    });
  },

  onSelectsClose() {
    batch(() => {
      showTypes.value = false;
      typeName.value = "";
    });
  },

  onSelectIndustryClose() {
    batch(() => {
      showIndustryTypes.value = false;
      industryTypeName.value = "";
    });
  },

  onSelectChange() {
    showType.value = true;
  },

  onSelectsChange() {
    showTypes.value = true;
  },

  onSelectIndustryChange() {
    showIndustryTypes.value = true;
  },

  changeTabs(e: any) {
    const { activeKey } = e.detail;
    key.value = activeKey;
  }
});
