function AddonText_Selection_create() {

    var presenter = function() {};

    presenter.eventBus = null;
    presenter.playerController = null;
    presenter.textParser = null;
    presenter.selected_elements = null;
    presenter.isWorkMode = true;
    presenter.markedMathJaxContent = [];
    presenter.areAllPhrasesSingleWord = true;
    presenter._keyboardController = null;
    presenter._firstElementSwitch = true;
    var isWCAGOn = false;

    var SELECTED_SECTION_START = "&\n&SELECTED_SECTION_START&\n&";
    var SELECTED_SECTION_END = "&\n&SELECTED_SECTION_END&\n&";
    var CORRECT_SECTION_START = "&\n&CORRECT_SECTION_START&\n&";
    var CORRECT_SECTION_END = "&\n&CORRECT_SECTION_END&\n&";
    var WRONG_SECTION_START = "&\n&WRONG_SECTION_START&\n&";
    var WRONG_SECTION_END = "&\n&WRONG_SECTION_END&\n&";
    var SELECTED ="&\n&SELECTED&\n&";
    var WRONG = "&\n&WRONG&\n&";
    var CORRECT = "&\n&CORRECT&\n&";
    var SPLIT = "&\n&SPLIT&\n&";
    var PHRASE = "&\n&PHRASE&\n&";
    var PHRASE_END = "&\n&PHRASE_END&\n&";

    var MATH_JAX_MARKER = 'MATHJAX';

    presenter.setPlayerController = function (controller) {
        this.playerController = controller;
        presenter.eventBus = controller.getEventBus();
        presenter.textParser = new TextParserProxy(controller.getTextParser());
    };

    function getEventData(it, val, sc) {
        return {
            'source': presenter.configuration.addonID,
            'item': '' + it,
            'value': '' + val,
            'score': '' + sc
        }
    }

    presenter.sendEvent = function(item, value, score, checkIsAllOK) {
        presenter.eventBus.sendEvent('ValueChanged', getEventData(
            parseInt(item, 10) + 1,
            value ? 1 : 0,
            score ? 1 : 0
        ));

        if (presenter.isAllOK() && checkIsAllOK && presenter.configuration.isActivity) sendAllOKEvent();
    };

    function sendAllOKEvent() {
        presenter.eventBus.sendEvent('ValueChanged', getEventData('all', '', ''));
    }

    var first = 0,
        beforeActive = false,
        lastMoveEvent = null;

    function isLastSpecialSign(word) {
        return ['.', ',', '?', '!', ';', ':'].indexOf(word[word.length-1]) != -1;
    }

    presenter.isStartedCorrect = function(word) {
        return (/\\correct{/).test(word);
    };

    presenter.isStartedWrong = function(word) {
        return (/\\wrong{/).test(word);
    };

    presenter.hasOpeningBracket = function(word) {
        return (/{/).test(word);
    };

    presenter.hasClosingBracket = function(word) {
        return (/}/).test(word);
    };

    presenter.getWrongWords = function(word) {
        var pattern = (/(.*)\\wrong{(.*)}(.*)/);
        return pattern.exec(word).slice(1);
    };

    presenter.getCorrectWords = function(word) {
        var pattern = (/(.*)\\correct{(.*)}(.*)/);
        return pattern.exec(word).slice(1);
    };

    presenter.isMarkedCorrect = function(word) {
        var counted = this.countBrackets(word);
        return (/\\correct{.*}/).test(word) && (counted.open === counted.close);
    };

    presenter.isMarkedWrong = function(word) {
        var counted = this.countBrackets(word);
        return (/\\wrong{.*}/).test(word) && (counted.open === counted.close);
    };

    presenter.cutMarkedCorrect = function(word) {
        var countedBrackets = this.countBrackets(word);
        if (isLastSpecialSign(word)) {
            word = word.replace(/\\correct{/, '');
            if (countedBrackets.open === countedBrackets.close) {
                word = word.replace(/}([^}]*)$/,'$1');
            }
            return word.substring(0, word.length-1);
        } else {
            word = word.replace(/\\correct{/, '');
            if (countedBrackets.open === countedBrackets.close) {
                word = word.replace(/}([^}]*)$/,'$1');
            }
            return word;
        }
    };

    presenter.cutMarkedWrong = function(word) {
        var countedBrackets = this.countBrackets(word);
        if (isLastSpecialSign(word)) {
            word = word.replace(/\\wrong{/, '');
            if (countedBrackets.open === countedBrackets.close) {
                word = word.replace(/}([^}]*)$/,'$1');
            }
            return word.substring(0, word.length - 1);
        } else {
            word = word.replace(/\\wrong{/, '');
            if (countedBrackets.open === countedBrackets.close) {
                word = word.replace(/}([^}]*)$/,'$1');
            }
            return word;
        }
    };

    presenter.cutLastClosingBracket = function (word) {
        return word.replace(/}([^}]*)$/, '$1');
    };

    presenter.countBrackets = function (word) {
        return {
            open: word.split("{").length - 1,
            close: word.split("}").length - 1
        }
    };

    presenter.startSelection = function (et) {
        first = parseInt($(et).attr('number'), 10);
        if (isNaN(first)) first = parseInt($(et).attr('left'), 10);
        if (isNaN(first)) first = parseInt($(et).closest('.selectable').attr('number'), 10);
        if (isNaN(first)) {
            $(et).nextAll('div').each(function () {
                first = parseInt($(this).children('span.selectable').attr('number'), 10);
                if (!isNaN(first)) {
                    beforeActive = true;
                    return false;
                }
            });
        }
        if ($(et).hasClass('text_selection') && isNaN(first)) {
            beforeActive = true;
            first = parseInt(presenter.$view.find('.text_selection').find('span.selectable').first().attr('number'), 10);
        }
    };

    presenter.endSelection = function (et) {
        var last = parseInt($(et).attr('number'), 10),
            tmp = 0,
            i,
            $span = null,
            element = null;

        if (isNaN(last)) last = parseInt($(et).attr('right'), 10);
        if (isNaN(last)) last = parseInt($(et).closest('.selectable').attr('number'), 10);
        if (isNaN(last)) {
            $(et).nextAll('div').each(function () {
                last = parseInt($(this).children('span.selectable').attr('number'), 10);
                if (!isNaN(last)) {
                    return false;
                }
            });
        }
        if ($(et).hasClass('text_selection')) {
            last = first;
        }
        var selected = presenter.$view.find('.text_selection').find('.selected');

        if (first !== last) {
            if (first > last) {
                tmp = first;
                first = last;
                last = tmp;
            }

            if (presenter.configuration.selection_type === 'SINGLESELECT') {

                if (selected.length === 0) {
                    for (i = first; i < last + 1; i++) {
                        element = presenter.$view.find('.text_selection').find("span[number='" + i + "']");
                        if (element.hasClass('selectable')) {
                            element.toggleClass('selected');
                            break;
                        }
                    }
                } else if (selected.length === 1) {
                    for (i = first; i < last + 1; i++) {
                        element = presenter.$view.find('.text_selection').find("span[number='" + i + "']");
                        if (element.hasClass('selectable')) {
                            $(selected).removeClass('selected');
                            element.addClass('selected');
                            break;
                        }
                    }
                } else {
                    $(selected).removeClass('selected');
                }
            } else if (presenter.configuration.selection_type === 'MULTISELECT') {

                for (i = first; i < last + 1; i++) {
                    element = presenter.$view.find('.text_selection').find("span[number='" + i + "']");
                    if (element.hasClass('selectable')) {
                        element.toggleClass('selected');
                    }
                }

            }

            for (i = first; i < last + 1; i++) {
                element = presenter.$view.find('.text_selection').find("span[number='" + i + "']");
                if (element.hasClass('selectable')) {
                    presenter.sendEvent(element.attr('number'), element.hasClass('selected'), isCorrect(element), i === last);
                }
            }

        } else if (first === last && !beforeActive) {
            $span = presenter.$view.find('.text_selection').find("span[number='" + first + "']");

            if (presenter.configuration.selection_type === 'SINGLESELECT') {

                if (selected.length == 0) {
                    if ($span.hasClass('selectable')) {
                        $span.addClass('selected');
                    }
                } else if (selected.length == 1) {
                    if (parseInt(selected.attr('number'), 10) === parseInt(first, 10)) {
                        selected.removeClass('selected');
                    } else {
                        if ($span.hasClass('selectable')) {
                            selected.removeClass('selected');
                            $span.toggleClass('selected');
                        }
                    }
                }

            } else if (presenter.configuration.selection_type === 'MULTISELECT') {

                if ($span.hasClass('selectable')) {
                    $span.toggleClass('selected');
                }
            }

            if ($span.hasClass('selectable')) {
                presenter.sendEvent($span.attr('number'), $span.hasClass('selected'), isCorrect($span), true);
            }
        }

        first = 0;
        beforeActive = false;
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        } else if (document.selection) {
            document.selection.empty();
        }
    };

    function isCorrect($element) {
        var number = parseInt($($element).attr('number'), 10),
            isInCorrectArray = $.inArray(number, presenter.markers.markedCorrect) >= 0;
        return $element.hasClass('selected') ? isInCorrectArray : !isInCorrectArray;
    }

    presenter.turnOnEventListeners = function () {
        var $text_selection = presenter.$view.find('.text_selection');
        if (presenter.configuration.isTabindexEnabled) {$text_selection.attr('tabindex', '0');}

        if (MobileUtils.isMobileUserAgent(navigator.userAgent)) {
            if (presenter.configuration.enableScroll) {

                var posDiff = 0;
                var lastScreenPos = {X:0, Y:0};
                $text_selection.on('touchstart', function (e) {
                    e.stopPropagation();
                    posDiff = 0;
                    var temp = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] || e.originalEvent.targetTouches[0];
                    lastScreenPos.X = temp.screenX;
                    lastScreenPos.Y = temp.screenY;
                });

                $text_selection.on('touchend', function (e) {
                    e.stopPropagation();
                    if (posDiff<15) {
                        presenter.startSelection(e.target);
                        presenter.endSelection(e.target);
                        presenter.configuration.isExerciseStarted = true;
                     }
                });

                $text_selection.on('touchmove', function (e) {
                    e.stopPropagation();
                    var temp = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] || e.originalEvent.targetTouches[0];
                    posDiff += Math.abs(lastScreenPos.X - temp.screenX) + Math.abs(lastScreenPos.Y - temp.screenY);
                    lastScreenPos.X = temp.screenX;
                    lastScreenPos.Y = temp.screenY;
                });
            } else {
                $text_selection.on('touchstart', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    presenter.startSelection(e.target);
                });

                $text_selection.on('touchend', function (e) {
                    e.stopPropagation();
                    presenter.configuration.isExerciseStarted = true;
                    e.preventDefault();
                    if (lastMoveEvent != null) {
                        presenter.endSelection(lastMoveEvent);
                    } else {
                        presenter.endSelection(e.target);
                    }
                    lastMoveEvent = null;
                });

                $text_selection.on('touchmove', function (e) {
                    e.stopPropagation();
                   e.preventDefault();
                    var temp = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] || e.originalEvent.targetTouches[0];

                    lastMoveEvent = $(document.elementFromPoint(temp.pageX - $(document).scrollLeft(), temp.pageY - $(document).scrollTop()));
                });
            }
        } else {
            $text_selection.on('mouseup', function (e) {
                e.stopPropagation();
                presenter.configuration.isExerciseStarted = true;
                presenter.endSelection(e.target);
            });

            $text_selection.on('mousedown', function (e) {
                e.stopPropagation();
                presenter.startSelection(e.target);
            });

            $text_selection.find('.selectable').hover(
                function () {
                    $(this).addClass("hover");
                },
                function () {
                    $(this).removeClass("hover");
                }
            );
        }

        $text_selection.on('click', function (e) {
            e.stopPropagation();
        });

        presenter.configuration.areEventListenersOn = true;
    };

    presenter.turnOffEventListeners = function () {
        var $text_selection = presenter.$view.find('.text_selection'),
            selectable = $text_selection.find('.selectable');

        $text_selection.off();
        selectable.off();

        presenter.configuration.areEventListenersOn = false;
    };

    presenter.turnOnShowAnswersListeners = function () {
        presenter.eventBus.addEventListener('ShowAnswers', this);
        presenter.eventBus.addEventListener('HideAnswers', this);
    };

    function getSpace(i) {
        return "<span left=\"" + i + "\" right=\"" + (i + 1) + "\"> </span>";
    }

    function getSpecialIfStarted(word) {
        return isLastSpecialSign(word) && (presenter.isStartedWrong(word) || presenter.isStartedCorrect(word)) ? word[word.length - 1] : "";
    }

    presenter.upgradeModel = function(model) {
        var upgradedModel = upgradeModelEnableScrollProperty(model);
        upgradedModel = presenter.upgradeModelAddTTS(upgradedModel);
        return upgradedModel;
    };

    function upgradeModelEnableScrollProperty(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if(!upgradedModel['enableScroll']){
            upgradedModel['enableScroll'] = false;
        }

        return upgradedModel;
    }


    presenter.upgradeModelAddTTS = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (!upgradedModel["langAttribute"]) {
            upgradedModel["langAttribute"] = 'pl';
        }
        if (!upgradedModel["speechTexts"]) {
            upgradedModel["speechTexts"] = {
                selectedSectionStart: {selectedSectionStart: 'start of selected section'},
                selectedSectionEnd: {selectedSectionEnd: 'end of selected section'},
                selected: {selected: 'selected'},
                deselected: {deselected: 'deselected'},
                wrong: {wrong: 'wrong'},
                correct: {correct: 'correct'},
                phrase: {phrase: 'phrase'},
                phraseEnd: {phraseEnd: 'end of phrase'}
            };
        }

        return upgradedModel;
    };

    function getSpeechTextProperty (rawValue, defaultValue) {
        var value = rawValue.trim();

        if (value === undefined || value === null || value === '') {
            return defaultValue;
        }

        return value;
    }

    presenter.setSpeechTexts = function(speechTexts) {
        presenter.speechTexts = {
                selectedSectionStart: 'start of selected section',
                selectedSectionEnd: 'end of selected section',
                selected: 'selected',
                deselected: 'deselected',
                wrong: 'wrong',
                correct: 'correct',
                phrase: 'phrase',
                phraseEnd: 'end of phrase'
        };

        if (!speechTexts) {
            return;
        }

        presenter.speechTexts = {
            selectedSectionStart:    getSpeechTextProperty(speechTexts['selectedSectionStart']['selectedSectionStart'], presenter.speechTexts.selectedSectionStart),
            selectedSectionEnd: getSpeechTextProperty(speechTexts['selectedSectionEnd']['selectedSectionEnd'], presenter.speechTexts.selectedSectionEnd),
            correct:     getSpeechTextProperty(speechTexts['correct']['correct'], presenter.speechTexts.correct),
            wrong:   getSpeechTextProperty(speechTexts['wrong']['wrong'], presenter.speechTexts.wrong),
            selected:      getSpeechTextProperty(speechTexts['selected']['selected'], presenter.speechTexts.selected),
            deselected:      getSpeechTextProperty(speechTexts['deselected']['deselected'], presenter.speechTexts.deselected),
            phrase:      getSpeechTextProperty(speechTexts['phrase']['phrase'], presenter.speechTexts.phrase),
            phraseEnd:      getSpeechTextProperty(speechTexts['phraseEnd']['phraseEnd'], presenter.speechTexts.phraseEnd)
        };
    };

    presenter.presenterLogic = function (view, model, isPreview) {
        presenter.$view = $(view);

        model = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        if (isPreview) {
            presenter.$view.append($(presenter.configuration.renderedPreview));
        } else {
            presenter.$view.append($(presenter.configuration.renderedRun));
            presenter.setVisibility(presenter.configuration.isVisible);
        }
    };

    presenter.ERROR_CODES = {
        M01: 'Text cannot be empty',
        M02: 'Text cannot be w/o \\correct{} or \\wrong{}',
        M03: 'You cannot use \\wrong{} in "All selectable" mode',
        M04: 'Empty word in marker',
        M05: 'In single selection you have to mark only one phrase as correct and at least one mark as wrong',
        M06: '\\alt{} cannot contain \\correct{} or \\wrong{}',
        M07: 'When in All selectable mode \\alt{} visible text section must contain only a single word'
    };

    presenter.MODE = {
        'Mark phrases to select': 'MARK_PHRASES',
        'All selectable': 'ALL_SELECTABLE',
        DEFAULT: 'Mark phrases to select'
    };

    presenter.SELECTION_TYPE = {
        'Single select': 'SINGLESELECT',
        'Multiselect': 'MULTISELECT',
        DEFAULT: 'Single select'
    };

    presenter.run = function (view, model) {
        presenter.presenterLogic(view, model, false);
        presenter.turnOnEventListeners();
        presenter.turnOnShowAnswersListeners();
    };

    presenter.createPreview = function (view, model) {
        presenter.presenterLogic(view, model, true);
    };

    function getErrorObject(ec) {
        return {isValid: false, errorCode: ec};
    }

    presenter.validateModel = function (model) {
        var parsedText;

        presenter.setSpeechTexts(model['speechTexts']);

        if (ModelValidationUtils.isStringEmpty(model.Text)) {
            return getErrorObject('M01');
        }

        if (!presenter.vaildateTagsInAltText(model.Text)){
            return getErrorObject('M06');
        }
        
        var isTabindexEnabled = ModelValidationUtils.validateBoolean(model['Is Tabindex Enabled']);
        var mode = ModelValidationUtils.validateOption(presenter.MODE, model.Mode);
        var selection_type = ModelValidationUtils.validateOption(presenter.SELECTION_TYPE, model['Selection type']);

        var wordSelection = ModelValidationUtils.validateBoolean(model['Enable letters selections']);

        if(mode == "ALL_SELECTABLE" && !presenter.validateSingleWordAltText(model.Text)) {
            return getErrorObject('M07');
        }

        presenter.areAllPhrasesSingleWord = !presenter.detectMultipleWordPhrases(model.Text);

        var preparedText = model.Text;
        if (presenter.textParser) {
            preparedText = presenter.textParser.parseAltTexts(model.Text);
        } else {
            preparedText = window.TTSUtils.parsePreviewAltText(model.Text);
        }
        if (wordSelection) {
            parsedText = presenter.parseCharacters(preparedText, mode, selection_type);
        } else {
            parsedText = presenter.parseWords(preparedText, mode, selection_type);
        }

        if (!parsedText.isValid) {
            return getErrorObject(parsedText.errorCode);
        }

        return {
            isValid: true,
            mode: mode,
            selection_type: selection_type,
            renderedRun: parsedText.renderedRun,
            renderedPreview: parsedText.renderedPreview,
            isVisible: ModelValidationUtils.validateBoolean(model["Is Visible"]),
            isVisibleByDefault: ModelValidationUtils.validateBoolean(model["Is Visible"]),
            isExerciseStarted: false,
            areEventListenersOn: true,
            addonID: model['ID'],
            isActivity: !(ModelValidationUtils.validateBoolean(model['isNotActivity'])),
            isTabindexEnabled: isTabindexEnabled,
            enableScroll: ModelValidationUtils.validateBoolean(model['enableScroll']),
            langTag: model['langAttribute']
        };
    };

    presenter.getMarked = function (wrong, correct) {
        return {
            markedWrong: wrong,
            markedCorrect: correct
        };
    };

    presenter.connectWords = function (words) {
        var i, j,
            longWord = '',
            result = [];

        for (i = 0; i < words.length; i++) {
            if ((presenter.isStartedCorrect(words[i]) || presenter.isStartedWrong(words[i])) && !presenter.isMarkedCorrect(words[i]) && !presenter.isMarkedWrong(words[i])) {
                if (presenter.isStartedCorrect(words[i])) {
                    longWord += words[i] + ' ';
                    for (j = i + 1; j < words.length; j++) {
                        if (presenter.hasClosingBracket(words[j])) {
                            longWord += words[j];
                            i = j;
                            j = words.length + 1;
                        } else {
                            longWord += words[j] + ' ';
                        }
                    }
                    result.push(longWord);
                    longWord = '';
                } else if (presenter.isStartedWrong(words[i])) {
                    longWord += words[i] + ' ';
                    for (j = i + 1; j < words.length; j++) {
                        if (presenter.hasClosingBracket(words[j])) {
                            longWord += words[j];
                            i = j;
                            j = words.length + 1;
                        } else {
                            longWord += words[j] + ' ';
                        }
                    }
                    result.push(longWord);
                    longWord = '';
                }
            } else {
                result.push(words[i]);
            }
        }

        return result;
    };

    presenter.parseCharacters = function (text, mode, selection_type) {
        var i,
            result = '',
            words = [],
            markedCorrect = [],
            markedWrong = [],
            renderedPreview = '',
            renderedRun = '',
            amountWrong,
            amountCorrect,
            isTagClosed = true,
            spanNumber = 0,
            tmpWord = '',
            wrongMarkerInAllSelectable = false,
            emptyWord = false,
            stack = 0,
            counted = null;

        text = presenter.removeNonBreakingSpacesInWith(text, ' ');

        HTMLParser(text.replace(/&nbsp;/g, ' '), {
            start: function (tag, attrs, unary) {
                renderedPreview += "<" + tag;
                renderedRun += "<" + tag;

                for (i = 0; i < attrs.length; i++) {
                    renderedPreview += " " + attrs[i].name + '="' + attrs[i].escaped + '"';
                    renderedRun += " " + attrs[i].name + '="' + attrs[i].escaped + '"';
                }

                renderedPreview += (unary ? "/" : "") + ">";
                renderedRun += (unary ? "/" : "") + ">";
            },
            end: function (tag) {
                renderedPreview += "</" + tag + ">";
                renderedRun += "</" + tag + ">";
            },
            chars: function (text) {
                //words = text.match(/\\?[\sa-zA-Z0-9\.\,]+(?:\{[\sa-zA-Z0-9]+\})?/g);
                words = text.split("\\");
                for (var j = 0; j < words.length; j++) {
                    if (words[0] == "") {
                        words.splice(0, 1);
                    }
                }
                for (var i = 0; i < words.length; i++) {
                    if (words[0] == "") {
                        words.splice(0, 1);
                    }
                    if (words[i].indexOf("correct{") > -1 || words[i].indexOf("wrong{") > -1) {
                        words[i] = '\\' + words[i];
                    }
                }

                for (i = 0; i < words.length; i++) {
                    if (isTagClosed === true) {
                        if (words[i] === ' ') {
                            renderedPreview += getSpace(spanNumber);
                            renderedRun += getSpace(spanNumber);
                        } else if (presenter.isMarkedCorrect(words[i])) {
                            tmpWord = presenter.cutMarkedCorrect(words[i]);

                            counted = presenter.countBrackets(words[i]);
                            if (counted.open > counted.close) {
                                renderedPreview += '<span class="correct selectable">' + tmpWord + getSpecialIfStarted(words[i]);
                                renderedRun += '<span class="selectable" number="' + spanNumber + '">' + tmpWord + getSpecialIfStarted(words[i]);
                                isTagClosed = false;
                                markedCorrect.push(spanNumber);
                                spanNumber++;
                            } else {
                                $.each(presenter.getCorrectWords(words[i]), function (index, word) {
                                    if (word.length == 0) {
                                        if (index == 1) {
                                            markedCorrect.push(spanNumber);
                                        }
                                        return;
                                    }
                                    var selectable = index == 1 ? 'selectable' : '',
                                        correct = index == 1 ? 'correct' : '';
                                    renderedPreview += '<span class="' + correct + ' ' + selectable + '">' + word + '</span>';
                                    if (mode === 'ALL_SELECTABLE') {
                                        renderedRun += '<span class="selectable" number="' + spanNumber + '">' + word + '</span>';
                                        markedWrong.push(spanNumber);
                                    } else {
                                        renderedRun += '<span class="' + selectable + '" number="' + spanNumber + '">' + word + '</span>';
                                    }
                                    if (index == 1) {
                                        markedCorrect.push(spanNumber);
                                    }
                                    spanNumber++;
                                });
                            }

                            if (ModelValidationUtils.isStringEmpty(tmpWord)) {
                                emptyWord = true;
                            }
                        } else if (presenter.isMarkedWrong(words[i])) {
                            tmpWord = presenter.cutMarkedWrong(words[i]);

                            counted = presenter.countBrackets(words[i]);
                            if (counted.open > counted.close) {
                                renderedPreview += '<span class="wrong selectable">' + tmpWord + getSpecialIfStarted(words[i]);
                                renderedRun += '<span class="selectable" number="' + spanNumber + '">' + tmpWord + getSpecialIfStarted(words[i]);
                                isTagClosed = false;
                                markedWrong.push(spanNumber);
                                spanNumber++;
                            } else {
                                $.each(presenter.getWrongWords(words[i]), function (index, word) {
                                    if (word.length == 0) {
                                        if (index == 1) {
                                            markedWrong.push(spanNumber);
                                        }
                                        return;
                                    }
                                    var selectable = index == 1 ? 'selectable' : '',
                                        wrong = index == 1 ? 'wrong' : '';
                                    renderedPreview += '<span class="' + wrong + ' ' + selectable + '">' + word + '</span>';
                                    renderedRun += '<span class="' + selectable + '" number="' + spanNumber + '">' + word + '</span>';
                                    if (index == 1) {
                                        markedWrong.push(spanNumber);
                                    }
                                    spanNumber++;
                                });
                            }

                            if (ModelValidationUtils.isStringEmpty(tmpWord)) {
                                emptyWord = true;
                            }
                            if (mode === 'ALL_SELECTABLE') {
                                wrongMarkerInAllSelectable = true;
                            }
                        } else if (presenter.isStartedCorrect(words[i])) {
                            tmpWord = presenter.cutMarkedCorrect(words[i]);

                            counted = presenter.countBrackets(words[i]);
                            stack += counted.open;
                            stack -= counted.close;

                            renderedPreview += '<span class="correct selectable">' + tmpWord + getSpecialIfStarted(words[i]);
                            renderedRun += '<span class="selectable" number="' + spanNumber + '">' + tmpWord + getSpecialIfStarted(words[i]);
                            markedCorrect.push(spanNumber);
                            spanNumber++;
                            isTagClosed = false;
                        } else if (presenter.isStartedWrong(words[i])) {
                            tmpWord = presenter.cutMarkedWrong(words[i]);

                            counted = presenter.countBrackets(words[i]);
                            stack += counted.open;
                            stack -= counted.close;

                            renderedPreview += '<span class="wrong selectable">' + tmpWord + getSpecialIfStarted(words[i]);
                            renderedRun += '<span class="selectable" number="' + spanNumber + '">' + tmpWord + getSpecialIfStarted(words[i]);
                            markedWrong.push(spanNumber);
                            spanNumber++;
                            isTagClosed = false;
                        } else {
                            counted = presenter.countBrackets(words[i]);
                            stack += counted.open;
                            stack -= counted.close;

                            if (mode === 'ALL_SELECTABLE') {
                                renderedRun += '<span class="selectable" number="' + spanNumber + '">' + words[i] + '</span>';
                                markedWrong.push(spanNumber);
                            } else if (mode === 'MARK_PHRASES') {
                                renderedRun += '<span number="' + spanNumber + '">' + words[i] + '</span>';
                            }
                            renderedPreview += '<span number="' + spanNumber + '">' + words[i] + '</span>';

                            spanNumber++;
                        }
                    } else { // isTagClosed === false
                        counted = presenter.countBrackets(words[i]);
                        if (counted.open === counted.close) {
                            renderedPreview += words[i] + ' ';
                            renderedRun += words[i] + ' ';
                        } else {
                            if (counted.close >= (stack + counted.open)) {
                                tmpWord = presenter.cutLastClosingBracket(words[i]);
                            } else {
                                tmpWord = words[i];
                            }
                            stack += counted.open;
                            stack -= counted.close;
                            if (stack === 0) {
                                renderedPreview += tmpWord + '</span>';
                                renderedRun += tmpWord + '</span>';
                                isTagClosed = true;
                            } else {
                                renderedPreview += tmpWord + ' ';
                                renderedRun += tmpWord + ' ';
                            }
                        }
                    }
                }
                text = words.join(' ');
                result += text;
            },
            comment: function (text) {
            }
        });

        amountCorrect = markedCorrect.length;
        amountWrong = markedWrong.length;

        presenter.markers = presenter.getMarked(markedWrong, markedCorrect);

        if (amountCorrect === 0 && amountWrong === 0) {
            return getErrorObject('M02');
        }

        if (wrongMarkerInAllSelectable) {
            return getErrorObject('M03');
        }

        if (emptyWord) {
            return getErrorObject('M04');
        }

        if ((amountCorrect !== 1 || amountWrong < 1) && selection_type === 'SINGLESELECT') { // HasOneCorrectAtLeastOneWrongInSingleSelectionTypeSelection
            return getErrorObject('M05');
        }

        renderedRun = presenter.deselectSpansWithOnlySpaces(renderedRun);

        return {
            isValid: true,
            renderedPreview: '<div class="text_selection">' + renderedPreview + '</div>',
            renderedRun: '<div class="text_selection">' + renderedRun + '</div>',
            markedWrong: markedWrong,
            markedCorrect: markedCorrect
        };
    };

    presenter.deselectSpansWithOnlySpaces = function (htmlString) {
        var $text = $(htmlString);

        var textWithDeselectedSpaces = "";
        $text.each(function () {
            var $element = $(this);
            if ($element.hasClass("selectable")) {
                if ($element.text().trim() == "") {
                    $element.removeClass("selectable");
                }
            }
            textWithDeselectedSpaces += $(this).context.outerHTML;
        });

        return textWithDeselectedSpaces;
    };

    presenter.removeNonBreakingSpacesInWith = function (text, changeTo) {
        var textWithoutSpaces = "";

        while (true) {
            var nbspIndex = text.indexOf("&nbsp;");
            if (nbspIndex === -1) {
                textWithoutSpaces += text;
                break;
            }

            textWithoutSpaces = textWithoutSpaces + text.slice(0, nbspIndex) + changeTo;
            text = text.slice(nbspIndex + 6, text.length);
        }

        return textWithoutSpaces;
    };

    presenter.markMathJax = function (text) {
        var findMathJaxRex = /\\\(.*?\\\)/g;
        var match = findMathJaxRex.exec(text);
        while (match !== null) {
            text = text.replace(match[0], MATH_JAX_MARKER + presenter.markedMathJaxContent.length);
            presenter.markedMathJaxContent.push(match[0]);
            match = findMathJaxRex.exec(text);
        }

        return text;
    };

    presenter.retrieveMathJax = function (text) {
        for (var i = 0; i < presenter.markedMathJaxContent.length; i++) {
            text = text.replace(new RegExp(MATH_JAX_MARKER + i, 'g'), presenter.markedMathJaxContent[i]);
        }
        return text;
    };

    function wrapText(text, classes, number) {
        var $span = $('<span></span>');
        classes.forEach(function (c) {
            $span.addClass(c);
        });
        if (number !== undefined) {
            $span.attr('number', number);
        }
        $span.html(text);

        return $span[0].outerHTML;
    }

    function wrapSpaces(spaces, num) {
        var $span = $('<span></span>');
        $span.attr('left', num);
        $span.attr('right', num + 1);
        $span.html(spaces);

        return $span[0].outerHTML;
    }

    presenter.parseWords = function (text, mode, selection_type) {
        text = presenter.markMathJax(text.replace(/&nbsp;/g, ' '));

        var previewHTML = '', runHTML = '';
        var spanIndex = 0;
        var spansMarkedCorrect = [], spansMarkedWrong = [];
        var isEmptyWord = false;
        var isWrongMarker = false;

        var correct = /\\correct{([^}]+)?}/.source;
        var wrong = /\\wrong{([^}]+)?}/.source;
        var tags = /(<[^>]+?>)/.source;
        var word = /([^\s\.,#!$%\^\*:{}=\-_`~\(\)<>]+)/.source;
        var whiteSpaces = /([\s\.,#!$%\^\*:{}=\-_`~\(\)]+)/.source;

        var mainRex = new RegExp([correct, wrong, tags, word, whiteSpaces].join('|'), 'g');

        var match = mainRex.exec(text);
        while (match !== null) {
            if (match[1]) { // correct
                if (match[1] === '') isEmptyWord = true;
                previewHTML += wrapText(match[1], ['correct', 'selectable']);
                runHTML += wrapText(match[1], ['selectable'], spanIndex);
                spansMarkedCorrect.push(spanIndex);
                spanIndex++;
            } else if (match[2]) { // wrong
                if (match[2] === '') isEmptyWord = true;
                isWrongMarker = true;
                previewHTML += wrapText(match[2], ['wrong', 'selectable']);
                runHTML += wrapText(match[2], ['selectable'], spanIndex);
                spansMarkedWrong.push(spanIndex);
                spanIndex++;
            } else if (match[3]) { // HTML tag
                previewHTML += match[3];
                runHTML += match[3];
            } else if (match[4]) { // words
                if (mode === 'ALL_SELECTABLE') { // word
                    previewHTML += match[4];
                    runHTML += wrapText(match[4], ['selectable'], spanIndex);
                    spansMarkedWrong.push(spanIndex);
                } else {
                    previewHTML += match[4];
                    runHTML += match[4];
                }
                spanIndex++;
            } else { // spaces
                previewHTML += match[5];
                runHTML += wrapSpaces(match[5], spanIndex - 1);
            }

            // get next match
            match = mainRex.exec(text);
        }

        presenter.markers = {
            markedCorrect: spansMarkedCorrect,
            markedWrong: spansMarkedWrong
        };

        if (spansMarkedCorrect.length === 0 && spansMarkedWrong.length === 0) {
            return getErrorObject('M02');
        }

        if (mode === 'ALL_SELECTABLE' && isWrongMarker) {
            return getErrorObject('M03');
        }

        if (isEmptyWord) {
            return getErrorObject('M04');
        }

        if ((spansMarkedCorrect.length !== 1 || spansMarkedWrong.length < 1) && selection_type === 'SINGLESELECT') {
            return getErrorObject('M05');
        }

        return {
            isValid: true,
            renderedPreview: '<div class="text_selection">' + presenter.retrieveMathJax(previewHTML) + '</div>',
            renderedRun: '<div class="text_selection">' + presenter.retrieveMathJax(runHTML) + '</div>'
        };

    };

    presenter.executeCommand = function (name, params) {
        if (!presenter.configuration.isValid) return;

        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'isAllOK': presenter.isAllOK,
            'isAttempted': presenter.isAttempted
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setVisibility = function (isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.show = function () {
        if (presenter.isShowAnswers) {
            presenter.hideAnswers();
        }

        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
    };

    presenter.hide = function () {
        if (presenter.isShowAnswers) {
            presenter.hideAnswers();
        }

        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
    };

    presenter.reset = function () {
        if (presenter.isShowAnswers) {
            presenter.hideAnswers();
        }

        presenter.selected_elements = null;

        presenter.$view.find('.text_selection').find('.selected').removeClass('selected');
        presenter.setWorkMode();
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);
        presenter.configuration.isVisible = presenter.configuration.isVisibleByDefault;
    };

    presenter.getState = function () {
        if (presenter.isShowAnswers) {
            presenter.hideAnswers();
        }

        var allSelected = presenter.$view.find('.text_selection').find('.selected');
        var numberSelected = [];

        for (var i = 0; i < allSelected.length; i++) {
            numberSelected.push($(allSelected[i]).attr('number'));
        }

        return JSON.stringify({
            numbers: numberSelected,
            isVisible: presenter.configuration.isVisible,
            isExerciseStarted: presenter.configuration.isExerciseStarted
        });
    };

    presenter.setState = function (state) {
        if (ModelValidationUtils.isStringEmpty(state)) return;

        var parsed = JSON.parse(state),
            nums = parsed.numbers,
            isVisible = parsed.isVisible,
            isExerciseStarted = parsed.isExerciseStarted;

        for (var i = 0; i < nums.length; i++) {
            presenter.$view.find('.text_selection').find("span[number='" + nums[i] + "']").addClass("selected");
        }

        if (isVisible) {
            presenter.show();
        } else {
            presenter.hide();
        }

        presenter.configuration.isVisible = isVisible;
        presenter.configuration.isExerciseStarted = isExerciseStarted;
    };

    function intersection(a, b) {
        return a.filter(function (i) {
            return b.indexOf(parseInt(i, 10)) !== -1;
        });
    }

    presenter.setShowErrorsMode = function () {
        if (presenter.configuration.isActivity) {
            if (presenter.isShowAnswers) {
                presenter.hideAnswers();
            }

            presenter.isWorkMode = false;

            presenter.turnOffEventListeners();

            if (!presenter.configuration.isExerciseStarted) return false;

            if (presenter.isShowAnswers) presenter.hideAnswers();

            var i;

            var numbersSelected = presenter.$view.find('.text_selection').find('.selected').map(function () {
                return this.getAttribute('number');
            }).get();

            var numbersCorrect = presenter.markers.markedCorrect;
            var numbersWrong = presenter.markers.markedWrong;

            var correctSelected = intersection(numbersSelected, numbersCorrect);

            for (i = 0; i < correctSelected.length; i++) {
                presenter.$view.find('.text_selection').find("span[number='" + correctSelected[i] + "']").addClass('correct');
            }

            var selectedWrong = intersection(numbersSelected, numbersWrong);
            for (i = 0; i < selectedWrong.length; i++) {
                presenter.$view.find('.text_selection').find("span[number='" + selectedWrong[i] + "']").addClass('wrong');
            }
        }
    };

    presenter.setWorkMode = function () {
        if (presenter.configuration.isActivity) {
            if (presenter.isShowAnswers) {
                presenter.hideAnswers();
            }

            presenter.isWorkMode = true;

            presenter.$view.find('.text_selection').find('.correct').removeClass('correct');
            presenter.$view.find('.text_selection').find('.wrong').removeClass('wrong');

            presenter.selected_elements = presenter.$view.find('.text_selection').find('.selected');
            presenter.turnOffEventListeners();
            presenter.turnOnEventListeners();
        }
    };

    function points(selector) {
        var numbersSelected = presenter.$view.find('.text_selection').find('.selected').map(function () {
            return parseInt(this.getAttribute('number'), 10);
        }).get();

        return intersection(selector, numbersSelected).length;
    }

    presenter.getErrorCount = function () {
        if (presenter.configuration.isActivity) {
            if (presenter.isShowAnswers) {
                presenter.hideAnswers();
            }
            return points(presenter.markers.markedWrong);
        } else {
            return 0;
        }
    };

    presenter.getMaxScore = function () {
        if (presenter.configuration.isActivity) {
            if (presenter.isShowAnswers) {
                presenter.hideAnswers();
            }
            return presenter.markers.markedCorrect.length;
        } else {
            return 0;
        }
    };

    presenter.getScore = function () {
        if (presenter.configuration.isActivity) {
            if (presenter.isShowAnswers) {
                presenter.hideAnswers();
            }
            return points(presenter.markers.markedCorrect);
        } else {
            return 0;
        }
    };

    presenter.isAllOK = function () {
        var isMaxScore = presenter.getMaxScore() == presenter.getScore();
        var hasErrors = presenter.getErrorCount() > 0;

        return isMaxScore && !hasErrors;
    };

    presenter.isAttempted = function () {
        if (presenter.isShowAnswers) {
            presenter.hideAnswers();
        }

        return presenter.$view.find('.text_selection').find('.selected').length > 0;
    };

    presenter.showAnswers = function () {
        if (!presenter.configuration.isActivity) {
            return;
        }

        if (presenter.isShowAnswers) {
            return false;
        }

        if (!presenter.isWorkMode) {
            presenter.setWorkMode();
        }

        presenter.turnOffEventListeners();

        presenter.isShowAnswers = true;
        presenter.selected_elements = presenter.$view.find(".selected");
        var selectable_elements = presenter.$view.find(".selectable");

        presenter.selected_elements.removeClass("selected");

        for (var i = 0; i < selectable_elements.length; i++) {
            var elem = presenter.$view.find(".selectable")[i];
            var elem_number = parseInt($(elem).attr("number"), 10);

            if (presenter.markers.markedCorrect.indexOf(elem_number) !== -1) {
                $(elem).addClass("correct-answer");
            }
        }
    };

    presenter.hideAnswers = function () {
        if (!presenter.configuration.isActivity) {
            return;
        }

        if (!presenter.isShowAnswers) {
            return false;
        }

        presenter.turnOnEventListeners();

        presenter.isShowAnswers = false;
        presenter.$view.find(".correct-answer").removeClass("correct-answer");
        if (presenter.selected_elements != null) presenter.selected_elements.addClass("selected");
    };

    presenter.onEventReceived = function (eventName) {
        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        }
        if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        }
    };

    var TextSelectionKeyboardController = function (elements, elementsCount) {
        KeyboardController.call(this, elements, elementsCount);
        presenter._firstElementSwitch = true;
    };

    TextSelectionKeyboardController.prototype = Object.create(KeyboardController.prototype);

    TextSelectionKeyboardController.prototype.select = function (event) {
        if (event) {
            event.preventDefault();
        }
        if( presenter.isWorkMode && !presenter.isShowAnswers ) {
            presenter.startSelection(this.getTarget(this.keyboardNavigationCurrentElement, true));
            presenter.endSelection(this.getTarget(this.keyboardNavigationCurrentElement, true));
            presenter.configuration.isExerciseStarted = true;
            presenter.readSelection(this.getTarget(this.keyboardNavigationCurrentElement, true).hasClass('selected'));
        }
    };

    TextSelectionKeyboardController.prototype.switchElement = function (move) {
        if (presenter._firstElementSwitch) {
            presenter._firstElementSwitch = false;
            this.markCurrentElement(0);
        } else {
            var new_position_index = this.keyboardNavigationCurrentElementIndex + move;
            if (new_position_index < this.keyboardNavigationElementsLen && new_position_index >= 0) {
                KeyboardController.prototype.switchElement.call(this, move);
            }
        }
        presenter.readActiveElement(this.keyboardNavigationElements[this.keyboardNavigationCurrentElementIndex]);
    };

    TextSelectionKeyboardController.prototype.enter = function (event) {
        event.preventDefault();
        this.keyboardNavigationActive = true;
        presenter.readContent();
    };

     TextSelectionKeyboardController.prototype.escape = function (event) {
         presenter._firstElementSwitch = true;
         Object.getPrototypeOf(TextSelectionKeyboardController.prototype).escape.call(this);
     };

    presenter.buildKeyboardController = function () {
        var $text_selection = presenter.$view.find('.text_selection');
        var toSelect = $text_selection.find('.selectable');
        var jQueryToSelect = [];
        for (var i = 0; i < toSelect.length; i++) {
            jQueryToSelect.push($(toSelect[i]));
        }

        presenter._keyboardController = new TextSelectionKeyboardController(jQueryToSelect, toSelect.length);
    };

    presenter.keyboardController = function(keycode, isShiftKeyDown, event) {
        if (keycode === window.KeyboardControllerKeys.ESC) {
            event.preventDefault();
        }

        if (presenter._keyboardController === null) {
            presenter.buildKeyboardController();
        }

        presenter._keyboardController.handle(keycode, isShiftKeyDown, event);
    };

    presenter.readActiveElement = function($element) {
        if (!$element) {
            $element = presenter.$view.find('.keyboard_navigation_active_element');
        }

        if ($element.length === 0) return;

        var textVoices = presenter.getElementTextVoice($element);

        speak(textVoices);

    };

    presenter.getElementTextVoice = function($element) {
        var textVoices = [];
        var contentText = '';
        var langTag = '';
        var $ariaLabel = $element.closest('.addon_Text_Selection span[aria-label]:has(span[aria-hidden="true"])');
        if ($ariaLabel.length > 0) {
            contentText = $ariaLabel.attr('aria-label');
            langTag = $ariaLabel.attr('lang');
            if (!langTag) {
               langTag =  presenter.configuration.langTag;
            }
        } else {
            contentText = presenter.getTextFromElementWithAltTexts($element);
            langTag = presenter.configuration.langTag;
        }

        var readPhrases = presenter.configuration.mode != "ALL_SELECTABLE" && !presenter.areAllPhrasesSingleWord;
        if (readPhrases) {
            var elementIndex = -1;

            var selectables = presenter.$view.find('.selectable');
            var selectablesSize = selectables.size();
            if (selectablesSize > 0) {
                for (var i = 0; i < selectablesSize; i++){
                    if($(selectables[i]).is($element)){
                        elementIndex = i + 1;
                    }
                }
            }
            var phraseText = presenter.speechTexts.phrase;
            if(elementIndex > 0) {
                phraseText += ' ' + elementIndex;
            }
            textVoices.push(window.TTSUtils.getTextVoiceObject(phraseText));
        }

        textVoices.push(window.TTSUtils.getTextVoiceObject(contentText, langTag));

        if(readPhrases){
            textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.phraseEnd));
        }
        if ($element.hasClass('selected')) {
            textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.selected));
        }
        if ($element.hasClass('correct')) {
            textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.correct));
        } else if ($element.hasClass('wrong')) {
            textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.wrong));
        } else if ($element.hasClass('correct-answer')) {
            textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.selected));
        }

        return textVoices;
    };

    presenter.readSelection = function(selected) {
        var textVoices = [];
        if (selected) {
            textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.selected));
        } else {
            textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.deselected));
        }
        speak(textVoices);
    };

    presenter.readContent = function() {
        var textVoices = [];
        if(presenter.configuration.mode == "ALL_SELECTABLE") {
            textVoices = presenter.getSectionsTextVoices(presenter.$view);
        } else if(presenter.areAllPhrasesSingleWord) {
            textVoices = presenter.getWordsTextVoices(presenter.$view);
        } else {
            textVoices = presenter.getPhrasesTextVoices(presenter.$view);
        }
        speak(textVoices);

    };

    presenter.getWordsTextVoices = function($element) {
        var $clone = $element.clone();
        $clone.find('.selectable').each(function(){
            var $this = $(this);

            if ($this.hasClass('selected')) {
                $this.html(SPLIT + $this.html() + SPLIT + SELECTED + SPLIT);
            }
            if ($this.hasClass('correct-answer')) {
                $this.html(SPLIT + $this.html() + SPLIT + SELECTED + SPLIT);
            } else if ($this.hasClass('wrong')) {
                $this.html(SPLIT + $this.html() + SPLIT + WRONG + SPLIT);
            } else if ($this.hasClass('correct')) {
                $this.html(SPLIT + $this.html() + SPLIT + CORRECT + SPLIT);
            }
        });

        var textArray = presenter.getTextFromElementWithAltTexts($clone).split(SPLIT);

        var textVoices = [];

        for(var i = 0; i < textArray.length; i++) {
            if(textArray[i].trim().length == 0) continue;
            if (0 === textArray[i].localeCompare(SELECTED)) {
                textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.selected));
            } else if (0 === textArray[i].localeCompare(CORRECT)) {
                textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.correct));
            } else if (0 === textArray[i].localeCompare(WRONG)) {
                textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.wrong));
            } else {
                textVoices.push(window.TTSUtils.getTextVoiceObject(textArray[i], presenter.configuration.langTag));
            }
        }

        return textVoices;
    };

    presenter.getPhrasesTextVoices = function($element) {
        var $clone = $element.clone();

        $clone.find('.selectable').each(function(index){
            var $this = $(this);
            $this.html(SPLIT + PHRASE + ' ' + (index+1) + SPLIT + $this.html() + SPLIT + PHRASE_END + SPLIT );

            if ($this.hasClass('selected')) {
                $this.html($this.html() + SELECTED + SPLIT);
            }
            if ($this.hasClass('correct-answer')) {
                $this.html($this.html() + SELECTED + SPLIT);
            } else if ($this.hasClass('wrong')) {
                $this.html($this.html() + WRONG + SPLIT);
            } else if ($this.hasClass('correct')) {
                $this.html($this.html() + CORRECT + SPLIT);
            }
        });

        var textArray = presenter.getTextFromElementWithAltTexts($clone).split(SPLIT);

        var textVoices = [];

        for(var i = 0; i < textArray.length; i++) {
            if(textArray[i].trim().length == 0) continue;
            if (-1 !== textArray[i].indexOf(PHRASE)) {
                textVoices.push(window.TTSUtils.getTextVoiceObject(textArray[i].replace(PHRASE, presenter.speechTexts.phrase)));
            } else if (0 === textArray[i].localeCompare(PHRASE_END)) {
                textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.phraseEnd));
            } else if (0 === textArray[i].localeCompare(SELECTED)) {
                textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.selected));
            } else if (0 === textArray[i].localeCompare(CORRECT)) {
                textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.correct));
            } else if (0 === textArray[i].localeCompare(WRONG)) {
                textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.wrong));
            } else {
                textVoices.push(window.TTSUtils.getTextVoiceObject(textArray[i], presenter.configuration.langTag));
            }
        }

        return textVoices;
    };

    function setSectionWrappingText($el, start_text, end_text) {
        var $parent = $el.closest('.addon_Text_Selection  span[aria-label]:has(span[aria-hidden="true"])');
        if($parent!=null && $parent.length > 0){
          $el = $parent;
        }
        $el.before($('<span>' + start_text + '</span>'));
        $el.after($('<span>' + end_text + '</span>'));
    }

    presenter.getSectionsTextVoices = function($element) {

        var $clone = $element.clone();

        $clone.find('.selectable').each(function(){
            var $this = $(this);

            if ($this.hasClass('correct-answer')) {
                setSectionWrappingText($(this), SELECTED_SECTION_START, SELECTED_SECTION_END);
            } else if ($this.hasClass('wrong')) {
                setSectionWrappingText($(this), WRONG_SECTION_START, WRONG_SECTION_END);
            } else if ($this.hasClass('correct')) {
                setSectionWrappingText($(this), CORRECT_SECTION_START, CORRECT_SECTION_END);
            } else if ($this.hasClass('selected')) {
                setSectionWrappingText($(this), SELECTED_SECTION_START, SELECTED_SECTION_END);
            }
        });

        var contentText = presenter.getTextFromElementWithAltTexts($clone);

        contentText = replaceAll(contentText, SELECTED_SECTION_END + '([^\\w\\d]*)' + SELECTED_SECTION_START, '$1');
        contentText = replaceAll(contentText, CORRECT_SECTION_END + '([^\\w\\d]*)' + CORRECT_SECTION_START, '$1');
        contentText = replaceAll(contentText, WRONG_SECTION_END + '([^\\w\\d]*)' + WRONG_SECTION_START, '$1');

        contentText = replaceAll(contentText, SELECTED_SECTION_START, SPLIT + SELECTED_SECTION_START + SPLIT);
        contentText = replaceAll(contentText, SELECTED_SECTION_END, SPLIT + SELECTED_SECTION_END + SPLIT);
        contentText = replaceAll(contentText, CORRECT_SECTION_START, SPLIT + SELECTED_SECTION_START + SPLIT);
        contentText = replaceAll(contentText, CORRECT_SECTION_END, SPLIT + SELECTED_SECTION_END + SPLIT + CORRECT + SPLIT);
        contentText = replaceAll(contentText, WRONG_SECTION_START, SPLIT + SELECTED_SECTION_START + SPLIT);
        contentText = replaceAll(contentText, WRONG_SECTION_END, SPLIT + SELECTED_SECTION_END + SPLIT + WRONG + SPLIT);

        var textArray = contentText.split(SPLIT);

        var textVoices = [];


        for(var i = 0; i < textArray.length; i++) {
            if(textArray[i].trim().length == 0) continue;
            if (0 === textArray[i].localeCompare(SELECTED_SECTION_START)) {
                textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.selectedSectionStart));
            } else if (0 === textArray[i].localeCompare(SELECTED_SECTION_END)) {
                textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.selectedSectionEnd));
            } else if (0 === textArray[i].localeCompare(CORRECT)) {
                textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.correct));
            } else if (0 === textArray[i].localeCompare(WRONG)) {
                textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.wrong));
            } else {
                textVoices.push(window.TTSUtils.getTextVoiceObject(textArray[i],presenter.configuration.langTag));
            }
        }

        return textVoices;

    };

    presenter.getTextFromElementWithAltTexts = function($element) {
        /*
        * This method assumes, that the only things requiring parsing are alt text elements!
        * Image alt attributes are only partially handled
        * */
        var text = '';
        var textVoices = window.TTSUtils.getTextVoiceArrayFromElement($element,presenter.configuration.langTag);
        for (var i = 0; i < textVoices.length; i++) {
            text += textVoices[i].text;
        }
        return text;
    };

    function replaceAll(source, search, replace) {
        return source.replace(new RegExp(search, 'g'), replace);
    }

    presenter.getTextToSpeechOrNull = function (playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    presenter.setWCAGStatus = function (isOn) {
        isWCAGOn = isOn;
        if (!isOn) {
            presenter._firstElementSwitch = true;
        }
    };

    function speak (data) {
        var tts = presenter.getTextToSpeechOrNull(presenter.playerController);

        if (tts && isWCAGOn) {
            tts.speak(data);
        }
    }

    /*
    * Return false if detected a \wrong or \correct tag within alt text, true otherwise
    * */
    presenter.vaildateTagsInAltText = function(text) {
        var correctMatch = text.match(/\\alt{[^}]*?\\correct.*?}/g) != null;
        var wrongMatch = text.match(/\\alt{[^}]*?\\wrong.*?}/g) != null;
        return !(correctMatch || wrongMatch);
    };

    /*
    * Return false if detected an alt text where visible text section contains more than one word, true otherwise
    * */
    presenter.validateSingleWordAltText = function(text) {
        var re = /\\alt{([^{}|]*?)\|[^{}|]*?}+/g; //Find all alt text elements
        do {
            var match = re.exec(text); //get the next match
            if(match && !isSingleWord(match[1])) {
                return false;
            }
        } while (match);
        return true;
    };

    function isSingleWord(text) {
        return !/[\s,.]/.test(text.trim());
    }

    presenter.detectMultipleWordPhrases = function(text) {
        var parsedText = window.TTSUtils.parsePreviewAltText(text);
        var regex_correct = /\\correct{([^}]*?)}/g;
        var regex_wrong = /\\wrong{([^}]*?)}/g;
        do {
            var match = regex_correct.exec(parsedText); //get the next match
            if(match && !isSingleWord(match[1])){
                return true;
            }
        } while (match);
        do {
            var match = regex_wrong.exec(parsedText); //get the next match
            if(match && !isSingleWord(match[1])){
                return true;
            }
        } while (match);
        return false;
    };

    return presenter;
}