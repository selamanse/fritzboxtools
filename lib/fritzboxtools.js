var util = require('util')
var http = require('http');
var xml2js = require('xml2js');
var md5 = require('MD5');


// MODULE DEFINITION

var exports = module.exports = fritzboxtools;
function fritzboxtools () {
	var self = {};	
	
	
	self._auth = {
		SID : "0000000000000000",
		timeOut : 0, //will be datetime and has to be refreshed on each request (+ 600000ms ==> 10 Minutes)
		pw: "",
		user: ""
	};
	
	self._reqOptions = {
		  hostname: 'fritz.box',
		  port: 80,
		  path: '/login_sid.lua',
		  agent: false,
		  method: 'GET'
	};
	
	
	self.doRequest = function(options, dataRecieved){
		
		util.debug("Request for : " + options.hostname + options.path);
		
		var req = http.request(options, function(res) {
		  //if(res.statusCode != 200) return false
		  //console.log('STATUS: ' + res.statusCode);
		  //console.log('HEADERS: ' + JSON.stringify(res.headers));
		  res.setEncoding('utf8');
		  res.on('data', function (chunk) {
		     if(typeof dataRecieved == "function"){
		     	dataRecieved(chunk);
		     }
		  });
		});
		
		req.on('error', function(e) {
		  console.log('problem with request: ' + e.message);
		});
		
		req.end();

	}
	
	self.getHome = function(callback){
	
		util.debug("get home page...");
		
		var HOMErequestPath = "/home/home.lua?sid=" + self._auth.SID;
		var reqOptions = self._reqOptions;
		reqOptions.path = HOMErequestPath;
								
								
		var myreq = self.doRequest(reqOptions, function(response){
			util.debug(response);
		
		});

	}
	
	
	self.login = function(pw, callback){
					
					if(typeof pw != "undefined"){
						self._auth.pw = pw;
					}
					
					util.debug("try login...");
					var myreq = self.doRequest(self._reqOptions, function(response){
						xml2js.parseString(response, function (err, result) {
							if(err != null){
								util.error("I was expecting xml but there was an error...");
								self.onError(err);
							}
							var sessInfo = result.SessionInfo;
						    
							if(sessInfo.BlockTime > 0){
								
							}
						    
						    util.debug("look for SID...");
						    if (sessInfo.SID == "0000000000000000") {
						    
						    	util.debug("SID empty... requesting a new one...");
						    	util.debug("Challenge recieved: " + sessInfo.Challenge);
						    	
						    	//stuff comes in utf-8, but we need utf16le...so we use ucs2 which is similar and javascripts native subset...
						    	var uc2buffer = new Buffer(sessInfo.Challenge + "-" + self._auth.pw, "ucs2"); 
						    	
						    	var challengeResponse = sessInfo.Challenge + "-" + md5(uc2buffer);
						    	
						    	util.debug("created response: " + challengeResponse);
						    	
						    	var SIDrequestPath = "/login_sid.lua?username=" + self._auth.user + "&response=" + challengeResponse;
						    	
						    	
						    	
								var reqOptions = self._reqOptions;
								reqOptions.path = SIDrequestPath;
								
								util.debug("Request SID...");
								self.doRequest(self._reqOptions, function(response){
									xml2js.parseString(response, function (err, result) {
										if(err != null){
											util.error("I was expecting xml but there was an error...");
											self.onError(err);
										}
										
										util.debug("look for SID...");
										var sessInfo = result.SessionInfo;
										
										if (sessInfo.SID == "0000000000000000") {
											util.error("Something went wrong...");
											self.onError(JSON.stringify(sessInfo));
										}
										
										util.debug("Recieved SID: " + sessInfo.SID);
										
										self._auth.SID = sessInfo.SID;
										
										if(typeof callback == "function"){
											callback(sessInfo.SID);
										}
										
										
										return true;
								
									});
								});
						    }
				     	});
					});
		
	}

	
	self.onError = function(err){
		util.error("ERROR:");
		util.error(err);
		util.error("PROCESS IS GOING BYEBYE...");
		process.exit(1);
	}
	
	
	
	return self;
};


