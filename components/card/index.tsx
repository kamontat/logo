import type { ImageData } from "src/interfaces/images";
import { Dispatch, SetStateAction } from "react";

import Image from "next/image";
import Tags from "components/tags";

import style from "./index.module.css";

interface Props {
  images: ImageData;
  onClick: Dispatch<SetStateAction<boolean>>;
  onSelect: Dispatch<SetStateAction<ImageData>>;
}

export default function Card(_props: Props) {
  const props = _props.images;

  const select = () => {
    _props.onClick(v => !v);
    _props.onSelect(props);
  };

  return (
    <div className={style.root}>
      <div className={style.card}>
        <div className={style.imgContainer} onClick={select}>
          <Image
            className={style.img}
            src={"/" + props.urlpath}
            alt={props.filename}
            width={props.size.width}
            height={props.size.height}
          />
        </div>
        <div className={style.detail}>
          <h1 className={style.title}>
            {props.filename} ({props.size.width}x{props.size.height})
          </h1>

          <Tags name={props.tags} />
        </div>
      </div>
    </div>
  );
}
