import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import type { MessagesState } from '../../utils/types';

const initialState: MessagesState = {
  items: [
    {
      id: uuidv4(),
      author: 'System',
      text: 'Welcome to General-Room. Start Chatting',
      ts: Date.now(),
    },
  ],
  ctr: 0,
};

export const messagesSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.items = [
        ...state.items,
        { text: action.payload, id: uuidv4(), ts: Date.now(), author: 'You' },
      ];
      state.ctr += 1;
    },
    clearMessages: (state) => {
      state.items = [];
    },
  },
});

export const { addMessage, clearMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
