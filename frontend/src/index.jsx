import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {ApolloProvider} from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import './index.css';
import reportWebVitals from './reportWebVitals';
import HttpsRedirect from 'react-https-redirect';

const client = new ApolloClient({
  uri: '/api',
});

ReactDOM.render(
  <HttpsRedirect>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </HttpsRedirect>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();