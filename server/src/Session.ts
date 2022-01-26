import { User } from "./User";

export class Session {
  id: string;
  users: User[];
  chats: string[];

  constructor(id: string) {
    this.id = id;
    this.users = [];
    this.chats = [];
  }

  addUser(user: User) {
    user.bindSession(this.id);
    this.users.push(user);
  }
}
