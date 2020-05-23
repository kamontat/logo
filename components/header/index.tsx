import { Dispatch, SetStateAction, ChangeEvent } from "react";

import include from "classnames";
import style from "./index.module.css";

interface HeaderProps {
  size: number;
  onSearch: Dispatch<SetStateAction<string>>;
}

export default function Header(props: HeaderProps) {
  const searching = (event: ChangeEvent<HTMLInputElement>) => {
    props.onSearch(event.target.value);
  };

  const messageStyles = {};
  messageStyles[style.element] = true;
  messageStyles[style.text] = true;
  messageStyles[style.pass] = props.size > 100;
  messageStyles[style.warn] = props.size > 50 && props.size <= 100;
  messageStyles[style.error] = props.size <= 50;

  return (
    <nav className={style.nav}>
      <a className={include(style.element, style.text, style.title)} href="#">
        Logo
      </a>
      <input
        type="text"
        name="search"
        placeholder={`search through over ${props.size} images`}
        className={include(style.searchbar, style.element)}
        onChange={searching}
      ></input>
      <span className={include(messageStyles)}>{props.size}</span>
    </nav>
  );
}
