const express = require('express')
const router = new express.Router()
const Book = require('../../models/book')

//create new book
router.post('/books', async (req, res) => {
    const book = new Book(req.body)

    try {
        await book.save()
        res.status(201).send({book})
    } catch(e) {
        res.status(400).send(e)
    }
})

//query all books
router.get('/books', async (req, res) => {
    try {
        const books = await Book.find({})
        res.send(books)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.patch('/books/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'isbn', 'author']
    const isValid = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isValid) {
        return res.status(400).send({error: 'Invalid Update'})
    }

    try{
        const book = await Book.findById(req.params.id)

        if(!book) {
            return res.status(404).send('This book does not exist')
        }

        updates.forEach((update) => {
            if(!(update == 'id'))
            book[update] = req.body[update]
        })
        await book.save()
        res.status(201).send(book)
    }
    catch(e){
        res.status(500).send(e)
    }
})

module.exports = {router}