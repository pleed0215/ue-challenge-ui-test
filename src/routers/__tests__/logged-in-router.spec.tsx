import React from "react";

import "@testing-library/jest-dom/extend-expect";
import { LoggedInRouter } from "../logged-in-router";
import { UserRole } from "../../__type_graphql__/globalTypes";
import { ME_QUERY } from "../../hooks/useMe";
import { MockedProvider } from "@apollo/client/testing";
import { waitFor, render } from "@testing-library/react";

describe("<LoggedInRouter />", () => {
  it("rendering OK", async () => {
    await waitFor(async () => {
      const mocks = [
        {
          request: {
            query: ME_QUERY,
          },
          result: {
            data: {
              me: {
                id: 1,
                email: "email@test.com",
                role: UserRole.Listener,
              },
            },
          },
        },
      ];
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <LoggedInRouter />
        </MockedProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });
});
