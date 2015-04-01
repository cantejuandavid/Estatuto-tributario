var Schema = require('mongoose').Schema

var chap_schema = new Schema({
	name 				: String,
	description 		: String,		
	id_title			: String,
	created 			:{type: Date, default: Date.now},
	lastUpdated			:{type: Date, default: Date.now}
})

var Chapter = module.exports = chap_schema