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
        field: e.path.slice(1).join("."),
        message: e.message,
      }));

      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Invalid input", details },
      });
      return;
    }

    // Storing validated + coerced data in res.locals
    res.locals.validated = result.data;

    // Overwriting req.body only if  one IS writable
    if (result.data.body) req.body = result.data.body;

    next();
  };
}
