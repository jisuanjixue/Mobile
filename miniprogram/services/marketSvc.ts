import request from "../utils/request/request";
import { MarkData } from "../data-types/mark";
import { IResponseData, IResponseListData } from "../data-types/response";

const routePrefix = "/market-subject";

const register = (data: MarkData.IRegister) => request.post(`${routePrefix}/register`, data);
const login = (code: string, type?: string) => request.post(`${routePrefix}/login?code=${code}&type=${type}`);
const getOpenId = (code: string) => request.get(`${routePrefix}/open-id?code=${code}`);

const loginByPassword = (data: MarkData.ILogin) => request.post(`${routePrefix}/login-by-password`, data);
const registerByPersonal = (data: MarkData.IRegister) => request.post(`${routePrefix}/register-personal`, data);
const registerByCorporate = (data: MarkData.IRegisterCorporate) => request.post(`${routePrefix}/register-corporate`, data);

const refreshToken = (data: MarkData.IRefreshToken) => request.post(`${routePrefix}/refresh-token`, data);

const addMarkFavorite = (data: MarkData.IAddMarkFavorite) => request.post(`${routePrefix}/favorite`, data);
const deleMarkFavorite = (id: string) => request.delete(`${routePrefix}/favorite?id=${id}`);
const getMarkFavoriteList = (title: string, type: number, page: number, rows: number) =>
  request.get<IResponseData<MarkData.IMarkOrganization>>(
    `${routePrefix}/favorite/list?&title=${title}&type=${type}&page=${page}&rows=${rows}`
  );

const getOrganizationMark = (code: string) =>
  request.get<IResponseData<MarkData.IMarkOrganization>>(`${routePrefix}/get-organization?code=${code}`);

const getOrganizationInformList = (page: number, rows: number) =>
  request.get<IResponseListData<MarkData.InformList>>(`${routePrefix}/inform-list?page=${page}&rows=${rows}`);

const getOrganizationById = () => request.get<IResponseData<MarkData.IMarkSubject>>(`${routePrefix}/get-organization-by-id`);
const updateOrganization = (data: MarkData.IMarkSubject) => request.post(`${routePrefix}/update-organization`, data);

const delList = (data: string[]) => request.delete(`${routePrefix}`, data);
const haveAdded = (type: number, targetId: string) =>
  request.get<IResponseData<MarkData.IFavorite>>(`${routePrefix}/favorite/have-added?type=${type}&targetId=${targetId}`);

export default {
  getOrganizationInformList,
  register,
  login,
  getOrganizationMark,
  addMarkFavorite,
  deleMarkFavorite,
  getMarkFavoriteList,
  refreshToken,
  delList,
  haveAdded,
  loginByPassword,
  registerByCorporate,
  registerByPersonal,
  getOrganizationById,
  updateOrganization,
  getOpenId
};
