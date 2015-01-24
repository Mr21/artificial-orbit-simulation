opd.ship = {
	init: function(cnv, ctx) {
		this.x = 15;
		this.y = -10;
		this.dx = 0;
		this.dy = 0;
		this.size = 25;
		this.landed = false;
		this.angleEarth = 0;
		this.tail.ship = this;

		this.spShip = new canvaslothSprite(ctx, cnv.image('spShip.png'))
			.pivotX("center").pivotY("center")
			.dstSize(this.size);

		this.anReactors = [];
		for (var i = 0; i < 4; ++i) {
			this.anReactors[i] = {
				active: false,
				anim: new canvaslothAnim(
						new canvaslothSprite(ctx, cnv.image('anReactor.png'))
							.srcSize(8, 18)
							.pivotX("center").pivotY("bottom")
					)
					.looping(true)
					.loopAt(3)
					.nbFrames(7)
					.duration(.5)
			};
		}
	},
	reactorTopOn:     function() { var r = this.anReactors[0]; r.anim.play(); r.active = true; },
	reactorRightOn:   function() { var r = this.anReactors[1]; r.anim.play(); r.active = true; },
	reactorBottomOn:  function() { var r = this.anReactors[2]; r.anim.play(); r.active = true; },
	reactorLeftOn:    function() { var r = this.anReactors[3]; r.anim.play(); r.active = true; },
	reactorTopOff:    function() { var r = this.anReactors[0]; r.anim.stop(); r.active = false; },
	reactorRightOff:  function() { var r = this.anReactors[1]; r.anim.stop(); r.active = false; },
	reactorBottomOff: function() { var r = this.anReactors[2]; r.anim.stop(); r.active = false; },
	reactorLeftOff:   function() { var r = this.anReactors[3]; r.anim.stop(); r.active = false; },
	tail: {
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
				this.pos.unshift([this.ship.x, this.ship.y]);
				++this.dotId;
				if (this.pos.length > this.size)
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
		var
			kSpace = cnv.key(32),
			kLeft  = cnv.key(37),
			kRight = cnv.key(39),
			angle = Math.atan2(
				 this.x,
				-this.y
			),
			vx = Math.sin(angle),
			vy = Math.cos(angle),
			vx90 = Math.sin(angle - Math.PI / 2),
			vy90 = Math.cos(angle + Math.PI / 2),
			dist = this.x * this.x + this.y * this.y,
			earthRad2 = $.sqr(opd.earth.radius);

		// controls
		if (this.anReactors[0].active) {
			this.dx -= 2 * vx;
			this.dy += 2 * vy;
		}
		if (this.anReactors[2].active) {
			this.dx += 2 * vx;
			this.dy -= 2 * vy;
		}
		if (this.anReactors[1].active) {
			this.dx += vx90;
			this.dy += vy90;
		}
		if (this.anReactors[3].active) {
			this.dx -= vx90;
			this.dy -= vy90;
		}

		// earth collision
		var landedBefore = this.landed;
		this.landed =
			$.sqr(opd.earth.radius + this.size / 2) >
			$.sqr(this.x + this.dx * ft) +
			$.sqr(this.y + this.dy * ft);

		if (landedBefore !== this.landed) {
			if (this.landed) {
				this.angleEarth = opd.earth.angle;
				this.dx =
				this.dy = 0;
			} else {
				this.dx = 100 * -vx90;
				this.dy = 100 * -vy90;
			}
		}

		// gravity
		if (!this.landed) {
			this.dx -= earthRad2 / dist * 2 * vx;
			this.dy += earthRad2 / dist * 2 * vy;
			this.x += this.dx * ft;
			this.y += this.dy * ft;
		} else {
			vx = Math.sin(angle + (opd.earth.angle - this.angleEarth));
			vy = Math.cos(angle + (opd.earth.angle - this.angleEarth));
			this.x = (opd.earth.radius + this.size / 2 - .01) *  vx;
			this.y = (opd.earth.radius + this.size / 2 - .01) * -vy;
			this.angleEarth = opd.earth.angle;
		}

		// render
		this.tail.draw(ctx, cnv, ft);
		ctx.save();
			ctx.translate(this.x, this.y);
				ctx.save();
					ctx.rotate(angle);
						// ctx.scale(1.2, 1.2);
						ctx.save();
							this.anReactors[0].anim.draw(0, -8, ft); ctx.rotate(Math.PI / 2);
							this.anReactors[1].anim.draw(0, -8, ft); ctx.rotate(Math.PI / 2);
							this.anReactors[2].anim.draw(0, -8, ft); ctx.rotate(Math.PI / 2);
							this.anReactors[3].anim.draw(0, -8, ft);
						ctx.restore();
						this.spShip.draw(0, 0);
				ctx.restore();
				// debug
				// ctx.beginPath();
				// 	ctx.lineWidth = 2;
				// 	ctx.strokeStyle = "rgba(255,255,255,.3)";
				// 	ctx.globalAlpha = 1;
				// 	ctx.moveTo(0, 0); ctx.lineTo(this.dx, this.dy);
				// 	ctx.moveTo(0, 0); ctx.lineTo(vx90 * +50, vy90 * +50);
				// 	ctx.moveTo(0, 0); ctx.lineTo(vx90 * -50, vy90 * -50);
				// 	ctx.stroke();
				// ctx.closePath();
		ctx.restore();
	}
};
