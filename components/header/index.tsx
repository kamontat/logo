import include from "classnames";
import style from "./index.module.css";

export default function Header() {
  return (
    <nav className={style.nav}>
      <a className={include(style.logo, style.element)} href="#">
        Logo
      </a>
      <input className={include(style.searchbar, style.element)}></input>
      <button className={include(style.searchBtn, style.element)}>Search</button>
    </nav>
  );
}
