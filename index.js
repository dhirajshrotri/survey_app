var express = require('express');
var app = express()

const port = 3000;

app.get('/', function(req, res){
	res.sendFile(__dirname + '/homepage.html');
});

app.get('/createSurvey', function(req, res){
	res.sendFile(__dirname + '/createSurvey.html');
});

app.get('/success', function(req, res){
	res.sendFile(__dirname + '/success.html');
});

app.listen(port, () => console.log('App listening on port '+port ));