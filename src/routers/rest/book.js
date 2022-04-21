const express = require('express')
const router = new express.Router()
const Book = require('../../models/book')

router.post('/books', async (req, res) => {
    const book = new Book(req.body)

    try {
        await book.save()
        res.status(201).send({book})
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get('/books', async (req, res) => {
    try {
        const books = await Book.find({})
        res.send(books)
    } catch(e) {
        res.status(500).send(e)
    }
})

module.exports = {router}