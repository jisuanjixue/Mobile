import { IBaseView } from "./response";

declare namespace AdministrativeData {
  interface IArea {
    provinceId: string;
    provinceName: string;
    cityId: string;
    cityName: string;
    districtId: string;
    districtName: string;
    streetId: string;
    streetName: string;
  }

  interface IAdministrativeView extends IBaseView {
    name: string;
    code: string;
    url: string;
    averageReviewScore: string;
    area: IArea;
  }
}
