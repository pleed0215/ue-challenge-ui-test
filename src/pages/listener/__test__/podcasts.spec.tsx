import { render, waitFor } from "../../../test-utils";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import { act, RenderResult } from "@testing-library/react";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { ALLPODCASTS_QUERY, Podcasts } from "../podcasts";
import { getAllPodcastQuery } from "../../../__type_graphql__/getAllPodcastQuery";

const resolveData: getAllPodcastQuery = {
  getAllPodcasts: {
    __typename: "GetAllPodcastsOutput",
    ok: true,
    error: null,
    podcasts: [
      {
        __typename: "Podcast",
        id: 1,
        title: "test title",
        category: "Test category",
        thumbnailUrl: "testurl.jpg",
        description: "test description",
        rating: 1,
      },
    ],
  },
};

describe("<Podcasts />", () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;
  let mockedQueryResponse: jest.Mock;
  beforeEach(async () => {
    await waitFor(() => {
      mockedQueryResponse = jest.fn().mockResolvedValue({ data: resolveData });
      mockedClient = createMockClient();
      mockedClient.setRequestHandler(ALLPODCASTS_QUERY, mockedQueryResponse);
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <Podcasts />
        </ApolloProvider>
      );
    });
  });
  it("renders OK", async () => {
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(mockedQueryResponse).toHaveBeenCalledTimes(1);
  });
});
