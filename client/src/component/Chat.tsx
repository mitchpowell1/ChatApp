import "./Chat.css";
interface ChatProps {
  userName: string;
  message: string;
}
export const Chat = ({ userName, message }: ChatProps) => (
  <div>
    <span className="chat-username">{userName}: </span>
    <span className="chat-message">{message}</span>
  </div>
);
