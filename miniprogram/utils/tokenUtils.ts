import { MarkData } from "../data-types/mark";
// eslint-disable-next-line no-undef
const keyToken = "token";
const keyToOpenId = "openId";
const keyLoginTab = "loginTab";

type TToken = MarkData.IUserLoginResponse;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const setToken = (token: TToken) => {
  wx.setStorageSync(keyToken, token);
};
const setTab = (tab: string) => {
  wx.setStorageSync(keyLoginTab, tab);
};

const setOpenId = (openId: string) => {
  wx.setStorageSync(keyToOpenId, openId);
};

// eslint-disable-next-line consistent-return
const getToken = () => {
  try {
    return wx.getStorageSync(keyToken);
  } catch (e) {
    return undefined;
  }
};

const getOpenId = () => {
  try {
    return wx.getStorageSync(keyToOpenId);
  } catch (e) {
    return undefined;
  }
};
const getTab = () => {
  try {
    return wx.getStorageSync(keyLoginTab);
  } catch (e) {
    return undefined;
  }
};

const isAuthorized = (): boolean => {
  const token = getToken();
  return token ? true : false;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const clear = () => {
  wx.clearStorageSync();
};

export default { setToken, getToken, clear, isAuthorized, setOpenId, getOpenId, setTab, getTab };
