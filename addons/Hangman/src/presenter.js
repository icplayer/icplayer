function AddonHangman_create() {
    var presenter = function () {};
    var playerController = null;

    presenter.run = function (view, model) {
        presenter.presenterLogic(view, model, false);
    };

    presenter.createPreview = function (view, model) {
        presenter.presenterLogic(view, model, true);
    };

    presenter.setPlayerController = function(controller) {
        playerController = controller;
    };

    presenter.drawElements = function (phraseNumber) {
        presenter.drawLetters(presenter.configuration.phrases[phraseNumber].letters);
        presenter.drawPhrase(presenter.$view.find('.hangman-phrase'), presenter.configuration.phrases[phraseNumber].phrase);
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
    };

    presenter.presenterLogic = function (view, model, isPreview) {
        presenter.configuration = presenter.sanitizeModel(model);
        if (presenter.configuration.isError) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        presenter.assignVariablesToPresenter(view, model);
        presenter.drawElementsAndAttachMouseHandlers(0, isPreview);
    };

    presenter.ERROR_CODES = {
        'L_01': "Letters definition incorrect!",
        'W_01': "Words definition cannot be empty!",
        'W_02': "Words definition consist letters that are not specified!",
        'P_01': "At least one phrase must be specified!",
        'T_01': "Number possible mistakes incorrect!"
    };

    presenter.DEFAULT_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
        'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    function returnErrorObject(errorCode) {
        return { isError: true, errorCode: errorCode };
    }

    presenter.isStringArrayValid = function (list) {
        var splittedList = list.split(',');
        for (var i = 0, length = splittedList.length; i < length; i++) {
            var letter = splittedList[i].toUpperCase().trim();
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
                if (letters.indexOf(word[j].toUpperCase()) === -1)  return false;
            }
        }

        return true;
    };

    presenter.sanitizePhrase = function (phrase) {
        if (ModelValidationUtils.isStringEmpty(phrase)) return returnErrorObject('W_01');

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
            if (!presenter.isStringArrayValid(phrases[i].Letters)) return returnErrorObject('L_01');

            if (ModelValidationUtils.isStringEmpty(phrases[i].Phrase)) return returnErrorObject('W_01');

            var letters = presenter.convertStringArray(phrases[i].Letters);
            if (!presenter.wordsMatchLetters(letters, phrases[i].Phrase)) return returnErrorObject('W_02');

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

    presenter.sanitizeModel = function (model) {
        var sanitisedPhrases = presenter.sanitizePhrases(model.Phrases);

        if (sanitisedPhrases.isError) return sanitisedPhrases;

        var trialsCount = ModelValidationUtils.validatePositiveInteger(model['Possible mistakes']);
        if (!trialsCount.isValid) return returnErrorObject('T_01');

        return {
            isError: false,
            phrases: sanitisedPhrases.phrases,
            trialsCount: trialsCount.value,
            addonID: model.ID
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
            var $letter = generateLetter();
            $letter.addClass('empty');

            $element.append($letter);
        }

        return $element;
    }

    presenter.drawPhrase = function ($container, phrase) {
        for (var i = 0; i < phrase.length; i++) {
            $container.append(generatePhraseWord(phrase[i]));
        }
    };

    presenter.disableRemainingLetters = function () {
        presenter.$lettersContainer.find('.hangman-letter').each(function () {
            if (!$(this).hasClass('selected')) {
                $(this).unbind('click');
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
        }
        if (currentPhrase.errorCount === presenter.configuration.trialsCount) {
            presenter.sendEventData(presenter.createEndOfTrialsEventData());
        }
        presenter.unbindAttachedHandlers($(this));
    };

    function letterClickHandler(e) {
        e.stopPropagation();
        $(this).addClass('selected');
        var letter = $(this).text();

        var currentPhrase = presenter.configuration.phrases[presenter.currentPhrase];
        presenter.addLetterSelectionToPhrase(currentPhrase, letter);
        presenter.onLetterSelectedAction(letter, currentPhrase, true);
    }

    presenter.handleMouseActions = function () {
        var currentPhrase = presenter.configuration.phrases[presenter.currentPhrase];

        presenter.$lettersContainer.find('.hangman-letter').each(function () {
            var letter = $(this).text();

            if (!presenter.isLetterSelected(currentPhrase, letter)) {
                $(this).click(letterClickHandler);
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

    presenter.addLetterSelectionToPhrase = function (phrase, letter) {
        var index = phrase.letters.indexOf(letter);
        phrase.selectedLetters.push(index);
    };

    presenter.isLetterSelected = function (phrase, letter) {
        var index = phrase.letters.indexOf(letter);

        return phrase.selectedLetters.indexOf(index) !== -1;
    };

    presenter.showCorrect = function () {
        var currentPhrase = presenter.configuration.phrases[presenter.currentPhrase];
        var neededLetters = presenter.getNeededLetters(currentPhrase.phrase);

        for (var i = 0; i < neededLetters.length; i++) {
            var $letter = presenter.findLetterElement(neededLetters[i]);

            if (!presenter.isLetterSelected(currentPhrase, neededLetters[i])) {
                $letter.addClass('selected');
                if (presenter.isErrorCheckingMode) {
                    $letter.addClass('incorrect');
                }
                presenter.addLetterSelectionToPhrase(currentPhrase, $letter.text());
                presenter.onLetterSelectedAction(neededLetters[i], currentPhrase, false);
            } else if (presenter.isErrorCheckingMode) {
                $letter.addClass('correct');
            }
        }

        if (presenter.isErrorCheckingMode) {
            presenter.$lettersContainer.find('.hangman-letter.selected:not(.correct):not(.incorrect)').each(function () {
                $(this).addClass('incorrect');
            });
        }
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
                    letters.push(phrase[i][j]);
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
            'hide': presenter.hide
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.removeChildrenElements = function ($element) {
        $element.children().each(function () {
            $(this).remove();
        });
    };

    presenter.reset = function () {
        var phrases = presenter.configuration.phrases;

        for (var i = 0; i < phrases.length; i++) {
            phrases[i].selectedLetters = [];
            phrases[i].errorCount = 0;
        }

        presenter.switchPhrase(1);
        presenter.isVisible = presenter.isVisibleByDefault;
        presenter.setVisibility(presenter.isVisible);
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
        return JSON.stringify({
            currentPhrase: presenter.currentPhrase,
            phrases: presenter.configuration.phrases
        });
    };

    presenter.setState = function (stringifiedState) {
        var state = JSON.parse(stringifiedState);
        var phrases = presenter.configuration.phrases;

        for (var i = 0; i < phrases.length; i++) {
            phrases[i].selectedLetters = state.phrases[i].selectedLetters;
            phrases[i].errorCount = state.phrases[i].errorCount;
        }

        presenter.switchPhrase(state.currentPhrase + 1);
    };

    presenter.getMaxScore = function () {
        return presenter.configuration.phrases.length;
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

    presenter.getScoring = function (phrases) {
        var neededLetters = [], neededLettersIndexes = [];
        var score = 0, errors = 0;

        for (var i = 0; i < phrases.length; i++) {
            neededLetters = presenter.getNeededLetters(phrases[i].phrase);

            neededLettersIndexes = [];
            for (var j = 0; j < neededLetters.length; j++) {
                neededLettersIndexes.push(phrases[i].letters.indexOf(neededLetters[j]));
            }

            if (presenter.isSelectionSufficient(neededLettersIndexes, phrases[i].selectedLetters)) {
                score++;
            } else {
                errors++;
            }
        }

        return { score: score, errors: errors };
    };

    presenter.getPhraseForScoring = function () {
        if (presenter.isErrorCheckingMode) {
            return JSON.parse(presenter.workModeState).phrases;
        } else {
            return presenter.configuration.phrases;
        }
    };

    presenter.getScore = function () {
        var phrases = presenter.getPhraseForScoring();
        return presenter.getScoring(phrases).score;
    };

    presenter.getErrorsCount = function () {
        var phrases = presenter.getPhraseForScoring();
        return presenter.getScoring(phrases).errors;
    };

    presenter.setShowErrorsMode = function () {
        presenter.isErrorCheckingMode = true;
        presenter.workModeState = presenter.getState();
        presenter.showCorrect();
    };

    presenter.setWorkMode = function () {
        presenter.isErrorCheckingMode = false;
        presenter.setState(presenter.workModeState);
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

    return presenter;
}