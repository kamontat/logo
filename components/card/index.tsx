// import include from "classnames";
import style from "./index.module.css";

import { Images } from "pages/index/types";

export default function Card(props: Images) {
  return (
    <div className={style.card}>
      <img className={style.img} src={props.path} alt={props.name}></img>
      <div className={style.detail}>
        <h1>{props.name}</h1>
      </div>
    </div>
  );
}
