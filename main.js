window.onload = function() {
	new Canvasloth({
		container: document.querySelector(".canvasloth"),
		context: "2d",
		autoFocus: true,
		fps: 60,
		thisApp: opd,
		ready: function(cnv, ctx) {
			opd.init(cnv, ctx);
			new joystick({
				element: document.querySelector(".joystick"),
				move: function(x, y) {
					opd.joystickMove(x, y);
				}
			});
		},
		loop: opd.render,
		events: {
			keydown: opd.keydown,
			keyup:   opd.keyup
		}
	});
};
