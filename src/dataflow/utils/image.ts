import { ImageJsonData } from "src/interfaces/images";
import { MetadataImage } from "src/interfaces/metadata";

export const merge = (json: ImageJsonData, meta: MetadataImage) => {
  const newData = JSON.parse(JSON.stringify(json));

  // string
  if (meta.code) newData.code = meta.code;
  if (meta.ext) newData.ext = meta.ext;
  if (meta.color) newData.color = meta.color;

  // object
  if (!newData.size) newData.size = meta.size;
  if (meta.size && meta.size.height) newData.size.height = meta.size.height;
  if (meta.size && meta.size.width) newData.size.width = meta.size.width;

  // array
  if (meta.tags && meta.tags.length > 0) newData.tags.push(...meta.tags);
  if (meta.palette && meta.palette.length > 0) newData.palette.push(...meta.palette);

  newData.valid = newData.code !== "" && newData.ext !== "";
  return newData;
};
