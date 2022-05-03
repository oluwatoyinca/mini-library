const express = require('express')
const router = new express.Router()
const Author = require('../../models/author')

//create new author
router.post('/authors', async (req, res) => {
    const author = new Author(req.body)

    try {
        await author.save()
        res.status(201).send({author})
    } catch(e) {
        res.status(400).send(e)
    }
})

//query all authors
router.get('/authors', async (req, res) => {
    try {
        const authors = await Author.find({})
        res.send(authors)
    } catch(e) {
        res.status(500).send(e)
    }
})

//query an author
router.get('/authors/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.send(author)
    } catch(e) {
        res.status(500).send(e)
    }
})

//update an author
router.patch('/authors/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'age']
    const isValid = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isValid) {
        return res.status(400).send({error: 'Invalid Update'})
    }

    try{
        const author = await Author.findById(req.params.id)

        if(!author) {
            return res.status(404).send('This author does not exist')
        }

        updates.forEach((update) => {
            if(!(update == 'id'))
            author[update] = req.body[update]
        })
        await author.save()
        res.status(201).send(author)
    }
    catch(e){
        res.status(500).send(e)
    }
})

module.exports = {router}