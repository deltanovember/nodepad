var mongoose = require('mongoose');

var Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;
      
/**
    * Model: Document
    */
 var Document = new Schema({
    'title': { type: String, index: true },
    'data': String,
    'tags': [String],
    'keywords': [String],
    'user_id': ObjectId
  });

exports.Document = function(db) {
  return Document;
};