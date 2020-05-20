// import include from "classnames";
import style from "./index.module.css";

import { Images } from "pages/index/types";

const copyPath = (text: string) => {
  return () => {
    console.log(`copying: ${text}`);
    const tmp = document.createElement("textarea");
    // tmp.style.display = "none";
    tmp.innerText = text;
    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand("copy");
    tmp.remove();
  };
};

export default function Card(props: Images) {
  const root = process.browser ? window.location.href : "";

  return (
    <div className={style.card}>
      <a onClick={copyPath(root + props.path)}>
        <img className={style.img} src={props.path} alt={props.filename}></img>
      </a>
      <div className={style.detail}>
        <h1 className={style.title}>
          {props.filename} ({props.size.width}x{props.size.height})
        </h1>
        <div className={style.tags}>
          {props.tags.map((text, index) => {
            return (
              <span itemType="tags" key={index} className={style.tag}>
                {text}
              </span>
            );
          })}

          <span itemType="width" className={style.tag}>
            W-{props.size.width}px
          </span>

          <span itemType="height" className={style.tag}>
            H-{props.size.height}px
          </span>

          {/* 
          {props.palette.map((text, index) => {
            return (
              <span itemType="palette" key={index} className={style.tag}>
                {text.name}
              </span>
            );
          })} */}
        </div>
      </div>
    </div>
  );
}
