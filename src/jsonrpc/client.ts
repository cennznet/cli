import WebSocket from 'ws';

import {Request} from './types';

let id = 0;
export default class JsonRpcClient {
  static create(url: string, options?: WebSocket.ClientOptions): Promise<JsonRpcClient> {
    const client = new JsonRpcClient(url, options);
    return client.isReady;
  }

  static async with<T>(url: string, options: WebSocket.ClientOptions | undefined, callback: (client: JsonRpcClient) => Promise<T>): Promise<T> {
    const client = new JsonRpcClient(url, options);
    try {
      await client.isReady;
      const ret = await callback(client);
      return ret;
    } finally {
      client.destroy();
    }
  }

  isReady: Promise<JsonRpcClient>;
  protected _ws: WebSocket;

  protected handlers: {[id: string]: any};

  constructor(address: string, options?: WebSocket.ClientOptions) {
    this._ws = new WebSocket(address, options);
    this.handlers = {};
    this.isReady = new Promise((resolve, reject) => {
      this._ws.on('open', () => resolve(this));
      this._ws.on('error', reject);
    });
    this._ws.on('message', dataStr => {
      try {
        const data = JSON.parse(String(dataStr));
        if (data.id !== undefined && data.id !== null && this.handlers[data.id]) {
          const [resolve, reject] = this.handlers[data.id];
          delete this.handlers[data.id];
          if (data.hasOwnProperty('error')) {
            reject(data.error);
          } else {
            resolve(data.result);
          }
        }
      } catch (e) {
        // TODO
        console.error(e);
      }
    });
  }

  async send(obj: object): Promise<void>;
  async send<T>(method: string, params: any): Promise<T>;
  async send<T>(method: string | object, params?: any): Promise<T | void> {
    if (typeof method === 'object') {
      this._ws.send(JSON.stringify(method));
      return;
    }

    const req: Request = {jsonrpc: '2.0', id: id++, method, params};
    this._ws.send(JSON.stringify(req));
    return new Promise<T>((resolve, reject) => {
      this.handlers[req.id] = [resolve, reject];
    });
  }

  destroy(): void {
    this._ws.close();
  }

}
