opd.ship = {
	init: function(cnv, ctx) {
		this.x = 0;
		this.y = -200;
		this.spShip = new canvaslothSprite(ctx, cnv.image('spShip.png'))
			.pivotX("center").pivotY("center")
			.dstSize(20, 20);
		this.qwe = -2;
	},
	draw: function(ctx, ft) {
		var	angle = Math.atan2(
			+this.x,
			-this.y
		);
		ctx.save();
			ctx.translate(this.x, this.y);
				ctx.rotate(angle);
					this.spShip.draw(0, 0);
		ctx.restore();
	}
};
