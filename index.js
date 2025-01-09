const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


app.get('/', (req, res) =>{
   res.send('My server is running on port : ', port)
})


app.listen(port, () =>{
   console.log("My sever is running on port : ", port);
})