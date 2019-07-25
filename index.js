const express = require('express')
const app = express()
const db = require('./data/db')

const PORT = process.env.PORT || 5000

app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    message: `Mr. Watson, come here. I want to see you.`
  })
})

app.post('/api/users', async (req, res) => {
  const { name, bio } = req.body
  if (!name || !bio) {
    return res.status(400).json({
      success: false,
      error: 'Please provide name and bio for the user.'
    })
  }
  try {
    const { id } = await db.insert({ name, bio })
    const user = await db.findById(id)
    res.status(201).json({
      success: true,
      user
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'There was an error while saving the user to the database'
    })
  }
})

app.get('/api/users', async (req, res) => {
  try {
    const users = await db.find()
    res.status(200).json({
      success: true,
      users
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'The users information could not be retrieved'
    })
  }
})

app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params
  try {
    const user = await db.findById(id)
    if (!user) {
      res.status(404).json({
        success: false,
        error: `The user with the specified ID ${id} does not exist`
      })
    } else {
      res.status(200).json({
        success: true,
        user
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'The user information could not be retrieved'
    })
  }
})

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params
  try {
    const user = await db.remove(id)
    if (!user) {
      res.status(404).json({
        success: false,
        error: `The user with the specified ID ${id} does not exist`
      })
    } else {
      res.status(204)
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'The user could not be removed'
    })
  }
})

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params
  const { name, bio } = req.body
  if (!name || !bio) {
    return res.status(400).json({
      success: false,
      error: 'Please provide name and bio for the user.'
    })
  }
  try {
    const user = await db.findById(id)
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'The user with the specified ID does not exist'
      })
    } else {
      await db.update(id, { name, bio })
      const updatedUser = await db.findById(id)
      res.status(200).json({
        success: true,
        user: updatedUser
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'The user information could not be modified'
    })
  }
})

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})
