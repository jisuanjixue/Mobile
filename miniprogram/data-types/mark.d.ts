import { IBaseView } from "./response";

declare namespace MarkData {
  interface IRegister {
    name: string;
    phoneNumber: string;
    idTypeId: string;
    idNumber: string;
    smsVerifyCode: string;
    password: string;
    openId?: string;
  }
  interface ILogin {
    phoneNumber: string;
    smsVerifyCode: string;
    password: string;
    type: number;
  }
  interface IMarkSubject {
    typeId: string;
    industryTypeId: string;
    name: string;
    registeredCapital: number;
  }
  interface IRegisterCorporate {
    name: string;
    code: string;
    idTypeId: string;
    phoneNumber: string;
    smsVerifyCode: string;
    password: string;
  }

  interface ILogin extends IBaseView {
    name: string;
    phoneNumber: string;
    avatar: string;
    weixinOpenId: string;
    type: string;
    accessToken: string;
    refreshToken: string;
  }
  interface ILoginByPassword extends IBaseView {
    name: string;
    phoneNumber: string;
    avatar: string;
    weixinOpenId: string;
    accessToken: string;
    refreshToken: string;
  }

  interface IMarkOrganization extends IBaseView {
    typeName: string;
    name: string;
    code: string;
  }
  interface InformList extends IBaseView {
    informItemName: string;
    generateTime: Date;
    attachment: {
      id: string;
      fileName: string;
      fileExtension: string;
      fileUrl: string;
    };
  }
  interface IMarkFavoriteList extends IBaseView {
    type: string;
    targetId: string;
    title: string;
    summary: string;
    image: string;
  }
  interface IAddMarkFavorite {
    type: number;
    targetId: string;
    title: string;
    summary: string;
    image: string;
  }
  interface IUserLoginResponse {
    accessToken: string;
    refreshToken: string;
  }
  interface IFavorite extends IBaseView {
    type: string;
    targetId: string;
    title: string;
    summary: string;
    image: string;
  }

  interface IRefreshToken {
    refreshToken: string;
    accessToken: string;
  }
}
