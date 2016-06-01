# Watchmaker.js

This is the library that composes the core of the [Climbing Mount Improbable](http://www.mountimprobable.com/) website. The aim is to provide modern tools to build Blind Watchmaker-style applications using Richard Dawkins' original algorithms.

The code is ported from Think Pascal 4.0, using the cleaned up source provided by Alan Canon.
Alan has produced high fidelity versions made for desktop use and ported the code to a more modern version of Pascal. You can get hold of his code on [SourceForge](https://sourceforge.net/p/watchmakersuite). 

The original sources (and compiler) used are included in this repository for comparison. A quick way to get into the code is to look for the `Biomorph` file (for both Monochrome and Snails). In there you'll find the `Develop` routine which generates all the lines, `DrawPic/DrawLine` which uses QuickDraw to draw the lines on screen and `Reproduce` which generates a possibly mutated offspring.

In the JavaScript version, `Develop` is called `generate` and `Reproduce` is called `breed`. The drawing part of the code currently works with HTML5 Canvas only and also works with [`node-canvas`](https://github.com/Automattic/node-canvas) for server-side apps. Because of HTML5 limitations and performance, the drawing methods aren't currently unified.

## Biomorph
A biomorph is a set of genes, represented as numbers, strings and booleans. The genes lead to the generation of segments using a recursive tree building algorithm, which can then be drawn on a canvas. The naming was largely taken from the original code. They include:
- `genes`: an array of 9 numbers, which control the general growth of the biomorph
- `dGenes`: an array of 10 strings, which represent modifiers to the expression of the genes
- `segNoGene`: the number of segments
- `segDistGene`: the distance between segments
- `symmetrical`: whether the biomorph is vertically symmetrical
- `spokesGene`: string representing if the biomorph has a body in 1, 2 or 4 parts
- `trickleGene`: curbs how big the biomorphs get (scale-ish)
- `mutSizeGene`: Indicates how much a gene changes when it mutates
- `mutProbGene`: The probability of mutation for a gene

## Shell

A shell is a set of genes which control roughly what Dawkins called _flare_, _spire_ and _verm_, as discussed in [Climbing Mount Improbable](https://www.amazon.co.uk/gp/product/0141026170). 
There are other genes which modify the behaviour of these.
It's modeled around the idea of a spiraling tube. The genes determine how the 
spiral unfolds, and at each stop, draws a given pattern (circle, or others).
The naming comes from the original code. They include:
- `pattern`: string which says what shape will be repeated and distorted
- `opening`: called "flare" in the book, determines the speed at which the tube's diameter expands
- `displacement`: called "verm" in the book, determines how close together the tube's whorls are
- `translation`: called "spire" in the book, determines how much the tube piles on itself (the height)
- `coarsegraininess`: how often is the pattern repeated along the spiral
- `reach`: how much the spiral coils
- `handedness`: wether the shells faces left or right
- `shape`: how much the shell pattern gets distorted
- `translationGradient`: modifies the translation's "easing"

## Different drawing methods for biomorphs

Biomorphs have got two different drawing methods. `drawWithLines` is the closest to the original algorithm. It takes the first batch of lines generated and for each of them, calculates at drawing time the other lines necessary if the biomorph is symmetrical or has spoke different from `Single`. It's a little harder to understand exactly what the algorithm is doing, but can be quite efficient (see next section).

`drawWithImages` innerworkings are clearer, as it doesn't do any coordinate manipulations on the fly. It draws the first batch of lines, rotates/scale/transform the canvas and then draws the transformed copy on itself. This is much like using a pattern that you duplicate and duplicating the result. It's easier to understand and the performances remain quite good (see next section).

## A word on performance

Mutliple biomorphs can be quite tricky to draw at the same time in terms of perfomance if you intend to animate or redraw them repeatedly (canvas dragging etc.). In most other cases, the general performances are good enough (500 ops/sec) that you don't have to do any of the below. However, if you're hitting some bottlenecks or want somethign closer to 4000 ops/sec:

- Keep the `lineWidth` to 1. Have any other value for the `lineWidth` will make a very serious dent in your performances ([StackOverflow question](http://stackoverflow.com/questions/21105829/why-does-ctx-linewidth-1-make-batched-line-drawing-slow)). `drawWithLines` will always be faster with `lineWidth` 1 than `drawImages`.
- If you have to have different `lineWidth`: for a biomorph of low complexity (not symmetrical, and single spoke) stick to `drawWithLines`, for a more complex biomorph go with `drawWithImages`.

Shells are less of a problem, their only `draw` method only works with lines and should be quite fast (4000 ops/sec) as long as you stick to `lineWidth` 1.

# Usage
The library currently includes a `Biomorph` and `Shell` class.

## Dependency

The only hard dependency is [lodash](https://github.com/lodash/lodash) which could be removed in the future.

## Installation
`npm install watchmaker` or download the files from Github. The classes have support for node-style require (works with Browserify/Webpack, etc.) but can also be used without any build system (as long as you include lodash manually).

## Examples

You can run the run the examples by installing the dev dependencies and running `npm run-script build-examples`. The example HTML files can then be opened in your favourite browser.

### Code

```js
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
```

# TODO

- Better documentation of the algorithms
- ES2015 version
- Is `lodash` necessary for this project?

# Contributing

Contributions are very welcome. Feel free to create issues and pull requests. Help on the documentation would be very appreciated.

# Credit

Thanks to Richard Dawkins for authoring the original algorithms and providing his support for this project. Thanks to Alan Canon for providing cleaned up and usable versions of the original programs.

Mathieu Triay - initial port from Pascal to JavaScript for Penguin Books UK.

# Changelog

- 1.0.0 - Initial release
