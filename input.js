document.addEventListener('mousedown', function(e) {
	
})

document.addEventListener('keydown', function(e) {
	let key = keyMap[e.keyCode]
	// [new Vector(0, 1), new Vector(0, -1), new Vector(-1, 0), new Vector(1, 0)]
	if(key == 'down') {
		agent.update(0)
	} else 
	if(key == 'up') {
		agent.update(1)
	} else 
	if(key == 'left') {
		agent.update(2)
	} else 
	if(key == 'right') {
		agent.update(3)
	} else
	if(key == 'esc') {
		nw.App.quit()
	}	else
	if(key == 'space') {
		isPlay = !isPlay
	} else
	if(key == 'arrowup') {
		setLearningParam('epsilon', learning.epsilon + 0.1)
	} else
	if(key == 'arrowdown') {
		setLearningParam('epsilon', learning.epsilon - 0.1)
	} else
	if(key == 'r') {
		update(1)
	} else
	if(key == '+') {
		let [x, y] = [agent.pos.x, agent.pos.y]
		board.setr(x, y, board.getr(x, y) + 1)
	} else
	if(key == '-') {
		let [x, y] = [agent.pos.x, agent.pos.y]
		board.setr(x, y, board.getr(x, y) - 1)
	} else
	if(key == 'delete') {
		board.resetq()
	}

	draw(context)
	if(isDebug) {
		console.log(key, e.keyCode)
	}
})

document.addEventListener('keyup', function(e) {

})

document.body.addEventListener('contextmenu', (e) => { 
	e.preventDefault();
	return false;
});