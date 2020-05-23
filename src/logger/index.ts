import debug, { Debugger } from "debug";

export class Logger {
  private static root: string = "logo";

  private _info: Debugger;
  private _warn: Debugger;
  private _error: Debugger;

  constructor(...namespaces: string[]) {
    const root = debug(Logger.root);
    const warn = root.extend("w");
    const error = root.extend("e");

    this._info = namespaces.reduce((p, c) => p.extend(c), root);
    this._info.log = console.log;

    this._warn = namespaces.reduce((p, c) => p.extend(c), warn);
    this._warn.log = console.warn;

    this._error = namespaces.reduce((p, c) => p.extend(c), error);
    this._error.log = console.error;
  }

  info(formatter: string, ...args: any[]) {
    return this._info(formatter, ...args);
  }

  i(title: string, msg: any) {
    return this._info(`${title}: %O`, msg);
  }

  warn(formatter: string, ...args: any[]) {
    return this._warn(formatter, ...args);
  }

  w(title: string, msg: any) {
    return this._warn(`${title}: %O`, msg);
  }

  error(formatter: string, ...args: any[]) {
    return this._error(formatter, ...args);
  }

  e(title: string, msg: any) {
    return this._error(`${title}: %O`, msg);
  }
}
