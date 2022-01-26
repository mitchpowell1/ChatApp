import React from "react";

export interface RegistrationViewProps {
  onCreateSession(username: String): unknown;
  onJoinSession(username: String, sessionId: String): unknown;
}

interface RegistrationViewState {
  tentativeRegistrationType: RegistrationType;
  type: RegistrationType | null;
  username: string;
  sessionId: string;
}

enum RegistrationType {
  NewSession,
  JoinSession,
}

/**
 * Displays a registration page to allow a user to join a chat or create a new one
 */
export class RegistrationView extends React.Component<
  RegistrationViewProps,
  RegistrationViewState
> {
  constructor(props: RegistrationViewProps) {
    super(props);
    this.state = {
      tentativeRegistrationType: RegistrationType.NewSession,
      username: "",
      sessionId: "",
      type: null,
    };
  }

  clearRegistrationType() {
    this.setState({ type: null });
  }

  renderNewChatRegistration() {
    let { username } = this.state;
    return (
      <div>
        <h3>Start a new chat</h3>
        <div>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            value={username}
            id="username"
            onChange={(e) => this.setState({ username: e.target.value })}
          />
        </div>
        <div className="button-container">
          <button onClick={this.clearRegistrationType.bind(this)}>Back</button>
          <button onClick={() => this.props.onCreateSession(username)}>
            Create
          </button>
        </div>
      </div>
    );
  }

  renderJoinChatRegistration() {
    let { username, sessionId } = this.state;
    return (
      <div>
        <h3>Join an existing chat</h3>
        <div>
          <div>
            <label htmlFor="username">Username: </label>
            <input
              type="text"
              value={username}
              id="username"
              onChange={(e) => this.setState({ username: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="sessionId">Session ID: </label>
            <input
              type="text"
              value={sessionId}
              id="sessionId"
              onChange={(e) => this.setState({ sessionId: e.target.value })}
            />
          </div>
        </div>
        <div className="button-container">
          <button onClick={this.clearRegistrationType.bind(this)}>Back</button>
          <button onClick={() => this.props.onJoinSession(username, sessionId)}>
            Join
          </button>
        </div>
      </div>
    );
  }

  renderSelectRegistrationType() {
    const { tentativeRegistrationType } = this.state;

    return (
      <div>
        <h3>Would you like to:</h3>
        <div>
          <input
            type="radio"
            name="create"
            checked={tentativeRegistrationType == RegistrationType.NewSession}
            onChange={() =>
              this.setState({
                tentativeRegistrationType: RegistrationType.NewSession,
              })
            }
            id="create"
          />
          <label htmlFor="create">Start a new chat</label>
        </div>
        <div>
          <input
            type="radio"
            name="join"
            checked={tentativeRegistrationType == RegistrationType.JoinSession}
            onChange={() =>
              this.setState({
                tentativeRegistrationType: RegistrationType.JoinSession,
              })
            }
            id="join"
          />
          <label htmlFor="join">Join an existing chat using a session ID</label>
        </div>
        <button
          onClick={() =>
            this.setState((state) => ({
              type: state.tentativeRegistrationType,
            }))
          }
        >
          Select
        </button>
      </div>
    );
  }

  render() {
    const { type } = this.state;
    switch (type) {
      case null:
        return this.renderSelectRegistrationType();
      case RegistrationType.JoinSession:
        return this.renderJoinChatRegistration();
      case RegistrationType.NewSession:
        return this.renderNewChatRegistration();
    }
  }
}
