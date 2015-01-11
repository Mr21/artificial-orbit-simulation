opd.ship = {
	init: function(cnv, ctx) {
		this.x = 300;
		this.y = -200;
		this.dx = 0;
		this.dy = 0;
		this.spShip = new canvaslothSprite(ctx, cnv.image('spShip.png'))
			.pivotX("center").pivotY("center")
			.dstSize(25, 25);
		this.tail.ship = this;
	},
	tail: {
		recording: true,
		pos: [],
		delay: 0,
		size: 50,
		dotId: 0,
		dotSize: 3,
		holeSize: 3 + 5,
		draw: function(ctx, cnv, ft) {
			this.delay += ft;
			if (this.delay > .025) {
				this.delay = 0;
				if (this.recording) {
					this.pos.unshift([this.ship.x, this.ship.y]);
					++this.dotId;
				}
				if (this.pos.length > this.size || !this.recording)
					this.pos.pop();
			}
			if (this.pos.length > 2) {
				ctx.lineCap =
				ctx.lineJoin = "round";
				ctx.lineWidth = 4;
				ctx.strokeStyle = "#fff";
				for (var i = this.dotId % this.holeSize; i < this.pos.length - this.holeSize; i += this.holeSize) {
					ctx.globalAlpha = i < this.pos.length - 3 * this.holeSize
						? .15
						: i < this.pos.length - 2 * this.holeSize
							? .05
							: .025;
					ctx.beginPath();
						for (var j = 0; j <= this.dotSize; ++j)
							ctx.lineTo(this.pos[i + j][0], this.pos[i + j][1]);
						ctx.stroke();
					ctx.closePath();
				}
			}
		}
	},
	draw: function(ctx, cnv, ft) {
		// update
		var	angle = Math.atan2(
				 this.x,
				-this.y
			),
			vx = Math.sin(angle),
			vy = Math.cos(angle),
			vx90 = Math.sin(angle - Math.PI / 2),
			vy90 = Math.cos(angle + Math.PI / 2),
			dist = this.x * this.x + this.y * this.y,
			earthRad2 = Math.pow(opd.earth.radius, 2);

		// direction
		this.dx -= earthRad2 / dist * 5 * vx;
		this.dy += earthRad2 / dist * 5 * vy;
		if (cnv.key(32)) {
			this.dx += 200 * vx * ft;
			this.dy -= 200 * vy * ft;
		}
		if (cnv.key(37)) {
			this.dx += 100 * vx90 * ft;
			this.dy += 100 * vy90 * ft;
		} else if (cnv.key(39)) {
			this.dx -= 100 * vx90 * ft;
			this.dy -= 100 * vy90 * ft;
		}
		// position
		this.x += this.dx * ft;
		this.y += this.dy * ft;

		// render
		this.tail.draw(ctx, cnv, ft);

		ctx.save();
			ctx.translate(this.x, this.y);
				ctx.save();
					ctx.rotate(angle);
						this.spShip.draw(0, 0);
				ctx.restore();
				// debug
				ctx.beginPath();
					ctx.lineWidth = 2;
					ctx.strokeStyle = "rgba(255,255,255,.3)";
					ctx.globalAlpha = 1;
					ctx.moveTo(0, 0); ctx.lineTo(this.dx, this.dy);
					ctx.moveTo(0, 0); ctx.lineTo(vx90 * +50, vy90 * +50);
					ctx.moveTo(0, 0); ctx.lineTo(vx90 * -50, vy90 * -50);
					// ctx.stroke();
				ctx.closePath();
		ctx.restore();
	}
};
