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

}.call(this));
