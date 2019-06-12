'use strict'
let win = nw.Window.get()
win.x = 0
showDevTools()

let cv = document.createElement('canvas')
cv.width = canvas_width
cv.height = canvas_height
document.body.appendChild(cv)
let context = cv.getContext('2d')

let agent, board, p_epsilon
function setup() {
	board = new Board(5, 5)
	agent = new Agent(0, 0, board)
	
	board.setr(2,0,-1)
	board.setr(2,1,-1)
	board.setr(2,2,-1)
	board.setr(2,3,-1)
	
	board.setr(4,0,1)
	
	p_epsilon = document.createElement('p')
	document.body.appendChild(p_epsilon)
	p_epsilon.innerHTML = `eps = ${learning.epsilon.toFixed(2)}`
	context.font = default_font
	context.textAlign = 'center'
	context.textBaseline = 'middle'
	draw(context)
	
	window.requestAnimationFrame(loop)
}

let step = 0
function update(steps = stepsPerTick) {
	for(let i = 0; i < steps; i++) {
		let action = floor(rnd() * board.numberOfActions)
		agent.update(action, learning.epsilon)
		step++
	}
}

function draw(context) {
	context.clearRect(0, 0, cv.width, cv.height)
	board.draw(context)
	agent.draw(context)
	p_epsilon.innerHTML = `eps = ${learning.epsilon.toFixed(2)}|step = ${step}`
}

let lastRender = 0
function loop(timestamp) {
  var progress = timestamp - lastRender
	if(isPlay) {
		update()
		draw(context)
	}
  lastRender = timestamp
  window.requestAnimationFrame(loop)
}

setup()