import path from "path";
import fs from "fs";

import { TransformerFn } from "../transformer";
import { Metadata, RawImagedata } from "./loadMetadata";

export interface ImageMetadata extends RawImagedata {
  key: string;
  fpath: string;
  urlpath: string;
  filename: string;
}

export const loadImages: TransformerFn<Metadata[], Promise<ImageMetadata[]>> = (metas) => {
  return new Promise<ImageMetadata[]>((res) => {
    const result: ImageMetadata[] = metas.flatMap((meta) => {
      return meta.raw.images
        .map((v) => {
          const filename = `${v.code}.${v.ext}`;

          const urlpath = path.join(meta.rpath, filename);
          const fpath = path.join(meta.ipath, filename);

          if (!fs.existsSync(fpath)) {
            console.error(`file not found: ${fpath}`);
            return undefined;
          }

          return {
            key: meta.key,
            fpath,
            urlpath,
            filename,
            ...v,
          };
        })
        .filter((v) => v !== undefined);
    });

    res(result);
  });
};
