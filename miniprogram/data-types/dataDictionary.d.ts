import { IBaseView } from "./response";

declare namespace DataDictionaryData {
  interface IItemsView extends IBaseView {
    name: string;
    code: string;
  }
}
