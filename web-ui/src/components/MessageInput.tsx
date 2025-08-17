import SendIcon from '@mui/icons-material/Send';
import { IconButton, Paper, TextField } from '@mui/material';
import { useState, type KeyboardEvent } from 'react';
import { addMessage } from '../redux/features/messageSlice';
import { useAppDispatch } from '../utils/reduxHooks';

export default function MessageInput() {
  const [text, setText] = useState('');
  const dispatch = useAppDispatch();

  const onSend = async () => {
    const t = text.trim();
    if (!t) return;
    dispatch(addMessage(t));
    setText('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{ display: 'flex', gap: 1, alignItems: 'center' }}
    >
      <TextField
        fullWidth
        size="small"
        placeholder="Type a message"
        multiline
        maxRows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        sx={{ '& fieldset': { border: 'none' } }}
      />
      <IconButton
        color="primary"
        onClick={onSend}
        aria-label="send message"
        className="!bg-inherit !rounded-none"
      >
        <SendIcon />
      </IconButton>
    </Paper>
  );
}
