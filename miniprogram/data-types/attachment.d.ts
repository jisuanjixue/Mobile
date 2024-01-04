import { IBaseView } from "./response";

declare namespace AttachmentData {
  interface IAttachmentView extends IBaseView {
    fileName: string;
    fileExtension: string;
    fileUrl: string;
  }
}
