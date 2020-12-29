const cookieParser = require('cookie-parser');
const logger = require('morgan');
const depthLimit = require('graphql-depth-limit');
const rateLimit = require("express-rate-limit");

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const graphqlHttp = require('express-graphql');
const graphqlSchema = require('./backend/schema/index');
const graphqlResolver = require('./backend/resolver/index');

const app = express();

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30
});
 
app.use("/api", apiLimiter);
app.set('trust proxy', 1);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'frontend/build')));

const DepthLimitRule = depthLimit(
  4,
  { ignore: [ 'whatever', 'trusted' ] },
  depths => console.log(depths)
)

app.use(
  '/api',
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    validationRules: [
      DepthLimitRule,
    ],
  }),
); 

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/frontend/build/index.html'));
});

const PORT = process.env.PORT || 5000;
const password = process.env.MONGODB_PASSWORD;
const db = process.env.MONGODB_DATABASE;

const MONGO_URI = `mongodb+srv://todo-list:${password}@todo-list.iwu8p.mongodb.net/${db}?retryWrites=true&w=majority`;

mongoose
  .connect(
    MONGO_URI,
    {useNewUrlParser: true, useFindAndModify: false,  useUnifiedTopology: true},
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });