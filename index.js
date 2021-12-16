const { ApolloServer, gql } = require('apollo-server')
require('dotenv').config()
require('./mongo')
const User = require('./models/User')
const resolvers = require('./graph/resolvers')
const typeDefs = require('./graph/typeDefs')
const jwt = require('jsonwebtoken')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null

    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      try {
        const decoded = jwt.verify(auth.substring(7), process.env.TOKEN_KEY)

        const user = await User.findById(decoded.id).select({
          email: 1,
          username: 1,
          description: 1
        })

        return { user }
      } catch (error) {
        console.log(error)
        return null
      }
    }
  }
})

server
  .listen()
  .then(({ url }) => console.log('Listen at: ' + url))
  .catch(console.log)
