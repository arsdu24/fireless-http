import {
  HttpControllerHandlerOptions,
  HttpControllerOptions,
  HttpEvent,
  HttpModuleOptions,
} from './types';
import { Observable } from 'rxjs';
import * as express from 'express';
import { Application } from 'express';
import { AbstractModule } from '@fireless/core';
import { HttpStream } from './stream';

export class HttpModule extends AbstractModule<
  HttpModuleOptions,
  HttpEvent<any, any, any>,
  HttpControllerOptions,
  HttpControllerHandlerOptions
> {
  protected async createStream(
    options: HttpModuleOptions,
  ): Promise<HttpStream> {
    const app: Application = express();

    if (options.usages) {
      options.usages.forEach((middleware) => app.use(middleware as any));
    }

    await new Promise<void>((resolve, reject) => {
      app
        .listen(options.port, options.host || 'localhost')
        .on('error', reject)
        .on('listening', resolve);
    });

    return new HttpStream(app, new Observable<HttpEvent<any, any, any>>());
  }
}
