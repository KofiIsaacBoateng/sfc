import { pinoHttp } from "pino-http";
import { logger } from "./logger.js";
import type { Request, Response } from "express";

export const httpLogger = pinoHttp({
  logger,

  genReqId: () => crypto.randomUUID(),

  customLogLevel(_: Request, res: Response, err?: Error) {
    if (err || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },

  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },

  customErrorMessage: (req, res) => {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },

  serializers: {
    req: () => undefined,
    res: () => undefined,
  },

  customProps: (req, res) => ({
    reqId: req.id,
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
  }),
});
