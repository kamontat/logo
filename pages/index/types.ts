import Jimp from "jimp";
import { NameResult } from "./ntc";

export type RGB = [number, number, number];

export interface RawMetaImage {
  key: string;
  name: string;
  ext: string;
  tags: string[];
}

export interface RawMetaDataJson {
  images: RawMetaImage[];
  promises: Promise<Jimp>[];
}

export type MetaPromiseData = Promise<{
  name: string;
  jimp: Jimp;
  color: RGB;
  palette: RGB[];
  tags: string[];
  path: string;
}>;

export interface ImageSize {
  width: number;
  height: number;
}

export interface ImageMetadata {
  mime: string;
}

export interface Images {
  name: string;
  path: string;
  size: ImageSize;
  ext: string;
  tags: string[];
  metadata: ImageMetadata;
  color: NameResult;
  palette: NameResult[];
}
