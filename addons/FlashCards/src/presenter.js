function AddonFlashCards_create(){
			
    var presenter = function () {}

    presenter.configuration = {
        isVisible: false,
        currentCard: 1,
        noLoop: false,
        IsActivity: false,
        Favourites: false
    };

    presenter.state = {
		isVisible: false,
        currentCard: 1,
        totalCards: 1,
        noLoop: false,
        IsActivity: false,
        Favourites: false,
        ShowOnlyFavourites: false,
        cardsScore: null,
        cardsFavourites: null
	};

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();
    };

    presenter.createEventData = function (item, value, score) {
        return {
            source : presenter.configuration.addonID,
            item: item,
            value: value,
            score: score
        };
    };

	presenter.triggerEvent = function (item, value, score) {
        var eventData = presenter.createEventData(item, value, score);
        presenter.eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.validateModel = function (model) {
		return {
			isValid: true,
			isVisible: ModelValidationUtils.validateBoolean(model["Is Visible"]),
            noLoop: ModelValidationUtils.validateBoolean(model['NoLoop']),
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

    presenter.init = function (view, model) {
        var validatedModel = presenter.validateModel(model);
        presenter.configuration = validatedModel;
        presenter.isErrorMode = false;
        presenter.Cards = model.Cards;
        presenter.state.isVisible = presenter.configuration.isVisible;
        presenter.state.noLoop = presenter.configuration.noLoop;
        presenter.state.cardsScore = presenter.configuration.cardsScore;
        presenter.state.cardsFavourites = presenter.configuration.cardsFavourites;

        presenter.view = view;
        presenter.$view = $(view);
        presenter.flashcardsPrev = presenter.$view.find(".flashcards-prev");
        presenter.flashcardsNext = presenter.$view.find(".flashcards-next");
        presenter.flashcardsButtonFavourite = presenter.$view.find(".flashcards-button-favourite");
        presenter.flashcardsButtonWrong = presenter.$view.find(".flashcards-button-wrong");
        presenter.flashcardsButtonCorrect = presenter.$view.find(".flashcards-button-correct");
        presenter.flashcardsButtonReset = presenter.$view.find(".flashcards-button-reset");
        presenter.flashcardsButton = presenter.$view.find(".flashcards-button");
        presenter.flashcardsCardAudioButtonFront = presenter.$view.find(".flashcards-card-audio-button-front");
        presenter.flashcardsCardAudioButtonBack = presenter.$view.find(".flashcards-card-audio-button-back");
        presenter.audioElementBack =  presenter.$view.find(".flashcards-card-audio-back").get(0);
        presenter.audioElementFront =  presenter.$view.find(".flashcards-card-audio-front").get(0);
        
        presenter.model = model;
        presenter.$card = $(presenter.$view.find(".flashcards-card").get(0));

        $(presenter.Cards).each(function (key) {
            presenter.state.cardsScore[key] = 0;
            presenter.state.cardsFavourites[key] = false;
        });

        presenter.state.totalCards = presenter.Cards.length;

        if (presenter.configuration.HidePrevNext) {
            $(presenter.flashcardsPrev.get(0)).hide();
            $(presenter.flashcardsNext.get(0)).hide();
        }
        if (!presenter.configuration.ShowButtons) {
            $(presenter.$view.find(".flashcards-buttons").get(0)).hide();
        }
        if (presenter.configuration.Favourites == false) {
            $(presenter.flashcardsButtonFavourite.get(0)).hide();
        }        

        presenter.showCard(1);
        presenter.addClickHandlers();

        //audio
        presenter.isFrontPlaying = false;
        presenter.isBackPlaying = false;
    };

    presenter.countFavourites = function () {
        var i = 0;
        $(presenter.Cards).each(function (k,v) {
            if (presenter.state.cardsFavourites[k] == true){i++};
        });
        return i;
    };

    presenter.countNonFavouritesBefore = function (k) {
        var i = 0;
        for(j = 0; j < k; j++){
            if (presenter.state.cardsFavourites[j] == false){i++};
        }
        return i;
    };

    presenter.addClickHandlers = function () {
        //FLIP, PREV & NEXT
        $(presenter.$view.find(".flashcards-card-contents")).click(function (e) {
            if (presenter.isErrorMode) return;
            e.preventDefault();
            presenter.revertCard();
        });
        $(presenter.flashcardsPrev).click(function (e) {
            if (presenter.isErrorMode) return;
            e.preventDefault();
            presenter.prevCard();
        });
        $(presenter.flashcardsNext).click(function (e) {
            if (presenter.isErrorMode) return;
            e.preventDefault();
            presenter.nextCard();
        });

        //SCORE BUTTONS
        $(presenter.flashcardsButtonWrong).click(function () {
            if (presenter.isErrorMode) return;
            presenter.state.cardsScore[presenter.state.currentCard] = -1;
            $(presenter.flashcardsButton).removeClass("flashcards-button-selected");
            $(this).addClass("flashcards-button-selected");
        });
        $(presenter.flashcardsButtonCorrect).click(function () {
            if (presenter.isErrorMode) return;
            presenter.state.cardsScore[presenter.state.currentCard] = 1;
            $(presenter.flashcardsButton).removeClass("flashcards-button-selected");
            $(this).addClass("flashcards-button-selected");
        });
        $(presenter.flashcardsButtonReset).click(function () {
            if (presenter.isErrorMode) return;
            presenter.state.cardsScore[presenter.state.currentCard] = 0;
            $(presenter.flashcardsButton).removeClass("flashcards-button-selected");
        });

        //FAVOURITE BUTTON
        $(presenter.flashcardsButtonFavourite).click(function () {
            if (presenter.isErrorMode) return;
            if (presenter.state.cardsFavourites[presenter.state.currentCard - 1] == false){
                presenter.state.cardsFavourites[presenter.state.currentCard - 1] = true;
                $(this).addClass("flashcards-button-selected");
                presenter.triggerEvent(presenter.state.currentCard,"favourite","");
            }else{
                presenter.state.cardsFavourites[presenter.state.currentCard - 1] = false;
                $(this).removeClass("flashcards-button-selected");
                presenter.triggerEvent(presenter.state.currentCard,"unfavourite","");
            }            
        });

        //AUDIO
        $(presenter.flashcardsCardAudioButtonFront).click(function () {
            if (presenter.isErrorMode) return;
            
            if (presenter.isFrontPlaying == false) {
                presenter.isFrontPlaying = true;
                presenter.audioElementFront.play();
                $(presenter.flashcardsCardAudioButtonFront).addClass("playing");
            }else{
                presenter.isFrontPlaying = false;
                presenter.audioElementFront.pause();
                $(presenter.flashcardsCardAudioButtonFront).removeClass("playing");
            }
        });
        $(presenter.flashcardsCardAudioButtonBack).click(function () {
            if (presenter.isErrorMode) return;
            presenter.audioElementBack =  presenter.$view.find(".flashcards-card-audio-back").get(0);
            if (presenter.isBackPlaying == false) {
                presenter.isBackPlaying = true;
                presenter.audioElementBack.play();
                $(presenter.flashcardsCardAudioButtonBack).addClass("playing");
            }else{
                presenter.isBackPlaying = false;
                presenter.audioElementBack.pause();
                $(presenter.flashcardsCardAudioButtonBack).removeClass("playing");
            }
        });  
    };
    
    presenter.run = function (view, model) {
		presenter.init(view, model);
	};
    
    presenter.createPreview = function (view, model) {
		presenter.init(view, model);
	};

    presenter.revertCard = function () {
        presenter.isFrontPlaying = false;
        presenter.audioElementFront.pause();
        $(presenter.flashcardsCardAudioButtonFront).removeClass("playing");

        presenter.isBackPlaying = false;
        presenter.audioElementBack.pause();
        $(presenter.flashcardsCardAudioButtonBack).removeClass("playing");

        presenter.$card.find(".flashcards-card-back .flashcards-card-contents").show();
        $(presenter.$view.find(".flashcards-card").get(0)).toggleClass("flashcards-card-reversed");
    };

    presenter.prevCard = function () {
        if (presenter.state.currentCard>1){
            presenter.state.currentCard -= 1;
        }else if (presenter.state.noLoop == false){
            presenter.state.currentCard = presenter.state.totalCards;
        }
        presenter.showCard(presenter.state.currentCard);
    };

    presenter.nextCard = function () {
        if (presenter.state.currentCard < presenter.state.totalCards){
            presenter.state.currentCard += 1;
        }else if (presenter.state.noLoop == false){
            presenter.state.currentCard = 1;
        }
        presenter.showCard(presenter.state.currentCard);
    };

    presenter.showCard = function (cardNumber) {
        cardNumber = parseInt(cardNumber,10);
        if (presenter.state.ShowOnlyFavourites == true && presenter.countFavourites() > 0 ){
            if (presenter.state.cardsFavourites[presenter.state.currentCard - 1] == true){
                presenter.displayCard(cardNumber);
            }else{
                if (cardNumber <= presenter.state.totalCards){
                    presenter.nextCard();
                }
            }
        }else{
            presenter.displayCard(cardNumber);
        }        
    };

    presenter.displayCard = function (cardNumber) {
        if (presenter.state.noLoop){
            $(presenter.flashcardsPrev.get(0)).attr("disabled", false);
            $(presenter.flashcardsNext.get(0)).attr("disabled", false);
            if (cardNumber == 1){
                $(presenter.flashcardsPrev.get(0)).attr("disabled", true);
            }else if (cardNumber == presenter.state.totalCards){
                $(presenter.flashcardsNext.get(0)).attr("disabled", true);
            }
        }

        var currentCardNumber = cardNumber;
        var totalCardsNuber = 0;
        if (presenter.state.ShowOnlyFavourites == true) {
            currentCardNumber = cardNumber - presenter.countNonFavouritesBefore(cardNumber);
            totalCardsNuber = presenter.countFavourites();
        }else{
            totalCardsNuber = presenter.state.totalCards;
        }
        presenter.$view.find(".flashcards-panel").get(0).innerHTML = currentCardNumber + "/" + totalCardsNuber;
        presenter.$card.find(".flashcards-card-back .flashcards-card-contents").hide();
        presenter.$card.removeClass("flashcards-card-reversed");

        presenter.$view.find(".flashcards-card-contents-front").get(0).innerHTML = presenter.Cards[cardNumber - 1].Front;
        presenter.$view.find(".flashcards-card-contents-back").get(0).innerHTML = presenter.Cards[cardNumber - 1].Back;

        //SCORE BUTTONS
        $(presenter.flashcardsButton).removeClass("flashcards-button-selected");
        if (presenter.state.cardsScore[presenter.state.currentCard] == 1){
            $(presenter.flashcardsButtonCorrect).addClass("flashcards-button-selected");
        }
        if (presenter.state.cardsScore[presenter.state.currentCard] == -1){
            $(presenter.flashcardsButtonWrong).addClass("flashcards-button-selected");
        }

        //FAV BUTTON
        if (presenter.state.cardsFavourites[presenter.state.currentCard - 1] == true) {
            $(presenter.flashcardsButtonFavourite).addClass("flashcards-button-selected");
        }else{
            $(presenter.flashcardsButtonFavourite).removeClass("flashcards-button-selected");
        }

        //AUDIO - front
        presenter.isFrontPlaying = false;
        $(presenter.flashcardsCardAudioButtonFront).removeClass("playing");
        $(presenter.flashcardsCardAudioButtonFront).addClass("disabled");
        if (presenter.Cards[presenter.state.currentCard - 1].AudioFront != ""){
            $(presenter.$view.find(".flashcards-card-audio-wrapper-front")).show();
            if (presenter.audioElementFront.canPlayType("audio/mpeg")) {
                presenter.audioElementFront.setAttribute("src",presenter.Cards[presenter.state.currentCard - 1].AudioFront);
                presenter.audioElementFront.oncanplay = function () {
                    $(presenter.flashcardsCardAudioButtonFront).removeClass("disabled");
                };
            } 
        }else{
            presenter.audioElementFront.setAttribute("src","");
            $(presenter.$view.find(".flashcards-card-audio-wrapper-front")).hide();
        }
        //AUDIO - back
        presenter.isBackPlaying = false;
        $(presenter.flashcardsCardAudioButtonBack).removeClass("playing");
        $(presenter.flashcardsCardAudioButtonBack).addClass("disabled");
        if (presenter.Cards[presenter.state.currentCard - 1].AudioBack != ""){
            $(presenter.$view.find(".flashcards-card-audio-wrapper-back")).show();
            if (presenter.audioElementBack.canPlayType("audio/mpeg")) {
                presenter.audioElementBack.setAttribute("src",presenter.Cards[presenter.state.currentCard - 1].AudioBack);
                presenter.audioElementBack.oncanplay = function () {
                    $(presenter.flashcardsCardAudioButtonBack).removeClass("disabled");
                };
            } 
        }else{
            presenter.audioElementBack.setAttribute("src","");
            $(presenter.$view.find(".flashcards-card-audio-wrapper-back")).hide();
        }
    };

    presenter.show = function () {
        presenter.setVisibility(true);
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
    };

    presenter.setVisibility = function (isVisible) {
        presenter.state.isVisible = isVisible;
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.updateVisibility = function () {
        (presenter.state.isVisible) ? presenter.show() : presenter.hide();
    };

    presenter.setShowErrorsMode = function () {
        presenter.isErrorMode = true;
    }; 

    presenter.setWorkMode = function () {
        presenter.isErrorMode = false;
    };

    presenter.ShowOnlyFavourites = function () {
        presenter.state.ShowOnlyFavourites = true;
        presenter.showCard(presenter.state.currentCard);
    };
    presenter.ShowAllCards = function () {
        presenter.state.ShowOnlyFavourites = false;
        presenter.showCard(presenter.state.currentCard);
    };

    presenter.resetFavourites = function () {
        presenter.state.ShowOnlyFavourites = false;
        $(presenter.Cards).each(function (key) {
            presenter.state.cardsFavourites[key] = false;
        });
        $(presenter.flashcardsButtonFavourite).removeClass("flashcards-button-selected");
    };
    
    presenter.reset = function () {
        presenter.state.ShowOnlyFavourites = false;
        presenter.state.currentCard = presenter.configuration.currentCard;

        presenter.state.isVisible = presenter.configuration.isVisible;
        presenter.updateVisibility();

        $(presenter.model.Cards).each(function (key) {
            presenter.state.cardsScore[key] = 0;
            presenter.state.cardsFavourites[key] = false;
        });

        presenter.showCard(presenter.state.currentCard);
    };
    
    presenter.getErrorCount = function () {
        var errors = null;
        if (presenter.configuration.IsActivity) {
            errors = 0;
            $(presenter.state.cardsScore).each(function (key) {
                if (presenter.state.cardsScore[key] == -1){
                    errors++;
                }
            });
        }
        return errors;
    };
    
    presenter.getMaxScore = function () {
        var maxScore = null;
        if (presenter.configuration.IsActivity) {
            maxScore = presenter.state.totalCards;
        }
        return maxScore;
    };
    
    presenter.getScore = function () {
        var score = null;
        if (presenter.configuration.IsActivity) {
            score = 0;
            $(presenter.state.cardsScore).each(function (key) {
                if (presenter.state.cardsScore[key] == 1){
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
    
    presenter.getState = function () {
        return JSON.stringify({
            state: presenter.state
        });
    };

    presenter.setState = function (stateString) {
        if (ModelValidationUtils.isStringEmpty(stateString)) return;
        var parsedState = JSON.parse(stateString);
        presenter.state = parsedState.state;

        presenter.updateVisibility();
        presenter.showCard(presenter.state.currentCard);
    };

    presenter.destroy = function (event) {
        presenter.view.removeEventListener('DOMNodeRemoved', presenter.destroy);

        $(presenter.$view.find(".flashcards-card-contents")).unbind();
        $(presenter.flashcardsButtonWrong).unbind();
        $(presenter.flashcardsButtonCorrect).unbind();
        $(presenter.flashcardsButtonReset).unbind();
        $(presenter.flashcardsButtonFavourite).unbind();
        $(presenter.flashcardsButtonFavourite).unbind();
        $(presenter.flashcardsNext).unbind();
        
    };

    return presenter;
}
