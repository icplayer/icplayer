function AddonText_To_Speech_create() {

    function getErrorObject (ec) { return {isValid: false, errorCode: ec}; }

    function getCorrectObject (v) { return {isValid: true, value: v}; }

    function getTextVoiceObject (text, lang) { return {text: text, lang: lang}; }

    function getConfObject (id, area, title, description) {
        return {
            id: id,
            area: area,
            title: title,
            description: description
        };
    }

    var presenter = function () {};

    presenter.messagesQueue = [];

    presenter.ERROR_CODES = {
        C01: 'Configuration cannot be empty',

        S01: 'Sorry, your browser does not support speech synthesis.'
    };

    presenter.LANGUAGES_CODES = {
        English: 'en-US',
        Polski: 'pl-PL',
        Deutsch: 'de-DE',
        DEFAULT: 'English'
    };

    presenter.AREAS = {
        Main: 'main',
        Header: 'header',
        Footer: 'footer',
        DEFAULT: 'Main'
    };

    function parseConfiguration(configuration) {
        if (!configuration) {
            return getErrorObject('C01');
        }

        var addOnsTextToSpeechData = [];
        for (var i = 0; i < configuration.length; i++) {
            var conf = configuration[i];
            addOnsTextToSpeechData.push(getConfObject(
                conf.ID,
                ModelValidationUtils.validateOption(presenter.AREAS, conf.Area),
                conf.Title
            ));
        }

        return getCorrectObject(addOnsTextToSpeechData);
    }

    function parseLanguage(language) {
        return getCorrectObject(presenter.LANGUAGES_CODES[language || 'English']);
    }

    presenter.validateModel = function (model) {
        var validatedConfiguration = parseConfiguration(model['configuration']);
        if (!validatedConfiguration.isValid) {
            return getErrorObject(validatedConfiguration.errorCode);
        }

        return {
            ID: model.ID,
            isVisible: ModelValidationUtils.validateBoolean(model['Is Visible']),
            isValid: true,

            addOnsConfiguration: validatedConfiguration.value,
            enterText: model['EnterText'],
            exitText: model['ExitText']
        }
    };

    function loadVoices () {
        presenter.configuration.voices = window.speechSynthesis.getVoices();
    }

    presenter.presenterLogic = function (view, model, isPreview) {
        presenter.$view = $(view);
        view.addEventListener('DOMNodeRemoved', presenter.destroy);
        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return false;
        }

        loadVoices();
        window.speechSynthesis.onvoiceschanged = function (e) {
            loadVoices();
        };

        if ('speechSynthesis' in window) {

        } else {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, 'S01');
            return false;
        }

        presenter.setVisibility(presenter.configuration.isVisible);

        return false;
    };

    presenter.run = function (view, model) {
        presenter.presenterLogic(view, model, false);
    };

    presenter.createPreview = function (view, model) {
        presenter.presenterLogic(view, model, true);
    };

    function getAddOnConfiguration (area, id) {
        id = Array.isArray(id) ? id[0] : id;
        area = Array.isArray(area) ? area[0] : area;

        for (var i = 0; i < presenter.configuration.addOnsConfiguration.length; i++) {
            var conf = presenter.configuration.addOnsConfiguration[i];

            if (conf.id === id && conf.area.toLowerCase() === area.toLowerCase()) {
                return conf;
            }
        }

        return {title: '', description: ''};
    }

    function getResponsiveVoiceLanguage (langTag) {
        if (!langTag) {
            // get lang from document <html lang="">
            langTag = document.documentElement.lang;
        }

        // Tags for Identifying Languages: https://www.ietf.org/rfc/bcp/bcp47.txt
        var languages = {
            'en': 'UK English Male',
            'pl': 'Polish Female',
            'de': 'Deutsch Female'
        };

        return languages[langTag] || 'UK English Male';
    }

    function getSpeechSynthesisLanguage (langTag) {
        if (!langTag) {
            // get lang from document <html lang="">
            langTag = document.documentElement.lang;
        }

        loadVoices();

        var languages = {
            'en': "en-GB",
            'pl': 'pl-PL',
            'de': 'de-DE'
        };
        langTag = languages[langTag] || langTag;

        for (var i=0; i<presenter.configuration.voices.length; i++) {
            if (presenter.configuration.voices[i].lang === langTag) {
                return presenter.configuration.voices[i];
            }
        }

        return presenter.configuration.voices[0];
    }

    function filterTexts (texts, languageGetter) {
        return texts.map(function (t) {
            return {
                lang: languageGetter(t.lang),
                text: t.text ? t.text : ''
            };
        }).filter(function (t) { return t.text !== '' });
    }

    // https://responsivevoice.org/
    function responsiveVoiceSpeak (texts) {
        var textsObjects = filterTexts(texts, getResponsiveVoiceLanguage);

        var onEndStack = { onend: null };
        for (var i=textsObjects.length-1; i>=0; i--) {
            var textObject = textsObjects[i];

            if (i === 0) {
                window.responsiveVoice.speak(textObject.text, textObject.lang, onEndStack);
            } else {
                onEndStack.onend = (function (textObject, onEndStack) {
                    return function () {
                        window.responsiveVoice.speak(textObject.text, textObject.lang, onEndStack);
                    }
                })($.extend({}, textObject), $.extend({}, onEndStack));
            }
        }
    }

    presenter.intervalId = null;

    // https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
    function speechSynthesisSpeak (texts) {
        window.speechSynthesis.cancel();

        if (presenter.intervalId!==null) {
            clearInterval(presenter.intervalId);
            presenter.intervalId = undefined;
        }
        // Fix for running speak method after cancelling SpeechSynthesis queue
        presenter.intervalId = setInterval(function() {
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
            var textsObjects = filterTexts(texts, getSpeechSynthesisLanguage);
            if (textsObjects.length === 0) {
                clearInterval(presenter.intervalId);
                return;
            }
            for (var i=0; i<textsObjects.length; i++) {
                var textObject = textsObjects[i];
                var msg = new SpeechSynthesisUtterance(textObject.text);
                msg.volume = parseFloat(1); // 0 - 1
                msg.rate = parseFloat(1); // 0 - 10
                msg.pitch = parseFloat(1); // 0 - 2
                msg.voice = textObject.lang;
                msg.onstart = function (event) {
                    clearInterval(presenter.intervalId);
                    presenter.intervalId = undefined;
                };
                window.speechSynthesis.speak(msg);
            }
        }, 200);

    }

    // The speak method is overloaded:
    // texts argument can be either an array of TextVoiceObjects, or a String
    // langTag argument is optional and only used when texts is a String
    presenter.speak = function (texts, langTag) {
        var class_ = Object.prototype.toString.call(texts);
        if (class_.indexOf('String') !== -1) {
            texts = [getTextVoiceObject(texts, langTag)];
        }

        if (window.responsiveVoice) {
            responsiveVoiceSpeak(texts);
            return;
        }

        if ('speechSynthesis' in window) {
            speechSynthesisSpeak(texts);
            return;
        }

        console.log(texts);
    };

    presenter.playTitle = function (area, id, langTag) {
        if (area && id) {
            presenter.speak([getTextVoiceObject(getAddOnConfiguration(area, id).title, langTag)]);
        }
    };

    presenter.playEnterText = function () {
        presenter.speak([getTextVoiceObject(presenter.configuration.enterText)]);
    };

    presenter.playExitText = function () {
        presenter.speak([getTextVoiceObject(presenter.configuration.exitText)]);
    };

    presenter.getModulesOrder = function () {
        return presenter.configuration.addOnsConfiguration.map(function (c) {
            return {
                id: c.id,
                area: c.area
            };
        });
    };

    presenter.setVisibility = function (isVisible) {
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

    presenter.executeCommand = function (name, params) {
        if (!presenter.configuration.isValid) {
            return;
        }

        var commands = {
            "show": presenter.show,
            "hide": presenter.hide,
            "speak": function(params) {
                    if (params.length === 2) {
                        presenter.speak(params[0], params[1]);
                    } else if (params.length === 1) {
                        presenter.speak(params[0]);
                    }
                },
            "playTitle": function(params) {
                    if (params.length === 3) {
                        presenter.playTitle(params[0],params[1],params[2]);
                    } else if (params.length === 2) {
                        presenter.playTitle(params[0],params[1]);
                    }
                },
            "playEnterText": presenter.playEnterText,
            "playExitText": presenter.playExitText,
            "getModulesOrder": presenter.getModulesOrder
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.getState = function () {
        return JSON.stringify({
            addOnsConfiguration: presenter.configuration.addOnsConfiguration,
            enterText: presenter.configuration.enterText,
            exitText: presenter.configuration.exitText,

            isVisible: presenter.configuration.isVisible
        });
    };

    presenter.setState = function (state) {
        if (ModelValidationUtils.isStringEmpty(state)) {
            return;
        }

        var parsedState = JSON.parse(state);

        presenter.configuration.addOnsConfiguration = parsedState.addOnsConfiguration;
        presenter.configuration.enterText = parsedState.enterText;
        presenter.configuration.exitText = parsedState.exitText;

        presenter.configuration.isVisible = parsedState.isVisible;
        presenter.setVisibility(presenter.configuration.isVisible);
    };

    presenter.cancelSpeechSynthesis = function(){
        if (window.responsiveVoice) {
            window.responsiveVoice.cancel();
        }
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        if(presenter.speechSynthInterval!==null){
            clearInterval(presenter.intervalId);
            presenter.intervalId = undefined;
        }
    };

    presenter.destroy = function () {
        presenter.$view[0].removeEventListener('DOMNodeRemoved', presenter.destroy);
        presenter.cancelSpeechSynthesis();
        presenter.configuration = null;
        presenter.$view = null;
    };

    return presenter;
}
