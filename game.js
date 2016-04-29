$(document).ready(function(){
    var socket = io.connect("http://localhost:8000/");

/****************************************************************/
	
	var Game = {
	PlayerOne 		: null,
	PlayerTwo 		: null,
	CurrentPlayer 	: null,
	Board 			: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	Chances 		: 0,
	Winner			: null,
	WinningCase 	: 0
	};
	
	var score = 0;
	var color;

	socket.on("init",function(data){
        console.log(data.msg);
		activateCells();
		
		color = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
		
		document.getElementById("s1").innerHTML="You are player id : "+socket.id;
		
    });
	
	function activateCells() {
	var td = document.querySelectorAll("td");
	for( var i = 0; i < 25 ; ++i) {
		if( !Game.Board[i]) {
			td[i].addEventListener('click', play, false);
			//td[i].classList.add('active');
			td[i].addEventListener('mouseover', mouseover, false);
			td[i].addEventListener('mouseout', mouseout, false);
			}
		}
	}
	
	function play(evt) {
		//getting the id of the fired element
		var id = event.target.id;
		//alert(id);
		var num = parseInt(id);
		
		console.log("Cell clicked"+ num);
		
		//check if the cell is already clicked
		if( Game.Board[num-1] ) { return 0; }
		
		if( !Game.Board[num-1] ) { 
			document.getElementById(num).style.background= color;
			document.getElementById(num).removeEventListener('mouseover', mouseover, false);
			document.getElementById(num).removeEventListener('mouseout', mouseout, false);
			Game.Board[num-1] = 1;
			score++;
			document.getElementById("s2").innerHTML="Your score : "+score;
			socket.emit('update1',{"socketID":socket.id, "board": Game.Board, "color":color, "box":num, "score":score, "player":0});
			console.log("EMIT");
		}
		
	}
	
	function mouseover(evt) {
		//getting the id of the fired element
		var id = event.target.id;
		//alert(id);
		var num = parseInt(id)
		
		//check if the cell is already clicked
		if( !Game.Board[num-1] ) { document.getElementById(num).style.background= color; }
		
	}
	
	function mouseout(evt) {
		//getting the id of the fired element
		var id = event.target.id;
		//alert(id);
		var num = parseInt(id);
		
		//check if the cell is already clicked
		if( !Game.Board[num-1] ) { document.getElementById(num).style.background="white"; }
		
	}
	
	socket.on("update2",function(data){
        console.log("update2");
		Game.Board = data.board;
		document.getElementById(data.box).style.background= data.color;
		document.getElementById(data.box).removeEventListener('mouseover', mouseover, false);
		document.getElementById(data.box).removeEventListener('mouseout', mouseout, false);
		
    });
	
	socket.on("update3",function(data){
        console.log("Winner is player" + data.winner);
		alert("Winner is player" + data.winner);
		
    });
});
/****************************************************************/

	