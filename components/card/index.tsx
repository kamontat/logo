import include from "classnames";
import style from "./index.module.css";

import { Images } from "src/index/types";
import { useState, Dispatch, SetStateAction } from "react";

const copyPath = (text: string, isCopied: Dispatch<SetStateAction<boolean>>) => {
  return () => {
    console.log(`copying: ${text}`);
    const tmp = document.createElement("textarea");
    // tmp.style.display = "none";
    tmp.innerText = text;
    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand("copy");
    tmp.remove();
    isCopied(true);

    setTimeout(() => isCopied(false), 1000);
  };
};

interface Extra {
  filtering: string;
}

export default function Card(props: Images & Extra) {
  const [copy, isCopied] = useState(false);

  const root = process.browser ? window.location.href : "";

  const copiedStyle = {};
  copiedStyle[style.copied] = true;
  copiedStyle[style.visible] = copy;
  copiedStyle[style.hidden] = !copy;

  return (
    <div className={style.root}>
      <div className={style.card}>
        <a onClick={copyPath(root + props.path, isCopied)}>
          <img className={style.img} src={props.path} alt={props.filename}></img>
        </a>
        <div className={style.detail}>
          <h1 className={style.title}>
            {props.filename} ({props.size.width}x{props.size.height})
          </h1>
          <div className={style.tags}>
            <ul>
              {props.tags.map((text, index) => {
                return (
                  <li key={index} itemType="tags" className={style.tag}>
                    <a>{text}</a>
                  </li>
                );
              })}

              {/* {props.color.name && (
                <li key="color" itemType="color" className={style.tag}>
                  <a>{props.color.name}</a>
                </li>
              )} */}
              {props.palette.map((result, index) => {
                return (
                  <li key={index} itemType="palette" className={style.tag}>
                    <a>{result.name}</a>
                  </li>
                );
              })}

              {/* <li key="width" itemType="width" className={style.tag}>
                <a>W{props.size.width}px</a>
              </li>
              <li key="height" itemType="height" className={style.tag}>
                <a>H{props.size.height}px</a>
              </li> */}
            </ul>
          </div>
        </div>
        <div className={include(copiedStyle)}>
          <div className={style.copiedContainer}>
            <h5>copied</h5>
          </div>
        </div>
      </div>
    </div>
  );
}
