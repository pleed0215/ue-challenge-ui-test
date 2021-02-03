import { render, waitFor } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { LoggedOutRouter } from "../logged-out-router";
import { MockedProvider } from "@apollo/client/testing";

describe("<LoggedOutRouter/>", () => {
  it("render OK", async () => {
    await waitFor(() => {
      render(
        <MockedProvider>
          <LoggedOutRouter />
        </MockedProvider>
      );
    });
  });
});
