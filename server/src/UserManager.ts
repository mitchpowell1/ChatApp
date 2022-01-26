import { v4 as uuid } from "uuid";
import { User } from "./User";

export class UserManager {
  private users: { [userId: string]: User };

  constructor() {
    this.users = {};
  }

  createUser(userName: string): User {
    const userId = uuid();
    const user = new User(userName, userId);
    this.users[userId] = user;
    return user;
  }

  getUser(userId: string): User | undefined {
    return this.users[userId];
  }
}
