# icplayer

HTML5 player for interactive lessons.


## How to compile player

* To

## How to embed player

Example:
```html
<html>
  <head>
    <script type="text/javascript" language="javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
    <script type="text/javascript" language="javascript" src="icplayer/icplayer.nocache.js"></script>
    <script language="javascript">
		var player1;
      	function qpOnAppLoaded(){
	        // Load assessment
    	    player1 = icCreatePlayer('_icplayer');
        	player1.load('content/default.ic.xml');
      	}
    </script>
    
    <script type="text/javascript" 
  		src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
	</script>
  </head>

  <body>
	<div id="_icplayer"></div>
  </body>
</html>
```
