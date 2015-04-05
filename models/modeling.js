var db 		= require('../routes/mongoose')

var t 	= {
	articulo : 	db.model('art', require('./artModel')),
	libro	: 	db.model('book', require('./bookModel')),
	capitulo: 	db.model('cap', require('./capModel')),
	titulo	: 	db.model('title', require('./titleModel'))
}

var t = module.exports = t