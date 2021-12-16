const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { UserInputError, AuthenticationError } = require('apollo-server')
const { registerSchema, loginSchema } = require('../lib/joi.validators')
const saltRounds = 10

const resolvers = {
  Query: {
    Me: (obj, args, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated')
      return user
    }
  },
  Mutation: {
    login: async (obj, args) => {
      const { email, password } = args.data

      const { error } = loginSchema.validate({ email, password })

      if (error) throw new UserInputError(error.details[0].message)

      const userFind = await User.findOne({ email })
      const passwordV =
        userFind === null
          ? null
          : await bcrypt.compare(password, userFind.password)

      if (!(userFind && passwordV))
        throw new UserInputError('Invalid credentials')

      const user = {
        username: userFind.username,
        id: userFind._id
      }

      return {
        token: jwt.sign(user, process.env.TOKEN_KEY, { expiresIn: '2h' })
      }
    },
    register: async (obj, args) => {
      const { email, username, password } = args.data

      const { error } = registerSchema.validate({ username, email, password })

      if (error) throw new UserInputError(error.details[0].message)

      const userEmailAlreadyExist = await User.findOne({ email })
      const usernameAlreadyExist = await User.findOne({ username })

      if (userEmailAlreadyExist || usernameAlreadyExist)
        return {
          status: 400,
          success: false,
          message: 'This user already register'
        }

      const passwordHash = await bcrypt.hash(password, saltRounds)

      let user = new User({
        email,
        username,
        description: '',
        password: passwordHash
      })

      try {
        await user.save()

        return {
          status: 200,
          success: true,
          message: 'Register succesfully'
        }
      } catch (e) {
        throw new UserInputError(e.message)
      }
    },
    addUserDescription: async (obj, args, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated')

      if (args.description.length < 3)
        throw new UserInputError('The description must be long')

      try {
        user.description = args.description
        await user.save()

        return user
      } catch (e) {
        throw new UserInputError(e.message)
      }
    }
  }
}

module.exports = resolvers
