
var app = require('../routes/app')

module.exports = function(cliente){

	cliente.get('/', app.index)
	cliente.get('/get-ids', app.get_ids)
	cliente.get('/templates/:sub/:name', app.render)
	cliente.get('/buscar/:type/:number', app.searchParticular)
	cliente.get('/buscar/:type/:number/:todos', app.searchTypeArts)
	cliente.get('/buscar/:type/:number/:type2/:number2', app.searchType2)
	cliente.get('/buscar/:type/:number/:type2/:number2/:type3/:number3', app.searchType3)
	cliente.post('/addart', app.addart)
	cliente.post('/buscar', app.search)
	cliente.get('/addcapitulo', app.addCapitulo)	
}
