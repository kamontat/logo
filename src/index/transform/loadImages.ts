import path from "path";
import fs from "fs";

import { TransformerFn } from "../transformer";
import { Metadata, RawImagedata } from "./loadMetadata";

// ------------------------------------- //
// 2. Load image path from file system   //
// ------------------------------------- //

export interface ImageMetadata extends RawImagedata {
  code: string;
  key: string;
  fpath: string;
  urlpath: string;
  filename: string;
}

export const loadImages: TransformerFn<Metadata[], Promise<ImageMetadata[]>> = (metas) => {
  return new Promise<ImageMetadata[]>((res) => {
    const result: ImageMetadata[] = metas.flatMap((meta) => {
      return meta.raw.images
        .flatMap((v) => {
          const codes = typeof v.code === "string" ? [v.code] : v.code;
          return codes.map((code) => {
            const filename = `${code}.${v.ext}`;
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
              code: code,
            };
          });
        })
        .filter((v) => v !== undefined);
    });

    res(result);
  });
};
