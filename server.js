const express = require('express')
const contacts = require('./contacts.json')
var cors = require('cors')
const app = express()
const port = 3000

app.get('/contacts', cors(), (req, res) => {
  res.send(contacts)
})

app.listen(port, () => {
  console.log(`Example app listening at ${port}`)
})