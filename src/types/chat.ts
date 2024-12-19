export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
  EMOJI = "EMOJI",
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Message {
  id: string;
  content: string;
  type: MessageType;
  user: User;
  createdAt: Date;
}
