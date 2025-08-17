import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { CHAT_EVENTS } from './types.js';

const PORT = Number(process.env.PORT || 3001);
const ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

const app = express();
app.use(cors({ origin: ORIGIN }));
app.get('/health', (_req, res) => res.json({ ok: true }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: ORIGIN } });

io.on('connection', (socket) => {
  console.log('socket connected:', socket.id);

  socket.on(CHAT_EVENTS.SEND, (msg: { text: string; user?: string }) => {
    const payload = {
      id: crypto.randomUUID(),
      text: String(msg?.text ?? ''),
      user: msg?.user || 'anonymous',
      ts: Date.now()
    };
    io.emit(CHAT_EVENTS.NEW_MESSAGE, payload);
  });

  socket.on('disconnect', (reason) => {
    console.log('socket disconnected:', socket.id, reason);
  });
});


server.listen(PORT, () => {
  console.log(`HTTP up on http://localhost:${PORT}`);
});