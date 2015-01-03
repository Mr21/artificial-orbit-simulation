opd.space = {
	init: function(cnv, ctx) {
		this.spSpace = new canvaslothSprite(ctx, cnv.image('spSpace.jpg'))
			.pivotX("center").pivotY("center")
			.dstSizeNorm(.8, .8)
			.opacity(.7);
	},
	draw: function() {
		this.spSpace.draw(0, 0);
	}
};
