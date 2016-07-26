var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: true });

var port = process.config.port || 8888;

app.use(function (req, res, next) {
    console.log('Time ', Date.now());
    next();
});
app.use(urlencodedParser);
// Static Middleware .....
app.use('/css',express.static(__dirname + '/client/css'));
app.use('/js/lib',express.static(__dirname + '/client/js/lib'));
app.use('/js/test_module',express.static(__dirname + '/client/js/test_module'));

app.use('/test', function (req, res, next) {
    console.log("Test middleware : ",req.params[0]);
    next();
});

app.post('/getJsonData', function (req, res) {
    console.log(req.body);
});

app.get('/',function(req,res){
    res.sendFile(__dirname +'/client/index.html');
});

app.get('/test:id', function (req, res) {
    console.log("Params... "+ req.params.id);
var dbres = [];
    Blog.find({}, function (err, data) {
        if (err) {
            console.log("Problem in fetching data");
        }
        dbres.push(data);
        //dbres = data;
        console.log("Testing ------" + dbres);
    });
    console.log("..............." + dbres.length);
    res.send("test "+ dbres);
});

app.get('/db', function(req, res){
      console.log("db.........");
      Blog.find({}, function (err, data) {
        if (err) {
            console.log("Problem in fetching data");
        }
        console.log("Testing ------" + data);
        res.send(data);
    });

});

app.get('/savedb', function(req, res){
      console.log("save db");
      var testdata = new Blog({
          username: "newData",
          todo:"save data",
          isDone: true,
          hasAttachment: false
      });
      testdata.save(function(err,testdata){
               if(err) {
                   console.log(err)
               }
               else {
                   console.log("Saved..."+testdata);
               }
      });
});

mongoose.connect('mongodb://utsavdb2:utsavdb2@ds015995.mlab.com:15995/nodetodosample');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("connected..");
});

var schema = mongoose.Schema;
var blogSchema = new schema({
    username: String,
    todo: String,
    isDone: Boolean,
    hasAttachment: Boolean
}, { collection: 'todos' });
var Blog = mongoose.model('Blog', blogSchema);

app.listen(port);


