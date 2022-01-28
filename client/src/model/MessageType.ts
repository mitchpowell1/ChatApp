/**
 * MessageType Enum
 * Describes the types of messages that can be received from the server
 *
 * Identity - A message payload to allow the user to resolve this websocket to your provided user ID
 * UserJoined - A new user has joined the chat
 * UserLeft - A user has left the chat
 * MessageReceived - A new chat message has been received
 */
export enum MessageType {
  Identity = "identity",
  UserJoined = "user_joined",
  UserLeft = "user_left",
  MessageReceived = "message_received",
}
