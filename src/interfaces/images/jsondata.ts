import { ImageSize } from "./size";

export interface ImageJsonData {
  valid: boolean;
  code: string;
  ext: string;
  tags: string[];

  size?: ImageSize;
  color?: string;
  palette?: string[];
}
