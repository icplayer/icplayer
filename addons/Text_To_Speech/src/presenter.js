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
            exitText: model['ExitText'],
            newPage: model['NewPage'] ? model['NewPage'] : "New page",
            pageLangTag: model['PageLangTag']
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
            'en': "en-US",
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

     presenter.parseAltTexts = function(texts){
        for(var i=0; i<texts.length;i++){
            if(texts[i].text!==null && texts[i].text!==undefined && texts[i].text.trim().length>0)
            {
                // altText elements with a langTag need to be isolated into seperate items
                // in the texts array, so that they can use a different language tag.
                var match = texts[i].text.match(/\\alt{[^\|{}]*?\|([^\|{}]*?)\|([^\|{}]*?)}/g);
                if(match && match.length>0) {
                    // get the first altText element with a lang tag.
                    // if there are more, they will not be parsed in this iteration
                    // instead, they will become a part of the tail and will be parsed in future iterations
                    var matchText = match[0].trim();
                    var originalMatchText = matchText;
                    var splitTexts = texts[i].text.split(matchText);
                    var startIndex = texts[i].text.indexOf(matchText);
                    
                    matchText = matchText.replace('\\alt{', '');
                    matchText = matchText.replace('}', '');
                    var altTextParts = matchText.split('\|');

                    if (altTextParts && altTextParts.length === 3) {
                        var altTextVoice = getTextVoiceObject(altTextParts[1], altTextParts[2]);

                        if (splitTexts) {
                            if (splitTexts.length > 2) {
                                // It is possible that there will be multiple identical atlText elements
                                // if that is the case, all elements of the splitTexts array should be merged
                                // with the exception of the head
                                var newSplitTexts = splitTexts.splice(0, 1);
                                newSplitTexts.push(splitTexts.join(originalMatchText));
                                splitTexts = newSplitTexts;
                            }
                            if (splitTexts.length === 1) {
                                texts[i].text = splitTexts[0];
                                if (startIndex === 0) {
                                    texts.splice(i, 0, altTextVoice);
                                } else {
                                    texts.splice(i + 1, 0, altTextVoice);
                                }
                            }
                            if (splitTexts.length === 2) {
                                texts[i].text = splitTexts[0];
                                texts.splice(i + 1, 0, getTextVoiceObject(splitTexts[1], texts[i].lang));
                                texts.splice(i + 1, 0, altTextVoice);
                            }
                            if(splitTexts.length === 0) {
                                texts[i] = altTextVoice;
                            }
                        }
                    }
                }

                // handle altText elements without a langTag
                texts[i].text = texts[i].text.replace(/\\alt{[^\|{}]*?\|([^\|{}]*?)}/g, '$1');
            }
        }

        // splitting matched texts might create elements with an empty text field. This removes them
        texts = texts.filter(function(el){return el && el.text && el.text.trim().length>0});
        return texts;
    }
    // The speak method is overloaded:
    // texts argument can be either an array of TextVoiceObjects, or a String
    // langTag argument is optional and only used when texts is a String
    presenter.speak = function (texts, langTag) {
        var class_ = Object.prototype.toString.call(texts);
        if (class_.indexOf('String') !== -1) {
            texts = [getTextVoiceObject(texts, langTag)];
        }

        texts = presenter.parseAltTexts(texts);

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
            var textVoices = [getTextVoiceObject(getAddOnConfiguration(area, id).title, langTag)];
            var module = null;
            if(0 === area.toLowerCase().localeCompare("main")){
                module = presenter.playerController.getModule(id);
            } else if (0 === area.toLowerCase().localeCompare("footer")) {
                module = presenter.playerController.getFooterModule(id);
            } else if (0 === area.toLowerCase().localeCompare("header")) {
                module = presenter.playerController.getHeaderModule(id);
            }
            if (module !== undefined && module !== null && module.hasOwnProperty('getTitlePostfix')) {
                textVoices.push(getTextVoiceObject(module.getTitlePostfix(), langTag));
            }
            presenter.speak(textVoices);
        }
    };

    presenter.playPageTitle = function () {
        var textVoices = [];
        textVoices.push(getTextVoiceObject(presenter.configuration.newPage,''));
        textVoices.push(getTextVoiceObject(presenter.playerController.getPageTitle(),presenter.configuration.pageLangTag));
        presenter.speak(textVoices);
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

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
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
