import ApolloClient, {createNetworkInterface} from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
import {WebSocketLink} from 'apollo-link-ws';
import {SubscriptionClient} from 'subscriptions-transport-ws';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {split} from 'apollo-link';
import {getMainDefinition} from 'apollo-utilities';
import ApolloClientBoost  from "apollo-boost";

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
        reconnect: false,
    });
    return new WebSocketLink(subClient);
};

// Make HttpLink
console.log('CREATING GRAPH HTTP WITH=>' + GRAPHQL_ENDPOINT);
console.log('CREATING GRAPH WEBSOCKET WITH=>' + WEBSOCKET_ENDPOINT);
const httpConfig={
    uri: GRAPHQL_ENDPOINT,
    // credentials: 'include',fetchOptions: {
        mode: 'cors',
    // },  headers: {
    //     "Access-Control-Allow-Origin": "http://localhost:3006",
    //     "Access-Control-Allow-Methods": "POST",
    //     'Access-Control-Allow-Headers': 'application/json'
    //     //"Access-Control-Allow-Credentials" : true
    //     //"X-CSRFToken": Cookies.get('csrftoken')
    // }
};

const httpLink = new HttpLink(httpConfig,);
console.log(JSON.stringify(httpLink)+JSON.stringify(httpConfig));

const wsLink = mkWsLink(GRAPHQL_ENDPOINT);
// const wsLink=null;
const link = split(
    // split based on operation type
    ({query}) => {
        console.log('qiuery=>');
        console.log(query);
        const {kind, operation} = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink
);
console.log('LINK=>');
console.log(link);
const networkInterface = createNetworkInterface({
    uri: GRAPHQL_ENDPOINT,
    opts:{cors: true},
});

// Instantiate client
export const apollo_client = new ApolloClient({
    networkInterface,
    link,
    cache: new InMemoryCache({
        addTypename: false,
    }),
});
export const  apollo_client2 = new ApolloClientBoost({
    uri: GRAPHQL_ENDPOINT,
    fetchOptions: {
        mode: 'no-cors',
    },
});
