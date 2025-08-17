export type ChatMessage = {
  id: string;
  author: string;
  text: string;
  ts: number;   
};

export type MessagesState = {
  items: ChatMessage[],
  ctr: number
}