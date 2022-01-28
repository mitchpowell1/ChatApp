# Chat App Writeup

## Details

The purpose of this writeup is to capture notes on how the current implementation deviates from how I would implement things in a production environment.

They are not necessarily comprehensive, but represent a best effort to capture known bugs, less-than-best practices, and shortcuts taken in this project

## Client

- User facing strings are hardcoded and would be difficult to localize
- In the chat view component no effort was taken to manage the number of Chat components loaded into the DOM at any point in time. In production these would be managed by a solution that would dynamically recycle existing components as the user scrolled to prevent the application from becoming sluggish.
- Usernames are not checked, and can be vulgar, and can also match the name of other users in the chat
- Given more time I would take more care to separate layouts from reusable components within the user interface.

## Server

- User IDs are generated on the fly whenever a user joins a chat / creates a new chat session. The implication being that there is no possibility for persisting chat data between two people. I was told to ignore details around registration, so it is fine for this project, but in a production scenario we would need to get userIds from some datasource instead

- Application state is held entirely in memory. Tackling persistence seemed out of scope for this project.

- In a production environment I would make use of structured logging of some kind rather than relying on `console.log` for all logging

- The session-joining workflow ended up being a little bit more clunky than I would have liked but I did not have time to refactor. In particular if I could do it again I probably wouldn't consider a user to have "joined" the session until a websocket connection had actually been established, as currently that is not the case.

- We currently rely on the user to tell us who they are upon joining a session due to time-constraints on refactoring as well. If I had time to refactor I would make it so that userIds were created after sessions were joined and were bound to the websocket itself, which would help reduce the footprint of exploitation (right now users can say they are anyone and the server just takes their word for it.)

- In a production application I would version my url endpoints (e.g.`/v1/session`) to allow easier migrations of client applications as requirements change.

## Both

- Configuration is entirely hardcoded. In a production scenario I would ensure that URLs, ports, etc were configured as a step in the build process (to accommodate for separate stages, the possibility of changing endpoints, etc)

- Schema validation is not robust. I would design a production system to be less trustful of JSON schemas from clients.

- No consideration was given to making the application secure. Everything is sent via plaintext with no attempt to encrypt data or prevent attacks

- Due to time constraints testing has primarily been conducted manually. I had planned on putting some tests into the project, but ended up being busier than anticipated during the time I had to work on this and had to focus on getting a functioning submission in. The following are a few notes about testing

  - I attempted to design things in a way that was conducive to unit testing. Specifically classes were designed to receive dependencies via injection, rather than constructing them themselves.
  - I would put a lot of focus on testing around the session joining workflow. In particular I am concerned about bugs that may arise as a result of brief disconnections from the internet, and I would make those a focus when writing the initial test suite.

- Schema code is duplicated across the two projects. Ideally the schema would be defined as a library that both the client and the server could consume.
