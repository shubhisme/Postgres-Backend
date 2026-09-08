import { Request, Response, NextFunction } from "express";
import { requestContext } from "../lib/requestContext.ts";

export interface RequestMetrics {
  dbQueryCount: number;
  dbQueryTime: number;
}

declare global {
  namespace Express {
    interface Request {
      metrics: RequestMetrics;
    }
  }
}

export function ExportMetrics(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();

  const context = {
    dbQueryCount: 0,
    dbQueryTime: 0,
  };

  requestContext.run(context, () => {
    res.on("finish", () => {
      const end = process.hrtime.bigint();

      const durationMs = Number(end - start) / 1_000_000;

      console.log({
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        httpLatencyMs: Number(durationMs.toFixed(2)),
        dbQueryCount: context.dbQueryCount,
        dbQueryTime: context.dbQueryTime,
      });
    });

    next();
});
}
