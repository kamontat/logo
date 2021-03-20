import { ImageSize } from "../images";

export interface MetadataImage {
  code?: string;
  ext?: string;
  tags?: string[];
  size?: ImageSize;
  color?: string;
  palette?: string[];
}

export interface MetadataValues extends MetadataImage {
  images: MetadataImage[];
}
