import type { Flow } from "src/interfaces/dataflow";
import type { ImageData, VerifiedImageMetadata } from "src/interfaces/images";

import Jimp from "jimp";
import { Logger } from "src/logger";

const supportedImages = ["png", "jpg", "jpag"];

const logger = new Logger("flow", "3", "load-image-data");
export const loadImageData: Flow<VerifiedImageMetadata[], Promise<ImageData[]>> = async metadata => {
  logger.i("start", `loading images metadata`);

  return Promise.all(
    metadata.map(async data => {
      let width = data.size?.width;
      let height = data.size?.height;
      let ext = data.ext;
      let mime = data.ext;

      if (supportedImages.includes(data.ext)) {
        const jimp = await Jimp.read(data.fpath);

        if (width === undefined) width = jimp.getWidth();
        if (height === undefined) height = jimp.getHeight();
        if (mime === undefined) mime = jimp.getMIME();
        if (ext === undefined) ext = jimp.getExtension();
      } else {
        logger.warn(`Extension not support (${data.filename})`);
      }

      return {
        urlpath: data.urlpath,
        filename: data.filename,

        key: data.key,
        code: data.code,
        ext,
        mime,
        size: {
          width,
          height,
        },
        tags: data.tags,
      } as ImageData;
    })
  );
};
