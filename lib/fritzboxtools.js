var util = require('util');
var http = require('http');
var xml2js = require('xml2js');
var md5 = require('MD5');

module['exports'] = fritzboxtools;
function fritzboxtools (uri) {
	var self = {};	
		
	self._auth = {
		SID : "0000000000000000",
		Challenge: "",
		BlockTime: "0",
		Rights: ""		
	};
	
	self._reqOptions = {
		  hostname: 'fritz.box',
		  port: 80,
		  path: '/login_sid.lua',
		  agent: false,
		  method: 'GET'
	};
	
	
	self.doRequest = function(options, dataRecieved){
		
		util.log("Request for : " + options.hostname + options.path);
		
		var req = http.request(options, function(res) {
		  var dataarr = [];
		  res.setEncoding('utf8');
		  res.on('data', function (chunk) {
		     dataarr.push(chunk);
		  });
		  res.on('end', function () {
  		  	if(typeof dataRecieved == "function"){
		     	dataRecieved(dataarr.join(''));
		     }
  		  });
		});
		
		req.on('error', function(e) {
		  console.log('problem with request: ' + e.message);
		});
		
		req.end();

	};
	
	self.allOutletStates = function(callback){
		
		util.log("get all outlet states...");
		
		//check if user is BoxAdmin
		util.log("checking rights of user: " + JSON.stringify(self._auth.Rights[0].Name));

		if(self._auth.Rights[0].Name.indexOf("BoxAdmin") == -1){
			self.onError("user has no BoxAdmin rights. cannot proceed with request.");
		}
		
		var d = new Date();
		var n = d.getTime();

		var OutletrequestPath = "/net/home_auto_query.lua?" + 
			"sid=" + self._auth.SID + 
			"&command=AllOutletStates" +
			"&xhr=1" +
			"&t"+ n +"=nocache";
		
		var reqOptions = self._reqOptions;
		reqOptions.path = OutletrequestPath;
													
		var myreq = self.doRequest(reqOptions, function(response){
			if(typeof callback == "function"){
				callback(response);
			}else{
				util.log(response);
			}
		});
		
	};
	
	self.getData = function(callback, cbinterval){
		
		util.log("get myfritz data...");
		
		var d = new Date();
		var n = d.getTime();
		
		var OutletrequestPath = "/myfritz/areas/homeauto.lua?" +
			"sid=" + self._auth.SID + 
			"&cmd=getData" +
			"&startpos=0" +
			"&ajax_id=1234" +
			"&xhr=1" +
			"&t"+ n + "=nocache";
		
		var reqOptions = self._reqOptions;
		reqOptions.path = OutletrequestPath;
					
		var respFunc = function(){						
		var myreq = self.doRequest(reqOptions, function(response){
			var response = JSON.parse(response);
			if(typeof callback == "function"){
			
				callback(response);
			
			}else{
				util.log(response);
			}
		});
		};
		
		if(typeof cbinterval != "number" && cbinterval > 200){
			util.log("interval set to " + cbinterval + "ms");
			setInterval(respFunc, cbinterval);
		}else{
			respFunc();
		}
								
		
		
	};
	
	self.SwitchOnOff = function(deviceID, valToSet, callback){
	
	
		util.log("sending switchcommand " + (valToSet == 1 ? "on" : "off") + " to device id " + deviceID + "...");
		
		var d = new Date();
		var n = d.getTime();
		
		var requestPath = "/myfritz/areas/homeauto.lua?" + 
		"sid=" + self._auth.SID + 
		"&deviceId=" + deviceID + 
		"&cmd=switchChange" + 
		"&cmdValue=" + valToSet + 
		"&ajax_id=1234" +
		"&xhr=1&t"+ n +"=nocache";
		
		var reqOptions = self._reqOptions;
		reqOptions.path = requestPath;
								
		var myreq = self.doRequest(reqOptions, function(response){
			var response = JSON.parse(response);
			
			if(response.status == "switchStateChangedSend"){
				util.log("switchcommand sent...");
				
				setTimeout(function(){
				self.SwitchOnOffCheck(deviceID, valToSet, response.ajax_id, function(finres){
					var finres = JSON.parse(finres);
					if(typeof callback == "function"){
						callback(finres);
					}else{
						if(finres.status == "switchStateChanged"){
							util.log("device id " + deviceID +
						 		       " successfully switched to " + (valToSet == 1 ? "on" : "off"));
						}else{
							console.error("device id " + deviceID + " state could not be changed...");
							self.onError(JSON.stringify(finres));
						}
					}
				});
				}, 500);
			}else{
				console.error("switchcommand could not be sent...");
				self.onError(JSON.stringify(response));
			}
			
			
		});
		
		
		
	}
	
	self.SwitchOnOffCheck = function(deviceID, valToSet, ajaxID, callBack){
	
	
		util.log("switch " + (valToSet == 1 ? "on" : "off") + " device id " + deviceID + "...");
		
		var d = new Date();
		var n = d.getTime();
				
		var requestPath = "/myfritz/areas/homeauto.lua?" + 
			"sid=" + self._auth.SID + 
			"&deviceId="+deviceID + 
			"&cmd=switchChangeCheck" + 
			"&cmdValue=" + valToSet + 
			"&ajax_id=" + ajaxID + 
			"&xhr=1" + 
			"&t"+ n +"=nocache";
			
		var reqOptions = self._reqOptions;
		reqOptions.path = requestPath;
								
		var myreq = self.doRequest(reqOptions, function(response){
			util.log(response);
			
			if(typeof callBack == "function"){
				callBack(response);
			}
		});
		
		return true;
		
	}
	
	self.getHome = function(callback){
	
		util.log("get home page...");
		
		var HOMErequestPath = "/home/home.lua?sid=" + self._auth.SID;
		var reqOptions = self._reqOptions;
		reqOptions.path = HOMErequestPath;
								
								
		var myreq = self.doRequest(reqOptions, function(response){
			util.log(response);
		
		});

	};
	
	
	self.login = function(user, pw, callback){
									
						
		if(typeof user == "undefined"){
			self.onError("no user defined. cannot proceed with login.");
		}				
	
		if(typeof pw == "undefined"){
			self.onError("no password defined. cannot proceed with login.");
		}

										
					util.log("try login... with user " + user);
					
					//add SID here..because we already may have recieved one...
					var loginRequestPath = "/login_sid.lua?sid=" + self._auth.SID;
					var reqOptions = self._reqOptions;
					reqOptions.path = loginRequestPath;
										
					var myreq = self.doRequest(self._reqOptions, function(response){
						xml2js.parseString(response, function (err, result) {
							if(err != null){
								console.error("I was expecting xml but there was an error...");
								self.onError(err);
							}
							var sessInfo = result.SessionInfo;
						    
							if(sessInfo.BlockTime > 0){
								// check if it is necessary to watch out for blocktime...
							}
						    
						    util.log("look for SID...");
						    util.log("Session ID: " + sessInfo.SID);
						    if (sessInfo.SID == "0000000000000000") {
						    
						    	util.log("SID empty... requesting a new one...");
						    	util.log("Challenge recieved: " + sessInfo.Challenge);
						    	
						    	//stuff comes in utf-8, but we need utf16le...
						    	//so we use ucs2 which is similar and javascripts native subset...
						    	
						    	var uc2buffer = new Buffer(sessInfo.Challenge + "-" + pw, "ucs2"); 
						    	
						    	var challengeResponse = sessInfo.Challenge + "-" + md5(uc2buffer);
						    	
						    	util.log("created response: " + challengeResponse);
						    	
						    	var SIDrequestPath = "/login_sid.lua?" +
						    		"username=" + user + 
						    		"&response=" + challengeResponse;
						    	
						    	
								var reqOptions = self._reqOptions;
								reqOptions.path = SIDrequestPath;
								
								util.log("Request SID...");
								self.doRequest(self._reqOptions, function(response){
									xml2js.parseString(response, function (err, result) {
									
										var d = new Date();
										var n = d.getTime();
		
										if(err != null){
											console.error("I was expecting xml but there was an error...");
											self.onError(err);
										}
										
										util.log("look for SID...");
										var sessInfo = result.SessionInfo;
										
										util.log("Recieved SID: " + sessInfo.SID);
										
										if (sessInfo.SID == "0000000000000000") {
											console.error("Login was NOT successful...");
											self.onError(JSON.stringify(sessInfo));
										}
										
										
										util.log("Login successful...");
										
										
										self._auth.SID = sessInfo.SID;
										self._auth.Rights = sessInfo.Rights;
						    			self._auth.BlockTime = sessInfo.BlockTime;
										
										if(typeof callback == "function"){
											callback(sessInfo);
										}
										
										
										return true;
								
									});
								});
						    }else{
						    	util.log("Found valid SSID seems as if you are already logged in...");
						    	self._auth.SID = sessInfo.SID;
						    	self._auth.Rights = sessInfo.Rights;
						    	self._auth.BlockTime = sessInfo.BlockTime;
						    	return true;
						    }
						    
						    
				     	});
					});
		
	};

	
	self.onError = function(err){
		console.error("ERROR: " + err);
		console.error("PROCESS IS GOING BYEBYE...");
		process.exit(1);
	};
	
	
	//initialize with arguments
	
	if(typeof uri != "undefined"){
		self._reqOptions.hostname = uri;
	}
	
	
	return self;
};


