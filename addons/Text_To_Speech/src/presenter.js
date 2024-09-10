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

    presenter.savedSentences = [];
    presenter.savedSentencesIndex = -1;
    presenter.saveNextSentences = false;

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

    // Maximum length of a single utterance. If exceeded, the utterence will be split into multiple shorter ones
    presenter.maxUtteranceLength = 200;

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
            pageLangTag: model['PageLangTag'],
            disableNewPageMessage: ModelValidationUtils.validateBoolean(model['disableNewPageMessage'])
        }
    };

    function loadVoices () {
        presenter.configuration.voices = window.speechSynthesis.getVoices();
    }

    presenter.upgradeModel = function(model) {
        var upgradedModel = presenter.upgradeDisableNewPageMessage(model);
        return upgradedModel;
    }

    presenter.upgradeDisableNewPageMessage = function(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (upgradedModel['disableNewPageMessage'] === undefined) {
            upgradedModel['disableNewPageMessage'] = "";
        }

        return upgradedModel;
    }

    presenter.presenterLogic = function (view, model, isPreview) {
        presenter.$view = $(view);
        var upgradedModel = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(upgradedModel);

        if (!isPreview) {
            MutationObserverService.createDestroyObserver(presenter.configuration.ID, presenter.destroy, presenter.$view.get(0));
            MutationObserverService.setObserver();
        }

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

    presenter.getAddOnConfiguration = function (area, id) {
        id = Array.isArray(id) ? id[0] : id;
        area = Array.isArray(area) ? area[0] : area;

        for (var i = 0; i < presenter.configuration.addOnsConfiguration.length; i++) {
            var conf = presenter.configuration.addOnsConfiguration[i];

            if (conf.id === id && conf.area.toLowerCase() === area.toLowerCase()) {
                return conf;
            }
        }

        return {title: '', description: ''};
    };

    function getResponsiveVoiceLanguage (langTag) {
        /* Function at first take language from Responsive Voice text area, next is seeking in Responsive Voice
        * library script and finally return default language */
        const languages = presenter.playerController.getResponsiveVoiceLang();
        const langDict = JSON.parse(languages ? languages : "{}");

        if (!langTag) {
            langTag = document.documentElement.lang;
        }

        if (langDict && langDict[langTag]) {
            return langDict[langTag];
        } else if (isLanguageInLibrary(langTag)) {
            return getLanguageFromLibrary(langTag);
        }
        return 'UK English Male';
    }

    function getLanguageFromLibrary (langTag) {
        return window.responsiveVoice.responsivevoices.find(responsiveVoice => responsiveVoice.lang.includes(langTag)).name;
    }

    function isLanguageInLibrary (langTag) {
        return window.responsiveVoice.responsivevoices.some(responsiveVoice => responsiveVoice.lang.includes(langTag));
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
    function responsiveVoiceSpeak (texts, finalCallback) {
        var textsObjects = filterTexts(texts, getResponsiveVoiceLanguage);
        if (finalCallback === undefined) finalCallback = null;

        var onEndStack = { onend: finalCallback };
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
    presenter.intervalResume = null;

    // https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
    function speechSynthesisSpeak (texts, finalCallback) {
        window.speechSynthesis.cancel();

        if (presenter.intervalId != null) {
        clearInterval(presenter.intervalId);
            presenter.intervalId = undefined;
        }
        var onStartExecuted = false;
        // Fix for running speak method after cancelling SpeechSynthesis queue
        if(presenter.intervalResume != null) {
            clearInterval(presenter.intervalResume);
            presenter.intervalResume = undefined;
        }

        // Necessary for Chrome browser because instead stop reading
        if (isChrome()) {
                presenter.intervalResume = setInterval(function () {
                window.speechSynthesis.pause();
                window.speechSynthesis.resume();
            }, 3000);
        }

        presenter.intervalId = setInterval(function() {

            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
                return;
            }
            var textsObjects = filterTexts(texts, getSpeechSynthesisLanguage);
            if (textsObjects.length === 0) {
                clearInterval(presenter.intervalId);
                presenter.intervalId = undefined;

                clearInterval(presenter.intervalResume);
                presenter.intervalResume = undefined;
                return;
            }
            if (presenter.intervalId == null) return;
            var utterances = [];
            for (var i=0; i<textsObjects.length; i++) {
                var textObject = textsObjects[i];
                var msg = new SpeechSynthesisUtterance(textObject.text);
                msg.volume = parseFloat(1); // 0 - 1
                msg.rate = parseFloat(1); // 0 - 10
                msg.pitch = parseFloat(1); // 0 - 2
                msg.voice = textObject.lang;
                var currentIntervalId = presenter.intervalId;
                if (i === 0) {
                    msg.onstart = function (event) {
                        onStartExecuted = true;
                        clearInterval(currentIntervalId);
                        if (currentIntervalId !== presenter.intervalId) {
                            window.speechSynthesis.cancel();
                        }
                    };
                }
                if (i === textsObjects.length - 1) {
                    msg.onend = function (event) {
                        if(currentIntervalId === presenter.intervalId){
                            window.speechSynthesis.cancel();
                        }
                        if (finalCallback && onStartExecuted){
                            onStartExecuted = false;
                            finalCallback();
                            utterances = [];
                        };
                    };
                }

                //this list and "push" is solving the problem on
                //'end' event of SpeechSynthesisUtterance object is not dispatched sometimes
                //https://www.e-learn.cn/content/wangluowenzhang/603510
                utterances.push(msg);
                window.speechSynthesis.speak(msg);
            }
        }, 250);
    }

    function getAltTextOptions(expression) {
        var options = {};
        expression = expression.replace(/.*}\[/g, '');
        expression = expression.replace('\]\[', '|');
        expression = expression.replace('\]', '');
        var optionExp = expression.split('\|');
        for(var i=0;i<optionExp.length;i++) {
            var optionValues = optionExp[i].split(' ');
            if(optionValues.length===2){
                options[optionValues[0]]=optionValues[1];
            }
        }
        return options;
    }

     presenter.parseAltTexts = function(texts){
        for (var i=0; i < texts.length; i++) {
            if (texts[i].text !== null && texts[i].text !== undefined && texts[i].text.trim().length > 0)
            {
                // altText elements with a langTag need to be isolated into seperate items
                // in the texts array, so that they can use a different language tag.
                var match = texts[i].text.match(/\\alt{([^{}|]*?)\|([^{}|]*?)}(\[([a-zA-Z0-9_\- ]*?)\])+/g);
                if (match && match.length>0) {
                    // get the first altText element with a lang tag.
                    // if there are more, they will not be parsed in this iteration
                    // instead, they will become a part of the tail and will be parsed in future iterations
                    var matchText = match[0].trim();
                    var originalMatchText = matchText;
                    var splitTexts = texts[i].text.split(matchText);
                    var startIndex = texts[i].text.indexOf(matchText);
                    var readableText = matchText.replace(/.*\\alt{[^{}|]*?\|([^{}|]*?)}.*/g,"$1");
                    var options = getAltTextOptions(originalMatchText);
                    var langTag = "";
                    if(options.hasOwnProperty('lang')){
                        langTag = options.lang;
                    }

                    if (langTag.length!==0) {
                        var altTextVoice = getTextVoiceObject(readableText, langTag);

                        if (splitTexts) {
                            if (splitTexts.length > 2) {
                                // It is possible that there will be multiple identical altText elements
                                // if that is the case, all elements of the splitTexts array should be merged
                                // with the exception of the head
                                var newSplitTexts = splitTexts.splice(0, 1);
                                newSplitTexts.push(splitTexts.join(originalMatchText));
                                splitTexts = newSplitTexts;
                            }
                            if (splitTexts.length === 2) {
                                texts[i].text = splitTexts[0];
                                texts.splice(i + 1, 0, getTextVoiceObject(splitTexts[1], texts[i].lang));
                                texts.splice(i + 1, 0, altTextVoice);
                            } else if (splitTexts.length === 1) {
                                texts[i].text = splitTexts[0];
                                if (startIndex === 0) {
                                    texts.splice(i, 0, altTextVoice);
                                } else {
                                    texts.splice(i + 1, 0, altTextVoice);
                                }
                            } else if(splitTexts.length === 0) {
                                texts[i] = altTextVoice;
                            }
                        }
                    } else {
                        //if there is no lang option, there is not reason to create a new element in texts array
                        texts[i].text = texts[i].text.replace(originalMatchText, readableText);
                    }
                }

                // handle altText elements without a langTag
                texts[i].text = texts[i].text.replace(/\\alt{.*?\|(.*?)}/g, '$1');
            }
        }

        // splitting matched texts might create elements with an empty text field. This removes them
        texts = texts.filter(function(element){return element && element.text && element.text.trim().length>0});
        return texts;
    };

    // The speak method is overloaded:
    // texts argument can be either an array of TextVoiceObjects, or a String
    // langTag argument is optional and only used when texts is a String
    presenter.speak = function (texts, langTag) {
        var class_ = Object.prototype.toString.call(texts);
        if (class_.indexOf('String') !== -1) {
            texts = [getTextVoiceObject(texts, langTag)];
        }

        presenter.speakWithCallback(texts, null);
    };

    function splitByPunctuationSigns(text) {
        let splitIndexes = findPunctuationSignsIndexes(text);
        return splitByIndexesInConsiderationOfProtectedSyntax(text, splitIndexes);
    }

    function findPunctuationSignsIndexes(text) {
        const regexp = /[.,:;!?\/\\()]/g;
        return Array.from(text.matchAll(regexp)).map(x => x.index);
    }

    function splitByEndOfSentenceSigns(text) {
        let splitIndexes = findEndOfSentenceSignsIndexes(text);
        return splitByIndexesInConsiderationOfProtectedSyntax(text, splitIndexes);
    }

    function findEndOfSentenceSignsIndexes(text) {
        const regexp = /[.?!;]/g;
        return Array.from(text.matchAll(regexp)).map(x => x.index);
    }

    function protectTimeSyntaxInText(text, splitIndexes) {
        protectAMAndPMSyntaxInText(text, splitIndexes);
        protectDigitHourSyntaxInText(text, splitIndexes);
    }

    function protectAMAndPMSyntaxInText(text, splitIndexes) {
        const regexp = /(at[\s]+[\d]{1,2}[\s]+)([ap].[m].)/g;
        let matches = text.matchAll(regexp);
        filterSplittingIndexes(matches, splitIndexes);
    }

    function protectDigitHourSyntaxInText(text, splitIndexes) {
        const regexp = /([\s]+)([\d]{1,2}:[\d]{2})/g;
        let matches = text.matchAll(regexp);
        filterSplittingIndexes(matches, splitIndexes);
    }

    function protectNumberSyntaxInText(text, splitIndexes) {
        const regexp = /()([0-9]*[.!?;][0-9])/g;
        let matches = text.matchAll(regexp);
        filterSplittingIndexes(matches, splitIndexes);
    }

    /**
    * Leaves the indexes that are not between the range of the matches' second groups
    * @param matches - RegExp matches, where second groups are texts protected from splitting
    * @param splitIndexes - List of indexes (breaking points) to split text
    * @return undefined
    **/
    function filterSplittingIndexes(matches, splitIndexes) {
        for (const match of matches) {
            const startIndex = match.index + match[1].length;
            const endIndex = startIndex + match[2].length - 1;
            for (let i = 0; i < splitIndexes.length; i++) {
                if (startIndex <= splitIndexes[i] && splitIndexes[i] <= endIndex) {
                    splitIndexes.splice(i, 1);
                    i--;
                }
            }
        }
    }

    /**
    * Split text considering protected syntax using given indexes.
    * @param text - Text to split
    * @param splitIndexes - List of indexes (breaking points) to split text. A breakpoint will have no effect when referring to a protected syntax.
    * @return split text
    **/
    function splitByIndexesInConsiderationOfProtectedSyntax(text, splitIndexes) {
        protectTimeSyntaxInText(text, splitIndexes);
        protectNumberSyntaxInText(text, splitIndexes);
        return splitByIndexes(text, splitIndexes);
    }

    /**
    * Split text using given indexes.
    * @param text - Text to split
    * @param splitIndexes - List of indexes (breaking points) to split text
    * @return split text
    **/
    function splitByIndexes(text, splitIndexes) {
        splitIndexes.unshift(-1);
        splitIndexes.push(text.length);
        let splitText = [];
        for (let i = 1; i < splitIndexes.length; i++) {
            let textFragment = text.slice(splitIndexes[i-1] + 1, splitIndexes[i]);
            if (textFragment.trim().length > 0) {
                splitText.push(textFragment);
            }
        }
        return splitText;
    }

    presenter.removeUnnecessaryPunctuationMarks = function (texts) {
        texts.forEach(text => {
            const splittedWords = text.text
                .replaceAll(" \/", ",")
                .split(" ");

            const newSentence = [];
            splittedWords.forEach(word => {
                if (word.trim().length) {
                    const matchAfterLetter = word.match(/(\w\W)[.,?!]+/); // regex captures at least 2 special characters after word
                    const matchAloneOrSeparated = word.match(/(^|\s)[.,?!(){}\\\/\-\[\]]+/); // regex captures at least 1 special separated character or character at the beginning of sentence
                    if (matchAfterLetter) {
                        newSentence.push(word.replace(matchAfterLetter[0], matchAfterLetter[1]));
                    } else if (matchAloneOrSeparated && !presenter.isMatchContainSentence(matchAloneOrSeparated)) {
                        return;
                    } else {
                        newSentence.push(word);
                    }
                }
            });
            text.text = newSentence.join(" ");
        });

        return texts.filter(text => text.text.length);
    };

    presenter.isMatchContainSentence = function (word) {
        if (!word) {
            return;
        }

        return word['input'].match(/[a-zA-Z0-9]+/);
    }

    // Too long utterences may take much too long to load or exceed Speech Synthesis API character limit
    presenter.splitLongTexts = function (texts) {
        let finalSplitTexts = [];
        texts.forEach(text => {
            if (text === null || text === undefined) {
                return;
            }

            const textLen = text.text.trim().length;
            if (textLen === 0) {
                return;
            }

            if (textLen < presenter.maxUtteranceLength) {
                finalSplitTexts.push(text);
            } else {
                let textFragments = splitLongText(text.text, text.lang);
                finalSplitTexts = finalSplitTexts.concat(textFragments);
            }
        })
        return finalSplitTexts;
    }
    
    function splitLongText(text, lang) {
        return minSplitHandler(text, lang, splitByEndOfSentenceSigns, splitLongSentence);
    }

    function splitLongSentence (sentence, lang) {
        return minSplitHandler(sentence, lang, splitByPunctuationSigns, splitLongSentenceByMaxUtterances);
    }
    
    function minSplitHandler (text, lang, currentSplitFunc, nextSplitFunc) {
        let finalSplitTexts = [];
        let splitTexts = currentSplitFunc(text);
        splitTexts.forEach((splitText) => {
            const textLength = splitText.trim().length;
            if (textLength === 0) {
                return;
            }

            if (textLength < presenter.maxUtteranceLength) {
                finalSplitTexts.push({
                    text: splitText,
                    lang: lang
                });
            } else {
                let textFragments = nextSplitFunc(splitText, lang);
                finalSplitTexts = finalSplitTexts.concat(textFragments);
            }
        })
        return finalSplitTexts;
    }

    // creates an array of utterances from a single text that exceeds max utterance length and has no natural break points
    function splitLongSentenceByMaxUtterances (sentence, lang) {
        let finalSplitTexts = [];
        let sentenceLen = sentence.trim().length;
        let maxSplitLen = sentenceLen / (Math.floor(sentenceLen / presenter.maxUtteranceLength) + 1);
        let workString = '';
        let words = sentence.split(/\s/);
        for (let k = 0; k < words.length; k++) {
            workString += words[k] + ' ';
            if (workString.length > maxSplitLen) {
                finalSplitTexts.push({
                    text: workString,
                    lang: lang
                });
                workString = '';
            }
        }
        finalSplitTexts.push({
            text: workString,
            lang: lang
        });
        return finalSplitTexts;
    }

    presenter.speakWithCallback = function (texts, callback) {
        texts = presenter.parseAltTexts(texts);
        presenter.saveSentences(texts);
        if (isChrome()) {
            presenter.amplifyABeforeColon(texts);
        }
        presenter.readText(texts, callback);
    };

    /**
    * Amplify the letter 'A' or 'a' before colon
    * @param texts
    * @return
    **/
    presenter.amplifyABeforeColon = function (texts) {
        const regex = /([Aa][\s]*?):/;
        for (let i = 0; i < texts.length; i++) {
            texts[i].text = texts[i].text.replace(regex, "$1,");
        }
    }

    function isChrome () {
        const isEdge = navigator.userAgent.indexOf('Edge') !== -1 && (!!navigator.msSaveBlob || !!navigator.msSaveOrOpenBlob);
        const isOpera = !!window.opera || navigator.userAgent.indexOf('OPR/') !== -1;
        const isSafari = navigator.userAgent.toLowerCase().indexOf('safari/') > -1;
        return (!isOpera && !isEdge && !!navigator.webkitGetUserMedia) || isElectron() || isSafari;
    }

    presenter.readText = function(texts, callback) {
        texts = presenter.splitLongTexts(texts);
        texts = presenter.removeUnnecessaryPunctuationMarks(texts);

        if (window.responsiveVoice) {
            responsiveVoiceSpeak(texts, callback);
            return;
        }

        if ('speechSynthesis' in window) {
            speechSynthesisSpeak(texts, callback);
            return;
        }

        if (callback) {
            callback();
        }
    };

    var delayedSpeakInterval = null; // only used by speakWhenIdle, which is why they are here and not at the top of the file
    var delayedSpeakTimeout = null;
    //This method works like speakWithCallback, except that it waits for TTS to be idle instead of interrupting it
    presenter.speakWhenIdle = function (data, callback) {
        if(delayedSpeakTimeout) {
            clearTimeout(delayedSpeakTimeout);
            delayedSpeakTimeout = null;
        }
         if(delayedSpeakInterval) {
            clearInterval(delayedSpeakInterval);
            delayedSpeakInterval = null;
        }

        function setSpeakInterval (data, callback) {
            delayedSpeakInterval = setInterval(function () {
                var speechSynthSpeaking = false;
                var responsiveVoiceSpeaking = false;

                // Detect if TTS is idle
                if ('speechSynthesis' in window) {
                    speechSynthSpeaking = window.speechSynthesis.speaking;
                }
                if (window.responsiveVoice) {
                    responsiveVoiceSpeaking = window.responsiveVoice.isPlaying();
                }

                if (!speechSynthSpeaking && !responsiveVoiceSpeaking) {
                    // If TTS is idle, pass data to TTS and break the loop
                    clearInterval(delayedSpeakInterval);
                    delayedSpeakInterval = null;
                    presenter.speakWithCallback(data, callback);
                }
            }, 100);
        }

        /*
        * The timeout is used to ensure that if animation is triggered by another addon,
        * that addon has the opportunity to use TTS first, since animation acts as feedback
        */
        delayedSpeakTimeout = setTimeout(function(){ setSpeakInterval(data, callback); }, 200);
    };

    presenter.playTitle = function (area, id, langTag) {
        if (area && id) {
            var textVoices = [getTextVoiceObject(presenter.getAddOnConfiguration(area, id).title, langTag)];
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
        if (!presenter.configuration.disableNewPageMessage) {
            textVoices.push(getTextVoiceObject(presenter.playerController.getPageTitle(),presenter.configuration.pageLangTag));
        }
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

    presenter.saveSentences = function(texts) {
        if (!presenter.saveNextSentences) return;
        presenter.saveNextSentences = false;
        let textVoices = [];
        for (let i = 0; i < texts.length; i++) {
            let speechText = texts[i];
            let splitSpeechTexts = splitLongText(speechText.text, speechText.lang);
            for (let j = 0; j < splitSpeechTexts.length; j++) {
                textVoices.push(window.TTSUtils.getTextVoiceObject(splitSpeechTexts[j].text, speechText.lang));
            }
        }
        if (!presenter.compareSentences(presenter.savedSentences, textVoices)) {
            presenter.savedSentences = textVoices;
            presenter.savedSentencesIndex = -1;
        }
    }

    presenter.clearSavedSentences = function() {
        presenter.savedSentences = [];
        presenter.savedSentencesIndex = -1;
        presenter.saveNextSentences = false;
    }

    presenter.setSaveNextSentences = function(value) {
        presenter.saveNextSentences = value;
    }

    presenter.readNextSavedSentence = function() {
        if (presenter.savedSentences.length == 0) {
            presenter.savedSentencesIndex = -1;
            return;
        }
        presenter.savedSentencesIndex += 1;
        if (presenter.savedSentencesIndex >= presenter.savedSentences.length) presenter.savedSentencesIndex = presenter.savedSentences.length - 1;
        presenter.readCurrentSavedSentence();
    }

    presenter.readPrevSavedSentence = function() {
        if (presenter.savedSentences.length == 0) {
            presenter.savedSentencesIndex = -1;
            return;
        }
        presenter.savedSentencesIndex -= 1;
        if (presenter.savedSentencesIndex < 0) presenter.savedSentencesIndex = 0;
        presenter.readCurrentSavedSentence();
    }

    presenter.readCurrentSavedSentence = function() {
        presenter.readText([presenter.savedSentences[presenter.savedSentencesIndex]], null);
    }

    presenter.compareSentences = function(sentences1, sentences2) {
        if (sentences1.length != sentences2.length) return false;
        for (var i = 0; i < sentences1.length; i++) {
            if (sentences1[i].lang != sentences2[i].lang) return false;
            if (sentences1[i].text != sentences2[i].text) return false;
        }
        return true;
    }

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

            clearInterval(presenter.intervalResume);
            presenter.intervalResume = undefined;
        }
    };

    presenter.destroy = function () {
        presenter.cancelSpeechSynthesis();
        presenter.configuration = null;
        presenter.$view = null;
    };

    return presenter;
}
