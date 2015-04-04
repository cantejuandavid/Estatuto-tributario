
var app = require('../routes/app')

module.exports = function(cliente){	

	cliente.get('/', app.index)	
	cliente.get('/templates/:sub/:name', app.render)
	cliente.get('/search/:type/todos', app.searchAll)
	cliente.get('/search/:type/:number', app.searchNumber)

}