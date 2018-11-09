var express = require('express');
var app = express();
var router = require('./routes');
var bodyParser = require('body-parser');
var models = require('./models');

app.use( bodyParser.json() );       
app.use(bodyParser.urlencoded({     
  extended: true
}));

router.use(function(req, res, next){
	console.log("/"+req.method);
	next();
});

app.use('/', router);

models.sequelize.sync({
	//force: true
}).then(function(){
	var server = app.listen(3000, "127.0.0.1", function () {
		var host = server.address().address
		var port = server.address().port
		console.log("Example app listening at http://%s:%s", host, port)
	});
});
