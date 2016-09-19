var db 		= require('../routes/mongoose')

var t 	= {
	articulo : 	db.model('articulo', require('./articuloModel')),
	libro	: 	db.model('libro', require('./libroModel')),
	capitulo: 	db.model('capitulo', require('./capituloModel')),
	titulo	: 	db.model('titulo', require('./tituloModel')),
	issue 	:		db.model('issue', require('./issueModel'))
}

var t = module.exports = t
