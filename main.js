window.onload = function() {
	new Canvasloth({
		container: document.querySelector(".canvasloth"),
		context: "2d",
		autoFocus: true,
		fps: 60,
		thisApp: opd,
		ready: function(o) {
			opd.init(o.canvasloth, o.ctx);
			new joystick({
				element: document.querySelector(".joystick"),
				move: function(x, y) {
					opd.joystickMove(x, y);
				}
			});
		},
		loop: opd.render,
		events: {
			keydown: function(o) { opd.keydown(o.key); },
			keyup:   function(o) { opd.keyup(o.key); }
		}
	});
};
