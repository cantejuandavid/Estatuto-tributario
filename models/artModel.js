var Schema = require('mongoose').Schema

var art_schema = new Schema({
	number				: String,
	name 				: String,
	description 		: String,		
	id_cap				: String,
	repealed			: {type: Boolean, default: false},
	repNote				: String,
	modifications		: {type: Boolean, default: false},
	modNote				: String,
	added				: {type: Boolean, default: false},
	addNote				: String,
	centerTitle			: {type: Boolean, default: false},
	title 				: String,
	created 			: {type: Date, default: Date.now},
	lastUpdated			: {type: Date, default: Date.now}
})

var Article = module.exports = art_schema