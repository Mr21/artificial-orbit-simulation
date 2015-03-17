opd = {
	init: function(cnv, ctx) {
		var that = this;

		this.cnv = cnv;
		this.ctx = ctx;
		this.w = ctx.canvas.width;
		this.h = ctx.canvas.height;
		this.space.init(cnv, ctx);
		this.earth.init(cnv, ctx);
		this.ship.init(cnv, ctx);

		// referencial
		this.refX = 0;
		this.refY = 0;
		this.refAngle = 0;
		cssReset.callback(
			cnv.container.querySelector(".referencial .css-btngrp"),
			function() {
				that.objReferenced = this.attr("data");
				return false;
			}
		);
	},
	keydown: function(k) {
		if (!this.cnv.key(k))
			switch (k) {
				case 40: this.ship.reactorTopOn(); break;
				case 37: this.ship.reactorRightOn(); break;
				case 38: this.ship.reactorBottomOn(); break;
				case 39: this.ship.reactorLeftOn(); break;
			}
	},
	keyup: function(k) {
		// if (this.cnv.key(k))
			switch (k) {
				case 40: this.ship.reactorTopOff(); break;
				case 37: this.ship.reactorRightOff(); break;
				case 38: this.ship.reactorBottomOff(); break;
				case 39: this.ship.reactorLeftOff(); break;
			}
	},
	joystickHold: function() {
		lg("hold");
	},
	joystickRelease: function() {
		lg("release");
	},
	joystickMove: function(x, y, rx, ry) {
		     if (y >=  .5) { this.keydown(40); this.keyup(38); }
		else if (y <= -.5) { this.keydown(38); this.keyup(40); }
		else               { this.keyup(38);   this.keyup(40); }
		     if (x >=  .5) { this.keydown(39); this.keyup(37); }
		else if (x <= -.5) { this.keydown(37); this.keyup(39); }
		else               { this.keyup(37);   this.keyup(39); }
	},
	render: function() {
		var	ctx = this.ctx,
			cnv = this.cnv,
			fTime = 1 / 60;

		ctx.clearRect(0, 0, this.w, this.h);

		ctx.save();
			ctx.translate(this.w / 2, this.h / 2);
				ctx.save();

					var angleDiff;
					switch (this.objReferenced) {
						case "ship":
							angleDiff = this.ship.angle - this.refAngle;
							this.refX += (this.ship.x - this.refX) * fTime * 5;
							this.refY += (this.ship.y - this.refY) * fTime * 5;
						break;
						case "earth":
							angleDiff = this.earth.angle - this.refAngle;
							this.refX += (0 - this.refX) * fTime * 5;
							this.refY += (0 - this.refY) * fTime * 5;
						break;
						case "universe":
							angleDiff = 0 - this.refAngle;
							this.refX += (0 - this.refX) * fTime * 5;
							this.refY += (0 - this.refY) * fTime * 5;
						break;
					}
					     if (angleDiff >  Math.PI) angleDiff -= Math.PI * 2;
					else if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
					this.refAngle += angleDiff * fTime * 5;
					     if (this.refAngle >  Math.PI) this.refAngle -= Math.PI * 2;
					else if (this.refAngle < -Math.PI) this.refAngle += Math.PI * 2;

					ctx.rotate(-this.refAngle);
						ctx.translate(-this.refX, -this.refY);
							this.space.draw(ctx);
							this.earth.draw(ctx, fTime);
							this.ship.draw(ctx, cnv, fTime);
							this.earth.drawOpacity(ctx);
				ctx.restore();
		ctx.restore();
	}
};
