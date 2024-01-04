import marketSvc from "../services/marketSvc";
import tokenUtils from "./tokenUtils";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, consistent-return

const getAccessToken = async (type: string) => {
  const result = await wx.login();
  const res: any = await marketSvc.login(result.code, type);
  const { accessToken, refreshToken, weixinOpenId, name, avatar, phoneNumber } = res.data;
  tokenUtils.setToken({ accessToken: accessToken, refreshToken: refreshToken });
  tokenUtils.setOpenId(weixinOpenId);
  wx.setStorageSync("name", name);
  wx.setStorageSync("type", type);
  wx.setStorageSync("avatar", avatar);
  wx.setStorageSync("phoneNumber", phoneNumber);
  return res;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const refreshToken = async () => {
  const token = tokenUtils.getToken();
  const res: any = await marketSvc.refreshToken(token);
  return res;
};

export default { refreshToken, getAccessToken };
