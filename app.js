const express = require('express');
const bodyParser = require('body-parser'); 

const app = express();
const PORT= process.env.PORT || 3000;


//urlEncode
app.use(bodyParser.urlencoded({extended : true}));

//view
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');""
app.use(express.static(__dirname+"/public"));

//use routes
app.use("/", require("./routes/index"));
app.use("/fb",  require('./routes/fb'));
app.use("/price",  require('./routes/price'));

//listen
app.listen(PORT, function(){
    console.log('Example app listening on port', PORT);
});

// app.get('/', function (req, res) {
//     res.render('index')
// });