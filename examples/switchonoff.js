var fritzboxtools = require('../lib/fritzboxtools');
var argv = require('optimist')
			.usage('Usage: $0 --fboxuri [string] --user [string] --pass [string] --deviceID [num] --state [0|1]')
    		.demand(['user', 'pass', 'deviceID'])
    		.default('fboxuri', 'fritz.box')
    		.default('state', 1)
    		.argv;


var fbox = new fritzboxtools(argv.fboxuri);

fbox.login(argv.user, argv.pass, function(){
	fbox.SwitchOnOff(argv.deviceID, argv.state);
});