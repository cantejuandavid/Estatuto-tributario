var Schema = require('mongoose').Schema

var titulo_schema = new Schema({
	number 				: Number,
	name 				: String,
	description 		: String,		
	id_book				: String,
	firstArt			: Number,
	lastArt				: Number,
	created 			:{type: Date, default: Date.now},
	lastUpdated			:{type: Date, default: Date.now}
})

module.exports = titulo_schema