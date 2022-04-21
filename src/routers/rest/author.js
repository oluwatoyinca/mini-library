const express = require('express')
const router = new express.Router()
const Author = require('../../models/author')

router.post('/authors', async (req, res) => {
    const author = new Author(req.body)

    try {
        await author.save()
        res.status(201).send({author})
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get('/authors', async (req, res) => {
    try {
        const authors = await Author.find({})
        res.send(authors)
    } catch(e) {
        res.status(500).send(e)
    }
})

module.exports = {router}