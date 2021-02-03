import { render, waitFor } from "../../test-utils";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import { RenderResult } from "@testing-library/react";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { CreateAccount, CREATE_ACCOUNT_MUTATION } from "../create-account";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { UserRole } from "../../__type_graphql__/globalTypes";

describe("<CreateAccount />", () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <CreateAccount />
        </ApolloProvider>
      );
    });
  });
  it("renders OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Create Account | Nuber-podcasts");
    });
  });
  it("should see email valiadation error message", async () => {
    const { getByPlaceholderText, getByRole, debug } = renderResult;
    await waitFor(() => {
      const email = getByPlaceholderText(/e-mail/i);
      userEvent.type(email, "wrong@emai");
      userEvent.tab();
    });
    const errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/Email address invalid/i);
  });
  it("should see passwords valiadation error message", async () => {
    const {
      getByPlaceholderText,
      getByRole,
      debug,
      getAllByRole,
    } = renderResult;
    await waitFor(() => {
      const email = getByPlaceholderText(/e-mail/i);
      userEvent.type(email, "some@password.com");
      getByRole("button").click();
    });
    const errors = getAllByRole("alert");
    errors.forEach((error) => expect(error).toHaveTextContent(/\bpassword\b/i));
  });
  it("should success to create account", async () => {
    const { getByPlaceholderText, getByRole, debug } = renderResult;
    const formData = {
      email: "some@test.com",
      password: "testpassword",
      role: UserRole.Host,
    };
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
        },
      },
    });
    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedMutationResponse
    );
    const email = getByPlaceholderText(/e-mail/i);
    const password = getByPlaceholderText(/password/i);
    const confirm = getByPlaceholderText(/confirm/i);
    const button = getByRole("button");
    const windowAlert = jest
      .spyOn(window, "alert")
      .mockImplementation(() => null);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.type(confirm, formData.password);
      userEvent.click(button);
    });
    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      createAccountInput: {
        ...formData,
      },
    });
    expect(windowAlert).toHaveBeenCalledTimes(1);
    expect(windowAlert).toHaveBeenCalledWith("Account Created! Log in now!");
  });
});
