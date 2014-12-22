var fritzboxtools = require('../lib/fritzboxtools');
var util = require('util')
var argv = require('optimist')
			.usage('Usage: $0 --fboxuri [string] --user [string] --pass [string]')
    		.demand(['user', 'pass'])
    		.default('fboxuri', 'fritz.box')
    		.argv;


var fbox = new fritzboxtools(argv.fboxuri);

fbox.login(argv.user, argv.pass, function(){
	fbox.getData();
});
