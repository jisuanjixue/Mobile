let baseUrlPrefix = "";
let baseFilePrefix = "";
// const hostApiDev = "http://172.16.6.20:8082";
// const hostApiDev = "http://10.211.255.228:8082";
const hostApiDev = "https://yndrc.yn.gov.cn:8084";
const hostApiTrial = "https://yndrc.yn.gov.cn:8084";
const hostApiProd = "https://yndrc.yn.gov.cn:8084";
const file = "https://yndrc.yn.gov.cn:8084";
const accountInfo = wx.getAccountInfoSync();
const env = accountInfo.miniProgram.envVersion;

switch (env) {
  case "develop":
    baseUrlPrefix = hostApiDev;
    baseFilePrefix = file;
    break;
  case "trial":
    baseUrlPrefix = hostApiTrial;
    baseFilePrefix = file;
    break;
  case "release":
    baseUrlPrefix = hostApiProd;
    baseFilePrefix = file;
    break;
}

const api = {
  baseUrl: baseUrlPrefix,
  fileUrl: baseFilePrefix
  //其他相关变量
};

export default { api, file };
