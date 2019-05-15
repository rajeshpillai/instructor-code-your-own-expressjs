// const express = require('express')
// const app = express()
// const port = 3000

// app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const rocket = require('../lib/rocket');
const app = rocket();
const port = 3000;

app.get('/', (req, res) => res.send('Our own tiny node server (rocket)'));

app.get('/welcome', (req, res) => res.send('Welcome !'));

app.get('/:name', (req, res) => {
    res.send(`Hello -> ${req.params.name}`);
});

app.get('/user/:name/edit', (req, res) => {
    res.send(`Editing user ${req.params.name}`);
});

// Create new resource
app.post('/user', (req, res) => {
    console.log("POST:/user/new", req.body);
    res.json(req.body);
});

// Create or modify existing resource
app.put('/user', (req, res) => {
    console.log("PUT:/user/new", req.body);
    res.json(req.body);
});

// Minor updates to existing resource
app.patch('/user/:username', (req, res) => {
    console.log("PATCH:/user", req.body.username);
    res.json(req.body);
});


app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`)
);

