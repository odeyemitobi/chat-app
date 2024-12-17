export interface User {
  id: string;
  username: string;
  email?: string;
}

export interface Message {
  id: string;
  content: string;
  type: MessageType;
  user: User;
  createdAt: Date;
}

export interface Channel {
  id: string;
  name: string;
  messages: Message[];
}

export interface ChatContextType {
  messages: Message[];
  sendMessage: (content: string, type?: MessageType) => void;
  currentChannel: Channel | null;
  switchChannel: (channelId: string) => void;
}

export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  LINK = "LINK",
  EMOJI = "EMOJI",
}
