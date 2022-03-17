var express = require('express');
var app = express();

app.set('port', 8080);
app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' + app.get('port') + 
    '; press Ctrl-C to terminate.');
});