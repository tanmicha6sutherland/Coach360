export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface User {
  name: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}
