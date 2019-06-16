var Dagger = require("eth-dagger");
var Web3 = require('web3');
var request = require('request');
var Pusher = require('pusher');
var socket  = require( 'socket.io' );
var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = socket.listen( server );
var port    = process.env.PORT || 4000;

var all_address = new Array()


server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

io.on('connection', function (socket) {
	socket.on( 'new_address', function( data ) {
	    console.log('new_Request');
	    get_address();
  	});

});


function get_address(){

	request.get(
		    'https://triunits.com/api/all_etherium_address',
		    function (error, response, body) {
		        if (!error && response.statusCode == 200) {
		        	var jso = JSON.parse(body);
		        	while(all_address.length > 0) {
					    all_address.pop();
					}
		        	if (!jso.error){
		        		for (var i = 0; i<jso.address.length; i++){
		        			all_address.push(jso.address[i]);
		        		}
		        	}
		            console.log(body);
		            console.log(all_address);
		        }
		    }
		);
}

const dagger = new Dagger('wss://mainnet.dagger.matic.network');

var i = 0;

dagger.on('confirmed:addr/+/tx/in', (listener) => {
	if (all_address.length > 0){

		
		if (all_address.indexOf(listener.to) != -1){

			console.log('received');

			request.post(
			    'https://triunits.com/api/eathwallet_extract',
			    { json: listener },
			    function (error, response, body) {
			        if (!error && response.statusCode == 200) {
			            console.log(body);
			        }
			    }
			);

		}		
		
	}
});
