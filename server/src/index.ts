import * as http from "http";

import { SessionManager } from "./SessionManager";
import { UserManager } from "./UserManager";
import { getExpressServer } from "./ExpressServer";

/**
 * Typically in a production environment I would invest the time to configure a dependency injection system to grab this dependency,
 * I've opted to manually construct instances in this index file here for the sake of time.
 */
const sessionManager = new SessionManager();
const userManager = new UserManager();

const expressServer = getExpressServer(userManager, sessionManager);

const server = http.createServer(expressServer);
const port = 8000;

/**
 * Move wss configuration to a separate file
 */

server.listen(port, () => {
  console.log(`GuildChat server listening on port ${port}`);
});
