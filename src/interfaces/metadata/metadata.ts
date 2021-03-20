import { MetadataValues } from "./value";

export type Version = "v2";

export interface MetadataFile {
  version: Version;
  values: MetadataValues[];
}
