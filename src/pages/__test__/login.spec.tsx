import { render, waitFor } from "../../test-utils";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import { RenderResult } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { Login, LOGIN_MUTATION } from "../login";
import "@testing-library/jest-dom/extend-expect";

describe("<Login />", () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <Login />
        </ApolloProvider>
      );
    });
  });
  it("renders OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Log In | Nuber-podcasts");
    });
  });
  it("display email valiadation error message", async () => {
    const { getByPlaceholderText, getByRole, debug } = renderResult;
    await waitFor(() => {
      const email = getByPlaceholderText(/e-mail/i);
      userEvent.type(email, "wrong@emai");
    });
    const errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/Email Error/i);
  });

  it("display password valiadation error message", async () => {
    const { getByPlaceholderText, getByRole, debug } = renderResult;
    await waitFor(() => {
      const email = getByPlaceholderText(/e-mail/i);
      userEvent.type(email, "some@password.com");
      getByRole("button").click();
    });
    const errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/Password is required!/i);
  });
  it("success to login, ", async () => {
    const { getByPlaceholderText, getByRole, debug } = renderResult;
    const formData = {
      email: "email@test.com",
      password: "testpassword",
    };
    const email = getByPlaceholderText(/e-mail/i);
    const password = getByPlaceholderText(/password/i);
    const submitBtn = getByRole("button");
    const mockedMutationResponse = jest
      .fn()
      .mockResolvedValue({ data: { login: { ok: true, token: "testtoken" } } });
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });
    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      loginInput: { ...formData },
    });
  });
  it("fail to login, ", async () => {
    const { getByPlaceholderText, getByRole, debug } = renderResult;
    const formData = {
      email: "email@test.com",
      password: "testpassword",
    };
    const email = getByPlaceholderText(/e-mail/i);
    const password = getByPlaceholderText(/password/i);
    const submitBtn = getByRole("button");
    const mockedMutationResponse = jest.fn().mockResolvedValueOnce({
      data: { login: { ok: false, error: "failtest" } },
    });
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });
    const errorMessage = getByRole("alert");
    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      loginInput: { ...formData },
    });
    expect(errorMessage).toHaveTextContent("failtest");
  });
});
