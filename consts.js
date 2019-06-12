const canvas_width = 850
const canvas_height = 550

const floor = Math.floor
const rnd = Math.random
const actions_list = [new Vector(0, 1), new Vector(0, -1), new Vector(-1, 0), new Vector(1, 0)]
const ACTION = {
	DOWN: 0,
	UP: 1,
	LEFT: 2,
	RIGHT: 3,
}

const default_font = '12pt consolas'
const bold_font = 'bold 24px serif'

let isPlay = false
let isDebug = false

let stepsPerTick = 1000

let learning = {
	epsilon: 1.0,
	alpha: 0.01,
	gamma: 0.8,
}


let portal_pos = new Vector(4, 0)
let portal_dest = new Vector(0, 0)
let prob_portal = 1.0
let prob_reward = 1.0
let prob_move = 0.8

const textPos = [
	{x: 0.5, y: 0.85},
	{x: 0.5, y: 0.15}, 
	{x: 0.2, y: 0.5}, 
	{x: 0.8, y: 0.5}, 
]

const keyMap
= {
		32: 'space',
		68: 'right',
		65: 'left',
		87: 'up',
		83: 'down',
		27: 'esc',
		81: 'q',
		38: 'arrowup',
		40: 'arrowdown',
		82: 'r',
		107: '+',
		109: '-',
		46: 'delete',
	}
	
/* 		left(1, 0) = (0, -1)
		right(1, 0) = (0, 1)
		right(0, 1) = (-1, 0)
		left(0, 1) = (-1, 0)
		left(1, 1) = (1, -1) => (1, -1) = (a + b, c + d)
		left(1, -1) = (-1, -1) => (-1, -1) = (a - b, c - d)
		
		(1, -1) = (a + b, c + d)
		(-1, -1) = (a - b, c - d)
		c + d = c - d => d = 0, c = -1
		(1, -1) = (a + b, c)
		(-1, -1) = (a - b, c)
		 a = 0, b = 1
		
		left(x, y) = (a*x + b*y, c*x + d*y)
		
		left(x, y) = (y, -x)
		
		right(1, 0) = (0, 1)
		right(0, 1) = (-1, 0)
		right(x, y) = (a*x + b*y, c*x + d*y)
		
		right(x, y) = (-y, x)
		
		right(1, 0) = (0, 1) = (a=0, c=1)
		right(0, 1) = (-1, 0) = (b=-1, d=0)
		 */