const mongoose = require('mongoose')
const validator = require('validator')
const Book = require('./book')

const authorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        required: true
    }
}, 
{
    timestamps: true
})

authorSchema.virtual('books', {
    ref: 'Book',
    localField: '_id',
    foreignField: 'author'
})

// here we deleting books of a author before their author document is removed
authorSchema.pre('remove', async function (next) {
    const author = this
    
    await Book.deleteMany({author: author._id})
    next()
})

const Author = mongoose.model('Author', authorSchema)

module.exports = Author