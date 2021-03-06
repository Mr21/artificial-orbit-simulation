opd.earth = {
	radius: 100,
	gravity: 1,
	rotationSpeed: .33,
	atmosphereSize: .1,
	angle: 0,
	init: function(cnv, ctx) {
		this.spEarth = new canvaslothSprite(ctx, cnv.image('spEarth.png'))
			.pivotX("center").pivotY("center")
			.dstSize(this.radius * 2);
		this.spShadow = new canvaslothSprite(ctx, cnv.image('spShadow.png'))
			.pivotX("center").pivotY("center")
			.dstSize(2 * (this.radius + this.radius * this.atmosphereSize))
			.opacity(.35);
	},
	draw: function(ctx, ft) {
		this.angle += this.rotationSpeed * ft;
		     if (this.angle >  Math.PI) this.angle -= Math.PI * 2;
		else if (this.angle < -Math.PI) this.angle += Math.PI * 2;
		// earth
		ctx.save();
			ctx.rotate(this.angle);
				this.spEarth.draw(0, 0);
		ctx.restore();
	},
	drawOpacity: function(ctx) {
		// atmosphere
		ctx.lineWidth = this.radius * this.atmosphereSize;
		ctx.strokeStyle = "#fff";
		ctx.globalAlpha = .08;
		ctx.beginPath();
			ctx.arc(0, 0, this.radius + ctx.lineWidth / 2, 0, Math.PI * 2, true);
		ctx.stroke();
		// shadow
		this.spShadow.draw(0, 0);
	}
};
