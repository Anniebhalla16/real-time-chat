export type ChatMessage = {
  id: string;
  userId: string;
  text: string;
  ts: number;
};

export type MessagesState = {
  items: ChatMessage[];
  ctr: number;
}

export const RPC_METHODS = {
  SEND_MESSAGE: 'sendMessage',
  LIST_RECENT: 'listRecent',
} as const;

export const SOCKET_EVENTS = {
  REQUEST: 'rpc/request',
  RESPONSE: 'rpc/response',
  NOTIFY: 'rpc/notify',
} as const;

