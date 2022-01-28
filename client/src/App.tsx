import React from "react";
import "./App.css";
import { Session } from "./model/Session";
import { HttpServerInteractor } from "./server/HttpServer";
import { WSConnection } from "./server/WebsocketConnection";
import { ChatView } from "./view/chat/ChatView";
import { RegistrationView } from "./view/registration/RegistrationView";

interface AppProps {
  httpInteractor: HttpServerInteractor;
}

export interface AppState {
  userName: string;
  userId: string;
  session: Session | null;
  sessionUsers: { [sessionId: string]: string };
  onlineUsers: { [sessionId: string]: string };
  sessionChats: { [userId: string]: string }[];
  wsConnection: WSConnection | null;
}

export class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      userName: "",
      userId: "",
      sessionUsers: {},
      onlineUsers: {},
      sessionChats: [],
      session: null,
      wsConnection: null,
    };
  }

  async createSession(userName: string) {
    const { userId } = await this.props.httpInteractor.createUser(userName);
    const session = await this.props.httpInteractor.createSession(userId);

    this.constructStateFromSession(session);
    this.setupWSConnection(session.sessionId, userId);

    this.setState({ userName, userId, session });
  }

  async joinSession(userName: string, sessionId: string) {
    const { userId } = await this.props.httpInteractor.createUser(userName);
    const session = await this.props.httpInteractor.joinSession(
      userId,
      sessionId
    );

    this.constructStateFromSession(session);
    this.setupWSConnection(session.sessionId, userId);
    this.setState({ userName, userId, session });
  }

  constructStateFromSession(session: Session) {
    const sessionUsers = session.users.reduce(
      (sessionUsers, user) => ({
        ...sessionUsers,
        [user.userId]: user.userName,
      }),
      {}
    );

    const onlineUsers = { ...sessionUsers };

    this.setState({ sessionUsers, onlineUsers, sessionChats: session.chats });
  }

  setupWSConnection(sessionId: string, userId: string) {
    const wsConnection = new WSConnection(sessionId, userId);

    wsConnection.registerChatUpdateListener(this);
    wsConnection.registerUserUpdateListener(this);

    this.setState({ wsConnection });
  }

  onNewChat(userId: string, message: string) {
    this.setState((state) => ({
      sessionChats: [...state.sessionChats, { userId, message }],
    }));
  }

  onAddUser(userId: string, userName: string) {
    this.setState((state) => ({
      sessionUsers: { ...state.sessionUsers, [userId]: userName },
      onlineUsers: { ...state.onlineUsers, [userId]: userName },
    }));
  }

  onRemoveUser(userId: string) {
    const { onlineUsers } = this.state;
    delete onlineUsers[userId];
    this.setState({ onlineUsers });
  }

  render() {
    let { onlineUsers, userName, userId, session, sessionUsers, sessionChats } =
      this.state;
    if (userName && session) {
      return (
        <ChatView
          sessionId={session.sessionId}
          currentUserId={userId}
          chats={sessionChats}
          sessionUsers={sessionUsers}
          onlineUsers={onlineUsers}
          onSendMessage={(message) =>
            this.state.wsConnection?.sendMessage(message)
          }
        />
      );
    } else {
      return (
        <RegistrationView
          onCreateSession={this.createSession.bind(this)}
          onJoinSession={this.joinSession.bind(this)}
        />
      );
    }
  }
}
