// Redux messages feature to JSON RPCsocket
import {
  createAsyncThunk,
  createSlice,
  type Action,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { rpc } from '../../utils/rpc';
import {
  RPC_METHODS,
  SOCKET_EVENTS,
  type ChatMessage,
  type MessagesState,
} from '../../utils/types';

// subscribes to the socket
// on receiving a new message push to redux state
export function initMessageSocket(storeDispatch: (a: Action) => void) {
  const handler = (note: { type: string; payload: ChatMessage }) => {
    if (note?.type === SOCKET_EVENTS.NOTIFY) {
      storeDispatch(addMessage(note.payload));
    }
  };
  rpc.onNotify(handler);
  return () => rpc.offNotify(handler);
}

export const listRecentRPC = createAsyncThunk<ChatMessage[]>(
  RPC_METHODS.LIST_RECENT,
  async () => rpc.call<ChatMessage[]>(RPC_METHODS.LIST_RECENT, { limit: 50 })
);

//  sends message to the server and only
// adds to the state when there is a notification from the server (incl. sender)
export const sendMessageRPC = createAsyncThunk<void, { text: string }>(
  RPC_METHODS.SEND_MESSAGE,
  async ({ text }) => {
    await rpc.call(RPC_METHODS.SEND_MESSAGE, { text });
  }
);

const initialState: MessagesState = {
  items: [
    {
      id: uuidv4(),
      userId: 'System',
      text: 'Welcome to General-Room. Start Chatting',
      ts: Date.now(),
    },
  ],
  ctr: 0,
};

const messagesSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.items.push(action.payload);
    },
    clearMessages: (state) => {
      state.items = [];
    },
    burstNow: (state) => {
      state.ctr += 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listRecentRPC.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export const { addMessage, clearMessages, burstNow } = messagesSlice.actions;
export default messagesSlice.reducer;
