const graphql = require('graphql');

module.exports = graphql.buildSchema(`
  type Todo {
    _id: ID!
    task: String!
    isCompleted: Boolean!
    created: String!
    updated: String!
  }
  type RootQuery {
    todos: [Todo!]!
  }
  type RootMutation {
    addTodo(task: String!): Todo
    completeTodo(todoId: ID!, isCompleted: Boolean): Todo
    deleteTodo(todoId: ID!): String
    editTodo(todoId: ID!, task: String!): Todo
  }
  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);