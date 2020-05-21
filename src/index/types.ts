import Jimp from "jimp";
import { NameResult } from "./ntc";

export type RGB = [number, number, number];

export interface ImageSize {
  width: number;
  height: number;
}

export interface RawMetaImage {
  code: string;
  ext: string;
  tags: string[];
  size?: ImageSize;
  color?: string;
  palette?: string[];
}

export interface RawMetaDataJson {
  images: RawMetaImage[];
  promises: Promise<Jimp>[];
}

export type MetaPromiseData = Promise<{
  filename: string;
  ext: string;
  size?: ImageSize;
  jimp?: Jimp;
  color?: RGB;
  rawColor?: string;
  palette?: RGB[];
  rawPalette?: string[];
  tags: string[];
  path: string;
}>;

export interface ImageMetadata {
  mime: string;
}

export interface Images {
  filename: string;
  path: string;
  size: ImageSize;
  ext: string;
  tags: string[];
  metadata: ImageMetadata;
  color: NameResult;
  palette: NameResult[];
}
