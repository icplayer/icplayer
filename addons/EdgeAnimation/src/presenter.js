function AddonEdgeAnimation_create(){
    var currentAnimationItem = 1;

    var presenter = function(){};
    var onDocLoaded = null;
    var Animations;
    
    presenter.setStateStatus = false;
    presenter.commentAlreadyLoaded = false;
    presenter.$view = null;

    presenter.run = function(view, model){
        Animations = model.Animations;
        presenter.Animations = model.Animations;
        presenter.addonID = model.ID;
        presenter.$view = $(view);
        presenter.model = model;
        presenter.autoplayState = undefined;
        
		presenter.isVisible = model["Is Visible"] == 'True';
		presenter.setVisibility(presenter.isVisible);
		
		//show loading icon
		var loadingSrc = DOMOperationsUtils.getResourceFullPath(presenter.playerController, "media/loading.gif");
		var loadingIconImg = $(view).find('.edge-loading-image')[0];
		$(loadingIconImg).css({
            left: (presenter.model.Width/2)-15 + 'px',
            top: (presenter.model.Height/2)-15 + 'px'
        });
		$(loadingIconImg).attr('src',loadingSrc);
		
		$(model.Animations).each(function(i, animation){
			if(animation.compositionClass === '' && animation.edgeFile === '' && animation.edgeActionsFile === ''){
				presenter.errorHandler("This addon needs all files in Animations list to work");
				return;
			}
		});
		
        presenter.preloadImages(model.Images, function() {
            presenter.presenterLogic(view, model);
        });
    };

    presenter.createPreview = function (view, model) {
		//presenter.run(view,model);
    };
	
	presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
    };
	
	presenter.errorHandler = function(message){
		presenter.$view.prepend('<div style="color: red; font-size: 12px; font-family: Arial;">'+message+'</span>');
	};
	
    presenter.preloadImages = function(images, callback){
        var count = images.length;
        if(count === 1 && images[0].imageFile === '') {
            callback();
        }
        var loaded = 0;
        $(images).each(function() {
            $('<img>').attr('src', this.imageFile).load(function() {
                loaded++;
                if (loaded === count) {
                    callback();
                }
            });
        });
    };

    presenter.loadMediaToAnimation = function(model){
        var CompositionClass;
        var elementTagName;
		//IMAGES
		if(model.Images.length === 1 && model.Images[0].imageFile === '') {
            return;
        }
        $(model.Images).each(function(index1, value){
            var animItemsArray = value.animationItem.split(',');
            var idsArray = value.elementId.split(',');

            $(animItemsArray).each(function(index2, item){

                $(idsArray).each(function(index3, id){
                    CompositionClass = model.Animations[item - 1].compositionClass;

                    elementTagName = $("#Stage" + model.ID + CompositionClass + "_" + id).prop("tagName");
                    if(elementTagName == 'DIV'){
                        $("#Stage" + model.ID + CompositionClass + "_" + id).css("background-image", "url(" + value.imageFile + ")");
                    } else if(elementTagName=='IMG') {
                        $("#Stage" + model.ID + CompositionClass + "_" + id).attr('src', value.imageFile);
                    }
                });

            });
        });
    };

    presenter.presenterLogic = function(view, model){
        if(model.initialAnimation === ""){
            model.initialAnimation = 0;
        } else {
            model.initialAnimation = parseInt(model.initialAnimation, 10) - 1;
        }

        $(model.Animations).each(function(i, animation){
            var display = "none";
            if(currentAnimationItem - 1 == i){
                display = "block";
            }

            $('head').append('<script>    window.AdobeEdge = window.AdobeEdge || {};    window.AdobeEdge.bootstrapLoading = true; </script>');
            $('head').append('<!--Adobe Edge Runtime-->');
            var headPrependStyle = '<style>.edgeLoad-' + animation.compositionClass + ' { visibility:hidden; }</style>';
            $('head').append(headPrependStyle);
            $('head').append('<!--Adobe Edge Runtime End-->');

            var stage = $('<div></div>');
            var edgeAnimWrapper = $(view).find('.edgeMultiAnimWrapper')[0];

            stage.attr('id', 'Stage' + model.ID + animation.compositionClass);
            stage.addClass(animation.compositionClass);
            stage.css('display', display);
            stage.addClass('Stage');
            $(edgeAnimWrapper).prepend(stage);
				
            run(animation);
        });

    };

    function run(animation){
        (function(compId){
            window.AdobeEdge = window.AdobeEdge || {};
            window.AdobeEdge.bootstrapLoading = true;
            // Include yepnope
            if(!AdobeEdge.yepnope) {
                /*yepnope1.5.x|WTFPL*/
                (function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}})(this,document);AdobeEdge.yepnope = window.yepnope;
            }
            // end yepnope


            var htFallbacks;
            var testEle=document.createElement("div");function isSupported(a){var d=testEle.style,e;for(i=0;i<a.length;i++)if(e=a[i],d[e]!==void 0)return!0;return!1}function supportsRGBA(){testEle.cssText="background-color:rgba(150,255,150,.5)";if((""+testEle.style.backgroundColor).indexOf("rgba")==0)return!0;return!1}
            var hasTransform=isSupported(["transformProperty","WebkitTransform","MozTransform","OTransform","msTransform"]),hasSVG=!!document.createElementNS&&!!document.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect,hasRGBA=supportsRGBA(),hasJSON=window.JSON&&window.JSON.parse&&window.JSON.stringify,readyToPlay=!1;function safeColor(a){a=""+a;if(!hasRGBA&&a.indexOf("rgba")==0){var d=a.lastIndexOf(",");d>0&&(a="rgb("+a.substring(5,d)+")")}return a}
            AdobeEdge._preloaders=AdobeEdge._preloaders||[];AdobeEdge._preloaders.push(function(){filesToLoad&&(loadResources(filesToLoad),filesToLoad=void 0)});function doLoadResources(){for(var a=0;a<AdobeEdge._preloaders.length;a++)AdobeEdge._preloaders[a]()}AdobeEdge._readyplayers=AdobeEdge._readyplayers||[];AdobeEdge._readyplayers.push(function(){readyToPlay&&AdobeEdge.okToLaunchComposition(compId)});
            function playWhenReady(){AdobeEdge._playWhenReady=!0;for(var a=0;a<AdobeEdge._readyplayers.length;a++)AdobeEdge._readyplayers[a]()}function edgeCallback(a){htFallbacks[a]&&(a=htFallbacks[a]);AdobeEdge.preload.got[a]=!0;if(a==AdobeEdge.preload.last)!AdobeEdge.bootstrapLoading||AdobeEdge._playWhenReady?AdobeEdge.okToLaunchComposition(compId):readyToPlay=!0,AdobeEdge.preload.busy=!1,AdobeEdge.preload.q.length>0&&(a=AdobeEdge.preload.q.pop(),AdobeEdge.requestResources(a.files,a.callback))}
            AdobeEdge.requestResources=AdobeEdge.requestResources||function(a,d){AdobeEdge.yepnope.errorTimeout=4E3;AdobeEdge.preload.busy=!0;AdobeEdge.preload.got={};var e,b=a.length,h=[],c;for(e=0;e<b;e++){c=a[e];if(typeof c==="string")url=c,c={load:url};else if(url=c.yep||c.load,c.callback){var k=c.callback;c.callback=function(a,b,c){k(a,b,c)&&d(a,b,c)}}if(!c.callback)c.callback=d;if(!AdobeEdge.preload.got[url])h.push(c),AdobeEdge.preload.last=url}h.length&&AdobeEdge.yepnope(h)};
            var filesToLoad,dlContent,preContent,doDelayLoad,signaledLoading,loadingEvt,requiresSVG,htLookup={},aLoader,aEffectors;function loadResources(a,d){AdobeEdge.preload=AdobeEdge.preload||[];AdobeEdge.preload.q=AdobeEdge.preload.q||[];d||!isCapable()?filesToLoad=a:AdobeEdge.preload.busy?AdobeEdge.preload.q.push({files:a,callback:edgeCallback}):AdobeEdge.requestResources(a,edgeCallback);}
            function splitUnits(a){var d={};d.num=parseFloat(a);if(typeof a=="string")d.units=a.match(/[a-zA-Z%]+$/);if(d.units&&typeof d.units=="object")d.units=d.units[0];return d}function defaultUnits(a){var d=a;if(a!=="auto"&&(a=splitUnits(a),!a||!a.units))d+="px";return d}function findNWC(a,d){if(String(a.className).indexOf(d)!=-1)return a;for(var e=a.childNodes,b=0;b<e.length;b++){var h=findNWC(e[b],d);if(h!=!1)return h}return!1}
            function simpleContent(a,d,e){var b=document.getElementsByTagName("body")[0],e=e||findNWC(b,compId),h,c,k,g;if(e){if(e.style.position!="absolute"&&e.style.position!="relative")e.style.position="relative"}else e=b;for(var m=0;m<a.length;m++){b=a[m];b.type=="image"?(h=document.createElement("img"),h.src=b.fill[1]):h=document.createElement("div");h.id=b.id;g=h.style;if(b.type=="text"){if(c=b.font){if(c[0]&&c[0]!=="")g.fontFamily=c[0];typeof c[1]!="object"&&(c[1]=[c[1]]);c[1][1]||(c[1][1]="px");if(c[1][0]&&
                c[1][0]!=="")g.fontSize=c[1][0]+c[1][1];if(c[2]&&c[2]!=="")g.color=safeColor(c[2]);if(c[3]&&c[3]!=="")g.fontWeight=c[3];if(c[4]&&c[4]!=="")g.textDecoration=b.font[4];if(c[5]&&c[5]!=="")g.fontStyle=b.font[5]}if(b.align&&b.align!="auto")g.textAlign=b.align;if(b.position)g.position=b.position;if((!b.rect[2]||b.rect[2]<=0)&&(!b.rect[3]||b.rect[3]<=0))g.whiteSpace="nowrap";h.innerHTML=b.text}if(d)h.className=d;g.position="absolute";c=b.rect[0];k=b.rect[1];if(b.transform&&b.transform[0]){var j=b.transform[0][0],
                f=splitUnits(j);if(f&&f.units&&(j=f.num,f.units=="%"&&b.rect[2])){var f=b.rect[2],l=splitUnits(b.rect[2]);if(l&&l.units)f=l.num,l.units=="%"&&(f=f/100*e.offsetWidth);j=j/100*f;e.offsetWidth>0&&(j=j/e.offsetWidth*100)}if(f=splitUnits(c))c=f.num;c+=j;if(!f.units)f.units="px";c+=f.units;if(b.transform[0].length>1){j=b.transform[0][1];if((f=splitUnits(j))&&f.units)if(j=f.num,f.units=="%"&&b.rect[3]){f=b.rect[3];if((l=splitUnits(b.rect[3]))&&l.units)f=l.num,l.units=="%"&&(f=f/100*e.offsetHeight);j=j/100*
                f;e.offsetHeight>0&&(j=j/e.offsetHeight*100)}if(f=splitUnits(k))k=f.num;k+=j;if(!f.units)f.units="px";k+=f.units}}g.left=defaultUnits(c);g.top=defaultUnits(k);g.width=defaultUnits(b.rect[2]);g.height=defaultUnits(b.rect[3]);if(b.linkURL)htLookup[h.id]=b,h.onclick=function(){var a=htLookup[this.id];a.linkTarget?window.open(a.linkURL,a.linkTarget):window.location.href=a.linkURL},g.cursor="pointer";e.appendChild(h);if(b.c)for(g=0;g<b.c.length;g++)simpleContent(b.c[g],d,h)}}
            var fnCycle=function(a){a?fnCycle&&setTimeout(fnCycle,20):a={event:"loading",progress:0};loadingEvt&&loadingEvt(a)},aBootcompsLoaded=[];if(!window.AdobeEdge.bootstrapListeners)window.AdobeEdge.bootstrapListeners=[];window.AdobeEdge.bootstrapCallback=function(a){window.AdobeEdge.bootstrapListeners.push(a);if(aBootcompsLoaded.length>0)for(var d=0;d<aBootcompsLoaded.length;d++)a(aBootcompsLoaded[d])};if(!window.AdobeEdge.preloadComplete)window.AdobeEdge.preloadComplete={};
		//window.AdobeEdge.preloadComplete
            window.AdobeEdge.preloadComplete[compId]=function(a){
				presenter.loadMediaToAnimation(presenter.model);
                AdobeEdge.$_(".edgePreload"+a).css("display","none");
				fnCycle=null;loadingEvt&&loadingEvt({event:"done",progress:1,reason:"complete"});aBootcompsLoaded.push(a);for(var d=window.AdobeEdge.bootstrapListeners.length,e=0;e<d;e++)try{window.AdobeEdge.bootstrapListeners[e](a)}catch(b){console.log("bootstrap error "+b)}
				//hide loading icon
				var loadingIconImg = presenter.$view.find('.edge-loading-image')[0];
				$(loadingIconImg).css('display','none');
			};
			function isCapable(){if(hasTransform){if(requiresSVG&&!hasSVG)return!1;return!0}return!1}
            onDocLoaded = function(){window.AdobeEdge.loaded=!0;fnCycle({event:"begin"});isCapable()?(preContent&&preContent.dom&&simpleContent(preContent.dom,"edgePreload"+compId),filesToLoad&&!signaledLoading&&(loadResources(filesToLoad),filesToLoad=void 0)):dlContent&&dlContent.dom&&(loadingEvt&&loadingEvt({event:"done",progress:1,reason:"downlevel"}),simpleContent(dlContent.dom))};
            window.AdobeEdge = window.AdobeEdge || {};
            window.AdobeEdge.framework = 'jquery';

            onDocLoaded();

            requiresSVG=false;

            doDelayLoad=false;
            htFallbacks={
            };

            var edgeRuntimePath = DOMOperationsUtils.getResourceFullPath(presenter.playerController, "addons/resources/edge2.0.1.268.js");

            aLoader = [
                { load: edgeRuntimePath},
                { load: animation.edgeFile},
                { load: animation.edgeActionsFile}
            ];

            if (AdobeEdge.bootstrapLoading){
                signaledLoading = true;
                AdobeEdge.loadResources=doLoadResources;
                AdobeEdge.playWhenReady=playWhenReady;
            }

            loadResources(aLoader, doDelayLoad);
				
            preContent={
                dom: [
                ]};//simpleContent

            dlContent={dom: [ ]};//simpleContent

            AdobeEdge.loadResources();
			AdobeEdge.playWhenReady();
			
			AdobeEdge.bootstrapCallback(function(compId) {
				//necessary for situation with identical animations on succeeding pages
				$.each(AdobeEdge.compositionDefns, function() {
					this.launched = false;
				});
				presenter.setAutoplay(compId);//necessary for handling reset
			});
			
        })(animation.compositionClass);
    }
	
	presenter.setVisibility = function(isVisible) {
		presenter.isVisible = isVisible;
		presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
	};
	
	presenter.show = function() {
		presenter.setVisibility(true);
	};
	
	presenter.hide = function() {
		presenter.setVisibility(false);
	};	
	
	presenter.setAutoplay = function(compId){
		var myAnim = AdobeEdge.getComposition(compId),
		mySymbol = myAnim.getStage();
		presenter.autoplayState = mySymbol.timelines["Default Timeline"].autoPlay;
	};

    presenter.executeCommand = function(name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'switchAnimation': presenter.switchAnimation,
            'getEdgeComposition' : presenter.getEdgeComposition,
            'getEdgeStage' : presenter.getEdgeStage,
            'stop': presenter.stop,
            'play': presenter.play,
            'pause' : presenter.pause
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.switchAnimation = function(item){
        currentAnimationItem = item;
        $(presenter.Animations).each(function(i,v){
            if(item == (i+1)){
                $('#Stage' + presenter.addonID + v.compositionClass).css("display", "block");
            }else{
                $('#Stage' + presenter.addonID + v.compositionClass).css("display", "none");
            }
        });
    };

    presenter.pause = function(position){
        var currCompClass = presenter.Animations[currentAnimationItem - 1].compositionClass,
            myAnim = AdobeEdge.getComposition(currCompClass),
            mySymbol = myAnim.getSymbols("stage")[0],
            currentPosition = position != undefined ? position[0] : mySymbol.getPosition();

		//stop "stage" and all its children in their current positions
        mySymbol.stop(currentPosition);
        var childSymbols = mySymbol.getChildSymbols();
		
		pauseAllRecursively = function(symbols){
			$.each(symbols,function(i,child){
				child.stop(child.getPosition());
				var grandChildren = child.getChildSymbols();
				if(grandChildren.length>0){
					pauseAllRecursively(grandChildren);
				}
			});
		};
		pauseAllRecursively(childSymbols);
    };

    presenter.stop = function() {
        var currCompClass = presenter.Animations[currentAnimationItem - 1].compositionClass,
            myAnim = AdobeEdge.getComposition(currCompClass),
            mySymbol = myAnim.getSymbols("stage")[0];

		//stop "stage" and all its children in 0
        mySymbol.stop(0);
        var childSymbols = mySymbol.getChildSymbols();
		
		stopAllRecursively = function(symbols){
			$.each(symbols,function(i,child){
				child.stop(0);
				var grandChildren = child.getChildSymbols();
				if(grandChildren.length>0){
					stopAllRecursively(grandChildren);
				}
			});
		};
		stopAllRecursively(childSymbols);
    };

    presenter.play = function(position){
		var currCompClass = presenter.Animations[currentAnimationItem - 1].compositionClass;
		var myAnim = AdobeEdge.getComposition(currCompClass);
			mySymbol = myAnim.getStage(),
			currentPosition = position != undefined ? position[0] : mySymbol.getPosition();
		
		//play "stage" and all its children from their current positions
		mySymbol.play(currentPosition);
		var childSymbols = mySymbol.getChildSymbols();
		
		playAllRecursively = function(symbols){
			$.each(symbols,function(i,child){
				child.play(child.getPosition());
				var grandChildren = child.getChildSymbols();
				if(grandChildren.length>0){
					playAllRecursively(grandChildren);
				}
			});
		};
		playAllRecursively(childSymbols);
    };
	
	presenter.getEdgeComposition = function(Item){
		var i = Item != undefined ? Item[0] : currentAnimationItem;
		var currCompClass = presenter.Animations[i - 1].compositionClass;

		return AdobeEdge.getComposition(currCompClass);
    };
	
	presenter.getEdgeStage = function(Item){
		var i = Item != undefined ? Item[0] : currentAnimationItem;
		var currCompClass = presenter.Animations[i - 1].compositionClass;
		var myAnim = AdobeEdge.getComposition(currCompClass);
		
		return myAnim.getStage();
    };

    presenter.setShowErrorsMode = function(){
		return;
    };

    presenter.setWorkMode = function(){
        return;
    };

    presenter.reset = function(){
		var initAnimItem = presenter.model.initialAnimation+1;
		
		presenter.switchAnimation(initAnimItem);            
		
		presenter.stop(0);
		if(presenter.autoplayState){
			presenter.play(0);
		}

    };

    presenter.getState = function(){
		//stop "stage" and all its children
		$(Animations).each(function(i,animation){
			var currCompClass = animation.compositionClass,
				myAnim = AdobeEdge.getComposition(currCompClass),
				mySymbol = myAnim.getSymbols("stage")[0];

			mySymbol.stop(0);
			var childSymbols = mySymbol.getChildSymbols();
			
			stopAllRecursively = function(symbols){
				$.each(symbols,function(i,child){
					child.stop(0);
					var grandChildren = child.getChildSymbols();
					if(grandChildren.length>0){
						stopAllRecursively(grandChildren);
					}
				});
			};
			stopAllRecursively(childSymbols);
		});
		
        return JSON.stringify({
            'currentAnimationItem' : currentAnimationItem,
            'isVisible' : presenter.isVisible
        });
    };

    presenter.setState = function(state){
        var parsedState = JSON.parse(state);
	
		currentAnimationItem = parsedState.currentAnimationItem;
		presenter.isVisible = parsedState.isVisible;
		presenter.setVisibility(presenter.isVisible);
		
        //setting definitions launched to false, so the AdobeEdge.launchComposition has to create composition again
        $.each(AdobeEdge.compositionDefns, function() {
            this.launched = false;
        });
    };
	
    return presenter;
}