import { ExpressHandler } from './module-options.type';

export interface HttpControllerOptions {
  path: string;
  middlewareList?: ExpressHandler[];
  caseSensitive?: boolean;
  mergeParams?: boolean;
  strict?: boolean;
}
