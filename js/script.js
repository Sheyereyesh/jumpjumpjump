
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

function Game(){
	this.init();
	this.char=new Charactor();
	document.addEventListener('keypress',(e)=>{
		this.char.jump();
	});
	this.enemys=[];
	this.enemys.push(new Enemy());
	this.incEnemy=400;
	this.startButton=
	this.el=makeElement("button","50px","200px","#ff7506","absolute","");
	this.startButton.innerHTML="Play";
	this.startButton.addEventListener('click',()=>{this.start();});
	this.restartButton=makeElement("button","50px","200px","green","absolute","");
	this.restartButton.innerHTML="Play again";
	this.restartButton.style.zIndex=this.startButton.style.zIndex="5";
	this.restartButton.style.top=this.startButton.style.top="225px";
	this.restartButton.style.left=this.startButton.style.left="50px";
	this.restartButton.style.display="none";
	this.restartButton.addEventListener('click',()=>{this.restart();});
	app.append(this.restartButton);
	app.append(this.startButton);
	this.scoreBoard=new ScoreBoard();
}

Game.prototype.init=function(){
	this.el=makeElement("div","500px","300px","url('./img/background.jpg')","relative","app");
	this.el.style.overflow="hidden";
	document.body.append(this.el);
	this.fcount=0;
};

Game.prototype.start=function(){
	this.startButton.style.display="none";
	this.restartButton.style.display="none";
	game_audio.play();
	setTimeout(()=>{this.frame=requestAnimationFrame(()=>{this.update();});},2000);
};

Game.prototype.update=function(){
	this.char.update();
	if(this.enemys.length>0){
		this.enemys.forEach(function(el){el.update()});
		if(p2n(this.enemys[0].el.style.bottom)<-30){
			app.removeChild(this.enemys[0].el);
			this.enemys.shift();
			this.char.increaseScore(1);
			this.scoreBoard.update(this.char.getScore()-1);
		}
	}
	if (this.fcount>=this.incEnemy){
		this.fcount=0;
		this.enemys.push(new Enemy());
	}else
		this.fcount++;
	this.incEnemy=400/Math.ceil(this.char.getScore()/5);
	if(this.char.isDead(this.enemys)){
		this.gameOver();
	}else
		this.frame=requestAnimationFrame(()=>{this.update();});
};

Game.prototype.restart=function(){
	this.char.resetScore();
	this.char.el.style.left="135px";
	this.start();
}
Game.prototype.gameOver=function(){

	this.restartButton.style.display="block";
	explode_audio.play();
	game_audio.pause();
	cancelAnimationFrame(this.frame);
	alert("Game Over XXXX Your Score :"+(this.char.getScore()-1));
	if(this.enemys.length>0){
		this.enemys.forEach(function(enemy){
			app.removeChild(enemy.el);
		});
		this.enemys=[];
	}
}


function ScoreBoard(){
	this.init();
}

ScoreBoard.prototype.init=function(){
	this.a=2;
	this.el=makeElement('div','50px',"100%","","absolute","");
	this.el.style.textAlign="center";
	this.el.innerHTML="Score : 0";
	app.append(this.el);
	this.el.style.top="0";
	this.el.style.color="#fff";
	this.el.zIndex="10";
}

ScoreBoard.prototype.update=function(score){
	this.el.innerHTML="Score : "+score;
}








function Charactor(){
	this.init();
}

Charactor.prototype.init=function(){
	this.el=makeElement("div","30px","30px","url('./img/char.gif')","absolute","char");
	this.el.style.borderRadius="50%";
	this.el.style.bottom="20px";
	this.el.style.left="135px";
	app.append(this.el);
	this.score=1;
	this.left=false;
	this.el.setAttribute("class","char");

};

Charactor.prototype.increaseScore=function(by){
	this.score+=by;
};

Charactor.prototype.update=function(){
	if(this.left&&p2n(this.el.style.left)>0){
		this.el.style.left=n2p(p2n(this.el.style.left)-3);
		this.el.classList.add('reflectX');
	}
	else if(!this.left&&p2n(this.el.style.left)<270){
		this.el.style.left=n2p(p2n(this.el.style.left)+3);
		this.el.classList.remove('reflectX');
	}

};

Charactor.prototype.getScore=function(){
	return this.score;
};

Charactor.prototype.jump=function(){
	this.left=!this.left;
};

Charactor.prototype.isDead=function(enemys){
	this.dead=false;
	enemys.forEach((enemy)=>{
		if((((p2n(enemy.el.style.bottom)-p2n(this.el.style.bottom))>-10)&&((p2n(enemy.el.style.bottom)-p2n(this.el.style.bottom))<10)&&((p2n(enemy.el.style.left)-p2n(this.el.style.left))>-10)&&((p2n(enemy.el.style.left)-p2n(this.el.style.left))<10))||!(p2n(this.el.style.left)>20 && p2n(this.el.style.left)<250 ))
			this.dead=true;
	});
	return this.dead;
}

Charactor.prototype.resetScore=function(){
	this.score=1;
}








function Enemy(){
	this.init();
	this.el.style.bottom="470px";
	this.el.style.left=Math.round(Math.random()*270)+"px";
}

Enemy.prototype.init=function(){
	this.el=makeElement("div","30px","30px","url('./img/zombie.png')","absolute","");
	this.el.setAttribute('class','zombie');
	app.append(this.el);

}

Enemy.prototype.update=function(){
	this.el.style.bottom=n2p(p2n(this.el.style.bottom)-1);
}






// function makeElement(tag,height,width,background,position,id){
// 	var el=document.createElement(tag);
// 	el.style.height=height;
// 	el.style.width=width;
// 	el.style.background=background;
// 	el.style.position=position;
// 	el.setAttribute('id',id);
// 	return el;
// }

function p2n(num){
  return parseInt(num.replace("px",""));
}
function n2p(num){
  return num+"px";
}


function makeElement(tag,height,width,background,position,id){
	var el=document.createElement(tag);
	el.style.height=height;
	el.style.width=width;
	el.style.background=background;
	el.style.position=position;
	el.setAttribute('id',id);
	return el;
}



window.addEventListener('load',function(){
	var g = new Game();
});


