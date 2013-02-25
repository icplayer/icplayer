# icplayer

HTML5 player for interactive lessons.


## How to compile player

* Download projects:
  * https://github.com/icplayer/icfoundation
  * https://github.com/icplayer/icplayer
* Download GWT SDK: https://developers.google.com/web-toolkit/download
* Rename build-example.properties to build.properties and configure GWT path
* run build.xml with ant
* You can find distribution in dist/icplayer.zip


## How to embed player

Example html page:

```html
<html>
  <head>
    <script type="text/javascript" language="javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
    <script type="text/javascript" language="javascript" src="icplayer/icplayer.nocache.js"></script>
    <script language="javascript">
		var player1;
      	function icOnAppLoaded(){
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
