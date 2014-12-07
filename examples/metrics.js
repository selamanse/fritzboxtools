var fritzboxtools = require('../lib/fritzboxtools');
var argv = require('optimist')
			.usage('Usage: $0 --fboxuri [string] --user [string] --pass [string]')
    		.demand(['user', 'pass'])
    		.default('fboxuri', 'fritz.box')
    		.argv;


var fbox = new fritzboxtools(argv.user, argv.pass, argv.fboxuri);

fbox.login(function(){
	fbox.getData();
});
