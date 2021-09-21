function AddonHangman_create() {
    var presenter = function () {};
    var playerController = null;
    var eventBus;

    presenter.run = function (view, model) {
        presenter.presenterLogic(view, model, false);
        eventBus = playerController.getEventBus();

        eventBus.addEventListener('ShowAnswers', this);
        eventBus.addEventListener('HideAnswers', this);
    };

    presenter.createPreview = function (view, model) {
        presenter.presenterLogic(view, model, true);
    };

    presenter.setPlayerController = function(controller) {
        playerController = controller;
    };

    presenter.drawElements = function (phraseNumber) {
        var lettersInOrder = presenter.getLettersInOrder(presenter.configuration.phrases[phraseNumber].letters);
        presenter.configuration.lettersInCustomOrder = lettersInOrder;
        presenter.drawLetters(lettersInOrder);
        presenter.drawPhrase(presenter.$view.find('.hangman-phrase'), presenter.configuration.phrases[phraseNumber].phrase);
    };

    presenter.getLettersInOrder = function (letters) {
        if(presenter.configuration.isCustomKeyboardLettersOrderSet) {
            return presenter.changeLettersOrder(letters);
        }

        return letters;
    };

    presenter.getLettersFromKeyboardOrder = function (letters) {
        var lettersFromKeyboardOrder = [];

        presenter.configuration.keyboardLettersOrder.map(function (element) {
            if (letters.indexOf(element) != -1) {
                this.push(element);
            }
        }, lettersFromKeyboardOrder);

        return lettersFromKeyboardOrder
    };

    presenter.getRestOfLetters = function (orderedLetters, letters) {
        return orderedLetters.concat(letters.filter(function (element) {
            return this.indexOf(element) == -1;
        }, orderedLetters));
    };

    presenter.changeLettersOrder = function (letters) {
        var orderedLetters = presenter.getLettersFromKeyboardOrder(letters);
        return presenter.getRestOfLetters(orderedLetters, letters);
    };

    presenter.drawElementsAndAttachMouseHandlers = function (phraseNumber, isPreview) {
        presenter.drawElements(phraseNumber);

        if (isPreview) {
            presenter.showCorrect();
        } else {
            presenter.handleMouseActions();
        }
    };

    presenter.assignVariablesToPresenter = function (view, model) {
        presenter.$view = $(view);
        presenter.model = model;
        presenter.currentPhrase = 0;
        presenter.isVisible = ModelValidationUtils.validateBoolean(model['Is Visible']);
        presenter.isVisibleByDefault = presenter.isVisible;
        presenter.$phraseContainer = $(view).find('.hangman-phrase');
        presenter.$lettersContainer = $(view).find('.hangman-letters');
        presenter.isErrorCheckingMode = false;
        presenter.isActivity = !(ModelValidationUtils.validateBoolean(model['isNotActivity']));
    };

    presenter.upgradeModel = function (model) {
        return presenter.upgradeKeyboardLettersOrder(model);
    };

    presenter.upgradeKeyboardLettersOrder = function (model) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if(model["Keyboard Letters Order"] == undefined) {
            upgradedModel["Keyboard Letters Order"] = "";
        }

        return upgradedModel;
    };

    presenter.deleteCommands = function () {
        delete presenter.setState;
        delete presenter.getState;
        delete presenter.getScore;
        delete presenter.getMaxScore;
        delete presenter.reset;
        delete presenter.nextPhrase;
        delete presenter.previousPhrase;
        delete presenter.isAllOk;
    };

    presenter.presenterLogic = function (view, model, isPreview) {
        var upgradedModel = presenter.upgradeModel(model);

        presenter.configuration = presenter.sanitizeModel(upgradedModel);
        if (presenter.configuration.isError) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            presenter.deleteCommands();
            return;
        }

        presenter.assignVariablesToPresenter(view, model);
        presenter.drawElementsAndAttachMouseHandlers(0, isPreview);

        presenter.addMarkedLetter(isPreview);
    };

    presenter.ERROR_CODES = {
        'L_01': "Letters definition incorrect!",
        'W_01': "Words definition cannot be empty!",
        'W_02': "Words definition consist letters that are not specified!",
        'W_03': "You cannot type more than one exclamation mark next to each other!",
        'W_04': "Words definition cannot contain only exclemation marks!",
        'P_01': "At least one phrase must be specified!",
        'T_01': "Number possible mistakes incorrect!",
        'KLO_01': "Letters in property Keyboard Letters Order incorrect.",
        'KLO_02': "Letters cant duplicate in Keyboard Letters Order property."
    };

    presenter.DEFAULT_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
        'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    function returnErrorObject(errorCode) {
        return { isError: true, errorCode: errorCode };
    }

    presenter.isArrayWithLettersValid = function (arrayWithLetters) {
        for (var i = 0, length = arrayWithLetters.length; i < length; i++) {
            var letter = arrayWithLetters[i].toUpperCase().trim();
            if (letter) {
                if (letter.length > 1) {
                    return false;
                }
            }
        }

        return true;
    };

    /**
     Converts string representation of list to array. Additionally trims elements, upper cases them and
     removes duplicated entries.
     @method convertStringArray
     @param {String} letters string containing comma separated, single character elements (whitespaces allowed)
     @return {Array} converted and sorted (ascending) array
     */
    presenter.convertStringArray = function (letters) {
        if (ModelValidationUtils.isStringEmpty(letters)) return presenter.DEFAULT_LETTERS;

        var list = [];
        var lettersArray = letters.split(',');
        for (var i = 0, length = lettersArray.length; i < length; i++) {
            var letter = lettersArray[i].toUpperCase().trim();
            if (letter && list.indexOf(letter) === -1) {
                list.push(letter);
            }
        }

        return list.sort();
    };

    presenter.wordsMatchLetters = function(letters, words) {
        var wordsArray = words.split(' ');

        for (var i = 0; i < wordsArray.length; i++) {
            var word = wordsArray[i];

            for (var j = 0; j < word.length; j++) {
                if (letters.indexOf(word[j].toUpperCase()) === -1 && word[j] != '!')  return false;
            }
        }

        return true;
    };

    presenter.isCorrectCountOfEcxlamationMarks = function(letters, words) {
        var wordsArray = words.split(' ');

        for (var i = 0; i < wordsArray.length; i++) {
            var word = wordsArray[i];

            for (var j = 0; j < word.length; j++) {
                if (word[j] == '!' && word[j+1] == '!')  return false;
            }
        }

        return true;
    };

    presenter.isOnlyExclamationMark = function(letters, words) {
        var wordsArray = words.split(' ');

        for (var i = 0; i < wordsArray.length; i++) {
            var word = wordsArray[i];
            if(word == '!') return false;
        }

        return true;
    };

    presenter.sanitizePhrase = function (phrase) {
        if (ModelValidationUtils.isStringEmpty(phrase.trim())) return returnErrorObject('W_01');

        var phraseArray = [];
        var splittedPhrase = phrase.trim().split(' ');

        for (var i = 0; i < splittedPhrase.length; i++) {
            if (splittedPhrase[i]) {
                phraseArray.push(splittedPhrase[i].toUpperCase());
            }
        }

        return { isError: false, phrase: phraseArray };
    };

    presenter.sanitizePhrases = function(phrases) {
        if (ModelValidationUtils.isArrayEmpty(phrases)) {
            return returnErrorObject('P_01');
        }

        var sanitisedPhrases = [];

        for (var i = 0; i < phrases.length; i++) {
            if (!presenter.isArrayWithLettersValid(phrases[i].Letters.split(","))) return returnErrorObject('L_01');

            if (ModelValidationUtils.isStringEmpty(phrases[i].Phrase)) return returnErrorObject('W_01');

            var letters = presenter.convertStringArray(phrases[i].Letters);
            if (!presenter.wordsMatchLetters(letters, phrases[i].Phrase)) return returnErrorObject('W_02');
            if (!presenter.isCorrectCountOfEcxlamationMarks(letters, phrases[i].Phrase)) return returnErrorObject('W_03');
            if (!presenter.isOnlyExclamationMark(letters, phrases[i].Phrase)) return returnErrorObject('W_04');

            var sanitisedPhrase = presenter.sanitizePhrase(phrases[i].Phrase);
            if (sanitisedPhrase.isError) return sanitisedPhrase;

            sanitisedPhrases.push({
                letters: letters,
                phrase: sanitisedPhrase.phrase,
                errorCount: 0,
                selectedLetters: []
            });
        }

        return {isError: false, phrases: sanitisedPhrases };
    };

    presenter.validateTrialsCount = function (model) {
        var validatedInt = ModelValidationUtils.validatePositiveInteger(model['Possible mistakes']);
        if (!validatedInt.isValid) {
            return { isValid: false, errorCode: "T_01", isError: true};
        }

        return validatedInt;
    };

    presenter.sanitizeModel = function (model) {
        var sanitisedPhrases = presenter.sanitizePhrases(model.Phrases);

        if (sanitisedPhrases.isError) return sanitisedPhrases;

        var validatedTrialsCount = presenter.validateTrialsCount(model);
        if (!validatedTrialsCount.isValid) return validatedTrialsCount;

        var validatedKeyboardLettersOrder = presenter.validateKeyboardLettersOrder(model);
        if (validatedKeyboardLettersOrder.isError) {
            return validatedKeyboardLettersOrder;
        }

        return {
            isError: false,
            phrases: sanitisedPhrases.phrases,
            trialsCount: validatedTrialsCount.value,
            addonID: model.ID,
            keyboardLettersOrder: validatedKeyboardLettersOrder.value,
            isCustomKeyboardLettersOrderSet: validatedKeyboardLettersOrder.isCustomKeyboardLettersOrderSet,
            lettersInCustomOrder: []
        };
    };

    function isNotDuplicated(value) {
        return (this.filter(function (currentValue) {
                return (value == currentValue);
            }).length == 1
        );
    }

    presenter.validateKeyboardLettersOrder = function (model) {
        var keyboardLettersOrder = model["Keyboard Letters Order"];
        if (ModelValidationUtils.isStringEmpty(keyboardLettersOrder.trim())) {
            return {
                isError: false,
                value: [],
                isCustomKeyboardLettersOrderSet: false
            };
        }

        var preparedData = keyboardLettersOrder.split(",").map(function (element) {
            return element.trim().toUpperCase();
        });

        if (!presenter.isArrayWithLettersValid(preparedData)) {
            return returnErrorObject("KLO_01");
        }

        if (!preparedData.every(isNotDuplicated, preparedData)) {
            return returnErrorObject("KLO_02");
        }

        return {
            isError: false,
            value: preparedData,
            isCustomKeyboardLettersOrderSet: true
        };
    };

    function generateLetter() {
        var $element = $(document.createElement('div'));
        $element.addClass('hangman-letter');
        $element.text(' ');

        return $element;
    }

    function generateLetterWithText(letter) {
        var $element = generateLetter();
        $element.text(letter);

        return $element;
    }

    presenter.drawLetters = function (letters) {
        for (var i = 0; i < letters.length; i++) {
            presenter.$lettersContainer.append(generateLetterWithText(letters[i]));
        }
    };

    function generatePhraseWord(word) {
        var $element = $(document.createElement('div'));
        $element.addClass('hangman-phrase-word');

        for (var j = 0; j < word.length; j++) {
            var $letter;
            if(word[j].indexOf('!') > -1){
                var $elementLetter = $(document.createElement('div'));
                $elementLetter.addClass('hangman-letter');
                $elementLetter.text('!'+word[j+1]);
                $element.append($elementLetter);
            }else{
                $letter = generateLetter();
                $letter.addClass('empty');

                $element.append($letter);
            }
        }

        return $element;
    }

    presenter.drawPhrase = function ($container, phrase) {
        for (var i = 0; i < phrase.length; i++) {
            $container.append(generatePhraseWord(phrase[i]));
        }
    };

    presenter.disableRemainingLetters = function () {
        presenter.$lettersContainer.find('.hangman-letter').each(function (_, element) {
            if (!$(element).hasClass('selected')) {
                $(element).unbind('click');
            }
        });
    };

    presenter.unbindAttachedHandlers = function ($element) {
        $element.unbind('click');
        if (presenter.$phraseContainer.find('.hangman-letter.empty').length === 0) {
            presenter.disableRemainingLetters();
        }
    };
    presenter.onLetterSelectedAction = function (letter, currentPhrase, sendEventAndCountError) {
        var findResult = presenter.findLetterInPhrase(letter, currentPhrase.phrase);
        var selectionEventData;

        if (findResult.length === 0) {
            selectionEventData = presenter.createLetterSelectedEventData(letter, false);

            if (sendEventAndCountError) {
                currentPhrase.errorCount++;
            }
            if (currentPhrase.errorCount > presenter.configuration.trialsCount) {
                presenter.disableRemainingLetters();
            }
        } else {
            presenter.fillPhraseWithLetters(letter, findResult);
            selectionEventData = presenter.createLetterSelectedEventData(letter, true);
        }

        if (sendEventAndCountError) {
            presenter.sendEventData(selectionEventData);
            if (presenter.isAllOK() && presenter.isActivity) {
                presenter.sendAllOKEvent();
            }
        }
        if (currentPhrase.errorCount === presenter.configuration.trialsCount && presenter.isActivity && !currentPhrase.EndOfTrialsWasSent) {
            presenter.sendEventData(presenter.createEndOfTrialsEventData());
            currentPhrase.EndOfTrialsWasSent = true;
        } else if (currentPhrase.errorCount > presenter.configuration.trialsCount && presenter.isActivity && !currentPhrase.endOfGame) {
            presenter.sendEndOfGameEvent();
            currentPhrase.endOfGame = true;
        }

        presenter.unbindAttachedHandlers($(this));
    };

    presenter.sendEndOfGameEvent = function () {
        if (presenter.isShowAnswersActive) {
            return;
        }

        var eventData = presenter.createBaseEventData();

        eventData.value = 'EOG';
        eventData.score = '';

        presenter.sendEventData(eventData);
    };

    presenter.letterClickHandler = function (e) {
        if(presenter.isErrorCheckingMode){
            return;
        }

        e.stopPropagation();
        var sendEventAndCountError = !$(this).hasClass('selected');
        $(this).addClass('selected');
        var letter = $(this).text();

        var currentPhrase = presenter.configuration.phrases[presenter.currentPhrase];
        presenter.addLetterSelectionToPhrase(currentPhrase, letter);
        presenter.onLetterSelectedAction(letter, currentPhrase, sendEventAndCountError);
    };

    presenter.handleMouseActions = function () {
        var currentPhrase = presenter.configuration.phrases[presenter.currentPhrase];

        presenter.$lettersContainer.find('.hangman-letter').each(function (_, element) {
            var letter = $(element).text();

            if (!presenter.isLetterSelected(currentPhrase, letter)) {
                $(element).click(presenter.letterClickHandler);
            }
        });
    };

    presenter.findLetterInPhrase = function (letter, phrase) {
        var occurrence = [];

        for (var i = 0; i < phrase.length; i++) {
            for (var j = 0; j < phrase[i].length; j++) {
                if (phrase[i][j] === letter) {
                    occurrence.push({ word: i, index: j});
                }
            }
        }

        return occurrence;
    };

    presenter.fillPhraseWithLetters = function (letter, letterOccurrence) {
        var phrase = presenter.configuration.phrases[presenter.currentPhrase].phrase;

        for (var i = 0; i < letterOccurrence.length; i++) {
            var index = presenter.calculateLetterElementIndex(phrase, letterOccurrence[i]);

            var $letterElement = presenter.$phraseContainer.find('.hangman-letter:eq(' + index + ')');
            $letterElement.removeClass('empty');
            $letterElement.text(letter);
        }
    };

    presenter.calculateLetterElementIndex = function (phrase, occurrence) {
        var index = 0;

        for (var i = 0; i < occurrence.word; i++) {
            index += phrase[i].length;
        }

        return index + occurrence.index;
    };

    presenter.getIndexOfLetterInPhrase = function (phrase, letter) {
        var index = phrase.letters.indexOf(letter);

        if (presenter.configuration.isCustomKeyboardLettersOrderSet) {
            index = presenter.configuration.lettersInCustomOrder.indexOf(letter);
        }

        return index;
    };

    presenter.addLetterSelectionToPhrase = function (phrase, letter) {
        var index = presenter.getIndexOfLetterInPhrase(phrase, letter);

        phrase.selectedLetters.push(index);
    };

    presenter.isLetterSelected = function (phrase, letter) {
        var index = presenter.getIndexOfLetterInPhrase(phrase, letter);

        return phrase.selectedLetters.indexOf(index) !== -1;
    };

    presenter.showCorrect = function () {
        var currentPhrase = presenter.configuration.phrases[presenter.currentPhrase];
        var neededLetters = presenter.getNeededLetters(currentPhrase.phrase);
        var $letter;
        for (var i = 0; i < neededLetters.length; i++) {
            if(neededLetters[i].indexOf('!') > -1){
                $letter = $('<div>'+neededLetters[i]+'</div>');
                $letter.addClass('hangman-letter');
            }else{
                $letter = presenter.findLetterElement(neededLetters[i]);
            }

            if (!presenter.isLetterSelected(currentPhrase, neededLetters[i])) {
                $letter.addClass('selected');
                if (presenter.isErrorCheckingMode) {
                    if(!$letter.hasClass('hangman-tip')){
                        $letter.addClass('incorrect');
                    }
                }
                presenter.addLetterSelectionToPhrase(currentPhrase, $letter.text());
                presenter.onLetterSelectedAction(neededLetters[i], currentPhrase, false);
            } else if (presenter.isErrorCheckingMode) {
                if(!$letter.hasClass('hangman-tip')){
                    $letter.addClass('correct');
                }
            }
        }

        if (presenter.isErrorCheckingMode) {
            presenter.$lettersContainer.find('.hangman-letter.selected:not(.correct):not(.incorrect)').each(function (_, element) {
                if(!$(element).hasClass('hangman-tip')){
                    $(element).addClass('incorrect');
                }
            });
        }
    };

    presenter.showCorrectInSetShowErrorsMode = function () {
        var currentPhrase = presenter.configuration.phrases[presenter.currentPhrase];
        var neededLetters = presenter.getNeededLetters(currentPhrase.phrase);
        var $letter;
        for (var i = 0; i < neededLetters.length; i++) {
            if(neededLetters[i].indexOf('!') > -1){
                $letter = $('<div>'+neededLetters[i]+'</div>');
                $letter.addClass('hangman-letter');
            }else{
                $letter = presenter.findLetterElement(neededLetters[i]);
            }

            if (presenter.isLetterSelected(currentPhrase, neededLetters[i])) {
                if(!$letter.hasClass('hangman-tip')){
                    $letter.addClass('correct');
                }
            }
        }

        presenter.$lettersContainer.find('.hangman-letter.selected:not(.correct):not(.incorrect)').each(function (_, element) {
            if(!$(element).hasClass('hangman-tip')){
                $(element).addClass('incorrect');
            }
        });
    };

    presenter.findLetterElement = function (letter) {
        var $letters = presenter.$lettersContainer.find('.hangman-letter');

        for (var i = 0; i < $letters.length; i++) {
            if ($($letters[i]).text() === letter)  return $($letters[i]);
        }
    };

    presenter.getNeededLetters = function (phrase) {
        var letters = [];
        for (var i = 0; i < phrase.length; i++) {
            for (var j = 0; j < phrase[i].length; j++) {
                if (letters.indexOf(phrase[i][j]) === -1) {
                    if(phrase[i][j] == '!'){
                        letters.push('!' + phrase[i][j+1]);
                    }else{
                        letters.push(phrase[i][j]);
                    }
                }
            }
        }

        return letters;
    };

    presenter.nextPhrase = function () {
        presenter.switchPhrase(presenter.currentPhrase + 2);
    };

    presenter.previousPhrase = function () {
        presenter.switchPhrase(presenter.currentPhrase);
    };

    presenter.switchPhraseCommand = function (params) {
        var phraseNumber = parseInt(params[0], 10);

        if (isNaN(phraseNumber) || phraseNumber <= 0 || phraseNumber > presenter.configuration.phrases.length) {
            return;
        }

        presenter.removeChildrenElements(presenter.$phraseContainer);
        presenter.removeChildrenElements(presenter.$lettersContainer);

        presenter.currentPhrase = phraseNumber - 1;
        presenter.drawElementsAndAttachMouseHandlers(phraseNumber - 1, false);
        presenter.applySelection();

        presenter.addMarkedLetter(false);
    };

    presenter.switchPhrase = function (phraseNumber) {
        presenter.switchPhraseCommand([phraseNumber]);
    };

    presenter.applySelection = function () {
        var currentPhrase = presenter.configuration.phrases[presenter.currentPhrase];

        for (var i = 0; i < currentPhrase.selectedLetters.length; i++) {
            var $letter = presenter.$lettersContainer.find('.hangman-letter:eq(' + currentPhrase.selectedLetters[i] + ')');
            $letter.addClass('selected');
            presenter.onLetterSelectedAction($letter.text(), currentPhrase, false);
        }
    };

    presenter.executeCommand = function (name, params) {
        if (presenter.isErrorCheckingMode) {
            return;
        }

        var commands = {
            'showCorrect': presenter.showCorrect,
            'nextPhrase': presenter.nextPhrase,
            'previousPhrase': presenter.previousPhrase,
            'switchPhrase': presenter.switchPhraseCommand,
            'show': presenter.show,
            'hide': presenter.hide,
            'isAllOK': presenter.isAllOK
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.removeChildrenElements = function ($element) {
        $element.children().each(function (_, element) {
            $(element).remove();
        });
    };

    presenter.reset = function () {
        var phrases = presenter.configuration.phrases;

        for (var i = 0; i < phrases.length; i++) {
            phrases[i].selectedLetters = [];
            phrases[i].errorCount = 0;
            phrases[i].endOfGame = false;
        }

        presenter.switchPhrase(1);
        presenter.isVisible = presenter.isVisibleByDefault;
        presenter.setVisibility(presenter.isVisible);
        presenter.addMarkedLetter(false);
        presenter.isErrorCheckingMode = false;
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

    presenter.getState = function () {
        if(presenter.isShowAnswersActive){
            presenter.hideAnswers();
        }

        return JSON.stringify({
            currentPhrase: presenter.currentPhrase,
            phrases: presenter.configuration.phrases
        });
    };

    presenter.upgradeStateForEndOfGame = function (parsedState) {
        if (parsedState.endOfGame == undefined) {
            parsedState.endOfGame = false;
        }

        return parsedState;
    };

    presenter.upgradeState = function (parsedState) {
        return presenter.upgradeStateForEndOfGame(parsedState);
    };

    presenter.addMarkedLetter = function (isPreview) {
        presenter.$view.find('.hangman-letter:contains(!)').next().css('display', 'none');
        var exclamationLetters = [];

        if(!isPreview){
            presenter.$view.find('.hangman-letter:contains(!)').each(function(_, element) {
                var text = $(this).text();
                var correctText = text.substring(1,2);
                exclamationLetters.push(correctText);
                $(element).text(correctText);
            });

            for(var i = 0; i< presenter.configuration.phrases[presenter.currentPhrase].letters.length; i++){
                var merge = presenter.configuration.phrases[presenter.currentPhrase].phrase.join(),
                    letter = presenter.configuration.phrases[presenter.currentPhrase].letters[i],
                    count = merge.split(letter).length - 1,
                    exclMerge = exclamationLetters.join(),
                    exclCount = exclMerge.split(letter).length - 1;

                if(count == exclCount && count > 0 && exclCount > 0){
                    var $letter = presenter.$view.find('.hangman-letters').find('.hangman-letter:contains('+letter+')');
                    $letter.addClass('selected');
                    $letter.addClass('hangman-tip');
                    presenter.addLetterSelectionToPhrase(presenter.configuration.phrases[presenter.currentPhrase], $letter.text());
                }
            }
        }
    };

    presenter.setState = function (stringifiedState) {
        var state = JSON.parse(stringifiedState);
        var upgradedState = presenter.upgradeState(state);

        var phrases = presenter.configuration.phrases;

        for (var i = 0; i < phrases.length; i++) {
            phrases[i].selectedLetters = upgradedState.phrases[i].selectedLetters;
            phrases[i].errorCount = upgradedState.phrases[i].errorCount;
            phrases[i].endOfGame = upgradedState.phrases[i].endOfGame;
        }

        presenter.switchPhrase(upgradedState.currentPhrase + 1);

        presenter.addMarkedLetter(false)
    };

    presenter.getMaxScore = function () {
        if(presenter.isActivity){
            return presenter.configuration.phrases.length;
        }else{
            return 0;
        }
    };

    presenter.isSelectionSufficient = function (neededLetters, selectedLetters) {
        if (selectedLetters.length < neededLetters.length) return false;

        var sortedNeededLetters = neededLetters.sort();
        var sortedSelectedLetters = selectedLetters.sort();

        for (var i = 0; i < sortedNeededLetters.length; i++) {
            if (sortedSelectedLetters.indexOf(sortedNeededLetters[i]) === -1) return false;
        }

        return true;
    };

    presenter.getLettersIndexesForScoring = function (neededLetters, phrase) {
        var neededLettersIndexes = [];

        if (presenter.configuration.isCustomKeyboardLettersOrderSet) {
            neededLetters.map(function (element) {
                var index = presenter.configuration.lettersInCustomOrder.indexOf(element);
                neededLettersIndexes.push(index);
            }, neededLettersIndexes);

            return neededLettersIndexes
        } else {

            for (var j = 0; j < neededLetters.length; j++) {
                neededLettersIndexes.push(phrase.letters.indexOf(neededLetters[j]));
            }

            return neededLettersIndexes;
        }

    };

    presenter.getScoring = function (phrases) {
        var neededLetters = [], neededLettersIndexes = [];
        var score = 0, errors = 0;

        for (var i = 0; i < phrases.length; i++) {
            neededLetters = presenter.getNeededLetters(phrases[i].phrase);

            for(var k = neededLetters.length; k--;){
                if (neededLetters[k].indexOf('!') > -1) neededLetters.splice(k, 1);
            }

            neededLettersIndexes = presenter.getLettersIndexesForScoring(neededLetters, phrases[i]);

            if (presenter.isSelectionSufficient(neededLettersIndexes, phrases[i].selectedLetters)) {
                score++;
            } else {
                errors++;
            }
        }

        return { score: score, errors: errors };
    };

    presenter.getPhraseForScoring = function () {
        if (presenter.isErrorCheckingMode || presenter.isShowAnswersActive) {
            return JSON.parse(presenter.workModeState).phrases;
        } else {
            return presenter.configuration.phrases;
        }
    };

    presenter.isSomethingSelected = function () {
        return presenter.$view.find('.selected').length > 0;
    };

    presenter.getScore = function () {
        if(presenter.isActivity){
            var phrases = presenter.getPhraseForScoring();
            return presenter.getScoring(phrases).score;
        }else{
            return 0;
        }
    };

    presenter.getErrorCount = function () {
        if(presenter.isActivity && presenter.isSomethingSelected()){
            var phrases = presenter.getPhraseForScoring();
            return presenter.getScoring(phrases).errors;
        }else{
            return 0;
        }
    };

    presenter.setShowErrorsMode = function () {
        if(presenter.isShowAnswersActive){
            presenter.hideAnswers();
        }

        presenter.isErrorCheckingMode = true;
        if(presenter.isActivity){
            presenter.workModeState = presenter.getState();
            presenter.showCorrectInSetShowErrorsMode();
        }
    };

    presenter.setWorkMode = function () {
        presenter.isErrorCheckingMode = false;
        if(presenter.isActivity){
            presenter.setState(presenter.workModeState);
        }
    };

    presenter.createBaseEventData = function () {
        return {
            source: presenter.configuration.addonID,
            item: "" + (presenter.currentPhrase + 1),
            value: "",
            score: ""
        };
    };

    presenter.createEndOfTrialsEventData = function () {
        var eventData = presenter.createBaseEventData();

        eventData.value = 'EOT';
        eventData.score = '';

        return eventData;
    };

    presenter.createLetterSelectedEventData = function (letter, isCorrect) {
        var eventData = presenter.createBaseEventData();

        eventData.value = "" + letter;
        eventData.score = isCorrect ? "1" : "0";

        return eventData;
    };

    presenter.sendEventData = function (eventData) {
        if (playerController !== null) {
            playerController.getEventBus().sendEvent('ValueChanged', eventData);
        }
    };

    presenter.isAllOK = function () {
        return presenter.getMaxScore() === presenter.getScore();
    };

    presenter.createAllOKEventData = function (){
        return{
            'source': presenter.configuration.addonID,
            'item': 'all',
            'value': '',
            'score': ''
        }
    };

    presenter.sendAllOKEvent = function (){
        eventBus.sendEvent('ValueChanged', presenter.createAllOKEventData());
    };

    presenter.onEventReceived = function (eventName) {
        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        }

        if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        }
    };

    presenter.showCorrectSA = function () {
        var currentPhrase = presenter.configuration.phrases[presenter.currentPhrase];
        var neededLetters = presenter.getNeededLetters(currentPhrase.phrase);
        var $letter;
        for (var i = 0; i < neededLetters.length; i++) {
            if(neededLetters[i].indexOf('!') > -1){
                $letter = $('<div>'+neededLetters[i]+'</div>');
                $letter.addClass('hangman-letter');
            }else{
                $letter = presenter.findLetterElement(neededLetters[i]);
            }
            $letter.addClass('show-answers');
            presenter.addLetterSelectionToPhrase(currentPhrase, $letter.text());
            presenter.onLetterSelectedAction(neededLetters[i], currentPhrase, false);
        }
    };

    presenter.showAnswers = function () {
        if(!presenter.isActivity){
            return;
        }

        presenter.isShowAnswersActive = true;
        if(presenter.isErrorCheckingMode){
            presenter.setWorkMode();
        }

        presenter.workModeState = JSON.stringify({
            currentPhrase: presenter.currentPhrase,
            phrases: presenter.configuration.phrases
        });
        presenter.$view.find('.hangman-letter').each(function (){
            if($(this).hasClass('selected')){
                $(this).removeClass('selected');
            }
        });

        presenter.showCorrectSA();
    };

    presenter.hideAnswers = function () {
        if(!presenter.isActivity || !presenter.isShowAnswersActive) {
            return;
        }
        presenter.setState(presenter.workModeState);
        presenter.isShowAnswersActive = false;
    };

    return presenter;
}