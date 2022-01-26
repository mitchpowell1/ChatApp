import { User } from "./User";

export interface Session {
  id: string;
  users: User[];
  chats: string[];
}
