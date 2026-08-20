import { Request, Response, NextFunction } from "express";

import { ZodSchema, ZodError } from "zod/v3";

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const details = (result.error as ZodError).errors.map((e) => ({
        field: e.path.slice(1).join("."), // stripping leading 'body'/'query'/'params'
        message: e.message,
      }));

      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid input",
          details,
        },
      });

      return;
    }

    // Replacing request properties with validated + coerced data
    if (result.data.body) req.body = result.data.body;
    if (result.data.params) req.params = result.data.params;
    if (result.data.query) req.query = result.data.query;

    next();
  };
}
