if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const graphqlHTTP = require('express-graphql').graphqlHTTP;
const graphqlSchema = require('./backend/schema/index');
const graphqlResolver = require('./backend/resolver/index');

const PORT = process.env.PORT || 4000;

const server = express();

const MONGO_URI = 'mongodb+srv://todo-list:todo-list@todo-list.iwu8p.mongodb.net/<todo-list>?retryWrites=true&w=majority';
server.use(express.json());
server.use(cors());

server.use(express.static(path.join(__dirname, 'frontend/build')));

server.use(
  '/api',
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
  }),
);

server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/frontend/build/index.html'));
});

mongoose
  .connect(
    MONGO_URI,
    {useNewUrlParser: true, useFindAndModify: false,  useUnifiedTopology: true},
  )
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });