class Board {
	constructor(x, y, numberOfActions = 4) {
		this.size = {x, y}
		this.Q = []
		this.numberOfActions = numberOfActions
		for(let i = 0; i < x * y; i++) {
			this.Q.push(new Array(numberOfActions).fill(0))
		}
		this.wall = new Array(x * y).fill(false)
		this.R = new Array(x * y).fill(0)
		
		this.cellSize = 100
		this.offset = new Vector(0, 0)
	}
	
	checkPos(pos) {
		return this.checkCoords(pos.x, pos.y)
	}
	
	checkCoords(x, y) {
		if((x >= this.size.x) || (y >= this.size.y) 
			|| (x < 0) || (y < 0)) {
			return false
		}
		let index = this.getIndexWithoutCheck(x, y)
		if(this.wall[index] == true) {
			return false
		}
		return true
	}
	
	getIndexWithoutCheck(x, y) {
		return y * this.size.x + x
	}
	
	getIndex(x, y) {
		if(this.checkCoords(x, y) == false) {
			throw new Error("checkCoords(x, y) == false")
		}
		return y * this.size.x + x
	}
	
	getr(x, y) {
		let index = this.getIndex(x, y)
		return this.R[index]
	}
	
	setr(x, y, value) {
		let index = this.getIndex(x, y)
		this.R[index] = value
		return true
	}
	
	getq(x, y, action) {
		let index = this.getIndex(x, y)
		return this.Q[index][action]
	}
	
	setq(x, y, action, value) {
		let index = this.getIndex(x, y)
		this.Q[index][action] = value
		return true
	}
	
	getMaxAction(state) {
		let max_q = this.getq(state.x, state.y, 0)
		let max_action = 0
		for(let action = 1; action < this.numberOfActions; action++) {
			let current_q = this.getq(state.x, state.y, action)
			if(current_q > max_q) {
				max_q = current_q
				max_action = action
			}
		}
		return max_action
	}
	
	getMaxqValue(state) {
		let max_q = this.getq(state.x, state.y, 0)
		for(let action = 1; action < this.numberOfActions; action++) {
			let current_q = this.getq(state.x, state.y, action)
			if(current_q > max_q) {
				max_q = current_q
			}
		}
		return max_q
	}
	
	resetReward(value = 0) {
		for(let state = 0; state < this.R.length; state++) {
			this.R[state] = value
		}
	}
	
	resetq(value = 0) {
		for(let state = 0; state < this.Q.length; state++) {
			for(let action = 0; action < this.numberOfActions; action++) {
				this.Q[state][action] = value
			}
		}
	}
	
	draw(c) {
		let [cellSize, offset, size] = [this.cellSize, this.offset, this.size]
		c.fillStyle = 'rgb(200, 200, 200)'
		c.fillRect(offset.x, offset.y, cellSize * size.x, cellSize * size.y)
		drawGrid(this, c, offset, size, cellSize)
	}
}

class Agent {
	constructor(x, y, board) {
		this.pos = new Vector(x, y)
		this.board = board
	}
	
	move(dx, dy) {
		let dpos
		if(rnd() < prob_move) {
			dpos = new Vector(dx, dy)
		} else
		if(rnd() < 1.0) {
			// left(x, y) = (y, -x)
			dpos = new Vector(dy, -dx)
		} else {
			// right(x, y) = (-y, x)
			dpos = new Vector(-dy, dx)
		}
		
		if(this.pos.x == 1) {
			prob_move = 1.0
		}

		if(this.pos.x == 3) {
			prob_move = 0.0
		}
		
		let new_pos = this.pos.add(dpos)
		
		if(this.pos.equal(portal_pos) && rnd() < prob_portal) {
			new_pos = portal_dest
		}
		if(this.board.checkPos(new_pos)) {
			this.pos = new_pos
			return true
		} else {
			return false
		}
	}
	
