import { Session } from "../model/Session";
import { User } from "../model/User";

interface HttpServerConfiguration {
  baseUrlString: string;
  port: string;
}

enum HttpMethod {
  Post = "POST",
}

// TODO: Find a better name for this
export class HttpServerInteractor {
  baseUrl: URL;
  constructor(configuration: HttpServerConfiguration) {
    const { baseUrlString } = configuration;
    this.baseUrl = new URL(baseUrlString);
    this.baseUrl.port = configuration.port;
  }

  async createUser(userName: string): Promise<User> {
    console.log("Sending a create user request");

    const url = new URL("/user", this.baseUrl.toString());
    const response = await fetch(
      url.toString(),
      this.createPostRequestParams({ userName })
    ).then((r) => r.json());

    console.log(`Received response: ${JSON.stringify(response)}`);
    return response;
  }

  async createSession(userId: string): Promise<Session> {
    console.log("Sending a create session request");

    const url = new URL("/session", this.baseUrl.toString());
    const response = await fetch(
      url.toString(),
      this.createPostRequestParams({ userId })
    ).then((r) => r.json());

    console.log(`Received response: ${JSON.stringify(response)}`);
    return response;
  }

  async joinSession(userId: string, sessionId: string): Promise<Session> {
    console.log("Sending a join session request");
    const url = new URL(`/session/${sessionId}`, this.baseUrl.toString());
    const response = await fetch(
      url.toString(),
      this.createPostRequestParams({ userId })
    ).then((r) => r.json());

    console.log(`Received response: ${JSON.stringify(response)}`);
    return response;
  }

  private createPostRequestParams(body: Object) {
    return {
      method: HttpMethod.Post,
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
}
