const mongoose = require('mongoose')

const uri = process.env.MONGO_URI

mongoose
  .connect(uri)
  .then(() => {
    console.log('Database')
  })
  .catch((e) => {
    console.log(e)
  })

process.on('uncaughtException', (e) => {
  console.log(e.message)
  mongoose.disconnect()
})

module.exports = mongoose
