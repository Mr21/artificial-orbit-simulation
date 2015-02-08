opd.ship = {
	init: function(cnv, ctx) {
		this.x = 15;
		this.y = -10;
		this.dx = 0;
		this.dy = 0;
		this.angle = 0;
		this.size = 25;
		this.landed = false;
		this.angleEarth = 0;
		this.tail.ship = this;

		this.spShip = new canvaslothSprite(ctx, cnv.image('spShip.png'))
			.pivotX("center").pivotY("center")
			.dstSize(this.size);

		this.anSolarPanel =
			new canvaslothAnim(
				new canvaslothSprite(ctx, cnv.image('anSolarPanel.png'))
					.srcSize(56, 28)
					.pivotX("left").pivotY("center")
			)
			.vertical()
			.looping(true)
			.nbFrames(10)
			.duration(.5);

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
		offset: 0,
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
		this.angle = Math.atan2(
			 this.x,
			-this.y
		);

		var
			kSpace = cnv.key(32),
			kLeft  = cnv.key(37),
			kRight = cnv.key(39),
			vx = Math.sin(this.angle),
			vy = Math.cos(this.angle),
			vx90 = Math.sin(this.angle - Math.PI / 2),
			vy90 = Math.cos(this.angle + Math.PI / 2),
			dist = this.x * this.x + this.y * this.y,
			earthRad2 = Math.pow(opd.earth.radius, 2);

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
			Math.pow(opd.earth.radius + this.size / 2, 2) >
			Math.pow(this.x + this.dx * ft, 2) +
			Math.pow(this.y + this.dy * ft, 2);

		if (landedBefore !== this.landed) {
			if (this.landed) {
				this.anSolarPanel.loopAt(0);
				this.angleEarth = opd.earth.angle;
				this.dx =
				this.dy = 0;
			} else {
				this.anSolarPanel.loopAt(9);
				this.dx += opd.earth.rotationSpeed * 100 * -vx90;
				this.dy += opd.earth.rotationSpeed * 100 * -vy90;
			}
			this.anSolarPanel.reverse().play();
		}

		// gravity
		if (!this.landed) {
			this.dx -= earthRad2 / dist * 2 * vx;
			this.dy += earthRad2 / dist * 2 * vy;
			this.x += this.dx * ft;
			this.y += this.dy * ft;
		} else {
			vx = Math.sin(this.angle + (opd.earth.angle - this.angleEarth));
			vy = Math.cos(this.angle + (opd.earth.angle - this.angleEarth));
			this.x = (opd.earth.radius + this.size / 2 - .01) *  vx;
			this.y = (opd.earth.radius + this.size / 2 - .01) * -vy;
			this.angleEarth = opd.earth.angle;
		}

		// render
		this.tail.draw(ctx, cnv, ft);
		ctx.save();
			ctx.translate(this.x, this.y);
				ctx.save();
					ctx.rotate(this.angle);
						ctx.save();
							this.anReactors[0].anim.draw(0, -8, ft); ctx.rotate(Math.PI / 2);
							this.anReactors[1].anim.draw(0, -8, ft); ctx.rotate(Math.PI / 2);
							this.anReactors[2].anim.draw(0, -8, ft); ctx.rotate(Math.PI / 2);
							this.anReactors[3].anim.draw(0, -8, ft);
						ctx.restore();
						this.spShip.draw(0, 0);
						ctx.save();
							this.anSolarPanel.draw(11, 0, ft);
							ctx.scale(-1, 1);
							this.anSolarPanel.draw(11, 0, ft);
						ctx.restore();
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
