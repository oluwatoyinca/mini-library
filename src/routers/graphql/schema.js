const {GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLString, GraphQLInt} = require ('graphql')
const Author = require('../../models/author')
const Book = require('../../models/book')

//type that represents author model
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

//type that represents book model
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

//query definition for authors and books
const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Queries",
    fields: () => ({
        //all authors
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
        //one author by id
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
        //all books
        books: {
            type: new GraphQLList(BookType),
            description: "List Of Books",
            resolve: async () => {
                try {
                    const books = await Book.find({})
                    return(books)
                } catch(e) {
                    throw e
                }
            }
        },
        //one book by id or name
        book: {
            type: BookType,
            description: "A Single Book",
            args: {
                id: {type: GraphQLString},
                name: {type: GraphQLString}
            },
            resolve: async (parent, args) => {
                try {
                    if(args.id){
                        const book = await Book.findById(args.id)
                        return(book)
                    }
                    else if (args.name){
                        const book = await Book.findOne({name: args.name})
                        return(book)
                    }
                } catch(e) {
                    throw e
                }
            }
        }
    })
})

//mutation definition for authors and books
const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutations",
    fields: () => ({
        //add a new author
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
        },
        //update a single author
        updateAuthor: {
            type: AuthorType,
            description: "Update an author",
            args: {
                id: {type: GraphQLNonNull(GraphQLString)},
                name: {type: GraphQLString},
                email: {type: GraphQLString},
                age: {type: GraphQLInt}
            },
            resolve: async (parent, args) => {
                try{
                    const author = await Author.findById(args.id)

                    const updates = Object.keys(args)

                    updates.forEach((update) => {
                        if(!(update == 'id'))
                        author[update] = args[update]
                    })
                    await author.save()
                    return author
                }
                catch(e){
                    throw e
                }
            }
        },
        //add a new book
        addBook: {
            type: BookType,
            description: "Add a book",
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                isbn: {type: GraphQLNonNull(GraphQLInt)},
                author: {type: GraphQLNonNull(GraphQLString)}
            },
            resolve: async (parent, args) => {
                try{
                    const  book = new Book(args)
                    await book.save()
                    return book
                }
                catch (e){
                    throw e
                }
            }
        },
        //update a single book
        updateBook: {
            type: BookType,
            description: "Update a book",
            args: {
                id: {type: GraphQLNonNull(GraphQLString)},
                name: {type: GraphQLString},
                isbn: {type: GraphQLInt},
                author: {type: GraphQLString}
            },
            resolve: async (parent, args) => {
                try{
                    const book = await Book.findById(args.id)

                    const updates = Object.keys(args)

                    updates.forEach((update) => {
                        if(!(update == 'id'))
                        book[update] = args[update]
                    })
                    await book.save()
                    return book
                }
                catch(e){
                    throw e
                }
            }
        }
    })
})

//schema creation
const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

module.exports = schema