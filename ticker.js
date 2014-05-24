// Ticker.js
// (website here)
// (c) 2014 Max Hubenthal
// Ticker may be freely distributed under the MIT license.

// Thanks to Underscore.js and Jeremey Ashkenas for giving me a 
// headstart on how to design a library. I know there are many ways
// to approach it, but going with the global object seems to make sense
// for now.

// This is merely the minimal amount of boilerplate and it will
// it be expanded as it is more fully developed. 

(function() {

// Baseline setup
// -------------

// Establish the root object, 'window' in the browser.
var root = this;

// Create a safe reference to the Ticker object for use below.
var tkr = function(obj) {
  if (obj instanceof tkr) return obj;
  if (!(this instanceof tkr)) return new tkr(obj);
};

// Add 'tkr' as a global object via a string identifier.
root.tkr = tkr;

// Current version.
tkr.VERSION = '0.0.1';

// Ticker display loop
tkr.run = setInterval(function () {
    draw();
    drawCube();
}, 200);

// "Constants"
var ctx = canvas.getContext('2d');

// Draw a grid on canvas element
var draw = function () {

    var canvas = document.getElementById('canvas');
    var bodyWidth = 350;
    var bodyHeight = 200;

    if (canvas.getContext) {
        document.getElementById('canvas').width = 350;
        document.getElementById('canvas').height = 200;
        document.getElementById('canvas').border = "1px solid black";

        // Clear canvas of remnants
        ctx.clearRect(0, 0,
        350, 200);
        // Draw vertical grid
        for (var x = 0; x <= bodyWidth; x++) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, bodyHeight);
            ctx.closePath();
            ctx.fillStyle = "grey";
            ctx.stroke();
            x += 10;
        }

        // Draw horizontal grid
        for (var y = 0; y <= bodyHeight; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(bodyWidth, y);
            ctx.closePath();
            ctx.fillStyle = "grey";
            ctx.stroke();
            y += 10;
        }
    }
};

// Shape class constructor
function Shape(newOffset) {
    // Declare array of rectangle coordinates
    this.shapeArray = [];
    // tickerMessage width
    //this.tickerMessageWidth = newTickerMessageWidth;
    // Test array of squares
    // p represents a point
    // this is a 3x3 grid
    // 0--1--2
    // 3--4--5
    // 6--7--8  --> array positions for coordinates
    this.p = 0;
    this.testShape = [
        [this.p, this.p],
        [this.p + 10, this.p],
        [this.p + 20, this.p],
        [this.p, this.p + 10],
        [this.p + 10, this.p + 10],
        [this.p + 20, this.p + 10],
        [this.p, this.p + 20],
        [this.p + 10, this.p + 20],
        [this.p + 20, this.p + 20]
    ];
    // Overall width of ticker
    this.reset = 350;
    // Initial offset
    this.offset = newOffset;
};
// Declare Shape class properties on prototype
Shape.prototype = {
    // Constructor
    constructor: Shape,
    // Load a shape with generic coordinates from an array of squares to "turn on"
    loadShape: function (arrayOfSquaresToColor) {
        // Store shape offset in position "0"
        this.shapeArray[0] = this.offset;
        // Add positions to color to the shape
        for (var i = 0; i < arrayOfSquaresToColor.length; i++) {
            this.shapeArray[i] = this.testShape[arrayOfSquaresToColor[i]];
            // Set each x coordinate of shape to max width of ticker
            this.shapeArray[i][0] += this.offset;
        }
    },

    // Draw a shape, given a '2d' <canvas> context
    drawShape: function (canvasContext) {
        for (var i = 0; i < this.shapeArray.length; i++) {
            // Pixel is ready to cycle back to enter right of ticker
            if (this.shapeArray[i][0] < 0) {
                // Reset position to ticker display width
                this.shapeArray[i][0] = this.reset;
            };
            var tempX = this.shapeArray[i][0];
            var tempY = this.shapeArray[i][1];
            // Draw shape
            canvasContext.fillStyle = "black";
            canvasContext.fillRect(tempX, tempY, 10, 10);
            this.shapeArray[i][0] -= 10; // Decrement x coordinate position
        };
    }
};

// Create sample shapes
var firstShape = new Shape(350);
var positionsToColor = [0, 2];
firstShape.loadShape(positionsToColor);
var secondShape = new Shape(370);
positionsToColor = [3, 5];
secondShape.loadShape(positionsToColor);
var thirdShape = new Shape(390);
positionsToColor = [6, 8, 5];
thirdShape.loadShape(positionsToColor);

// Starting position for ticker elements
// Function to animate cube
var drawCube = function () {
    thirdShape.drawShape(ctx);
    secondShape.drawShape(ctx);
    firstShape.drawShape(ctx);
};
}.call(this));
