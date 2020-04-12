import { AbstractStream, AsyncResolver } from '@fireless/core';
import {
  HttpControllerHandlerOptions,
  HttpControllerOptions,
  HttpEvent,
  HttpMethods,
} from './types';
import { Router } from 'express';
import { Observable } from 'rxjs';
import { Request, Response } from 'express-serve-static-core';
import { constant } from 'lodash/fp';

export class HttpStream extends AbstractStream<
  HttpEvent<any, any, any>,
  HttpControllerOptions,
  HttpControllerHandlerOptions
> {
  constructor(
    private router: Router,
    stream: Observable<HttpEvent<any, any, any>>,
  ) {
    super(stream);
  }

  async pipe(options: HttpControllerOptions): Promise<HttpStream> {
    const subRouter: Router = Router(options);

    this.router.use(options.path, ...(options.middlewareList || []), subRouter);

    return new HttpStream(subRouter, this.observable);
  }

  async subscribe<P extends {}, Q extends {}, B extends {}, R = void>(
    options: HttpControllerHandlerOptions,
    handler: AsyncResolver<HttpEvent<any, any, any>, R>,
  ): Promise<void> {
    this.applyToRouterMethod<P, B, R>(
      options.type,
      options.path,
      async ({ params, query, body }, res) => {
        const data: HttpEvent<P, Q, B> = {
          params,
          body,
          query: query as Q,
        };

        try {
          const result: R = await handler(data);

          res.json(result); //TODO make some check on result status and type
        } catch (e) {
          res.status(500).json(e); //TODO make some check on error status and type
          console.error(e);
        }
      },
    );
  }

  applyToRouterMethod<P extends {}, B extends {}, R>(
    type: HttpMethods,
    path: string,
    handler: (req: Request<P, B>, res: Response) => any,
  ): void {
    type RequestHandler = (
      path: string,
      handler: (req: Request<P, B>, res: Response) => any,
    ) => void;

    let callable: RequestHandler;

    if (type in this.router && 'function' === typeof this.router[type]) {
      callable = (this.router[type] as RequestHandler).bind(this.router);
    } else {
      callable = constant(void 0);
    }

    callable(path, handler);
  }
}
