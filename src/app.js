const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./routers/graphql/schema')
const authorRouter = require('./routers/rest/author')
const bookRouter = require('./routers/rest/book')
const cors = require('cors');
const app = express()
require('./db/mongoose')

app.use(express.json())
app.use(cors());
//graphQL router
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

//restAPI router
// app.use(authorRouter.router)
// app.use(bookRouter.router)

module.exports = app