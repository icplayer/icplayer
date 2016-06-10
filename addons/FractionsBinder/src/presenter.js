function AddonFractionsBinder_create(){
			
        var presenter = function () {};

    presenter.configuration = {};
    presenter.loadFirstTime = true;
    presenter.isPreview = false;

    function presenterLogic () {
        if(presenter.isPreview) return;
        presenter.addons = (presenter.model.Addons).split('\n');
        presenter.$view.css('visible', 'hidden');
        presenter.CorrectElements = presenter.model.CorrectElements;
        presenter.check = {};
        presenter.initialMarks = 0;

        for (var i = 0; i < presenter.addons.length; i++) {

                    if(presenter.getFraction(presenter.addons[i]) != null && presenter.getFraction(presenter.addons[i]).allElements != undefined){
                        presenter.check[i] = true;
                        //presenter.initialMarks = presenter.initialMarks + presenter.getFraction(presenter.addons[i]).getInitialMarks();
                        presenter.initialMarks = presenter.initialMarks + presenter.getFraction(presenter.addons[i]).getCurrentNumber();
                    } else{
                        presenter.check[i] = false;
                   }
            }

       presenter.loadFirstTime = false;
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();
        presenter.eventBus.addEventListener('ValueChanged', this);
    };

    presenter.getFraction = function (moduleID) {
        return presenter.playerController.getModule(moduleID);
    };

    presenter.run = function (view, model) {
        presenter.$view = $(view);
        presenter.model = model;
        presenter.isPreview = false;
        //if(presenter.loadFirstTime) presenterLogic();

            presenter.eventBus.addEventListener('ShowAnswers', this);
            presenter.eventBus.addEventListener('HideAnswers', this);
            presenter.eventBus.addEventListener('PageLoaded', this);
            //presenter.eventBus.addEventListener('AddonFractionsBinder', this);

        //presenter.playerController.getEventBus().sendEvent('AddonFractionsBinder', {view,model,false});
    };


    presenter.triggerFrameChangeEvent = function(view,model,isPreview) {
        presenter.eventBus.sendEvent('AddonFractionsBinder', '');

    };


    presenter.createPreview = function (view, model) {
        presenter.$view = $(view);
        presenter.model = model;

        presenter.isPreview = true;

        if(presenter.loadFirstTime) presenterLogic();
    };

    presenter.getState = function () {
        var addons = presenter.addons;
        var check = presenter.check;
        var loadFirstTime = presenter.loadFirstTime;
        var initialMarks = presenter.initialMarks;
        var correct = presenter.CorrectElements;
        return JSON.stringify({
            correct: correct,
            check: check,
            addons: addons,
            loadFirstTime : loadFirstTime,
            initialMarks : initialMarks
        });
    };

    presenter.setState = function (state) {

        var parsedState = JSON.parse(state);
        presenter.check = parsedState.check;
        presenter.addons = parsedState.addons;
        presenter.initialMarks = parsedState.initialMarks;
        presenter.loadFirstTime = parsedState.loadFirstTime;
        presenter.CorrectElements = parsedState.correct;
        /*
        for (var i = 0; i < presenter.addons.length; i++) {

                    if(presenter.check[i]){
                        presenter.getFraction(presenter.addons[i]).markAsEmpty();
                    }
            }
            */
    };

    presenter.getMaxScore = function () {
        //if(presenter.loadFirstTime) presenterLogic();
        if(presenter.initialMarks == presenter.CorrectElements) {
            return 0;
        } else {
            return 1;
        }
    };


    presenter.getScore = function () {
        //if(presenter.loadFirstTime) presenterLogic();

            if(presenter.initialMarks == presenter.CorrectElements) {
                return 0;
            } else{
                return presenter.currentMarks() == presenter.CorrectElements ? 1 : 0;
            }
        //} else {
          //  return 0;
        //}
    };

    presenter.getErrorCount = function () {
        //if(!presenter.loadFirstTime){
            if(presenter.initialMarks == presenter.CorrectElements && presenter.currentMarks() != presenter.CorrectElements) {
                return 1;
            }

            if(presenter.initialMarks == presenter.currentMarks()) {
                return 0;

            } else {
                return presenter.getMaxScore() - presenter.getScore();

            }
        //} else{
        //    return 0;
        //}
    };


    presenter.setShowErrorsMode = function () {
        //if(presenter.loadFirstTime) presenterLogic();
         //fractions markAsCorrect || markAsWrong
        var current = presenter.currentMarks();
            if(presenter.initialMarks != current){
                 if(current == presenter.CorrectElements){

                        for (var i = 0; i < presenter.addons.length; i++) {

                            if(presenter.check[i]){
                                presenter.getFraction(presenter.addons[i]).markAsCorrect();
                                //presenter.getFraction(presenter.addons[i]).isErrorCheckMode(true);
                            }
                        }

                 } else{
                        for (var i = 0; i < presenter.addons.length; i++) {

                            if(presenter.check[i]){
                                presenter.getFraction(presenter.addons[i]).markAsWrong();
                               //presenter.getFraction(presenter.addons[i]).isErrorCheckMode(true);
                            }
                        }
                 }


            }


    };

    presenter.currentMarks = function(){
        var marks = 0;
        for (var i = 0; i < presenter.addons.length; i++) {

                if(presenter.check[i]){
                    marks = marks + presenter.getFraction(presenter.addons[i]).getCurrentNumberSA();
                }
        }
        return marks;
    };

    presenter.setWorkMode = function () {

            for (var i = 0; i < presenter.addons.length; i++) {

                    if(presenter.check[i]){
                        presenter.getFraction(presenter.addons[i]).markAsEmpty();
                        presenter.getFraction(presenter.addons[i]).isErrorCheckMode(false);
                    }
            }

    };

    presenter.showAnswers = function () {
        //if(presenter.loadFirstTime) presenterLogic();
        var elementsLeft = presenter.CorrectElements;
        var elements = 0;
        var showElements = 0;
            for (var i = 0; i < presenter.addons.length; i++) {

                    if(presenter.check[i]){
                        if(elementsLeft > 0){
                            elements = presenter.getFraction(presenter.addons[i]).allElements();
                            showElements = elementsLeft - elements > 0 ? elements : elementsLeft;
                            elementsLeft = elementsLeft - elements > 0 ? elementsLeft - elements : 0;
                        } else {
                            showElements = 0;
                        }
                    //console.log(elementsLeft);
                    //console.log(showElements);
                        presenter.getFraction(presenter.addons[i]).markAsEmpty();

                            presenter.getFraction(presenter.addons[i]).showElementsSA(showElements);
                                //presenter.getFraction(presenter.addons[i]).isErrorCheckMode(true);

                        //presenter.getFraction(presenter.addons[i]).addShowAnswersClass();
                    }
            }

        //presenter.CorrectElements

        //fractions showElementsSA(ilosc_elementow)
    };

    presenter.hideAnswers = function () {

        for (var i = 0; i < presenter.addons.length; i++) {

                    if(presenter.check[i]){
                        presenter.getFraction(presenter.addons[i]).hideElementsSA();
                        //presenter.getFraction(presenter.addons[i]).isErrorCheckMode(false);
                        //presenter.getFraction(presenter.addons[i]).removeShowAnswersClass();
                    }
        }

    };

    presenter.reset = function () {

        //fractions markAsEmpty

    };

    presenter.onEventReceived = function (eventName, eventData) {

        if (eventName == "PageLoaded"){
            if(presenter.loadFirstTime) presenterLogic();
        }

        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        }

        if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        }


    };

    return presenter;
}