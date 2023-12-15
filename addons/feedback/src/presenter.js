function Addonfeedback_create() {
    var presenter = function () {
    };

    presenter.responses = {};
    presenter.defaultResponse = "";
    presenter.feedbackContainer = null;
    presenter.currentStateDefault = false;
    presenter.currentStateId = null;
    presenter.speechTexts = {};

    var playerController = null;
    var textParser = null;

    presenter.STATUSES = {
        TRUE: "T",
        FALSE: "F",
        NEUTRAL: "N",
        CUSTOM: "C"
    };

    presenter.ERROR_MESSAGES = {
        RESPONSE_ID_NOT_UNIQUE: "Response ID \"%id%\" is not unique",
        RESPONSE_STATUS_INVALID: "Response status \"%status%\" for response %n% (ID \"%id%\") is invalid, it has to be one of \"T\" (true), \"N\" (neutral), \"F\" (false) or \"C\" (custom)",
        PREVIEW_RESPONSE_ID_INVALID: "Cannot preview response: there's no response with ID \"%id%\""
    };

    presenter.setPlayerController = function (controller) {
        playerController = controller;
        textParser = new TextParserProxy(playerController.getTextParser());
    };

    function getTextVoiceObject (text, lang) {return {text: text, lang: lang};}

    presenter.getTextToSpeechOrNull = function (playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    var feedbackSpeakInterval = null;
    function setSpeakInterval (data) {
        if(feedbackSpeakInterval) {
            clearInterval(feedbackSpeakInterval);
            feedbackSpeakInterval = null;
        }
        feedbackSpeakInterval = setInterval(function () {

            var speechSynthSpeaking = false;
            var responsiveVoiceSpeaking = false;
            if ('speechSynthesis' in window) {
                speechSynthSpeaking = window.speechSynthesis.speaking;
            }
            if (window.responsiveVoice) {
                responsiveVoiceSpeaking = window.responsiveVoice.isPlaying();
            }
            if (!speechSynthSpeaking && !responsiveVoiceSpeaking) {
                clearInterval(feedbackSpeakInterval);
                feedbackSpeakInterval = null;
                var tts = presenter.getTextToSpeechOrNull(playerController);
                if (tts && playerController.isWCAGOn()) {
                    tts.speak(data);
                }
            }
        }, 200);
    }

    var feedbackSpeakTimeout = null;
    function speak (data) {
        if(feedbackSpeakTimeout) {
            clearTimeout(feedbackSpeakTimeout);
            feedbackSpeakTimeout = null;
        }
        feedbackSpeakTimeout = setTimeout(function(){setSpeakInterval(data);},300);
    }

    presenter.stopFeedbackTTS = function() {
        clearTimeout(feedbackSpeakTimeout);
        clearInterval(feedbackSpeakInterval);
    };

    function getTextVoiceArrayFromText(text) {
        const el = document.createElement('div');
        el.innerHTML = window.xssUtils.sanitize(text);
        const $el = $(el);

        return window.TTSUtils.getTextVoiceArrayFromElement($el,presenter.configuration.langTag);
    }

    presenter.readCurrentMessage = function(readEmptyOnDefault) {
        if (presenter.getTextToSpeechOrNull(playerController) && playerController.isWCAGOn()) {
            if (presenter.currentStateDefault) {
                if(readEmptyOnDefault) {
                    presenter.readDefaultMessage();
                } else {
                    presenter.stopFeedbackTTS();
                }
            } else if (presenter.currentStateId) {
                presenter.readMessageById(presenter.currentStateId);
            }
        }
    };

    presenter.readDefaultMessage = function() {
        var TextVoiceArray = [];
        TextVoiceArray.push(getTextVoiceObject(presenter.speechTexts.empty));
        speak(TextVoiceArray);
    };

    presenter.readMessageById = function(id) {
        if(id && presenter.responses[id]) {
            var TextVoiceArray = [];
            var response = presenter.responses[id];
            if ( 0 === response.status.toLowerCase().localeCompare("t")) {
                TextVoiceArray.push(getTextVoiceObject(presenter.speechTexts.positive));
            }
            if ( 0 === response.status.toLowerCase().localeCompare("f")) {
                TextVoiceArray.push(getTextVoiceObject(presenter.speechTexts.negative));
            }
            TextVoiceArray = TextVoiceArray.concat(getTextVoiceArrayFromText(response.text));
            speak(TextVoiceArray);
        }
    };

    presenter.showErrorMessage = function (message, substitutions) {
        var errorContainer;
        if (typeof(substitutions) == 'undefined') {
            errorContainer = '<p>' + message + '</p>';
        } else {
            var messageSubst = message;
            for (var key in substitutions) {
                if (!substitutions.hasOwnProperty(key)) continue;

                messageSubst = messageSubst.replace('%' + key + '%', substitutions[key]);
            }
            errorContainer = '<p>' + messageSubst + '</p>';
        }

        presenter.$view.html(errorContainer);
    };

    presenter.setDefaultResponse = function () {
        if (!presenter.preview) {
            presenter.feedbackContainer.find('.response').removeClass('visible');
            presenter.feedbackContainer.find('.default_response').addClass('visible');

            if (presenter.configuration.isTabindexEnabled) {
                presenter.setTabindex(presenter.feedbackContainer.find('.response'), false);
                presenter.setTabindex(presenter.feedbackContainer.find('.default_response'), true);
            }
        }
        if (presenter.preview || !presenter.configuration.fadeTransitions) {
            presenter.feedbackContainer.find('.response').css('opacity', 0);
            presenter.feedbackContainer.find('.default_response').css('opacity', 1);
        } else if (presenter.configuration.fadeTransitions) {
            presenter.feedbackContainer.find('.response:not(.default_response)').animate({opacity: 0.0}, {queue: false});
            presenter.feedbackContainer.find('.default_response').animate({opacity: 1.0}, {queue: false});
        }
        presenter.currentStateDefault = true;
        presenter.currentStateId = null;

        if (!presenter.configuration.isMute) {
            presenter.readCurrentMessage(false);
        }
    };

    presenter.setResponse = function (id) {
        if (!presenter.preview) {
            presenter.feedbackContainer.find('.response').removeClass('visible');
            presenter.feedbackContainer.find('.response_' + id).addClass('visible');

            if (presenter.configuration.isTabindexEnabled) {
                presenter.setTabindex(presenter.feedbackContainer.find('.response'), false);
                presenter.setTabindex(presenter.feedbackContainer.find('.response_' + id), true);
            }
        }
        if (presenter.preview || !presenter.configuration.fadeTransitions) {
            presenter.feedbackContainer.find('.response').css('opacity', 0);
            presenter.feedbackContainer.find('.response_' + id).appendTo(presenter.feedbackContainer).css('opacity', 1);
        } else if (presenter.configuration.fadeTransitions) {
            presenter.feedbackContainer.find('.response').animate({opacity: 0.0}, {queue: false});
            presenter.feedbackContainer.find('.response_' + id).appendTo(presenter.feedbackContainer).animate({opacity: 1.0}, {queue: false});
        }

        presenter.currentStateDefault = false;
        presenter.currentStateId = id;

        if (!presenter.configuration.isMute) {
            presenter.readCurrentMessage(false);
        }
    };


    function createResponseTable(content) {
        var $feedbackTable = $(document.createElement('table'));
        var $feedbackTableRow = $(document.createElement('tr'));
        var $feedbackTableCell = $(document.createElement('td'));

        $feedbackTableRow.append($feedbackTableCell);
        $feedbackTable.append($feedbackTableRow);
        $feedbackTableCell.html(content);

        return $feedbackTable;
    }

    presenter.upgradeModel = function (model) {
        var upgradedModel = presenter.upgradeFrom_01(model);
        return presenter.upgradeAddMute(upgradedModel);
    };

    presenter.upgradeFrom_01 = function(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!upgradedModel["langAttribute"]) {
            upgradedModel["langAttribute"] = "";
        }
        if (!upgradedModel["speechTexts"]) {
            upgradedModel["speechTexts"] = {};
        }
        if (!upgradedModel["speechTexts"]["Positive"]) {
            upgradedModel["speechTexts"]["Positive"] = {Positive: ""};
        }
        if (!upgradedModel["speechTexts"]["Negative"]) {
            upgradedModel["speechTexts"]["Negative"] = {Negative: ""};
        }
        if (!upgradedModel["speechTexts"]["Empty"]) {
            upgradedModel["speechTexts"]["Empty"] = {Empty: ""};
        }
        return upgradedModel;
    };

    presenter.upgradeAddMute = function(model) {
            var upgradedModel = {};
            $.extend(true, upgradedModel, model);

            if (!upgradedModel["Mute"]) {
                upgradedModel["Mute"] = "False";
            }
            return upgradedModel;
        };

    presenter.initialize = function (view, model, preview) {
        var text;
        var text_inner;

        model = presenter.upgradeModel(model);

        presenter.$view = $(view);
        presenter.preview = preview;
        presenter.model = model;

        presenter.feedbackContainer = $('<div class="feedback_container"></div>');
        presenter.$view.append(presenter.feedbackContainer);

        presenter.configuration = presenter.validateModel(model);

        for (var i = 0; i < model['Responses'].length; i++) {
            if (typeof(presenter.responses[model['Responses'][i]['Unique response ID']]) != "undefined") {
                presenter.showErrorMessage(presenter.ERROR_MESSAGES.RESPONSE_ID_NOT_UNIQUE, { id: model['Responses'][i]['Unique response ID']});
                return;
            }

            if (model['Responses'][i]['Status'] != presenter.STATUSES.TRUE &&
                model['Responses'][i]['Status'] != presenter.STATUSES.NEUTRAL &&
                model['Responses'][i]['Status'] != presenter.STATUSES.FALSE &&
                model['Responses'][i]['Status'] != presenter.STATUSES.CUSTOM) {
                presenter.showErrorMessage(presenter.ERROR_MESSAGES.RESPONSE_STATUS_INVALID, { n: i + 1, id: model['Responses'][i]['Unique response ID'], status: model['Responses'][i]['Status']});
                return;
            }

            var responseText = model['Responses'][i]['Text'];
            if (textParser !== null && !preview) {
                responseText = textParser.parse(responseText);
            }
            presenter.responses[model['Responses'][i]['Unique response ID']] = { status: model['Responses'][i]['Status'].toUpperCase(), text: responseText };

            text = $('<div class="response"></div>');
            text_inner = $('<div class="response_inner"></div>');
            text.append(text_inner);
            text.addClass('response_' + model['Responses'][i]['Unique response ID']);

            var $responseTable = createResponseTable(responseText);
            text_inner.html($responseTable);

            switch (model['Responses'][i]['Status']) {
                case presenter.STATUSES.TRUE:
                    text.addClass("true_response");
                    break;

                case presenter.STATUSES.NEUTRAL:
                    text.addClass("neutral_response");
                    break;

                case presenter.STATUSES.FALSE:
                    text.addClass("false_response");
                    break;

                case presenter.STATUSES.CUSTOM:
                    text.addClass("custom_response");
                    break;
            }

            presenter.feedbackContainer.append(text);
            presenter.centerInner(text_inner);
        }

        presenter.$view.find('.response').css('opacity', 0.0);

        presenter.defaultResponse = model['Default response'];
        if (textParser !== null && !preview) {
            presenter.defaultResponse = textParser.parse(presenter.defaultResponse);
        }

        text = $('<div class="response default_response neutral_response"></div>');
        text_inner = $('<div class="response_inner"></div>');
        text.append(text_inner);

        var defaultResponseTable = createResponseTable(presenter.defaultResponse);
        text_inner.html(defaultResponseTable);
        presenter.feedbackContainer.append(text);
        presenter.centerInner(text_inner);
        if (textParser !== null && !preview) {
            textParser.connectLinks(presenter.feedbackContainer);
            presenter.connectHTMLLinks(presenter.feedbackContainer);
        }

        if (!preview) {
            presenter.setDefaultResponse();
            return;
        }

        if (typeof(model['Preview response ID']) == "undefined" ||
            (typeof(model['Preview response ID']) == "string" && model['Preview response ID'] == "")) {
            presenter.setDefaultResponse();
        } else {
            if (typeof(presenter.responses[model['Preview response ID']]) == "undefined") {
                presenter.showErrorMessage(presenter.ERROR_MESSAGES.PREVIEW_RESPONSE_ID_INVALID, { id: model['Preview response ID'] });
            } else {
                presenter.setResponse(model['Preview response ID']);
            }
        }
    };

    function getSpeechTextProperty (rawValue, defaultValue) {
        var value = rawValue.trim();

        if (value === undefined || value === null || value === '') {
            return defaultValue;
        }

        return value;
    }

    function setSpeechTexts (speechTexts) {
        presenter.speechTexts = {
            positive:  'Correct answer',
            negative: 'Incorrect answer',
            empty: 'No feedback message'
        };

        if (!speechTexts) {
            return;
        }

        presenter.speechTexts = {
            positive:    getSpeechTextProperty(speechTexts['Positive']['Positive'], presenter.speechTexts.positive),
            negative: getSpeechTextProperty(speechTexts['Negative']['Negative'], presenter.speechTexts.negative),
            empty: getSpeechTextProperty(speechTexts['Empty']['Empty'], presenter.speechTexts.empty)
        };
    }

    presenter.validateModel = function (model) {
        var validatedIsVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);
        setSpeechTexts(model["speechTexts"]);

        return {
            resetResponse: ModelValidationUtils.validateBoolean(model['Reset response on page change']),
            fadeTransitions: ModelValidationUtils.validateBoolean(model['Fade transitions']),
            centerHorizontally: ModelValidationUtils.validateBoolean(model['Center horizontally']),
            centerVertically: ModelValidationUtils.validateBoolean(model['Center vertically']),
            isActivity: !ModelValidationUtils.validateBoolean(model['Is not an activity']),
            isVisible: validatedIsVisible,
            isVisibleByDefault: validatedIsVisible,
            isTabindexEnabled: ModelValidationUtils.validateBoolean(model['Is Tabindex Enabled']),
            isMute: ModelValidationUtils.validateBoolean(model['Mute']),
            langTag: model['langAttribute']
        };
    };

    presenter.centerInner = function (text_inner) {
        if (presenter.configuration.centerVertically) {
            var parentHeight = $(text_inner).parent().height();
            var parentHWidth = $(text_inner).parent().width();
            $(text_inner).css({
                height: parentHeight + 'px',
                width: parentHWidth + 'px',
                display: 'table-cell',
                'verticalAlign': 'middle'
            });
        }

        if (presenter.configuration.centerHorizontally) {
            $(text_inner).find('table').css({
                marginLeft: 'auto',
                marginRight: 'auto'
            });
        }
    };

    presenter.run = function (view, model) {
        presenter.initialize(view, model, false);
    };

    presenter.createPreview = function (view, model) {
        presenter.initialize(view, model, true);
    };

    presenter.reset = function () {
        presenter.setDefaultResponse();
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);
    };

    presenter.setShowErrorsMode = function () {
        if (presenter.configuration.isActivity) {
            presenter.setDefaultResponse();
        }
    };

    presenter.change = function (responseID) {
        if (presenter.responses[responseID] !== undefined) {
            presenter.setResponse(responseID);
        }
    };

    presenter.changeCommand = function (params) {
        if (params.length >= 1) {
            presenter.change(params[0])
        }
    };

    presenter.executeCommand = function (name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'change': presenter.changeCommand,
            'setDefaultResponse': presenter.setDefaultResponse,
            'next': presenter.next,
            'previous': presenter.previous,
            'getResponseIndex': presenter.getResponseIndex
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.show = function () {
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
    };

    presenter.next = function () {
        var currentID = presenter.currentStateId, index, newID;
        if (presenter.currentStateDefault) {
            newID = presenter.getResponseID(0);
        } else {
            index = presenter.getResponseIndex(currentID);
            newID = presenter.getResponseID(index + 1);
        }

        if (newID == undefined) return;

        presenter.setResponse(newID);
    };

    presenter.previous = function () {
        var currentID = presenter.currentStateId, index, newID;

        if (presenter.currentStateDefault) return;

        index = presenter.getResponseIndex(currentID);
        newID = presenter.getResponseID(index - 1);

        if (newID == undefined) return;

        presenter.setResponse(newID);
    };

    presenter.connectHTMLLinks = function ($element) {
        $element.find('a').each(function(){
            $(this).click(function(){
                var url = $(this).attr('href');
                var target = $(this).attr('target');
                if (target != null && target.length > 0) {
                    window.open(url, target);
                } else {
                    window.open(url);
                }
            });
        });
    };


    presenter.getState = function () {
        return JSON.stringify({
            'currentStateDefault': presenter.currentStateDefault,
            'currentStateId': presenter.currentStateId,
            'isVisible': presenter.configuration.isVisible
        });
    };

    presenter.setState = function (stateString) {
        if (presenter.configuration.resetResponse) {
            presenter.setDefaultResponse();
            return;
        }
        var state = JSON.parse(stateString);

        if (state['currentStateDefault']) {
            presenter.setDefaultResponse();
        } else {
            presenter.setResponse(state['currentStateId']);
        }

        presenter.configuration.isVisible = state['isVisible'];
        presenter.setVisibility(state['isVisible']);
    };

    presenter.getResponseIndex = function (responseID) {
        var responses = presenter.model.Responses, i;

        for (i = 0; i < responses.length; i++) {
            if (responses[i]['Unique response ID'] === responseID) return i;
        }

        return -1;
    };

    presenter.getResponseID = function (index) {
        var response = presenter.model.Responses[index];

        return response !== undefined ? response['Unique response ID'] : undefined;
    };

    presenter.setTabindex = function ($element, isTabindexEnabled){
        var value = isTabindexEnabled ? '0' : '-1';
        $element.attr('tabindex', value);
    };

    presenter.keyboardController = function(keyCode, isShift, event) { //every time keyboard is pressed
        if (keyCode == window.KeyboardControllerKeys.SPACE ||
            keyCode == window.KeyboardControllerKeys.ARROW_UP ||
            keyCode == window.KeyboardControllerKeys.ARROW_DOWN ||
            keyCode == window.KeyboardControllerKeys.ESC)
        {
            event.preventDefault();
        }

        if (keyCode == window.KeyboardControllerKeys.ENTER) {
            presenter.readCurrentMessage(true);
        }
    };

    presenter.isEnterable = function() {
        return false;
    };

    return presenter;
}