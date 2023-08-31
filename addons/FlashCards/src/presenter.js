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

    presenter.isLoaded = false;

    let isWCAGOn = false;
    presenter.speechTexts = {};
    let KEYBOARD_NAVIGATION_ACTIVE_ITEM_CLASS = "keyboard_navigation_active_element";

    let DEFAULT_TTS_PHRASES = {
        card: "Card",
        outOf: "out of",
        favourite: "Favourite",
        audio: "Audio",
        correct: "Correct",
        wrong: "Wrong",
        reset: "Reset",
        selected: "Selected",
        deselected: "Deselected",
        cardHasBeenReset: "Card has been reset",
        turned: "Turned"
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();
        presenter.eventBus.addEventListener('ShowAnswers', this);
        presenter.eventBus.addEventListener('HideAnswers', this);
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
        presenter.setSpeechTexts(model['speechTexts']);
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
            addonID: model['ID'],
            langTag: model['langAttribute']
        }
    };

    presenter.upgradeModel = function (model) {
        return presenter.upgradeAddTTS(model);
    }

    presenter.upgradeAddTTS = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!upgradedModel["speechTexts"]) {
            upgradedModel["speechTexts"] = {};
            upgradedModel["speechTexts"]["card"] = {card: ""};
            upgradedModel["speechTexts"]["outOf"] = {outOf: ""};
            upgradedModel["speechTexts"]["favourite"] = {favourite: ""};
            upgradedModel["speechTexts"]["audio"] = {audio: ""};
            upgradedModel["speechTexts"]["correct"] = {correct: ""};
            upgradedModel["speechTexts"]["wrong"] = {wrong: ""};
            upgradedModel["speechTexts"]["reset"] = {reset: ""};
            upgradedModel["speechTexts"]["selected"] = {selected: ""};
            upgradedModel["speechTexts"]["deselected"] = {deselected: ""};
            upgradedModel["speechTexts"]["cardHasBeenReset"] = {cardHasBeenReset: ""};
            upgradedModel["speechTexts"]["turned"] = {turned: ""};
        }
        if (!upgradedModel["langAttribute"]) {
            upgradedModel["langAttribute"] = ""
        }
        return upgradedModel;
    };

    presenter.setSpeechTexts = function(speechTexts) {
        presenter.speechTexts = {
            card: DEFAULT_TTS_PHRASES.card,
            outOf: DEFAULT_TTS_PHRASES.outOf,
            favourite: DEFAULT_TTS_PHRASES.favourite,
            audio: DEFAULT_TTS_PHRASES.audio,
            correct: DEFAULT_TTS_PHRASES.correct,
            wrong: DEFAULT_TTS_PHRASES.wrong,
            reset: DEFAULT_TTS_PHRASES.reset,
            selected: DEFAULT_TTS_PHRASES.selected,
            deselected: DEFAULT_TTS_PHRASES.deselected,
            cardHasBeenReset: DEFAULT_TTS_PHRASES.cardHasBeenReset,
            turned: DEFAULT_TTS_PHRASES.turned
        };

        if (!speechTexts || $.isEmptyObject(speechTexts)) {
            return;
        }
        presenter.speechTexts = {
            card: window.TTSUtils.getSpeechTextProperty(
                speechTexts.card.card,
                presenter.speechTexts.card),
            outOf: window.TTSUtils.getSpeechTextProperty(
                speechTexts.outOf.outOf,
                presenter.speechTexts.outOf),
            favourite: window.TTSUtils.getSpeechTextProperty(
                speechTexts.favourite.favourite,
                presenter.speechTexts.favourite),
            audio: window.TTSUtils.getSpeechTextProperty(
                speechTexts.audio.audio,
                presenter.speechTexts.audio),
            correct: window.TTSUtils.getSpeechTextProperty(
                speechTexts.correct.correct,
                presenter.speechTexts.correct),
            wrong: window.TTSUtils.getSpeechTextProperty(
                speechTexts.wrong.wrong,
                presenter.speechTexts.wrong),
            reset: window.TTSUtils.getSpeechTextProperty(
                speechTexts.reset.reset,
                presenter.speechTexts.reset),
            selected: window.TTSUtils.getSpeechTextProperty(
                speechTexts.selected.selected,
                presenter.speechTexts.selected),
            deselected: window.TTSUtils.getSpeechTextProperty(
                speechTexts.deselected.deselected,
                presenter.speechTexts.deselected),
            cardHasBeenReset: window.TTSUtils.getSpeechTextProperty(
                speechTexts.cardHasBeenReset.cardHasBeenReset,
                presenter.speechTexts.cardHasBeenReset),
            turned: window.TTSUtils.getSpeechTextProperty(
                speechTexts.turned.turned,
                presenter.speechTexts.turned),
        };
    };

    presenter.init = function (view, model) {
        model = presenter.upgradeModel(model);
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
        presenter.flashcardsMain = $(presenter.$view.find(".flashcards-card").get(0));
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
        presenter.audioElementHidden =  presenter.$view.find(".flashcards-card-audio-hidden").get(0);
        
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
        presenter.isHiddenPlaying = false;
        presenter.addAudioEventHandlers();

        presenter.isLoaded = true;
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
                presenter.resetHiddenAudio();
                presenter.audioElementFront.play();
                $(presenter.flashcardsCardAudioButtonFront).addClass("playing");
                presenter.sendPlayEvent();
            }else{
                presenter.isFrontPlaying = false;
                presenter.audioElementFront.pause();
                $(presenter.flashcardsCardAudioButtonFront).removeClass("playing");
                presenter.sendPauseEvent();
            }
        });
        $(presenter.flashcardsCardAudioButtonBack).click(function () {
            if (presenter.isErrorMode) return;
            presenter.audioElementBack =  presenter.$view.find(".flashcards-card-audio-back").get(0);
            if (presenter.isBackPlaying == false) {
                presenter.isBackPlaying = true;
                presenter.resetHiddenAudio();
                presenter.audioElementBack.play();
                $(presenter.flashcardsCardAudioButtonBack).addClass("playing");
                presenter.sendPlayEvent();
            }else{
                presenter.isBackPlaying = false;
                presenter.audioElementBack.pause();
                $(presenter.flashcardsCardAudioButtonBack).removeClass("playing");
                presenter.sendPauseEvent();
            }
        });  
    };

     presenter.addAudioEventHandlers = function () {
         presenter.audioElementFront.onended = function () {
             $(presenter.flashcardsCardAudioButtonFront).removeClass("playing");
             presenter.isFrontPlaying = false;
             presenter.sendEndedEvent();
         };

         presenter.audioElementBack.onended = function () {
             $(presenter.flashcardsCardAudioButtonBack).removeClass("playing");
             presenter.isBackPlaying = false;
             presenter.sendEndedEvent();
         };

        presenter.audioElementHidden.onended = function () {
            presenter.isHiddenPlaying = false;
            presenter.sendEndedEvent();
        };
     };
    
    presenter.run = function (view, model) {
        presenter.init(view, model);
    };
    
    presenter.createPreview = function (view, model) {
        presenter.init(view, model);
    };

    presenter.revertCard = function () {
        if (presenter.isFrontPlaying || presenter.isBackPlaying) {
            presenter.sendPauseEvent();
        }
        presenter.isFrontPlaying = false;
        presenter.audioElementFront.pause();
        $(presenter.flashcardsCardAudioButtonFront).removeClass("playing");

        presenter.isBackPlaying = false;
        presenter.audioElementBack.pause();
        $(presenter.flashcardsCardAudioButtonBack).removeClass("playing");

        presenter.$card.find(".flashcards-card-back .flashcards-card-contents").show();
        $(presenter.$view.find(".flashcards-card").get(0)).toggleClass("flashcards-card-reversed");
    };

    presenter.isFrontVisible = function() {
        return !$(presenter.$view.find(".flashcards-card").get(0)).hasClass("flashcards-card-reversed");
    }

    presenter.prevCard = function () {
        if ((presenter.isFrontPlaying || presenter.isBackPlaying) && presenter.state.currentCard > 1) {
            presenter.sendEndedEvent();
        }
        presenter.removeActiveElementClass();
        if (presenter.state.currentCard>1){
            presenter.state.currentCard -= 1;
        }else if (presenter.state.noLoop == false){
            presenter.state.currentCard = presenter.state.totalCards;
        }
        presenter.showCard(presenter.state.currentCard);
    };

    presenter.nextCard = function (disregardNoLoop) {
        var originalCard = presenter.state.currentCard;
        presenter.removeActiveElementClass();
        if (presenter.state.currentCard < presenter.state.totalCards){
            presenter.state.currentCard += 1;
        }else if (presenter.state.noLoop == false || disregardNoLoop){
            presenter.state.currentCard = 1;
        }
        if ((presenter.isFrontPlaying || presenter.isBackPlaying) && presenter.state.currentCard != originalCard) {
            presenter.sendEndedEvent();
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
                    presenter.nextCard(true);
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
        presenter.renderMathJax();
    };

    presenter.show = function () {
        presenter.setVisibility(true);
        presenter.renderMathJax();
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

    presenter.onEventReceived = function (eventName) {
        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        }

        if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        }
    };

    presenter.showAnswers = function () {
        presenter.isErrorMode = true;
    };

    presenter.hideAnswers = function () {
        presenter.isErrorMode = false;
    };

    presenter.showOnlyFavourites = function () {
        if (presenter.countFavourites() > 0) {
            presenter.state.ShowOnlyFavourites = true;
            presenter.showCard(presenter.state.currentCard);
        }
    };

    presenter.showAllCards = function () {
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
        presenter.isErrorMode = false;
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
            'ShowOnlyFavourites': presenter.showOnlyFavourites,
            'ShowAllCards': presenter.showAllCards,
            'countFavourites': presenter.countFavourites,
            'play': presenter.play,
            'pause': presenter.pause,
            'stop': presenter.stop
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

    presenter.playHiddenCardAudio = function (cardIndex, reverse) {
        var card = presenter.Cards[cardIndex];
        if (!card) return;
        if (presenter.isFrontPlaying) {
            presenter.audioElementFront.pause();
            presenter.audioElementFront.currentTime = 0;
            presenter.isFrontPlaying = false;
        }
        if (presenter.isBackPlaying) {
            presenter.audioElementBack.pause();
            presenter.audioElementBack.currentTime = 0;
            presenter.isBackPlaying = false;
        }
        if ((!reverse && card.AudioFront != "") || (reverse && card.AudioBack != "")){
            if (presenter.audioElementHidden.canPlayType("audio/mpeg")) {
                var audioSrc = card.AudioFront;
                if (reverse) {
                    audioSrc = card.AudioBack;
                }
                if (presenter.audioElementHidden.getAttribute("src") != audioSrc) {
                    presenter.audioElementHidden.setAttribute("src", audioSrc);
                    presenter.audioElementHidden.oncanplay = function () {
                        presenter.audioElementHidden.play();
                        presenter.sendPlayEvent();
                        presenter.isHiddenPlaying = true;
                        presenter.audioElementHidden.oncanplay = null;
                    };
                } else if (!presenter.isHiddenPlaying) {
                    presenter.audioElementHidden.play();
                    presenter.sendPlayEvent();
                    presenter.isHiddenPlaying = true;
                }
            }
        }
    }

    presenter.resetHiddenAudio = function() {
        if (presenter.isHiddenPlaying) {
            presenter.isHiddenPlaying = false;
            presenter.audioElementHidden.pause();
        }
        presenter.audioElementHidden.currentTime = 0;
    }

    presenter.sendAudioEvent = function(eventName) {
        var eventData = {
            'source': presenter.configuration.addonID,
            'item': presenter.state.currentCard,
            'value': eventName,
            'score': ''
        };

        presenter.eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.sendPlayEvent = function() {presenter.sendAudioEvent("playing")};

    presenter.sendPauseEvent = function() {presenter.sendAudioEvent("pause")};

    presenter.sendEndedEvent = function() {presenter.sendAudioEvent("ended")};

    presenter.play = function(cardIndex = -1, reverse = false) {
        if (Array.isArray(cardIndex)) {
            if (cardIndex.length > 0) {
                cardIndex = cardIndex[0];
                if (cardIndex.length > 1) reverse = cardIndex[1];
            } else {
                cardIndex = -1;
            }
        }
        if (cardIndex != -1) {
            presenter.playHiddenCardAudio(cardIndex - 1, reverse);
        } else {
            presenter.audioCommand("play");
        }
    };

    presenter.pause = function() {
        presenter.audioCommand("pause");
    };

    presenter.stop = function() {
        presenter.audioCommand("stop");
    };

    presenter.audioCommand = function(command) {
        if (presenter.isErrorMode) return;
        if (presenter.isHiddenPlaying && command != "play") {
            if (command == "stop" && presenter.audioElementHidden.currentTime > 0) {
                presenter.audioElementHidden.currentTime = 0;
                presenter.sendEndedEvent();
            }
            presenter.audioElementHidden.pause();
            if (command == "pause") {
                presenter.sendPauseEvent();
            }
            presenter.isHiddenPlaying = false;
            return;
        }

        var currentCard = presenter.Cards[presenter.state.currentCard - 1];
        if (presenter.isFrontVisible()) {
            if (currentCard.AudioFront != "") {
                if (command == "play") {
                    if (presenter.isFrontPlaying) return;
                    presenter.isFrontPlaying = true;
                    presenter.resetHiddenAudio();
                    presenter.audioElementFront.play();
                    $(presenter.flashcardsCardAudioButtonFront).addClass("playing");
                    presenter.sendPlayEvent();
                }else{
                    if (command == "stop" && presenter.audioElementFront.currentTime > 0) {
                        presenter.audioElementFront.currentTime = 0;
                        presenter.sendEndedEvent();
                    }
                    if (!presenter.isFrontPlaying) return;
                    presenter.isFrontPlaying = false;
                    presenter.audioElementFront.pause();
                    $(presenter.flashcardsCardAudioButtonFront).removeClass("playing");
                    if (command == "pause") {
                        presenter.sendPauseEvent();
                    }
                }
            }
        } else {
            if (currentCard.AudioBack != "") {
                presenter.audioElementBack =  presenter.$view.find(".flashcards-card-audio-back").get(0);
                if (command == "play") {
                    if (presenter.isBackPlaying == true) return;
                    presenter.isBackPlaying = true;
                    presenter.resetHiddenAudio();
                    presenter.audioElementBack.play();
                    $(presenter.flashcardsCardAudioButtonBack).addClass("playing");
                    presenter.sendPlayEvent();
                }else{
                    if (command == "stop" && presenter.audioElementBack.currentTime > 0) {
                        presenter.audioElementBack.currentTime = 0;
                        presenter.sendEndedEvent();
                    }
                    if (presenter.isBackPlaying == false) return;
                    presenter.isBackPlaying = false;
                    presenter.audioElementBack.pause();
                    $(presenter.flashcardsCardAudioButtonBack).removeClass("playing");
                    if (command == "pause") {
                        presenter.sendPauseEvent();
                    }
                }
            }
        }
    }

    presenter.setWCAGStatus = function(isOn) {
        isWCAGOn = isOn;
    }

    presenter.removeActiveElementClass = function() {
        presenter.$view.find("."+KEYBOARD_NAVIGATION_ACTIVE_ITEM_CLASS).removeClass(KEYBOARD_NAVIGATION_ACTIVE_ITEM_CLASS);
    }

    presenter.nextKeyboardElement = function() {
        cycleKeyboardElement(true);
    }

    presenter.prevKeyboardElement = function() {
        cycleKeyboardElement(false);
    }

    function cycleKeyboardElement(forward) {
        let elementList = [presenter.flashcardsMain, presenter.flashcardsButtonFavourite];
        let currentElementIndex = 0;
        if (presenter.flashcardsMain.is('.flashcards-card-reversed')) {
            elementList.push(presenter.flashcardsCardAudioButtonBack);
            elementList.push(presenter.flashcardsButtonWrong);
            elementList.push(presenter.flashcardsButtonReset);
            elementList.push(presenter.flashcardsButtonCorrect);
        } else {
            elementList.push(presenter.flashcardsCardAudioButtonFront);
        }

        elementList = elementList.filter( function($el) {
            return $el != null && $el.length > 0 && $el.is(":visible");
        });

        for (let i = 0; i < elementList.length; i++) {
            if (elementList[i].is("."+KEYBOARD_NAVIGATION_ACTIVE_ITEM_CLASS)) {
                currentElementIndex = i;
                break;
            }
        }

        presenter.removeActiveElementClass();
        if (forward) {
            currentElementIndex += 1;
            if (currentElementIndex >= elementList.length) currentElementIndex = elementList.length - 1;
        } else {
            currentElementIndex -= 1;
            if (currentElementIndex < 0) currentElementIndex = 0;
        }
        elementList[currentElementIndex].addClass(KEYBOARD_NAVIGATION_ACTIVE_ITEM_CLASS);

    }

    presenter.onSpace = function() {
        let currentElement = presenter.$view.find("."+KEYBOARD_NAVIGATION_ACTIVE_ITEM_CLASS);
        if (currentElement.length === 0 || currentElement.hasClass("flashcards-card")) {
            presenter.removeActiveElementClass();
            presenter.revertCard();
            speak([window.TTSUtils.getTextVoiceObject(presenter.speechTexts.turned)]);
        } else {
            currentElement.click();
            if (currentElement.hasClass('flashcards-button-reset')) {
                speak([window.TTSUtils.getTextVoiceObject(presenter.speechTexts.cardHasBeenReset)]);
            } else if (currentElement.hasClass('flashcards-button-correct')
                || currentElement.hasClass('flashcards-button-wrong')) {
                speak([window.TTSUtils.getTextVoiceObject(presenter.speechTexts.selected)]);
            } else if (currentElement.hasClass('flashcards-button-favourite')) {
                if (currentElement.hasClass('flashcards-button-selected')) {
                    speak([window.TTSUtils.getTextVoiceObject(presenter.speechTexts.selected)]);
                } else {
                    speak([window.TTSUtils.getTextVoiceObject(presenter.speechTexts.deselected)]);
                }
            }
        }
    }

    presenter.readSelected = function() {
        let textVoices = [];
        let currentElement = presenter.$view.find("."+KEYBOARD_NAVIGATION_ACTIVE_ITEM_CLASS);
        if (currentElement.length === 0 || currentElement.hasClass("flashcards-card")) {
            presenter.readCard();
        } else {
            if (currentElement.hasClass('flashcards-button-favourite')) {
                textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.favourite));
            } else if (currentElement.hasClass('flashcards-card-audio-button')) {
                textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.audio));
            } else if (currentElement.hasClass('flashcards-button-wrong')) {
                textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.wrong));
            } else if (currentElement.hasClass('flashcards-button-correct')) {
                textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.correct));
            } else if (currentElement.hasClass('flashcards-button-reset')) {
                textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.reset));
            }
            if (currentElement.hasClass('flashcards-button-selected')) {
                textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.selected));
            }
            speak(textVoices);
        }
    }

    presenter.readCard = function() {
        let $content = null;
        if (presenter.flashcardsMain.is('.flashcards-card-reversed')) {
            $content = presenter.flashcardsMain.find('.flashcards-card-contents-back');
        } else {
            $content = presenter.flashcardsMain.find('.flashcards-card-contents-front');
        }

        let textVoices = window.TTSUtils.getTextVoiceArrayFromElement($content, presenter.configuration.langTag);
        speak(textVoices);
    }

    presenter.readCardNumber = function() {
        let textVoices = [];
        textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.card));
        textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.state.currentCard + ''));
        textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.outOf));
        textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.state.totalCards + ''));
        speak(textVoices);
    }

    presenter.keyboardController = function(keycode, isShift, event) {
        event.preventDefault();
        switch (keycode) {
            case 9: // TAB
                if (isShift) {
                    presenter.prevKeyboardElement();
                } else {
                    presenter.nextKeyboardElement();
                }
                presenter.readSelected();
                break;
            case 13: //ENTER
                if (isShift) {
                    presenter.removeActiveElementClass();
                } else {
                    presenter.readSelected();
                }
                break;
            case 32: // SPACE
                presenter.onSpace();
                break;
            case 38: // UP
                presenter.prevCard();
                presenter.readCardNumber();
                break;
            case 40: // DOWN
                presenter.nextCard();
                presenter.readCardNumber();
                break;
            case 37: // LEFT
                presenter.prevCard();
                presenter.readCardNumber();
                break;
            case 39: // RIGHT
                presenter.nextCard();
                presenter.readCardNumber();
                break;
            case 27: // ESC
                presenter.removeActiveElementClass();
                break;
        }
    }

    presenter.getTextToSpeechOrNull = function (playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    function speak(data) {
        var tts = presenter.getTextToSpeechOrNull(presenter.playerController);

        if (tts && isWCAGOn) {
            tts.speak(data);
        }
    }

    presenter.renderMathJax = function () {
        if (presenter.isLoaded) {
            reloadMathJax();
        }
    }

    function reloadMathJax () {
        window.MathJax.Callback.Queue().Push(function () {
            window.MathJax.Hub.Typeset(presenter.$view[0]);
        });
    }

    return presenter;
};
