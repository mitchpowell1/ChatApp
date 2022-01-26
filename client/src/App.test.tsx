import React from "react";
import { render, screen } from "@testing-library/react";
import { App } from "./App";
import { HttpServerInteractor } from "./server/HttpServer";
jest.mock("./server/HttpServer");

test("renders learn react link", () => {
  const mockServer = new HttpServerInteractor({ baseUrlString: "", port: "" });

  render(<App httpInteractor={mockServer} />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
