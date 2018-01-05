import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import schema from './data/schema';
import { execute, subscribe } from 'graphql'
import { SubscriptionServer } from 'subscriptions-transport-ws';

const GRAPHQL_PORT = 3000;
const SUBSCRIPTIONS_PATH = '/subscriptions';
const GRAPHQL_PATH = '/graphql';
const GRAPHIQL_PATH = '/graphiql';

const graphQLServer = express();
const cors = require('cors');

graphQLServer.use(cors());
graphQLServer.use(GRAPHQL_PATH, bodyParser.json(), graphqlExpress({ schema }));
graphQLServer.use(GRAPHIQL_PATH, graphiqlExpress({ endpointURL: GRAPHQL_PATH }));

const server = createServer(graphQLServer);

server.listen(GRAPHQL_PORT, () => {
    console.log(`GraphiQL is now running on http://localhost:${GRAPHQL_PORT}${GRAPHIQL_PATH}`);
    console.log(`API Server is now running on http://localhost:${GRAPHQL_PORT}${GRAPHQL_PATH}`);
    console.log(`API Subscriptions server is now running on ws://localhost:${GRAPHQL_PORT}${SUBSCRIPTIONS_PATH}`);
});

SubscriptionServer.create(
    {
        schema,
        execute,
        subscribe,
    },
    {
        server,
        path: SUBSCRIPTIONS_PATH,
    }
);