import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()
const PORT = 5000

app.use(cors())
app.use(bodyParser.json())

// Example API route
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from server!' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})