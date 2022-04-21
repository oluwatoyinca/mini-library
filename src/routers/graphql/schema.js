const {GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLString, GraphQLInt} = require ('graphql')
const Author = require('../../models/author')
const Book = require('../../models/book')

const AuthorType = new GraphQLObjectType({
    name: "Author",
    description: "This represents a author",
    fields: () => ({
        _id: {type: GraphQLNonNull(GraphQLString)},
        name: {type: GraphQLNonNull(GraphQLString)},
        email: {type: GraphQLNonNull(GraphQLString)},
        age: {type: GraphQLNonNull(GraphQLInt)},
        books: {
            type: new GraphQLList(BookType),
            resolve: async (author) => {
                try{
                    const books = await Book.find({author: author._id})
                    return(books)
                }
                catch(e){
                    throw e
                }
            }
        }
    })
})

const BookType = new GraphQLObjectType({
    name: "Book",
    description: "This represents a book",
    fields: () => ({
        _id: {type: GraphQLNonNull(GraphQLString)},
        name: {type: GraphQLNonNull(GraphQLString)},
        isbn: {type: GraphQLNonNull(GraphQLInt)},
        author: {
            type: AuthorType,
            resolve: async (book) => {
                try{
                    const authors = await Author.findById(book.author)
                    return(authors)
                }
                catch(e){
                    throw e
                }
            }
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Queries",
    fields: () => ({
        authors: {
            type: new GraphQLList(AuthorType),
            description: "List Of Authors",
            resolve: async () => {
                try {
                    const authors = await Author.find({})
                    return(authors)
                } catch(e) {
                    throw e
                }
            }
        },
        author: {
            type: AuthorType,
            description: "A Single Author",
            args: {
                id: {type: GraphQLString}
            },
            resolve: async (parent, args) => {
                try {
                    const author = await Author.findById(args.id)
                    return(author)
                } catch(e) {
                    throw e
                }
            }
        },
        books: {
            type: new GraphQLList(BookType),
            description: "List Of Books",
            resolve: async () => {
                try {
                    const authors = await Book.find({})
                    return(authors)
                } catch(e) {
                    throw e
                }
            }
        },
        book: {
            type: BookType,
            description: "A Single Book",
            args: {
                id: {type: GraphQLString}
            },
            resolve: async (parent, args) => {
                try {
                    const book = await Book.findById(args.id)
                    return(book)
                } catch(e) {
                    throw e
                }
            }
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutations",
    fields: () => ({
        addAuthor: {
            type: AuthorType,
            description: "Add an book",
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                email: {type: GraphQLNonNull(GraphQLString)},
                age: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: async (parent, args) => {
                try{
                    const author = new Author(args)
                    await author.save()
                    return author
                }
                catch (e) {
                    throw e
                }
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

module.exports = schema