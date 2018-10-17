const rocket = require('../lib/rocket');

const app = rocket();
const port = 3000;

let data = [
    { id: "1", item: 'get milk' },
    { id: "2", item: 'walk' },
    { id: "3", item: 'get some food' }
];

// Get all todos
app.get('/todos', (req, res) => {
    res.send(JSON.stringify(data));
});

// Get with param
app.get('/todos/:id', function (req, res) {
    objIndex = data.findIndex((obj => obj.id == req.params.id));
    let todo = data[objIndex].item;
    res.send(JSON.stringify(todo));
});

// New todo 
app.post('/todo', function (req, res) {
    data.push(req.body);
    res.send(JSON.stringify(data));
});


// Edit todo
app.put('/todos/:id/edit', function (req, res) {
    console.log("PUT: ", req.body);
    objIndex = data.findIndex((obj => obj.id == req.body.id));
    data[objIndex].item = req.body.item;
    res.send(JSON.stringify(data));
});

app.delete('/todos/delete/:id', function (req, res) {
    console.log(`Deleting record with id ${req.params.id}`);
    data = data.filter(function (todo) {
        return todo.id !== req.params.id;
    });
    res.send(JSON.stringify(data));
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`));

