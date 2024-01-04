import { IBaseView } from "./response";

declare namespace SingleMarketData {
  interface IAttachments {
    fileName: string;
    fileExtension: string;
    fileUrl: string;
    id: string;
  }

  interface ICaseDetail {
    id: string;
    title: string;
    caseNo: string;
    upTime: Date;
    industryName: string;
    keyword: string;
    description: string;
    attachment: IAttachments[];
  }

  interface IIssueDetail {
    id: string;
    title: string;
    subjectTypeName: string;
    publishTime: Date;
    issueNo: string;
    industryName: string;
    categoryName: string;
    keyword: string;
    description: string;
    attachment: IAttachments[];
  }

  interface IAdmonitionDetail {
    id: string;
    title: string,
    issueId: number,
    departmentName: string,
    appointmentTime: Date,
    opinion: string,
    result: string
    attachment: IAttachments[]
  }

  interface IIssueListView extends IBaseView {
    title: string;
    subjectTypeName: string;
    publishTime: Date;
    issueNo: string;
    industryName: string;
    categoryName: string;
    keyword: string;
    description: string;
    attachment: IAttachments[];
  }

  interface ICaseListView extends IBaseView {
    title: string;
    caseNo: string;
    upTime: Date;
    industryName: string;
    keyword: string;
    description: string;
    attachment: IAttachments[];
  }

  interface IAdmonitionListView extends IBaseView {
    title: string;
    issueId: string;
    departmentName: string;
    appointmentTime: Date;
    opinion: string;
    result: string;
  }
}
