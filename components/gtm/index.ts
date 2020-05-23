import { createContext } from "react";

export interface Data {
  gtmId: string;
  dataLayer: any[];
}

const GoogleTagManagerContext = createContext<Data>({
  gtmId: "GTM-TNXHV84",
  dataLayer: [],
});

export default GoogleTagManagerContext;
