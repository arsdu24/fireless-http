import { Controller } from './controller.decorator';
import {
  All,
  Head,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Options,
} from './controller-handler.decorators';
import { Request } from './controller-handler-param.decorators';
import { Module } from './module.decorator';

export {
  Module,
  Controller,
  All,
  Head,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Options,
  Request,
};

export const HTTP = Object.seal({
  Module,
  Controller,
  All,
  Head,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Options,
  Request,
});
