// A shell is a set of genes which control roughly what Dawkins called
// flare, spire and verm, as discussed in Climbing Mount Improbable. 
// There are other genes which modify the behaviour of these.
// It's modeled around the idea of a spiraling tube. The genes determine how the 
// spiral unfolds, and at each stop, draws a given pattern (circle, or others).
// The naming comes from the original code
// - pattern: string which says what shape will be repeated and distorted
// - opening: called "flare" in the book, determines the speed at which the tube's diameter expands
// - displacement: called "verm" in the book, determines how close together the tube's whorls are
// - translation: called "spire" in the book, determines how much the tube piles on itself (the height)
// - coarsegraininess: how often is the pattern repeated along the spiral
// - reach: how much the spiral coils
// - handedness: wether the shells faces left or right
// - shape: how much the shell pattern gets distorted
// - translationGradient: modifies the translation's "easing"
// Additionally, we pass in an HTML5 canvas context, and width and height of the canvas
// The genes are optional (you'll get a random shell). 

var Rainbow = require('rainbowvis.js');

(function() {

	if (typeof module === "undefined") {
		self.Shell = Shell
	}
	else {
		var _ = require('lodash')
		module.exports = Shell
	}

	function Shell (ctx, width, height, genes) {

		this.canvasWidth = width
		this.canvasHeight = height

		this.centre = { x: Math.round(this.canvasWidth/2), y: Math.round(this.canvasHeight/2) }
		this.origin = _.cloneDeep(this.centre)

		// How much and how often the genes mutate is set per shell
		// as it was in the original code
		this.mutProbGene = 10
		this.mutSize = {
			displacement: 0.2,
			translation: 0.8,
			shape: 1,
			reach: 1
		}

		this.segments = []
		this.nbSegments = 0
		this.ctx = ctx

		this.type = 'shell'

		if (genes) {
			_.extend(this, genes)
			this.generate()
		}
		else {
			this.randomize()
		}
	}

	Shell.prototype.randomize = function () {

		_.extend(this, Shell.randomGenes())
		this.generate()
	}

	Shell.prototype.resetCentre = function () {

		this.centre = _.cloneDeep(this.origin)
	}

	// This produces a random set of genes which have visually
	// pleasing characteristics (most of the time)
	// Each shape has a different set of boundaries to make them look better
	Shell.randomGenes = function () {

		var basicSnail = {
			opening: _.random(1.5, 6.50, true),
			displacement: _.random(0, 0.1, true),
			shape: _.random(0.8, 1.8, true),
			translation: _.random(0, 4, true),
			coarsegraininess: _.random(4, 8),
			reach: _.random(3, 5, true),
			pattern: "circle",
			handedness: _.sample([1, -1]),
			translationGradient: 1,
		}

		var Babylon = {
			opening: _.random(100, 1000, true),
			displacement: _.random(0, 0.25, true),
			shape: _.random(2, 5, true),
			translation:_.random(0, 0.3, true),
			coarsegraininess: _.random(1.5, 3),
			reach: _.random(2, 3),
			pattern: "babylon",
			handedness: _.sample([1, -1]),
			translationGradient: _.random(1, 8),
		}

		var Angel = {
			opening: _.random(100, 1000, true),
			displacement: _.random(0, 0.25, true),
			shape: _.random(2, 5, true),
			translation:_.random(0, 0.3, true),
			coarsegraininess: _.random(1, 2.5),
			reach: _.random(2, 3),
			pattern: "angel",
			handedness: _.sample([1, -1]),
			translationGradient: _.random(1, 8),
		}

		var Oyster = {
			opening: _.random(100, 1000, true),
			displacement: _.random(0, 0.2, true),
			shape: _.random(2, 5, true),
			translation: _.random(0, 1.5, true),
			coarsegraininess: _.random(3, 4, true),
			reach: _.random(2, 3, true),
			pattern: "oyster",
			handedness: _.sample([-1, 1]),
			translationGradient: _.random(0.5, 1.5, true),
		}

		// BIVALVE AND BRACHIOPOD _.random
		var Bivalve = {
			opening: _.random(20, 1000, true),
			displacement: _.random(0, 0.25, true),
			shape: _.random(1.5, 4, true),
			translation:_.random(0, 0.3, true),
			coarsegraininess: _.random(1.5, 3),
			reach: _.random(2.2, 4, true),
			pattern: "circle",
			handedness: _.sample([1, -1]),
			translationGradient: _.random(1, 5, true),
		}

		var Cone = {
			opening: _.random(1.3, 5, true),
			displacement: _.random(0, 0.5, true),
			shape: _.random(1, 5, true),
			translation: _.random(2.5, 4.5, true),
			coarsegraininess: _.random(2, 5, true),
			reach: _.random(2, 7, true),
			pattern: "whelk",
			handedness: _.sample([-1, 1]),
			translationGradient: 1,
		}

		var Scallop = {
			opening: _.random(100, 1000, true),
			displacement: 0,
			shape: _.random(1, 6, true),
			translation: _.random(0, 1, true),
			coarsegraininess: _.random(2, 3.5, true),
			reach: 3,
			pattern: "scallop",
			handedness: _.sample([-1, 1]),
			translationGradient: _.random(0, 2, true),
		}

		var Eloise = {
			opening: _.random(1.3, 2.5, true),
			displacement: _.random(0, 0.3, true),
			shape: _.random(1.5, 2, true),
			translation: _.random(1.5, 3, true),
			coarsegraininess: _.random(2.5, 5, true),
			reach: _.random(2, 5, true),
			pattern: "eloise",
			handedness: _.sample([-1, 1]),
			translationGradient: _.random(1, 1.5, true),
		}

		var Gallaghers = {
			opening: _.random(1.4, 2, true),
			displacement: _.random(0, 0.1, true),
			shape: _.random(1.4, 2, true),
			translation: _.random(2, 6, true),
			coarsegraininess: _.random(3, 5, true),
			reach: _.random(3, 6, true),
			pattern: "gallaghers",
			handedness: _.sample([-1, 1]),
			translationGradient: _.random(0.5, 1, true),
		}

		var Rapa = {
			opening: _.random(1.4, 6, true),
			displacement: _.random(0, 0.12, true),
			shape: _.random(1.8, 2.7, true),
			translation: _.random(0.1, 2.6, true),
			coarsegraininess: _.random(3, 6, true),
			reach: 9,
			pattern: "rapa",
			handedness: _.sample([-1, 1]),
			translationGradient: _.random(0.8, 1.5, true),
		}

		var Lightning = {
			opening: _.random(1.4, 2.2, true),
			displacement: _.random(0, 0.3, true),
			shape: _.random(2.5, 5, true),
			translation: _.random(2, 4.5, true),
			coarsegraininess: _.random(3, 6, true),
			reach: _.random(2, 6, true),
			pattern: "lightning",
			handedness: _.sample([-1, 1]),
			translationGradient: _.random(0.8, 1.2, true),
		}

		var Fig = {
			opening: _.random(1.5, 4, true),
			displacement: _.random(0, 0.1, true),
			shape: _.random(2, 4, true),
			translation: _.random(0, 4, true),
			coarsegraininess: _.random(2, 4, true),
			reach: _.random(3, 8, true),
			pattern: "tun",
			handedness: _.sample([-1, 1]),
			translationGradient: _.random(0.9, 1.1, true),
		}

		var RazorShell = {
			opening: _.random(100, 1000, true),
			displacement: -0.15,
			shape: _.random(4, 6, true),
			translation: _.random(4, 6.2, true),
			coarsegraininess: _.random(2, 3, true),
			reach: _.random(1, 3, true),
			pattern: "razor",
			handedness: _.sample([-1, 1]),
			translationGradient: 1,
		}

		var JapaneseWonder = {
			opening: _.random(1.4, 2, true),
			displacement: _.random(-0.2, 0.05, true),
			shape: _.random(1, 3, true),
			translation: _.random(3.5, 6, true),
			coarsegraininess: _.random(2, 5, true),
			reach: _.random(6, 10, true),
			pattern: "wonder",
			handedness: _.sample([-1, 1]),
			translationGradient: _.random(0.9, 1.2, true),
		}

		//Babylon and Angel aren't used because they're very similar to Bivalves
		return _.sample([basicSnail, Oyster, Bivalve, Cone, Scallop, Eloise, Gallaghers, Rapa, Lightning, Fig, RazorShell, JapaneseWonder])
	}

	// This is a hash of patterns. Each shape is a set of 2D coordinates relative to the first point.
	// There are also w and h which are the original height and width of the shape (to allow scaling)
	// These patterns can be used instead of circles to draw the shells.
	Shell.patterns = {
		whelk: {points:[[0.22100000000000364,793.123],[79.92,-101.91],[103.64,-230.23],[61.47,-328.6],[91.36,-484.13],[132.64,-522.82],[132.64,-530.73],[169.55,-565.84],[175.71,-565.84],[264.44,-655.47],[361.13,-708.19],[415.59,-793.44],[492.93,-774.98],[499.94,-718.73],[558.82,-637.91],[624.73,-571.11],[637.91,-565.84],[673.02,-445.48],[649.29,-302.24],[594.84,-224.05],[552.66,-180.99],[545.65,-180.15],[504.31,-138.81],[235.44,3.53],[216.99,52.72],[181.88,-8.8],[97.53,-31.63]],w:673.02,h:846.16},
		wonder: {points:[[318.977,-0.3160000000000025],[-59.25,58.5],[-119.25,123.75],[-185.25,245.25],[-209.25,287.25],[-244.5,390],[-269.25,576],[-276,739.5],[-288,779.25],[-318.75,845.25],[-194.25,836.25],[-142.5,821.25],[-120.75,804],[-98.25,776.25],[-53.25,704.25],[15,615.75],[75,537.75],[135,440.25],[195.75,333.75],[249.75,243.75],[284.25,177],[307.5,144],[307.5,134.25],[294,121.5]],w:626.25,h:845.25},
		rapa: {points:[[215.622,22.551000000000002],[30.43,12.48],[83.49,60.09],[83.49,91.3],[72.57,120.95],[29.65,185.72],[-35.89,262.97],[-71.79,355.82],[-88.95,378.45],[-88.95,480.67],[-83.49,493.15],[-88.95,535.29],[-131.87,618],[-144.36,636.73],[-161.52,666.38],[-186.5,726.46],[-209.9,797.48],[-216.93,810.74],[-184.93,822.38],[-120.17,815.42],[-95.98,781.09],[-88.96,741.29],[-66.71,720.23],[-35.12,640.63],[-17.94,624.25],[-17.94,593.03],[-30.43,575.87],[7.02,564.16],[32.77,545.44],[52.28,554.01],[62.42,527.49],[97.54,515.78],[125.63,536.07],[125.63,505.64],[159.96,490.81],[191.95,504.08],[187.14,476.38],[221.61,460.38],[252.04,475.21],[247.36,447.12],[277.79,419.81],[301.98,426.83],[288.71,411.19],[319.14,380.79],[344.11,378.45],[330.44,366.56],[354.26,335.53],[372.99,343.34],[361.28,326.17],[372.99,269.99],[398.74,271.55],[378.45,240.34],[379.23,228.63],[404.2,230.97],[381.57,205.22],[379.23,188.05],[404.2,185.72],[373.77,170.89],[368.3,151.38],[386.25,142.8],[362.06,135.77],[348.02,120.95],[360.5,99.1],[340.21,110.8],[323.05,95.98],[330.85,71.01],[308.22,81.94],[296.52,49.94],[263.74,53.06],[246.58,47.6],[244.24,30.44],[217.7,36.68],[198.98,25.75],[197.42,4.69],[181.81,12.49],[161.52,11.71],[131.09,0],[115.49,-22.87],[100.66,-11.7]],w:621.12,h:845.25},
		tun: {points:[[130.995,-0.3160000000000025],[27.8,22.93],[52.02,40.59],[66.37,65.98],[66.37,134.14],[47.53,191.55],[10.76,247.16],[-24.22,282.13],[-52.92,318.91],[-63.69,339.54],[-71.75,348.51],[-66.38,498.29],[-66.38,696.51],[-85.21,750.32],[-97.77,787.1],[-113.02,807.73],[-119.29,824.77],[-130.95,839.12],[-130.95,845.25],[-109.42,837.32],[-98.66,829.25],[-47.54,819.39],[-32.29,809.52],[-1.8,786.2],[33.18,754.81],[90.59,702.79],[161.44,622.96],[198.22,579.91],[229.6,544.93],[286.11,447.17],[314.81,361.06],[324.68,296.49],[310.33,194.24],[291.49,139.53],[254.72,101.85],[241.27,96.48],[214.36,71.36],[166.82,47.14],[96.87,17.55],[50.23,4.99]],w:455.63,h:845.25},
		gallaghers: {points:[[294.727,-0.0660000000000025],[-60.75,60],[-95.25,122.25],[-109.5,163.5],[-138.75,192],[-157.5,237],[-177,259.5],[-181.5,317.25],[-169.5,409.5],[-174,553.5],[-194.25,615],[-229.5,648],[-243,674.25],[-261.75,717],[-277.5,775.5],[-295.5,796.5],[-295.5,806.25],[-270.75,798],[-219.75,818.25],[-193.5,840.75],[-177,840.75],[-127.5,787.5],[-122.25,774.75],[-102.75,756.75],[-60,733.5],[-30,725.25],[-17.25,719.25],[18.75,684.75],[66,666.75],[83.25,649.5],[127.5,501.75],[143.25,486.75],[143.25,473.25],[135.75,462.75],[162,445.5],[162,413.25],[149.25,402],[150,354],[167.25,337.5],[167.25,312.75],[155.25,299.25],[155.25,288],[167.25,264],[161.25,233.25],[144.75,223.5],[117.75,184.5],[113.25,164.25],[97.5,153],[75.75,84],[69,71.25],[48,49.5],[39.75,23.25],[24,6.75]],w:462.75,h:840.75},
		eloise: {points:[[353.773,-0.09300000000001774],[18.16,70.68],[5.19,211.68],[-19.9,284.34],[-58.82,345.76],[-143.6,455.62],[-226.64,516.17],[-298.44,586.24],[-323.52,642.46],[-341.69,658.9],[-354.66,690.91],[-340.82,740.55],[-269.03,816.34],[-183.39,838.83],[-141,844.29],[-83.91,826.71],[0,780],[49.3,741.72],[132.34,639],[167.81,534.34],[185.11,412.37],[185.11,359.6],[172.13,254.07],[150.51,154.59],[130.62,104.41],[111.59,74.14],[64.01,25.69],[29.41,10.13]],w:539.78,h:844.29},
		scallop: {points:[[-0.35900000000000887,293.629],[22.83,-34.26],[110.72,-58.88],[123.89,-71.16],[163.43,-161.69],[186.26,-185.41],[205.61,-209.14],[251.26,-232.86],[314.53,-267.13],[337.41,-278.56],[427.88,-292.59],[463.93,-293.49],[601.01,-266.23],[695.9,-202.13],[737.18,-165.22],[779.36,-114.24],[846.15,31.64],[846.15,212.62],[791.64,374.32],[715.2,452.5],[702.02,470.05],[568.48,548.29],[504.32,554.41],[417.33,554.41],[285.54,541.23],[241.62,513.13],[204.72,475.33],[159.9,412.96],[126.53,354.97],[109.82,337.41],[28.1,300.51],[22.83,288.17],[0,265.34]],w:846.15,h:847.89},
		lightning: {points:[[144.80399999999997,-0.8640000000000043],[11.7,22.63],[15.61,37.45],[0,87.39],[-24.97,107.68],[-49.16,150.6],[-67.1,181.03],[-84.27,197.41],[-84.27,216.93],[-79.59,235.65],[-97.53,260.62],[-104.56,314.45],[-104.56,337.09],[-80.37,379.22],[-80.37,433.84],[-117.82,551.66],[-132.65,614.87],[-145.13,789.66],[-145.13,847.39],[-133.43,835.7],[-112.36,841.16],[-87.39,832.57],[-78.81,815.4],[-71.78,717.87],[-43.69,604.72],[5.47,479.09],[23.41,448.66],[101.44,371.41],[124.85,329.27],[161.53,281.68],[179.47,189.6],[190.4,122.5],[190.4,79.58],[166.99,60.07],[153.72,65.53],[138.9,49.93],[93.64,35.88],[28.09,0]],w:335.53,h:847.39},
		razor: {points:[[175.09900000000005,-0.09500000000001307],[23.72,19.82],[47.45,106.81],[69.8,233.34],[81.72,358.49],[93.53,582.55],[93.53,781.63],[82.66,799.39],[63.89,816.84],[51.34,823.8],[15.82,836.29],[-20.77,846.52],[-63.27,846.15],[-79.08,832.96],[-93.63,813.57],[-110.4,779.94],[-123.26,748.31],[-134.81,706.13],[-145.98,652.46],[-157.53,574.33],[-166.07,519.29],[-175.35,431.04],[-175.66,251.42],[-169.39,202.34],[-156.53,142.02],[-143.34,104.8],[-128.22,86.04],[-122.94,73.49],[-110.4,67.9],[-104.81,61.31],[-54.09,54.72],[-29.37,42.17],[-8.59,20.77],[-2.32,9.28]],w:269.19,h:846.52},
		babylon: {points:[[261.341,17.070999999999984],[-21.07,23.41],[-34.33,28.09],[-148.26,245.8],[-224.73,407.32],[-243.45,444.77],[-262.18,500.18],[-262.18,531.39],[-252.04,648.43],[-218.49,715.54],[-172.45,763.14],[-117.05,799.03],[43.69,827.13],[81.15,827.13],[170.1,802.16],[321.48,699.93],[409.66,613.32],[455.7,494.71],[462.72,390.93],[451.01,335.53],[403.42,239.55],[351.14,169.33],[280.13,96.76],[266.08,89.73],[240.34,70.23],[213.8,47.6],[146.7,7.02],[109.24,-11.7],[84.27,-17.16],[60.09,-10.14]],w:724.9,h:844.29},
		oyster: {points:[[-0.46699999999998454,42.03999999999998],[39.01,41.36],[73.34,71.01],[81.93,92.07],[110.8,120.17],[137.33,135.77],[175.57,172.44],[205.22,201.32],[231.75,245.8],[240.33,275.44],[236.43,328.51],[203.66,432.29],[175.57,470.52],[145.13,528.26],[126.41,548.55],[101.44,578.98],[71.79,658.58],[88.95,681.2],[95.98,715.53],[84.27,767.82],[66.33,789.66],[66.33,799.03],[108.46,802.16],[230.97,778.74],[317.58,690.57],[348.8,643.75],[414.34,522.8],[442.43,419.8],[461.16,327.72],[451.02,245.01],[419.02,177.91],[390.15,137.34],[354.26,111.58],[295.74,53.84],[177.91,0],[103.78,-29.65],[60.86,-42.13],[34.33,-35.11],[14.04,-18.72]],w:461.16,h:844.29},
		angel: {points:[[582.789,-0.09300000000001774],[-24.22,23.09],[-57.09,47.32],[-179.06,119.98],[-246.53,161.5],[-286.32,185.72],[-377.16,252.32],[-447.22,318.07],[-508.64,375.16],[-519.02,379.48],[-559.68,468.58],[-583.03,530.86],[-576.11,630.34],[-532.86,708.19],[-438.57,804.21],[-352.07,844.29],[-136.68,844.29],[-6.06,820.64],[84.77,765.29],[162.62,686.57],[229.23,610.44],[262.97,506.64],[262.97,400.24],[237.88,303.36],[184.25,207.34],[132.34,139.01],[101.21,104.4]],w:846,h:844.29},
	}

	// To draw the shell, we first have to generate all the bounding boxes along
	// the spiral. The pattern is then scaled to fit these boxes and drawn
	// Width and height are optional and useful if the canvas has changed size
	Shell.prototype.generate = function (width, height) {

		if (width && height) {

			this.canvasWidth = width
			this.canvasHeight = height

			this.origin.x = Math.round(width/2)
			this.origin.y = Math.round(height/2)
		}

		this.resetCentre()

		this.segments = []

		// The variable naming comes from the original problem
		// Must admit, not everything is clear to me at the moment
		var size = 0.8
		var denom = 136 * size
		var r = 3
		var rad = 100
		var mnx = Math.round(-(100 / denom) * this.centre.x * 1.088)
		var mny = Math.round(-(100 / denom) * this.centre.y * 1.088)
		var rad1 = 1.088 * (rad + rad * this.displacement) / 2
		var rad2 = 1.088 * (rad - rad * this.displacement) / 2
		var start = this.reach * 360 // constant
		var m = start // gets altered on every turn of the loop

		var p, fw, t, i, grunge, xc, yc, xr, yr, h, g, f, k
		var lastH, lastG, lastF, lastK

		// Overview: m is based on the reach, so the number of rotation the spiral will do
		// m is altered on every turn of the loop by removing the coarsegraininess
		// This basically defines how many points we're covering on the spiral
		// This loop builds all the boxes along the spiral with the right amount of
		// distortion and sizing to produce the nice depth effect

		while (m >= 0) {

			p = (start - (start - m) * (1 - this.translationGradient)) / start
			t = this.translation * p
			
			i = m / 360
			fw = Math.exp(-i * Math.log(this.opening))
			grunge = fw * Math.cos(2 * Math.PI * i)

			xc = this.handedness * (rad1 * grunge)
			yc = -rad1 * t * (1 - fw)
			xr = this.handedness * (rad2 * grunge)
			yr = -rad2 * fw * this.shape // the minus signs are to invert the whole snail

			// We use rounded coordinates to make canvas happier
			h = Math.round(yc - yr - mny)
			g = Math.round(xc - xr - mnx)
			f = Math.round(yc + yr - mny)
			k = Math.round(xc + xr - mnx)

			// There seem to be a lot of repetition at the beginning of the algorithm
			// This skips the same boxes which would be drawn over
			// TODO: ensuite the surface is worth drawing at all!
			if (lastH !== h || lastG !== g || lastF !== f || lastK !== k) {
				this.segments.push({ startX: g, startY: f, endX: k, endY: h })

				lastH = h
				lastG = g
				lastF = f
				lastK = k
			}
			
			m = m - this.coarsegraininess
		}

		this.nbSegments = this.segments.length

		this.setBoundingBox() // Calculate top/bottom

		this.translate(this.horizontalOffset(), this.verticalOffset()) // recentre shell
		
		this.scaleToBox(0.8) // Make sure the shell fits in the box
	}

	// Stretches a shape to make it fit in a rectangle of w x h
	// invert = -1 or 1 to invert the coordinates (handedness)
	Shell.scaleToRect = function (shape, w, h, invert) {

		// Calculate ratios of sizeWeWant/sizeItWas
		var wRatio = w/shape.w
		var hRatio = h/shape.h

		// Scale every point in the shape by the the ratios (creates a new array)
		return _.map(shape.points, function (p) {
			return [p[0] * wRatio * invert, p[1] * hRatio]
		})
	}

	Shell.prototype.verticalOffset = function () {

		var top = this.centre.y - this.box.top
		var bottom = this.box.bottom - this.centre.y

		return (top - bottom)/2
	}

	Shell.prototype.horizontalOffset = function () {

		var left = this.centre.x - this.box.left
		var right = this.box.right - this.centre.x

		return (left - right)/2
	}

	Shell.prototype.scaleToBox = function (ratio) {

		if (this.box.width > this.canvasWidth * ratio || this.box.height > this.canvasHeight * ratio) {
			var scale = Math.min((this.canvasWidth * ratio)/this.box.width, (this.canvasHeight * ratio)/this.box.height)
			this.scale(scale)
			this.translate(this.origin.x * (1 - scale), this.origin.y * (1 - scale))
			
			this.setBoundingBox()
		}
	}

	Shell.prototype.scale = function (scale) {

		this.centre.x = this.centre.x * scale
		this.centre.y = this.centre.y * scale

		var segment

		for (var i = 0; i < this.segments.length; i++) {
			segment = this.segments[i]

			segment.startX = segment.startX * scale
			segment.startY = segment.startY * scale
			segment.endX = segment.endX * scale
			segment.endY = segment.endY * scale
		}
	}

	Shell.prototype.translate = function (offsetX, offsetY) {

		var segment

		this.centre.x += offsetX
		this.centre.y += offsetY

		for (var i = 0; i < this.segments.length; i++) {
			segment = this.segments[i]

			segment.startX += offsetX
			segment.startY += offsetY
			segment.endX += offsetX
			segment.endY += offsetY
		}
	}

	// Calculates the width/height and corner coordinates of the shell
	// Useful to place multiple shells on a single canvas
	Shell.prototype.setBoundingBox = function () {

		var segment
		var box = {
			left: Math.min(this.segments[0].startX, this.segments[0].endX),
			top: Math.min(this.segments[0].startY, this.segments[0].endY),
			right: Math.max(this.segments[0].startX, this.segments[0].endX),
			bottom: Math.max(this.segments[0].startY, this.segments[0].endY),
		}

		for (var i = 0; i < this.segments.length; i++) {
			segment = this.segments[i]

			if (segment.startX < box.left) {
				box.left = segment.startX
			}
			if (segment.startY < box.top) {
				box.top = segment.startY
			}
			if (segment.startX > box.right) {
				box.right = segment.startX
			}
			if (segment.startY > box.bottom) {
				box.bottom = segment.startY
			}

			if (segment.endX < box.left) {
				box.left = segment.endX
			}
			if (segment.endY < box.top) {
				box.top = segment.endY
			}
			if (segment.endX > box.right) {
				box.right = segment.endX
			}
			if (segment.endY > box.bottom) {
				box.bottom = segment.endY
			}
		}

		box.width = box.right - box.left
		box.height = box.bottom - box.top

		this.halfWidth = box.width/2
		this.halfHeight = box.height/2

		this.box = box
	}

	// For each box generated, this has to be called to draw the pattern
	// with the right dimensions
	Shell.prototype.drawPattern = function (segment, index) {

		// Height and width for the box
		// Generates a box and center coord of that box
		var w = Math.abs(segment.endX - segment.startX)
		var h = Math.abs(segment.endY - segment.startY)
		var rX = w/2
		var rY = h/2

		var thinThreshold = Math.floor(this.segments.length * 7 / 8)
		var thin = (w < 20 || h < 20)

		// If the box is too small we're going to draw an ellipse or a line
		// whatever the original pattern we've decided (it would be too small to tell)

		if (this.pattern === "circle" || (index < thinThreshold && thin)) {

			// If there's no width, let's draw a line!
			if (w === 0) {
				this.ctx.moveTo(segment.startX, segment.startY)
				this.ctx.lineTo(segment.endX, segment.endY)
			}
			else {

				// From http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas
				var x = Math.min(segment.startX, segment.endX)
				var y = Math.min(segment.startY, segment.endY)
				var kappa = .5522848,
				ox = rX * kappa, // control point offset horizontal
				oy = rY * kappa, // control point offset vertical
				xe = x + w, // x-end
				ye = y + h, // y-end
				xm = x + w / 2, // x-middle
				ym = y + h / 2; // y-middle

				this.ctx.moveTo(x, ym)
				this.ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y)
				this.ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym)
				this.ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye)
				this.ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym)
			}
		}
		else {

			// Getting the scaled pattern points
			var invert = segment.endX < segment.startX ? -1 : 1
			var points = Shell.scaleToRect(Shell.patterns[this.pattern], w, h, invert)
			
			// We're drawing the chosen pattern stretched to fit a box point to point

			points[0] = [segment.startX + points[0][0], segment.startY + points[0][1]]

			this.ctx.moveTo(points[0][0], points[0][1])

			for (var i = 1; i < points.length; i++) {
				this.ctx.lineTo(points[0][0] + points[i][0], points[0][1] + points[i][1])
			}

			this.ctx.closePath()
		}
	}

	Shell.prototype.getRandomGradient = function() {
		const colorPairs = [
			["#ffc66d", "#fc7464"],
			["#1ca6f1", "#09eeb1"],
			["#ea6fcc", "#8d72ee"],
			["#86f4ba", "#90d9ea"]
		]
		var gradient = new Rainbow();
		gradient.setNumberRange(1, this.nbSegments);
		var chosenPair = colorPairs[Math.floor(Math.random() * colorPairs.length)]
		gradient.setSpectrum(chosenPair[0], chosenPair[1]);
		return gradient
	}

	Shell.prototype.draw = function (lofi) {
		// Create gradient
		var gradient = this.getRandomGradient();
		this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
		var step = lofi ? 2 : 1

		this.ctx.beginPath()

		for (var i = 0; i < this.nbSegments; i = i+step) {
			this.ctx.beginPath();
			this.ctx.strokeStyle = `#${gradient.colorAt(i)}bb`
			this.drawPattern(this.segments[i], i)
			this.ctx.stroke()
			this.ctx.closePath()
		}

	}

	// Opening is a logarithmic value so it has its own
	// function to mutate it which converts it to meaningful values
	Shell.mutateOpening = function (opening) {
		
		var mutSize = 0.4
		var logged = Math.log(opening)
		var logchanged = logged + mutSize * _.sample([-1, 1])

		if (logchanged > 20) {
			logchanged = 20
		}

		var m = Math.exp(logchanged)

		if (m < 1) {
			m = 1
		}

		return m
	}

	Shell.prototype.getGenes = function () {
		return _.cloneDeep(_.pick(this, ['pattern', 'shape', 'displacement', 'translation', 'translationGradient', 'opening', 'handedness', 'reach', 'coarsegraininess', 'mutSize', 'mutProbGene']))
	}

	// The breeding process is relatively straighforward compared to the rest
	// It looks at each gene and rolls a D100. If it's under the probability, then
	// the gene will mutate by a factor of the mutSize
	// The original program's mutations were pretty limited, so to accentuate them
	// we've added more parameters and a higher size mutation
	Shell.prototype.breed = function () {

		var child = this.getGenes()

		if (_.random(0, 100) < child.mutProbGene) {
			child.opening = Shell.mutateOpening(child.opening)
		}

		if (_.random(0, 100) < child.mutProbGene) {
			child.displacement += _.random(-2, 2) * child.mutSize.displacement
			child.displacement = Math.min(Math.max(child.displacement, 0), 1)
		}

		if (_.random(0, 100) < child.mutProbGene) {
			child.translation += _.random(-2, 2) * child.mutSize.translation
		}

		if (_.random(0, 100) < 1) {
			child.handedness = -child.handedness
		}

		// These three are in addition to the original program and offer a 
		// little more visual variety

		if (_.random(0, 100) < child.mutProbGene) {
			child.shape += _.sample([-1, 1]) * child.mutSize.shape
		}

		if (_.random(0, 100) < child.mutProbGene) {
			child.reach += _.sample([-1, 1]) * child.mutSize.reach
		}

		if (_.random(0, 100) < 5) {
			child.pattern = _.sample(_.keys(Shell.patterns))
		}

		this.children.push(new Shell(this.ctx, this.canvasWidth, this.canvasHeight, child))

		return this.children[this.children.length - 1]
	}
})()