var Schema = require('mongoose').Schema

var titulo_schema = new Schema({
	type				: String,
	number 				: Number,
	name 				: String,
	description 		: String,		
	id_libro			: String,
	firstArt			: Number,
	lastArt				: Number,
	haveCapitulo		:{type: Boolean, default: false},
	created 			:{type: Date, default: Date.now},
	lastUpdated			:{type: Date, default: Date.now}
})

module.exports = titulo_schema