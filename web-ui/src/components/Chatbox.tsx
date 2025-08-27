import { Box, Card, CardContent, CardHeader } from '@mui/material';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  initMessageSocket,
  listRecentRPC,
} from '../redux/features/messageSlice';
import { useAppDispatch } from '../utils/reduxHooks';
import { rpc } from '../utils/rpc';
import MessageInput from './MessageInput';
import MessageList from './MessageList';

export default function ChatBox() {
  const dispatch = useAppDispatch();

  function getOrCreateUserId() {
    const key = 'userId';
    let id = sessionStorage.getItem(key);
    if (!id) {
      const name = 'User';
      id = `${name}_${uuidv4()}`;
      sessionStorage.setItem(key, id);
    }
    return id;
  }

  // Connect to the server
  useEffect(() => {
    let stop: (() => void) | undefined;
    const userId = getOrCreateUserId();

    let alive = true;
    (async () => {
      if (!rpc.isConnected()) {
        await rpc.connect(
          import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3001',
          { userId }
        );
      }
      if (!alive) return;
      stop = initMessageSocket(dispatch);
      dispatch(listRecentRPC());
    })();
    return () => {
      alive = false;
      stop?.();
    };
  }, [dispatch]);

  return (
    <>
      <Card
        elevation={3}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          width: '50vw',
        }}
        className="bg-blue-200"
      >
        <CardHeader title="Real-Time Chat" />
        <CardContent sx={{ pt: 0 }}>
          <Box
            sx={{
              height: 520,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              position: 'relative',
            }}
          >
            <MessageList />
            <MessageInput />
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
