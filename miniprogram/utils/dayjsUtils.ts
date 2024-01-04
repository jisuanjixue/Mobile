import dayjs, { Dayjs } from "dayjs";

type TDate = string | Date | undefined | Dayjs;

/**
 * 将秒格式化为时间
 * @param seconds
 * @returns
 */
const formatTimeBySeconds = (seconds: number | undefined): string => {
  if ((seconds ?? 0) >= 0) {
    const date = dayjs(new Date(seconds! * 1000));
    return date.add(-8, "h").format("HH:mm:ss");
  }
  return "";
};

const convertToDayjs = (value: TDate): Dayjs | undefined => {
  if (!value) return undefined;

  const val = dayjs(value);
  if (val.isValid()) return val;

  return undefined;
};

const format = (dateTime: TDate, template: string): string | undefined => {
  if (!dateTime) return "";

  const date = convertToDayjs(dateTime);
  return date?.format(template);
};

const formatDate = (dateTime: TDate): string | undefined => format(dateTime, "YYYY-MM-DD");

const formatDateTime = (dateTime: TDate): string | undefined => format(dateTime, "YYYY-MM-DD HH:mm");
const formatTime = (dateTime: TDate): string | undefined => format(dateTime, "HH:mm");

const coventToDate = (val: TDate): Date | undefined => {
  if (!val) return undefined;

  return dayjs(val).toDate();
};

const parseTime = (value: number): number => dayjs().subtract(value, "day").unix();

// formatTimeToDesc 格式化时间为描述，如刚刚 2分钟前
const formatTimeToDesc = (dateTimeStamp = 0) => {
  let result = "";
  if (dateTimeStamp <= 0) {
    return result;
  }
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = month * 12;
  const diffValue = new Date().getTime() - dateTimeStamp * 1000;
  // 防止刚发布的显示不对
  if (diffValue < 0) {
    return "刚刚";
  }
  const yearCount = diffValue / year;
  const monthCount = diffValue / month;
  const weekCount = diffValue / (7 * day);
  const dayCount = diffValue / day;
  const hourCount = diffValue / hour;
  const minCount = diffValue / minute;
  if (yearCount >= 1) {
    const time = parseInt(`${yearCount}`, 10);
    if (time === 1) result = "年";
    else result = `${time}年`;
  } else if (monthCount >= 1) {
    const time = parseInt(`${monthCount}`, 10);
    result = `${time}月前`;
  } else if (weekCount >= 1) {
    const time = parseInt(`${weekCount}`, 10);
    result = `${time}周前`;
  } else if (dayCount >= 1) {
    const time = parseInt(`${dayCount}`, 10);
    result = `${time}天前`;
  } else if (hourCount >= 1) {
    const time = parseInt(`${hourCount}`, 10);
    result = `${time}小时前`;
  } else if (minCount >= 1) {
    const time = parseInt(`${minCount}`, 10);
    result = `${time}分钟前`;
  } else result = "";
  return result;
};

export default {
  formatTimeBySeconds,
  format,
  formatDate,
  formatDateTime,
  convertToDayjs,
  coventToDate,
  parseTime,
  formatTimeToDesc,
  formatTime
};
