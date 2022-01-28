# Chat App Writeup

## Details

The purpose of this writeup is to capture notes on how the current implementation deviates from how I would implement things in a production environment.

They are not necessarily comprehensive, but represent a best effort to capture known bugs, less-than-best practices, and shortcuts taken in this project

## Client

- User facing strings are hardcoded and would be difficult to localize
- In the chat view component no effort was taken to manage the number of Chat components loaded into the DOM at any point in time. In production these would be managed by a solution that would dynamically replace / reuse existing components as the user scrolled to prevent the application from becoming sluggish.

## Server

- User IDs are generated on the fly whenever a user joins a chat / creates a new chat session. The implication being that there is no possibility for persisting chat data between two people. I was told to ignore details around registration, so it is fine for this project, but in a production scenario we would need to get userIds from some datasource instead

- Application state is held entirely in memory. Tackling persistence seemed out of scope for this project.

- In a production environment I would make use of structured logging of some kind rather than relying on `console.log` for all logging

## Both

- Configuration is entirely hardcoded. In a production scenario I would ensure that URLs, ports, etc were configured as a step in the build process (to accommodate for separate stages, the possibility of changing endpoints, etc)

- Schema validation is not robust. I would design a production system to more be less trustful of JSON schemas from clients.

- No consideration was given to making the application secure. Everything is sent via plaintext with no attempt to encrypt data or prevent attacks
