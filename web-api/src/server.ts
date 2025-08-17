import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import http from 'http';

const PORT = Number(process.env.PORT || 3001);
const ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

const app = express();
app.use(cors({ origin: ORIGIN }));
app.get('/health', (_req, res) => res.json({ ok: true }));

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`HTTP up on http://localhost:${PORT}`);
});