var fritzboxtools = require('../lib/fritzboxtools');
var argv = require('optimist')
			.usage('Usage: $0 --fboxuri [string] --user [string] --pass [string] --deviceID [num] --state [0|1]')
    		.demand(['user', 'pass', 'deviceID'])
    		.default('fboxuri', 'fritz.box')
    		.default('state', 0)
    		.argv;


var fbox = new fritzboxtools(argv.user, argv.pass, argv.fboxuri);

fbox.login(function(){
	fbox.SwitchOnOff(argv.deviceID, argv.state);
});