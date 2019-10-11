export interface Message<T> {
  jsonrpc: '2.0';
  method: string;
  params?: T;
}

export interface Request<T = any> extends Message<T> {
  id: string | number;
}

export interface Notification<T = any> extends Message<T> {
}

export interface ResponseSuccess<T = string | number | boolean | object | null> {
  id: string | number | null;
  result: T;
}

export interface ResponseError {
  id: string | number | null;
  error: {
    code: number;
    message: string;
    data?: any;
  };
}

export type Response<T> = ResponseSuccess<T> | ResponseError;