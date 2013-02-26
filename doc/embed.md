# Embedding player

## Basic html page

Example html page:

```html
<html>
  <head>
    <script type="text/javascript" language="javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
    <script type="text/javascript" language="javascript" src="icplayer/icplayer.nocache.js"></script>
    <script language="javascript">
		var player;
      	function icOnAppLoaded(){
    	    player = icCreatePlayer('_icplayer');
        	player.load('content/default.ic.xml');
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


## Saving and restoring lesson state

```javascript
	var player;
  	function icOnAppLoaded(){
	    player = icCreatePlayer('_icplayer');
	    // Write state to player before loading content
	    player.setState(state);
    	player.load('content/default.ic.xml');
    	
    	// Read state from player
    	var state = player.getState();
    	
  	}
```

## Getting lesson results

```javascript
	var player;
  	function icOnAppLoaded(){
	    player = icCreatePlayer('_icplayer');
    	player.load('content/default.ic.xml');
    	
		var ps = player.getPlayerServices();    	
  	}
```
