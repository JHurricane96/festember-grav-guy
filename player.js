function Player(size, position, velocity) {
	this.size = size;
	this.position = position;
	this.velocity = velocity;
}

Player.prototype.collideCheck = function (gravDir, gravChange) {
	if (this.position.y + this.size >= Screen.height) {
		this.position.y = Screen.height - this.size;
		if (!gravChange) {
			if (gravDir == "up")
				this.velocity.y = -this.velocity.y * 0.2;
			else
				this.velocity.y = 0;
		}
	}
	else if (this.position.y <= 0) {
		this.position.y = 0;
		if (!gravChange) {
			if (gravDir == "down")
				this.velocity.y = -this.velocity.y * 0.2;
			else
				this.velocity.y = 0;
		}
	}
}