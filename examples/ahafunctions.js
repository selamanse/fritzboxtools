var fritzboxtools = require('../lib/fritzboxtools');
var util = require('util')
var argv = require('yargs')
			.usage('Usage: $0 --fboxuri [string] --user [string] --pass [string] --switchcmd [string] --ain [number]')
    		.demand(['user', 'pass'])
    		.default('fboxuri', 'fritz.box')
    		.default('switchcmd', 'getswitchlist')
    		.argv;


var fbox = new fritzboxtools(argv.fboxuri);

fbox.login(argv.user, argv.pass, function(){
	
	fbox.homeautoSwitch(argv.ain, argv.switchcmd, function(d){
		
		console.log(d);
		
	});
	
});
