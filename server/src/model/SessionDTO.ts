import { Session } from "../Session";
import { UserDTO, userToUserDto } from "./UserDTO";

export interface SessionDTO {
  sessionId: string;
  chats: { userId: String; message: String }[];
  users: UserDTO[];
}

export const sessionToSessionDto = (session: Session): SessionDTO => ({
  sessionId: session.id,
  chats: session.chats,
  users: Object.values(session.users).map(userToUserDto),
});
