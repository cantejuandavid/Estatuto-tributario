var Schema = require('mongoose').Schema

var book_schema = new Schema({
	name 				: String,
	description 		: String,		
	number				: String,
	created 			:{type: Date, default: Date.now},
	lastUpdated			:{type: Date, default: Date.now}
})

var Book = module.exports = book_schema