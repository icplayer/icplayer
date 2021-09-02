function AddonTrueFalse_create() {

    function getTextVoiceObject (text, lang) { return {text: text, lang: lang}; }

    var presenter = function () {};

    presenter.type = "";
    presenter.lastEvent = null;
    presenter.isShowAnswersActive = false;
    presenter.isGradualShowAnswersActive = false;
    presenter.keyboardNavigationActive = false;
    presenter.keyboardNavigationCurrentElement = null;
    presenter.keyboardNavigationElements = [];
    presenter.keyboardNavigationElementsLen = 0;
    presenter.printableState = null;
    presenter.didUserRespond = false;

    var possibleChoices = [];
    var multi = false;
    var isNotActivity = false;
    var questions = [];
    var playerController;
    var eventBus; // Modules communication
    var textParser = null; // Links to Glossary Addon
    var tts;
    var selectedSpeechText = "selected";
    var deselectedSpeechText = "deselected";
    var correctSpeechText = "correct";
    var incorrectSpeechText = "incorrect";

    var QUESTION_AND_CHOICES_REQUIRED = "At least 1 question and 2 choices are required.";
    var INDEX_OUT_OF_RANGE = "Index is out of range.";
    var isWCAGOn = false;

    presenter.isSelectionCorrect = function (question, selection) {
        var answers = question.Answer.split(',');

        for (var i = 0; i < answers.length; i++) {
            if (parseInt(answers[i], 10) === selection) {
                return true;
            }
        }

        return false;
    };

    var score = function () {
        var score = { 'score': 0, 'maxScore': 0, 'errorCount': 0 };
        for (var i = 0; i < questions.length + 1; i++) {
            var j = 0;
            var row = presenter.$view.find('#' + i);
            if (i > 0) {
                var values = (questions[i - 1].Answer).split(',');
                score.maxScore += values.length;
                row.children().each(function () {
                    if (isCorrectAnswer($(this), values, j)) {
                        score.score += 1;
                    } else if (isWrongAnswer($(this), values, j)) {
                        score.errorCount += 1;
                    }
                    j++;
                });
            }
        }
        return score;
    };

    var workMode = function (reset) {
        presenter.$view.find(".tf_" + presenter.type + "_image").each(function () {
            var image = $(this);
            image.removeClass("disabled wrong correct correct-answer");
            if (reset) {
                image.removeClass("down").addClass("up");
            }
        });

        presenter.$view.find('.tf_radio_question').each(function() {
            $(this).removeClass('disabled');
        });
    };

    var markElements = function () {
        for (var i = 0; i < questions.length + 1; i++) {
            var j = 0;
            var row = presenter.$view.find('#' + i);
            if (i > 0) {
                var values = (questions[i - 1].Answer).split(',');
                row.children().each(function () {
                    if ($(this).hasClass("disabled") && j > 0) return;
                    $(this).addClass("disabled");
                    if (isCorrectAnswer($(this), values, j)) {
                        $(this).addClass("correct");
                    } else if (isWrongAnswer($(this), values, j)) {
                        $(this).addClass("wrong");
                    }
                    j++;
                });
            }
        }
    };

    function whichQuestion(row, table) {
        var questionNumber = 0;

        $(table).find('tr').each(function (index) {
            if ($(this)[0] == $(row)[0]) {
                questionNumber = index;

                return false;
            }
        });

        return questionNumber;
    }

    function whichAnswer(element, row) {
        var answerNumber = 0;
        $(row).find('.tf_' + presenter.type + '_image').each(function (index) {
            if ($(this)[0] == $(element)[0]) {
                answerNumber = index + 1; // Answers are counted from 1 to n

                return false;
            }

            return true;
        });

        return answerNumber;
    }

    presenter.createEventData = function (item, wasSelected, isSelectionCorrect) {
        return {
            'source': presenter.addonID,
            'item': item,
            'value': wasSelected ? '0' : '1',
            'score': isSelectionCorrect ? '1' : '0'
        };
    };

    presenter.createAllOKEventData = function () {
        return {
            'source': presenter.addonID,
            'item': 'all',
            'value': '',
            'score': ''
        };
    };

    presenter.createRowOKEventData = function (row) {
        return {
            'source': presenter.addonID,
            'item': row + '-all',
            'value': '',
            'score': ''
        }
    };

    function clickLogic(element) {
        var sendEvent = true;
        var wasSelected = false;
        if (presenter.isDisabled) return;

        if (!$(element).hasClass("disabled")) {
            if (multi) {
                if ($(element).hasClass("down")) {
                    wasSelected = true;
                    $(element).removeClass("down").addClass("up");
                } else {
                    $(element).removeClass("up").addClass("down");
                }
            } else {
                sendEvent = !$(element).hasClass("down");

                $(element).parent().children(".tf_" + presenter.type + "_image").each(function () {
                    $(this).removeClass("down").addClass("up");
                });

                $(element).removeClass("up").addClass("down");
            }

            if (sendEvent) {
                var selectedQuestion = whichQuestion($(element).parent(), $(element).parent().parent());
                var selectedAnswer = whichAnswer($(element), $(element).parent());
                var itemStr = selectedQuestion.toString() + '-' + selectedAnswer.toString();
                var isSelectionCorrect = presenter.isSelectionCorrect(questions[selectedQuestion - 1], parseInt(selectedAnswer, 10));

                var eventData = presenter.createEventData(itemStr, wasSelected, isSelectionCorrect);
                eventBus.sendEvent('ValueChanged', eventData);

                if (multi && presenter.isRowOK(selectedQuestion)) {
                    var rowOKEventData = presenter.createRowOKEventData(selectedQuestion);
                    eventBus.sendEvent('ValueChanged', rowOKEventData);

                }

                if (presenter.isAllOK()) {
                    var allOKEventData = presenter.createAllOKEventData();
                    eventBus.sendEvent('ValueChanged', allOKEventData);
                }
            }
        }
    }

    function handleClickActions(view) {
        if(presenter.isDisabled) return;


        var $elements = $(view).find(".tf_" + presenter.type + "_image");
        
        if (!MobileUtils.isMobileUserAgent(window.navigator.userAgent)){
            $elements.hover(function(){
                $(this).addClass('mouse-hover');
                }, function(){
                $(this).removeClass('mouse-hover');
            });
        }
        
        $elements.on('touchstart', function (e) {
            e.stopPropagation();
            e.preventDefault();

            presenter.lastEvent = e;
        });

        $elements.on('touchend', function (e) {
            e.stopPropagation();
            e.preventDefault();

            if (presenter.lastEvent.type != e.type) {
                clickLogic($(e.target).parent());
            }
        });

        $elements.click(function (e) {
            e.stopPropagation();
            clickLogic(this);
        });
    }

    presenter.addTabindex = function (element, value) {
        element.attr("tabindex", value);
    };

    function generatePossibleChoicesRow(row) {
        row.append('<td class="tf_' + presenter.type + '_question first" role="gridcell">&nbsp;</td>');

        for (var k = 0; k < possibleChoices.length; k++) {
            var td = $('<td class="tf_' + presenter.type + '_text" role="gridcell">' + possibleChoices[k].Choice + '</td>');

            if (presenter.isTabindexEnabled) {
                presenter.addTabindex(td, 0);
            }

            row.append(td);
        }
    }

    function generateQuestionElement(row, rowID) {
        var question = questions[rowID - 1].Question;

        if (textParser !== null) { // Actions performed only in Player mode
            question = textParser.parse(question);
        }
        var td = $('<td class="tf_' + presenter.type + '_question" role="gridcell">' + question + '</td>');

        if (presenter.isTabindexEnabled) {
            presenter.addTabindex(td, 0);
        }

        row.append(td);
    }

    function generateRowContent(row, rowID) {
        generateQuestionElement(row, rowID);

        for (var i = 0; i < possibleChoices.length; i++) {
            if (i === (possibleChoices.length - 1)) {
                row.append('<td class="tf_' + presenter.type + '_image up last"></td>');
            } else {
                row.append('<td class="tf_' + presenter.type + '_image up"></td>');
            }
            var innerElement = document.createElement('div');
            $(innerElement).css('color','rgba(0,0,0,0.0)');
            $(innerElement).css('font-size','0px');
            var text = $("<div>" + possibleChoices[i].Choice + "</div>").text();
            var altText = document.createTextNode(text);
            $(innerElement).append(altText);
            innerElement.setAttribute('role', 'gridcell');

            if (presenter.isTabindexEnabled) {
                presenter.addTabindex($(innerElement), 0);
            }

            $(row).find('td:last-child').append(innerElement);
        }
    }

    function rowIndexed () {
        var count = possibleChoices.length + 1;
        return questions.reduce(function (acc, q, index) {
            acc.push({
                start: (index * count),
                end: ((index + 1) * count) - 1
            });
            return acc;
        }, []);
    }

    presenter.generateTableContent = function AddonTrueFalse_generateTableContent(table, view) {
        table.setAttribute('role', 'table');
        for (var rowID = 0; rowID < questions.length + 1; rowID++) {
            $(table).append('<tr class="tf_' + presenter.type + '_row" id=' + rowID + ' role="row"></tr>');
            var row = $(view).find('#' + rowID);

            if (rowID === 0) {
                generatePossibleChoicesRow(row);
            } else {
                var answers = (questions[rowID - 1].Answer).split(',');
                for (var m = 0; m < answers.length; m++) {
                    var answer = parseInt(answers[m]);
                    if (answer > possibleChoices.length || answer <= 0) {
                        $(view).html(INDEX_OUT_OF_RANGE);

                        break;
                    }
                }

                generateRowContent(row, rowID);
            }
        }
    };

    function getSpeechTexts(model) {
        var speechTexts = model['Speech texts'];

        if (speechTexts['Selected']['selected'] !== '' && speechTexts['Selected']['selected'] !== undefined) {
            selectedSpeechText = speechTexts['Selected']['selected'];
        }

        if (speechTexts['Deselected']['deselected'] !== '' && speechTexts['Deselected']['deselected'] !== undefined) {
            deselectedSpeechText = speechTexts['Deselected']['deselected'];
        }

        if (speechTexts['Correct']['correct'] !== '' && speechTexts['Correct']['correct'] !== undefined) {
            correctSpeechText = speechTexts['Correct']['correct'];
        }

        if (speechTexts['Incorrect']['incorrect'] !== '' && speechTexts['Incorrect']['incorrect'] !== undefined) {
            incorrectSpeechText = speechTexts['Incorrect']['incorrect'];
        }
    }

    var makeView = function (view, model, isPreview) {
        possibleChoices = model['Choices'];
        questions = model['Questions'];
        presenter.langAttribute = model['Lang attribute'];
        presenter.isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);
        presenter.isVisibleByDefault = ModelValidationUtils.validateBoolean(model["Is Visible"]);
        presenter.isDisabled = false; // At start addon is always enabled, so we need to reset flag and set correct value.
        presenter.isDisabledByDefault = ModelValidationUtils.validateBoolean(model["isDisabled"]);
        presenter.$view.attr('lang', presenter.langAttribute);

        getSpeechTexts(model);

        if (notAllRequiredParameters(questions, possibleChoices)) {
            return $(view).html(QUESTION_AND_CHOICES_REQUIRED);
        }

        multi = model['Multi'] === 'True';

        if (model['isNotActivity'] != undefined){
            isNotActivity = (model['isNotActivity'] === 'True');
        }
        else {
            isNotActivity = false;
        }

        presenter.type = multi ? "checkbox" : "radio";
        var table = document.createElement('table');

        $(table).addClass('tf_' + presenter.type);
        $(table).attr("cellspacing", 0).attr("cellpadding", 0);
        $(view).append(table);

        presenter.generateTableContent(table, view);

        if (!isPreview) {
            handleClickActions(view);
            presenter.setVisibility(presenter.isVisible);

            if (presenter.isDisabledByDefault) {
                presenter.disable();
            } else {
                presenter.enable();
            }
        }

        if (textParser !== null) { // Actions performed only in Player mode
            textParser.connectLinks($(view));
        }

        if (!isPreview) {
            presenter.$view.find('.tf_' + presenter.type + '_image' + ',.tf_' + presenter.type + '_question:not(.first)').each(function(index, element){
                presenter.keyboardNavigationElements[index] = $(element);
            });

            presenter.keyboardNavigationElementsLen = presenter.keyboardNavigationElements.length;
        }
    };

    presenter.setPlayerController = function (controller) {
        playerController = controller;
    };

    presenter.setEventBus = function (wrappedEventBus) {
        eventBus = wrappedEventBus;
    };

    presenter.setVisibility = function (isVisible) {
        presenter.$view.css('visibility', isVisible ? 'visible' : 'hidden');
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
        presenter.isVisible = false;
    };

    presenter.show = function () {
        presenter.setVisibility(true);
        presenter.isVisible = true;
    };

    presenter.upgradeModel = function (model) {
        if (model['Speech texts'] === undefined) {
            model['Speech texts'] = {
                'Selected': {
                    'selected': ''
                },

                'Deselected': {
                    'deselected': ''
                },

                'Correct': {
                    'correct': ''
                },

                'Incorrect': {
                    'incorrect': ''
                }
            }
        }

        return model;
    };

    presenter.validateModel = function(model) {
        presenter.isTabindexEnabled = ModelValidationUtils.validateBoolean(model['Is Tabindex Enabled']);
    };

    presenter.run = function (view, model) {
        model = presenter.upgradeModel(model);
        presenter.$view = $(view);
        textParser = new TextParserProxy(playerController.getTextParser());

        presenter.validateModel(model);

        presenter.addonID = model.ID;
        makeView(view, model, false);

        var events = ['ShowAnswers', 'HideAnswers', 'GradualShowAnswers', 'GradualHideAnswers'];

        if (!eventBus) { return; }

        for (var i = 0; i < events.length; i++) {
            eventBus.addEventListener(events[i], this);
        }
    };

    function isCorrectAnswer(element, values, index) {
        return values.indexOf(index.toString()) >= 0 && element.hasClass("down");
    }

    function isWrongAnswer(element, values, index) {
        return values.indexOf(index.toString()) < 0 && element.hasClass("down");
    }

    function notAllRequiredParameters(questions, possibleChoices) {
        return !questions[0].Question || possibleChoices.length < 2 || !possibleChoices[0].Choice || !possibleChoices[1].Choice;
    }

    function getSelectedElements() {
        var selectedElements = [];
        var i = 0;
        presenter.$view.find(".tf_" + presenter.type + "_image").each(function () {
            selectedElements[i] = $(this).hasClass("down");
            i++;
        });
        return selectedElements;
    }

    presenter.createPreview = function (view, model) {
        model = presenter.upgradeModel(model);
        presenter.$view = $(view);
        makeView(view, model, true);
    };

    presenter.getState = function () {
        function getStateBase(selectedElements) {
            return {
            selectedElements: selectedElements,
            isVisible: presenter.isVisible,
            isDisabled: presenter.isDisabled
            }
        }

        var state = {};
        if (presenter.isShowAnswers()) {
            state = getStateBase(presenter.currentState); // This is saved on ShowAnswers
        } else {
            state = getStateBase(getSelectedElements());
        }

        return JSON.stringify(state);
    };

    presenter.setState = function (state) {
        if (!state) {
            return;
        }

        var i = 0;
        var selectedElements;
        var parsedState = JSON.parse(state);
        if(typeof parsedState.isVisible !== "undefined"){
            selectedElements = parsedState.selectedElements;
            presenter.setVisibility(parsedState.isVisible);
            presenter.isVisible = parsedState.isVisible;
        }else{
            selectedElements = parsedState;
        }

        presenter.$view.find(".tf_" + presenter.type + "_image").each(function () {
            if (selectedElements[i] == true) {
                $(this).addClass("down");
                $(this).removeClass("up");
            }
            i++;
        });

        //  For backward compatibility in old lessons
        if (parsedState.isDisabled === undefined) {
            parsedState.isDisabled = false;
        }

        if(!presenter.isShowAnswersActive) {
            if (parsedState.isDisabled) {
                presenter.disable();
            } else {
                presenter.enable();
            }
        }
    };

    presenter.setPrintableState = function(state) {
        if (state === null || ModelValidationUtils.isStringEmpty(state))
            return;
        presenter.didUserRespond = true;
        presenter.printableState = JSON.parse(state);
    }

    presenter.setShowErrorsMode = function () {
        if (isNotActivity) {
            return;
        }

        presenter.isErrorMode = true;

        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        markElements();
    };

    presenter.setWorkMode = function () {
        if (isNotActivity) {
            return;
        }

        presenter.isErrorMode = false;

        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        workMode(false);
    };

    presenter.reset = function () {
        presenter.isErrorMode = false;
        presenter.isShowAnswersActive = false;
        presenter.isGradualShowAnswersActive = false;

        if (presenter.currentState) {
            delete presenter.currentState;
        }

        workMode(true);
        presenter.setVisibility(presenter.isVisibleByDefault);
        presenter.isVisible = presenter.isVisibleByDefault;

        if (presenter.isDisabledByDefault) {
            presenter.disable();
        } else {
            presenter.enable();
        }
    };

    presenter.getErrorCount = function () {
        if (isNotActivity) return 0;

        if (presenter.isShowAnswers()) {
            return presenter.currentScore.errorCount;
        }

        return score().errorCount;
    };

    presenter.getMaxScore = function () {
        if (isNotActivity) return 0;

        if (presenter.isShowAnswers()) {
            return presenter.currentScore.maxScore;
        }

        return score().maxScore;
    };

    presenter.getScore = function () {
        if (isNotActivity) return 0;

        if (presenter.isShowAnswers()) {
            return presenter.currentScore.score;
        }

        return score().score;
    };

    presenter.executeCommand = function (name, params) {
        if (presenter.isErrorMode) {
            return;
        }

        var commands = {
            'isAllOK': presenter.isAllOK,
            'isSelected': presenter.isSelectedCommand,
            'markAsCorrect': presenter.markAsCorrectCommand,
            'markAsWrong': presenter.markAsWrongCommand,
            'markAsEmpty': presenter.markAsEmptyCommand,
            'removeMark': presenter.removeMarkCommand,
            'isAttempted' : presenter.isAttemptedCommand,
            'show': presenter.show,
            'hide': presenter.hide,
            'reset' : presenter.reset,
            'showAnswers' : presenter.showAnswers,
            'hideAnswers' : presenter.hideAnswers,
            'enable' : presenter.enable,
            'disable' : presenter.disable
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.isAllOK = function () {
        return presenter.getMaxScore() === presenter.getScore() && presenter.getErrorCount() === 0;
    };

    presenter.isRowOK = function (selectedQuestion) {
        var correctAnswersLength = 0;
        var rowAnswers = questions[selectedQuestion - 1].Answer.split(',');
        var row = presenter.$view.find('#' + selectedQuestion);

        for (var i = 0; i < row.children('.down').length; i++) {
            var selectedAnswer = $(row.children('.down')[i]).index();
            var isSelectionCorrect = presenter.isSelectionCorrect(questions[selectedQuestion - 1], parseInt(selectedAnswer, 10));
            if (isSelectionCorrect) {
                correctAnswersLength++;
            }
        }

        return rowAnswers.length === correctAnswersLength;
    };

    presenter.isSelected = function (rowIndex, answerIndex) {
        if (answerIndex < 1) return false;

        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        var row = presenter.$view.find('#' + rowIndex);
        var el = row.children()[answerIndex];
        return $(el).hasClass("down");
    };


    presenter.markAsCorrect = function (rowIndex, answerIndex) {
        if(presenter.isDisabled) return;

        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        var row = presenter.$view.find('#' + rowIndex);
        if (rowIndex > 0) {
            var el = row.children()[answerIndex];
            $(el).addClass("disabled");
            $(el).addClass("correct");
         }
    };

    presenter.markAsWrong = function (rowIndex, answerIndex) {
        if(presenter.isDisabled) return;

        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        var row = presenter.$view.find('#' + rowIndex);
        if (rowIndex > 0) {
            var el = row.children()[answerIndex];
            $(el).addClass("disabled");
            $(el).addClass("wrong");
        }
    };

    presenter.markAsEmpty = function (rowIndex, answerIndex) {
        if(presenter.isDisabled) return;

        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        var row = presenter.$view.find('#' + rowIndex);
        if (rowIndex > 0) {
            var el = row.children()[answerIndex];
            $(el).addClass("disabled");
        }
    };

    presenter.removeMark = function (rowIndex, answerIndex) {
        if(presenter.isDisabled) return;

        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        var row = presenter.$view.find('#' + rowIndex);
        if (rowIndex > 0) {
            var el = row.children()[answerIndex];
            $(el).removeClass("wrong").removeClass("correct");
        }
    };

    presenter.isAttempted = function () {
        if (isNotActivity) return true;

        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        var isAttempted = false;
        for (var rowIndex = 0; rowIndex < questions.length + 1; rowIndex++) {
            var answerIndex = 0;
            var row = presenter.$view.find('#' + rowIndex);
            if (rowIndex > 0) {
                row.children().each(function () {
                    if (presenter.isSelected(rowIndex, answerIndex)) {
                        isAttempted = true;
                        return false; // break;
                    }
                    answerIndex++;
                    return true;
                });
            }
        }
        return isAttempted;
    };

    presenter.isSelectedCommand = function (params) {
        presenter.isSelected(parseInt(params[0], 10), parseInt(params[1], 10));
    };

    presenter.isAttemptedCommand = function () {
         return presenter.isAttempted();
    };

    presenter.markAsEmptyCommand = function (params) {
        presenter.markAsEmpty(parseInt(params[0], 10), parseInt(params[1], 10));
    };

    presenter.markAsWrongCommand = function (params) {
        presenter.markAsWrong(parseInt(params[0], 10), parseInt(params[1], 10));
    };

    presenter.removeMarkCommand = function (params) {
        presenter.removeMark(parseInt(params[0], 10), parseInt(params[1], 10));
    };

    presenter.markAsCorrectCommand = function (params) {
        presenter.markAsCorrect(parseInt(params[0], 10), parseInt(params[1], 10));
    };

    presenter.onEventReceived = function (eventName, data) {
        if (eventName === "ShowAnswers") {
            presenter.showAnswers();
        } else if (eventName === "HideAnswers") {
            presenter.hideAnswers();
        } else if (eventName === "GradualShowAnswers") {
            if (!presenter.isGradualShowAnswersActive) {
                presenter.currentScore = score();
                presenter.currentState = getSelectedElements();
                presenter.isGradualShowAnswersActive = true;
            }
            if (data.moduleID === presenter.addonID) {
                workMode(true);
                presenter.gradualShowAnswers(parseInt(data.item, 10));
            }
        } else if (eventName === "GradualHideAnswers") {
            presenter.gradualHideAnswers();
        }
    };

    presenter.gradualShowAnswers = function (itemIndex) {
        presenter.setCorrectAnswers(itemIndex + 1); // don't ask
    }

    presenter.gradualHideAnswers = function () {
        presenter.isGradualShowAnswersActive = false;
        workMode(true);

        var state = JSON.stringify({
            "selectedElements": presenter.currentState,
            "isVisible": presenter.isVisible
        });

        presenter.setState(state);

        delete presenter.currentState;
    }

    presenter.isShowAnswers = function () {
        return presenter.isShowAnswersActive || presenter.isGradualShowAnswersActive;
    }

    presenter.getActivitiesCount = function () {
        return questions.length;
    }

    presenter.disable = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        presenter.isDisabled = true;
        presenter.$view.addClass("disabled");
    };

    presenter.enable = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        presenter.isDisabled = false;
        presenter.$view.removeClass("disabled");
    };

    presenter.showAnswers = function () {
        if (isNotActivity || presenter.isShowAnswersActive) {
            return;
        }

        presenter.currentScore = score();
        presenter.isShowAnswersActive = true;
        presenter.currentState = getSelectedElements();
        presenter.isErrorMode = false;
        workMode(true);

        presenter.setCorrectAnswers(questions.length)
    };

    presenter.setCorrectAnswers = function (length) {
       for (var i = 1; i < length + 1; i++) {
            var $row = presenter.$view.find('#' + i);
            var correctValues = (questions[i - 1].Answer).split(',');

            var trueFalseImages = $row.find(".tf_" + presenter.type + "_image");
            trueFalseImages.addClass('disabled');

            for (var j = 0; j < correctValues.length; j++) {
                // empty string split by separator will return array with empty element
                if (correctValues[j].length > 0) {
                    var index = parseInt(correctValues[j], 10) + 1;
                    var $element = $row.find(".tf_" + presenter.type + "_image:nth-child(" + index + ")");

                    $element.addClass('down correct-answer');
                    $element.removeClass('up');
                }
            }
        }
    }

    presenter.hideAnswers = function () {
        if (isNotActivity || !presenter.isShowAnswersActive) {
            return;
        }

        workMode(true);

        var state = JSON.stringify({
            "selectedElements": presenter.currentState,
            "isVisible": presenter.isVisible
        });

        presenter.setState(state);

        delete presenter.currentState;
        presenter.isShowAnswersActive = false;
    };

    function getTextToSpeech () {
        if (tts) {
            return tts;
        }

        tts = playerController.getModule('Text_To_Speech1');
        return tts;
    }

    function getActivatedElement () {
        return presenter.$view.find('.keyboard_navigation_active_element');
    }

    function getElementIndex(element) {
        var div = element.parent(),
            parent = div.parent(),
            list = parent.find('td');

        return $(list).index(div);
    }

    function getChoice(index) {
        var $topRowElement = presenter.$view.find('#0');
        var $choiceElement = $topRowElement.children().eq(index);
        return window.TTSUtils.getTextVoiceArrayFromElement($choiceElement,presenter.langAttribute);
    }

    function readOption(readSelection) {
        var tts = getTextToSpeech();
        if (tts) {
            var $active = getActivatedElement(),
                elementIndex = getElementIndex($active),
                choiceArray = getChoice(elementIndex);
            
            if ($active.hasClass('tf_' + presenter.type + '_question')) {
                speak(window.TTSUtils.getTextVoiceArrayFromElement($active,presenter.langAttribute));
                return;
            }

            if (!readSelection) {
                if ($active.parent().hasClass('down')) {
                    if (presenter.isErrorMode) {
                        if ($active.parent().hasClass('correct')) {
                            speak(choiceArray.concat([getTextVoiceObject(selectedSpeechText + " " + correctSpeechText, "")]))
                        }
                        if($active.parent().hasClass('wrong')) {
                            speak(choiceArray.concat([getTextVoiceObject(selectedSpeechText + " " + incorrectSpeechText, "")]))
                        }
                    } else {
                        speak(choiceArray.concat([getTextVoiceObject(selectedSpeechText, "")]))
                    }
                } else {
                    speak(choiceArray);
                }
            } else {
                if ($active.parent().hasClass('down')) {
                    speak([getTextVoiceObject(selectedSpeechText, "")]);
                } else {
                    speak([getTextVoiceObject(deselectedSpeechText, "")]);
                }
            }
        }
    }

    presenter.setWCAGStatus = function (isOn) {
        isWCAGOn = isOn;
    };

    function speak (data) {
        var tts = getTextToSpeech();
        if (tts && isWCAGOn) {
            tts.speak(data);
        }
    }

    presenter.keyboardController = function(keycode, isShiftKeyDown, event) {
        event.preventDefault();
        presenter.shiftPressed = event.shiftKey;

        var keys = {
            ENTER: 13,
            ESCAPE: 27,
            SPACE: 32,
            ARROW_LEFT: 37,
            ARROW_UP: 38,
            ARROW_RIGHT: 39,
            ARROW_DOWN: 40,
            TAB: 9
        };

        function mark_current_element(new_position_index){
            if (presenter.keyboardNavigationCurrentElement) {
                if(presenter.keyboardNavigationCurrentElement.find('div').length > 0) {
                    presenter.keyboardNavigationCurrentElement.find('div').removeClass('keyboard_navigation_active_element');
                } else {
                    presenter.keyboardNavigationCurrentElement.removeClass('keyboard_navigation_active_element');
                }
            }
            presenter.keyboardNavigationCurrentElementIndex = new_position_index;
            presenter.keyboardNavigationCurrentElement = presenter.keyboardNavigationElements[new_position_index];
            if(presenter.keyboardNavigationCurrentElement.find('div').length > 0) {
                presenter.keyboardNavigationCurrentElement.find('div').addClass('keyboard_navigation_active_element');
            } else {
                presenter.keyboardNavigationCurrentElement.addClass('keyboard_navigation_active_element');
            }
        }

        var enter = function (){
            if (isShiftKeyDown) {
                if (presenter.keyboardNavigationActive){
                    escape();
                    presenter.isKeyboardOpened = false;
                }
                return;
            }

            if (!presenter.keyboardNavigationActive) {
                presenter.keyboardNavigationActive = true;
                mark_current_element(0);
                readOption(false);
            } else {
                readOption(false);
            }
        };

        function swicht_element(move, checkDirection){
            var rows = rowIndexed();

            var currentRow = rows.filter(function (row) {
                return row.start <= presenter.keyboardNavigationCurrentElementIndex && row.end >= presenter.keyboardNavigationCurrentElementIndex;
            })[0];

            var new_position_index = presenter.keyboardNavigationCurrentElementIndex + move;

            if(checkDirection && currentRow && (new_position_index < currentRow.start || new_position_index > currentRow.end)) {
                return;
            }

            if (new_position_index >= presenter.keyboardNavigationElementsLen) {
                new_position_index = new_position_index - move;
            } else if (new_position_index < 0) {
                new_position_index = presenter.keyboardNavigationCurrentElementIndex;
            }
            mark_current_element(new_position_index);
        }

        var next_element = function (){
            swicht_element(1, true);
            readOption(false);
        };

        var previous_element = function (){
            swicht_element(-1, true);
            readOption(false);
        };

        var next_question = function () {
            swicht_element(possibleChoices.length + 1, false);
            readOption(false);
        };

        var previous_question = function () {
            swicht_element(-(possibleChoices.length + 1), false);
            readOption(false);
        };

        var mark = function (){
            if (presenter.isErrorMode) {
                return;
            }
            presenter.keyboardNavigationCurrentElement.click();
            readOption(true);
        };

        var escape = function (){
            if (!presenter.keyboardNavigationActive){
                return;
            }
            presenter.keyboardNavigationActive = false;
            presenter.keyboardNavigationCurrentElement.find('div').removeClass('keyboard_navigation_active_element');
            presenter.keyboardNavigationCurrentElement.removeClass('keyboard_navigation_active_element');
            presenter.keyboardNavigationCurrentElement = null;
        };

        function tabHandler() {
            swicht_element(isShiftKeyDown ? -1 : 1, true);
            readOption(false);
        }

        var mapping = {};
        mapping[keys.ENTER] = enter;
        mapping[keys.ESCAPE] = escape;
        mapping[keys.SPACE] = mark;
        mapping[keys.ARROW_LEFT] = previous_element;
        mapping[keys.ARROW_UP] = previous_question;
        mapping[keys.ARROW_RIGHT] = next_element;
        mapping[keys.ARROW_DOWN] = next_question;
        mapping[keys.TAB] = tabHandler;

        try {
            mapping[keycode]();
        } catch (er) {
        }

    };

    presenter.getPrintableHTML = function (model, showAnswers) {
        var model = presenter.upgradeModel(model);
        var isMulti = model.Multi === 'True';
        var userAnswers = getUserResponses();
        var choiceLength = model.Choices.length

        var $view = $("<div></div>");
        $view.attr('id', model.ID);
        $view.addClass('printable_addon_TrueFalse');
        $view.css("max-width", model["Width"]+"px");
        var $table = $("<table></table>");
        var $tbody = $("<tbody></tbody>");

        //Header row
        var $trHead = $("<tr></tr>");
        $trHead.append("<td></td>");
        for (var i = 0; i < choiceLength; i++) {
            var choice = model.Choices[i];
            var $td = $("<td></td>");
            $td.html(choice.Choice);
            if (isMulti && showAnswers && presenter.didUserRespond) {
                $td.attr('colspan', '2');
            } else if (!isMulti && showAnswers && presenter.didUserRespond && i === (choiceLength - 1)) {
                $td.attr('colspan', '2');
            }
            $trHead.append($td);
        }
        $tbody.append($trHead);

        //Question rows
        for (var i = 0; i < model.Questions.length; i++) {
            var question = model.Questions[i];
            var $tr = $("<tr></tr>");

            var $questionCell = $("<td></td>");
            $questionCell.html(window.TTSUtils.parsePreviewAltText(question.Question));
            $tr.append($questionCell);

            var answers = [];
            if (showAnswers) answers = question.Answer.split(',');
            var boxType = isMulti ? "checkbox" : "radio";

            for (var j = 0; j < choiceLength; j++) {
                var $td = $("<td></td>");

                $td.addClass(`${boxType}-container`);
                $td.addClass(`${boxType}-${i+1}-${j+1}`);
                var $inputDiv = $("<div></div>");
                $inputDiv.addClass("placeholder");
                $td.append($inputDiv);
                var $checkbox = $("<input type=\"checkbox\">");
                var userAnswerIndex = i * choiceLength + j;
                var $checkboxSpan = $("<span></span>");

                if (presenter.didUserRespond && userAnswers[userAnswerIndex]) {
                    $checkbox.attr("checked", "checked");
                    $checkboxSpan.css('background', 'black');
                } else if (showAnswers && answers.indexOf((j+1).toString()) != -1 && !presenter.didUserRespond) {
                    $checkbox.attr("checked", "checked");
                    $checkboxSpan.css('background', 'darkgray');
                }

                $td.append($checkbox);

                $td.append($checkboxSpan);
                $tr.append($td);

                if (showAnswers && isMulti && userAnswers[userAnswerIndex]) {
                    var $markCell = $("<td></td>");
                    var $markDiv = $("<div></div>");
                    isAnswerCorrect(answers, userAnswers, i, j, choiceLength) ? $markDiv.addClass("correctAnswerMark") : $markDiv.addClass("incorrectAnswerMark");
                    $markCell.append($markDiv);
                    $tr.append($markCell);
                } else if (showAnswers && presenter.didUserRespond && isMulti) {
                    addCell(answers, userAnswers, $tr, i, choiceLength);
                }
            }
            if (showAnswers && !isMulti && didUserRespondOnQuestion(userAnswers, i, choiceLength)) {
                addCell(answers, userAnswers, $tr, i, choiceLength, true);
            }
            $tbody.append($tr);
        }

        $table.append($tbody);
        $view.append($table);
        return $view[0].outerHTML;
    };

    presenter.getScoreWithMetadata = function() {
        var scores = [];
        var allAnswers = [];
        var selectedElements = getSelectedElements();
        for (var i = 0; i < possibleChoices.length; i++) {
            allAnswers.push(possibleChoices[i].Choice.trim());
        }
        for (var i = 0; i < questions.length; i++) {
            var score = {
                userAnswer: "",
                allAnswers: allAnswers,
                isCorrect: false,
            };
            var correctAnswers = questions[i].Answer.split(',');
            firstChoiceIndex = i * possibleChoices.length;
            for (var j = 0; j < possibleChoices.length; j++) {
                if (selectedElements[firstChoiceIndex + j]) {
                    score.userAnswer = allAnswers[j];
                    if (correctAnswers.indexOf((j + 1) + "") != -1) {
                        score.isCorrect = true;
                    }
                }
            }
            scores.push(score);
        }
        return scores;
    }

    function getUserResponses() {
        if (presenter.printableState && presenter.printableState.hasOwnProperty('selectedElements')) {
            return presenter.printableState['selectedElements']
        }
        return [];
    }

    function addCell(answers, userAnswers, $tableRow, i, choiceLength, shouldAddMark = false) {
        var $td = $("<td></td>");
        var $markDiv = $("<div></div>");
        if (shouldAddMark) {
            areAnswersCorrect(answers, userAnswers, i, choiceLength) ? $markDiv.addClass("correctAnswerMark")
                : $markDiv.addClass("incorrectAnswerMark");
        }
        $td.append($markDiv);
        $tableRow.append($td);
    }

    function didUserRespondOnQuestion(userAnswers, i, choiceLength) {
        return userAnswers.slice(i * choiceLength, (i + 1) * choiceLength).some(answer => answer);
    }

    function areAnswersCorrect(correctAnswer, userAnswer, i, choiceLength) {
        var areCorrect = false;
        correctAnswer.forEach(answer => {
            var index = +answer - 1;
            if (userAnswer[i * choiceLength + index]) {
                areCorrect = true;
            }
        });
        return areCorrect;
    }

    function isAnswerCorrect(correctAnswers, userAnswer, i, j, choiceLength) {
        return correctAnswers.indexOf((j + 1).toString()) !== -1 && userAnswer[i * choiceLength + j];
    }

    return presenter;
}
