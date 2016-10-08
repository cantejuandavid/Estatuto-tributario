var ctrl = require('../controllers/controladores')

module.exports = function(cliente){

	cliente.get('/', ctrl.index)
	cliente.get('/get-ids', ctrl.get_ids)
	cliente.get('/templates/:sub/:name', ctrl.renderPUG)
	cliente.get('/buscar/:type/:number', ctrl.searchParticular)
	cliente.get('/buscar/:type/:number/:todos', ctrl.searchTypeArts)
	cliente.get('/buscar/:type/:number/:type2/:number2', ctrl.searchType2)
	cliente.get('/buscar/:type/:number/:type2/:number2/:type3/:number3', ctrl.searchType3)
	cliente.post('/addart', ctrl.addart)
	cliente.post('/issue', ctrl.addIssue)
	cliente.get('/issue', ctrl.getIssues)
	cliente.get('/buscar', ctrl.search)
	cliente.get('/addcapitulo', ctrl.addCapitulo)

}
