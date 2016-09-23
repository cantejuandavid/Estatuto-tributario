var Schema = require('mongoose').Schema

var venc_schema = new Schema({
	name		: String,
	description	: String,
	modified	: {type: Boolean, default: false},
	noteMod		: String,
	created 			:{type: Date, default: Date.now},
	lastUpdated			:{type: Date, default: Date.now}
})