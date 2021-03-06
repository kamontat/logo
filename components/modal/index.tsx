import type { ImageData } from "src/interfaces/images";

import { useState, Dispatch, SetStateAction, MouseEvent, useEffect } from "react";

import include from "classnames";
import style from "./index.module.css";

import { emptyImageData } from "src/interfaces/images";
import Tags from "components/tags";

export interface Props {
  image?: ImageData;
  show: boolean;
  toggle: Dispatch<SetStateAction<boolean>>;
}

const copyPath = (text: string, isCopied: Dispatch<SetStateAction<boolean>>) => {
  return () => {
    const tmp = document.createElement("textarea");
    tmp.innerText = text;
    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand("copy");
    tmp.remove();
    isCopied(true);

    setTimeout(() => isCopied(false), 1000);
  };
};

const unique = (list: string[]) => {
  const seen = new Map();
  return list.filter(function (item) {
    const emptyness = item !== undefined && item !== null && item !== "";
    const uniqueness = seen.has(item) && seen.get(item) ? false : seen.set(item, true);

    return emptyness && uniqueness;
  });
};

export default function Modal(props: Props) {
  let image = props.image ?? emptyImageData();
  useEffect(() => {
    image = props.image ?? emptyImageData();
  }, [props.image]);

  const [copy, isCopied] = useState(false);

  const root = process.browser ? window.location.origin : "";
  const path = root + "/" + image.urlpath; // Add '/' between root url and image url

  const styles = {};
  styles[style.modal] = true;
  styles[style.hide] = !props.show;
  styles[style.display] = props.show;

  const copiedStyle = {};
  copiedStyle[style.notification] = true;
  copiedStyle[style.hide] = !copy;
  copiedStyle[style.display] = copy;

  const toggle = (event: MouseEvent<unknown>) => {
    event.preventDefault();
    event.stopPropagation();

    props.toggle(v => !v);
  };

  const outsideToggle = (event: MouseEvent<unknown>) => {
    if (event.target instanceof Element) {
      const role = event.target.getAttribute("role");
      if (role === "ModalrootContainer" || role === "cancelAction") {
        toggle(event);
      }
    }
  };

  const tags = unique([image.key, image.ext, image.mime].concat(image.tags));

  return (
    <div role="ModalrootContainer" onClick={outsideToggle} className={include(styles)}>
      <div className={include(style.main, style.container)}>
        <div className={style.imageContainer}>
          <figure>
            <img className={style.img} src={image.urlpath} alt={image.filename}></img>
          </figure>
        </div>
        <div className={style.bodyContainer}>
          <div className={style.titleContainer}>
            <div className={style.metadata}>
              <span className={style.lead}>name</span>
              <span className={style.lead}>{image.filename}</span>
            </div>
            <div className={style.separator}></div>
            <div className={style.metadata}>
              <span className={style.key}>width</span>
              <span className={style.key}>height</span>
              <span className={style.value}>{image.size.width}</span>
              <span className={style.value}>{image.size.height}</span>
            </div>
          </div>
        </div>

        <div className={style.footerContainer}>
          <Tags name={tags}></Tags>
        </div>
        <div className={style.actionContainer}>
          <button onClick={copyPath(path, isCopied)} className={include(style.button, style.secondary)}>
            <svg className={style.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="m4 6.75c0-2.619 2.131-4.75 4.75-4.75h9.133c-.329-1.151-1.378-2-2.633-2h-11.5c-1.517 0-2.75 1.233-2.75 2.75v15.5c0 1.517 1.233 2.75 2.75 2.75h.25z" />
              <path d="m20.25 4h-11.5c-1.517 0-2.75 1.233-2.75 2.75v14.5c0 1.517 1.233 2.75 2.75 2.75h11.5c1.517 0 2.75-1.233 2.75-2.75v-14.5c0-1.517-1.233-2.75-2.75-2.75zm-2 17h-7.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h7.5c.414 0 .75.336.75.75s-.336.75-.75.75zm0-4h-7.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h7.5c.414 0 .75.336.75.75s-.336.75-.75.75zm0-3.5h-7.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h7.5c.414 0 .75.336.75.75s-.336.75-.75.75zm0-4h-7.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h7.5c.414 0 .75.336.75.75s-.336.75-.75.75z" />
            </svg>
            <span>Copy</span>
          </button>
          <a href={image.urlpath} download={image.filename} className={include(style.button, style.primary)}>
            <svg className={include(style.icon)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
            </svg>
            <span>Download</span>
          </a>
          <button role="cancelAction" onClick={toggle} className={include(style.button, style.cancellation)}>
            <svg className={include(style.icon)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 492 492">
              <path d="M300.188,246L484.14,62.04c5.06-5.064,7.852-11.82,7.86-19.024c0-7.208-2.792-13.972-7.86-19.028L468.02,7.872c-5.068-5.076-11.824-7.856-19.036-7.856c-7.2,0-13.956,2.78-19.024,7.856L246.008,191.82L62.048,7.872c-5.06-5.076-11.82-7.856-19.028-7.856c-7.2,0-13.96,2.78-19.02,7.856L7.872,23.988c-10.496,10.496-10.496,27.568,0,38.052L191.828,246L7.872,429.952c-5.064,5.072-7.852,11.828-7.852,19.032c0,7.204,2.788,13.96,7.852,19.028l16.124,16.116c5.06,5.072,11.824,7.856,19.02,7.856c7.208,0,13.968-2.784,19.028-7.856l183.96-183.952l183.952,183.952c5.068,5.072,11.824,7.856,19.024,7.856h0.008c7.204,0,13.96-2.784,19.028-7.856l16.12-16.116c5.06-5.064,7.852-11.824,7.852-19.028c0-7.204-2.792-13.96-7.852-19.028L300.188,246z" />
            </svg>
            <span>Cancel</span>
          </button>
        </div>

        <div className={include(copiedStyle)}>
          <div className={style.container}>
            <h5>copied</h5>
          </div>
        </div>
      </div>
    </div>
  );
}
