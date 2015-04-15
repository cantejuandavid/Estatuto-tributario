var Schema = require('mongoose').Schema

var libro_schema = new Schema({
	type				: String,
	name 				: String,
	description 		: String,		
	number				: Number,
	firstArt			: Number,
	lastArt				: Number,
	created 			:{type: Date, default: Date.now},
	lastUpdated			:{type: Date, default: Date.now}
})

module.exports = libro_schema