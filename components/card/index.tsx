import style from "./index.module.css";

import { Dispatch, SetStateAction } from "react";

import Tags from "components/tags";

import { ImagesMetadata } from "src/index/transform/loadImagesMetadata";

interface Props {
  images: ImagesMetadata;
  onClick: Dispatch<SetStateAction<boolean>>;
  onSelect: Dispatch<SetStateAction<ImagesMetadata>>;
}

export default function Card(_props: Props) {
  const props = _props.images;

  const select = () => {
    _props.onClick((v) => !v);
    _props.onSelect(props);
  };

  return (
    <div className={style.root}>
      <div className={style.card}>
        <div className={style.imgContainer}>
          <a onClick={select}>
            <img className={style.img} src={props.urlpath} alt={props.filename}></img>
          </a>
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
