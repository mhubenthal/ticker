// ticker.js
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

  /////////////////////////////////////////////
  //  tkr constants
  /////////////////////////////////////////////

  // References to <canvas> element
  // Note: for tkr to work, <canvas id="tkr_canvas"></canvas> 
  //   must be included in the <body> tag of the document
  var tkr_canvas = document.getElementById("tkr_canvas");
  var tkr_ctx = tkr_canvas.getContext('2d');

  // Default tkr grid values
  var tkr_gridWidth = tkr_canvas.width = 350, tkr_gridHeight = tkr_canvas.height = 200, tkr_gridUnitSize = 10, tkr_gridColor = "black";
  // Default tkr message values
  var tkr_message = "Hello there, world.", tkr_messagerColor = "black", tkr_messageInterval = 200;
  // Default tkr run status values
  var tkr_IntervalId, tkr_isPaused = false, tkr_isForward = false, tkr_isReversed = false;

  /////////////////////////////////////////////
  //  Internal functions for the tkr library
  /////////////////////////////////////////////

  // Set tkr grid values
  function tkr_setGrid(newGridWidth,newGridHeight,newGridColor,newGridUnitSize){
    tkr_gridWidth = tkr_canvas.width = newGridWidth;
    tkr_gridHeight = tkr_canvas.height = newGridHeight;
    tkr_gridColor = newGridColor;
    tkr_gridUnitSize = newGridUnitSize;
  }

  // Set tkr message 
  function tkr_setMessage(newMessage,newMessageColor,newMessageInterval){
    tkr_message = newMessage;
    tkr_messagerColor = newMessageColor;
    tkr_messageInterval = newMessageInterval;
  }

  // Draw grid on canvas element
  function tkr_drawGrid(){
    // Clear canvas of remnants
    tkr_ctx.clearRect(0,0,tkr_gridWidth,tkr_gridHeight);
    // Draw vertical grid
    for (var x = 0; x <= tkr_gridWidth; x++){
      tkr_ctx.beginPath();
      tkr_ctx.moveTo(x, 0);
      tkr_ctx.lineTo(x, tkr_gridHeight);
      tkr_ctx.closePath();
      tkr_ctx.fillStyle = tkr_gridColor;
      tkr_ctx.stroke();
      x += tkr_gridUnitSize;
    }
    // Draw horizontal grid
    for (var y = 0; y <= tkr_gridHeight; y++){
      tkr_ctx.beginPath();
      tkr_ctx.moveTo(0, y);
      tkr_ctx.lineTo(tkr_gridWidth, y);
      tkr_ctx.closePath();
      tkr_ctx.fillStyle = tkr_gridColor;
      tkr_ctx.stroke();
      y += tkr_gridUnitSize;
    }
  }

  // Shape class constructor
  function tkr_shape(newTickerWidth,newOffset,newShapeColor){
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
    this.reset = newTickerWidth;
    // Initial offset
    this.offset = newOffset;
    // Set color
    this.shapeColor = newShapeColor;
  }

  // Declare Shape class properties on prototype
  tkr_shape.prototype = {
    // Constructor
    constructor: tkr_shape,
    // Load a shape with generic coordinates from an array of squares to "turn on"
    loadShape: function (arrayOfSquaresToColor){
      // Add positions to color to the shape
      for (var i = 0; i < arrayOfSquaresToColor.length; i++){
        this.shapeArray[i] = this.testShape[arrayOfSquaresToColor[i]];
        // Set each x coordinate of shape to max width of ticker
        this.shapeArray[i][0] += this.offset;
      }
    },

    // Draw a shape, given a '2d' <canvas> context
    animateShapeForward: function (canvasContext){
      for (var i = 0; i < this.shapeArray.length; i++){
        // Pixel is ready to cycle back to enter right of ticker
        if (this.shapeArray[i][0] < 0) {
          // Reset position to ticker display width
          this.shapeArray[i][0] = this.reset;
        };
        var tempX = this.shapeArray[i][0];
        var tempY = this.shapeArray[i][1];
        // Draw shape
        canvasContext.fillStyle = this.shapeColor;
        canvasContext.fillRect(tempX, tempY, 10, 10);
        this.shapeArray[i][0] -= tkr_gridUnitSize; // Decrement x coordinate position
      };
    },
    animateShapeBackwards: function (canvasContext){
      for (var i = 0; i < this.shapeArray.length; i++){
        // Pixel is ready to cycle back to enter right of ticker
        if (this.shapeArray[i][0] > this.reset) {
          // Reset position to ticker display width
          this.shapeArray[i][0] = 0;
        };
        var tempX = this.shapeArray[i][0];
        var tempY = this.shapeArray[i][1];
        // Draw shape
        canvasContext.fillStyle = this.shapeColor;
        canvasContext.fillRect(tempX, tempY, 10, 10);
        this.shapeArray[i][0] += tkr_gridUnitSize; // Decrement x coordinate position
      };
    }
  }

  // Draw letters from message to canvas, an array of tkr_shape objects are passed in
  function tkr_writeMessageForward(messageArray){
    for(var i=0; i<messageArray.length; i++){
        messageArray[i].animateShapeForward(tkr_ctx);
    }
  };
  function tkr_writeMessageBackwards(messageArray){
    for(var i=0; i<messageArray.length; i++){
        messageArray[i].animateShapeBackwards(tkr_ctx);
    }
  };

  // Internal tkr contol methods
  function tkr_play(){ 
    // If tkr is not already running, start it up, otherwise do nothing
    if(!tkr_isForward){
      tkr_IntervalId = setInterval(function(){
        tkr_drawGrid();
        tkr_writeMessageForward(test_messageArray);
        tkr_isForward = true;
        tkr_isReversed = false;
      }, tkr_messageInterval);
    }
  }
  function tkr_pause(){
    clearInterval(tkr_IntervalId);
    tkr_isPaused = true;
    tkr_isForward = false;
    tkr_isReversed = false;
  }
  function tkr_reverse(){
    // If tkr is not already running, start it up, otherwise do nothing
    if(!tkr_isReversed){
      tkr_IntervalId = setInterval(function(){
        tkr_drawGrid();
        tkr_writeMessageBackwards(test_messageArray);
        tkr_isReversed = true;
        tkr_isForward = false;
      }, tkr_messageInterval);
    }
  }

  /////////////////////////////////////////////
  //  External functions to be called by user
  /////////////////////////////////////////////

  // Setters
  tkr.setMessage = function(newMessage){
    tkr_message = newMessage;
  }
  tkr.setMessageColor = function(newMessageColor){
    tkr_messagerColor = newMessageColor;
  }
  tkr.setMessageInterval = function(newMessageInterval){
    tkr_messageInterval = newMessageInterval;
  }
  tkr.setGridHeight = function(newGridHeight){
    tkr_gridHeight = newGridHeight;
  }
  tkr.setGridWidth = function(newGridWidth){
    tkr_gridWidth = newGridWidth;
  }
  tkr.setGridUnitSize = function(newGridUnitSize){
    tkr_gridUnitSize = newGridUnitSize;
  }
  tkr.setGridColor = function(newGridColor){
    tkr_gridColor = newGridColor;
  }

  // tkr controls
  tkr.play = function(){
    tkr_play();
  }
  tkr.pause = function(){
    tkr_pause();
  }
  tkr.reverse = function(){
    tkr_reverse();
  }

  /*** ADD IN MORE FUN CONTROLS/SUPRISES ***/ 

  // SAMPLE CODE TO TEST LIBRARY REVISIONS
  // Create sample shapes
  var firstShape = new tkr_shape(350,350,"blue");
  var positionsToColor = [0, 2];
  firstShape.loadShape(positionsToColor);
  var secondShape = new tkr_shape(350,370,"red");
  positionsToColor = [3, 5];
  secondShape.loadShape(positionsToColor);
  var thirdShape = new tkr_shape(350,390,"yellow");
  positionsToColor = [6, 8, 5];
  thirdShape.loadShape(positionsToColor);
  test_messageArray = [firstShape,secondShape,thirdShape];

  // Register the tkr object to the global namespace
  this.tkr = tkr;
}());
