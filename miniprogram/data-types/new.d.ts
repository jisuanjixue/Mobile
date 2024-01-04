import { IBaseView } from "./response";

declare namespace NewData {
  interface IArticleView extends IBaseView {
    title: string;
    postTime: Date;
    summary: string;
    linkUrl: string;
    mainImage: string;
    sort: number;
  }

  interface IArticleDetail extends IBaseView {
    title: string;
    categoryName: string;
    postTime: Date;
    author: string;
    summary: string;
    linkUrl: string;
    mainImage: string;
    content: string;
    sort: number;
  }
  interface IBanner extends IBaseView {
    title: string;
    postTime: Date;
    summary: string;
    linkUrl: string;
    mainImage: string;
    sort: number;
  }

  interface IArticleCategory extends IBaseView {
    name: string;
    code: string;
    sort: number;
  }

  interface DistrictItem {
    code: string;
    name: string;
    level: string;
  }
  interface IDistrict extends IBaseView {
    code: string;
    name: string;
    level: string;
    children: DistrictItem[];
  }
}