	update(input_action, eps = 1.0) {
		let last_state = this.pos.copy()
		let last_action
		// жадный выбор
		// цель человека обучить, цель Q-функции заработать награду
		// eps = 1 => выбор тактики обучения(input_action), eps = 0 => выбор тактики применения(max Q-функции)
		if(rnd() < eps) {
			// тактика обучения
			last_action = input_action
		} else {
			// тактика применения
			last_action = board.getMaxAction(last_state)
		}
		
		let [dx, dy] = [actions_list[last_action].x, actions_list[last_action].y]
		let isMove = this.move(dx, dy)
		let state = this.pos.copy()
		let reward = board.getr(last_state.x, last_state.y)
		if(rnd() < 1 - prob_reward) {
			reward = 0
		}
		// if( last_state.equal(state) ) {
			// reward -= 0.1
		// }
		
		
		let alpha = learning.alpha
		let gamma = learning.gamma// + (rnd()*2 - 1) * 0.1
		update_q(board, last_state, last_action, state, reward, alpha, gamma)
	}
	
	draw(c) {
		let x = this.pos.x, y = this.pos.y, sz = this.board.cellSize, offset = this.board.offset
		c.fillStyle = 'rgba(255, 255, 255, 0.5)'
		c.fillRect(offset.x + x*sz, offset.y + y*sz, sz, sz)
	}
}

function drawGrid(board, c, offset, size, cellSize) {
	c.beginPath()
	for(let i = 0; i < size.x; i++) {
		for(let j = 0; j < size.y; j++) {
			drawCross(c, offset.x + cellSize * i, offset.y + cellSize * j, cellSize)
		}
	}
	c.strokeStyle = 'rgb(150, 150, 150)'
	c.stroke()
	c.beginPath();
	// const actions_list = [new Vector(0, 1), new Vector(0, -1), new Vector(-1, 0), new Vector(1, 0)]
	for(let i = 0; i < size.x; i++) {
		for(let j = 0; j < size.y; j++) {
			let [x, y] = [offset.x + cellSize * i, offset.y + cellSize * j]
			c.strokeStyle = 'rgb(150, 150, 150)'
			c.strokeRect(x, y, cellSize, cellSize)
			c.font = bold_font
			
			let reward = board.getr(i, j)
			if(reward > 0) {
				c.fillStyle = 'rgba(0, 255, 0, 0.75)'
				c.fillText('+'+reward.toFixed(2), x + cellSize * 0.5, y + cellSize * 0.5)
			} else if(reward < 0) {
				c.fillStyle = 'rgba(255, 0, 0, 0.75)'
				c.fillText(reward.toFixed(2), x + cellSize * 0.5, y + cellSize * 0.5)
			}
			c.font = default_font
			for(let action = 0; action < board.numberOfActions; action++) {
				let q = board.getq(i, j, action)
				let color = floor(q * 200)
				if(color > 200) color = 200
				c.fillStyle = `rgb(0, ${color}, 0)`
				// c.fillStyle = 'rgb(0, 0, 0)'
				c.fillText(q.toFixed(2), x + cellSize * textPos[action].x, y + cellSize * textPos[action].y)
			}
		}
	}
}

function drawCross(c, x, y, size) {
	c.moveTo(x, y);
	c.lineTo(x + size, y + size);
	c.moveTo(x, y + size);
	c.lineTo(x + size, y);
}

function update_q(board, last_state, last_action, state, reward, alpha, gamma) {
	let max_q = board.getMaxqValue(state)
	let old_q = board.getq(last_state.x, last_state.y, last_action)
	let new_q = old_q * (1 - alpha) + (reward + gamma * max_q) * alpha
	board.setq(last_state.x, last_state.y, last_action, new_q)
	if(isDebug) {
		console.log(`old_q=${old_q}, new_q=${new_q}, max_q=${max_q}`)
		console.log(`last_state=(${last_state.x}, ${last_state.y}), last_action=${last_action}, 
		state=(${state.x}, ${state.y}), reward=${reward}`)
	}
}

function setLearningParam(name, value) {
	learning[name] = value
	if(learning[name] < 0) {
		learning[name] = 0
	} else
	if(learning[name] > 1) {
		learning[name] = 1
	}
}