var fritzboxtools = require('../lib/fritzboxtools');



var fbox = new fritzboxtools();
var mypassword = "fritzbox_password_goes_here";

fbox.login(mypassword, function(){
	fbox.getHome();
});