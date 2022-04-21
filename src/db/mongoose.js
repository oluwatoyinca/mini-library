const mongoose = require('mongoose')

const dbName = 'library'
const conURL = process.env.MONGODB_URL

mongoose.connect(conURL, {useNewUrlParser: true})