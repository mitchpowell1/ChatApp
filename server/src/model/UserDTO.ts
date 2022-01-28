import { User } from "../User";

export interface UserDTO {
  userId: string;
  userName: string;
}

export const userToUserDto = (user: User): UserDTO => ({
  userName: user.userName,
  userId: user.userId,
});
