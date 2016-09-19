var Schema = require('mongoose').Schema

var issue_schema = new Schema({
	articulo			: Number,
	content   		: String,
	created 			: {type: Date, default: Date.now},
	lastUpdated			: {type: Date, default: Date.now}
})

module.exports = issue_schema
