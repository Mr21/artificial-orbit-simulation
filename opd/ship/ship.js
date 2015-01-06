opd.ship = {
	init: function(cnv, ctx) {
		this.x = 50;
		this.y = -150;
		this.tailRecording = true;
		this.tailDelay = 0;
		this.tailDotId = 0;
		this.tailSize = 50;
		this.ar_posTail = [];
		this.spShip = new canvaslothSprite(ctx, cnv.image('spShip.png'))
			.pivotX("center").pivotY("center")
			.dstSize(25, 25);
	},
	draw: function(ctx, cnv, ft) {
		// update
		if      (cnv.key(37)) this.x -= 100 * ft;
		else if (cnv.key(39)) this.x += 100 * ft;
		if      (cnv.key(38)) this.y -= 100 * ft;
		else if (cnv.key(40)) this.y += 100 * ft;

		var	tail = this.ar_posTail;

		this.tailDelay += ft;
		if (this.tailDelay > .025) {
			this.tailDelay = 0;
			if (this.tailRecording) {
				tail.unshift([this.x, this.y]);
				++this.tailDotId;
			}
			if (tail.length > this.tailSize || !this.tailRecording)
				tail.pop();
		}

		// render
		if (tail.length > 2) {
			var dotSize = 3.0;
			var holeSize = dotSize + 5.0;
			ctx.lineWidth = 4;
			ctx.lineCap =
			ctx.lineJoin = "round";
			ctx.strokeStyle = "#fff";
			for (var i = this.tailDotId % holeSize; i < this.ar_posTail.length - holeSize; i += holeSize) {
				ctx.globalAlpha = i < this.ar_posTail.length - 3 * holeSize
					? .15
					: i < this.ar_posTail.length - 2 * holeSize
						? .05
						: .025;
				ctx.beginPath();
					for (var j = 0; j <= dotSize; ++j)
						ctx.lineTo(this.ar_posTail[i + j][0], this.ar_posTail[i + j][1]);
					ctx.stroke();
				ctx.closePath();
			}
		}

		var	vx = Math.sin(angle),
			vy = Math.cos(angle),
			angle = Math.atan2(
				 this.x,
				-this.y
			);
		ctx.save();
			ctx.translate(this.x, this.y);
				ctx.rotate(angle);
					this.spShip.draw(0, 0);
		ctx.restore();
	}
};
