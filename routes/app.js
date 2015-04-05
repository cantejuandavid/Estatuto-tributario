
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
		number		: '158-1',
		name 		: 'Deducción por inversiones en investigación, desarrollo tecnológico o innovación.',
		description : '<p>Las personas que realicen inversiones en proyecto calificados por el Consejo Nacional de Beneficios Tributarios en Ciencia y Tecnología E Innovación como de investigación, desarrollo tecnológico o innovación, de acuerdo con lo, criterios y las condiciones definidas por el Consejo Nacional de Política Económica y Socia mediante un documento CONPES, tendrán derecho a deducir de su renta, el ciento setenta y cinco por ciento (175%) del valor invertido en dichos proyectos en el período gravable en que se realizó la inversión. Esta deducción no podrá exceder del cuarenta por ciento (40%) de la renta líquida, determinada antes de restar el valor de la inversión.</p><p>Las inversiones o donaciones de que trata este artículo, podrán ser realizadas a través de Investigadores, Grupos o Centros de Investigación, Desarrollo Tecnológico o Innovación o directamente en Unidades de Investigación, Desarrollo Tecnológico o Innovación de Empresas, registrados y reconocidos por Colciencias. Igualmente, a través de programas creados por las instituciones de educación superior aprobados por el Ministerio de Educación Nacional, que sean entidades sin ánimo de lucro y que beneficien a estudiantes de estratos 1, 2 Y 3 a través de becas de estudio total o parcial que podrán incluir manutención, hospedaje, transporte, matrícula, útiles y libros. El Gobierno Nacional reglamentará las condiciones de asignación y funcionamiento de los programas de becas a los que hace referencia el presente artículo.</p><p>Los proyectos calificados como de investigación, desarrollo tecnológico o innovación previstos en el presente artículo incluyen además la vinculación de nuevo personal calificado y acreditado de nivel de formación técnica profesional, tecnológica, profesional, maestría o doctorado a Centros o Grupos de Investigación o Innovación, según los criterios y las condiciones definidas por el Consejo Nacional de Beneficios Tributarios en Ciencia, Tecnología e Innovación.</p><p>El Consejo Nacional de Beneficios Tributarios definirá los procedimientos de control, seguimiento y evaluación de los proyectos calificados, y las condiciones para garantizar la divulgación de los resultados de los proyectos calificados, sin perjuicio de la aplicación de las normas sobre propiedad intelectual, y que además servirán de mecanismo de control de la inversión de los recursos.</p><p><strong>Parágrafo 1.</strong> Los contribuyentes podrán optar por la alternativa de deducir el ciento setenta y cinco por ciento (175%) del valor de las donaciones efectuadas a centros o grupos a que se refiere este artículo, siempre y cuando se destinen exclusivamente a proyectos calificados por el Consejo Nacional de Beneficios Tributarios en Ciencia y Tecnología e Innovación como de investigación o desarrollo tecnológico o innovación, según los criterios y las condiciones definidas por el Consejo Nacional de Política Económica y Social mediante un documento CONPES. Esta deducción no podrá exceder del cuarenta por ciento (40%) de la renta líquida, determinada antes de restar el valor de la donación. Serán igualmente exigibles para la deducción de donaciones los demás requisitos establecidos en los artículos 125-1, 125-2 Y 125-3 del Estatuto Tributario.</p><p><strong>Parágrafo 2.</strong> Para que proceda la deducción de que trata el presente artículo y el parágrafo 10, al calificar el proyecto se deberá tener en cuenta criterios de impacto ambiental. En ningún caso el contribuyente podrá deducir simultáneamente de su renta bruta, el valor de las inversiones y donaciones de que trata el presente artículo.</p><p><strong>Parágrafo 3.</strong> El Consejo Nacional de Beneficios Tributarios en Ciencia, Tecnología e Innovación definirá anualmente un monto máximo total de la deducción prevista en el presente artículo, así como el monto máximo anual que individualmente pueden solicitar las empresas como deducción por inversiones o donaciones efectivamente realizadas en el año. Cuando se presenten proyectos en CT+I que establezcan inversiones superiores al monto señalado anteriormente, el contribuyente podrá solicitar al CNBT la ampliación de dicho tope, justificando los beneficios y la conveniencia del mismo. En los casos de proyectos plurianuales, el monto máximo establecido en este inciso se mantendrá vigente durante los años de ejecución del proyecto calificado, sin perjuicio de tomar en un año un valor superior, cuando el CNBT establezca un monto superior al mismo para dicho año.</p><p><strong>Parágrafo 4.</strong> Cuando el beneficio supere el valor máximo deducible en el año en que se realizó la inversión o la donación, el exceso podrá solicitarse en los años siguientes hasta agotarse, aplicando el límite del cuarenta por ciento (40%) a que se refiere el inciso primero y el parágrafo primero del presente artículo.</p><p><strong>Parágrafo 5.</strong> La deducción de que trata el Artículo 158-1 excluye la aplicación de la depreciación o la amortización de activos o la deducción del personal a través de los costos de producción o de los gastos operativos. Así mismo, no serán objeto de esta deducción los gastos con cargo a los recursos no constitutivos de renta o ganancia ocasional.</p><p><strong>Parágrafo 6.</strong> La utilización de esta deducción no genera utilidad gravada en cabeza de los socios o accionistas.</p><p><strong>Parágrafo 7.</strong> El Documento CONPES previsto en este artículo deberá expedirse en un, término de 4 meses, contados a partir de la entrada en vigencia la presente ley.</p>',
		modifications:true,
		modNote:'<span>Fue modificado</span>'
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