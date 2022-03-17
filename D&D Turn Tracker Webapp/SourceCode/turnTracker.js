var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
var mysql = require('./credentials.js');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3041);
app.use('/static', express.static('public'));

//Index Page
app.get('/', function (req, res, next) {
  var context = {};
  context.pageTitle = "Index";
  res.render('index', context);
});

// Characters
app.use('/characters', require('./characters.js'));
// Character Details
app.use('/characterdetails', require('./characterDetails.js'));
// Conditions
app.use('/conditions', require('./conditions.js'));
// Encounters
app.use('/encounters', require('./encounters.js'));
// Items
app.use('/items', require('./items.js'));
// Turn Order
app.use('/turnorder', require('./turnOrder.js'));


//Reset (adapated from Source: https://medium.com/@johnkolo/how-to-run-multiple-sql-queries-directly-from-an-sql-file-in-node-js-part-1-dce1e6dd2def)
app.get('/reset', function (req, res, next) {
  var context = {};
  context.pageTitle = "Reset to Sample Data";
  console.log("Query Started");
  let resetQuery = fs.readFileSync('dataDefinition.sql').toString();
  mysql.pool.query(resetQuery, function (err, rows) {
    if (err) {
      next(err);
      return;
    } else {
      console.log("Query Complete");
      context.queryStatus = "Query Complete";
    }
    res.render('Reset', context);
  });
});

app.use(function (req, res) {
  res.status(404);
  res.render('404');
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function () {
  console.log('Express started on http://flip3.engr.oregonstate.edu/:' + app.get('port') + '; press Ctrl-C to terminate.');
});
