import { Socket } from 'socket.io';
import { v4 as uuid } from 'uuid';
import { ChatMessage } from './types';

type User = { socketId: string; name: string };

const messages: ChatMessage[] = [];          // global message history

export function addMessage(socket:Socket, text: string): ChatMessage {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error('Message text cannot be empty');
  }

  const {userId } = socket.handshake.auth;

  const msg: ChatMessage = {
    id: uuid(),
    userId,
    text: trimmed,
    ts: Date.now(),
  };

  messages.push(msg);
  if (messages.length > 200) messages.shift(); 
  return msg;
}

export function getRecent(limit = 50): ChatMessage[] {
  return messages.slice(-limit);
}
