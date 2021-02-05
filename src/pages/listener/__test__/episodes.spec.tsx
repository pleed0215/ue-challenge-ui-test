import { render, waitFor } from "../../../test-utils";
import React, { ReactElement } from "react";
import {
  ApolloClient,
  ApolloProvider,
  from,
  InMemoryCache,
} from "@apollo/client";
import { RenderResult } from "@testing-library/react";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { Episodes, GET_EPISODES_QUERY } from "../episodes";
import { Route, Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { MockedProvider } from "@apollo/client/testing";
import { act } from "react-dom/test-utils";
import {
  getEpisodes,
  getEpisodesVariables,
} from "../../../__type_graphql__/getEpisodes";

const podcastData = {
  getPodcast: {
    ok: true,
    podcast: {
      id: 1,
      title: "test",
      category: "test",
      thumbnailUrl: "test",
      description: "test",
      rating: 1,
    },
  },
};

const episodeData = {
  getEpisodes: {
    ok: true,
    episodes: [
      {
        title: "test",
        description: "test",
      },
    ],
  },
};

const resolveData: getEpisodes = {
  getPodcast: {
    __typename: "PodcastOutput",
    ok: true,
    error: null,
    podcast: {
      __typename: "Podcast",
      id: 1,
      title: "test title",
      category: "test category",
      thumbnailUrl: "test url",
      description: "test description",
      rating: 1,
    },
  },
  getEpisodes: {
    __typename: "EpisodesOutput",
    ok: true,
    error: null,
    episodes: [
      {
        __typename: "Podcast",
        title: "test episode title",
        description: "test episode description",
      },
    ],
  },
};

const mocks = [
  {
    request: {
      query: GET_EPISODES_QUERY,
      variables: {
        input: {
          id: 1,
        },
      },
    },
    result: () => {
      console.log(resolveData);
      return {
        data: resolveData,
      };
    },
  },
];

describe("<Podcasts />", () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;
  let mockedQueryResolve: jest.Mock;

  beforeEach(async () => {
    await waitFor(() => {
      const history = createMemoryHistory({
        initialEntries: ["/episodes/1"],
      });
      mockedQueryResolve = jest.fn().mockResolvedValue({ data: resolveData });
      mockedClient = createMockClient();
      mockedClient.setRequestHandler(GET_EPISODES_QUERY, mockedQueryResolve);
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <Router history={history}>
            <Route path="/episodes/:id">
              <Episodes />
            </Route>
          </Router>
        </ApolloProvider>
      );
    });
  });
  it("renders OK", async () => {
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const { debug } = renderResult;
    expect(mockedQueryResolve).toHaveBeenCalledTimes(1);
  });
});
