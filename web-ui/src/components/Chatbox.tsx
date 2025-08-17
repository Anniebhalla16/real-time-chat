import { Box, Card, CardContent, CardHeader } from '@mui/material';
import MessageInput from './MessageInput';
import MessageList from './MessageList';

export default function ChatBox() {
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
