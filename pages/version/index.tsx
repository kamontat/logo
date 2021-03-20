import pjson from "package.json";

import style from "./index.module.css";

const locale = "en-US";
const format: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour12: false,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZoneName: "short",
};

export default function Version() {
  const timestamp = process.env.buildtime;
  const date = new Date(timestamp);
  const dateStr = date.toLocaleString(locale, format);

  return (
    <div className={style.container}>
      <h1 className={style.title}>
        {pjson.name}: {pjson.version} ({dateStr})
      </h1>
    </div>
  );
}
