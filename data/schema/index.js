var graphQL = require('graphql');

var schema = new graphQL.GraphQLSchema({
  query: new graphQL.GraphQLObjectType({
    name: 'RootQueryType',
      fields: {
        hello: {
          type: graphQL.GraphQLString,
          resolve() {
            return 'world';
          }
        }
      }
   })
});
  
module.exports = schema;