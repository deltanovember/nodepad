
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();
var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/nodepad');
var Document = require('./models.js').Document(db);

// Configuration

app.configure(function(){
  app.use(express.logger());
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	app.use(express.logger());
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.logger());
  app.use(express.errorHandler());
});

app.configure('test', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  db = mongoose.connect('mongodb://localhost/nodepad-test');
});

// Routes

app.get('/', routes.index);

// CRUD
// List
// :format can be json or html
app.get('/documents.:format?', function(req, res) {
  // Some kind of Mongo query/update
  Document.find().all(function(documents) {
    switch (req.params.format) {
      // When json, generate suitable data
      case 'json':
        res.send(documents.map(function(d) {
          return d.__doc;
        }));
      break;

      // Else render a database template (this isn't ready yet)
      default:
        res.render('documents/index.jade', {
  			locals: { documents: documents }
		});
    }
  });
});

app.get('/documents/:id.:format?/edit', function(req, res) {
  Document.findById(req.params.id, function(d) {
    res.render('documents/edit.jade', {
      locals: { d: d }
    });
  });
});

app.get('/documents/new', function(req, res) {
  res.render('documents/new.jade', {
    locals: { d: new Document() }
  });
});

app.post('/documents.:format?', function(req, res) {
  var document = new Document(req.body['document']);
  document.save(function() {
    switch (req.params.format) {
      case 'json':
        res.send(document.__doc);
       break;

       default:
        res.redirect('/documents');
    }
  });
});

// Read
app.get('/documents/:id.:format?', function(req, res) {
});

// Update
app.put('/documents/:id.:format?', function(req, res) {
});

// Delete
app.del('/documents/:id.:format?', function(req, res) {
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
