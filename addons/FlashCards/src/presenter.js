function AddonFlashcards_create(){
			
    var presenter = function(){}

    presenter.configuration = {
        isVisible: false,
        currentCard: 1,
        NoLoop: false,
        IsActivity: false,
        Favourites: false
    };

    presenter.state = {
		isVisible: false,
        currentCard: 1,
        totalCards: 1,
        NoLoop: false,
        IsActivity: false,
        Favourites: false,
        ShowOnlyFavourites: false,
        cardsScore: null,
        cardsFavourites: null
	};

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();
    };

    presenter.createEventData = function(i,v,s) {
        return {
            source : presenter.configuration.addonID,
            item: i,
            value: v,
            score: s
        };
    };

	presenter.triggerEvent = function(i,v,s) {
        var eventData = presenter.createEventData(i,v,s);
        presenter.eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.validateModel = function(model) {
		return {
			isValid: true,
			isVisible: ModelValidationUtils.validateBoolean(model["Is Visible"]),
            NoLoop: ModelValidationUtils.validateBoolean(model['NoLoop']),
			Favourites: ModelValidationUtils.validateBoolean(model['Favourites']),
			HidePrevNext: ModelValidationUtils.validateBoolean(model['HidePrevNext']),
            ShowButtons: ModelValidationUtils.validateBoolean(model['ShowButtons']),
			IsActivity: ModelValidationUtils.validateBoolean(model["IsActivity"]),
            currentCard: presenter.configuration.currentCard,
            cardsScore: [],
            cardsFavourites: [],
			addonID: model['ID']
		}
	};

    presenter.init = function(view, model){
        var validatedModel = presenter.validateModel(model);
        presenter.configuration = validatedModel;
        presenter.Cards = model.Cards;
        presenter.state.isVisible = presenter.configuration.isVisible;
        presenter.state.NoLoop = presenter.configuration.NoLoop;
        presenter.state.cardsScore = presenter.configuration.cardsScore;
        presenter.state.cardsFavourites = presenter.configuration.cardsFavourites;

        //console.log(model.ID+" init, config:");
        //console.log(presenter.configuration);

        presenter.view = view;
        presenter.$view = $(view);
        presenter.model = model;
        presenter.$card = $(presenter.$view.find(".flashcards-card").get(0));

        $(presenter.Cards).each(function(k,v){
            presenter.state.cardsScore[k] = 0;
            presenter.state.cardsFavourites[k] = false;
        });

        presenter.state.totalCards = presenter.Cards.length;

        if(presenter.configuration.HidePrevNext){
            $(presenter.$view.find(".flashcards-prev").get(0)).hide();
            $(presenter.$view.find(".flashcards-next").get(0)).hide();
        }
        if(!presenter.configuration.ShowButtons){
            $(presenter.$view.find(".flashcards-buttons").get(0)).hide();
        }
        if(presenter.configuration.Favourites == false){
            $(presenter.$view.find(".flashcards-button-favourite").get(0)).hide();
        }        

        presenter.showCard(1);
        presenter.addClickHandlers();

        //audio
        presenter.isFrontPlaying = false;
        presenter.isBackPlaying = false;
    };

    presenter.countFavourites = function(){
        var i = 0;
        $(presenter.Cards).each(function(k,v){
            if(presenter.state.cardsFavourites[k] == true){i++};
        });
        return i;
    };

    presenter.countNonFavouritesBefore = function(k){
        var i = 0;
        for(j = 0; j < k; j++){
            if(presenter.state.cardsFavourites[j] == false){i++};
        }
        return i;
    };

    presenter.addClickHandlers = function(){
        //FLIP, PREV & NEXT
        $(presenter.$view.find(".flashcards-card-contents")).click(function(e) {
            e.preventDefault();
            presenter.revertCard();
        });
        $(presenter.$view.find(".flashcards-prev")).click(function(e) {
            e.preventDefault();
            presenter.prevCard();
        });
        $(presenter.$view.find(".flashcards-next")).click(function(e) {
            e.preventDefault();
            presenter.nextCard();
        });

        //SCORE BUTTONS
        $(presenter.$view.find(".flashcards-button-wrong")).click(function() {
            presenter.state.cardsScore[presenter.state.currentCard] = -1;
            $(presenter.$view.find(".flashcards-button")).removeClass("flashcards-button-selected");
            $(this).addClass("flashcards-button-selected");
        });
        $(presenter.$view.find(".flashcards-button-correct")).click(function() {
            presenter.state.cardsScore[presenter.state.currentCard] = 1;
            $(presenter.$view.find(".flashcards-button")).removeClass("flashcards-button-selected");
            $(this).addClass("flashcards-button-selected");
        });
        $(presenter.$view.find(".flashcards-button-reset")).click(function() {
            presenter.state.cardsScore[presenter.state.currentCard] = 0;
            $(presenter.$view.find(".flashcards-button")).removeClass("flashcards-button-selected");
        });

        //FAVOURITE BUTTON
        $(presenter.$view.find(".flashcards-button-favourite")).click(function() {
            if(presenter.state.cardsFavourites[presenter.state.currentCard-1] == false){
                presenter.state.cardsFavourites[presenter.state.currentCard-1] = true;
                $(this).addClass("flashcards-button-selected");
                presenter.triggerEvent(presenter.state.currentCard,"favourite","");
            }else{
                presenter.state.cardsFavourites[presenter.state.currentCard-1] = false;
                $(this).removeClass("flashcards-button-selected");
                presenter.triggerEvent(presenter.state.currentCard,"unfavourite","");
            }            
        });

        //AUDIO
        $(presenter.$view.find(".flashcards-card-audio-button-front")).click(function() {
            presenter.audioElementFront =  presenter.$view.find(".flashcards-card-audio-front").get(0);
            if(presenter.isFrontPlaying == false){
                presenter.isFrontPlaying = true;
                presenter.audioElementFront.play();
                $(presenter.$view.find(".flashcards-card-audio-button-front")).addClass("playing");
            }else{
                presenter.isFrontPlaying = false;
                presenter.audioElementFront.pause();
                $(presenter.$view.find(".flashcards-card-audio-button-front")).removeClass("playing");
            }
        });
        $(presenter.$view.find(".flashcards-card-audio-button-back")).click(function() {
            presenter.audioElementBack =  presenter.$view.find(".flashcards-card-audio-back").get(0);
            if(presenter.isBackPlaying == false){
                presenter.isBackPlaying = true;
                presenter.audioElementBack.play();
                $(presenter.$view.find(".flashcards-card-audio-button-back")).addClass("playing");
            }else{
                presenter.isBackPlaying = false;
                presenter.audioElementBack.pause();
                $(presenter.$view.find(".flashcards-card-audio-button-back")).removeClass("playing");
            }
        });  
    };

    presenter.removeClickHandlers = function(){
        //FLIP, PREV & NEXT
        $(presenter.$view.find(".flashcards-card-contents")).unbind();
        $(presenter.$view.find(".flashcards-prev")).unbind();
        $(presenter.$view.find(".flashcards-next")).unbind();

        //SCORE BUTTONS
        $(presenter.$view.find(".flashcards-button-wrong")).unbind();
        $(presenter.$view.find(".flashcards-button-correct")).unbind();
        $(presenter.$view.find(".flashcards-button-reset")).unbind();

        //FAVOURITE BUTTON
        $(presenter.$view.find(".flashcards-button-favourite")).unbind();

        //AUDIO
        $(presenter.$view.find(".flashcards-card-audio-button-front")).unbind();
        $(presenter.$view.find(".flashcards-card-audio-button-back")).unbind();
    };
    
    presenter.run = function(view, model){
		presenter.init(view, model);
	};
    
    presenter.createPreview = function(view, model) {
		presenter.init(view, model);
	};

    presenter.revertCard = function(){
        presenter.$card.find(".flashcards-card-back .flashcards-card-contents").show();
        $(presenter.$view.find(".flashcards-card").get(0)).toggleClass("flashcards-card-reversed");
    };

    presenter.prevCard = function(){
        if(presenter.state.currentCard>1){
            presenter.state.currentCard -= 1;
        }else if(presenter.state.NoLoop == false){
            presenter.state.currentCard = presenter.state.totalCards;
        }
        presenter.showCard(presenter.state.currentCard);
    };

    presenter.nextCard = function(){
        if(presenter.state.currentCard < presenter.state.totalCards){
            presenter.state.currentCard += 1;
        }else if(presenter.state.NoLoop == false){
            presenter.state.currentCard = 1;
        }
        presenter.showCard(presenter.state.currentCard);
    };

    presenter.showCard = function(i){
        i = parseInt(i,10);
        if(presenter.state.ShowOnlyFavourites == true && presenter.countFavourites() > 0 ){
            if(presenter.state.cardsFavourites[presenter.state.currentCard-1] == true){
                presenter.displayCard(i);
            }else{
                if(i <= presenter.state.totalCards){
                    presenter.nextCard();
                }
            }
        }else{
            presenter.displayCard(i);
        }        
    };

    presenter.displayCard = function(i){
        if(presenter.state.NoLoop){
            $(presenter.$view.find(".flashcards-prev").get(0)).attr("disabled", false);
            $(presenter.$view.find(".flashcards-next").get(0)).attr("disabled", false);
            if(i == 1){
                $(presenter.$view.find(".flashcards-prev").get(0)).attr("disabled", true);
            }else if(i == presenter.state.totalCards){
                $(presenter.$view.find(".flashcards-next").get(0)).attr("disabled", true);
            }
        }

        var currentCardNumber = i;
        var totalCardsNuber = 0;
        if(presenter.state.ShowOnlyFavourites == true){
            currentCardNumber = i - presenter.countNonFavouritesBefore(i);
            totalCardsNuber = presenter.countFavourites();
        }else{
            totalCardsNuber = presenter.state.totalCards;
        }
        presenter.$view.find(".flashcards-panel").get(0).innerHTML = currentCardNumber + "/" + totalCardsNuber;
        presenter.$card.find(".flashcards-card-back .flashcards-card-contents").hide();
        presenter.$card.removeClass("flashcards-card-reversed");

        presenter.$view.find(".flashcards-card-contents-front").get(0).innerHTML = presenter.Cards[i-1].Front;
        presenter.$view.find(".flashcards-card-contents-back").get(0).innerHTML = presenter.Cards[i-1].Back;

        //SCORE BUTTONS
        $(presenter.$view.find(".flashcards-button")).removeClass("flashcards-button-selected");
        if(presenter.state.cardsScore[presenter.state.currentCard] == 1){
            $(presenter.$view.find(".flashcards-button-correct")).addClass("flashcards-button-selected");
        }
        if(presenter.state.cardsScore[presenter.state.currentCard] == -1){
            $(presenter.$view.find(".flashcards-button-wrong")).addClass("flashcards-button-selected");
        }

        //FAV BUTTON
        if(presenter.state.cardsFavourites[presenter.state.currentCard-1] == true){
            $(presenter.$view.find(".flashcards-button-favourite")).addClass("flashcards-button-selected");
        }else{
            $(presenter.$view.find(".flashcards-button-favourite")).removeClass("flashcards-button-selected");
        }

        //AUDIO - front
        presenter.isFrontPlaying = false;
        presenter.audioElementFront =  presenter.$view.find(".flashcards-card-audio-front").get(0);
        $(presenter.$view.find(".flashcards-card-audio-button-front")).removeClass("playing");
        $(presenter.$view.find(".flashcards-card-audio-button-front")).addClass("disabled");
        if(presenter.Cards[presenter.state.currentCard-1].AudioFront != ""){
            $(presenter.$view.find(".flashcards-card-audio-wrapper-front")).show();
            if (presenter.audioElementFront.canPlayType("audio/mpeg")) {
                presenter.audioElementFront.setAttribute("src",presenter.Cards[presenter.state.currentCard-1].AudioFront);
                presenter.audioElementFront.oncanplay = function() {
                    $(presenter.$view.find(".flashcards-card-audio-button-front")).removeClass("disabled");
                };
            } 
        }else{
            presenter.audioElementFront.setAttribute("src","");
            $(presenter.$view.find(".flashcards-card-audio-wrapper-front")).hide();
        }
        //AUDIO - back
        presenter.isBackPlaying = false;
        presenter.audioElementBack =  presenter.$view.find(".flashcards-card-audio-back").get(0);
        $(presenter.$view.find(".flashcards-card-audio-button-back")).removeClass("playing");
        $(presenter.$view.find(".flashcards-card-audio-button-back")).addClass("disabled");
        if(presenter.Cards[presenter.state.currentCard-1].AudioBack != ""){
            $(presenter.$view.find(".flashcards-card-audio-wrapper-back")).show();
            if (presenter.audioElementBack.canPlayType("audio/mpeg")) {
                presenter.audioElementBack.setAttribute("src",presenter.Cards[presenter.state.currentCard-1].AudioBack);
                presenter.audioElementBack.oncanplay = function() {
                    $(presenter.$view.find(".flashcards-card-audio-button-back")).removeClass("disabled");
                };
            } 
        }else{
            presenter.audioElementBack.setAttribute("src","");
            $(presenter.$view.find(".flashcards-card-audio-wrapper-back")).hide();
        }
    };

    presenter.show = function(){
        presenter.setVisibility(true);
    };

    presenter.hide = function(){
        presenter.setVisibility(false);
    };

    presenter.setVisibility = function(isVisible) {
        presenter.state.isVisible = isVisible;
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.updateVisibility = function() {
        (presenter.state.isVisible) ? presenter.show() : presenter.hide();
    };

    presenter.setShowErrorsMode = function(){
        presenter.removeClickHandlers();
    }; 

    presenter.setWorkMode = function(){
        presenter.addClickHandlers();
    };

    presenter.ShowOnlyFavourites = function(){
        presenter.state.ShowOnlyFavourites = true;
        presenter.showCard(presenter.state.currentCard);
    };
    presenter.ShowAllCards = function(){
        presenter.state.ShowOnlyFavourites = false;
        presenter.showCard(presenter.state.currentCard);
    };

    presenter.resetFavourites = function(){
        presenter.state.ShowOnlyFavourites = false;
        $(presenter.Cards).each(function(k,v){
            presenter.state.cardsFavourites[k] = false;
        });
        $(presenter.$view.find(".flashcards-button-favourite")).removeClass("flashcards-button-selected");
    };
    
    presenter.reset = function() {
        presenter.state.ShowOnlyFavourites = false;
        presenter.state.currentCard = presenter.configuration.currentCard;

        presenter.state.isVisible = presenter.configuration.isVisible;
        presenter.updateVisibility();

        $(presenter.model.Cards).each(function(k,v){
            presenter.state.cardsScore[k] = 0;
            presenter.state.cardsFavourites[k] = false;
        });

        presenter.showCard(presenter.state.currentCard);
    };
    
    presenter.getErrorCount = function(){
        var errors = null;
        if(presenter.configuration.IsActivity){
            errors = 0;
            $(presenter.state.cardsScore).each(function(k,v){
                if(presenter.state.cardsScore[k] == -1){
                    errors++;
                }
            });
        }
        return errors;
    };
    
    presenter.getMaxScore = function(){
        var maxScore = null;
        if(presenter.configuration.IsActivity){
            maxScore = presenter.state.totalCards;
        }
        return maxScore;
    };
    
    presenter.getScore = function(){
        var score = null;
        if(presenter.configuration.IsActivity){
            score = 0;
            $(presenter.state.cardsScore).each(function(k,v){
                if(presenter.state.cardsScore[k] == 1){
                    score++;
                }
            });
        }
        return score;
    };

    presenter.executeCommand = function (name, params) {
		var commands = {
			'show': presenter.show,
			'hide': presenter.hide,
            'nextCard': presenter.nextCard,
            'prevCard': presenter.prevCard,
			'reset': presenter.reset,
            'resetFavourites': presenter.resetFavourites,
            'ShowOnlyFavourites': presenter.ShowOnlyFavourites,
            'ShowAllCards': presenter.ShowAllCards,
            'countFavourites': presenter.countFavourites
		};
		Commands.dispatch(commands, name, params, presenter);
	};
    
    presenter.getState = function(){
        return JSON.stringify({
            state: presenter.state
        });
    };

    presenter.setState = function(stateString){
        if (ModelValidationUtils.isStringEmpty(stateString)) return;
        var parsedState = JSON.parse(stateString);
        presenter.state = parsedState.state;

        presenter.updateVisibility();
        presenter.showCard(presenter.state.currentCard);
    };

    presenter.destroy = function (event) {
        presenter.view.removeEventListener('DOMNodeRemoved', presenter.destroy);

        $(presenter.$view.find(".flashcards-card-contents")).unbind();
        $(presenter.$view.find(".flashcards-button-wrong")).unbind();
        $(presenter.$view.find(".flashcards-button-correct")).unbind();
        $(presenter.$view.find(".flashcards-button-reset")).unbind();
        $(presenter.$view.find(".flashcards-button-favourites")).unbind();
        $(presenter.$view.find(".flashcards-prev")).unbind();
        $(presenter.$view.find(".flashcards-next")).unbind();
        
    };

    return presenter;
}