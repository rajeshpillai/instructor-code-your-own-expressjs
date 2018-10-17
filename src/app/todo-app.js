// const express = require('express')
// const app = express()
// const port = 3000

// app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const rocket = require('../lib/rocket');
const app = rocket();
const port = 3000;

let data = [
    { id: "1", item: 'get milk' },
    { id: "2", item: 'walk' },
    { id: "3", item: 'get some food' }
];


app.get('/todos', (req, res) => {
    res.send(`Getting todos: ${JSON.stringify(data)}`);
});

app.get('/todos/:id', function (req, res) {
    objIndex = data.findIndex((obj => obj.id == req.params.id));

    let todo = data[objIndex].item;

    res.send(`${JSON.stringify(todo)}`);
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

