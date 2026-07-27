import { Request, Response, NextFunction } from "express";

type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<any>;

/**
 * Async route handlers lai wrap garcha, so kunai pani thrown error /
 * rejected promise Express ko error-handling middleware lai forward
 * hunchha, process crash vaye ya request hang vaye sato.
 */
export const asyncHandler = (fn: AsyncFn) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};