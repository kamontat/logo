// import include from "classnames";
import style from "./index.module.css";

export interface GridProps {
  children: React.ReactNode;
}

export default function Grid(props: GridProps) {
  return <div className={style.gridLayout}>{props.children}</div>;
}
