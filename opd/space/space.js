opd.space = {
	init: function(cnv, ctx) {
		this.spSpace = new canvaslothSprite(ctx, cnv.image('spSpace.jpg'))
			.pivotX("center").pivotY("center")
			.dstSizeNorm(.8, .8);
	},
	draw: function(ctx) {
		ctx.imageSmoothingEnabled =
		ctx.mozImageSmoothingEnabled = false;
			this.spSpace.draw(0, 0);
		ctx.mozImageSmoothingEnabled =
		ctx.imageSmoothingEnabled = true;
	}
};
