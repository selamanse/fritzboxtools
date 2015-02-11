var util = require('util')
var fritzboxtools = require('../lib/fritzboxtools');
var express = require('express');
var argv = require('yargs')
			.usage('Usage: $0 --fboxuri [string] --user [string] --pass [string]')
    		.demand(['user', 'pass'])
    		.default('fboxuri', 'fritz.box')
    		.default('state', 1)
    		.default('port', 17800)
    		.argv;

var restproxy = express();

var fbox = new fritzboxtools(argv.fboxuri);

fbox.login(argv.user, argv.pass, function(){
	
	restproxy.get('/alloutlets', function (req, res) {
	
		util.debug("outletlist requested");
	
		fbox.getData(function(list){
			res.send(list.devices);
		});
	});
	
	restproxy.get('/switch/:id/:state', function (req, res) {
		
		util.debug("switchstatechange requested");
  		
  		if(req.params.state == "on"){
  			var numstate = 1;
  		}else if(req.params.state == "off"){
  			var numstate = 0;
  		}else{
	  		res.send("wrong state submitted. nothing has been changed.");
  			return;
  		}
  		
  		fbox.SwitchOnOff(req.params.id, numstate, function(result){
  			var resmsg = "";
  			if(result.status == "switchStateChanged"){
				resmsg = "device id " + req.params.id +
						   " successfully switched to " + (numstate == 1 ? "on" : "off");
			}else{
				resmsg = "device id " + req.params.id + " state could not be changed...";
			}

  			res.send(resmsg);
  		});
  		
	});
	
	restproxy.listen(argv.port);
	util.debug("fritzboxtools restproxy is listening on " + argv.port)
	
	//keepalive every 5 minutes...TODO: implement restproxy.ini..
	setInterval(function(){
		fbox.login(argv.user, argv.pass);
	},300000);
	
});


