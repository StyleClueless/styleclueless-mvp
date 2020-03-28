import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

const scheme = proto => {
    return window.location.protocol === 'https:' ? `${proto}s` : proto;
};
const HASURA_GRAPHQL_ENGINE_HOSTNAME = 'www.styleclueless.com';
const GRAPHQL_ENDPOINT = `${scheme(
    'http'
)}://${HASURA_GRAPHQL_ENGINE_HOSTNAME}/v1/graphql`;
const WEBSOCKET_ENDPOINT = `${scheme(
    'ws'
)}://${HASURA_GRAPHQL_ENGINE_HOSTNAME}/v1/graphql`;

// Make WebSocketLink with appropriate url
const mkWsLink = uri => {
    console.log(uri);
    const splitUri = uri.split('//');
    const subClient = new SubscriptionClient(WEBSOCKET_ENDPOINT, {
        reconnect: true,
    });
    return new WebSocketLink(subClient);
};

// Make HttpLink
console.log('CREATING GRAPH HTTP WITH=>' + GRAPHQL_ENDPOINT);
console.log('CREATING GRAPH WEBSOCKET WITH=>' + WEBSOCKET_ENDPOINT);

const httpLink = new HttpLink({ uri: GRAPHQL_ENDPOINT });
console.log(httpLink);

const wsLink = mkWsLink(GRAPHQL_ENDPOINT);
const link = split(
    // split based on operation type
    ({ query }) => {
        console.log('qiuery=>');
        console.log(query);
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink
);
console.log('LINK=>');
console.log(link);
const networkInterface = createNetworkInterface({
    uri: GRAPHQL_ENDPOINT,
    cors: true,
});

// Instantiate client
export const apollo_client = new ApolloClient({
    networkInterface,
    link,
    cache: new InMemoryCache({
        addTypename: false,
    }),
});
