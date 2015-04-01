var Schema = require('mongoose').Schema

var art_schema = new Schema({
	name 				: String,
	description 		: String,		
	id_cap				: String,
	created 			:{type: Date, default: Date.now},
	lastUpdated			:{type: Date, default: Date.now}
})

var Article = module.exports = art_schema