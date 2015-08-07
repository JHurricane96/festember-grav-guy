var canvasActors = document.getElementById("actors");
var cxActors = canvasActors.getContext("2d");
var game;
var lastTime;

window.addEventListener("click", function() {
	console.log(event.pageX - canvasActors.offsetLeft + canvasActors.offsetWidth / 2, event.pageY - canvasActors.offsetTop + canvasActors.offsetHeight / 2);
});

function Game() {
	this.player = new Player(
		config.playerSize,
		new Vector(100, Screen.height - config.playerSize),
		new Vector(0, 0)
	);
	this.enemies = [];
	this.gravDir = "down";
	this.gravChange = false;
	this.enemyGenDist = config.enemyGenDist;
	this.victorious = "indeterminate";
	//this.xVel = new Vector(-config.xVel, 0);
}

Game.prototype.update = function (timeDiff) {
	var t = timeDiff / 4;
	var toDelete = [];
	this.enemyGenDist -= config.xVel * t;
	if (this.enemyGenDist <= 0) {
		var enemy = new BlockEnemy(
			{
				"width": config.enemyBlockWidth,
				"height": config.enemyBlockHeight
			},
			new Vector(
				Screen.width,
				Math.random() * (Screen.height - config.enemyBlockHeight)
			)
		);
		this.enemyGenDist = config.enemyGenDist;
		this.enemies.push(enemy);
	}
	this.enemies.forEach(function (enemy, i) {
		if (this.player.position.y + this.player.size >= enemy.position.y && this.player.position.y <= enemy.position.y + enemy.height) {
			if (this.player.position.x + this.player.size >= enemy.position.x && this.player.position.x <= enemy.position.x + enemy.width) {
				console.log("player", this.player.position.x, this.player.position.y, this.player.size);
				console.log("enemy", enemy.position.x, enemy.position.y, enemy.width, enemy.height);
				this.victorious = "lost";
			}
		}
		if (enemy.position.x + enemy.width <= 0)
			toDelete.push(i);
		else
			enemy.position.x -= config.xVel * t;
	}, this);
	if (this.victorious == "lost")
		return;
	toDelete.forEach(function (delIndex) {
		this.enemies.splice(delIndex, 1);
	}, this);
	if (this.gravDir == "down")
		this.player.velocity.add(new Vector(0, config.accelMag).mult(t));
	else
		this.player.velocity.add(new Vector(0, -config.accelMag).mult(t));
	this.player.collideCheck(this.gravDir, this.gravChange);
	this.player.position.add(Vector.mult(this.player.velocity, t));
	this.gravChange = false;
}

Game.prototype.render = function () {
	cxActors.clearRect(0, 0, Screen.width, Screen.height);
	cxActors.fillStyle = Render.playerColor;
	cxActors.fillRect(
		this.player.position.x,
		this.player.position.y,
		this.player.size,
		this.player.size
	);
	this.enemies.forEach(function (enemy) {
	cxActors.fillRect(enemy.position.x, enemy.position.y, enemy.width, enemy.height);
	});
}

Game.prototype.changeGrav = function (event) {
	if (event.keyCode == 38) {
		event.preventDefault();
		this.gravDir = "up";
		this.gravChange = true;
	}
	else if (event.keyCode == 40) {
		event.preventDefault();
		this.gravDir = "down";
		this.gravChange = true;
	}
}

Game.prototype.startEvents = function () {
	window.addEventListener("keydown", this.changeGrav.bind(this));
}

Game.prototype.stopEvents = function () {
	window.removeEventListener("keydown", this.changeGrav);
}


function mainLoop(curTime) {
	if (game.victorious != "indeterminate") {
		if (game.victorious == "lost") {
			console.log("noob");
			game.stopEvents();
			return;
		}
	}
	if (!lastTime)
		lastTime = curTime;
	var t = curTime - lastTime;
	game.update(t);
	requestAnimationFrame(mainLoop);
	game.render();
	lastTime = curTime;
}

function main() {
	game.startEvents();
	requestAnimationFrame(mainLoop);
}

var game = new Game();
main();