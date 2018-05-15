const { graphql, buildSchema } = require('graphql');

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = {
  hello: () => 'Hello, Ferrara!'
};

graphql(
  schema,
  `
    {
      hello
    }
  `,
  root
).then(response => {
  console.log(response);
});
