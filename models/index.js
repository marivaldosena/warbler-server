const mongoose = require('mongoose')

mongoose.set('debug', true)
mongoose.Promise = Promise

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/warbler', {
    keepAlive: true,
    useNewUrlParser: true,
    useCreateIndex: true
})

module.exports.User = require('./users.model')
module.exports.Message = require('./messages.model')