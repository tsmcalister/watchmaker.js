var Canvas = require('canvas')
var fs = require('fs')

var Shell = require('../lib/shell')

var canvas = new Canvas(500, 500, 'pdf')
var ctx = canvas.getContext('2d')

var bio = new Shell(ctx, 500, 500)

bio.draw()

fs.writeFileSync('./shell.pdf', canvas.toBuffer())