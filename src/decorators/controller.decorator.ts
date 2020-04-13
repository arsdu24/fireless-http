import {
  HttpControllerHandlerOptions,
  HttpControllerOptions,
  HttpEvent,
} from '../types';
import { Class } from 'utility-types';
import {
  ConstructorDecorator,
  setControllerContextOptions,
} from '@fireless/common';
import { kebabCase } from 'lodash/fp';

export function Controller(): ConstructorDecorator;
export function Controller(path: string): ConstructorDecorator;
export function Controller(
  options: HttpControllerOptions,
): ConstructorDecorator;
export function Controller(pathOrOptions?: string | HttpControllerOptions) {
  return <T extends {}>(Controller: Class<T>): Class<T> => {
    let options: HttpControllerOptions = {
      path: kebabCase(Controller.name),
    };

    if ('object' === typeof pathOrOptions) {
      options = {
        ...options,
        ...pathOrOptions,
      };
    }

    if ('string' === typeof pathOrOptions) {
      options.path = pathOrOptions;
    }

    setControllerContextOptions<
      T,
      HttpControllerOptions,
      HttpEvent<any, any, any>,
      HttpControllerHandlerOptions
    >(Controller, options);

    return Controller;
  };
}
