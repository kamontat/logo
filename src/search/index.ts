import type { ImageData } from "../interfaces/images";

import * as JsSearch from "js-search";
import stemmer from "stemmer";

import { Logger } from "src/logger";

export class Search extends Logger {
  private searcher: JsSearch.Search;

  constructor() {
    super("searcher");

    this.searcher = new JsSearch.Search("filename");
    this.searcher.tokenizer = new JsSearch.StemmingTokenizer(stemmer, new JsSearch.SimpleTokenizer());
    this.searcher.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();

    this.addIndex("key");
    this.addIndex("code");
    this.addIndex("mime");
    this.addIndex(["size", "width"]);
    this.addIndex(["size", "height"]);
    this.addIndex("tags");

    this.addIndex(["color", "name"]);
    this.addIndex(["color", "hex"]);
  }

  private addIndex(name: string | string[]) {
    this.searcher.addIndex(name);
    this.i("addIndex", name);
  }

  add(images: ImageData[]) {
    this.searcher.addDocuments(images);
  }

  search(query: string) {
    return this.searcher.search(query) as ImageData[];
  }
}
