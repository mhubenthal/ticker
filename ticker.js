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
  //  tkr constants & tkr setup
  /////////////////////////////////////////////

  // References to <canvas> element
  // Note: for tkr to work, <canvas id="tkr_canvas"></canvas> 
  //   must be included in the <body> tag of the document
  var tkr_canvas = document.getElementById("tkr_canvas");
  var tkr_ctx = tkr_canvas.getContext('2d');

  // Default tkr grid values
  var tkr_gridWidth = tkr_canvas.width = 673, tkr_gridHeight = tkr_canvas.height = 211, tkr_gridUnitSize = 20, tkr_gridColor = "black", tkr_gridLineWidth = 1;
  // Default tkr message values
  var tkr_message = "Hello there, world.", tkr_messagerColor = "black", tkr_messageOffset = tkr_gridUnitSize+tkr_gridLineWidth, tkr_messageInterval = 200;
  // Default tkr run status values
  var tkr_IntervalId, tkr_isPaused = false, tkr_isForward = false, tkr_isReversed = false;

  /////////////////////////////////////////////
  //  Internal tkr functions
  /////////////////////////////////////////////

  // Draw grid on canvas element
  function tkr_drawGrid(){
    // Clear canvas of remnants
    tkr_ctx.clearRect(0,0,tkr_gridWidth,tkr_gridHeight);
    tkr_ctx.lineWidth = tkr_gridLineWidth;
    // Draw vertical grid, start at 0.5 to allo for non-blurry 1px line
    for (var x = 0.5; x <= tkr_gridWidth; x++){
      tkr_ctx.beginPath();
      tkr_ctx.moveTo(x, 0);
      tkr_ctx.lineTo(x, tkr_gridHeight);
      tkr_ctx.closePath();
      tkr_ctx.fillStyle = tkr_gridColor;
      tkr_ctx.stroke();
      x += tkr_gridUnitSize;
    }
    // Draw horizontal grid, start at 0.5 to allo for non-blurry 1px line
    for (var y = 0.5; y <= tkr_gridHeight; y++){
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
  function tkr_shape(newTickerWidth,newOffset,newShapeColor,newGridLineWidth){
    // Create generic 6x6 grid, which is positioned on the canvas with a 2 box
    //   border to the top and bottom.
    //
    // The loadShape function takes an array of squares to color,
    //   which correspond to the following positions:
    //
    // 00--01--02--03--04--05
    // 06--07--08--09--10--11
    // 12--13--14--15--16--17
    // 18--19--20--21--22--23
    // 24--25--26--27--28--29
    // 30--31--32--33--34--35
    //
    this.genericShape = [];
    // Declare array of rectangle coordinates
    this.shapeArray = [];
    // Overall width of ticker
    this.reset = newTickerWidth;
    // Initial offset
    this.offset = newOffset;
    // Set color
    this.shapeColor = newShapeColor;
    // Grid line width
    this.gridLineWidth = newGridLineWidth;
  }

  // Declare Shape class properties on prototype
  tkr_shape.prototype = {
    // Constructor
    constructor: tkr_shape,
    // Load a generic array of coordinates for use in drawing shapes
    loadGenericShape: function(){
      // Fill generic shape with zero-based coordinates
      var xVal = 0;
      var yVal = 2*tkr_messageOffset;
      var counter = 0;
      while(counter<36){
        for(var i=0;i<6;i++){
          this.genericShape[counter] = [xVal,yVal];
          xVal += tkr_messageOffset;
          counter++;
        }
        xVal = 0;
        yVal += tkr_messageOffset;
      }
    },
    // Load a shape with generic coordinates from an array of squares to "turn on"
    loadShape: function (arrayOfSquaresToColor){
      // Add positions to color to the shape
      for (var i = 0; i < arrayOfSquaresToColor.length; i++){
        this.shapeArray[i] = this.genericShape[arrayOfSquaresToColor[i]];
        // Set each x coordinate of shape to offset position in message string
        this.shapeArray[i][0] += this.offset;
        // Set each y coordinate of shape to account for grid line width
        this.shapeArray[i][1] += this.gridLineWidth;
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
        canvasContext.fillRect(tempX,tempY,tkr_gridUnitSize,tkr_gridUnitSize);
        this.shapeArray[i][0] -= tkr_messageOffset; // Decrement x coordinate position
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
        canvasContext.fillRect(tempX,tempY,tkr_gridUnitSize,tkr_gridUnitSize);
        this.shapeArray[i][0] += tkr_messageOffset; // Decrement x coordinate position
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
  function tkr_playForward(){ 
    // If tkr is not already running, start it up, otherwise do nothing
    if(!tkr_isForward){
      //clearInterval(tkr_IntervalId);  // Clear any previously running tkr
      tkr_isForward = true;
      tkr_isReversed = false;
      tkr_IntervalId = setInterval(function(){
        tkr_drawGrid();
        tkr_writeMessageForward(test_messageArray);
      }, tkr_messageInterval);
    }
  }
  function tkr_playReverse(){
    // If tkr is not already running, start it up, otherwise do nothing
    if(!tkr_isReversed){
      //clearInterval(tkr_IntervalId);  // Clear any previously running tkr
      tkr_isReversed = true;
      tkr_isForward = false;
      tkr_IntervalId = setInterval(function(){
        tkr_drawGrid();
        tkr_writeMessageBackwards(test_messageArray);
      }, tkr_messageInterval);
    }
  }
  function tkr_pause(){
    clearInterval(tkr_IntervalId);
    tkr_isPaused = true;
    tkr_isForward = false;
    tkr_isReversed = false;
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
  tkr.playForward = function(){
    tkr_playForward();
  }
  tkr.pause = function(){
    tkr_pause();
  }
  tkr.playReverse = function(){
    tkr_playReverse();
  }

  /*** ADD IN MORE FUN CONTROLS/SUPRISES ***/ 

  // SAMPLE CODE TO TEST LIBRARY REVISIONS
  // Create sample shapes
  var firstShape = new tkr_shape(673,673,"blue",1);
    firstShape.loadGenericShape();
    tkr.a = firstShape;
  var positionsToColor = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35];
  firstShape.loadShape(positionsToColor);
  var secondShape = new tkr_shape(673,799,"red",1);
    secondShape.loadGenericShape();
    tkr.b = secondShape;
  positionsToColor = [0,1,2,3,4];
  secondShape.loadShape(positionsToColor);
  var thirdShape = new tkr_shape(673,925,"yellow",1);
    thirdShape.loadGenericShape();
    tkr.c = thirdShape;
  positionsToColor = [0,1,2,3,4];
  thirdShape.loadShape(positionsToColor);
  test_messageArray = [firstShape,secondShape,thirdShape];

  // Register the tkr object to the global namespace
  this.tkr = tkr;
}());
