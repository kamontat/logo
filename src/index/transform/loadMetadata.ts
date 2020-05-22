import path from "path";
import fs from "fs";

import { TransformerFn } from "../transformer";
import { ImageSize } from "../types";

type Filenames = string[];

export interface RawImagedata {
  code: string;
  ext: string;
  tags: string[];
  size?: ImageSize;
  color?: string;
  palette?: string[];
}

export interface RawImagesdata {
  images: RawImagedata[];
}

export type Metadata = {
  key: string;
  rpath: string; // relative from public folder to image folder
  ipath: string; // full path to image folder
  fpath: string; // metadata path
  raw: RawImagesdata;
};

export const loadMetadata: TransformerFn<Filenames, Promise<Metadata[]>> = (t) => {
  const publicDirectory = path.join(process.cwd(), "public");

  const imageURLPath = path.join("images");
  const imageDirectory = path.join(publicDirectory, imageURLPath);
  const metadataDirectory = path.join(publicDirectory, "metadata");

  return new Promise<Metadata[]>((res) => {
    const result = t.flatMap((filename) => {
      const key = path.basename(filename, ".json");

      const rpath = path.join(imageURLPath, key); // relative path start from public folder
      const ipath = path.join(imageDirectory, key); // full path
      const fpath = path.join(metadataDirectory, filename);
      const raw = fs.readFileSync(fpath, "utf8");
      const json = JSON.parse(raw) as RawImagesdata;

      return {
        key,
        ipath,
        rpath,
        fpath,
        raw: json,
      };
    });

    res(result);
  });
};
