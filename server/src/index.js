import express from "express";
import { UserData } from "./data";
import { ApolloServer, gql } from "apollo-server-express";

const app = express();
const PORT = 4000;

const schema = gql`
  type Query {
    me: User
  }
  type User {
    username: String!
    email: String!
    name: String!
  }
`;
const resolvers = {
  Query: {
    me: () => {
      return {
        username: UserData.username,
        name: UserData.name,
        email: UserData.email
      };
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
