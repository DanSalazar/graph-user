const { gql } = require('apollo-server')

const typeDefs = gql`
  type User {
    email: String!
    username: String!
    password: String!
    description: String!
    id: ID!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterInput {
    email: String!
    username: String!
    password: String!
  }

  interface MutationResponse {
    status: Int!
    success: Boolean!
    message: String!
  }

  type RegisterResponse implements MutationResponse {
    status: Int!
    success: Boolean!
    message: String!
  }

  type Token {
    token: String!
  }

  type Query {
    Me: User
  }

  type Mutation {
    login(data: LoginInput!): Token!
    register(data: RegisterInput!): RegisterResponse!
    addUserDescription(description: String!): User!
  }
`

module.exports = typeDefs
