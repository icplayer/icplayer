function Addongamememo_create(){
    var presenter = function(){};

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

    presenter.readConfiguration = function(model) {
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

        var viewWidth = parseInt(presenter.viewContainer.css('width'));
        var viewHeight = parseInt(presenter.viewContainer.css('height'));

        presenter.requestedColumnWidth = Math.round(viewWidth / presenter.columnCount);
        presenter.requestedRowHeight = Math.round(viewHeight / presenter.rowCount);


        return {
            isError: false
        };
    };

    presenter.slideUpAnimation = function ($element) {
        var distance = $element.outerHeight();
        $element.animate({bottom: (distance + 'px')}, 300, function () {
            $(this).css({
                visibility: 'hidden',
                bottom: 0
            })
        });
    };

    presenter.slideDownAnimation = function ($element) {
        var distance = $element.outerHeight();
        $element.css({'bottom': (distance + 'px'), visibility: 'visible'})
                .animate({bottom: 0}, 300);
        };

    presenter.showCard = function(cell) {
        presenter.slideUpAnimation(cell.children(".front"));
        presenter.slideDownAnimation(cell.children(".back"));
    };

    presenter.hideCard = function(cell) {
        presenter.slideUpAnimation(cell.children(".back"));
        presenter.slideDownAnimation(cell.children(".front"));
    };

    presenter.markCardMismatch = function(cell, heightProbeCell) {
        var mark = $('<div class="mismatch_mark">&times;</div>');
        mark.css({
            opacity: 0.8,
            fontSize: Math.round(parseInt(heightProbeCell.parent().css('height')) * 0.95) + 'px'
        });
        cell.parent().append(mark);

        mark.fadeOut(1300, function() {
            mark.remove();
        });
    };


    presenter.prepareGrid = function(model) {
        var cards = [];
        var serializedCards = [];
        var card;
        var serializedCard;

        var pairs = model['Pairs'];

        for(var n = 0; n <= 1; n++) {
            for(var j = 0; j < pairs.length; j++) {

                if(pairs[j][presenter.numberToCardType(n) + ' (text)'] != "") {
                    card = $('<p></p>').text(pairs[j][presenter.numberToCardType(n) + ' (text)']);
                    serializedCard = { revealed: false, type: "text", content: pairs[j][presenter.numberToCardType(n) + ' (text)'] }

                } else {
                    card = $('<img/>').attr({ src: pairs[j][presenter.numberToCardType(n) + ' (image)']});
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

    presenter.shuffleCards = function(cards, serializedCards) {
        var shuffled = presenter.shuffleTwoArrays(presenter.cards, presenter.serializedCards);

        presenter.cards = shuffled[0];
        presenter.serializedCards = shuffled[1];
    };

    presenter.prepareGridFromSavedState = function(savedCards) {
        var cards = [], card;

        for(var i = 0; i < savedCards.length; i++) {
            if(savedCards[i].type == "text") {
                card = $('<p></p>').text(savedCards[i].content);
            } else {
                card = $('<img/>').attr({ src: savedCards[i].content });
            }
            card.addClass('card').attr({'card_id' : savedCards[i].cardId, 'card_style' : savedCards[i].cardStyle });
            cards.push(card);
        }

        presenter.cards = cards;
        presenter.serializedCards = savedCards;
    };



    presenter.handleCardClickedFirst = function(card) {
        presenter.state = presenter.STATES.CLICKED_FIRST;

        presenter.cardClickedFirst = card;
        presenter.showCard(presenter.cardClickedFirst);

        if(presenter.useTwoStyles) {
            presenter.cardClickedStyle = presenter.numberToCardType(parseInt(presenter.cardClickedFirst.find('.card').attr('card_style')));
            presenter.viewContainer.find("div.front_" + presenter.cardClickedStyle).css('cursor', 'default');
        }
    };

    presenter.onCardClicked = function(e) {
        e.stopPropagation();

        if(presenter.useTwoStyles) {
            var clickedStyle = presenter.numberToCardType(parseInt($(e.target).parent().find('.card').attr('card_style')));
            if(clickedStyle == presenter.cardClickedStyle)
                return;
        }

        switch(presenter.state) {
            case presenter.STATES.READY:
                presenter.handleCardClickedFirst($(e.target).parent());
                break;

            case presenter.STATES.CLICKED_FIRST:
                presenter.state = presenter.STATES.CLICKED_SECOND;

                presenter.cardClickedSecond = $(e.target).parent();
                presenter.showCard(presenter.cardClickedSecond);

                presenter.cardClickedFirstId = presenter.cardClickedFirst.find('.card').attr('card_id');
                presenter.cardClickedSecondId = presenter.cardClickedSecond.find('.card').attr('card_id');

                if(presenter.cardClickedFirstId != presenter.cardClickedSecondId) {
                    presenter.errorCount++;
                    presenter.markCardMismatch(presenter.cardClickedFirst.find(".card"), presenter.cardClickedFirst.find(".card"));
                    presenter.markCardMismatch(presenter.cardClickedSecond.find(".card"), presenter.cardClickedFirst.find(".card"));
                } else {
                    var cells = presenter.cardClickedFirst.parent().find(".cell");

                    presenter.serializedCards[$.inArray(presenter.cardClickedFirst[0], cells)].revealed = true;
                    presenter.serializedCards[$.inArray(presenter.cardClickedSecond[0], cells)].revealed = true;

                    presenter.score++;
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

                presenter.handleCardClickedFirst($(e.target).parent());

                presenter.cardClickedSecond = null;
                presenter.cardClickedFirstId = null;
                presenter.cardClickedSecondId = null;
                break;

        }
    };


    presenter.createGrid = function() {
        var cards = presenter.cards;

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


                if(!presenter.preview) {
                    cell.append(back).append(front);

                } else {
                    if(presenter.previewCards) {
                        back.css('display', 'block');
                        cell.append(back);

                    } else {
                        cell.append(back).append(front);
                    }
                }

                $container.append(cell);
            }
        }

        if(presenter.styleAImage != null)
            $container.find('div.front_A').css('background', 'url(' + encodeURI(presenter.styleAImage) + ')');

        if(presenter.styleBImage != null)
            $container.find('div.front_B').css('background', 'url(' + encodeURI(presenter.styleBImage) + ')');


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
    };


    presenter.initializeLogic = function(view, model) {
        presenter.viewContainer = $(view);

        var configuration = presenter.readConfiguration(model);
        if(configuration.isError) {
            presenter.showErrorMessage(configuration.errorMessage, configuration.errorMessageSubstitutions);
        } else {
            presenter.prepareGrid(model);
            presenter.createGrid();
        }

    };

    presenter.run = function(view, model) {
        presenter.preview = false;
        presenter.initializeLogic(view, model);
    };

    presenter.createPreview = function(view, model) {
        presenter.preview = true;
        presenter.initializeLogic(view, model);
    };

    presenter.getState = function() {
        return JSON.stringify({
            score: presenter.score,
            errorCount: presenter.errorCount,
            cards: presenter.serializedCards
        });
    };

    presenter.setState = function(state) {
        var stateObj = JSON.parse(state);

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
            }
        }
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

        presenter.shuffleCards();
        presenter.createGrid();
    };

    presenter.getErrorCount = function() {
        var lastErrorCount = presenter.errorCount;
        presenter.errorCount = 0;
        return lastErrorCount;
    };

    presenter.getMaxScore = function() {
        return presenter.maxScore;
    };

    presenter.getScore = function() {
        return presenter.score;
    };

    return presenter;
}