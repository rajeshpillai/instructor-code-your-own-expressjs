const express = require('express');

// Create a new rocket application
const app = express();

const port = 3001;

// Setup routing for static resources.  The below statement setups files
// in the folder public to be served statically
// e.g. http://localhost:3000/styles.css
app.use(express.static('public'));


// Example: Get request to the root of the web server
app.get('/', (req, res) => res.send('Our own tiny node server (rocket)'));

// Example: Get request to the users resource
app.get('/users', (req, res) => res.send('All Users !'));

// Example: Get request to the users resource with username 
// dynamic as parameter
app.get('/users/:username', (req, res) => {
    res.send(`Listing user for -> ${req.params.username}`);
});

// Example: Get request to the users resource with 
// username as dynamic parameter and edit as an additional action
app.get('/users/:username/edit', (req, res) => {
    res.send(`Editing user ${req.params.username}`);
});

// Create new users resource
app.post('/users', (req, res) => {
    console.log("POST:/users", req.body);
    res.json(req.body);
});

// Create or modify existing user resource
app.put('/users', (req, res) => {
    console.log("PUT:/users", req.body);
    res.json(req.body);
});

// Minor updates to existing resource
app.patch('/users/:username', (req, res) => {
    console.log("PATCH:/users", req.body.username);
    res.json(req.body);
});

// Delete existing  resource by username
app.delete('/users/:username', (req, res) => {
    console.log("DELETE:/users/:username", req.params.username);
    res.json({ status: "ok" });
});


// Start the server on the port specified
app.listen(port, () =>
    console.log(`Express Server running on port ${port}!`)
);

