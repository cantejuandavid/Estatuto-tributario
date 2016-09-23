var Schema = require('mongoose').Schema

var capitulo_schema = new Schema({
	type				: String,
	number 				: Number,
	name 				: String,
	description 		: String,		
	id_titulo			: String,
	id_libro			: String,	
	firstArt			: Number,
	lastArt				: Number,
	created 			:{type: Date, default: Date.now},
	lastUpdated			:{type: Date, default: Date.now}
})

module.exports = capitulo_schema
