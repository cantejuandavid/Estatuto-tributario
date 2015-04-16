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
	m.articulo.create({
		type: "articulo",
	    number: 9,
	    name: "Impuesto de las personas naturales, residentes y no residentes",
	    description: "<p>Las personas naturales, nacionales o extranjeras, residentes en el país y las sucesiones ilíquidas de causantes con residencia en el país en el momento de su muerte, están sujetas al impuesto sobre la renta y complementarios en lo concerniente a sus rentas y ganancias ocasionales, tanto de fuente nacional como de fuente extranjera, y a su patrimonio poseído dentro y fuera del país. *</p><p><span class='mod'>- Inciso derogado - **</span></p><p>Las personas naturales, nacionales o extranjeras, que no tengan residencia en el país y las sucesiones ilíquidas de causantes sin residencia en el país en el momento de su muerte, sólo están sujetas al impuesto sobre la renta y complementarios respecto a sus rentas y ganancias ocasionales de fuente nacional <span class='mod derogado'>y respecto de su patrimonio poseído en el país.</span><p><p><span class='mod derogado'>Adicionalmente, los contribuyentes a que se refiere este artículo son sujetos pasivos del impuesto de remesas, conforme a lo establecido en el Título IV de este Libro. ***</span></p>",		    
	    id_libro: "5523f4443a0ddf4412361714",		
	    id_titulo: "552fdd1d8838b3d00cb60d40",
	    history: [{
	    	type: 'derogado',
	    	content: '* El impuesto complementario de patrimonio fue eliminado por Ley 6 de 1992, Art 140.',
	    	year: '1992',
	    },
	    {
	    	type: 'derogado',
	    	content: '** Se derogó el incisiso segundo por Ley 1607 de 2012, Art 198.',
	    	year: '2012',
	    },
	    {
	    	type: 'derogado',
	    	content: '*** El impuesto complementario de remesas fue eliminado por Ley 1111 de 2006, Art. 78',
	    	year: '2006',
	    }]
	})
	m.articulo.create({
		type: "articulo",
	    number: 10,
	    name: "Declaración Voluntaria del Impuesto sobre la Renta",
	   description: "<p>Se consideran residentes en Colombia para efectos tributarios las personas naturales que cumplan con cualquiera de las siguientes condiciones:</p><p><ul><li>1. Permanecer continua o discontinuamente en el país por más de ciento ochenta y tres (183) días calendario incluyendo días de entrada y salida del país, durante un periodo cualquiera de trescientos sesenta y cinco (365) días calendario consecutivos, en el entendido que, cuando la permanencia continua o discontinua en el país recaiga sobre más de un año o periodo gravable, se considerará que la persona es residente a partir del segundo año o periodo gravable.</li><li>2. Encontrarse, por su relación con el servicio exterior del Estado colombiano o con personas que se encuentran en el servicio exterior del Estado colombiano, y en virtud de las convenciones de Viena sobre relaciones diplomáticas y consulares, exentos de tributación en el país en el que se encuentran en misión respecto de toda o parte de sus rentas y ganancias ocasionales durante el respectivo año o periodo gravable.</li><li>3. Ser nacionales y que durante el respectivo año o periodo gravable:<ul><li>a) Su cónyuge o compañero permanente no separado legalmente o los hijos dependientes menores de edad, tengan residencia fiscal en el país; o,</li><li>b) El cincuenta por ciento (50%) o más de sus ingresos sean de fuente nacional; o,</li><li>c) El cincuenta por ciento (50%) o más de sus bienes sean administrados en el país; o,</li><li>d) El cincuenta por ciento (50%) o más de sus activos se entiendan poseídos en el país; o.</li><li>e) Habiendo sido requeridos por la Administración Tributaria para ello, no acrediten su condición de residentes en el exterior para efectos tributarios; o,</li><li>f) Tengan residencia fiscal en una jurisdicción calificada por el Gobierno Nacional como paraíso fiscal.</li></ul></li></ul></p><p><span class='mod'>PARÁGRAFO 1.</span> Las personas naturales nacionales que, de acuerdo con las disposiciones de este artículo acrediten su condición de residentes en el exterior para efectos tributarios, deberán hacerlo ante la Dirección de Impuestos y Aduanas Nacionales mediante certificado de residencia fiscal o documento que haga sus veces, expedido por el país o jurisdicción del cual se hayan convertido en residentes.</p><p><span>PARAGRAFO 2.</span> No serán residentes fiscales, los nacionales que cumplan con alguno de los literales del numeral 3, pero que reúnan una de las siguientes condiciones:<ul><li>1. Que el cincuenta por ciento (50%) o más de sus ingresos anuales tengan su fuente en la jurisdicción en la cual tengan su domicilio.</li><li>2. Que el cincuenta por ciento (50%) o más de sus activos se encuentren localizados en la jurisdicción en la cual tengan su domicilio.</li><li>El Gobierno nacional determinará la forma en la que las personas a las que se refiere el presente parágrafo podrán acreditar lo aquí dispuesto.</li></ul></p>",		    
	    id_libro: "5523f4443a0ddf4412361714",		    	    
	    id_titulo: "552fdd1d8838b3d00cb60d40",
	    history: [{
	    	type: 'modificado',
	    	content: 'Este articulo fue modificado totalmente por Ley 1607 de 2012, Art 2.',
	    	year: '2012',
	    },
	    {
	    	type: 'adicion',
	    	content: 'Se adicionó el parágrafo segundo por Ley 1739 de 2014, Art 25.',
	    	year: '2014',
	    }]
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
