import { io, type Socket } from 'socket.io-client';
import { SOCKET_EVENTS, type ChatMessage } from './types';

export type RPCRequest = {
  jsonrpc: '2.0';
  id: number | string;
  method: string;
  params?: unknown;
};
export type RPCResponse = {
  jsonrpc: '2.0';
  id?: number | string | null;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
};

type ConnectAuth = { userId?: string };


class RPCClient {
  private socket!: Socket;

  async connect(url: string, auth: ConnectAuth) {
    this.socket = io(url, { transports: ['websocket'] , auth});
    await new Promise<void>((resolve, reject) => {
      this.socket.once('connect', () => resolve());
      this.socket.once('connect_error', (e) => reject(e));
    });
  }

  onNotify(cb: (note: { type: string; payload: ChatMessage }) => void) {
    if (!this.socket) throw new Error('RPCClient not connected. Call connect() first.');
    this.socket.on(SOCKET_EVENTS.NOTIFY, cb);
  }
  offNotify(cb: (note: { type: string; payload: ChatMessage }) => void) {
    if (!this.socket) return;
    this.socket.off(SOCKET_EVENTS.NOTIFY, cb);
  }

  call<T = unknown>(method: string, params?: unknown): Promise<T> {
    const id = Date.now() + Math.random(); 

    return new Promise<T>((resolve, reject) => {
      const onResp = (res: RPCResponse) => {
        if (res?.id !== id) return;
        this.socket.off(SOCKET_EVENTS.RESPONSE, onResp);
        if (res.error) return reject(res.error);
        resolve(res.result as T);
      };
      this.socket.on(SOCKET_EVENTS.RESPONSE, onResp);
      this.socket.emit(SOCKET_EVENTS.REQUEST, { jsonrpc: '2.0', id, method, params } as RPCRequest);
    });
  }

  disconnect() { this.socket?.disconnect(); }
  isConnected() { return this.socket?.connected ?? false; }
}

export const rpc = new RPCClient();
