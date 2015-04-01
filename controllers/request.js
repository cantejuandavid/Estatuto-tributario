
var app = require('../routes/app')

module.exports = function(cliente){	

	cliente.get('/', app.index)	

}