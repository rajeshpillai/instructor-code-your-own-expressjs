var multer  =   require('multer');  

const rocket = require('../lib/rocket');

const app = rocket();
const port = 3000;

app.use(rocket.static('public'));

//set up templete engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var storage =   multer.diskStorage({  
  destination: function (req, file, callback) {  
    callback(null, './uploads');  
  },  
  filename: function (req, file, callback) {  
    callback(null, file.originalname);  
  }  
});  
var upload = multer({ storage : storage});
  
app.get('/',function(req,res){  
      res.sendFile(__dirname + "/index.html");  
});  
  
app.post('/upload', upload.single("myfile"), function(req,res, next){  
  res.end("File is uploaded successfully!");  
});  
  
app.listen(port, () => {
    console.log(`File Upload app listening on port ${port}!`);
});

