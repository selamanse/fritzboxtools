# fritzboxtools

[![NPM version](https://img.shields.io/npm/v/fritzboxtools.svg?style=flat)](https://www.npmjs.com/package/fritzboxtools)

this is a module for nodejs.
It can get Smart Home Data from your fritz!Box, turn on and off Fritz!DECT 200 Outlets.
 
currently developed and tested on mac osx maverics.
currently tested as metrics collecting application running on Arch Linux ARM (on RaspberryPi)

depends on following node modules:

- http (included in nodejs)
- util (included in nodejs)
- xml2js
- MD5
- yargs (only for examples and restproxy)
- express (only for restproxy)

These tools are currently in progress of development but can be used for developing apps on top of it.

fritzboxtools.js represents a working reimplementation of the [session-id](http://avm.de/fileadmin/user_upload/Global/Service/Schnittstellen/AVM_Technical_Note_-_Session_ID.pdf) based example of 
the http interface action for avm-products.

Since Version 0.3.3 fritboxtools also supports [AHA-HTTP-Interface](http://avm.de/fileadmin/user_upload/Global/Service/Schnittstellen/AHA-HTTP-Interface.pdf) methods.

STATE: USABLE, GENERIC AND FUNCTIONAL ALMOST COMPLETE (ALPHA).

## Example usage

These commands require only "HomeAuto" privileges for the user (BoxAdmin has all rights).

### Full Device Data

Simple request to print JSONdata from all connected outlets every 3 seconds to stdout.


    var fritzboxtools = require('fritzboxtools');
    
    var fbox = new fritzboxtools("fritz.box");
    
    fbox.login("username", "password", function(){
        	
        	fbox.getData(function(d){
    		
    		  console.log(d);
    		
    	    }, 3000);
    	    
    });
    
### AIN List

Request to print comma separated AINs from all connected outlets to stdout.
	
	fbox.login("username", "password", function(){
	
			fbox.homeautoSwitch("", "getswitchlist", function(d){
		
				console.log(d);
		
			});
	
	});