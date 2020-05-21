export type TransformerFn<T, R> = (t: T) => R;

export interface ITransformer<I> {
  transform<N>(tran: TransformerFn<I, Promise<N>>): ITransformer<N>;

  get(): Promise<I>;
}

export class Transformer<I> implements ITransformer<I> {
  private promise: Promise<I>;

  constructor(data: Promise<I> | I) {
    this.promise = Promise.resolve(data);
  }

  transform<N>(tran: TransformerFn<I, Promise<N>>) {
    const promise = this.promise.then((v) => tran(v));
    return new Transformer<N>(promise);
  }

  get() {
    return this.promise;
  }
}
