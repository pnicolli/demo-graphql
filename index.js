const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} = require('graphql');
const express = require('express');
const graphqlHTTP = require('express-graphql');

const userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: GraphQLInt,
      resolve: user => user.id
    },
    name: {
      type: GraphQLString,
      resolve: user => user.name
    }
  }
});

const me = {
  id: 1,
  name: 'Piero'
};

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      me: {
        type: userType,
        resolve: () => me
      }
    }
  })
});

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

app.listen(4000);
