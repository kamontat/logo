import App from "next/app";
import TagManager from "react-gtm-module";

import GoogleTagManagerContext, { Data } from "components/gtm";

import "../styles/minireset.css";
import "../styles/index.css";

const gtm: Data = {
  gtmId: "GTM-TNXHV84",
  dataLayer: [],
};

export function reportWebVitals({ id, name, label, value }) {
  (gtm.dataLayer as object[]).push({
    event: "performance",
    event_category: label === "web-vital" ? "Web Vitals" : "Next.js Metric",
    event_action: name,
    event_label: id,
    event_value: Math.round(name === "CLS" ? value * 1000 : value),
    non_interaction: true,
  });
}

class MyApp extends App {
  state = {
    gtm,
  };

  componentDidMount() {
    TagManager.initialize(this.state.gtm);
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <GoogleTagManagerContext.Provider key="gtm" value={this.state.gtm}>
        <Component {...pageProps} />
      </GoogleTagManagerContext.Provider>
    );
  }
}

export default MyApp;
