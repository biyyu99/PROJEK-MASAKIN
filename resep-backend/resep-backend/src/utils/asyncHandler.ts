import { NextFunction, Request, RequestHandler, Response } from 'express';

// Express 4 tidak menangkap error dari fungsi async secara otomatis.
// Pembungkus ini meneruskan error ke error handler.
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };
