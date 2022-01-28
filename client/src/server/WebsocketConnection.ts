import { MessageType } from "../model/MessageType";
import { WSMessage } from "../model/WSMessage";

export interface UserUpdateListener {
  onAddUser(userId: string, userName: string): unknown;
  onRemoveUser(userId: string): unknown;
}

export interface ChatUpdateListener {
  onNewChat(userId: string, message: string): unknown;
}

export class WSConnection {
  private ws: WebSocket;
  private sessionId: string;
  private userId: string;
  private userUpdateListeners: Set<UserUpdateListener>;
  private chatUpdateListeners: Set<ChatUpdateListener>;

  constructor(sessionId: string, userId: string) {
    this.sessionId = sessionId;
    this.userId = userId;
    this.ws = new WebSocket(`ws://localhost:8000/${sessionId}`);
    this.ws.onopen = this.onConnectionOpened.bind(this);
    this.ws.addEventListener("message", (message) =>
      this.onMessage(JSON.parse(message.data) as WSMessage)
    );
    this.userUpdateListeners = new Set();
    this.chatUpdateListeners = new Set();
  }

  registerUserUpdateListener(listener: UserUpdateListener) {
    this.userUpdateListeners.add(listener);
  }

  removeUserUpdateListener(listener: UserUpdateListener) {
    this.userUpdateListeners.delete(listener);
  }

  registerChatUpdateListener(listener: ChatUpdateListener) {
    this.chatUpdateListeners.add(listener);
  }

  removeChatUpdateListener(listener: ChatUpdateListener) {
    this.chatUpdateListeners.delete(listener);
  }

  sendMessage(message: string) {
    const wsMessage = {
      type: MessageType.MessageReceived,
      payload: {
        message,
      },
    };

    this.ws.send(JSON.stringify(wsMessage));
  }

  private onMessage(message: WSMessage) {
    switch (message.type) {
      case MessageType.UserJoined:
        console.log("User joined");
        this.userUpdateListeners.forEach((listener) => {
          listener.onAddUser(message.payload.userId, message.payload.userName);
        });
        return;

      case MessageType.UserLeft:
        console.log("User left");
        this.userUpdateListeners.forEach((listener) => {
          listener.onRemoveUser(message.payload.userId);
        });
        return;
      case MessageType.MessageReceived:
        console.log("Received a message");
        this.chatUpdateListeners.forEach((listener) => {
          listener.onNewChat(message.payload.userId, message.payload.message);
        });
    }
  }

  private onConnectionOpened() {
    this.sendData({
      type: MessageType.Identity,
      payload: {
        userId: this.userId,
      },
    });
  }

  private sendData(data: Object) {
    this.ws.send(JSON.stringify(data));
  }
}
