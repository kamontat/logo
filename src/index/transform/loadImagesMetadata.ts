import Jimp from "jimp";
import colorthief from "colorthief";

import { ImageMetadata } from "./loadImages";
import { TransformerFn } from "../transformer";
import { RGB, ImageSize } from "../types";
import { NTC, ntcToName, NameResult } from "../ntc";

// ------------------------------------- //
// 3. query all data from image          //
// ------------------------------------- //

const supportedImages = ["png", "jpg", "jpag"];
const ntc = new NTC(false);

const toHex = (rgb: RGB) => {
  const hex = rgb.map((x) => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  });

  return `#${hex.join("").toUpperCase()}`;
};

export interface ImagesMetadata {
  urlpath: string;
  filename: string;

  key: string;
  code: string;
  ext: string;
  mime: string;
  size: ImageSize;
  tags: string[];

  color: NameResult;
  palette: NameResult[];
}

export const loadImagesMetadata: TransformerFn<ImageMetadata[], Promise<ImagesMetadata[]>> = async (data) => {
  const _images = data.map(async (meta) => {
    let color: NameResult = ntcToName(meta.color ?? "");
    if (!color.valid && supportedImages.includes(meta.ext)) {
      const rgb: RGB | undefined = await colorthief.getColor(meta.fpath);
      const rgb1 = rgb ?? [1, 1, 1];
      color = ntc.name(toHex([rgb1[0] - 1, rgb1[1] - 1, rgb1[2] - 1]));
    }

    let palette: NameResult[] = (meta.palette ?? []).map((p) => ntcToName(p));
    if (palette.length < 1 && supportedImages.includes(meta.ext)) {
      const rgb: RGB[] | undefined = await colorthief.getPalette(meta.fpath);
      const rgb1 = rgb ?? [];
      palette = rgb1.map((color) => ntc.name(toHex([color[0] - 1, color[1] - 1, color[2] - 1])));
    }

    let width = meta.size?.width;
    let height = meta.size?.height;
    let ext = meta.ext;
    let mime = meta.ext;

    if (supportedImages.includes(meta.ext)) {
      const jimp = await Jimp.read(meta.fpath);

      if (width === undefined) width = jimp.getWidth();
      if (height === undefined) height = jimp.getHeight();
      mime = jimp.getMIME();
      ext = jimp.getExtension();
    }

    return {
      urlpath: meta.urlpath,
      filename: meta.filename,

      key: meta.key,
      code: meta.code,
      ext,
      mime,
      size: {
        width,
        height,
      },
      tags: meta.tags,

      color,
      palette,
    };
  });

  return Promise.all(_images);
};
