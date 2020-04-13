import {
  HttpControllerHandlerOptions,
  HttpControllerOptions,
  HttpEvent,
} from '../types';
import {
  HandlerDecorator,
  setControllerHandlerContextOptions,
} from '@fireless/common';
import { Class } from 'utility-types';

const createHttpMethodHandlerDecorator = (
  type: HttpControllerHandlerOptions['type'],
) => (path?: string): HandlerDecorator => {
  return <T extends {}>(target: T, methodName: keyof T): void => {
    setControllerHandlerContextOptions<
      T,
      HttpControllerOptions,
      HttpEvent<any, any, any>,
      HttpControllerHandlerOptions
    >(target.constructor as Class<T>, methodName, {
      path: path || `/${methodName}`,
      type,
    });
  };
};

export const All = createHttpMethodHandlerDecorator('all');
export const Get = createHttpMethodHandlerDecorator('get');
export const Post = createHttpMethodHandlerDecorator('post');
export const Put = createHttpMethodHandlerDecorator('put');
export const Delete = createHttpMethodHandlerDecorator('delete');
export const Patch = createHttpMethodHandlerDecorator('patch');
export const Options = createHttpMethodHandlerDecorator('options');
export const Head = createHttpMethodHandlerDecorator('head');
