import { IBaseView } from "./response";

declare namespace FileCheckData {
  interface IItem {
    value: string;
    text: string;
  }
  interface IChildItem {
    item: {
      value: string;
      text: string;
    };
  }
  interface ISourceView extends IBaseView {
    item: IItem;
    children: IChildItem[];
  }
  interface IFileCheckView extends IBaseView {
    name: string;
    beginDate: Date;
    endDate: Date;
    status: number;
  }

  interface IOptionView {
    id: string;
    questionId: string;
    content: string;
    mutuallyExclusive: boolean;
    enableFillBlank: boolean;
    required: boolean;
    linkNumbers: number[];
  }

  interface IQuestionView {
    id: string;
    questionnaireId: string;
    title: string;
    description: string;
    type: number;
    required: true;
    optionSource: string;
    sort: number;
    number: number;
    hide: boolean;
    options: IOptionView[];
  }

  interface ISelectedOptions extends IBaseView {
    selectedOptionId: string;
    fillContent: string;
  }

  interface IMarketSubjectAnswerView {
    id: string;
    marketSubjectQuestionnaireId: string;
    answerString: string;
    guestQuestionnaireId: string;
    answerNumber: number;
    questionId: string;
    selectedOptions: ISelectedOptions[];
  }
  interface IFileCheckDetailView extends IFileCheckView {
    area: {
      provinceId: string;
      provinceName: string;
      cityId: string;
      cityName: string;
      districtId: string;
      districtName: string;
      streetId: string;
      streetName: string;
    };
    intro: string;
    videoUrl: string;
    endContent: string;
    videoDescription: string;
    questions: IQuestionView[];

    answers: IMarketSubjectAnswerView[];
  }

  interface IFileCheckUpdate {
    id: string;
    selectedOptionId: string;
    fillContent: string;
  }

  interface ISelectedOptions {
    id: string;
    selectedOptionId: string;
    fillContent: string;
  }

  interface IAnswers {
    id: string;
    guestQuestionnaireId: string;
    marketSubjectQuestionnaireId: string;
    questionId: string;
    answerString: string;
    answerNumber: number;
    selectedOptions: ISelectedOptions[];
  }
  interface IFileCheckCreate {
    answers: IAnswers[];
    submitted: boolean;
  }
}
