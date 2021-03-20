import { ImageSize } from "./size";

export interface ImageData {
  urlpath: string;
  filename: string;

  key: string;
  code: string;
  ext: string;
  mime: string;
  size: ImageSize;
  tags: string[];
}

export const emptyImageData = (): ImageData => {
  return {
    urlpath: "",
    filename: "",
    key: "",
    code: "",
    ext: "",
    mime: "",
    size: { width: 0, height: 0 },
    tags: [],
  };
};
