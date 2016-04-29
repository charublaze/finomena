var express = require("express"),
    app = express(),
    server = require("http").createServer(app),
    io = require("socket.io").listen(server);
server.listen(8000);
app.use(express.static(__dirname + '/'));
app.get('/', function (req, res) {
    res.sendfile(__dirname + "/index.html");
});


/***********************************/

var player = [];
var count = 0;
var clientno = 0;

io.sockets.on("connection", function (socket) {

    io.sockets.emit("init", {msg: "start"});
	
	clientno++;
	
    player.push({
        id: socket.id,
        highscore: 0,
		playerid:clientno
    });
    console.log("a client has connected: " + socket.id);
	console.log("Size: " + player.length);
	
	
	socket.on('update1', function (data) {
		count++;
        console.log("socket "+ data.socketID + " Count" + count);
		
		for(var i=0; i<player.length; i++)
		{
			if(player[i].id ==  data.socketID)
			{
				player[i].highscore = data.score;
			}
		}
		
		if(count==25)
		{
			count=0;
			var max = player[0].highscore;
			var temp = 0;
			for(var i=0; i<player.length; i++)
			{
				if(player[i].highscore > max)
				{
					max = player[i].highscore;
					temp = i;
				}
			}
			socket.broadcast.emit('update3', {"winner":player[temp].id});
			player.splice(0,player.length);
		}
		
		socket.broadcast.emit('update2', data);
		});
	
});

/***********************************/