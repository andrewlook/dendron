// import pino from "pino";

import { env } from "@dendronhq/common-all";
import _ from "lodash";
import pino from "pino";

export class Logger {
  public name: string;
  public level: string;
  constructor(opts: { name: string; level: string }) {
    this.name = opts.name;
    this.level = opts.level;
  }

  private _log(msg: any) {
    let ctx = "";
    if (msg.ctx) {
      ctx = msg.ctx;
    }
    // eslint-disable-next-line no-console
    console.log(this.name, ctx, msg);
  }
  debug = (msg: any) => {
    this._log(msg);
  };
  info = (msg: any) => {
    this._log(msg);
  };
  error = (msg: any) => {
    this._log(msg);
  };
}

function createLogger(
  name?: string,
  dest?: string,
  opts?: { lvl?: "debug" }
): pino.Logger {
  const level =
    opts?.lvl || env("LOG_LEVEL", { shouldThrow: false }) || "error";
  const nameClean = name || env("LOG_NAME");

  // if (logDst === "stdout") {
  //   // TODO: tmp disable pino logging on stdout
  //   const out = pino({ name: nameClean, level });
  //   return out;
  // } else {
  if (dest) {
    return pino(pino.destination(dest)).child({ name: nameClean, level });
  } else {
    const logDst = env("LOG_DST", { shouldThrow: false });
    if (!logDst || _.isEmpty(logDst) || logDst === "stdout") {
      // TODO: tmp disable pino logging on stdout
      const out = pino({ name: nameClean, level });
      return out;
    }
    // if (logDst) {
    //   return pino(pino.destination(logDst)).child({ name: nameClean, level });
    // }
    return pino({ name: nameClean, level });
  }
}

export type DLogger = {
  debug: (msg: any) => void;
  info: (msg: any) => void;
  error: (msg: any) => void;
  //fatal: (msg: any) => void;
};

export { createLogger, pino };

export function logAndThrow(logger: Logger, msg: any): never {
  logger.error(msg);
  throw JSON.stringify(msg);
}
