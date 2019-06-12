function showDevTools() {
	nw.Window.get().showDevTools()
}

function log(obj) {
	p1.innerHTML = ''
	for(let arg of arguments) {
		if(typeof(arg) === 'string') {
			p1.innerHTML += arg
		} else {
			p1.innerHTML += JSON.stringify(arg)
		}
	}
}