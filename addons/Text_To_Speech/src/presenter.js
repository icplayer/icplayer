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

        var validatedLanguage = parseLanguage(model['language']);
        if (!validatedLanguage.isValid) {
            return getErrorObject(validatedLanguage.errorCode);
        }

        return {
            ID: model.ID,
            isVisible: ModelValidationUtils.validateBoolean(model['Is Visible']),
            isValid: true,

            addOnsConfiguration: validatedConfiguration.value,
            enterText: model['EnterText'],
            exitText: model['ExitText'],
            language: validatedLanguage.value
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

            if (conf.id === id && conf.area === area) {
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

    // For SynthesisAPI
    function getLanguageObject (lang) {
        loadVoices();
        for (var i = 0; i < presenter.configuration.voices.length; i++) {
            if (presenter.configuration.voices[i].lang === lang) {
                return presenter.configuration.voices[i];
            }
        }

        return presenter.configuration.voices[0];
    }

    // presenter.speak = function (text, langTag, callback) {
    //     if (text) {
    //         if (callback && callback.text) {
    //             window.responsiveVoice.speak(text, getResponsiveVoiceLanguage(langTag), {
    //                 onend: function () {
    //                     window.responsiveVoice.speak(callback.text, getResponsiveVoiceLanguage(callback.lang))
    //                 }
    //             });
    //         } else {
    //             window.responsiveVoice.speak(text, getResponsiveVoiceLanguage(langTag));
    //         }
    //     }
    // };

    function filterTexts (texts, languageGetter) {
        return texts.map(function (t) {
            return {
                lang: t.lang ? languageGetter(t.lang) : '',
                text: t.text ? t.text : ''
            };
        }).filter(function (t) { return t.text !== '' });
    }

    // https://responsivevoice.org/
    function responsiveVoiceSpeak (texts) {
        var textsObjects = texts.map(function (t) {
            return {
                lang: getResponsiveVoiceLanguage(t.lang ? t.lang : ''),
                text: t.text ? t.text: ''
            };
        }).filter(function (t) { return t.text !== '' });

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

    function speechSynthesisSpeak (texts) {
        // TODO
    }

    presenter.speak = function (texts) {
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

    // responsiveVoice with language from property
    // presenter.speak = function (text) {
    //     text = parseGaps(text);
    //
    //     var languageCode = 'UK English Male';
    //
    //     switch (presenter.configuration.language) {
    //         case 'en-US': languageCode = 'UK English Male'; break;
    //         case 'pl-PL': languageCode = 'Polish Female'; break;
    //         case 'de-DE': languageCode = 'Deutsch Female'; break;
    //     }
    //
    //     window.responsiveVoice.speak(text, languageCode);
    // };

    // synthesis API with language from property
    // presenter.speak = function (text) {
    //     text = parseGaps(text);
    //
    //     var msg = new SpeechSynthesisUtterance(text);
    //     msg.volume = parseFloat(1); // 0 - 1
    //     msg.rate = parseFloat(1); // 0 - 10
    //     msg.pitch = parseFloat(1); // 0 - 2
    //     msg.voice = getLanguageObject(presenter.configuration.language);
    //
    //     window.speechSynthesis.speak(msg);
    // };

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

            "speak": presenter.speak,
            "playTitle": presenter.playTitle,
            "playEnterText": presenter.playEnterText,
            "playExitText": presenter.playExitText,
            "getModulesOrder": presenter.getModulesOrder
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.getState = function () {
        return JSON.stringify({
            addOnsConfiguration: presenter.configuration.addOnsConfiguration,
            language: presenter.configuration.language,
            isVisible: presenter.configuration.isVisible
        });
    };

    presenter.setState = function (state) {
        if (ModelValidationUtils.isStringEmpty(state)) {
            return;
        }

        var parsedState = JSON.parse(state);

        presenter.configuration.addOnsConfiguration = parsedState.addOnsConfiguration;
        presenter.configuration.language = parsedState.language;
        presenter.configuration.isVisible = parsedState.isVisible;

        presenter.setVisibility(presenter.configuration.isVisible);
    };

    presenter.destroy = function () {
        presenter.$view[0].removeEventListener('DOMNodeRemoved', presenter.destroy);

        // window.speechSynthesis.cancel();
    };

    return presenter;
}
