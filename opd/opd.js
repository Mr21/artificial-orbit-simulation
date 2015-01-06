opd = {
	render: function() {
		var	ctx = this.ctx,
			cnv = this.cnv,
			fTime = cnv.frameTime();
		// ctx.clearRect(0, 0, this.w, this.h);
		ctx.save();
			ctx.translate(this.w / 2, this.h / 2);
				this.space.draw();
				this.earth.draw(ctx, fTime);
				this.ship.draw(ctx, cnv, fTime);
		ctx.restore();
	}
};
