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
		var jq_refA = $(".referencial a", cnv.container);

		cnv.container.querySelector(".referencial")
			.cssBtngrpCallback = function() {
				that.objReferenced = this.attr("data");
			};
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
							this.refX += (-this.refX) * fTime * 5;
							this.refY += (-this.refY) * fTime * 5;
						break;
					}

					     if (angleDiff >  Math.PI) angleDiff -= Math.PI * 2;
					else if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
					this.refAngle += angleDiff * .05;
					     if (this.refAngle >  Math.PI) this.refAngle -= Math.PI * 2;
					else if (this.refAngle < -Math.PI) this.refAngle += Math.PI * 2;

					ctx.rotate(-this.refAngle);
						ctx.translate(-this.refX, -this.refY);
							this.space.draw();
							this.earth.draw(ctx, fTime);
							this.ship.draw(ctx, cnv, fTime);
				ctx.restore();
		ctx.restore();
	}
};
