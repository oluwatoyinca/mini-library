const mongoose = require('mongoose')
const validator = require('validator')

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

const Author = mongoose.model('Author', authorSchema)

module.exports = Author