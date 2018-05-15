const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} = require('graphql');

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => 'Hello, Ferrara!'
      }
    }
  })
});

graphql(
  schema,
  `
    {
      hello
    }
  `
).then(response => {
  console.log(response);
});
