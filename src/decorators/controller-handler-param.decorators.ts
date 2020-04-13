import {
  HttpControllerHandlerOptions,
  HttpControllerOptions,
  HttpEvent,
  HttpRequest,
} from '../types';
import {
  asyncResolverFromTransformPipes,
  createPipedHandlerParamDecorator,
  createTransformPipe,
  PipedHandlerParamDecoratorCreatorOptions,
  setControllerHandlerContextParamResolver,
  TransformPipe,
} from '@fireless/common';
import { Class } from 'utility-types';

function registerParamResolver<R extends HttpRequest>(
  pipes: Class<TransformPipe<any, any>>[],
) {
  return <T extends {}>(
    target: T,
    methodName: keyof T,
    index: number,
  ): void => {
    setControllerHandlerContextParamResolver<
      T,
      HttpControllerOptions,
      HttpEvent<R['params'], R['query'], R['body']>,
      HttpControllerHandlerOptions
    >(
      target.constructor as Class<T>,
      methodName,
      index,
      asyncResolverFromTransformPipes(...pipes),
    );
  };
}

export function Request<R extends HttpRequest>() {
  return {
    Params: createPipedHandlerParamDecorator<R['params']>(
      (options: PipedHandlerParamDecoratorCreatorOptions<R['params']>) => {
        return registerParamResolver<R>([
          createTransformPipe(
            async (event: HttpEvent<R['params'], R['query'], R['body']>) =>
              options.key ? event.params[options.key] : event.params,
          ),
          ...options.pipes,
        ]);
      },
    ),
    Query: createPipedHandlerParamDecorator<R['query']>(
      (options: PipedHandlerParamDecoratorCreatorOptions<R['query']>) => {
        return registerParamResolver<R>([
          createTransformPipe(
            async (event: HttpEvent<R['params'], R['query'], R['body']>) =>
              options.key ? event.query[options.key] : event.query,
          ),
          ...options.pipes,
        ]);
      },
    ),
    Body: createPipedHandlerParamDecorator<R['body']>(
      (options: PipedHandlerParamDecoratorCreatorOptions<R['body']>) => {
        return registerParamResolver<R>([
          createTransformPipe(
            async (event: HttpEvent<R['params'], R['query'], R['body']>) =>
              options.key ? event.body[options.key] : event.body,
          ),
          ...options.pipes,
        ]);
      },
    ),
  };
}
