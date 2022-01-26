export class User {
  userId: string;
  userName: string;
  sessionId: string;

  constructor(userName: string, userId: string) {
    this.userId = userId;
    this.userName = userName;
    this.sessionId = null;
  }

  bindSession(sessionId: string) {
    this.sessionId = sessionId;
  }

  getCurrentSessionId(): string {
    return this.sessionId;
  }
}
