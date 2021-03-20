import { ImageJsonData } from "./jsondata";

export type Version = "v2";

export type ImageMetadata = {
  version: Version;

  key: string;
  rpath: string; // relative from public folder to image folder
  ipath: string; // full path to image folder
  fpath: string; // metadata path

  raw: ImageJsonData[];
};
