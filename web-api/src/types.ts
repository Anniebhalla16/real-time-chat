// Socket.IO event channels
export const SOCKET_EVENTS = {
  RPC_REQUEST: 'rpc/request',
  RPC_RESPONSE: 'rpc/response',
} as const;

// broadcasts, notifications
export const CHAT_EVENTS = {
  SEND: 'chat:send',        // client → server
  NEW_MESSAGE: 'chat:message', // server → all clients
} as const;

export const RPC_METHODS = {
  ChatJoin: 'chat.join',
  ChatSend: 'chat.send',
  ChatHistory: 'chat.history',
} as const;
