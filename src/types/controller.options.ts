import { ExpressHandler } from './module-options';

export interface HttpControllerOptions {
  path: string;
  middlewareList?: ExpressHandler[];
  caseSensitive?: boolean;
  mergeParams?: boolean;
  strict?: boolean;
}
