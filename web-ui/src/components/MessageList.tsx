import { Box, List, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import type { ChatMessage } from '../utils/types';

const bubbleSx = {
  display: 'inline-block',
  px: 1.5,
  py: 1,
  maxWidth: '80%',
  borderRadius: '18px',
  bgcolor: 'primary.main',
  color: 'primary.contrastText',
  wordBreak: 'break-word' as const,
  whiteSpace: 'pre-wrap' as const,
  // notch effect by sharpening one corner
  borderTopRightRadius: '18px',
  borderTopLeftRadius: '6px',
  boxShadow: 1,
};

export default function MessageList() {
  const listRef = useRef<HTMLDivElement | null>(null);
  const [messages] = useState<ChatMessage[]>([]);

  return (
    <Box
      ref={listRef}
      sx={{
        flex: 1,
        overflowY: 'auto',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        p: 1.5,
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        gap: 0.75,
      }}
    >
      <List
        disablePadding
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.75,
        }}
      >
        {messages.map((msg, i) => (
          <Box sx={bubbleSx} key={i}>
            <Typography variant="body1" component="div">
              {msg.text}
            </Typography>
          </Box>
        ))}
      </List>
    </Box>
  );
}
