import { User } from "./User";
import { WebSocketServer, WebSocket, RawData } from "ws";
import { WSMessage } from "./model/WSMessage";
import { MessageType } from "./model/MessageType";

export class Session {
  id: string;
  users: { [userId: string]: User };
  chats: { userId: string; message: string }[];
  wsServer: WebSocketServer;
  clients: Map<WebSocket, string>;

  constructor(id: string) {
    this.id = id;
    this.users = {};
    this.chats = [];
    this.clients = new Map();

    const wss = new WebSocketServer({ noServer: true });
    wss.on("connection", this.addClient.bind(this));
    this.wsServer = wss;
  }

  addUser(user: User) {
    user.bindSession(this.id);
    this.users[user.userId] = user;
  }

  handleIncomingMessage(data: RawData, socket: WebSocket) {
    let message = JSON.parse(data.toString()) as WSMessage;

    switch (message.type) {
      case MessageType.Identity:
        this.handleNewUserConnection.bind(this)(message.payload, socket);
        return;
      case MessageType.MessageReceived:
        this.handleUserMessage.bind(this)(
          message.payload,
          this.clients.get(socket)
        );
        return;
    }
  }

  handleUserMessage(payload: any, userId: string) {
    console.log(`Handling a new chat: ${JSON.stringify(payload.message)}`);
    const chat = { userId, message: payload.message };
    this.chats.push({ message: payload.message, userId });
    const wsMessage = {
      type: MessageType.MessageReceived,
      payload: chat,
    };

    this.broadcastMessage.bind(this)(wsMessage);
  }

  handleNewUserConnection(payload: any, socket: WebSocket) {
    console.log(`Handling a new user connection: ${JSON.stringify(payload)}`);
    const userId = payload.userId;
    const user = this.users[userId];
    this.clients.set(socket, payload.userId);

    const message: WSMessage = {
      type: MessageType.UserJoined,
      payload: {
        userId: user.userId,
        userName: user.userName,
      },
    };

    this.broadcastMessage.bind(this)(message);
  }

  handleSocketClosed(socket: WebSocket) {
    const userId = this.clients.get(socket);
    this.clients.delete(socket);
    const wsMessage = {
      type: MessageType.UserLeft,
      payload: {
        userId,
      },
    };
    this.broadcastMessage.bind(this)(wsMessage);
  }

  addClient(socket: WebSocket) {
    console.log(`Socket connected to session ${this.id}`);
    socket.on("message", (data) => this.handleIncomingMessage(data, socket));
    socket.on("close", () => this.handleSocketClosed(socket));
  }

  broadcastMessage(message: object) {
    for (const socket of this.clients.keys()) {
      socket.send(JSON.stringify(message));
    }
  }
}
