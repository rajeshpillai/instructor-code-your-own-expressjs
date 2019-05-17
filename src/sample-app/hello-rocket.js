var cors = require('cors');
const log = require('../logger/log');
const rocket = require('../lib/rocket');

// Create a new rocket application
const app = rocket();

const router = rocket.Router();

const port = 3000;

// Setup routing for static resources.  The below statement setups files
// in the folder public to be served statically
// e.g. http://localhost:3000/styles.css
app.use(rocket.static('public'));

//app.use(cors());

// Example: Middleware: Simple Console logger
app.use(function (req, res, next) {
    console.log('%s %s', req.method, req.url);
    next();
});

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

// Another route for edit and also test query string
app.get('/users/edit/:username', (req, res) => {
    console.log(req.query);
    res.send(`Editing /users/edit/${req.params.username}->
        query: ${JSON.stringify(req.query)}`
    );
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


// Redirect from /dashbaord to /
app.get("/dashboard", function (req, res) {
    res.redirect("/");
});


// Start the server on the port specified
app.listen(port, () =>
    console.log(`Server running on port ${port}!`)
);

