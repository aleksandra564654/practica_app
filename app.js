require('dotenv').config()
const express = require('express')
const app = express()

app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ limit: '5mb', extended: false }))

// маршруты api
const router = require('./routes/index')
app.use('/api/', router)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.info(`Server is running on ${PORT}`))

// для тестов в mochaА
module.exports = app
