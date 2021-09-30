let express = require('express');
let app     = express();
let http    = require('http').Server(app); 
let io      = require('socket.io')(http);    

const PORT  = 3000;
http.listen(PORT, function(){ 
	console.log('[Chat Server On] PORT : ' + PORT);
});

app.get('/', (req, res) => {  
  res.sendFile(__dirname + '/client/index.html');
});

let count = 1;
io.on('connection', function(socket){ 
  console.log('[수신 - connection] socket.id: ' + socket.id);  

  let name = "Guest" + count++;                 
	socket.name = name;

  io.to(socket.id).emit('create name', name);   
  console.log('[송신 - socket.id: ' + socket.id + '에게만, create name] name: ' + name);

  io.emit('new_connect', name);
  console.log('[송신 - new_connect] name: ' + name);
	
	socket.on('disconnect', function(){ 
	  console.log('[수신 - disconnect] socket.id: ' + socket.id + ', socket.naem: ' + socket.name);

    io.emit('new_disconnect', socket.name);
    console.log('[송신 - new_disconnect] socket.name: ' + socket.name);
	});

	socket.on('send message', function(name, text){ 
		var msg = name + ' : ' + text;
		if(name != socket.name) {
			io.emit('change name', socket.name, name);
      console.log('[송신 - change name] socket.name: ' + socket.name + ', name: ' + name);
    }

    socket.name = name;
    // console.log(msg);

    io.emit('receive message', msg);
    console.log('[송신 - receive message] msg: ' + msg);
	});
});