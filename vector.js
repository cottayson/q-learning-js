class Vector {
	constructor(x, y) {
		this.x = x
		this.y = y
	}
	
	add(v) {
		return new Vector(this.x + v.x, this.y + v.y)
	}
	
	sub(v) {
		return new Vector(this.x - v.x, this.y - v.y)
	}
	
	scale(amount) {
		return new Vector(this.x * amount, this.y * amount)
	}
	
	get length() {
		return Math.hypot(this.x, this.y)
	}
	
	copy() {
		return new Vector(this.x, this.y)
	}
	
	equal(v) {
		return (this.x == v.x) && (this.y == v.y)
	}
}