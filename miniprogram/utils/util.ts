import host from "../utils/request/apiConfig";
import tokenUtils from "./tokenUtils";

const formatNumber = (n: number) => {
  const s = n.toString();
  return s[1] ? s : "0" + s;
};

const querySelect = (selector: any) => {
  return new Promise(resolve => {
    // 获取Image组件的高度-API
    const query = wx.createSelectorQuery();
    query.select(selector).boundingClientRect();
    // 执行拿回结果
    query.exec(res => {
      resolve(res);
    });
  });
};

/*获取当前页url*/
const getCurrentPageUrl = (): string => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const url = currentPage.route;
  return url;
};

const isType = (data: any, type: string): boolean => {
  const typeObj = {
    "[object String]": "string",
    "[object Number]": "number",
    "[object Boolean]": "boolean",
    "[object Null]": "null",
    "[object Undefined]": "undefined",
    "[object Object]": "object",
    "[object Array]": "array",
    "[object Function]": "function",
    "[object Date]": "date", // Object.prototype.toString.call(new Date())
    "[object RegExp]": "regExp",
    "[object Map]": "map",
    "[object Set]": "set",
    "[object HTMLDivElement]": "dom", // document.querySelector('#app')
    "[object WeakMap]": "weakMap",
    "[object Window]": "window", // Object.prototype.toString.call(window)
    "[object Error]": "error", // new Error('1')
    "[object Arguments]": "arguments"
  };

  const name = Object.prototype.toString.call(data); // 借用Object.prototype.toString()获取数据类型
  const typeName = typeObj[name] || "未知类型"; // 匹配数据类型
  return typeName === type; // 判断该数据类型是否为传入的类型
};

const unique = (arr: any[], key: string) => {
  if (!arr) return arr;
  if (key === undefined) return [...new Set(arr)];
  const map = {
    string: (e: { [x: string]: any }) => e[key],
    function: (e: any) => key(e)
  };
  const fn = map[typeof key];
  const obj = arr.reduce((o, e) => ((o[fn(e)] = e), o), {});
  return Object.values(obj);
};

const arrGroup = (arr: any, fn: any) => {
  const obj = {};
  arr.forEach(item => {
    const key = JSON.stringify(fn(item));
    obj[key] = obj[key] || [];
    obj[key].push(item);
  });
  return Object.keys(obj).map(k => {
    return obj[k];
  });
};

function deleteChildren(arr: any[]) {
  const childs = arr;
  for (let i = childs.length; i--; i > 0) {
    if (childs[i].children) {
      if (childs[i].children.length) {
        this.deleteChildren(childs[i].children);
      } else {
        delete childs[i].children;
      }
    }
  }
  return arr;
}

function isValidChinesePhoneNumber(phoneNumber) {
  const regex = /^1[3-9]\d{9}$/;
  return regex.test(phoneNumber);
}

const findLocation = (data: any, value: string) => {
  for (let i = 0; i < data?.length; i++) {
    if (data?.[i]?.value === value) {
      return data?.[i]?.text;
    }
    if (data?.[i]?.children) {
      const found: any = findLocation(data?.[i]?.children, value);
      if (found) {
        return data?.[i]?.text + found;
      }
    }
  }
};

const getFileType = (fileName: string) => {
  let suffix = ""; // 后缀获取
  let result = ""; // 获取类型结果
  if (fileName) {
    const flieArr = fileName.split("."); // 根据.分割数组
    suffix = flieArr[flieArr.length - 1]; // 取最后一个
  }
  if (!suffix) return false; // fileName无后缀返回false
  suffix = suffix.toLocaleLowerCase(); // 将后缀所有字母改为小写方便操作
  // 匹配图片
  const imgList = ["png", "jpg", "jpeg", "bmp", "gif"]; // 图片格式
  result = imgList.find(item => item === suffix);
  if (result) return "image";
  // 匹配txt
  const txtList = ["txt"];
  result = txtList.find(item => item === suffix);
  if (result) return "txt";
  const zipList = ["rar", "zip", "7z"];
  result = zipList.find(item => item === suffix);
  if (result) return "zip";
  // 匹配视频
  const videoList = ["mp4", "m2v", "mkv", "rmvb", "wmv", "avi", "flv", "mov", "m4v"];
  result = videoList.find(item => item === suffix);
  if (result) return "video";
  // 匹配音频
  const radioList = ["mp3", "wav", "wmv"];
  result = radioList.find(item => item === suffix);
  if (result) return "radio";

  const file = ["doc", "docx", "pdf", "ppt", "pptx", "xls", "xlsx"];
  result = file.find(item => item === suffix);
  if (result) return "file";
  // 其他文件类型
  return "other";
};

const formatLaber = (html: string) => {
  return html?.replace(/<(img).*?(\/>|<\/img>)/g, function (mats) {
    if (mats.indexOf("style") < 0) {
      return mats?.replace(/<\s*img/, '<img style="max-width:100%;height:auto;"');
    } else {
      return mats?.replace(/style=("|')/, "style=$1max-width:100%;height:auto;");
    }
  });
};

const formatStyle = (html: string) => {
  return html?.replace(/style="([^"]*)"/g, function (match, p1) {
    return `style="${p1}; line-height: 2.2; font-size: 14px "`;
  });
};

const formatImg = (html: string) => {
  return html?.replace(/<img[^>]+src="([^">]+)"/g, function (mats) {
    return mats?.replace(/\/upload/, `${host.api.baseUrl}/upload`);
  });
};

/**
 * @param {string} uploadFile 需要上传的文件
 * @description 上传到指定服务器
 * @return {Promise} 上传图片的promise
 */
const uploadFile = uploadFile => {
  const token = tokenUtils.getToken();
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${host.api.baseUrl}/attachment/upload-stream`, // 上传的服务器接口地址
      filePath: uploadFile,
      name: "file", //上传的所需字段，后端提供
      header: {
        // "Content-Type": "multipart/form-data",
        Authorization: `bearer ${token?.accessToken}`
      },
      success: res => {
        // 上传完成操作
        const data = JSON.parse(res.data);
        const { fileUrl, fileName, fileExtension, id } = data.data;
        resolve({
          fileUrl,
          fileName,
          fileExtension,
          id
        });
      },
      fail: err => {
        //上传失败：修改pedding为reject
        reject(err);
      }
    });
  });
};

const handMarginTop = (deviceBarHeight: number) => {
  if (deviceBarHeight === 142) return 185;
  if (deviceBarHeight === 124 || deviceBarHeight === 125) return 208;
  if (deviceBarHeight === 164) return 225;
  if (deviceBarHeight === 168) return 200;
  if (deviceBarHeight === 144) return 190;
  if (deviceBarHeight === 174) return 195;
  if (deviceBarHeight === 153) return 215;
  return 190;
};

export default {
  formatNumber,
  getCurrentPageUrl,
  isType,
  querySelect,
  unique,
  arrGroup,
  getFileType,
  formatLaber,
  deleteChildren,
  formatImg,
  handMarginTop,
  findLocation,
  formatStyle,
  uploadFile,
  isValidChinesePhoneNumber
};
