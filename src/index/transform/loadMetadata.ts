import path from "path";
import fs from "fs";

import { TransformerFn } from "../transformer";
import { ImageSize } from "../types";
import { Logger } from "src/logger";

// ------------------------------------- //
// 1. Load metadata json from filesystem //
// ------------------------------------- //

type Filenames = {
  metadataDirectory: string,
  imageDirectory: string,
  imageUrl: string,
  filenames: string[]
}

export interface RawJsonImageData {
  code?: string;
  ext?: string;
  tags?: string[];
  size?: ImageSize;
  color?: string;
  palette?: string[];
}

export interface StrictJsonImageData {
  valid: boolean;
  code: string;
  ext: string;
  tags: string[];

  size?: ImageSize;
  color?: string;
  palette?: string[];
}

export interface JsonImageData extends RawJsonImageData {
  images: RawJsonImageData[];
}

export type Version = "v2";

export interface JsonData {
  version: Version;
  data: JsonImageData[];
}

export type Metadata = {
  version: Version;
  key: string;
  rpath: string; // relative from public folder to image folder
  ipath: string; // full path to image folder
  fpath: string; // metadata path
  raw: StrictJsonImageData[];
};

const replaceImageData = (oldData: StrictJsonImageData, replacement: RawJsonImageData): StrictJsonImageData => {
  const newData = JSON.parse(JSON.stringify(oldData));

  // string
  if (replacement.code) newData.code = replacement.code;
  if (replacement.ext) newData.ext = replacement.ext;
  if (replacement.color) newData.color = replacement.color;

  // object

  if (!newData.size) newData.size = replacement.size;
  if (replacement.size && replacement.size.height) newData.size.height = replacement.size.height;
  if (replacement.size && replacement.size.width) newData.size.width = replacement.size.width;

  // array
  if (replacement.tags && replacement.tags.length > 0) newData.tags.push(...replacement.tags);
  if (replacement.palette && replacement.palette.length > 0) newData.palette.push(...replacement.palette);

  newData.valid = newData.code !== "" && newData.ext !== "";
  return newData;
};

const version = "v2";
const logger = new Logger("transform", "loadMetadata");
export const loadMetadata: TransformerFn<Filenames, Promise<Metadata[]>> = (t) => {
  const publicDirectory = path.join(process.cwd(), "public");

  logger.i("start", `loading metadata from ${t.metadataDirectory}`);
  return new Promise<Metadata[]>((res) => {
    const result = t.filenames.flatMap((filename) => {
      const key = path.basename(filename, ".json");

      const rpath = path.join(t.imageUrl, key); // relative path start from public folder
      const ipath = path.join(t.imageDirectory, key); // full path
      const fpath = path.join(t.metadataDirectory, filename);
      const raw = fs.readFileSync(fpath, "utf8");
      const json = JSON.parse(raw) as JsonData;

      const v = json.version;
      return json.data.flatMap((json) => {
        const code = json.code ?? "";
        const ext = json.ext ?? "";
        const tags = json.tags || [];
        const valid = code !== "" && ext !== "";

        const rootJsonImageData = {
          valid,
          code,
          ext,
          tags,
          size: json.size,
          color: json.color,
          palette: json.palette,
        };

        let imagesData: StrictJsonImageData[] = [];
        if (json.images && json.images.length > 0) {
          const images = json.images.map((data) => {
            return replaceImageData(rootJsonImageData, data);
          });
          imagesData.push(...images);
        } else {
          imagesData.push(rootJsonImageData);
        }

        const validEntities = imagesData.filter((v) => v.valid);
        if (imagesData.length !== validEntities.length)
          logger.i("filtering", `reduce valid entities from ${imagesData.length} to ${validEntities.length}`);

        return {
          version: v,
          key,
          ipath,
          rpath,
          fpath,
          raw: validEntities,
        };
      });
    });

    logger.i("finish", `loaded metadata (total=${result.length})`);
    res(result);
  });
};
