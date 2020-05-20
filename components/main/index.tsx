// import include from "classnames";
import style from "./index.module.css";

export interface MainProps {
  children: React.ReactNode;
}

export default function Main(props: MainProps) {
  return <div className={style.mainContainer}>{props.children}</div>;
}
