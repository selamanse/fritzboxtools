var fritzboxtools = require('../lib/fritzboxtools');
var util = require('util')
var argv = require('yargs')
			.usage('Usage: $0 --fboxuri [string] --user [string] --pass [string] --interval [int]')
    		.demand(['user', 'pass'])
    		.default('fboxuri', 'fritz.box')
    		.default('interval', 3000)
    		.argv;


var fbox = new fritzboxtools(argv.fboxuri);

fbox.login(argv.user, argv.pass, function(){
	
	fbox.getData(function(d){
		
		console.dir(d);
		
	}, argv.interval);
	
});
