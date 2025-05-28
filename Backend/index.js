const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 7000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hi i am from root url....")
})

app.listen(port, () => {
    console.log("Listining on port no.", port);
})
