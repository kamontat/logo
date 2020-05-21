import include from "classnames";
import style from "./index.module.css";

import { useState, Dispatch, SetStateAction } from "react";
import { NameResult } from "src/index/ntc";
import { ImagesMetadata } from "src/index/transform/loadImagesMetadata";

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

const unique = (list: Array<NameResult>) => {
  const seen = {};
  return list.filter(function (item) {
    return seen.hasOwnProperty(item.name) ? false : (seen[item.name] = true);
  });
};

interface Extra {
  images: ImagesMetadata;
}

export default function Card(_props: Extra) {
  const props = _props.images;

  const [copy, isCopied] = useState(false);

  const root = process.browser ? window.location.href : "";

  const copiedStyle = {};
  copiedStyle[style.copied] = true;
  copiedStyle[style.visible] = copy;
  copiedStyle[style.hidden] = !copy;

  return (
    <div className={style.root}>
      <div className={style.card}>
        <div className={style.imgContainer}>
          <a onClick={copyPath(root + props.urlpath, isCopied)}>
            <img className={style.img} src={props.urlpath} alt={props.filename}></img>
          </a>
        </div>
        <div className={style.detail}>
          <h1 className={style.title}>
            {props.filename} ({props.size.width}x{props.size.height})
          </h1>
          <div className={style.tags}>
            <ul>
              <li itemType="key" className={style.tag}>
                <a>{props.key}</a>
              </li>

              {props.tags.map((text, index) => {
                return (
                  <li key={index} itemType="tags" className={style.tag}>
                    <a>{text}</a>
                  </li>
                );
              })}
              {unique(props.palette).map((result, index) => {
                return (
                  <li key={index} itemType="palette" className={style.tag}>
                    <a>{result.name}</a>
                  </li>
                );
              })}
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
