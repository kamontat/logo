import { Flow } from "src/interfaces/dataflow";

export class DataFlow<I> {
  static new<I>(i: I): DataFlow<I> {
    return new DataFlow(i);
  }

  private promise: Promise<I>;

  private constructor(data: Promise<I> | I) {
    this.promise = Promise.resolve(data);
  }

  async<N>(flow: Flow<I, Promise<N>>) {
    const promise = this.promise.then(v => flow(v));
    return new DataFlow<N>(promise);
  }

  get() {
    return this.promise;
  }
}
