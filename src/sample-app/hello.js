// const express = require('express')
// const app = express()
// const port = 3000

// app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const rocket = require('../lib/rocket');
const app = rocket();
const port = 3000;

// Example: Get request to the root of the web server
app.get('/', (req, res) => res.send('Our own tiny node server (rocket)'));

// Example: Simple get request to the root of the web server
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

// Delete existing  resource
app.delete('/user/:username', (req, res) => {
    console.log("DELETE:/user", req.params.username);
    res.json({ status: "ok" });
});


// Start the server on the port specified
app.listen(port, () =>
    console.log(`Server running on port ${port}!`)
);

