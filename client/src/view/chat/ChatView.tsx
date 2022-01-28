import React from "react";
import { Chat } from "./Chat";
import "./ChatView.css";

interface ChatViewProps {
  sessionId: string;
  sessionUsers: { [userId: string]: string };
  onlineUsers: { [userId: string]: string };
  chats: { [userId: string]: string }[];
  currentUserId: string;
  onSendMessage: (message: string) => unknown;
}

interface ChatViewState {
  message: string;
}
/**
 * Displays a chat session between two users
 */
export class ChatView extends React.Component<ChatViewProps, ChatViewState> {
  constructor(props: ChatViewProps) {
    super(props);
    this.state = {
      message: "",
    };
  }

  submitMessage() {
    this.props.onSendMessage(this.state.message);
    this.setState({ message: "" });
  }

  render() {
    const { sessionId, sessionUsers, onlineUsers, currentUserId, chats } =
      this.props;

    return (
      <div className="chat-view">
        <section className="chat-section header-window">
          <h3>Session ID:</h3>
          <span>{sessionId}</span>
          <h3>Participants:</h3>
          <ul>
            {Object.entries(onlineUsers).map((entry) => {
              const [userId, userName] = entry;
              const displayName =
                userId === currentUserId ? `${userName} (you)` : userName;
              return <li key={userId}> {displayName}</li>;
            })}
          </ul>
        </section>
        <section className="chat-section chat-window">
          {chats.map((chat, index) => (
            <Chat
              key={index}
              userName={sessionUsers[chat.userId]}
              message={chat.message}
            />
          ))}
        </section>
        <section className="chat-section message-window">
          <textarea
            className="message-textarea"
            value={this.state.message}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                this.submitMessage();
              }
            }}
            onChange={(e) => this.setState({ message: e.target.value })}
          ></textarea>
          <button onClick={this.submitMessage.bind(this)}>Send</button>
        </section>
      </div>
    );
  }
}
