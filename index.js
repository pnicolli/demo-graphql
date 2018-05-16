const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const dbConnection = require('./mysql');

dbConnection.connect();

const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: user => user.id
    },
    name: {
      type: GraphQLString,
      resolve: user => user.name
    },
    nickname: {
      type: GraphQLString,
      resolve: user => user.nickname
    },
    friends: {
      type: GraphQLList(userType),
      resolve: (user, args, { dbConnection }) =>
        getFriends(dbConnection, user.id)
    }
  })
});

const getUser = (dbConnection, id) => {
  return dbConnection
    .query(`SELECT * FROM user WHERE id=${id}`)
    .then(res => res[0]);
};

const getFriends = (dbConnection, id) => {
  return dbConnection
    .query(`SELECT * FROM friendships WHERE user=${id}`)
    .then(res =>
      Promise.all(
        res.map(r => r.friend).map(friend => getUser(dbConnection, friend))
      )
    );
};

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
      user: {
        type: userType,
        args: {
          id: {
            description: 'User ID',
            type: GraphQLNonNull(GraphQLInt)
          }
        },
        resolve: (root, { id }, { dbConnection }) => getUser(dbConnection, id)
      }
    })
  })
});

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
    context: { dbConnection }
  })
);

app.listen(4000);

process.on('exit', () => dbConnection.end());
