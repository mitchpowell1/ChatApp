import { User } from "./User";

export interface Session {
  sessionId: string;
  users: User[];
  chats: { userId: string; message: string }[];
}
