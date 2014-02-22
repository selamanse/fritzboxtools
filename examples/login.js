var fritzboxtools = require('../lib/fritzboxtools');
var argv = require('optimist')
			.usage('Usage: $0 --pass [string] --deviceID [num] --state [0|1]')
    		.demand(['pass', 'deviceID'])
    		.default('state', 0)
    		.argv;


var fbox = new fritzboxtools();

fbox.login(argv.pass, function(){
	fbox.SwitchOnOff(argv.deviceID, argv.state);
});