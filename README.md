### A customizeable Javascript ticker using the ```<canvas>``` tag.

Include ```<canvas id="tkr_canvas"></canvas>``` on your page. 
Include the ticker.js script, the ```tkr``` object is attached to
the global context.
Call ```tkr.setMessage("Your message here.");``` to load your text.
Call ```tkr.playForward();``` to get things going.

Message content and message color can be changed on the fly without calling ```tkr.playForward();``` again. To change color ```tkr.setMessageColor("newColor")```. To change content, call ```tkr.setMessage("New message.");```.

To change the message speed, call ```tkr.pause()``` then 
```tkr.setMessageInterval(newInterval)``` then ```tkr.playForward()```.

(Supports UTF-8 decimal char codes from 32 to 126.) 
