import * as JsSearch from "js-search";
import stemmer from "stemmer";
import { Images } from "./types";

export class Search {
  private searcher: JsSearch.Search;

  constructor() {
    this.searcher = new JsSearch.Search("filename");
    this.searcher.tokenizer = new JsSearch.StemmingTokenizer(stemmer, new JsSearch.SimpleTokenizer());
    this.searcher.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();

    this.searcher.addIndex(["size", "width"]);
    this.searcher.addIndex(["size", "height"]);
    this.searcher.addIndex("ext");
    this.searcher.addIndex("tags");
    this.searcher.addIndex(["metadata", "mime"]);
    this.searcher.addIndex(["color", "name"]);
    this.searcher.addIndex(["color", "hex"]);
  }

  add(images: Images[]) {
    this.searcher.addDocuments(images);
  }

  search(query: string) {
    return this.searcher.search(query) as Images[];
  }
}
