var Biomorph = require('../../lib/biomorph')

var canvas = document.getElementById("canvas")
var wWidth = window.innerWidth
var wHeight = window.innerHeight

canvas.width = wWidth
canvas.height = wHeight

var ctx = canvas.getContext('2d')

var bio = new Biomorph(ctx, wWidth, wHeight)

bio.drawWithImages()

canvas.addEventListener('click', function () {

	bio.randomize()
	bio.drawWithImages()
})