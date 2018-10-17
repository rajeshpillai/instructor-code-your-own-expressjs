// const express = require('express')
// const app = express()
// const port = 3000

// app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const rocket = require('../lib/rocket');
const app = rocket();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/welcome', (req, res) => res.send('Hello World -> welcome!'));
app.get('/:name', (req, res) => res.send(`Hello World -> ${req.params.name}`));


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

