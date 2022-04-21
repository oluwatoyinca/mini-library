const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    isbn: {
        type: Number,
        required: true,
        default: 123456789
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    }
}, 
{
    timestamps: true
})

const Book = mongoose.model('Book', bookSchema)

module.exports= Book