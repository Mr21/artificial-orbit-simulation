function lg(s) { console.log(s); }

$(function() {
	new Canvasloth({
		container: document.querySelector('.canvasloth'),
		context: '2d',
		// autoFocus: true,
		fps: 60,
		thisApp: opd,
		ready: opd.init,
		loop: opd.render,
		events: {
			keydown: function(k) {
				switch (k) {
					case 40: this.ship.reactorTopOn(); break;
					case 37: this.ship.reactorRightOn(); break;
					case 38: this.ship.reactorBottomOn(); break;
					case 39: this.ship.reactorLeftOn(); break;
				}
			},
			keyup: function(k) {
				switch (k) {
					case 40: this.ship.reactorTopOff(); break;
					case 37: this.ship.reactorRightOff(); break;
					case 38: this.ship.reactorBottomOff(); break;
					case 39: this.ship.reactorLeftOff(); break;
				}
			}
		}
	});
});
