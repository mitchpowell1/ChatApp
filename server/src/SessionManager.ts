import { v4 as uuid } from "uuid";
import { User } from "./User";
import { Session } from "./Session";

export class SessionManager {
  private sessions: { [sessionId: string]: Session };

  constructor() {
    this.sessions = {};
  }

  getSession(sessionId: string): Session | undefined {
    console.log(`Getting session with id: ${sessionId}`);
    const session = this.sessions[sessionId];
    return session;
  }

  createSession(user: User): Session {
    let newId = uuid();
    let session = new Session(newId);
    session.addUser(user);
    this.sessions[newId] = session;
    return session;
  }
}
