import { ImageJsonData } from "./jsondata";

export interface VerifiedImageMetadata extends ImageJsonData {
  code: string;
  key: string;
  fpath: string;
  urlpath: string;
  filename: string;
}
