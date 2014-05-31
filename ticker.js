// ticker.js
// (website here)
// (c) 2014 Max Hubenthal
// Ticker may be freely distributed under the MIT license.

// Wrap the library in an IIFE
(function(){ 
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
  var tkr_message = [], tkr_messageShapeArray = [], tkr_messagerColor = "black", tkr_gridOffset = tkr_gridUnitSize + tkr_gridLineWidth, tkr_charOffset = 673, tkr_messageInterval = 200;
    
  // Default tkr run status values
  var tkr_IntervalId, tkr_isPaused = false, tkr_isForward = false, tkr_isReversed = false;
    
  // Array of tkr char shapes for UTF-8 codes
  //  in decimal from 32 to 90.
  //  Here is a good list of the available chars:
  //    http://utf8-chartable.de/unicode-utf8-table.pl?utf8=dec
  // Position [0] of each array is the required width of the shape
    
    // \ !" so far
  var tkr_charShapes = [
      //
      [5],
      // !
      [2,0,6,12,18,30],
      // "
      [4,0,6,12,2,8,14],
      // #
      [6,1,3,6,7,8,9,10,13,15,19,21,24,25,26,27,28,31,33],
      // $
      [],
      // %
      [],
      // &
      [],
      // '
      [2,0,6,12],
      // (
      [4,2,7,12,18,25,32],
      // )
      [4,0,7,14,20,25,30],
      // *
      [],
      // +
      [4,13,18,19,20,25],
      // ,
      [2,30,36],
      // -
      [4,18,19,20],
      // .
      [2,30],
      // /
      [],
      // 0
      [4,6,7,8,12,14,18,20,24,26,30,31,32],
      // 1
      [2,6,12,18,24,30],
      // 2
      [4,6,7,8,14,18,19,20,24,30,31,32],
      // 3
      [4,6,7,8,14,18,19,20,26,30,31,32],
      // 4
      [4,6,8,12,14,18,19,20,26,32],
      // 5
      [4,6,7,8,12,18,19,20,26,30,31,32],
      // 6
      [4,6,7,8,12,18,19,20,24,26,30,31,32],
      // 7
      [4,6,7,8,14,20,26,32],
      // 8
      [4,6,7,8,12,14,18,19,20,24,26,30,31,32],
      // 9
      [4,6,7,8,12,14,18,19,20,26,30,31,32],
      // :
      [2,18,30],
      // ;
      [2,18,30,36],
      // <
      [],
      // =
      [4,12,13,14,24,25,26],
      // >
      [],
      // ?
      [],
      // @
      [],
      // A
      [4,6,7,8,12,14,18,19,20,24,26,30,32],
      // B
      [],
      // C
      [],
      // D
      [],
      // E
      [],
      // F
      [],
      // G
      [],
      // H
      [],
      // I
      [],
      // J
      [],
      // K
      [],
      // L
      [],
      // M
      [],
      // N
      [],
      // O
      [],
      // P
      [],
      // Q
      [],
      // R
      [],
      // S
      [],
      // T
      [],
      // U
      [],
      // V
      [],
      // W
      [],
      // X
      [],
      // Y
      [],
      // Z
      []
  ];

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
  function tkr_shape(arrayOfSquaresToColor){
    // Create generic 6x6 grid, which is positioned on the canvas with a 2 box
    //   border to the top and bottom.
    //
    // tkr_shape takes an array of squares to color,
    //   which correspond to the following positions:
    //
    // 00--01--02--03--04--05
    // 06--07--08--09--10--11
    // 12--13--14--15--16--17
    // 18--19--20--21--22--23
    // 24--25--26--27--28--29
    // 30--31--32--33--34--35
    //
    this.squaresToColor = arrayOfSquaresToColor;
    this.genericShape = [[],[]];
    // Declare array of rectangle coordinates
    this.shapeArray = [[],[]];
    // Overall width of ticker
    this.reset = tkr_gridWidth;
    // Set color
    this.shapeColor = tkr_messagerColor;
    // Grid line width
    this.gridLineWidth = tkr_gridLineWidth;
  }

  // Declare Shape class properties on prototype
  tkr_shape.prototype = {
    // Constructor
    constructor: tkr_shape,
    
    // Load a generic array of coordinates for use in drawing shapes
    loadGenericShape: function(){
      // Fill generic shape with zero-based coordinates
      var xVal = 0;
      var yVal = 2*tkr_gridOffset;
      var counter = 0;
      while(counter<48){
        for(var i=0;i<6;i++){
          this.genericShape[counter] = [xVal,yVal];
          xVal += tkr_gridOffset;
          counter++;
        }
        xVal = 0;
        yVal += tkr_gridOffset;
      }
    },
      
    // Load a shape with generic coordinates from an array of squares to "turn on"
    loadShape: function (){
      // Add positions to color to the shape
      for (var i = 1; i < this.squaresToColor.length; i++){
        this.shapeArray[i] = this.genericShape[this.squaresToColor[i]];
        // Set each x coordinate of shape to offset position in message string
        this.shapeArray[i][0] += tkr_charOffset;
        // Set each y coordinate of shape to account for grid line width
        this.shapeArray[i][1] += this.gridLineWidth;
      }
      // After loading the shape, increment the offset(pointer) to
      //   allow for writing the next char
      tkr_charOffset += (this.squaresToColor[0] * tkr_gridOffset);
    },

    // Draw a shape, given a '2d' <canvas> context
    animateShapeForward: function (canvasContext){
      for (var i = 0; i < this.shapeArray.length; i++){
        // Pixel is ready to cycle back to enter right of ticker
        if (this.shapeArray[i][0] < 0) {
          // Reset position to ticker display width
          this.shapeArray[i][0] = tkr_charOffset;
        }
        var tempX = this.shapeArray[i][0];
        var tempY = this.shapeArray[i][1];
          
        // Draw shape
        canvasContext.fillStyle = this.shapeColor;
        canvasContext.fillRect(tempX,tempY,tkr_gridUnitSize,tkr_gridUnitSize);
        this.shapeArray[i][0] -= tkr_gridOffset; // Decrement x coordinate position
      }
    },
    animateShapeBackwards: function (canvasContext){
      for (var i = 0; i < this.shapeArray.length; i++){
        // Pixel is ready to cycle back to enter right of ticker
        if (this.shapeArray[i][0] > tkr_gridWidth) {
          // Reset position to ticker display width
          this.shapeArray[i][0] = -tkr_charOffset;
        }
        var tempX = this.shapeArray[i][0];
        var tempY = this.shapeArray[i][1];
          
        // Draw shape
        canvasContext.fillStyle = this.shapeColor;
        canvasContext.fillRect(tempX,tempY,tkr_gridUnitSize,tkr_gridUnitSize);
        this.shapeArray[i][0] += tkr_gridOffset; // Decrement x coordinate position
      }
    }
  };

  // Load a message array of tkr_shape objects from an array of UTF-8 codes
  function tkr_loadMessageShapeArray(newCharArray){
    // Convert chars to tkr_shape objects and add to message array
    for(var i=0;i<newCharArray.length;i++){
      var newShape = new tkr_shape(tkr_charShapes[newCharArray[i]-32]);
      newShape.loadGenericShape();  // Load the generic tkr shape template
      // Load the shape, which creates an array of (x,y) coordinates
      newShape.loadShape();  
      tkr_messageShapeArray[i] = newShape;  // Add the shape to the message array
    }
  }
  
  // Draw letters from message to canvas, an array of tkr_shape objects are passed in
  function tkr_writeMessageForward(messageArray){
    for(var i=0; i<messageArray.length; i++){
        messageArray[i].animateShapeForward(tkr_ctx);
    }
  }
  function tkr_writeMessageBackwards(messageArray){
    for(var i=0; i<messageArray.length; i++){
        messageArray[i].animateShapeBackwards(tkr_ctx);
    }
  }

  // Internal tkr contol methods
  function tkr_playForward(){ 
    // If tkr is not already running, start it up, otherwise do nothing
    if(!tkr_isForward){
      clearInterval(tkr_IntervalId);  // Clear any previously running tkr
      tkr_isForward = true;
      tkr_isReversed = false;
      tkr_IntervalId = setInterval(function(){
        tkr_drawGrid();
        tkr_writeMessageForward(tkr_messageShapeArray);
      }, tkr_messageInterval);
    }
  }
  function tkr_playReverse(){
    // If tkr is not already running, start it up, otherwise do nothing
    if(!tkr_isReversed){
      clearInterval(tkr_IntervalId);  // Clear any previously running tkr
      tkr_isReversed = true;
      tkr_isForward = false;
      tkr_IntervalId = setInterval(function(){
        tkr_drawGrid();
        tkr_writeMessageBackwards(tkr_messageShapeArray);
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
    // Place array of UTF-8 codes into tkr_message
    for(var i=0;i<newMessage.length;i++){
      tkr_message[i] = newMessage.charCodeAt(i);
    }
    // Load shapes with array of UTF-8 codes
    tkr_loadMessageShapeArray(tkr_message);
  };
  tkr.setMessageColor = function(newMessageColor){
    tkr_messagerColor = newMessageColor;
  };
  tkr.setMessageInterval = function(newMessageInterval){
    tkr_messageInterval = newMessageInterval;
  };
  tkr.setGridHeight = function(newGridHeight){
    tkr_gridHeight = newGridHeight;
  };
  tkr.setGridWidth = function(newGridWidth){
    tkr_gridWidth = newGridWidth;
  };
  tkr.setGridUnitSize = function(newGridUnitSize){
    tkr_gridUnitSize = newGridUnitSize;
  };
  tkr.setGridColor = function(newGridColor){
    tkr_gridColor = newGridColor;
  };

  // tkr controls
  tkr.playForward = function(){
    tkr_playForward();
  };
  tkr.pause = function(){
    tkr_pause();
  };
  tkr.playReverse = function(){
    tkr_playReverse();
  };

  /*** ADD IN MORE FUN CONTROLS/SUPRISES ***/ 

  // SAMPLE CODE TO TEST LIBRARY REVISIONS
  // Create sample shapes
  tkr.setMessage("000111222333444555666777888999000111222333");
  console.log(tkr_message);

  // Register the tkr object to the global namespace
  this.tkr = tkr;
}());
