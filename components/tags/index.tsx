// import include from "classnames";
import style from "./index.module.css";

interface Props {
  name: string[];
}

export default function Tags(props: Props) {
  return (
    <div className={style.tags}>
      <ul>
        {props.name.map((name, index) => {
          return (
            <li key={index} className={style.tag}>
              <span className={style.title}>{name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
