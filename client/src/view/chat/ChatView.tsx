import React from "react";
import { Session } from "../../model/Session";
import "./ChatView.css";

interface ChatViewProps {
  session: Session;
  currentUserId: string;
}
/**
 * Displays a chat session between two users
 */
export class ChatView extends React.Component<ChatViewProps> {
  constructor(props: ChatViewProps) {
    super(props);
  }

  render() {
    const {
      session: { users, id: sessionId },
      currentUserId,
    } = this.props;

    return (
      <div className="chat-view">
        <section className="chat-section header-window">
          <h3>Session ID:</h3>
          <span>{sessionId}</span>
          <h3>Participants:</h3>
          <ul>
            {this.props.session.users.map(({ userName, userId }) => {
              if (userId === currentUserId) {
                return <li>{userName} (You)</li>;
              }
              return <li>{userName}</li>;
            })}
          </ul>
        </section>
        <section className="chat-section chat-window">chat</section>
        <section className="chat-section message-window">message</section>
      </div>
    );
  }
}
