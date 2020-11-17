const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const typeDefs = require("./schema");
const models = require("../models");
const Query = require("./resolvers/Query");
const User = require("./resolvers/user/User");
const UserMutation = require("./resolvers/user/Mutation");
const Basket = require("./resolvers/basket/Basket");
const BasketMutation = require("./resolvers/basket/Mutation");
const Gift = require("./resolvers/gift/Gift");
const GiftMutation = require("./resolvers/gift/Mutation");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());

const authenitcate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null || token == "") {
    return next();
  }

  jwt.verify(token, process.env.APP_SECRET, (err, user) => {
    if(err) {
      console.log(err);
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
}

app.use(authenitcate);

const resolvers = {
  Query,
  Mutation: {
    ...BasketMutation,
    ...GiftMutation,
    ...UserMutation,
  },
  Basket,
  Gift,
  User,
};

const server = new ApolloServer({
  typeDefs, 
  resolvers,
  context: ({ req }) => {
    return {
    currentUser: req.user,
    models,
  }},
});

server.applyMiddleware({ app });
models.sequelize.authenticate();
models.sequelize.sync();

app.listen({ port }, () => console.log(`We're all mad here on localhost:${port}${server.graphqlPath}`));
