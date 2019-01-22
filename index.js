require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const errorHandler = require('./handlers/error.handler')
const authRoutes = require('./routes/auth.route')
const messagesRoutes = require('./routes/message.route')
const { loginRequired, ensureCorrectUser } = require('./middleware/auth.middleware')
const db = require('./models')

const PORT = process.env.PORT || 8081

app.use(cors())
app.use(bodyParser.json())

app.use('/api/auth', authRoutes)
app.use('/api/users/:id/messages',
    loginRequired,  ensureCorrectUser, messagesRoutes)

app.get('/api/messages', loginRequired, async function(req, res, next) {
    try {
        let messages = await db.Message.find()
            .sort({ createdAt: 'DESC' })
            .populate('user', {
                username: true,
                profileImageUrl: true
            })
        
        return res.status(200).json(messages)
    } catch (e) {
        return next(e)
    }
})

app.use((req, res, next) => {
    let err = new Error('Not Found')
    err.status = 404
    next(err)
})

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})