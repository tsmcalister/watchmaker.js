var Canvas = require('canvas')
var fs = require('fs')

var Biomorph = require('../lib/biomorph')

var canvas = new Canvas(500, 500, 'pdf')
var ctx = canvas.getContext('2d')

var bio = new Biomorph(ctx, 500, 500)

bio.drawWithLines()

fs.writeFileSync('./biomorph.pdf', canvas.toBuffer())