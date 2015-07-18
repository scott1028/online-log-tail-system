'use strict';


//
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Tail = require('tail').Tail;


//
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});


//
io.on('connection', function(socket) {

    var tail = null;

    //
    socket.on('setPath', function(filePath) {
        
        if(tail != null){
            tail.unwatch();
            console.log('Stop tail');

            // release
            tail = null;
        };

        console.log('setPath: ' + filePath)


        //
        try{
            tail = new Tail(filePath);


            //
            tail.on("line", function(data) {
                socket.emit('logMsg', data);
                console.log(data);
            });


            //
            tail.on("error", function(error) {
                console.log('ERROR: ', error);
            });
        }
        catch(e){
            socket.emit('logMsg', JSON.stringify(e));
        }
    });
});


//
http.listen(3000, function() {
    console.log('listening on *:3000');
});
