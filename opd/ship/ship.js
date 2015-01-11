opd.ship = {
	init: function(cnv, ctx) {
		this.x = 50;
		this.y = -150;
		this.dx = 0;
		this.dy = 0;
		this.spShip = new canvaslothSprite(ctx, cnv.image('spShip.png'))
			.pivotX("center").pivotY("center")
			.dstSize(25, 25);
	},
	tail: (function() {
		var	pos = [];
			recording = true,
			delay = 0,
			size = 50,
			dotId = 0,
			dotSize = 3.0,
			holeSize = dotSize + 5.0;
		return function(ctx, cnv, ft) {
			delay += ft;
			if (delay > .025) {
				delay = 0;
				if (recording) {
					pos.unshift([this.x, this.y]);
					++dotId;
				}
				if (pos.length > size || !recording)
					pos.pop();
			}

			if (pos.length > 2) {
				ctx.lineCap =
				ctx.lineJoin = "round";
				ctx.lineWidth = 4;
				ctx.strokeStyle = "#fff";
				for (var i = dotId % holeSize; i < pos.length - holeSize; i += holeSize) {
					ctx.globalAlpha = i < pos.length - 3 * holeSize
						? .15
						: i < pos.length - 2 * holeSize
							? .05
							: .025;
					ctx.beginPath();
						for (var j = 0; j <= dotSize; ++j)
							ctx.lineTo(pos[i + j][0], pos[i + j][1]);
						ctx.stroke();
					ctx.closePath();
				}
			}
		};
	})(),
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
			dist = this.x * this.x + this.y * this.y;

		// direction
		this.dx -= Math.pow(opd.earth.radius, 2) / dist * 5 * vx;
		this.dy += Math.pow(opd.earth.radius, 2) / dist * 5 * vy;
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
		this.tail(ctx, cnv, ft);

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
