import path from "path";
import fs from "fs";

import { Logger } from "src/logger";

import { TransformerFn } from "../transformer";
import { Metadata, StrictJsonImageData } from "./loadMetadata";

// ------------------------------------- //
// 2. Load image path from file system   //
// ------------------------------------- //

export interface ImageMetadata extends StrictJsonImageData {
  code: string;
  key: string;
  fpath: string;
  urlpath: string;
  filename: string;
}

const logger = new Logger("transform", "loadImages");
export const loadImages: TransformerFn<Metadata[], Promise<ImageMetadata[]>> = (metas) => {
  return new Promise<ImageMetadata[]>((res) => {
    logger.i("start", "loading images files");
    const result: ImageMetadata[] = metas.flatMap((meta) => {
      return meta.raw
        .flatMap((v) => {
          const code = v.code;
          const filename = `${code}.${v.ext}`;
          const urlpath = path.join(meta.rpath, filename);
          const fpath = path.join(meta.ipath, filename);

          if (!fs.existsSync(fpath)) {
            logger.e("file not found", fpath);
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

    logger.i("finish", `loaded images (total=${result.length})`);
    res(result);
  });
};
