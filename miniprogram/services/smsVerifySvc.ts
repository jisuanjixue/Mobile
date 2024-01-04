import request from "../utils/request/request";

const routePrefix = "/sms-verify-code";

const sendCode = (phoneNumber: string) => request.post(`${routePrefix}/send?phoneNumber=${phoneNumber}`);

export default { sendCode };
