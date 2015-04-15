'use strict'

var m = require('../models/modeling')
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
						type: type,
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
	var type = req.params.type
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
		r = 'id_' + type,
		typing = {}

	var queryLibro = m.libro.where({number:number})
	if(number2 !== 'todos') {		
		queryLibro.findOne(buscarTitulo)
	}	
	else {		
		queryLibro.findOne(function(err, d) {	
			typing.libro = d				
			m.titulo.find({})
				.where(r).equals(d.id)
				.exec(enviarData)
		})
	}

	function buscarTitulo (err, d) {
		if(err) console.log(err)	
		typing.libro = d
		if(d!= null && d.length !== 0) {										
			m.titulo
				.find({})
				.where(r).equals(d.id).where('number').equals(number2)
				.exec(buscarArticulos)			
		}	
		else	
			handleErrors(res)		
	}
	function buscarArticulos (err, t) {			
		if(err) console.log(err)	
		typing.titulo = t
		if(t!= null && t.length !== 0) {
			var t = t[0]		
			m.articulo.find({}).where('number').gt(t.firstArt).lt(t.lastArt)		
			.exec(enviarData)	
		}
		else
			handleErrors(res)
	}
	function enviarData (err, data) {			
		if(err) console.log(err)
		typing.articulos = data
		if(data!= null && data.length !== 0) {					
			res.json({
				type: typing.libro,
				type2: typing.titulo,
				data: data
			})
		}
		else
			handleErrors(res)	
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

	if(v){			
		if(number3 !== 'todos') {
			var queryIdLibro = m[type].where({number:number})
			queryIdLibro.findOne(function(err, l) {			
				if(l) {							
					m.titulo
						.find({})
						.where('id_' + type).equals(l.id).where('number').equals(number2)
						.exec(function(err, t) {																	
						if(t!= null && t.length !== 0) {														
							m.capitulo
								.find({})
								.where('id_' + type2).equals(t[0].id).where('number').equals(number3)
								.exec(function(err, c) {									
									var c = c[0]									
									m.articulo.find({}).where('number').gt(c.firstArt).lt(c.lastArt)		
										.exec(function(err, data) {	
											if(err) console.log(err)											
											if(data!= null && data.length !== 0) {					
												res.json({
													type: {	
														type: type,							
														name: l.name,
														number: l.number
													},
													type2: {
														type: type2,
														name: t.name,
														number: t.number,
														description: t.description
													},
													type3: {
														type: type3,
														name: c.name,
														number: c.number,
														description: c.description
													},
													data: data
												})
											}
											else
												handleErrors(res)
										})
								})							
						}
						else
							handleErrors(res)					
						})			
				}	
				else	
					handleErrors(res)				
			})
		}	
		else {
			var queryIdLibro = m[type].where({number:number})
			queryIdLibro.findOne(function(err, l) {	
				m[type2].find({})
					.where('id_' + type).equals(l.id).where('number').equals(number2)
					.exec(function(err, t) {
					if(err) console.log(err)						
						m[type3].find({})
							.where('id_' + type2).equals(t[0].id)
							.exec(function(err, c) {								
								if(c!= null && c.length !== 0) {									
									res.json({
										type: {	
											type: type,				
											name: l.name,
											number: l.number
										},
										type2: {
											type: type2,
											name: t.name,
											number: t.number,
											description: t.description
										},
										data: c
									})
								}
								else
									handleErrors(res)	
							})																
					})

			})
		}
		
	}	
	else
		handleErrors(res)	
}

exports.addart = function(req, res) {	
	m.capitulo.create({
		number 				: 1,
		name 				: 'Responsabilidad por el pago del impuesto',
		description 		: '',		
		id_titulo			: '5526ee8beff90848098cf6f8',
		id_libro			: '5523f5ad6abcda4c04479cc7',
		firstArt			: 792,
		lasttArt			: 799.1,		
	})
	m.capitulo.create({
		number 				: 2,
		name 				: 'Formas de extinguir la obligación tributaria',
		description 		: '',		
		id_titulo			: '5526ee8beff90848098cf6f8',
		id_libro			: '5523f5ad6abcda4c04479cc7',
		firstArt			: 800,
		lasttArt			: 822.1,		
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
