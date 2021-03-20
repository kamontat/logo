import include from "classnames";
import style from "./index.module.css";

export default function Footer() {
  return (
    <footer className={style.footer}>
      <div>
        <h3 className={style.title}>All assets hosted on this website is for personal use only</h3>
        <h5 className={style.subtitle}>
          However, some images might owned by other company, please make sure before use.
          This website sourcecode hosted at <a className={style.link} href="https://github.com/kamontat/logo">github</a>.
        </h5>
        <div className={style.container}>
          <div className={style.leftContainer}>
            <a className={style.licenseLink} rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
              <figure className={include("image", "is-fullwidth")}>
                <img
                  className={style.licenseImg}
                  alt="Creative Commons License"
                  style={{ borderWidth: 0 }}
                  src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png"
                />
              </figure>
            </a>
          </div>
          <div className={style.rightContainer}>
            <div>
              This work is licensed under{" "}
              <a className={style.link} rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
                Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
              </a>
              .
            </div>
            <div>
              <small>
                As developer (<a className={style.link} href="https://github.com/kamontat">Kamontat Chantrachirathumrong</a>) I feel appreciate
                for everyone who visit our website, Have fun.
              </small>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
