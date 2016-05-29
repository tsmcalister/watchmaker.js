var Shell = require('../../lib/shell')

var canvas = document.getElementById("canvas")
var wWidth = window.innerWidth
var wHeight = window.innerHeight

canvas.width = wWidth
canvas.height = wHeight

var ctx = canvas.getContext('2d')

var bio = new Shell(ctx, wWidth, wHeight)

bio.draw()

canvas.addEventListener('click', function () {

	bio.randomize()
	bio.draw()
})