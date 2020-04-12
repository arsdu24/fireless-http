import {
  HttpControllerHandlerOptions,
  HttpControllerOptions,
  HttpEvent,
} from '../types';
import { Class, Optional } from 'utility-types';
import {
  asyncResolverFromTransformPipes,
  ControllerHandlerParamDecorator,
  createTransformPipe,
  setControllerHandlerContextParamResolver,
  TransformPipe,
} from '@fireless/common';

export function createKeyDecorator<O extends {}>(
  resolver: (key: keyof O) => (event: HttpEvent<any, any, any>) => Promise<any>,
) {
  function keyDecorator<K extends keyof O>(
    key: K,
  ): ControllerHandlerParamDecorator;
  function keyDecorator<K extends keyof O, R>(
    key: K,
    p: Class<TransformPipe<O[K], R>>,
  ): ControllerHandlerParamDecorator;
  function keyDecorator<K extends keyof O, R1, R2>(
    key: K,
    p1: Class<TransformPipe<O[K], R1>>,
    p2: Class<TransformPipe<R1, R2>>,
  ): ControllerHandlerParamDecorator;
  function keyDecorator<K extends keyof O, R1, R2, R3>(
    key: K,
    p1: Class<TransformPipe<O[K], R1>>,
    p2: Class<TransformPipe<R1, R2>>,
    p3: Class<TransformPipe<R2, R3>>,
  ): ControllerHandlerParamDecorator;
  function keyDecorator<K extends keyof O, R1, R2, R3, R4>(
    key: K,
    p1: Class<TransformPipe<O[K], R1>>,
    p2: Class<TransformPipe<R1, R2>>,
    p3: Class<TransformPipe<R2, R3>>,
    p4: Class<TransformPipe<R3, R4>>,
  ): ControllerHandlerParamDecorator;
  function keyDecorator<K extends keyof O, R1, R2, R3, R4, R5>(
    key: K,
    p1: Class<TransformPipe<O[K], R1>>,
    p2: Class<TransformPipe<R1, R2>>,
    p3: Class<TransformPipe<R2, R3>>,
    p4: Class<TransformPipe<R3, R4>>,
    p5: Class<TransformPipe<R4, R5>>,
  ): ControllerHandlerParamDecorator;
  function keyDecorator<K extends keyof O>(
    key: K,
    ...pipes: Class<TransformPipe<any, any>>[]
  ) {
    return <T extends {}>(
      target: T,
      methodName: keyof T,
      index: number,
    ): void => {
      setControllerHandlerContextParamResolver<
        T,
        HttpControllerOptions,
        HttpEvent<O, any, any>,
        HttpControllerHandlerOptions
      >(
        target.constructor as Class<T>,
        methodName,
        index,
        asyncResolverFromTransformPipes(
          createTransformPipe(resolver(key)),
          ...pipes,
        ),
      );
    };
  }

  return keyDecorator;
}

export function createAllDecorator<O extends {}>(
  resolver: (event: HttpEvent<any, any, any>) => Promise<any>,
) {
  function allDecorator(): ControllerHandlerParamDecorator;
  function allDecorator<R>(
    p: Class<TransformPipe<O, R>>,
  ): ControllerHandlerParamDecorator;
  function allDecorator<R1, R2>(
    p1: Class<TransformPipe<O, R1>>,
    p2: Class<TransformPipe<R1, R2>>,
  ): ControllerHandlerParamDecorator;
  function allDecorator<R1, R2, R3>(
    p1: Class<TransformPipe<O, R1>>,
    p2: Class<TransformPipe<R1, R2>>,
    p3: Class<TransformPipe<R2, R3>>,
  ): ControllerHandlerParamDecorator;
  function allDecorator<R1, R2, R3, R4>(
    p1: Class<TransformPipe<O, R1>>,
    p2: Class<TransformPipe<R1, R2>>,
    p3: Class<TransformPipe<R2, R3>>,
    p4: Class<TransformPipe<R3, R4>>,
  ): ControllerHandlerParamDecorator;
  function allDecorator<R1, R2, R3, R4, R5>(
    p1: Class<TransformPipe<O, R1>>,
    p2: Class<TransformPipe<R1, R2>>,
    p3: Class<TransformPipe<R2, R3>>,
    p4: Class<TransformPipe<R3, R4>>,
    p5: Class<TransformPipe<R4, R5>>,
  ): ControllerHandlerParamDecorator;
  function allDecorator(...pipes: Class<TransformPipe<any, any>>[]) {
    return <T extends {}>(
      target: T,
      methodName: keyof T,
      index: number,
    ): void => {
      setControllerHandlerContextParamResolver<
        T,
        HttpControllerOptions,
        HttpEvent<O, any, any>,
        HttpControllerHandlerOptions
      >(
        target.constructor as Class<T>,
        methodName,
        index,
        asyncResolverFromTransformPipes(
          createTransformPipe(resolver),
          ...pipes,
        ),
      );
    };
  }

  return allDecorator;
}

export interface HttpRequest {
  params: { [key: string]: any };
  query: { [key: string]: any };
  body: { [key: string]: any } | any;
}

export function Request<T extends HttpRequest>() {
  return {
    Params<P extends {} = T['params']>() {
      return {
        Key: createKeyDecorator<P>((key) => async ({ params }) => params[key]),
        All: createAllDecorator<P>(async ({ params }) => params),
      };
    },
    Query<Q extends {} = T['query']>() {
      return {
        Key: createKeyDecorator<Optional<Q>>((key) => async ({ query }) =>
          query[key],
        ),
        All: createAllDecorator<Optional<Q>>(async ({ query }) => query),
      };
    },
    Body<B extends {} = T['body']>() {
      return {
        Key: createKeyDecorator<Optional<B>>((key) => async ({ body }) =>
          body[key],
        ),
        All: createAllDecorator<Optional<B>>(async ({ body }) => body),
      };
    },
  };
}
