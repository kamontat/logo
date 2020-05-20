import App from "next/app";
import TagManager, { TagManagerArgs } from "react-gtm-module";

import "../styles/minireset.css";
import "../styles/index.css";

const gtm: TagManagerArgs = {
  gtmId: "GTM-TNXHV84",
  dataLayerName: "dataLayer",
};

class MyApp extends App {
  componentDidMount() {
    TagManager.initialize(gtm);
  }

  render() {
    const { Component, pageProps } = this.props;

    return <Component {...pageProps} />;
  }
}

export default MyApp;
