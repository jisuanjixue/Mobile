/*
 * @Author: jet 329463934@qq.com
 * @Date: 2023-03-14 11:43:29
 * @LastEditors: jet 329463934@qq.com
 * @LastEditTime: 2023-03-14 11:44:26
 * @FilePath: /miniprogram-3/miniprogram/data-types/base.d.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
interface IResponse {
  total: number;
  success: boolean;
  errorCode: number;
  errorMessage: string | undefined;
}

interface IResponseData<T> extends IResponse {
  data: T | undefined;
}

interface IResponseListData<T> extends IResponse {
  data: T[] | undefined;
}
export interface ISelectListItem {
  value: any;
  text: string;
}

export interface IBaseView {
  id?: string;
}
