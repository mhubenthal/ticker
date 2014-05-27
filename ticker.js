// Ticker.js
// (website here)
// (c) 2014 Max Hubenthal
// Ticker may be freely distributed under the MIT license.

// Wrap the library in an IIFE
(function() {
  // Declare tkr object for use in global namespace
  var tkr = {
    // Current version.
    VERSION: "1.0"
  };

  // References to <canvas> element...*** THESE WILL NEED TO BE IMPROVED ***
  var tkr_canvas = document.getElementById("tkr_canvas");
  var tkr_ctx = tkr_canvas.getContext('2d');

  // Default tkr values
  var tkr_gridWidth = 350, tkr_gridHeight = 200, tkr_gridUnitSize = 10, tkr_gridColor = "black",
    tkr_message = "Hello there, world.", tkr_messagerColor = "black", tkr_messageInterval = 200;

  // Draw a grid on canvas element
  function tkr_drawGrid(gridWidth,gridHeight,gridUnitSize,gridColor,canvasContext){
    // Clear canvas of remnants
    canvasContext.clearRect(0,0,gridWidth,gridHeight);
    // Draw vertical grid
    for (var x = 0; x <= gridWidth; x++){
      canvasContext.beginPath();
      canvasContext.moveTo(x, 0);
      canvasContext.lineTo(x, gridHeight);
      canvasContext.closePath();
      canvasContext.fillStyle = gridColor;
      canvasContext.stroke();
      x += gridUnitSize;
    }
    // Draw horizontal grid
    for (var y = 0; y <= gridHeight; y++){
      canvasContext.beginPath();
      canvasContext.moveTo(0, y);
      canvasContext.lineTo(gridWidth, y);
      canvasContext.closePath();
      canvasContext.fillStyle = gridColor;
      canvasContext.stroke();
      y += gridUnitSize;
    }
  }

  // Shape class constructor
  function tkr_shape(newOffset){
    // Declare array of rectangle coordinates
    this.shapeArray = [];
    // tickerMessage width
    //this.tickerMessageWidth = newTickerMessageWidth;
    // Test array of squares
    // p represents a point
    // this is a 3x3 grid *** FIX THIS TO BE MODULAR ***
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
    this.reset = tkr_gridWidth;
    // Initial offset
    this.offset = newOffset;
  }

  // Declare Shape class properties on prototype
  tkr_shape.prototype = {
    // Constructor
    constructor: tkr_shape,
    // Load a shape with generic coordinates from an array of squares to "turn on"
    loadShape: function (arrayOfSquaresToColor){
      // Store shape offset in position "0"
      this.shapeArray[0] = this.offset;
      // Add positions to color to the shape
      for (var i = 0; i < arrayOfSquaresToColor.length; i++){
        this.shapeArray[i] = this.testShape[arrayOfSquaresToColor[i]];
        // Set each x coordinate of shape to max width of ticker
        this.shapeArray[i][0] += this.offset;
      }
    },

    // Draw a shape, given a '2d' <canvas> context
    drawShape: function (canvasContext){
      for (var i = 0; i < this.shapeArray.length; i++){
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
        this.shapeArray[i][0] -= tkr_gridUnitSize; // Decrement x coordinate position
      };
    }
  }

  // SAMPLE CODE TO TEST LIBRARY REVISIONS
  // Create sample shapes
  var firstShape = new tkr_shape(350);
  var positionsToColor = [0, 2];
  firstShape.loadShape(positionsToColor);
  var secondShape = new tkr_shape(370);
  positionsToColor = [3, 5];
  secondShape.loadShape(positionsToColor);
  var thirdShape = new tkr_shape(390);
  positionsToColor = [6, 8, 5];
  thirdShape.loadShape(positionsToColor);
  test_messageArray = [firstShape,secondShape,thirdShape];

  // Draw letters from message to canvas, an array of tkr_shape objects are passed in
  function tkr_writeMessage(messageArray){
    for(var i=0; i<messageArray.length; i++){
        messageArray[i].drawShape(tkr_ctx);
    }
  };

  // Ticker display loop
  tkr.run = setInterval(function () {
    tkr_drawGrid(tkr_gridWidth,tkr_gridHeight,tkr_gridUnitSize,tkr_gridColor,tkr_ctx);
    tkr_writeMessage(test_messageArray);
  }, tkr_messageInterval);
  
  // Register the tkr object to the global namespace
  this.tkr = tkr;
}());
