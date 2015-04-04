
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
	tipo.art.find(function(err, data){
		if(err) console.log(err);
		res.json(data)
	})
}
exports.searchNumber = function(req, res) {	

	var type = req.params.type
	var number = req.params.number
		
	var v = validType(type)

	if(v)
		res.send('permitido')
	else
		handleErrors(res)
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
	res.render('error', {
		message: 'No se ha encontrado lo que intenta buscar.',
		error: '404'
	});	
}