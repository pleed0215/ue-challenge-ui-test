import { MockedProvider } from "@apollo/client/testing";
import { getByText, render, waitFor } from "@testing-library/react";
import React from "react";

import { Header } from "../header";
import { ME_QUERY } from "../../hooks/useMe";
import { UserRole } from "../../__type_graphql__/globalTypes";
import { BrowserRouter as Router } from "react-router-dom";

describe("<Header />", () => {
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
            role: UserRole.Host,
          },
        },
      },
    },
  ];

  it("rendering OK", async () => {
    await waitFor(async () => {
      const { getByText } = render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Router>
            <Header />
          </Router>
        </MockedProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
      getByText("email@test.com");
    });
  });
});
