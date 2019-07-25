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

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})
