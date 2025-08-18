import { Box, List, Typography } from '@mui/material';
import { Fragment, useEffect, useMemo, useRef } from 'react';
import { useAppSelector } from '../utils/reduxHooks';
import { type ChatMessage } from '../utils/types';
import BubblesBurst from './BubblesBurst';

export default function MessageList() {
  const listRef = useRef<HTMLDivElement | null>(null);
  const messages = useAppSelector<ChatMessage[]>((s) => s.messages.items);
  const ctr = useAppSelector((s) => s.messages.ctr);
  const sessionUserId =
    sessionStorage.getItem('userId') || localStorage.getItem('userId')!;

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  const grouped = useMemo(() => {
    console.log(messages.length);
    const out: Array<{ msg: ChatMessage; showMeta: boolean }> = [];
    for (let i = 0; i < messages.length; i++) {
      const m = messages[i];
      const prev = messages[i - 1];
      const showMeta =
        !prev || prev.userId !== m.userId || m.ts - prev.ts > 2 * 60 * 1000;
      out.push({ msg: m, showMeta });
    }
    return out;
  }, [messages]);

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
      <BubblesBurst trigger={ctr} />
      <List
        disablePadding
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.75,
        }}
      >
        {grouped.map(({ msg, showMeta }) => {
          const time = new Date(msg.ts).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          const isSelf = sessionUserId === msg.userId;
          console.log(sessionUserId, msg.userId);
          console.log(isSelf);

          const bubbleSx = {
            display: 'inline-block',
            px: 1.5,
            py: 1,
            borderRadius: '18px',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            wordBreak: 'break-word' as const,
            whiteSpace: 'pre-wrap' as const,
            borderTopRightRadius: '18px',
            borderTopLeftRadius: '6px',
            boxShadow: 1,
          };

          return (
            <Fragment key={msg.id}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: isSelf ? 'flex-end' : 'flex-start',
                  alignItems: isSelf ? 'flex-end' : 'flex-start',
                  px: 0.5,
                }}
              >
                <Box sx={{ textAlign: isSelf ? 'right' : 'start' }}>
                  {showMeta && (
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 0.25,
                        color: 'text.secondary',
                        display: 'block',
                      }}
                    >
                      {msg.userId.slice(0, 8)}
                    </Typography>
                  )}
                  <Box sx={bubbleSx}>
                    <Typography variant="body1" component="div">
                      {msg.text}
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 0.25,
                      color: 'text.disabled',
                      display: 'block',
                    }}
                  >
                    {time}
                  </Typography>
                </Box>
              </Box>
            </Fragment>
          );
        })}
      </List>
    </Box>
  );
}
