import type { Flow } from "src/interfaces/dataflow";
import type { ImageMetadata, VerifiedImageMetadata } from "src/interfaces/images";

import { join } from "path";
import { existsSync } from "fs";
import { Logger } from "src/logger";

const logger = new Logger("flow", "2", "verify-image-metadata");

export const verifyImage: Flow<ImageMetadata[], Promise<VerifiedImageMetadata[]>> = async metadata => {
  logger.i("start", "loading images files");

  const images = metadata.flatMap(meta => {
    return meta.raw
      .map(json => {
        const code = json.code;
        const filename = `${code}.${json.ext}`;
        const urlpath = join(meta.rpath, filename);
        const fpath = join(meta.ipath, filename);

        if (!existsSync(fpath)) {
          logger.e("file not found", fpath);
          return undefined;
        }

        return {
          key: meta.key,
          fpath,
          urlpath,
          filename,
          ...json,
        } as VerifiedImageMetadata;
      })
      .filter(v => v !== undefined);
  });

  logger.i("finish", `loaded images (total=${images.length})`);
  return images;
};
