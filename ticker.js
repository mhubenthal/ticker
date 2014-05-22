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

// HELLO WORLD.
tkr.helloWorld = function(name){
  console.log("Hello " + name + "\'s world!");
};
    
// Nasty proof of concept

tkr.test = function() {
  var draw = function(){
    var canvas = document.getElementById('canvas');
    var bodyWidth = 350;
    var bodyHeight = 200;

    if (canvas.getContext) {
      document.getElementById('canvas').width = 350;
      document.getElementById('canvas').height = 200;
      document.getElementById('canvas').border = "1px solid black";
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0,0,350,200);
      // Draw vertical grid
      for(var x=0;x<=bodyWidth;x++){
        ctx.beginPath();
        ctx.moveTo(x,0);
        ctx.lineTo(x,bodyHeight);
        ctx.closePath();
        ctx.fillStyle="grey";
        ctx.stroke();
        x+=10;
      }
        
      // Draw horizontal grid
      for(var y=0;y<=bodyHeight;y++){
        ctx.beginPath();
        ctx.moveTo(0,y);
        ctx.lineTo(bodyWidth,y);
        ctx.closePath();
        ctx.fillStyle="grey";
        ctx.stroke();
        y+=10;
      }
    }
  };
  draw();
  var xPos = 300;
  var drawCube = function(){
    if(xPos<0){
      xPos=300;
    };
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "black";
    ctx.fillRect(xPos,100,10,10);
    xPos -= 10;
  };
  var run = setInterval(function(){draw(); drawCube();},200);
};
}.call(this));
