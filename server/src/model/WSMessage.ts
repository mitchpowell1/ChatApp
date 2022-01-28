import { MessageType } from "./MessageType";

export interface WSMessage {
  type: MessageType;
  payload: any;
}
