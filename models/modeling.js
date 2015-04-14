var db 		= require('../routes/mongoose')

var t 	= {
	articulo : 	db.model('articulo', require('./articuloModel')),
	libro	: 	db.model('libro', require('./libroModel')),
	capitulo: 	db.model('capitulo', require('./capituloModel')),
	titulo	: 	db.model('titulo', require('./tituloModel'))
}

var t = module.exports = t