import { Dispatch, SetStateAction, ChangeEvent, MouseEvent } from "react";

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

  return (
    <nav className={style.nav}>
      <a className={include(style.logo, style.element)} href="#">
        Logo
      </a>
      <input
        type="text"
        name="search"
        placeholder={`search through over ${props.size} images`}
        className={include(style.searchbar, style.element)}
        onChange={searching}
      ></input>
    </nav>
  );
}
