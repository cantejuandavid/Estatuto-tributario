'use strict'

var m = require('../models/modeling'),
	typesEnabled = ['articulo', 'titulo','libro','capitulo'],
	t = false,
	typing = {}


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

exports.searchParticular = function(req, res) {	

	var type = req.params.type
	var number = req.params.number
	var v = validType(type)	
	if(v){
		if(number !== 'todos') {
			m[type].findOne({number:number}, function(err, data) {			
				if(err) console.log(err)
				if(data!= null && data.length !== 0)
					res.json({
						libro: data,
						data: [data]
					})
				else
					handleErrors(res)
			})
		}
		else {		
			m[type].find().exec(function(err, data) {
				if(err) console.log(err)									
				if(data!= null && data.length !== 0) {
					res.json({
						type: type,
						data: data
					})
				}
				else	
					handleErrors(res)	
			})
		}
		
	}		
	else
		handleErrors(res)
}

exports.searchTypeArts = function(req, res) {
	var type = req.params.type == 'no-libro'? 'libro':req.params.type
	var number = req.params.number
	var v = validType(type)	

	if(v){
		var queryID = m[type].where({number:number})
		queryID.findOne(function(err, d) {
			if(d) {										
				var r = 'id_' + type
				m.articulo.find().where(r).equals(d.id).exec(function(err, data) {
					if(err) console.log(err)		
					if(data!= null && data.length !== 0) {
						res.json({
							type: {
								id: d.id,
								name: d.name,
								number: d.number
							},
							data: data
						})
					}
					else	
						handleErrors(res)						
				})			
			}					
		})
	}	
	else
		handleErrors(res)					
}

exports.searchType2 = function(req, res) {
	var type 	= req.params.type,
		number 	= req.params.number,	
		number2 	= req.params.number2,
		r = 'id_' + type
	typing = []

	var queryLibro = m.libro.where({number:number})
	if(number2 !== 'todos') {		
		queryLibro.findOne(buscarTitulo)
	}	
	else {		
		queryLibro.findOne(function(err, l) {	
			typing.libro = l				
			m.titulo.find({})
				.where(r).equals(l.id)
				.exec(enviarData)
		})
	}

	function buscarTitulo (err, l) {
		if(err) console.log(err)	
		typing.libro = l
		if(l!= null && l.length !== 0) {										
			m.titulo
				.findOne({})
				.where('id_' + type).equals(l.id).where('number').equals(number2)
				.exec(buscarArticulos)			
		}	
		else handleErrors(res)		
	}
	function buscarArticulos (err, t) {			
		if(err) console.log(err)	
		typing.titulo = t
		if(t!= null && t.length !== 0) {				
			m.articulo.find({}).where('number').gt(t.firstArt-1).lt(t.lastArt+1)		
			.exec(enviarData)	
		}
		else handleErrors(res)
	}
	function enviarData (err, a) {			
		if(err) console.log(err)
		typing.articulos = a
		if(a!= null && a.length !== 0) {					
			res.json({
				libro: typing.libro,
				titulo: typing.titulo,
				data: a
			})
		}
		else handleErrors(res)	
	}
}

exports.searchType3 = function(req, res) {
	var type 	= req.params.type,
		number 	= req.params.number,
		v 	= validType(type),
		v2	= validType(type),	
		type2 	= req.params.type2,
		number2 	= req.params.number2,
		type3 	= req.params.type3,
		number3 	= req.params.number3
	typing = []
	
	var queryIdLibro = m.libro.where({number:number})
	if(number3 !== 'todos') {
		queryIdLibro.findOne(buscarTitulo)
	}	
	else {		
		queryIdLibro.findOne(function(err, l) {	
			typing.libro = l
			m.titulo.findOne({})
				.where('id_' + type).equals(l.id).where('number').equals(number2)
				.exec(function(err, t) {
				typing.titulo = t
				if(err) console.log(err)						
					m.capitulo.find({})
						.where('id_' + type2).equals(t.id)
						.exec(function(err,c){
							typing.capitulo = c
							enviarData(err, c)
						})																
				})
		})
	}

	function buscarTitulo(err, l) {				
		if(err) console.log(err)	
		typing.libro = l																	
		if(l!= null && l.length !== 0) {						
			m.titulo
				.findOne({})
				.where('id_' + type).equals(l.id).where('number').equals(number2)
				.exec(buscarCapitulo)			
		}	
		else handleErrors(res)				
	}
	function buscarCapitulo(err, t) {			
		if(err) console.log(err)	
		typing.titulo = t																	
		if(t!= null && t.length !== 0) {														
			m.capitulo
				.findOne({})
				.where('id_' + type2).equals(t.id).where('number').equals(number3)
				.exec(buscarArticulos)							
		}
		else handleErrors(res)					
	}
	function buscarArticulos(err, c) {		
		if(err) console.log(err)		
		typing.capitulo = c											
		if(c!= null && c.length !== 0) {													
			m.articulo.find({}).where('number').gt(c.firstArt-1).lt(c.lastArt+1)		
				.exec(enviarData)
		}
		else handleErrors(res)	
	}
	function enviarData(err, data) {
		if(err) console.log(err)							
		if(data!= null && data.length !== 0) {					
			res.json({
				libro:  typing.libro,
				titulo: typing.titulo,
				capitulo: typing.capitulo,
				data: data
			})
		}
		else handleErrors(res)
	}
}

exports.addart = function(req, res) {	
	console.log(req.body.art.history)
	m.articulo.create(req.body.art, function(err){
		if(err) console.log(err)
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
exports.get_ids = function(req, res) {	
	var ids = {}
	m.libro.find().select('name id').exec(titulo)

	function titulo(err, l) {
		ids.id_libro = l
		m.titulo.find().select('name id').exec(capitulo)
	}
	function capitulo(err, t) {
		ids.id_titulo = t
		m.capitulo.find().select('name id').exec(enviarData)		
	}
	function enviarData(err, c) {
		ids.id_capitulo = c
		res.json(ids)
	}
}
