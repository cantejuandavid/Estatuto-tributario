
var tipo = require('../models/modeling')
var typesEnabled = ['articulo', 'titulo','libro']
var t = false

exports.auth = function(req, res, next) {	
	if(!req.session.username)
		res.render('login')
	else next()
}

exports.index = function(req, res) {
	res.render('index')	
}

exports.render = function(req, res) {
	var name = req.params.name
	var sub = req.params.sub	
	res.render('templates/' + sub+ '/'+name)
}

exports.searchAll = function(req, res) {
	var type = req.params.type
	var v = validType(type)
	if(v) {
		tipo[type].find(function(err, data){
			if(err) console.log(err);
			if(data.length)
				res.json(data)
			else
				handleErrors(res)
		})
	}
	else
		handleErrors(res)
	
}
exports.searchNumber = function(req, res) {	

	var type = req.params.type
	var number = req.params.number		
	var v = validType(type)

	if(v){
		tipo[type].findOne({number:number}, function(err, data) {
			if(err) console.log(err);
			if(data!= null)
				res.json(data)
			else
				handleErrors(res)
		})
	}		
	else
		handleErrors(res)
}

exports.addart = function(req, res) {	
	tipo.articulo.create({
		number		: '469',
		name 		: 'Vehículos automóviles con tarifa general.',
		description : '<p>Están sometidos a la tarifa general del impuesto sobre las ventas los siguientes vehículos automóviles, con motor de cualquier clase: </p>',
		history		: [
			{
				year: '1995',
				type: 'derogado',
				content: 'Inciso Derogado Ley 223 de 1995 art. 285.'
			},
			{
				year: '2012',
				type:'adicion',
				content: 'Articulo Modificado Ley 1607 de 2012. Art. 159'
			}
		]
	})
	res.send('done!')
}

function validType(type) {
	for(var i = 0; i < typesEnabled.length; i++) {
		if(type == typesEnabled[i]) {
			return true
		}
	}
	return false
}

function handleErrors(res) {
	res.json({
		error: true,
		message: 'No se ha encontrado lo que intenta buscar.'		
	})	
}