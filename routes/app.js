
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

exports.searchParticular = function(req, res) {	

	var type = req.params.type
	var number = req.params.number
	var v = validType(type)	
	
	if(v){
		if(number !== 'todos') {
			tipo[type].findOne({number:number}, function(err, data) {
				if(err) console.log(err);
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
			tipo[type].find().exec(function(err, data) {
				if(err) console.log(err);	
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
		var queryID = tipo[type].where({number:number})
		queryID.findOne(function(err, d) {
			if(d) {										
				var r = 'id_' + type
				tipo.articulo.find().where(r).equals(d.id).exec(function(err, data) {
					if(err) console.log(err);		
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
		v 	= validType(type),
		v2	= validType(type),	
		type2 	= req.params.type2,
		number2 	= req.params.number2,
		r = 'id_' + type

	if(v){			
		if(number2 !== 'todos') {
			var queryIdLibro = tipo[type].where({number:number})
			queryIdLibro.findOne(function(err, d) {			
				if(d) {										
					tipo.titulo
						.find({})
						.where(r).equals(d.id).where('number').equals(number2)
						.exec(function(err, t) {																
						if(t!= null && t.length !== 0) {
							var t = t[0]
							console.log(t.firstArt+' - '+ t.lastArt)
							tipo.articulo.find({}).where('number').gt(t.firstArt).lt(t.lastArt)		
							.exec(function(err, data) {
								console.log(data)								
								if(data!= null && data.length !== 0) {					
									res.json({
										type: {	
											type: type,							
											name: d.name,
											number: d.number
										},
										type2: {
											type: type2,
											name: t.name,
											number: t.number,
											description: t.description
										},
										data: data
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
				else	
					handleErrors(res)				
			})
		}	
		else {
			var queryIdLibro = tipo[type].where({number:number})
			queryIdLibro.findOne(function(err, d) {	
				tipo[type2].find({})
					.where(r).equals(d.id)
					.exec(function(err, data) {	
						console.log(data)
						if(data!= null && data.length !== 0) {
							res.json({
								type: {	
									type: type,				
									name: d.name,
									number: d.number
								},
								type2: {
									type: type2,
									name: data[0].name,
									number: data[0].number,
									description: data[0].description
								},
								data: data
							})
						}
						else
							handleErrors(res)							
					})

			})
		}
		
	}	
	else
		handleErrors(res)	
}

exports.addart = function(req, res) {	
	tipo.articulo.create({
		number				: 640,
		name 				: "La reincidencia aumenta el valor de las sanciones",
		description 		: "<p>Habrá reincidencia siempre que el sancionado, por acto administrativo en firme, cometiere una nueva infracción del mismo tipo dentro de los dos (2) años siguientes a la comisión del hecho sancionado.</p><p>La reincidencia permitirá elevar las sanciones pecuniarias a que se refieren los artículos siguientes, con excepción de las señaladas en los artículos <a href='#/buscar/articulo/649'>649</a>, <a href='#/buscar/articulo/652'>652</a>, <a href='#/buscar/articulo/668'>668</a>, <a href='#/buscar/articulo/669'>669</a>, <a href='#/buscar/articulo/672'>672</a> y <a href='#/buscar/articulo/673'>673</a> y aquellas que deban ser liquidadas por el contribuyente, responsable, agente retenedor o declarante, hasta en un ciento por ciento (100%) de su valor.</p>",		
		id_capitulo			: "",
		id_titulo			: "5526ee8beff90848098cf6f4",
		id_libro			: "5523f5ad6abcda4c04479cc7",		
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