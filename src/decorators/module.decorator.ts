import { Class } from 'utility-types';
import {
  KlassDecorator,
  setModuleContextControllers,
  setModuleContextOptions,
} from '@fireless/common';
import { HttpModule } from '../module';
import {
  HttpControllerHandlerOptions,
  HttpControllerOptions,
  HttpEvent,
  HttpModuleOptions,
} from '../types';

type DecoratorOptions = HttpModuleOptions & {
  controllers: Class<any>[];
};

export function Module(options: DecoratorOptions): KlassDecorator {
  return <T extends {}>(Target: Class<T>): Class<T> => {
    const { controllers, ...opts } = options;

    setModuleContextOptions<
      HttpModuleOptions,
      HttpEvent<any, any, any>,
      HttpControllerOptions,
      HttpControllerHandlerOptions
    >(Target, HttpModule, opts);

    setModuleContextControllers<
      HttpModuleOptions,
      HttpEvent<any, any, any>,
      HttpControllerOptions,
      HttpControllerHandlerOptions
    >(Target, HttpModule, controllers);

    return Target;
  };
}
