import express from "express";
import { UserData, MessageData } from "./data";
import { ApolloServer, gql } from "apollo-server-express";
import uuidv4 from "uuid/v4";
const app = express();
const PORT = 4000;

const schema = gql`
  type Query {
    user(id: Int!): User
    users: [User!]
    me: User

    messages: [Message!]
    message(id: Int!): Message!
  }
  type User {
    username: String!
    email: String!
    name: String!
    id: Int!
    messages: [Message!]
  }
  type Message {
    id: Int!
    text: String!
    user: User!
  }

  type Mutation {
    createMessage(text: String!, id: Int!): Message!
    deleteMessage(id: Int!): Boolean!
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
    },
    me: (parent, arg, context) => {
      return context.me;
    },
    messages: (parent, args) => {
      return MessageData;
    },
    message: (parent, args) => {
      let message = MessageData.find(message => message.id === args.id);
      return message;
    }
  },
  Message: {
    user: (parent, args, context) => {
      let user = UserData.find(user => user.id === parent.user_id);
      return user;
    }
  },
  User: {
    messages: parent => {
      let messageList = MessageData.filter(
        message => message.user_id === parent.id
      );
      return messageList;
    }
  },
  Mutation: {
    createMessage: (parent, args, context) => {
      const message = {
        text: args.text,
        id: args.id,
        user_id: 102
      };
      MessageData.push(message);
      return message;
    },
    deleteMessage: (parent, args) => {
      let deletedMessage = MessageData.filter(
        message => message.id === args.id
      );

      return deletedMessage.length > 0 ? true : false;
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: UserData[0]
  }
});

server.applyMiddleware({ app, path: "/graphql" });

app.listen({ port: PORT }, () => {
  console.log(`🚀  Server ready at ${PORT}`);
});
