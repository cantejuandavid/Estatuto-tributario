var db 		= require('../routes/mongoose')

var t 	= {
	art : 	db.model('art', require('./artModel')),
	book: 	db.model('book', require('./bookModel')),
	cap: 	db.model('cap', require('./capModel')),
	title: 	db.model('title', require('./titleModel'))
}

var t = module.exports = t