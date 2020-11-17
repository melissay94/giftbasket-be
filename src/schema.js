const { gql } = require("apollo-server-express");

const typeDefs = gql`

type User {
  id: Int!
  email: String!
  password: String!
  name: String
  baskets: [Basket!]!
  gifts: [Gift!]!
}

type AuthPayload {
  token: String
  user: User
}

type Basket {
  id: Int!
  name: String!
  birthdate: String
  address: String
  gifts: [Gift!]!
  user: User!
}

input CreateGiftInput {
  title: String!
  description: String
  link: String
  image: String
  isPublic: Boolean!
}

type Gift {
  id: Int!
  title: String!
  description: String
  link: String
  image: String
  isPublic: Boolean!
  users: [User!]!
  baskets: [Basket!]!
}

type Query {
  currentUser: User
  basket(id: Int!): Basket
  gifts: [Gift!]!
}

type Mutation {
  createBasket(name: String!, birthdate: String, address: String, gifts: [CreateGiftInput!], existingGiftIds: [ID!]): Basket
  editBasket(id: Int!, name: String, birthdate: String, address: String): Basket
  deleteBasket(id: Int!): Boolean
  createGift(basketId: Int, title: String!, description: String, link: String, image: String, isPublic: Boolean!): Gift
  editGift(id: Int!, title: String, description: String, link: String, image: String, isPublic: Boolean): Gift
  addGiftToUser(id: Int!): User
  addGiftToBasket(basketId: Int!, giftId: Int!): Basket
  deleteGift(id: Int!): Boolean
  removeGiftFromBasket(basketId: Int!, giftId: Int!): Boolean
  signup(email: String!, password: String!, name: String): AuthPayload
  login(email: String!, password: String!): AuthPayload
  updateUser(email: String, name: String): AuthPayload
  updatePassword(password: String!, newPassword: String!): AuthPayload
  deleteUser(password: String!): Boolean
}
`;

module.exports = typeDefs;
