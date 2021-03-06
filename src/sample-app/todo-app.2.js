
const rocket = require('../lib/rocket');

const app = rocket();
const port = 3000;

//set up templete engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


let data = [
    { id: "1", item: 'get milk' },
    { id: "2", item: 'walk' },
    { id: "3", item: 'get some food' }
];

app.get('/todos', function (req, res) {
    res.render('todo', { todos: data });
});

// New todo
app.post('/todos', function (req, res) {
    console.log("Adding todo: ", req.body);
    data.push(req.body);
    res.json(data);
});


// Delete todo
app.delete('/todos/delete/:id', function (req, res) {
    console.log(`Deleting record with id ${req.params.id}`);
    data = data.filter(function (todo) {
        return todo.id.toString() !== req.params.id.toString();
    });
    res.json(data);
});

// Get todo
app.get('/todos/:id', function (req, res) {
    objIndex = data.findIndex((obj => obj.id == req.params.id));
    res.json(data[objIndex].item);
});

// Edit todo
app.put('/todos/edit', function (req, res) {
    objIndex = data.findIndex((obj => obj.id == req.body.id));
    console.log("Update: ", req.body);
    data[objIndex].item = req.body.item;
    res.json(data);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

