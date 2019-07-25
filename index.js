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
    res.status(400).json({
      success: false,
      error: 'Please provide name and bio for the user.'
    })
  }
  try {
    const user = await db.insert({ name, bio })
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

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})
