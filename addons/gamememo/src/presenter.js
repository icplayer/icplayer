function Addongamememo_create(){
    var presenter = function(){};

    var playerController;
    var eventBus;
    var keyboardController = null;

    function MemoKeyboardController(elements, columnsCount) {
        KeyboardController.call(this, elements, columnsCount);
    }
    MemoKeyboardController.prototype = Object.create(KeyboardController.prototype);
    MemoKeyboardController.prototype.constructor = MemoKeyboardController;

    MemoKeyboardController.prototype.getTarget = function (element) {
        return element.find('.placeholder');
    };

    MemoKeyboardController.prototype.selectAction = function () {
        if (!this.keyboardNavigationCurrentElement.hasClass('was-clicked')) {
            this.keyboardNavigationCurrentElement.find('.front.placeholder').click();
        }
    };

    presenter.setPlayerController = function (controller) {
        playerController = controller;
    };

    presenter.numberToCardType = function(n) {
        if(n == 0) {
            return 'A';
        } else if(n == 1) {
            return 'B';
        } else {
            throw new Error('presenter.numberToCardType accepts only values 0 and 1');
        }
    };

    // Fisher-Yates algorithm
    // based on http://sedition.com/perl/javascript-fy.html
    presenter.shuffleArray = function(a) {
        var i = a.length;
        if ( i == 0 ) return [];

        while ( --i ) {
            var j = Math.floor( Math.random() * ( i + 1 ) );
            var tempi = a[i];
            a[i] = a[j];
            a[j] = tempi;
        }

        return a;
    };

    // Fisher-Yates algorithm
    // based on http://sedition.com/perl/javascript-fy.html
    presenter.shuffleTwoArrays = function(a1, a2) {
        var i = a1.length;
        if ( i == 0 ) return [[],[]];

        while ( --i ) {
            var j = Math.floor( Math.random() * ( i + 1 ) );

            var temp1i = a1[i];
            a1[i] = a1[j];
            a1[j] = temp1i;

            var temp2i = a2[i];
            a2[i] = a2[j];
            a2[j] = temp2i;
        }

        return [a1, a2];
    };

    presenter.STATES = {
        READY: 0,
        CLICKED_FIRST: 1,
        CLICKED_SECOND: 2
    };

    presenter.state = presenter.STATES.READY;

    presenter.cardClickedFirst = null;
    presenter.cardClickedSecond = null;
    presenter.cardClickedFirstId = null;
    presenter.cardClickedSecondId = null;
    presenter.cardClickedStyle = null;

    presenter.errorCount = 0;
    presenter.score = 0;
    presenter.maxScore = null;
    presenter.timeToSolve = 0;
    presenter.timer = null;
    presenter.sessionStarted = null;
    presenter.spendTime = 0;

    presenter.preview = false;
    presenter.previewCards = false;

    presenter.cards = [];
    presenter.serializedCards = [];
    presenter.rowCount = null;
    presenter.columnCount = null;
    presenter.useTwoStyles = false;
    presenter.keepAspectRatio = false;
    presenter.styleAImage = null;
    presenter.styleBImage = null;

    presenter.model = null;

    presenter.requestedRowHeight = null;
    presenter.requestedColumnWidth = null;

    presenter.ERROR_MESSAGES = {
        PAIRS_NOT_SPECIFIED: "Pairs are not specified",
        ROWS_NOT_SPECIFIED: "Amount of rows is not specified",
        COLUMNS_NOT_SPECIFIED: "Amount of columns is not specified",
        INVALID_GEOMETRY: "Invalid amount of columns and/or rows - their multiplication must be even",
        AMOUNT_OF_PAIRS_OTHER_THAN_GEOMETRY: "Invalid amount of pairs: for %columns% columns and %rows% rows there should be defined %pairs% pairs",
        PAIR_MEMBER_SPECIFIED_TWICE: "Pair %pair% is invalid: its member \"%member%\" is specified both as a text and an image",
        PAIR_MEMBERS_NOT_SPECIFIED: "Pair %pair% is invalid: its members are not specified"
    };

    presenter.showErrorMessage = function(message, substitutions) {
        var errorContainer;
        if(typeof(substitutions) == 'undefined') {
            errorContainer = '<p>' + message + '</p>';
        } else {
            var messageSubst = message;
            for(var key in substitutions) {
                if (!substitutions.hasOwnProperty(key)) continue;
                messageSubst = messageSubst.replace('%' + key + '%', substitutions[key]);
            }
            errorContainer = '<p>' + messageSubst + '</p>';
        }

        presenter.viewContainer.html(errorContainer);
    };

    function getTimeToSolve(model) {
        var tts = model['Time to solve'];
        // parse time to solve and return it in seconds
        tts = parseInt(tts, 10);
        return tts
    }

    presenter.validateModel = function(model) {
        if(model['Pairs'].length == 0) {
            return {
                isError: true,
                errorMessage: presenter.ERROR_MESSAGES.PAIRS_NOT_SPECIFIED
            };
        }

        if(parseInt(model['Columns']) <= 0 || isNaN(parseInt(model['Columns'])) ) {
            return {
                isError: true,
                errorMessage: presenter.ERROR_MESSAGES.COLUMNS_NOT_SPECIFIED
            };
        }

        if(parseInt(model['Rows']) <= 0 || isNaN(parseInt(model['Rows']))) {
            return {
                isError: true,
                errorMessage: presenter.ERROR_MESSAGES.ROWS_NOT_SPECIFIED
            };
        }

        if((parseInt(model['Rows']) * parseInt(model['Columns'])) % 2 == 1) {
            return {
                isError: true,
                errorMessage: presenter.ERROR_MESSAGES.INVALID_GEOMETRY
            };
        }

        if(parseInt(model['Rows']) * parseInt(model['Columns']) != model['Pairs'].length * 2) {
            return {
                isError: true,
                errorMessage: presenter.ERROR_MESSAGES.AMOUNT_OF_PAIRS_OTHER_THAN_GEOMETRY,
                errorMessageSubstitutions: {
                    rows: parseInt(model['Rows']),
                    columns: parseInt(model['Columns']),
                    pairs: parseInt(model['Rows']) * parseInt(model['Columns']) / 2
                }
            };
        }


        for(var i = 0; i < model['Pairs'].length; i++) {
            if(model['Pairs'][i]['A (text)'] == "" && model['Pairs'][i]['A (image)'] == "" &&
                model['Pairs'][i]['B (text)'] == "" && model['Pairs'][i]['B (image)'] == "") {
                return {
                    isError: true,
                    errorMessage: presenter.ERROR_MESSAGES.PAIR_MEMBERS_NOT_SPECIFIED,
                    errorMessageSubstitutions: {
                        pair: i + 1
                    }
                };
            }
            for(var n = 0; n <= 1; n++) {
                if(model['Pairs'][i][presenter.numberToCardType(n) + ' (text)'] != "" && model['Pairs'][i][presenter.numberToCardType(n) + ' (image)'] != "") {
                    return {
                        isError: true,
                        errorMessage: presenter.ERROR_MESSAGES.PAIR_MEMBER_SPECIFIED_TWICE,
                        errorMessageSubstitutions: {
                            pair: i + 1,
                            member: presenter.numberToCardType(n)
                        }
                    };
                }
            }
        }

        presenter.maxScore = model['Pairs'].length;
        presenter.rowCount = parseInt(model['Rows']);
        presenter.columnCount = parseInt(model['Columns']);
        presenter.useTwoStyles = model['Use two styles for cards'] == 'True';
        presenter.keepAspectRatio = model['Keep cards aspect ratio'] == 'True';
        presenter.previewCards = model['Show cards for preview'] == 'True';
        presenter.styleAImage = model['Image for style A'] != '' ? model['Image for style A'] : null;
        presenter.styleBImage = model['Image for style B'] != '' ? model['Image for style B'] : null;
        presenter.isActivity = !(ModelValidationUtils.validateBoolean(model['Is Not Activity']));
        presenter.imageMode = model['Image Mode'];
        presenter.keppWrongMarking = ModelValidationUtils.validateBoolean(model['Keep wrong marking']);
        presenter.timeToSolve = getTimeToSolve(model);
        presenter.sessionEndedMessage = model['Session ended message'];

        var viewWidth = parseInt(presenter.viewContainer.css('width'));
        var viewHeight = parseInt(presenter.viewContainer.css('height'));

        presenter.requestedColumnWidth = Math.round(viewWidth / presenter.columnCount);
        presenter.requestedRowHeight = Math.round(viewHeight / presenter.rowCount);


        return {
            isError: false,
            ID: model.ID,
            pairs: model['Pairs'],
            isVisible: ModelValidationUtils.validateBoolean(model['Is Visible']),
            isVisibleByDefault: ModelValidationUtils.validateBoolean(model['Is Visible']),
            isTabindexEnabled: ModelValidationUtils.validateBoolean(model["Is Tabindex Enabled"]),
            clickToTurnOverIncorrectPair: ModelValidationUtils.validateBoolean(model["Click to turn over incorrect pair"]),
            altTextStyleA: model['Style A cover alt text'],
            altTextStyleB: model['Style B cover alt text']
        };
    };

    presenter.slideUpAnimation = function ($element, successFunction) {
        var distance = $element.outerHeight();
        $element.animate({bottom: (distance + 'px')}, 200, function () {
            $(this).css({
                visibility: 'hidden',
                bottom: 0
            });

            successFunction();
        });
    };

    presenter.slideDownAnimation = function ($element, successFunction) {
        var distance = $element.outerHeight();

        if(presenter.imageMode == 'KeepAspect') {
            $element.css('visibility', 'visible');
        } else {
             $element.css({'bottom': (distance + 'px'), visibility: 'visible'})
                .animate({bottom: 0}, 200);
        }
    };

    presenter.showCard = function(cell) {
        var successFunction = function () {
            presenter.slideDownAnimation(cell.children(".back"));
        };

        presenter.slideUpAnimation(cell.children(".front"), successFunction);

        if(!presenter.isShowAnswersActive){
            cell.addClass('was-clicked');
        }
    };

    presenter.hideCard = function(cell) {
        var successFunction = function () {
            presenter.slideDownAnimation(cell.children(".front"));
        };

        presenter.slideUpAnimation(cell.children(".back"), successFunction);

        if(!presenter.isShowAnswersActive){
            cell.removeClass('was-clicked');
        }
    };

    function getMarkDiv(markType, height) {
        var factory = {
            "tick": function () {
                return $('<div class="tick_mark">&check;</div>');
            },

            "mismatch": function () {
                return $('<div class="mismatch_mark">&times;</div>');
            }
        };

        var mark = factory[markType]();

        mark.css({
            opacity: 0.8,
            fontSize: Math.round(parseInt(height) * 0.95) + 'px'
        });

        return mark;
    }

    function fadeOutMark (mark, time) {
        mark.fadeOut(time, function () {
            mark.remove();
        });
    }

    function setMarkHeight (mark) {
        mark.css('top', Math.round(parseInt(mark.css('height')) * -0.08) + 'px');
    }

    presenter.markCardMismatch = function(cell, heightProbeCell) {
        var mark = getMarkDiv("mismatch", heightProbeCell.parent().css('height'));

        cell.parent().append(mark);

        setMarkHeight(mark);
        if (!presenter.keppWrongMarking) {
            fadeOutMark(mark, 1300)
        }
    };

    presenter.markCardTick = function(cell, heightProbeCell) {
        var mark = getMarkDiv("tick", heightProbeCell.parent().css('height'));
        cell.parent().append(mark);

        setMarkHeight(mark);
        fadeOutMark(mark, 1300)
    };


    presenter.prepareGrid = function() {
        var cards = [];
        var serializedCards = [];
        var card;
        var serializedCard;

        var pairs = presenter.configuration.pairs;

        for(var n = 0; n <= 1; n++) {
            for(var j = 0; j < pairs.length; j++) {

                if(pairs[j][presenter.numberToCardType(n) + ' (text)'] != "") {
                    card = $('<p></p>').text(pairs[j][presenter.numberToCardType(n) + ' (text)']);
                    serializedCard = { revealed: false, type: "text", content: pairs[j][presenter.numberToCardType(n) + ' (text)'] }

                } else {
                    card = $('<img/>').attr({ src: pairs[j][presenter.numberToCardType(n) + ' (image)']});

                    var altText = pairs[j][presenter.numberToCardType(n) + ' (alt text)'];
                    if (altText !== '' && altText !== undefined) {
                        card.attr('alt', altText);
                    }

                    serializedCard = { revealed: false, type: "image", content: pairs[j][presenter.numberToCardType(n) + ' (image)'] }
                }

                card.addClass('card').attr({'card_id' : j, 'card_style' : n});
                cards.push(card);

                serializedCard.cardStyle = n;
                serializedCard.cardId = j;
                serializedCards.push(serializedCard);
            }
        }

        presenter.cards = cards;
        presenter.serializedCards = serializedCards;

        presenter.shuffleCards();
    };

    presenter.shuffleCards = function() {
        var shuffled = presenter.shuffleTwoArrays(presenter.cards, presenter.serializedCards);

        presenter.cards = shuffled[0];
        presenter.serializedCards = shuffled[1];
    };

    presenter.prepareGridFromSavedState = function(savedCards) {
        var cards = [], card,
            pairs = presenter.model['Pairs'], src;

        for(var i = 0; i < savedCards.length; i++) {
            if(savedCards[i].type == "text") {
                card = $('<p></p>').text(savedCards[i].content);
            } else {
                src = pairs[savedCards[i].cardId][presenter.numberToCardType(savedCards[i].cardStyle) + ' (image)'];
                card = $('<img/>').attr({ src: src });

                var altText = pairs[savedCards[i].cardId][presenter.numberToCardType(savedCards[i].cardStyle) + ' (alt text)']
                if (altText !== undefined && altText !== '') {
                    card.attr('alt', altText);
                }
            }
            card.addClass('card').attr({'card_id' : savedCards[i].cardId, 'card_style' : savedCards[i].cardStyle });
            cards.push(card);
        }

        presenter.cards = cards;
        presenter.serializedCards = savedCards;
    };

    presenter.handleCardClickedFirst = function(card) {
        presenter.state = presenter.STATES.CLICKED_FIRST;
        if(presenter.imageMode == 'KeepAspect'){
            if(card.hasClass('cell')){
                presenter.cardClickedFirst = card;
            }else{
                presenter.cardClickedFirst = card.parent();
            }
        }else{
            presenter.cardClickedFirst = card;
        }
        presenter.showCard(presenter.cardClickedFirst);

        if(presenter.useTwoStyles) {
            presenter.cardClickedStyle = presenter.numberToCardType(parseInt(presenter.cardClickedFirst.find('.card').attr('card_style')));
            presenter.viewContainer.find("div.front_" + presenter.cardClickedStyle).css('cursor', 'default');
        }
    };

    presenter.cardReveal = function () {
        var cells = presenter.viewContainer.find('.cell');
        presenter.serializedCards[$.inArray(presenter.cardClickedFirst[0], cells)].revealed = true;
        presenter.serializedCards[$.inArray(presenter.cardClickedSecond[0], cells)].revealed = true;
    };

    presenter.addScoreAndSentEvent = function () {
        presenter.cardReveal();

        presenter.score++;

        if (presenter.isAllOK()) {
            removeTimers();
            var now = new Date();
            presenter.spendTime += now - presenter.sessionStarted;
            presenter.sessionStarted = null;
            if (presenter.isActivity) {
                presenter.sendAllOKEvent();
            }
        }
    };

    presenter.createBaseEventData = function () {
        return {
            source: presenter.ID ,
            item: "",
            value: "",
            score: ""
        };
    };

    presenter.createItemEventData = function (firstID, secondID, isCorrect) {
        var eventData = presenter.createBaseEventData();
        var firstId = parseInt(firstID)+1;
        var secondId = parseInt(secondID)+1;

        eventData.item = firstId+"-"+secondId;
        eventData.value = '1';
        eventData.score = isCorrect ? "1" : "0";

        if (!presenter.isActivity) {
            eventData.score = "";
        }

        return eventData;
    };

    presenter.sendEventData = function (eventData) {
        if (playerController !== null) {
            playerController.getEventBus().sendEvent('ValueChanged', eventData);
        }
    };

    function numberToCardType(element) {
        if (element.is("img")) {
            return element.parent().parent().find('.card').attr('card_style');
        } else {
            return element.parent().find('.card').attr('card_style');
        }
    }

    presenter.onCardClicked = function(e) {
        e.stopPropagation();

        if (presenter.sessionStarted === null) {
            presenter.startSession();
        }

        var eventData;
        var cardId = $(e.target).parent().find('.card').attr('card_id');

        if(presenter.useTwoStyles) {
            var clickedStyle;
            clickedStyle = presenter.numberToCardType(parseInt(numberToCardType($(e.target))));
            if(clickedStyle == presenter.cardClickedStyle) {
                return;
            }
        }

        if(presenter.configuration.clickToTurnOverIncorrectPair && presenter.STATES.CLICKED_SECOND) {

        }

        switch(presenter.state) {
            case presenter.STATES.READY:
                presenter.handleCardClickedFirst($(e.target).parent());
                break;

            case presenter.STATES.CLICKED_FIRST:
                presenter.state = presenter.STATES.CLICKED_SECOND;

                if(presenter.imageMode == 'KeepAspect'){
                    if($(e.target).parent().hasClass('cell')){
                        presenter.cardClickedSecond = $(e.target).parent();
                    }else{
                        presenter.cardClickedSecond = $(e.target).parent().parent();
                    }
                }else{
                    presenter.cardClickedSecond = $(e.target).parent();
                }

                presenter.showCard(presenter.cardClickedSecond);

                presenter.cardClickedFirstId = presenter.cardClickedFirst.find('.card').attr('card_id');
                presenter.cardClickedSecondId = presenter.cardClickedSecond.find('.card').attr('card_id');

                if(presenter.cardClickedFirstId != presenter.cardClickedSecondId) {
                    presenter.errorCount++;
                    presenter.markCardMismatch(presenter.cardClickedFirst.find(".card"), presenter.cardClickedFirst.find(".card"));
                    presenter.markCardMismatch(presenter.cardClickedSecond.find(".card"), presenter.cardClickedFirst.find(".card"));

                    eventData = presenter.createItemEventData(presenter.cardClickedFirstId, presenter.cardClickedSecondId,  false);
                    presenter.sendEventData(eventData);
                    presenter.isCorrectMark = false;
                } else {
                    presenter.markCardTick(presenter.cardClickedFirst.find(".card"), presenter.cardClickedFirst.find(".card"));
                    presenter.markCardTick(presenter.cardClickedSecond.find(".card"), presenter.cardClickedFirst.find(".card"));

                    eventData = presenter.createItemEventData(presenter.cardClickedFirstId, presenter.cardClickedSecondId, true);
                    presenter.sendEventData(eventData);

                    presenter.addScoreAndSentEvent();
                    presenter.isCorrectMark = true;
                }

                if(presenter.useTwoStyles) {
                    presenter.viewContainer.find("div.front_" + presenter.cardClickedStyle).css('cursor', '');
                    presenter.cardClickedStyle = null;
                }

                break;

            case presenter.STATES.CLICKED_SECOND:
                if(presenter.cardClickedFirstId != presenter.cardClickedSecondId) {
                    presenter.hideCard(presenter.cardClickedFirst);
                    presenter.hideCard(presenter.cardClickedSecond);
                }

                if(presenter.configuration.clickToTurnOverIncorrectPair && !presenter.isCorrectMark) {
                    presenter.cardClickedFirst = null;
                    presenter.state = presenter.STATES.READY;
                } else {
                    presenter.handleCardClickedFirst($(e.target).parent());
                }

                presenter.cardClickedSecond = null;
                presenter.cardClickedFirstId = null;
                presenter.cardClickedSecondId = null;

                if (presenter.keppWrongMarking) {
                    var mark = presenter.viewContainer.find('.mismatch_mark');
                    fadeOutMark(mark, 1000);
                }

                break;
        }
    };

    presenter.onBackClick = function () {
        if(presenter.STATES.CLICKED_SECOND && presenter.configuration.clickToTurnOverIncorrectPair && !presenter.isCorrectMark) {
            if(presenter.cardClickedFirstId != presenter.cardClickedSecondId) {
                presenter.hideCard(presenter.cardClickedFirst);
                presenter.hideCard(presenter.cardClickedSecond);
            }

            presenter.cardClickedFirst = null;
            presenter.state = presenter.STATES.READY;
            presenter.cardClickedSecond = null;
            presenter.cardClickedFirstId = null;
            presenter.cardClickedSecondId = null;

            if (presenter.keppWrongMarking) {
                var mark = presenter.viewContainer.find('.mismatch_mark');
                fadeOutMark(mark, 1000);
            }
        }
    };

    presenter.createGrid = function() {
        var cards = presenter.cards;
        var keyboardNavigationElements = [];

        var $container = $('<div class="gamememo_container"></div>');

        if(presenter.keepAspectRatio) {
            if(presenter.requestedRowHeight > presenter.requestedColumnWidth) {
                $container.css('height', (presenter.requestedColumnWidth * presenter.rowCount) + 'px');
            } else if (presenter.requestedColumnWidth >= presenter.requestedRowHeight) {
                $container.css('width', (presenter.requestedRowHeight * presenter.columnCount) + 'px');
                $container.css('height', (presenter.requestedRowHeight * presenter.rowCount) + 'px');
            }
        } else {
            $container.css({
                width: presenter.viewContainer.css('width'),
                height: presenter.viewContainer.css('height')
            });
        }

        var columnWidthPercent = (100.0 / presenter.columnCount) + '%';
        var rowHeightPercent = (100.0 / presenter.rowCount) + '%';

        for(var r = 0; r < presenter.rowCount; r++) {

            for(var c = 0; c < presenter.columnCount; c++) {
                var front = $('<div class="front placeholder"></div>')
                    .addClass(presenter.useTwoStyles ?
                    'front_' + presenter.numberToCardType(parseInt(cards[r * presenter.columnCount + c].attr('card_style'))) :
                    'front_A');

                if(!presenter.preview) {
                    front.click(presenter.onCardClicked);
                }

                var back = $('<div class="back placeholder"></div>')
                    .append(cards[r * presenter.columnCount + c]);

                var cell = $('<div class="cell"></div>').css({
                    height : rowHeightPercent,
                    width : columnWidthPercent
                });

                if (presenter.configuration.isTabindexEnabled) {
                    cell.attr("tabindex", "0");
                }

                if(!presenter.preview) {
                    cell.append(back).append(front);
                    back.click(presenter.onBackClick);
                } else {
                    if(presenter.previewCards) {
                        back.css('display', 'block');
                        cell.append(back);

                    } else {
                        cell.append(back).append(front);
                    }
                }

                $container.append(cell);
                keyboardNavigationElements.push(cell);
            }
        }
        if (keyboardController !== null) {
            keyboardController.reload(keyboardNavigationElements, presenter.columnCount);
        } else {
            keyboardController = new MemoKeyboardController(keyboardNavigationElements, presenter.columnCount);
        }

        if(presenter.styleAImage != null){
            var frontDivA = $container.find('div.front_A');
            presenter.setDivImage(frontDivA, presenter.styleAImage, presenter.configuration.altTextStyleA);
        }

        if(presenter.styleBImage != null){
            var frontDivB = $container.find('div.front_B');
            presenter.setDivImage(frontDivB, presenter.styleBImage, presenter.configuration.altTextStyleB);
        }

        presenter.viewContainer.children('div').append($container);

        $container.find('p.card').each(function(i, e) {
            var element = $(e);
            element.css({
                position : 'absolute',
                width : '100%',
                top : Math.round((parseInt(element.parent().css('height')) - parseInt(element.css('height'))) / 2) + 'px'
            });
        });

        if(!presenter.preview || (presenter.preview && !presenter.previewCards))
            $container.find('div.back').css('visibility', 'hidden');

        if(presenter.imageMode == 'Stretch'){
            presenter.viewContainer.find('.gamememo_container .cell .back.placeholder img').css({
                'width': '100%',
                'height': '100%'
            });
        }

        if(presenter.imageMode == 'KeepAspect'){
            presenter.viewContainer.find('.gamememo_container .cell .back.placeholder img').css({
                'display': 'block',
                'max-width': presenter.requestedColumnWidth,
                'max-height': presenter.requestedRowHeight,
                'width': 'auto',
                'height': 'auto'
            });

            presenter.viewContainer.find('.gamememo_container .cell .back.placeholder img').load(function () {
                presenter.viewContainer.find('.gamememo_container .cell .back.placeholder').each(function () {
                    centerImage(this);
                });
            });

            presenter.viewContainer.find('img').load(function () {
                presenter.viewContainer.find('div.front_A').each(function () {
                    centerImage(this);
                });
            });

            presenter.viewContainer.find('img').load(function () {
                presenter.viewContainer.find('div.front_B').each(function () {
                    centerImage(this);
                });
            });
        }
    };

    presenter.setDivImage = function($div, image, altText) {
        var encodedURI = encodeURI(image);

        if (presenter.imageMode == 'Stretch') {
            $div.css({
                'background': 'url(' + encodedURI + ')',
                'background-size': '100% 100%'
            });
        } else if(presenter.imageMode == 'KeepAspect') {
            var img = $('<img>');
            img.attr('src', encodedURI);
            img.css({
                'display': 'block',
                'max-width': presenter.requestedColumnWidth,
                'max-height': presenter.requestedRowHeight,
                'width': 'auto',
                'height': 'auto'
            });
            $div.append(img);
            $div.css('background', 'transparent');
        } else {
            $div.css({
                'background': 'url(' + encodedURI + ')'
            });
        }

        if (altText !== undefined) {
            var altTextSpan = document.createElement('span');
            altTextSpan.innerText = altText;
            altTextSpan.className = 'gamememo_alt_text';
            $div.append(altTextSpan);
        }
    };

    function centerImage(element) {
        var imgTop = ($(element).height() - $(element).find('img').height())/2;
        var imgLeft = ($(element).width() - $(element).find('img').width())/2;

        $(element).find('img').css({
            'top': imgTop+'px',
            'left': imgLeft+'px',
            'position': 'relative'
        });
    }

    presenter.initializeLogic = function(view, model) {
        presenter.viewContainer = $(view);
        presenter.model = model;

        presenter.configuration = presenter.validateModel(model);
        presenter.ID = model.ID;
        if(presenter.configuration.isError) {
            presenter.showErrorMessage(presenter.configuration.errorMessage, presenter.configuration.errorMessageSubstitutions);
        } else {
            presenter.prepareGrid();
            presenter.createGrid();
        }

    };

    presenter.destroy = function () {
        removeTimers();
    };

    presenter.run = function(view, model) {
        presenter.preview = false;
        eventBus = playerController.getEventBus();
        presenter.initializeLogic(view, model);
        eventBus.addEventListener('ShowAnswers', this);
        eventBus.addEventListener('HideAnswers', this);
        presenter.setVisibility(presenter.configuration.isVisible);
        view.addEventListener('DOMNodeRemoved', function onDOMNodeRemoved(ev) {
            if (ev.target === this) {
                presenter.destroy();
            }
        });
    };

    presenter.createPreview = function(view, model) {
        presenter.preview = true;
        presenter.initializeLogic(view, model);
    };

    var sendSessionEvent = function (eventType) {
        var eventData = {
            'source': presenter.ID,
            'item': eventType,
            'value': '',
            'score': ''
        };
        eventBus.sendEvent('ItemSelected', eventData);
    };

    presenter.startSession = function () {
        if (presenter.timeToSolve > 0) {
            presenter.sessionStarted = new Date();
            var timeout = presenter.timeToSolve*1000 - presenter.spendTime;
            if (timeout <= 0 ){
                presenter.setLockScreen();
            } else {
                presenter.timer = setTimeout(presenter.setLockScreen, timeout);
                presenter.timeInterval = setInterval(presenter.sendTimerEvent, 1000);
                sendSessionEvent('startSession');
            }
        }
    };

     function formatTime(seconds) {
        var minutes = Math.floor(seconds / 60);
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
        seconds = Math.floor(seconds % 60);
        seconds = (seconds >= 10) ? seconds : "0" + seconds;
        return minutes + ":" + seconds;
    }

    presenter.sendTimerEvent = function AddonMemo_sendTimerEvent() {
        var now = new Date(),
        spendTime = Math.round(((now - presenter.sessionStarted) + presenter.spendTime) / 1000),
        remainingTime = presenter.timeToSolve - spendTime,
        progress = Math.round(100 * spendTime / presenter.timeToSolve),
        eventData = {
            'source': presenter.ID,
            'item': progress,
            'value': formatTime(spendTime),
        };
        eventBus.sendEvent('ItemConsumed', eventData);
    };

    function removeTimers() {
        if (presenter.timeInterval){
            clearInterval(presenter.timeInterval);
        }
        if (presenter.timer){
            clearTimeout(presenter.timer);
        }
    };

    presenter.setLockScreen = function AddonMemo_setLockScreen() {
        presenter.turnOffUserInteraction();
        var gamememo_container = presenter.viewContainer.find('.gamememo_container');
        var lockScreen = $('<div class="memo-lock-screen"></div>'),
            lockScreenInfo = $('<div class="memo-lock-screen-info"></div>');
        lockScreenInfo.html(presenter.sessionEndedMessage);
        gamememo_container.append(lockScreen);
        gamememo_container.append(lockScreenInfo);
        sendSessionEvent('endSession');
        removeTimers();
    };

    presenter.removeLockScreen = function AddonMemo_removeLockScreen() {
        var gamememo_container = presenter.viewContainer.find('.gamememo_container');
        gamememo_container.find('.memo-lock-screen').remove();
        gamememo_container.find('.memo-lock-screen-info').remove();
    };

    presenter.getState = function() {
        var state ={
            score: presenter.score,
            errorCount: presenter.errorCount,
            cards: presenter.serializedCards,
            isVisible: presenter.configuration.isVisible
        };
        if (presenter.timeToSolve > 0) {
            var spendTime = presenter.spendTime;
            if (presenter.sessionStarted !== null) {
                var now = new Date();
                spendTime += now - presenter.sessionStarted
            }
            state['spendTime'] = spendTime;
        }
        return JSON.stringify(state);
    };

    presenter.setState = function(state) {
        var stateObj = JSON.parse(state);

        if (stateObj.spendTime) {
            presenter.spendTime = stateObj.spendTime;
        }
        presenter.viewContainer.html('<div></div>');
        presenter.score = stateObj.score;
        presenter.errorCount = stateObj.errorCount;
        presenter.state = presenter.STATES.READY;

        presenter.prepareGridFromSavedState(stateObj.cards);
        presenter.createGrid();

        var cell;

        for(var i = 0; i < stateObj.cards.length; i++) {
            if(stateObj.cards[i].revealed) {
                cell = $(presenter.viewContainer.find(".cell")[i]);

                cell.children(".front").css('visibility', 'hidden');
                cell.children(".back").css('visibility', 'visible');
                cell.addClass("was-clicked");
            }
        }

        if (stateObj.isVisible != undefined) {
            presenter.configuration.isVisible = stateObj.isVisible;
            presenter.setVisibility(presenter.configuration.isVisible);
        }

        if (presenter.timeToSolve && presenter.spendTime &&
            (presenter.timeToSolve*1000 <= presenter.spendTime)){
                presenter.setLockScreen();
        }
    };

    presenter.concealAllCards = function () {
        $.each(presenter.serializedCards, function (index, value) {
            value.revealed = false;
        });
    };


    presenter.reset = function(){
        presenter.viewContainer.html('<div></div>');
        presenter.score = 0;
        presenter.errorCount = 0;
        presenter.state = presenter.STATES.READY;

        presenter.cardClickedFirst = null;
        presenter.cardClickedSecond = null;
        presenter.cardClickedFirstId = null;
        presenter.cardClickedSecondId = null;

        presenter.prepareGrid();
        presenter.createGrid();
        presenter.concealAllCards();

        MathJax.CallBack.Queue().Push(function () {MathJax.Hub.Typeset(presenter.viewContainer.find(".gamememo_container")[0])});

        presenter.configuration.isVisible = presenter.configuration.isVisibleByDefault;
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);
        if (presenter.timeToSolve) {
            presenter.spendTime = 0;
            presenter.sessionStarted = null;
            presenter.removeLockScreen();
            removeTimers()
        }
    };

    presenter.getErrorCount = function() {
        if (!presenter.isActivity) {
            return 0;
        }

        var lastErrorCount = presenter.errorCount;
        presenter.errorCount = 0;

        return lastErrorCount;
    };

    presenter.getMaxScore = function() {
        return presenter.isActivity ? presenter.maxScore : 0;
    };

    presenter.getScore = function() {
        return presenter.isActivity ? presenter.score : 0;
    };

    presenter.executeCommand = function (name, params) {
        if (presenter.configuration.isErrorMode) return;

        var commands = {
            'isAllOK': presenter.isAllOK,
            'showAnswers' : presenter.showAnswers,
            'hideAnswers' : presenter.hideAnswers,
            'show': presenter.show,
            'hide': presenter.hide
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.isAllOK = function () {
        return presenter.getMaxScore() === presenter.getScore();
    };

     presenter.sendAllOKEvent = function () {
        var eventData = {
            'source': presenter.ID,
            'item': 'all',
            'value': '',
            'score': ''
        };

        eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.setShowErrorsMode = function(){
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        if (presenter.isActivity) {
            presenter.turnOffUserInteraction();

            markCardsWithCorrectWrongStyle(filterClickedCards(getClickedCards()), true);
        }
    };

    function getClickedCards() {
        return filterClickedCards(presenter.viewContainer.find('.cell.was-clicked'));
    }

    function filterClickedCards(clickedCards) {
        var filteredArray = [];
        for(var i = 0; i < clickedCards.length; i++) {
            filteredArray.push(clickedCards[i]);
        }

        return filteredArray;
    }

    function filterCardsById (cardsArray, id) {
        return cardsArray.filter(function (element) {
                return ($(element).find("[card_id]").attr("card_id") ==  id);
        });
    }

    function getStyleAction (isAdding) {
        if (isAdding) {
            return function (element, style) {
                $(element).addClass(style);
            };
        }

        return function (element, style) {
            $(element).removeClass(style);
        };
    }

    function markCardsWithCorrectWrongStyle (clickedCards, isAdding) {
        var styleAction = getStyleAction(isAdding);


        function styleWithCorrect(element) {
            styleAction(element, "cell-correct");
        }

        function styleWithWrong(element) {
            styleAction(element, "cell-wrong");
        }

        var usedIds = [];

        clickedCards.map(function (element) {
            var id = $(element).find("[card_id]").attr("card_id");

            if (usedIds.indexOf(id) == -1) {

                var cardsById = filterCardsById(clickedCards, id);

                if (cardsById.length == 2) {
                    cardsById.map(styleWithCorrect);
                } else {
                    cardsById.map(styleWithWrong);
                }
                usedIds.push(id);
            }
        });
    }

    function getClickablePartOfCards() {
        return presenter.viewContainer.find(".front.placeholder");
    }

    function unbindOnCardsCollection (cardsCollection) {
        for(var i = 0; i < cardsCollection.length; i++) {
            $(cardsCollection[i]).unbind();
        }
    }

    function bindClickInteractionOnCardsCollection (cardsCollection) {
        for(var i = 0; i < cardsCollection.length; i++) {
            $(cardsCollection[i]).click(presenter.onCardClicked);
        }
    }

    presenter.turnOffUserInteraction = function () {
        keyboardController.selectEnabled(false);
        unbindOnCardsCollection(getClickablePartOfCards());
    };

    presenter.turnOnUserInteraction = function () {
        keyboardController.selectEnabled(true);
        bindClickInteractionOnCardsCollection(getClickablePartOfCards());
    };

    presenter.setWorkMode = function () {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        if (presenter.isActivity) {
            presenter.turnOnUserInteraction();
            markCardsWithCorrectWrongStyle(getClickedCards(), false);
        }
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
        if (!presenter.isActivity) {
            return;
        }

        presenter.isShowAnswersActive = true;

        presenter.showCard(presenter.viewContainer.find('.cell'));
        presenter.viewContainer.find('.cell').addClass('.cell-show-answers');
        keyboardController.selectEnabled(false);
    };

    presenter.hideAnswers = function () {
        if (!presenter.isActivity) {
            return;
        }

        presenter.viewContainer.find('.cell').removeClass('.cell-show-answers');
        presenter.viewContainer.find('.cell').find('.back').css('visibility', 'hidden');
        presenter.viewContainer.find('.cell').find('.front').css('visibility', 'visible');

        presenter.viewContainer.find('.was-clicked').find('.front').css('visibility', 'hidden');
        presenter.viewContainer.find('.was-clicked').find('.back').css('visibility', 'visible');

        presenter.isShowAnswersActive = false;
        keyboardController.selectEnabled(true);
    };

    presenter.show = function() {
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
    };

    presenter.hide = function() {
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
    };

    presenter.setVisibility = function(isVisible) {
        presenter.viewContainer.css("visibility", isVisible ? "visible" : "hidden");
        presenter.viewContainer.css("display", isVisible ? "block" : "none");
    };

    presenter.keyboardController = function(keycode, isShiftKeyDown) {
        keyboardController.handle(keycode, isShiftKeyDown)
    };


    return presenter;
}