import * as JsSearch from "js-search";
import stemmer from "stemmer";
import { ImagesMetadata } from "./transform/loadImagesMetadata";

export class Search {
  private searcher: JsSearch.Search;

  constructor() {
    this.searcher = new JsSearch.Search("filename");
    this.searcher.tokenizer = new JsSearch.StemmingTokenizer(stemmer, new JsSearch.SimpleTokenizer());
    this.searcher.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();

    this.searcher.addIndex("key");
    this.searcher.addIndex("code");
    this.searcher.addIndex("mime");
    this.searcher.addIndex(["size", "width"]);
    this.searcher.addIndex(["size", "height"]);
    this.searcher.addIndex("tags");

    this.searcher.addIndex(["color", "name"]);
    this.searcher.addIndex(["color", "hex"]);
  }

  add(images: ImagesMetadata[]) {
    this.searcher.addDocuments(images);
  }

  search(query: string) {
    return this.searcher.search(query) as ImagesMetadata[];
  }
}
