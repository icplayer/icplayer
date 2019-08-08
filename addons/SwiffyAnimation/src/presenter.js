function AddonSwiffyAnimation_create(){

    var presenter = function(){};

    presenter.run = function(view, model){
        presenter.view = view;
        presenter.$view = $(view);
        presenter.model = model;
        presenter.Animations = model.Animations;
        presenter.swiffyContainer = $(view).find('.swiffyContainer')[0];
        presenter.stage = [];
        presenter.swiffyObject = [];
        presenter.swiffyItem = [];
        presenter.animsLoaded = [];
        presenter.animsRunning = [];
        presenter.originalDisplay = presenter.$view.css('display') ? presenter.$view.css('display') : 'block';

        presenter.isVisible = model["Is Visible"] == 'True';
        presenter.setVisibility(presenter.isVisible);

        presenter.animationLoadedDeferred = [];
        presenter.animationLoaded = [];

        //show loading icon
        var loadingSrc = DOMOperationsUtils.getResourceFullPath(presenter.playerController, "media/loading.gif");
        presenter.loadingIconImg = $(view).find('.swiffy-loading-image')[0];
        $(presenter.loadingIconImg).css({
            left: (presenter.model.Width/2)-15 + 'px',
            top: (presenter.model.Height/2)-15 + 'px'
        });
        $(presenter.loadingIconImg).attr('src',loadingSrc);

        //determine presenter.currentAnimationItem
        if(model.initialAnimation === ""){
            model.initialAnimation = 1;
        } else {
            //incorrect model.initialAnimation number -> error
            if( model.initialAnimation < 1 || model.initialAnimation > presenter.Animations.length || model.initialAnimation%1 !== 0 ){
                presenter.errorHandler("Error: Incorrect Initial Animation number.");
                $(presenter.loadingIconImg).css('display','none');
                return;
            }
            model.initialAnimation = parseInt(model.initialAnimation, 10);
        }
        presenter.currentAnimationItem = model.initialAnimation;

        //loop through Animations
        $(presenter.Animations).each(function(i, animation){
            //initiate deferred for every animation
            presenter.animationLoadedDeferred[i+1] = new $.Deferred();
            presenter.animationLoaded[i+1] = presenter.animationLoadedDeferred[i+1].promise();

            //empty Swiffy Object file -> error
            if(animation.swiffyobject === ''){
                presenter.errorHandler("Error: Swiffy Object in Item "+(i+1)+" is missing.");
                $(presenter.loadingIconImg).css('display','none');
                return;
            }

            var visibility = "hidden";
            if(presenter.currentAnimationItem - 1 == i){
                visibility = "visible";
            }

            $(presenter.swiffyContainer).append('<div class="swiffyItem_'+i+' swiffyItem" style="position: absolute; width: 100%; height: 100%;"></div>');

            presenter.swiffyItem[i] = $(view).find('.swiffyItem_'+i)[0];
            $(presenter.swiffyItem[i]).css('visibility', visibility);

            if(animation.autoPlay === 'True'){
                presenter.animsRunning[i] = true;
            }else{
                presenter.animsRunning[i] = false;
            }

            if(animation.doNotPreload !== 'True'){
                presenter.animsLoaded[i] = true;

                $.getScript(animation.swiffyobject, function(){
                    presenter.swiffyObject[i] = swiffyobject;
                    presenter.stage[i] = new swiffy.Stage(presenter.swiffyItem[i],presenter.swiffyObject[i]);

                    if(animation.disableTransparentBackground === 'False'){
                        presenter.stage[i].setBackground(null);
                    }

                    if(presenter.animsRunning[i] === true){
                        presenter.stage[i].start();
                    }

                    presenter.animationLoadedDeferred[i+1].resolve();

                });//end getScript
            }

            //Last item, checking if all are loaded
            if(presenter.Animations.length == i+1){
                presenter.checkIfAllAnimationsAreLoaded();
            }

        });//end loop

        //stop propagation
        $(view).find('.swiffyContainer').click(function(e) {
            e.stopImmediatePropagation();
            e.stopPropagation();
        });

        view.addEventListener('DOMNodeRemoved', presenter.destroy);
    };

    presenter.checkIfAllAnimationsAreLoaded = function(){
        presenter.loaded = false;

        var count = 0;
        var last = 1;
        //loop through Animations
        $(presenter.Animations).each(function(i, animation){
            if(presenter.animsLoaded[i]){
                count++;
                last = i+1;
            }
        });

        if(count > 0){
            presenter.animationLoaded[last].then(function() {
                if(presenter.animsLoaded.length == last){
                    presenter.loaded = true;
                    //hide loading icon
                    $(presenter.loadingIconImg).css('display','none');
                }
            });
        }else{
            $(presenter.loadingIconImg).css('display','none');
        }
    }

    presenter.createPreview = function (view, model) {
        //presenter.run(view,model);
        presenter.$view = $(view);

        //ERROR CHECKING
        //incorrect model.initialAnimation number -> error
        if(model.initialAnimation === ""){
            model.initialAnimation = 1;
        } else {
            if( model.initialAnimation < 1 || model.initialAnimation > model.Animations.length || model.initialAnimation%1 !== 0 ){
                presenter.errorHandler("Error: Incorrect Initial Animation number.");
                return;
            }
            model.initialAnimation = parseInt(model.initialAnimation, 10);
        }
        //empty Swiffy Object file -> error
        $(model.Animations).each(function(i, animation){
            if(animation.swiffyobject === ''){
                presenter.errorHandler("Error: Swiffy Object in Item "+(i+1)+" is missing.");
                return;
            }
        });
        var message = "Preview unavailable in editor. Please use Preview button.";
        presenter.$view.prepend('<div style="color: #444444; font-size: 12px; font-family: Arial;">'+message+'</div>');
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'loadAnimation': presenter.loadAnimation,
            'start': presenter.start,
            'replay': presenter.replay,
            'setVars': presenter.setVars,
            'switchAnimation': presenter.switchAnimation
        };

        Commands.dispatch(commands, name, params[0], presenter);
    };

    presenter.loadAnimation = function(item){
        var i = typeof item !== 'undefined' ? i = item - 1 : i = presenter.currentAnimationItem - 1;
        var animation = presenter.Animations[i];

        if(typeof presenter.$view.find('.swiffyItem_'+i+' canvas')[0] === 'undefined'){

            $(presenter.loadingIconImg).css('display','block');
            presenter.animsLoaded[i] = true;

            $.getScript(animation.swiffyobject, function(){
                presenter.swiffyObject[i] = swiffyobject;
                presenter.stage[i] = new swiffy.Stage(presenter.swiffyItem[i],presenter.swiffyObject[i]);

                if(animation.disableTransparentBackground === 'False'){
                    presenter.stage[i].setBackground(null);
                }

                if(presenter.animsRunning[i] === true){
                    presenter.stage[i].start();
                }

                presenter.animationLoadedDeferred[i+1].resolve();

                if(presenter.currentAnimationItem - 1 == i){
                    $(presenter.loadingIconImg).css('display','none');
                }

                //stop propagation
                presenter.$view.find('.swiffyContainer').click(function(e){
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                });
            });//end getScript
        }
    };

    presenter.start = function(item){
        var i = typeof item !== 'undefined' ? i = item - 1 : i = presenter.currentAnimationItem - 1;
        if(presenter.animsRunning[i] === false && typeof presenter.stage[i] !== 'undefined'){
            presenter.stage[i].start();
        }
        if(presenter.animsLoaded[i] == true){
            presenter.animsRunning[i] = true;
        }
    };

    presenter.setVars = function(commands){
        presenter.animationLoaded[presenter.currentAnimationItem].then(function() {
            commands = commands.split(",");
            var i = presenter.currentAnimationItem-1;
            presenter.stage[i].setFlashVars(commands[0]+'='+commands[1]);
        });
    };

    presenter.errorHandler = function(message){
        presenter.$view.prepend('<div style="color: red; font-size: 12px; font-family: Arial;">'+message+'</div>');
    };

    presenter.setVisibility = function(isVisible) {
        presenter.isVisible = isVisible;
        presenter.$view.css("display", isVisible ? presenter.originalDisplay : "none");
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.show = function() {
        presenter.setVisibility(true);
    };

    presenter.hide = function() {
        presenter.setVisibility(false);

    };

    presenter.replay = function(item){
        var itemToDestroy = typeof item !== 'undefined' ? itemToDestroy = item - 1 : itemToDestroy = presenter.currentAnimationItem - 1;
        if(presenter.animsRunning[itemToDestroy] === true && typeof presenter.stage[itemToDestroy] !== 'undefined'){
            var currentSwiffyObject = presenter.swiffyObject[itemToDestroy];
            presenter.swiffyItem = presenter.$view.find('.swiffyItem_'+itemToDestroy)[0];
            presenter.stage[itemToDestroy].destroy();
            presenter.stage[itemToDestroy] = new swiffy.Stage(presenter.swiffyItem,currentSwiffyObject, { });
            if(presenter.Animations[itemToDestroy].disableTransparentBackground === 'False'){
                presenter.stage[itemToDestroy].setBackground(null);
            }
            presenter.stage[itemToDestroy].start();
        }
    };

    presenter.switchAnimation = function(item){
        presenter.currentAnimationItem = item;
        $(presenter.Animations).each(function(i,v){
            if(item == (i+1)){
                $(presenter.$view.find('.swiffyItem_'+i)[0]).css("visibility", "visible");
            }else{
                $(presenter.$view.find('.swiffyItem_'+i)[0]).css("visibility", "hidden");
            }
        });
    };

    presenter.reset = function(){
        if(presenter.loaded === true){
            presenter.loaded = false;
            $(presenter.swiffyContainer).html("");
            $(presenter.Animations).each(function(i, animation){
                if(presenter.animsRunning[i] === true && typeof presenter.stage[i] !== 'undefined'){
                    presenter.stage[i].destroy();
                }
            });
            $(presenter.loadingIconImg).css('display','block');
            presenter.run(presenter.view,presenter.model);
        }
    };

    presenter.getState = function(){
        return JSON.stringify({
            'currentAnimationItem' : presenter.currentAnimationItem,
            'animsRunning' : presenter.animsRunning,
            'animsLoaded' : presenter.animsLoaded,
            'isVisible' : presenter.isVisible
        });
    };

    presenter.setState = function(state){
        var parsedState = JSON.parse(state);

        presenter.currentAnimationItem = parsedState.currentAnimationItem;
        presenter.switchAnimation(presenter.currentAnimationItem);

        presenter.isVisible = parsedState.isVisible;
        presenter.setVisibility(presenter.isVisible);

        presenter.animsRunning = parsedState.animsRunning;
        presenter.animsLoaded = parsedState.animsLoaded;

        $(presenter.animsLoaded).each(function(i, loaded){

            if(loaded && presenter.Animations[i].doNotPreload === 'True'){
                var item = parseInt(i+1,10);
                presenter.loadAnimation(item);
            }
        });

    };

    presenter.destroy = function() {
        if(presenter.loaded === true){
            presenter.loaded = false;
            $(presenter.swiffyContainer).html("");
            $(presenter.Animations).each(function(i, animation){
                if(presenter.animsRunning[i] === true && typeof presenter.stage[i] !== 'undefined'){
                    presenter.stage[i].destroy();
                }
            });
        }
    };

    return presenter;
}