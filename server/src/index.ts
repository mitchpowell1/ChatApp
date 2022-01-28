import * as http from "http";

import { SessionManager } from "./SessionManager";
import { UserManager } from "./UserManager";

import { getExpressServer } from "./ExpressServer";

const HTTP_PORT = 8000;
/**
 * Typically in a production environment I would invest the time to configure a dependency injection system to grab this dependency,
 * I've opted to manually construct instances in this index file here for the sake of time.
 */
const sessionManager = new SessionManager();
const userManager = new UserManager();

const expressServer = getExpressServer(userManager, sessionManager);

const server = http.createServer(expressServer);

server.on("upgrade", (req, socket, head) => {
  const sessionId = req.url.replace(/\//g, "");
  const session = sessionManager.getSession(sessionId);
  session.wsServer.handleUpgrade(req, socket, head, (ws) => {
    session.wsServer.emit("connection", ws);
  });
});

/**
 * Move wss configuration to a separate file
 */

server.listen(HTTP_PORT, () => {
  console.log(`GuildChat server listening on port ${HTTP_PORT}`);
});
