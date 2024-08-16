const express = require('express')
const app = express()
require('dotenv').config()


PORT = 8000

app.listen(PORT, console.log('server running on port : 8000'))