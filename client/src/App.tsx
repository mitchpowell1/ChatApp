import React from "react";
import "./App.css";
import { Session } from "./model/Session";
import { HttpServerInteractor } from "./server/HttpServer";
import { ChatView } from "./view/chat/ChatView";
import { RegistrationView } from "./view/registration/RegistrationView";

interface AppProps {
  httpInteractor: HttpServerInteractor;
}

export interface AppState {
  userName: string;
  userId: string;
  session: Session | null;
}

export class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      userName: "",
      userId: "",
      session: null,
    };
  }

  async createSession(userName: string) {
    const { userId } = await this.props.httpInteractor.createUser(userName);
    const session = await this.props.httpInteractor.createSession(userId);

    this.setState({ userName, userId, session });
  }

  async joinSession(userName: string, sessionId: string) {
    const { userId } = await this.props.httpInteractor.createUser(userName);
    const session = await this.props.httpInteractor.joinSession(
      userId,
      sessionId
    );

    this.setState({ userName, userId, session });
  }

  render() {
    let { userName, userId, session } = this.state;
    if (userName && session) {
      return <ChatView session={session} currentUserId={userId} />;
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
