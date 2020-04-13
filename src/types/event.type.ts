export interface HttpEvent<P extends {}, Q extends {}, B extends {}> {
  params: P;
  query: Q;
  body: B;
}
