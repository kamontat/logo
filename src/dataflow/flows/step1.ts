import type { Flow } from "src/interfaces/dataflow";

import type { FileData, MetadataFile } from "src/interfaces/metadata";
import type { ImageMetadata, ImageJsonData } from "src/interfaces/images";

import { basename, join } from "path";
import { readFileSync } from "fs";

import { Logger } from "src/logger";
import { merge } from "../utils/image";

const logger = new Logger("flow", "1", "load-image-metadata");

export const loadMetadata: Flow<FileData, Promise<ImageMetadata[]>> = async t => {
  logger.i("start", `loading metadata from ${t.metadataDirectory}`);

  const results = t.filenames.flatMap(filename => {
    const key: string = basename(filename, ".json");
    const rpath: string = join(t.imageUrl, key); // relative path start from public folder
    const ipath: string = join(t.imageDirectory, key); // full path
    const fpath: string = join(t.metadataDirectory, filename);
    const raw: string = readFileSync(fpath, "utf8");
    const json: MetadataFile = JSON.parse(raw);

    const v = json.version;
    return json.values.flatMap(json => {
      const code = json.code ?? "";
      const ext = json.ext ?? "";
      const tags = json.tags || [];
      const valid = code !== "" && ext !== "";

      const jsonData: ImageJsonData = {
        valid,
        code,
        ext,
        tags,
        size: json.size,
        color: json.color,
        palette: json.palette,
      };

      let jsonDataList: ImageJsonData[] = [];
      if (json.images && json.images.length > 0) {
        const images = json.images.map(data => merge(jsonData, data));
        jsonDataList.push(...images);
      } else {
        jsonDataList.push(jsonData);
      }

      const validEntities = jsonDataList.filter(v => v.valid);
      if (jsonDataList.length !== validEntities.length)
        logger.i("filtering", `reduce valid entities from ${jsonDataList.length} to ${validEntities.length}`);

      return {
        version: v,
        key,
        ipath,
        rpath,
        fpath,
        raw: validEntities,
      } as ImageMetadata;
    });
  });

  logger.i("finish", `loaded metadata (total=${results.length})`);
  return results;
};
