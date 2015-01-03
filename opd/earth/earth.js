opd.earth = {
	radius: 100,
	atmosphereSize: 10,
	angle: 0,
	init: function(cnv, ctx) {
		this.spEarth = new canvaslothSprite(ctx, cnv.image('spEarth.png'))
			.pivotX("center").pivotY("center")
			.dstSize(this.radius * 2);
		this.spShadow = new canvaslothSprite(ctx, cnv.image('spShadow.png'))
			.pivotX("center").pivotY("center")
			.dstSize((this.radius + this.atmosphereSize) * 2)
			.opacity(.3);
	},
	draw: function(ctx, ft) {
		// earth
		ctx.save();
			ctx.rotate(this.angle += 1 * ft);
				this.spEarth.draw(0, 0);
		ctx.restore();
		// atmosphere
		ctx.lineWidth = this.atmosphereSize;
		ctx.strokeStyle = "#fff";
		ctx.globalAlpha = .2;
		ctx.beginPath();
			ctx.arc(0, 0, this.radius + this.atmosphereSize / 2, 0, Math.PI * 2, true);
		ctx.stroke();
		// shadow
		this.spShadow.draw(0, 0);
	}
};
