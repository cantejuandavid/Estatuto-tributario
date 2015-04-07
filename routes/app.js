
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
			if(data!= null && data.length !== 0)
				res.json({
					type: {
						name: type
					},
					arts: data
				})
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
	var todos = req.params.todos		
	var typeTodos = todos ? true : false;	
	var v = validType(type)	

	if(v){
		if(typeTodos) {
						
			var queryID = tipo[type].where({number:number})
			queryID.findOne(function(err, d) {
				if(d) {										
					var r = 'id_' + type
					tipo.articulo.find().where(r).equals(d.id).exec(function(err, data) {
						if(err) console.log(err);						
						if(data!= null && data.length !== 0)
							res.json({
								type: {
									id: d.id,
									name: d.name,
									number: d.number
								},
								arts: data
							})
						else	
							handleErrors(res)						
					})			
				}					
			})			
		}
		else
		{
			tipo[type].findOne({number:number}, function(err, data) {
				if(err) console.log(err);
				if(data!= null && data.length !== 0)
					res.json({
						arts: data
					})
				else
					handleErrors(res)
			})
		}
	}		
	else
		handleErrors(res)
}

exports.addart = function(req, res) {	
	tipo.articulo.create({
		number		: '193',
		name 		: 'Concepto de valor patrimonial neto.',
		description : '<p>El valor patrimonial neto de los bienes que se excluyen de la base de cálculo de la renta presuntiva, es el que se obtenga de multiplicar el valor patrimonial del bien por el porcentaje que resulte de dividir el patrimonio líquido por el patrimonio bruto, del año gravable base para el cálculo de la presunción.</p>',
	})
	res.send('done!')
}

exports.addBook = function(req, res) {
	tipo.libro.create({
		name		: 'Gravamen a los Movimientos Financieros',
		description : 'Según el portal <a href="http://www.gerencie.com">www.gerencie.com</a> el libro sexto comprende el gravamen a los movimientos financieros o 4 * 1.000 y contempla la causación, el hecho generador, sujetos pasivos, tarifas, base gravable, agentes de retención, declaración y pago, exenciones, etc'
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