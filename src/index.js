import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';


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

// 我们ApolloClient通过传入httpLink和 的新实例来实例化InMemoryCache。
const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
});

// 4
ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
);
