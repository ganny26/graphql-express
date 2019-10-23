import express from "express";
import { UserData } from "./data";
import { ApolloServer, gql } from "apollo-server-express";

const app = express();
const PORT = 4000;

const schema = gql`
  type Query {
    user(id: Int!): User
    users: [User!]
  }
  type User {
    username: String!
    email: String!
    name: String!
    id: Int!
  }
`;
const resolvers = {
  Query: {
    user: (parent, args) => {
      let userData = UserData.find(user => user.id === args.id);
      return userData;
    },
    users: () => {
      return Object.values(UserData);
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers
});

server.applyMiddleware({ app, path: "/graphql" });

app.listen({ port: PORT }, () => {
  console.log(`🚀  Server ready at ${PORT}`);
});
