var Draggable = require ('/dist/libs/nymove/draggable.js');

function movebar() {
	var container = document.getElementById('container'),
	element = document.getElementsByClassName('ball')[0],
	labelX = document.getElementsByClassName('cordx')[0],
	labelY = document.getElementsByClassName('cordy')[0];

// options
var options = {
	limit: container,
	setCursor: true,

	onDrag: function (element, x, y) {
		document.getElementById('cordx').value = x;
		document.getElementById('cordy').value = y;
		
	}
};
// initialize drag
new Draggable(element, options);
}
