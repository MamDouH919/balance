import moment from "moment";

export const dateFormat = (date: any | null, lang?: string | null) =>
  date
    ? moment(date)
      .locale(lang ?? "en")
      .format("YYYY-MM-DD")
    : null;

    export const dateFormatLL = (date: string | null, lang?: string | null) =>
      date ? moment(date).locale(lang ?? "en").format("ll") : null;

export const dateTimeFormatA = (date: string | null,) =>
  date ? moment(date).format('D MMMM YYYY h:mm:ss a') : null;

export const dateTimeFormat = (date: string | null, lang?: string | null) =>
  date
    ? moment(date)
      .locale(lang ?? "en")
      .format("YYYY-MM-DD HH:MM:SS")
    : null;
