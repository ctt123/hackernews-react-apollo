import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import { BrowserRouter } from 'react-router-dom';
import { setContext } from '@apollo/client/link/context'; //
import { AUTH_TOKEN } from './constants';

// 订阅的依赖
import { split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

// 我们导入连接 Apollo 客户端所需的所有依赖项，
import {
    ApolloProvider,
    ApolloClient,
    createHttpLink,
    InMemoryCache
} from '@apollo/client';

// 我们创建将我们的实例与 GraphQL API httpLink连接起来的
const httpLink = createHttpLink({
    uri: 'http://localhost:4000'
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem(AUTH_TOKEN);
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    };
});

// 创建一个WebSocketLink实例代表WebSocket连接
const wsLink = new WebSocketLink({
    uri: `ws://localhost:4000/graphql`,
    options: {
        reconnect: true,
        connectionParams: {
            authToken: localStorage.getItem(AUTH_TOKEN)
        }
    }
});

const websocketLink = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return (
            kind === 'OperationDefinition' &&
            operation === 'subscription'
        );
    },
    wsLink,
    authLink.concat(httpLink)
);

// 我们ApolloClient通过传入httpLink和 的新实例来实例化InMemoryCache。
const client = new ApolloClient({
    // link: httpLink,
    // link: authLink.concat(httpLink), // 就在这个apolloLink中间件中将身份校验令牌附加到请求中
    link: websocketLink,
    cache: new InMemoryCache()
});

// 4
ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </BrowserRouter>,
    document.getElementById('root')
);
