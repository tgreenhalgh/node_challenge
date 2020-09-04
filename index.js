const express = require('express')

const app = express()
const PORT = 3000

app.listen(PORT)

// necessary for tape testing
exports = module.exports = app;