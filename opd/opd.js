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

		// about
		var jq_about = $(".about", cnv.container);
		$(".btnHide", cnv.container).click(function() { jq_about.removeClass("show"); return false; });
		$(".btnShow", cnv.container)
			.click(function() { jq_about.addClass("show"); return false; })
			.click();

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
							this.space.draw();
							this.earth.draw(ctx, fTime);
							this.ship.draw(ctx, cnv, fTime);
							this.earth.drawOpacity(ctx);
				ctx.restore();
		ctx.restore();
	}
};
