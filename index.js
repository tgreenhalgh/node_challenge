const express = require('express')
const fs = require('fs')

const app = express()
const PORT = 3000

app.get('/dependencies', (req, res) => {
  try {
    const rawdata = fs.readFileSync('package.json', 'utf8')
    const data = JSON.parse(rawdata)
    res.send(data.dependencies)
  } catch (err) {
    console.error(`Error reading package.json: ${err}`)
  }
})

app.listen(PORT)

// necessary for tape testing
exports = module.exports = app;