import * as express from "express";
import { sessionToSessionDto } from "./model/SessionDTO";
import { userToUserDto } from "./model/UserDTO";
import { SessionManager } from "./SessionManager";
import { UserManager } from "./UserManager";

export const getExpressServer = (
  userManager: UserManager,
  sessionManager: SessionManager
) => {
  const expressServer = express();

  expressServer.use(express.json());
  expressServer.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );

    next();
  });

  expressServer.post("/user", (req, res) => {
    const { userName } = req.body;
    console.log(
      `Received createUser request for user with username ${userName}`
    );
    if (!userName) {
      res.sendStatus(400);
      return;
    }

    const user = userManager.createUser(userName);
    res.send(userToUserDto(user));
  });

  /**
   * Creates a new chat session
   *
   * Schema:
   * {
   *    userId: String - The userId of the user
   * }
   */
  expressServer.post("/session", (req, res) => {
    const { userId } = req.body;
    const user = userManager.getUser(userId);
    if (!userId || !user) {
      res.sendStatus(400);
      return;
    }
    console.log(`Received a createSession request for user with id: ${userId}`);
    const session = sessionManager.createSession(user);

    res.statusCode = 200;
    res.send(sessionToSessionDto(session));
  });

  /**
   * Creates a new user and addes them to the session
   *
   * Path Parameters:
   * :sessionId - The ID of the session to be joined
   *
   * Body Schema:
   * {
   *    userId: String - The userId of the user
   * }
   */
  expressServer.post("/session/:sessionId", (req, res) => {
    const { sessionId } = req.params;
    const { userId } = req.body;
    const session = sessionManager.getSession(sessionId);
    const user = userManager.getUser(userId);

    console.log(
      `Received a joinSession request on session ${sessionId} for user with id ${userId}}`
    );

    if (!(userId && sessionId && user && session)) {
      res.sendStatus(400);
      return;
    }

    session.addUser(user);

    res.statusCode = 200;
    res.send(sessionToSessionDto(session));
  });

  return expressServer;
};
