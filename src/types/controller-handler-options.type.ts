export type HttpMethods =
  | 'all'
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'patch'
  | 'options'
  | 'head';

export interface HttpControllerHandlerOptions {
  path: string;
  type: HttpMethods;
}
