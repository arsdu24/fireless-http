import { NextFunction, Request, Response } from 'express-serve-static-core';

export type ExpressHandler = (
  req: Request<any>,
  res: Response,
  next: NextFunction,
) => any;

export interface HttpModuleOptions {
  usages?: ExpressHandler[];
  port: number;
  host?: string;
}
