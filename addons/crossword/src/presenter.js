function Addoncrossword_create(){
    var presenter = function() {};

    var playerController;
    var eventBus;
    var originalFieldValue = "";

    presenter.ID               = null;
    presenter.$view            = null;
    presenter.crossword        = null;

    presenter.rowCount         = null;
    presenter.columnCount      = null;
    presenter.cellHeight       = null;
    presenter.cellWidth        = null;
    presenter.maxScore         = null;
    presenter.isVisible        = true;
    presenter.showAllAnswersInGradualShowAnswersMode;
    presenter.isGradualShowAnswersActive = false;
    presenter.blankCellsBorderStyle  = "solid";
    presenter.blankCellsBorderWidth  = 0;
    presenter.blankCellsBorderColor  = "transparent";
    presenter.letterCellsBorderStyle = "solid";
    presenter.letterCellsBorderWidth = 0;
    presenter.letterCellsBorderColor = "transparent";
    presenter.wordNumbersHorizontal = false;
    presenter.wordNumbersVertical = false;
    presenter.disableAutomaticWordNumbering = false;
    presenter.blockWrongAnswers = false;
    presenter.markedColumnIndex = 0;
    presenter.markedRowIndex = 0;
    presenter.maxTabIndex = 0;
    presenter.areUserAnswersSaved = false;
    presenter.correctAnswers = [];

    presenter.printableController = null;
    presenter.printableState = null;
    presenter.printableStateMode = null;
    presenter.GSAcounter = null;

    var enableMoveToNextField = false;

    const DIRECTIONS = {
        NOT_SET: 0,
        HORIZONTAL: 1,
        VERTICAL: 2,
        TAB_INDEX: 3,
        NEXT_VERTICAL_ANSWER: 4
    }
    var currentDirection = DIRECTIONS.NOT_SET;

    const AUTO_NAVIGATION_OPTIONS = {
        OFF: 0,
        SIMPLE: 1,
        EXTENDED: 2
    }
    var autoNavigationMode = null;

    presenter.SPECIAL_KEYS = {
        BACKSPACE: 8,
        TAB: 9,
        ENTER: 13,
        SHIFT: 16,
        CTRL: 17,
        ESCAPE: 27,
        LEFT_ARROW: 37,
        UP_ARROW: 38,
        RIGHT_ARROW: 39,
        DOWN_ARROW: 40,
        DELETE: 46,
    };

    presenter.numberOfConstantLetters = 0;

    presenter.ERROR_MESSAGES = {
        ROWS_NOT_SPECIFIED:                          "Amount of rows is not specified",
        COLUMNS_NOT_SPECIFIED:                       "Amount of columns is not specified",
        INVALID_MARKED_COLUMN_INDEX:                 "Marked column index cannot be negative, use 0 to disable",
        INVALID_MARKED_ROW_INDEX:                    "Marked row index cannot be negative, use 0 to disable",
        CELL_WIDTH_NOT_SPECIFIED:                    "Cell width is not specified",
        CELL_HEIGHT_NOT_SPECIFIED:                   "Cell height is not specified",
        INVALID_BLANK_CELLS_BORDER_WIDTH:            "Blank cells border width must be greater on equal to 0",
        INVALID_LETTER_CELLS_BORDER_WIDTH:           "Letter cells border width must be greater on equal to 0",
        INVALID_AMOUNT_OF_ROWS_IN_CROSSWORD:         "Amount of lines (that act as rows) in the specified Crossword is different that amount of rows you have specified in Properties",
        INVALID_AMOUNT_OF_COLUMNS_IN_CROSSWORD:      "Amount of characters (that act as columns) in row %row% of specified Crossword is different that amount of columns you have specified in Properties",
        DOUBLED_EXCLAMATION_MARK:                    "You cannot type 2 exclamation marks in a row",
        LAST_CHARACTER_EXCLAMATION_MARK:             "You cannot type exclamation mark at the end of line",
        EXCLAMATION_MARK_BEFORE_EMPTY_FIELD:         "You cannot type exclamation mark before empty field",
        NOT_SUPPORTED_SELECTED_AUTO_NAVIGATION_MODE: "Selected auto navigation mode is not supported"
    };

    presenter.VALIDATION_MODE = {
        COUNT_SCORE: 0,
        SHOW_ERRORS: 1,
        CHECK_ANSWERS: 2
    };

    presenter.isModelValid = true;

    presenter.isWCAGOn = false;
    presenter.keyboardControllerObject = null;

    presenter.DEFAULT_TTS_PHRASES = {
        CELL: "cell",
        ACROSS: "across",
        DOWN: "down",
        CORRECT: "correct",
        WRONG: "wrong",
        EMPTY: "empty",
        DISABLED: "disabled",
        OUT_OFF: "out of",
    };

    presenter.CSS_CLASSES = {
        CELL: 'cell',
        CELL_BLANK: 'cell_blank',
        CELL_LETTER: "cell_letter",
        CELL_VALID: "cell_valid",
        CELL_INVALID: "cell_invalid",
        PRINTABLE: "printable",
        PRINTABLE_ADDON: "printable_addon_crossword",
        PRINTABLE_CELL_LETTER_CONTENT: "printable_cell_letter_content",
        PRINTABLE_SIGN_VALID: "printable_sign_valid",
        PRINTABLE_SIGN_INVALID: "printable_sign_invalid",
        PRINTABLE_CELL_VALID: "printable_cell_valid",
        PRINTABLE_CELL_INVALID: "printable_cell_invalid",
    };

    presenter.PRINTABLE_STATE_MODE = {
        EMPTY: 0,
        SHOW_ANSWERS: 1,
        SHOW_USER_ANSWERS: 2,
        CHECK_ANSWERS: 3
    };

    presenter.showErrorMessage = function(message, substitutions) {
        var errorContainer;
        if(typeof(substitutions) == 'undefined') {
            errorContainer = '<p>' + message + '</p>';
        } else {
            var messageSubst = message;
            for (var key in substitutions) {
                messageSubst = messageSubst.replace('%' + key + '%', substitutions[key]);
            }
            errorContainer = '<p>' + messageSubst + '</p>';
        }

        presenter.$view.html(errorContainer);
    };

    presenter.prepareGrid = function(model) {
        const elementPath = "div." + (isInPrintableStateMode() ? presenter.CSS_CLASSES.PRINTABLE + "_" : "") + "crossword_container";
        presenter.tabIndexBase = ($(elementPath).length * 5000) + 5000;
        presenter.maxScore = 0;
        presenter.crossword = [];

        var rows = model['Crossword'].split("\n");
        for(var i = 0; i < presenter.rowCount; i++) {
            var r = [];
            var numberOfExclamationMarks = rows[i].match(/!/g) == null ? 0 : rows[i].match(/!/g).length;
            presenter.numberOfConstantLetters += numberOfExclamationMarks;
            for(var j = 0; j < presenter.columnCount + numberOfExclamationMarks; j++) {
                if (rows[i][j] === '!') {
                    j++;
                    r.push('!' + rows[i][j].toUpperCase());
                } else {
                    r.push(rows[i][j].toUpperCase());
                }
            }

            presenter.crossword.push(r);
        }
    };

    presenter.isAnswerVisibleByDefault = function (answer) {
        return (answer.match(/!/g) || []).length * 2 === answer.length;
    }

    presenter.prepareAnswerHorizontal = function (row, column) {
        const position = { x: column, y: row };
        let answer = "";
        for(let i = column; i < presenter.columnCount; i++){
            if (presenter.crossword[row][i] == ' ') {
                break;
            }
            answer = answer + presenter.crossword[row][i];
        }
        let answerData = {
            answer,
            position,
            isHorizontal: true
        };
        if (!presenter.isAnswerVisibleByDefault(answer))
            presenter.correctAnswers.push(answerData);
    }

    presenter.prepareAnswerVertical = function (row, column) {
        const position = { x: column, y: row };
        let answer = "";
        for (let i = row; i < presenter.rowCount; i++){
            if (presenter.crossword[i][column] == ' '){
                break;
            }
            answer = answer + presenter.crossword[i][column];
        }
        let answerData = {
            answer,
            position,
            isHorizontal: false
        };
        if (!presenter.isAnswerVisibleByDefault(answer))
            presenter.correctAnswers.push(answerData);
    }

    presenter.prepareCorrectAnswers = function() {
        presenter.correctAnswers = [];

        for (let row = 0; row < presenter.rowCount; row++) {
            for (let column = 0; column < presenter.columnCount; column++){
                if(presenter.isHorizontalWordBegin(row, column)){
                    presenter.prepareAnswerHorizontal(row, column);
                }
                if(presenter.isVerticalWordBegin(row, column)){
                    presenter.prepareAnswerVertical(row, column);
                }
            }
        }
    }

    presenter.isHorizontalWordBegin = function(i, j) {
        if(!presenter.wordNumbersHorizontal) {
            return false;
        }

        return (
            // Skip empty cells
            presenter.crossword[i][j] != ' ' &&

                // We don't have a letter on the left
                (j === 0 ||  presenter.crossword[i][j-1] == ' ') &&

                // We do have a letter on the right
                (presenter.columnCount > j+1 && presenter.crossword[i][j+1] != ' '));
    };

    presenter.isVerticalWordBegin = function(i, j) {
        if(!presenter.wordNumbersVertical) {
            return false;
        }

        return (
            // Skip empty cells
            presenter.crossword[i][j] != ' ' &&

                // We don't have a letter above
                (i === 0 ||  presenter.crossword[i-1][j] == ' ') &&

                // We do have a letter below
                (presenter.rowCount > i+1 && presenter.crossword[i+1][j] != ' '));
    };

    function getPositionOfCellInputElement($cellInput) {
        return presenter.getPosition($cellInput.parent(''));
    }

    presenter.getPosition = function($elem) {
        function getPositionFrom(classes, dim) {
            return classes.reduce(function(res, currentElem) {
                return res === null ? currentElem.match(new RegExp(dim + "(\\d+)")) : res;
            }, null)[1];
        }

        var classes = $elem.attr('class').split(' ');

        return {
            x: parseInt(getPositionFrom(classes, 'cell_column_'), 10),
            y: parseInt(getPositionFrom(classes, 'cell_row_'), 10)
        }
    };

    var dictValues = function(dict) {
        var values = [];
        var keys = Object.keys(dict);
        keys.filter(function(key){
            values.push(dict[key])
        });
        return values;
    };

    presenter.SPECIAL_KEYS_CODES = dictValues(presenter.SPECIAL_KEYS);

    var validateSpecialKey = function(event) {
        if (presenter.SPECIAL_KEYS_CODES.indexOf(event.keyCode) > -1 ||
            // Allow: dot
            (event.keyCode == 190) ||
            // Allow: Ctrl+A
            (event.keyCode == 65 && event.ctrlKey === true) ||
            // Allow: end and home
            (event.keyCode >= 35 && event.keyCode <= 36)) {
            // let it happen, don't do anything
            return true;
        }
        return false;
    };

    presenter.onCellInputKeyDown = function(event) {
        if (event.keyCode === presenter.SPECIAL_KEYS.ENTER) {
            return;
        }

        if ([
            presenter.SPECIAL_KEYS.BACKSPACE,
            presenter.SPECIAL_KEYS.LEFT_ARROW,
            presenter.SPECIAL_KEYS.RIGHT_ARROW,
            presenter.SPECIAL_KEYS.UP_ARROW,
            presenter.SPECIAL_KEYS.DOWN_ARROW,
            presenter.SPECIAL_KEYS.TAB,
        ].includes(event.keyCode)) {
            presenter.keyboardController(event.keyCode, event.shiftKey, event);
            return;
        }

        var $cellInput = $(event.target);
        if (originalFieldValue.length == 0) {
            originalFieldValue = $cellInput.val();
        }

        if (validateSpecialKey(event)) {
            return
        }

        $cellInput.css('color', 'rgba(0,0,0,0.0)');
        enableMoveToNextField = true;
    };

    presenter.onCellInputKeyUp = function(event) {
        var cellInput = event.target;
        var $cellInput = $(cellInput);
        $cellInput.css('color','');

        if (validateSpecialKey(event)) {
            return
        }

        if ($cellInput.val().length > 1 && originalFieldValue.length > 0) {
            $cellInput.val($cellInput.val().replace(originalFieldValue,''));
        }
        originalFieldValue = '';

        cellInput.value = cellInput.value.toUpperCase();

        if (presenter.blockWrongAnswers) {
            var isCorrectValue
                = presenter.validateIsCorrectValueInCellInput(cellInput);
            if (!isCorrectValue) {
                presenter.keyboardControllerObject.speakWrong();
                enableMoveToNextField = false;
            }
        }

        if ($cellInput.val() && enableMoveToNextField) {
            handleAutoNavigationMove(cellInput);
        }
    };

    presenter.onCellInputFocus = function(event) {
        event.target.select();
        var length = $(event.target).val().length;
        setCaretPosition(event.target, length + 1);
        if(length > 1) {
            $(event.target).val($(event.target).val().substring(1, 2));
        }
        $(event.target).val($(event.target).val().toUpperCase());
    };
 
    presenter.onCellInputMouseUp = function(event) {
        event.preventDefault();
    };

    presenter.onCellInputFocusOut = function(event) {
        var cellInput = event.target;
        var usersLetter = cellInput.value;
        var pos = getPositionOfCellInputElement($(cellInput));
        var correctLetter = presenter.crossword[pos.y][pos.x][0];
        var isOk = usersLetter === correctLetter;
        presenter.sendScoreEvent(pos, usersLetter, isOk);
        var score = isOk ? 1 : 0;
        if(score == 0 && presenter.blockWrongAnswers){
            cellInput.value = "";
        }
        if (isOk) {
            const result = presenter.validateWord(pos);
            const isLetterInVerticalWord = result.verticalResult ?
                presenter.letterIsInWord(result.verticalResult.start, result.verticalResult.end, pos) : false;
            const isLetterInHorizontalWord = result.horizontalResult ?
                presenter.letterIsInWord(result.horizontalResult.start, result.horizontalResult.end, pos) : false;

            if (result.horizontalResult && isLetterInHorizontalWord) {
                presenter.sendCorrectWordEvent(result.horizontalResult.word, result.horizontalResult.item);
            }
            if (result.verticalResult && isLetterInVerticalWord) {
                presenter.sendCorrectWordEvent(result.verticalResult.word, result.verticalResult.item);
            }
        }
    };

    presenter.letterIsInWord = function (startPoint, endPoints, letterPosition) {
        const startCoordinates = startPoint.split(':');
        const endCoordinates = endPoints.split(':');
        const isInXAxis = +startCoordinates[0] <= letterPosition.x && +endCoordinates[0] >= letterPosition.x;
        const isInYAxis = +startCoordinates[1] <= letterPosition.y && +endCoordinates[1] >= letterPosition.y;

        return isInXAxis && isInYAxis;
    };

    presenter.onCellClick = function(event) {
        presenter.resetDirection();
        event.stopPropagation();
    };

    function handleAutoNavigationMove(currentCellInput) {
        enableMoveToNextField = false;

        if (!presenter.isAutoNavigationInOffMode()) {
            presenter.analyzeDirectionOfMove(currentCellInput);
            presenter.updateDirectionOfMoveRelativeToAutoNavigationMode();
            presenter.moveInCurrentDirection(currentCellInput);
        }
    }

    presenter.validateIsCorrectValueInCellInput = function (currentCellInput) {
        var $currentCellInput = $(currentCellInput);
        var usersLetter = currentCellInput.value[0];
        var currentPosition = getPositionOfCellInputElement($currentCellInput);

        var correctLetter = presenter.crossword[currentPosition.y][currentPosition.x][0];
        if (usersLetter !== correctLetter) {
            presenter.sendScoreEvent(currentPosition, usersLetter, false);
            currentCellInput.value = '';
            return false;
        }
        return true;
    };

    presenter.isWordNumbersCorrect = function () {
        return presenter.wordNumbersHorizontal || presenter.wordNumbersVertical;
    }

    presenter.isWordOrientationOnlyHorizontal = function () {
        return presenter.wordNumbersHorizontal && !presenter.wordNumbersVertical;
    }

    presenter.isWordOrientationOnlyVertical = function () {
        return presenter.wordNumbersVertical && !presenter.wordNumbersHorizontal;
    }

    presenter.getWordBeginCellAtColumn = function (i) {
        return presenter.$view.find(`.cell_word_begin_vertical.cell_column_${i}`);
    }

    presenter.findNextColumn = function (currentPosition) {
        const nextColumnIndex = currentPosition.x + 1;

        for (let i = nextColumnIndex; i <= presenter.columnCount; i++) {
            const $nextColumnWordBeginCell = presenter.getWordBeginCellAtColumn(i);

            if ($nextColumnWordBeginCell.length) {
                const position = presenter.getPosition($nextColumnWordBeginCell);
                if (isAnyOfBottomCellsEditable(position)) {
                    position.y =- 1;
                    return getNextBottomCellPosition(position);
                }
            }
        }
    }

    presenter.updateDirectionBasedOnWordOrientation = function () {
        if (presenter.isWordOrientationOnlyHorizontal()) {
            presenter.setHorizontalDirection();
        } else if (presenter.isWordOrientationOnlyVertical()) {
            presenter.setVerticalDirection();
        }
    }

    presenter.analyzeDirectionOfMove = function (currentCellInput) {
        var $currentCellInput = $(currentCellInput);
        var currentPosition = getPositionOfCellInputElement($currentCellInput);

        var rightElementPosition = calculateRightElementPosition(currentPosition);
        var isRightCellNotBlank = isPositionOfNotBlankCell(rightElementPosition);
        var rightCellsEditable = isAnyOfRightCellsEditable(currentPosition);

        var bottomElementPosition = calculateBottomElementPosition(currentPosition);
        var isBottomCellNotBlank = isPositionOfNotBlankCell(bottomElementPosition);
        var bottomCellsEditable = isAnyOfBottomCellsEditable(currentPosition);

        var topElementPosition = calculateTopElementPosition(currentPosition);
        var isTopCellNotBlank = isPositionOfNotBlankCell(topElementPosition);

        presenter.updateDirectionBasedOnWordOrientation();

        if (presenter.isHorizontalDirection()) {
            if (!rightCellsEditable) {
                presenter.setTabIndexDirection();
            }
            return;
        }
        if (presenter.isVerticalDirection()) {
            if (!bottomCellsEditable) {
                if (presenter.isWordOrientationOnlyVertical()) {
                    presenter.setNextVerticalAnswerDirection();
                } else {
                    presenter.setTabIndexDirection();
                }
            }
            return;
        }

        var rightCellInput = getCellInput(rightElementPosition);
        var bottomCellInput = getCellInput(bottomElementPosition);

        if (bottomCellsEditable && !isRightCellNotBlank) {
            presenter.setVerticalDirection();
        } else if (rightCellsEditable && !isTopCellNotBlank && !isBottomCellNotBlank) {
            presenter.setHorizontalDirection();
        } else if (bottomCellsEditable && !isTopCellNotBlank && isRightCellNotBlank) {
            presenter.setVerticalDirection();
        } else if (bottomCellsEditable
            && (isRightCellNotBlank && !isCellInputElementEmpty(rightCellInput))
            && (isBottomCellNotBlank && isCellInputElementEmpty(bottomCellInput))) {
            presenter.setVerticalDirection();
        } else if (rightCellsEditable) {
            presenter.setHorizontalDirection();
        } else {
            presenter.setTabIndexDirection();
        }
    };

    function isAnyOfRightCellsEditable(position) {
        return !!getNextRightCellPosition(position);
    }

    function getNextRightCellPositionOfCellInput(cellInput, includeConstantCells = false) {
        const position = getPositionOfCellInputElement($(cellInput));
        return getNextRightCellPosition(position, includeConstantCells);
    }

    function getNextRightCellPosition(position, includeConstantCells = false) {
        const nextYPosition = position.y;
        var nextPosition;
        for (var nextXPosition = position.x + 1; nextXPosition < presenter.columnCount; nextXPosition++) {
            nextPosition = {y: nextYPosition, x: nextXPosition};
            var isNextCellNotBlank = isPositionOfNotBlankCell(nextPosition);
            if (isNextCellNotBlank) {
                if (includeConstantCells || !isPositionOfConstantCell(nextPosition)) {
                    return nextPosition;
                }
            } else {
                return;
            }
        }
    }

    function isAnyOfLeftCellsEditable(position) {
        return !!getNextLeftCellPosition(position);
    }

    function getNextLeftCellPositionOfCellInput(cellInput, includeConstantCells = false) {
        const position = getPositionOfCellInputElement($(cellInput));
        return getNextLeftCellPosition(position, includeConstantCells);
    }

    function getNextLeftCellPosition(position, includeConstantCells = false) {
        const nextYPosition = position.y;
        var nextPosition;
        for (var nextXPosition = position.x - 1; nextXPosition >= 0; nextXPosition--) {
            nextPosition = {y: nextYPosition, x: nextXPosition};
            var isNextCellNotBlank = isPositionOfNotBlankCell(nextPosition);
            if (isNextCellNotBlank) {
                if (includeConstantCells || !isPositionOfConstantCell(nextPosition)) {
                    return nextPosition;
                }
            } else {
                return;
            }
        }
    }

    function isAnyOfBottomCellsEditable(position) {
        return !!getNextBottomCellPosition(position);
    }

    function getNextBottomCellPositionOfCellInput(cellInput, includeConstantCells = false) {
        const position = getPositionOfCellInputElement($(cellInput));
        return getNextBottomCellPosition(position, includeConstantCells);
    }

    function getNextBottomCellPosition(position, includeConstantCells = false) {
        const nextXPosition = position.x;
        var nextPosition;
        for (var nextYPosition = position.y + 1; nextYPosition < presenter.rowCount; nextYPosition++) {
            nextPosition = {y: nextYPosition, x: nextXPosition};
            var isNextCellNotBlank = isPositionOfNotBlankCell(nextPosition);
            if (isNextCellNotBlank) {
                if (includeConstantCells || !isPositionOfConstantCell(nextPosition)) {
                    return nextPosition;
                }
            } else {
                if (!presenter.isNextVerticalAnswerDirection())
                    return;
            }
        }
    }

    function isAnyOfTopCellsEditable(position) {
        return !!getNextTopCellPosition(position);
    }

    function getNextTopCellPositionOfCellInput(cellInput, includeConstantCells = false) {
        const position = getPositionOfCellInputElement($(cellInput));
        return getNextTopCellPosition(position, includeConstantCells);
    }

    function getNextTopCellPosition(position, includeConstantCells = false) {
        const nextXPosition = position.x;
        var nextPosition;
        for (var nextYPosition = position.y - 1; nextYPosition >= 0; nextYPosition--) {
            nextPosition = {y: nextYPosition, x: nextXPosition};
            var isNextCellNotBlank = isPositionOfNotBlankCell(nextPosition);
            if (isNextCellNotBlank) {
                if (includeConstantCells || !isPositionOfConstantCell(nextPosition)) {
                    return nextPosition;
                }
            } else {
                return;
            }
        }
    }

    function getNextTabIndexEditableCellPositionOfCellInput(cellInput) {
        const newTabIndex = cellInput.tabIndex + 1;
        return getPositionOfCellInputElementWithTabIndex(newTabIndex);
    }

    function getPreviousTabIndexEditableCellPositionOfCellInput(cellInput) {
        const newTabIndex = cellInput.tabIndex - 1;
        return getPositionOfCellInputElementWithTabIndex(newTabIndex);
    }

    function getPositionOfCellInputElementWithTabIndex(tabIndex) {
        if (tabIndex < presenter.tabIndexBase || tabIndex >= presenter.maxTabIndex) {
            return;
        }

        var newCellInputElement = findCellInputElement(tabIndex);
        var newPosition = getPositionOfCellInputElement($(newCellInputElement));
        if (!isPositionValid(newPosition)) {
            return;
        }

        return newPosition;
    }

    function findCellInputElement(tabIndex) {
        return presenter.$view.find('[tabindex=' + tabIndex + ']');
    }

    presenter.updateDirectionOfMoveRelativeToAutoNavigationMode = function () {
        if (!presenter.isDirectionNotSet()
            && (presenter.isAutoNavigationInOffMode()
                || (presenter.isAutoNavigationInSimpleMode()
                    && (presenter.isTabIndexDirection()
                        || presenter.isNextVerticalAnswerDirection())))) {
            presenter.resetDirection();
        }
    }

    presenter.moveInCurrentDirection = function (currentCellInput) {
        if (presenter.isHorizontalDirection()) {
            moveInHorizontalDirection(currentCellInput);
        } else if (presenter.isVerticalDirection()) {
            moveInVerticalDirection(currentCellInput);
        } else if (presenter.isTabIndexDirection()) {
            moveInTabIndexDirection(currentCellInput);
        }  else if (presenter.isNextVerticalAnswerDirection()) {
            moveToNextVerticalAnswer(currentCellInput);
        }
    };

    function moveInVerticalDirection(startingCellInput) {
        const customEvent = createKeyboardNavigationEventForMove(startingCellInput);
        moveToNextBottomCellInput(customEvent);
    }

    function moveInHorizontalDirection(startingCellInput) {
        const customEvent = createKeyboardNavigationEventForMove(startingCellInput);
        moveToNextRightCellInput(customEvent);
    }

    function moveInTabIndexDirection(startingCellInput) {
        const customEvent = createKeyboardNavigationEventForMove(startingCellInput);
        moveToNextEditableTabIndexCellInput(customEvent);
    }

    function createKeyboardNavigationEventForMove(cellInput) {
        return {
            target: cellInput,
            preventDefault: function () {},
            stopPropagation: function () {},
        };
    }

    function focusCellInputUsingPosition(nextPosition) {
        $(getCellInput(nextPosition)).focus();
    }

    function moveToNextVerticalAnswer(currentCellInput) {
        const currentPosition = getPositionOfCellInputElement($(currentCellInput));
        const nextCellPosition = presenter.findNextColumn(currentPosition);
        if (!!nextCellPosition) {
            const nextCellInput = getCellInput(nextCellPosition);
            $(nextCellInput).focus();
        } else {
            blurCellInput(currentCellInput);
        }
    }

    function blurCellInput(cellInput) {
        $(cellInput).blur();
    }

    function calculateLeftElementPosition(oldPosition) {
        return {y: oldPosition.y, x: oldPosition.x - 1};
    }

    function calculateRightElementPosition(oldPosition) {
        return {y: oldPosition.y, x: oldPosition.x + 1};
    }

    function calculateTopElementPosition(oldPosition) {
        return {y: oldPosition.y - 1, x: oldPosition.x};
    }

    function calculateBottomElementPosition(oldPosition) {
        return {y: oldPosition.y + 1, x: oldPosition.x};
    }

    function isCellInputElementEmpty(element) {
        return !element.value;
    }

    function isPositionOfConstantCell(position) {
        if (!isPositionValid(position)) {
            return false;
        }
        return _isPositionOfConstantCell(position);
    }

    function _isPositionOfConstantCell(position) {
        return presenter.crossword[position.y][position.x][0].includes('!');
    }

    function isPositionOfNotBlankCell(position) {
        if (!isPositionValid(position)) {
            return false;
        }
        return _isPositionOfNotBlankCell(position);
    }

    function _isPositionOfNotBlankCell(position) {
        return presenter.crossword[position.y][position.x][0] !== ' ';
    }

    function getCellInput(position) {
        if (!isPositionValid(position)) {
            return;
        }
        return presenter.$view.find(`.cell_row_${position.y}.cell_column_${position.x}`).find("input")[0];
    }

    function getElementInput(element) {
        return $(element).find("input")[0];
    }

    function isPositionValid(position) {
        return !!position
            && position.y >= 0 && position.y < presenter.rowCount
            && position.x >= 0 && position.x < presenter.columnCount;
    }

    presenter.isDirectionNotSet = function () {
        return currentDirection === DIRECTIONS.NOT_SET;
    }

    presenter.isHorizontalDirection = function () {
        return currentDirection === DIRECTIONS.HORIZONTAL;
    }

    presenter.isVerticalDirection = function () {
        return currentDirection === DIRECTIONS.VERTICAL;
    }

    presenter.isTabIndexDirection = function () {
        return currentDirection === DIRECTIONS.TAB_INDEX;
    }

    presenter.isNextVerticalAnswerDirection = function () {
        return currentDirection === DIRECTIONS.NEXT_VERTICAL_ANSWER;
    }

    presenter.resetDirection = function () {
        currentDirection = DIRECTIONS.NOT_SET;
    }

    presenter.setHorizontalDirection = function () {
        currentDirection = DIRECTIONS.HORIZONTAL;
    }

    presenter.setVerticalDirection = function () {
        currentDirection = DIRECTIONS.VERTICAL;
    }

    presenter.setNextVerticalAnswerDirection = function () {
        currentDirection = DIRECTIONS.NEXT_VERTICAL_ANSWER
    }

    presenter.setTabIndexDirection = function () {
        currentDirection = DIRECTIONS.TAB_INDEX;
    }

    function setCaretPosition(elem, caretPos) {
        var range;

        if (elem.createTextRange) {
            range = elem.createTextRange();
            range.move('character', caretPos);
            range.select();
        } else {
            elem.focus();
            if (elem.selectionStart !== undefined) {
                elem.setSelectionRange(caretPos, caretPos);
            }
        }
    }

    presenter.createGrid = function() {
        var wordNumberCounter = 1;

        var gridContainer = $('<div></div>');
        addClass(gridContainer, "crossword_container");
        let containerWidth = presenter.columnCount * presenter.cellWidth;
        let containerHeight = presenter.rowCount * presenter.cellHeight;
        let containerMarginLeft = Math.round(presenter.columnCount * presenter.cellWidth / 2);
        let containerMarginTop = Math.round(presenter.rowCount * presenter.cellHeight / 2);
        if (isInPrintableStateMode()) {
            gridContainer.css({
                width: containerWidth + 'px',
                height: containerHeight + 'px',
            });
        } else {
            gridContainer.css({
                width: containerWidth + 'px',
                height: containerHeight + 'px',
                marginLeft: -1 * containerMarginLeft + 'px',
                marginTop: -1 * containerMarginTop + 'px'
            });
        }

        var tabIndexOffset = 0;
        for(var i = 0; i < presenter.rowCount; i++) {
            for(var j = 0; j < presenter.columnCount; j++) {
                var cellContainer = $('<div></div>');
                addClass(cellContainer, "cell_container");
                cellContainer.css({ width:  presenter.cellWidth + 'px',
                    height: presenter.cellHeight + 'px' });

                var cell = $('<div></div>');
                addClass(cell, "cell");
                addClass(cell, 'cell_' + i + 'x' + j);
                addClass(cell, 'cell_row_' + i);
                addClass(cell, 'cell_column_' + j);

                if (presenter.markedRowIndex > 0 && presenter.markedRowIndex == i+1) {
                    addClass(cell, "cell_row_marked");
                }

                if (presenter.markedColumnIndex > 0 && presenter.markedColumnIndex == j+1) {
                    addClass(cell, "cell_column_marked");
                }

                cellContainer.append(cell);
                if (presenter.crossword[i][j] == ' ') {
                    addClass(cell, "cell_blank");
                    addClass(cellContainer, "cell_container_blank");
                } else {
                    addClass(cell, "cell_letter");
                    addClass(cellContainer, "cell_container_letter");

                    var input = $('<input type="text" maxlength="2" size="1"/>');

                    if (presenter.crossword[i][j][0] === '!') {
                        input
                            .val(presenter.crossword[i][j][1])
                            .prop('disabled', true);

                        addClass(cell, "cell_constant_letter");
                        cell.addClass("");
                    } else if (!isInPrintableStateMode()){
                        input
                            .attr('tabIndex', presenter.tabIndexBase + tabIndexOffset++)
                            .keyup(presenter.onCellInputKeyUp)
                            .keydown(presenter.onCellInputKeyDown)
                            .focus(presenter.onCellInputFocus)
                            .mouseup(presenter.onCellInputMouseUp)
                            .focusout(presenter.onCellInputFocusOut)
                            .click(presenter.onCellClick);
                    } else {
                        input
                            .prop('disabled', true)
                            .attr('tabIndex', presenter.tabIndexBase + tabIndexOffset++);
                    }

                    if(presenter.preview) {
                        input.attr({
                            value: presenter.crossword[i][j].toUpperCase(),
                            disabled: true
                        });
                    }

                    cell.append(input);

                    var horizontalWordBegin = presenter.isHorizontalWordBegin(i, j);
                    var verticalWordBegin = presenter.isVerticalWordBegin(i, j);

                    if (horizontalWordBegin) presenter.maxScore++;
                    if (verticalWordBegin) presenter.maxScore++;

                    if (horizontalWordBegin || verticalWordBegin) {
                        addClass(cell, "cell_word_begin");

                        if (horizontalWordBegin)
                            addClass(cell, "cell_word_begin_horizontal");

                        if (verticalWordBegin)
                            addClass(cell, "cell_word_begin_vertical");

                        if (!presenter.disableAutomaticWordNumbering) {
                            const sanitizedText = window.xssUtils.sanitize(wordNumberCounter++);
                            const wordNumber = $('<div></div>').html(sanitizedText);
                            addClass(wordNumber, "word_number");

                            cell.append(wordNumber);
                        }
                    }
                }

                presenter.maxTabIndex = presenter.tabIndexBase + tabIndexOffset;

                // Cell borders
                var borderStyle;
                var borderWidth;
                var borderColor;

                if(presenter.crossword[i][j] != ' ') {
                    borderStyle = presenter.letterCellsBorderStyle;
                    borderWidth = presenter.letterCellsBorderWidth;
                    borderColor = presenter.letterCellsBorderColor;

                } else {
                    borderStyle = presenter.blankCellsBorderStyle;
                    borderWidth = presenter.blankCellsBorderWidth;
                    borderColor = presenter.blankCellsBorderColor;
                }

                if(i === 0 || presenter.crossword[i-1][j] == ' ') { // Outer top border
                    cell.css({ borderTopStyle: borderStyle,
                        borderTopWidth: (borderWidth * 2) + 'px',
                        borderTopColor: borderColor,
                        top:            (borderWidth * -1) + 'px' });
                } else { // Inner top border
                    cell.css({ borderTopStyle: borderStyle,
                        borderTopWidth: borderWidth + 'px',
                        borderTopColor: borderColor });
                }

                if(i === presenter.rowCount - 1 || presenter.crossword[i+1][j] == ' ') { // Outer bottom border
                    cell.css({ borderBottomStyle: borderStyle,
                        borderBottomWidth: (borderWidth * 2) + 'px',
                        borderBottomColor: borderColor,
                        bottom:            (borderWidth * -1) + 'px' });
                } else { // Inner bottom border
                    cell.css({ borderBottomStyle: borderStyle,
                        borderBottomWidth: borderWidth + 'px',
                        borderBottomColor: borderColor });
                }

                if(j === 0 || presenter.crossword[i][j-1] == ' ') { // Outer left border
                    cell.css({ borderLeftStyle: borderStyle,
                        borderLeftWidth: (borderWidth * 2) + 'px',
                        borderLeftColor: borderColor,
                        left:            (borderWidth * -1) + 'px' });
                } else { // Inner left border
                    cell.css({ borderLeftStyle: borderStyle,
                        borderLeftWidth: borderWidth + 'px',
                        borderLeftColor: borderColor });
                }

                if(j === presenter.columnCount - 1 || presenter.crossword[i][j+1] == ' ') { // Outer right border
                    cell.css({ borderRightStyle: borderStyle,
                        borderRightWidth: (borderWidth * 2) + 'px',
                        borderRightColor: borderColor,
                        right:            (borderWidth * -1) + 'px' });
                } else { // Inner right border
                    cell.css({ borderRightStyle: borderStyle,
                        borderRightWidth: borderWidth + 'px',
                        borderRightColor: borderColor });
                }

                // Additional classes
                if(j == 0) {
                    addClass(cell, "cell_first_in_row");
                } else if(j == presenter.columnCount - 1) {
                    addClass(cell, "cell_last_in_row");
                }

                if(i == 0) {
                    addClass(cell, "cell_first_in_column");
                } else if(i == presenter.rowCount - 1) {
                    addClass(cell, "cell_last_in_column");
                }

                gridContainer.append(cellContainer);
            }
        }

        presenter.updateMaxScore();
        presenter.$view.append(gridContainer);
    };

    function returnErrorMessage(errorMessage, errorMessageSubstitutions) {
        return {
            isError: true,
            errorMessage: errorMessage,
            errorMessageSubstitutions: errorMessageSubstitutions
        }
    }

    presenter.updateMaxScore = function () {
        presenter.maxScore -= presenter.getNumberOfExampleWords();
    }

    presenter.getNumberOfExampleWords = function () {
        let exampleWordsCounter = 0;
        for (let i = 0; i < presenter.rowCount; i++) {
            for (let j = 0; j < presenter.columnCount; j++) {
                if (presenter.isHorizontalWordBegin(i, j)) {
                    let exampleLettersCounter = 0;
                    let letterCounter = 0;

                    for (let k = j; k < presenter.columnCount; k++) {
                        if (presenter.crossword[i][k] === ' ') {
                            break;
                        }

                        if (presenter.crossword[i][k].match('![a-zA-Z]*?')) {
                            exampleLettersCounter++;
                        }
                        letterCounter++;
                    }

                    if (letterCounter === exampleLettersCounter) {
                        exampleWordsCounter++;
                    }
                }

                if (presenter.isVerticalWordBegin(i, j)) {
                    let exampleLettersCounter = 0;
                    let letterCounter = 0;

                    for (let k = i; k < presenter.rowCount; k++) {
                        if (presenter.crossword[k][j] === ' ') {
                            break;
                        }

                        if (presenter.crossword[k][j].match('![a-zA-Z]*?')) {
                            exampleLettersCounter++;
                        }
                        letterCounter++;
                    }

                    if (letterCounter === exampleLettersCounter) {
                        exampleWordsCounter++;
                    }
                }
            }
        }

        return exampleWordsCounter;
    }

    presenter.readConfiguration = function(model) {
        if(typeof(model['Blank cells border color']) != "undefined" && model['Blank cells border color'] !== "")
            presenter.blankCellsBorderColor = model['Blank cells border color'];

        if(typeof(model['Blank cells border width']) != "undefined" && model['Blank cells border width'] !== "")
            presenter.blankCellsBorderWidth = parseInt(model['Blank cells border width']);

        if(typeof(model['Blank cells border style']) != "undefined" && model['Blank cells border style'] !== "")
            presenter.blankCellsBorderStyle = model['Blank cells border style'];

        if(typeof(model['Letter cells border color']) != "undefined" && model['Letter cells border color'] !== "")
            presenter.letterCellsBorderColor = model['Letter cells border color'];

        if(typeof(model['Letter cells border width']) != "undefined" && model['Letter cells border width'] !== "")
            presenter.letterCellsBorderWidth = parseInt(model['Letter cells border width']);

        if(typeof(model['Letter cells border style']) != "undefined" && model['Letter cells border style'] !== "")
            presenter.letterCellsBorderStyle = model['Letter cells border style'];

        if(typeof(model['Word numbers']) != "undefined") {
            if(model['Word numbers'] == "horizontal" || model['Word numbers'] == "both" || model['Word numbers'] === "")
                presenter.wordNumbersHorizontal = true;

            if(model['Word numbers'] == "vertical" || model['Word numbers'] == "both" || model['Word numbers'] === "")
                presenter.wordNumbersVertical = true;
        }

        if(typeof(model['Marked column index']) != "undefined" && model['Marked column index'] !== "") {
            presenter.markedColumnIndex = parseInt(model['Marked column index']);
            if(presenter.markedColumnIndex < 0) {
                return returnErrorMessage(presenter.ERROR_MESSAGES.INVALID_MARKED_COLUMN_INDEX)
            }
        }

        if(typeof(model['Marked row index']) != "undefined" && model['Marked row index'] !== "") {
            presenter.markedRowIndex = parseInt(model['Marked row index']);
            if(presenter.markedRowIndex < 0) {
                return returnErrorMessage(presenter.ERROR_MESSAGES.INVALID_MARKED_ROW_INDEX);
            }
        }

        presenter.disableAutomaticWordNumbering = model['Disable automatic word numberin'] == 'True';

        if(presenter.blankCellsBorderWidth < 0) {
            return returnErrorMessage(presenter.ERROR_MESSAGES.INVALID_BLANK_CELLS_BORDER_WIDTH);
        }

        if(presenter.letterCellsBorderWidth < 0) {
            return returnErrorMessage(presenter.ERROR_MESSAGES.INVALID_LETTER_CELLS_BORDER_WIDTH);
        }

        if(parseInt(model['Columns']) <= 0 || isNaN(parseInt(model['Columns'])) ) {
            return returnErrorMessage(presenter.ERROR_MESSAGES.COLUMNS_NOT_SPECIFIED);
        }

        if(parseInt(model['Rows']) <= 0 || isNaN(parseInt(model['Rows']))) {
            return returnErrorMessage(presenter.ERROR_MESSAGES.ROWS_NOT_SPECIFIED);
        }

        if(parseInt(model['Cell width']) <= 0 || isNaN(parseInt(model['Cell width'])) ) {
            return returnErrorMessage(presenter.ERROR_MESSAGES.CELL_WIDTH_NOT_SPECIFIED);
        }

        if(parseInt(model['Cell height']) <= 0 || isNaN(parseInt(model['Cell height']))) {
            return returnErrorMessage(presenter.ERROR_MESSAGES.CELL_HEIGHT_NOT_SPECIFIED);
        }

        presenter.rowCount        = parseInt(model['Rows']);
        presenter.columnCount     = parseInt(model['Columns']);
        presenter.cellWidth       = parseInt(model['Cell width']);
        presenter.cellHeight      = parseInt(model['Cell height']);

        var rows = model['Crossword'].split("\n");
        if(rows.length != presenter.rowCount) {
            return returnErrorMessage(presenter.ERROR_MESSAGES.INVALID_AMOUNT_OF_ROWS_IN_CROSSWORD);
        }

        for(var i = 0; i < rows.length; i++) {
            if(rows[i].replace(/!/g, "").length != presenter.columnCount) {
                return returnErrorMessage(presenter.ERROR_MESSAGES.INVALID_AMOUNT_OF_COLUMNS_IN_CROSSWORD, { row : i + 1 });
            }

            var line = rows[i];
            var previous = line[0];

            if (line.slice(-1) === '!') {
                return returnErrorMessage(presenter.ERROR_MESSAGES.LAST_CHARACTER_EXCLAMATION_MARK);
            }

            for (var j=1; j<line.length; j++) {
                if (previous === '!') {
                    switch (line[j]) {
                        case '!': return returnErrorMessage(presenter.ERROR_MESSAGES.DOUBLED_EXCLAMATION_MARK); break;
                        case ' ': return returnErrorMessage(presenter.ERROR_MESSAGES.EXCLAMATION_MARK_BEFORE_EMPTY_FIELD); break;
                        default: break;
                    }
                }
                previous = line[j];
            }
        }

        presenter.blockWrongAnswers = presenter.isBlockWrongAnswers(model);

        var autoNavigationPropertyResponse = readModelAutoNavigationMode(model);
        if (!!autoNavigationPropertyResponse) {
            return autoNavigationPropertyResponse;
        }

        return {
            isError: false,
            isVisibleByDefault: ModelValidationUtils.validateBoolean(model['Is Visible']),
            langTag: model["langAttribute"],
        };
    };

    function readModelAutoNavigationMode(model) {
        const selectedMode = model["autoNavigation"];
        if (selectedMode === "Off") {
            autoNavigationMode = AUTO_NAVIGATION_OPTIONS.OFF;
        } else if (selectedMode === "Simple") {
            autoNavigationMode = AUTO_NAVIGATION_OPTIONS.SIMPLE;
        } else if (selectedMode === "Extended") {
            autoNavigationMode = AUTO_NAVIGATION_OPTIONS.EXTENDED;
        } else {
            return returnErrorMessage(
                presenter.ERROR_MESSAGES.NOT_SUPPORTED_SELECTED_AUTO_NAVIGATION_MODE
            );
        }
    }

    presenter.isAutoNavigationInOffMode = function () {
        return autoNavigationMode === AUTO_NAVIGATION_OPTIONS.OFF;
    }

    presenter.isAutoNavigationInSimpleMode = function () {
        return autoNavigationMode === AUTO_NAVIGATION_OPTIONS.SIMPLE;
    }

    presenter.isAutoNavigationInExtendedMode = function () {
        return autoNavigationMode === AUTO_NAVIGATION_OPTIONS.EXTENDED;
    }

    presenter.destroyCommands = function () {
        delete presenter.executeCommand;
        delete presenter.isAllOK;
        delete presenter.isAttempted;
        delete presenter.getMaxScore;
        delete presenter.getScore;
        delete presenter.getErrorCount;
        delete presenter.setShowErrorsMode;
        delete presenter.setWorkMode;
        delete presenter.show;
        delete presenter.hide;
        delete presenter.reset;
        delete presenter.getState;
        delete presenter.setState;
        presenter.isModelValid = false;
    };

    presenter.isBlockWrongAnswers = function (model) {
        return ModelValidationUtils.validateBoolean(model.blockWrongAnswers);
    };

    presenter.upgradeModel = function(model) {
        var upgradedModel = upgradeModelAddShowAllAnswersInGSAModeProperty(model);
        upgradedModel = upgradeModelAddAutoNavigationProperty(upgradedModel);
        upgradedModel = upgradeModelAddLangTagProperty(upgradedModel);
        return upgradeModelAddSpeechTextsProperty(upgradedModel);
    };

    function upgradeModelAddShowAllAnswersInGSAModeProperty(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if(!upgradedModel['showAllAnswersInGradualShowAnswersMode']) {
            upgradedModel['showAllAnswersInGradualShowAnswersMode'] = false;
        }

        return upgradedModel;
    }

    function upgradeModelAddAutoNavigationProperty(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if(!upgradedModel["autoNavigation"]) {
            upgradedModel["autoNavigation"] = "Extended";
        }

        return upgradedModel;
    }

    function upgradeModelAddLangTagProperty(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (upgradedModel["langAttribute"] === undefined) {
            upgradedModel["langAttribute"] =  '';
        }

        return upgradedModel;
    }

    function upgradeModelAddSpeechTextsProperty(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!upgradedModel["speechTexts"]) {
            upgradedModel["speechTexts"] = {};
        }
        if (!upgradedModel["speechTexts"]["Cell"]) {
            upgradedModel["speechTexts"]["Cell"] = {Cell: ""};
        }
        if (!upgradedModel["speechTexts"]["Across"]) {
            upgradedModel["speechTexts"]["Across"] = {Across: ""};
        }
        if (!upgradedModel["speechTexts"]["Down"]) {
            upgradedModel["speechTexts"]["Down"] = {Down: ""};
        }
        if (!upgradedModel["speechTexts"]["Correct"]) {
            upgradedModel["speechTexts"]["Correct"] = {Correct: ""};
        }
        if (!upgradedModel["speechTexts"]["Wrong"]) {
            upgradedModel["speechTexts"]["Wrong"] = {Wrong: ""};
        }
        if (!upgradedModel["speechTexts"]["Empty"]) {
            upgradedModel["speechTexts"]["Empty"] = {Empty: ""};
        }
        if (!upgradedModel["speechTexts"]["Disabled"]) {
            upgradedModel["speechTexts"]["Disabled"] = {Disabled: ""};
        }
        if (!upgradedModel["speechTexts"]["OutOf"]) {
            upgradedModel["speechTexts"]["OutOf"] = {OutOf: ""};
        }

        return upgradedModel;
    }

    presenter.initializeLogic = function(view, model) {
        model = presenter.upgradeModel(model);
        presenter.$view = $(view);
        presenter.ID = model.ID;
        presenter.showAllAnswersInGradualShowAnswersMode = model.showAllAnswersInGradualShowAnswersMode;

        presenter.configuration = presenter.readConfiguration(model);
        if(presenter.configuration.isError) {
            presenter.showErrorMessage(configuration.errorMessage, configuration.errorMessageSubstitutions);
            presenter.destroyCommands();
            return;
        }

        presenter.$view.find(".cell").live("blur", presenter.cellBlurEventHandler);
        presenter.prepareGrid(model);
        presenter.prepareCorrectAnswers();
        presenter.createGrid();
        presenter.setSpeechTexts(model["speechTexts"]);
        presenter.buildKeyboardController();
    };

    presenter.validate = function(mode) {
        const classPrefix = '.' + (isInPrintableStateMode() ? presenter.CSS_CLASSES.PRINTABLE + '_' : '');
        let wordValid, k, l, score, markedCell;
        let filled = false;

        if (presenter.isShowAnswersActive && mode == presenter.VALIDATION_MODE.SHOW_ERRORS) {
            presenter.hideAnswers();
            for (let i = 0; i < presenter.rowCount; i++) {
                for (let j = 0; j < presenter.columnCount; j++) {
                    if (presenter.$view.find(classPrefix + 'cell_' + i + 'x' + j + ' input').val() != ''
                        && typeof(presenter.$view.find(classPrefix + 'cell_' + i + 'x' + j + ' input').val()) !== "undefined"
                        && presenter.crossword[i][j][0] !== '!') {
                        filled = true;
                    }
                }
            }
            if (!filled) {
                return;
            }
        }

        if(mode == presenter.VALIDATION_MODE.SHOW_ERRORS) {
            presenter.$view.find(classPrefix + "cell_letter input").attr('disabled', true);
        } else if(mode == presenter.VALIDATION_MODE.COUNT_SCORE) {
            score = 0;
        }

        for(i = 0; i < presenter.rowCount; i++) {
            for(j = 0; j < presenter.columnCount; j++) {
                if(presenter.isHorizontalWordBegin(i, j)) {
                    wordValid = true;
                    let exampleLettersCounter = 0;
                    let letterCounter = 0;

                    for(k = j; k < presenter.columnCount; k++) {
                        if(presenter.crossword[i][k] == ' ') {
                            break;
                        }

                        if(presenter.crossword[i][k] != presenter.$view.find(classPrefix + 'cell_' + i + 'x' + k + " input").attr('value').toUpperCase()
                            && presenter.crossword[i][k][0] !== '!') {
                            wordValid = false;
                        }

                        if(presenter.crossword[i][k].match('![a-zA-Z]*?')) {
                            exampleLettersCounter++;
                        }
                        letterCounter++;
                    }

                    if (wordValid && letterCounter === exampleLettersCounter && mode !== presenter.VALIDATION_MODE.CHECK_ANSWERS) {
                        wordValid = false;
                    }

                    if(mode == presenter.VALIDATION_MODE.COUNT_SCORE && wordValid) {
                        score++;
                    }

                    if(mode === presenter.VALIDATION_MODE.SHOW_ERRORS || mode === presenter.VALIDATION_MODE.CHECK_ANSWERS) {
                        for(l = j; l < k; l++) {
                            markedCell = presenter.$view.find(classPrefix + 'cell_' + i + 'x' + l);
                            if(!markedCell.hasClass(presenter.CSS_CLASSES.CELL_VALID))
                                markedCell.addClass(
                                    wordValid
                                        ? presenter.CSS_CLASSES.CELL_VALID
                                        : presenter.CSS_CLASSES.CELL_INVALID);

                            if(wordValid && markedCell.hasClass(presenter.CSS_CLASSES.CELL_INVALID))
                                markedCell.removeClass(presenter.CSS_CLASSES.CELL_INVALID);
                        }
                    }
                }

                if(presenter.isVerticalWordBegin(i, j)) {
                    wordValid = true;
                    let exampleLettersCounter = 0;
                    let letterCounter = 0;

                    for(k = i; k < presenter.rowCount; k++) {
                        if(presenter.crossword[k][j] == ' ') {
                            break;
                        }

                        if(presenter.crossword[k][j] != presenter.$view.find(classPrefix + 'cell_' + k + 'x' + j + " input").attr('value').toUpperCase() && presenter.crossword[k][j][0] !== '!') {
                            wordValid = false;
                        }

                         if(presenter.crossword[k][j].match('![a-zA-Z]*?')) {
                            exampleLettersCounter++;
                        }
                        letterCounter++;
                    }

                    if (wordValid && letterCounter === exampleLettersCounter && mode !== presenter.VALIDATION_MODE.CHECK_ANSWERS) {
                        wordValid = false;
                    }

                    if(mode == presenter.VALIDATION_MODE.COUNT_SCORE && wordValid) {
                        score++;
                    }

                    if(mode === presenter.VALIDATION_MODE.SHOW_ERRORS || mode === presenter.VALIDATION_MODE.CHECK_ANSWERS) {
                        for(l = i; l < k; l++) {
                            markedCell = presenter.$view.find(classPrefix + 'cell_' + l + 'x' + j);
                            if(!markedCell.hasClass(presenter.CSS_CLASSES.CELL_VALID))
                                markedCell.addClass(
                                    wordValid
                                        ? presenter.CSS_CLASSES.CELL_VALID
                                        : presenter.CSS_CLASSES.CELL_INVALID);

                            if(wordValid && markedCell.hasClass(presenter.CSS_CLASSES.CELL_INVALID))
                                markedCell.removeClass(presenter.CSS_CLASSES.CELL_INVALID);
                        }
                    }
                }

            }
        }

        if(mode == presenter.VALIDATION_MODE.COUNT_SCORE) {
            return score;
        }
    };

    presenter.setShowErrorsMode = function() {
        if (!presenter.isAttempted()) {
            return;
        }

        presenter.validate(presenter.VALIDATION_MODE.CHECK_ANSWERS);
    };

    presenter.setWorkMode = function() {
        presenter.$view.find(".cell_letter:not(.cell_constant_letter) input").attr('disabled', false);
        presenter.$view.find('.' + presenter.CSS_CLASSES.CELL_VALID).removeClass(presenter.CSS_CLASSES.CELL_VALID);
        presenter.$view.find('.' + presenter.CSS_CLASSES.CELL_INVALID).removeClass(presenter.CSS_CLASSES.CELL_INVALID);
    };

    presenter.cellBlurEventHandler = function () {
        if (presenter.isAllOK()) {
            presenter.sendAllOKEvent();
        }
    };

    presenter.run = function(view, model) {
        presenter.preview = false;
        presenter.addonID = model.ID
        presenter.initializeLogic(view, model);
        if (!presenter.configuration.isError) {
            presenter.setVisibility(presenter.configuration.isVisibleByDefault);
       }
    };

    presenter.setEventBus = function (wrappedEventBus) {
        eventBus = wrappedEventBus;

        var events = ['ShowAnswers', 'HideAnswers', 'GradualShowAnswers', 'GradualHideAnswers'];
        for (var i = 0; i < events.length; i++) {
            eventBus.addEventListener(events[i], this);
        }
    };

    presenter.createPreview = function(view, model) {
        presenter.preview = true;
        presenter.initializeLogic(view, model);
        if (!presenter.configuration.isError) {
            presenter.setVisibility(true);
        }
    };

    presenter.reset = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        resetCellsStates()
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);
        presenter.setWorkMode();
    };

    function resetCellsStates() {
        for(var i = 0; i < presenter.rowCount; i++) {
            for(var j = 0; j < presenter.columnCount; j++) {
                if(presenter.crossword[i][j][0] !== '!') {
                    presenter.$view.find('.cell_' + i + 'x' + j + ' input').val('');
                }
                if(typeof(presenter.userAnswers) !== "undefined") {
                    presenter.userAnswers[i][j] = '';
                }
             }
        }
    }

    presenter.setVisibility = function(isVisible) {
        presenter.isVisible = isVisible;
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.show = function() {
        if(presenter.isShowAnswersActive === true){
            presenter.hideAnswers();
        }
        presenter.setVisibility(true);
    };

    presenter.hide = function() {
        if(presenter.isShowAnswersActive === true){
            presenter.hideAnswers();
        }
        presenter.setVisibility(false);
    };

    presenter.isAttempted = function() {
        let classPrefix = "cell";
        if (isInPrintableStateMode()) {
            classPrefix = presenter.CSS_CLASSES.PRINTABLE + "_" + classPrefix;
        }

        var countedConstantLetters = 0;
        jQuery.each(presenter.$view.find(`.${classPrefix} input`), function() {
            if (!ModelValidationUtils.isStringEmpty($(this).val())) countedConstantLetters++;
        });

        return presenter.numberOfConstantLetters < countedConstantLetters;
    };

    presenter.getScore = function() {
        const restoreState = presenter.isShowAnswersActive;
        const wasGradualShowAnswersActive = presenter.isGradualShowAnswersActive;

        if (presenter.isShowAnswersActive || presenter.isGradualShowAnswersActive) {
            presenter.hideAnswers();
        }
        var score = presenter.validate(presenter.VALIDATION_MODE.COUNT_SCORE);
        var finalScore = presenter.isAttempted() ? score : 0;
        if (restoreState) {
            presenter.showAnswers();
        }

        if (wasGradualShowAnswersActive) {
            this.restoreGradualShowAnswers();
        }
        return finalScore;
    };

    presenter.getMaxScore = function() {
        return presenter.maxScore;
    };

    presenter.getErrorCount = function() {
        const restoreState = presenter.isShowAnswersActive;
        const wasGradualShowAnswersActive = presenter.isGradualShowAnswersActive;
        if (presenter.isShowAnswersActive || presenter.isGradualShowAnswersActive) {
            presenter.hideAnswers();
        }
        var score = presenter.validate(presenter.VALIDATION_MODE.COUNT_SCORE),
            errorCount = presenter.getMaxScore() - score;
        var finalErrorCount = presenter.isAttempted() ? errorCount : 0;
        if (restoreState) {
            presenter.showAnswers();
        }

        if (wasGradualShowAnswersActive) {
            this.restoreGradualShowAnswers();
        }
        return finalErrorCount
    };

    presenter.getState = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        var cells = getCellsStates();
        var isVisible = presenter.isVisible;

        return JSON.stringify({
            cells : cells,
            isVisible : isVisible
        });
    };

    function getCellsStates() {
        var s = [];
        var cell;
        for(var i = 0; i < presenter.rowCount; i++) {
            for(var j = 0; j < presenter.columnCount; j++) {
                cell = presenter.$view.find('.cell_' + i + 'x' + j + ' input').attr('value');
                if(typeof(cell) == "string")
                    cell = cell.replace("\"", "\\\"");

                s.push(cell);
            }
        }
        return s;
    }

    presenter.setState = function(state) {
        var parsedState = $.parseJSON(state.toString());
        if (parsedState.hasOwnProperty("cells")) {
            setCellsStates(parsedState.cells);
        } else {
            setCellsStates(parsedState);
        }

        if (parsedState.hasOwnProperty("isVisible")) {
            if (typeof(parsedState.isVisible) === "boolean") {
                presenter.isVisible = parsedState.isVisible;
            } else {
                presenter.isVisible = presenter.configuration.isVisibleByDefault;
            }
            presenter.setVisibility(presenter.isVisible);
        }
    };

    function setCellsStates(cellsStates) {
        var counter = 0;
        for(var i = 0; i < presenter.rowCount; i++) {
            for(var j = 0; j < presenter.columnCount; j++) {
                presenter.$view.find('.cell_' + i + 'x' + j + ' input').attr('value', cellsStates[counter]);
                counter++;
            }
        }
    }

    presenter.setPlayerController = function (controller) {
        playerController = controller;
    };

    /**
     * @param controller (PrintableController)
     */
    presenter.setPrintableController = function (controller) {
        presenter.printableController = controller;
    };

    presenter.executeCommand = function (name, params) {
        if (presenter.configuration.isErrorMode) return;

        var commands = {
            'isAllOK': presenter.isAllOK,
            'show': presenter.show,
            'hide': presenter.hide
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.isAllOK = function() {
        if (presenter.isWordNumbersCorrect()) {
            return presenter.getMaxScore() === presenter.getScore() && presenter.getErrorCount() === 0;
        }
        return false;
    };

    function getEventObject(it, val, sc) {
        return {
            'source': presenter.ID,
            'item': '' + it,
            'value': '' + val,
            'score': '' + sc
        };
    }

    presenter.sendAllOKEvent = function () {
        eventBus.sendEvent('ValueChanged', getEventObject('all', '', ''));
    };

    presenter.sendCorrectWordEvent = function sendCorrectWordEvent (word, item) {
        eventBus.sendEvent('CorrectWord', getEventObject(item, word, ''));
    };

    presenter.sendScoreEvent = function(pos, value, isOk) {
        var item = '[row][col]'.replace('col', pos.x + 1).replace('row', pos.y + 1);
        var score = isOk ? '1' : '0';
        eventBus.sendEvent('ValueChanged', getEventObject(item, value, score));
    };

    presenter.validateWord = function validateWord(pos) {
        var max_x = pos.x;
        var max_y = pos.y;
        var i, k, horizontalResult = {
            word: '',
            item: 0,
            start: '',
            end: '',
        };
        var verticalResult = {...horizontalResult};

        if (presenter.wordNumbersHorizontal) {
            for (i = 0; i <= max_x; i++) {
                if (!presenter.isHorizontalWordBegin(max_y, i)) {
                    continue;
                }
                for (k = i; k < presenter.columnCount; k++) {
                    if(presenter.crossword[max_y][k] === ' ') {
                        break;
                    }
                    if(presenter.crossword[max_y][k] !== presenter.$view.find('.cell_' + max_y + 'x' + k + " input").attr('value').toUpperCase() && presenter.crossword[max_y][k][0] !== '!') {
                        horizontalResult.word = '';
                        break;
                    }
                    if (!horizontalResult.start) {
                        horizontalResult.start = `${k}:${max_y}`;
                    }
                    horizontalResult.end = `${k}:${max_y}`;
                    horizontalResult.word += presenter.crossword[max_y][k];
                }
                horizontalResult.item = presenter.$view.find('.cell_' + max_y + 'x' + i +' .word_number').text();
                break;
            }
        }

        if (presenter.wordNumbersVertical) {
            for (i = 0; i <= max_y; i++) {
                if (!presenter.isVerticalWordBegin(i, max_x)) {
                    continue;
                }
                for (k = i; k < presenter.rowCount; k++) {
                    if(presenter.crossword[k][max_x] === ' ') {
                        break;
                    }
                    if(presenter.crossword[k][max_x] !== presenter.$view.find('.cell_' + k + 'x' + max_x + " input").attr('value').toUpperCase() && presenter.crossword[k][max_x][0] !== '!') {
                        verticalResult.word = '';
                        break;
                    }
                    if (!verticalResult.start) {
                        verticalResult.start = `${max_x}:${k}`;
                    }
                    verticalResult.end = `${max_x}:${k}`;
                    verticalResult.word += presenter.crossword[k][max_x];
                }
                verticalResult.item = presenter.$view.find('.cell_' + i + 'x' + max_x +' .word_number').text();
                break;
            }
        }

        return {
            verticalResult: verticalResult.word !== '' ? verticalResult : null,
            horizontalResult: horizontalResult.word !== '' ? horizontalResult : null,
        }
    };

    presenter.getActivitiesCount = function() {
        if(presenter.showAllAnswersInGradualShowAnswersMode === "True") {
            return 1;
        }
        return presenter.correctAnswers.length;
    }

    presenter.onEventReceived = function (eventName, data) {
        if (!presenter.isModelValid) return;

        switch(eventName) {
            case "ShowAnswers":
                presenter.showAnswers();
                break;

            case "GradualShowAnswers":
                presenter.gradualShowAnswers(data);
                break;

            case "HideAnswers":
            case "GradualHideAnswers":
                presenter.hideAnswers();
                break;
        }
    }

    presenter.showAnswers = function () {
        if (presenter.isWordNumbersCorrect()) {
            presenter.saveUserAnswers();
            if (presenter.isShowAnswersActive) {
                presenter.hideAnswers();
            }
            presenter.isShowAnswersActive = true;
            presenter.setWorkMode();
            presenter.$view.find(".cell_letter input").addClass('crossword_cell_show-answers');

            presenter.replaceUserAnswersByModelAnswers();
        }
    };

    presenter.hideAnswers = function () {
        if (presenter.isWordNumbersCorrect() && (presenter.isShowAnswersActive || presenter.isGradualShowAnswersActive)) {
            presenter.$view.find(".cell_letter input").removeClass('crossword_cell_show-answers');
            presenter.isShowAnswersActive = false;
            presenter.isGradualShowAnswersActive = false;
            if (!presenter.userAnswers) {
                presenter.areUserAnswersSaved = false;
                return;
            }

            presenter.replaceAnswersBySavedUserAnswers();
        }
    };

    presenter.gradualShowAnswers = function (data) {
        if (data.moduleID !== presenter.addonID) {
            return;
        }

        if (!presenter.isWordNumbersCorrect()) {
            return;
        }

        presenter.isGradualShowAnswersActive = true;
        if (presenter.showAllAnswersInGradualShowAnswersMode === "True") {
            presenter.showAnswers();
        } else {
            presenter.$view.find(".cell_letter input").addClass('crossword_cell_show-answers');
            const itemIndex = parseInt(data.item, 10);
            presenter.GSAcounter = itemIndex;
            const answerData = presenter.correctAnswers[itemIndex];

            if (itemIndex === 0) presenter.prepareCrosswordForGSA();
            presenter.fillRowGaps(answerData);
        }
    }

    presenter.restoreGradualShowAnswers = function () {
        presenter.isGradualShowAnswersActive = true;
        if (presenter.showAllAnswersInGradualShowAnswersMode === "True") {
            presenter.showAnswers();
        } else {
            for (let i = 0; i <= presenter.GSAcounter; i++) {
                presenter.$view.find(".cell_letter input").addClass('crossword_cell_show-answers');
                const answerData = presenter.correctAnswers[i];

                if (i === 0) presenter.prepareCrosswordForGSA();
                presenter.fillRowGaps(answerData);
            }
        }
    }

    presenter.saveUserAnswers = function () {
        if (presenter.areUserAnswersSaved) return;

        presenter.areUserAnswersSaved = true;
        presenter.$view.find(".cell_letter input:enabled").attr('disabled', true);
        presenter.userAnswers = new Array(presenter.rowCount);
        for (let row = 0; row < presenter.rowCount; row++) {
            presenter.userAnswers[row] = new Array(presenter.columnCount);
            for (let column = 0; column < presenter.columnCount; column++) {
                presenter.userAnswers[row][column] = presenter.$view.find('.cell_' + row + 'x' + column + ' input')
                    .val();
            }
        }
    }

    presenter.replaceUserAnswersByModelAnswers = function () {
        let classPrefix = "cell_";
        if (isInPrintableStateMode()) {
            classPrefix = presenter.CSS_CLASSES.PRINTABLE + "_" + classPrefix;
        }

        for (let row = 0; row < presenter.rowCount; row++) {
            for (let column = 0; column < presenter.columnCount; column++) {
                let $cellInputs = presenter.$view.find(`.${classPrefix}${row}x${column} input`);
                $cellInputs.val(presenter.crossword[row][column].replaceAll("!",""));
            }
        }
    }

    presenter.replaceAnswersBySavedUserAnswers = function () {
        let classPrefix = "cell_";
        if (isInPrintableStateMode()) {
            classPrefix = presenter.CSS_CLASSES.PRINTABLE + "_" + classPrefix;
        }

        for (let row = 0; row < presenter.rowCount; row++) {
            for (let column = 0; column < presenter.columnCount; column++) {
                if (!presenter.crossword[row][column][0].includes('!')) {
                    let $cellInputs = presenter.$view.find(`.${classPrefix}${row}x${column} input`);
                    $cellInputs.val(presenter.userAnswers[row][column]);
                    if (!isInPrintableStateMode()) {
                        $cellInputs.attr('disabled', false);
                    }
                }
            }
        }
        presenter.areUserAnswersSaved = false;
    }

    presenter.fillRowGaps = function (answerData) {
        const answer = answerData.answer.replaceAll("!","");
        const { x, y } = answerData.position;

        if (answerData.isHorizontal) {
            for (let i = 0; i < answer.length; i++) {
                presenter.$view.find('.cell_' + y + 'x' + (x + i) + ' input').val(answer.charAt(i));
            }
        } else {
            for (let i = 0; i < answer.length; i++) {
                presenter.$view.find('.cell_' + (y + i) + 'x' + x + ' input').val(answer.charAt(i));
            }
        }
    }

    presenter.prepareCrosswordForGSA = function () {
        presenter.setWorkMode();
        presenter.saveUserAnswers();
    }

    presenter.setSpeechTexts = function(speechTexts) {
        presenter.speechTexts = {
            Cell: presenter.DEFAULT_TTS_PHRASES.CELL,
            Across: presenter.DEFAULT_TTS_PHRASES.ACROSS,
            Down: presenter.DEFAULT_TTS_PHRASES.DOWN,
            Correct: presenter.DEFAULT_TTS_PHRASES.CORRECT,
            Wrong: presenter.DEFAULT_TTS_PHRASES.WRONG,
            Empty: presenter.DEFAULT_TTS_PHRASES.EMPTY,
            Disabled: presenter.DEFAULT_TTS_PHRASES.DISABLED,
            OutOf: presenter.DEFAULT_TTS_PHRASES.OUT_OFF,
        };

        if (!speechTexts || $.isEmptyObject(speechTexts)) {
            return;
        }

        presenter.speechTexts = {
            Cell: TTSUtils.getSpeechTextProperty(
                speechTexts.Cell.Cell,
                presenter.speechTexts.Cell),
            Across: TTSUtils.getSpeechTextProperty(
                speechTexts.Across.Across,
                presenter.speechTexts.Across),
            Down: TTSUtils.getSpeechTextProperty(
                speechTexts.Down.Down,
                presenter.speechTexts.Down),
            Correct: TTSUtils.getSpeechTextProperty(
                speechTexts.Correct.Correct,
                presenter.speechTexts.Correct),
            Wrong: TTSUtils.getSpeechTextProperty(
                speechTexts.Wrong.Wrong,
                presenter.speechTexts.Wrong),
            Empty: TTSUtils.getSpeechTextProperty(
                speechTexts.Empty.Empty,
                presenter.speechTexts.Empty),
            Disabled: TTSUtils.getSpeechTextProperty(
                speechTexts.Disabled.Disabled,
                presenter.speechTexts.Disabled),
            OutOf: TTSUtils.getSpeechTextProperty(
                speechTexts.OutOf.OutOf,
                presenter.speechTexts.OutOf),
        };
    };

    presenter.keyboardController = function(keycode, isShiftDown, event) {
        presenter.keyboardControllerObject.handle(keycode, isShiftDown, event);
    };

    presenter.buildKeyboardController = function () {
        presenter.keyboardControllerObject
            = new CrosswordKeyboardController(
                presenter.getElementsForKeyboardNavigation(),
                presenter.columnCount
        );
    };

    presenter.getElementsForKeyboardNavigation = function () {
        return presenter.$view.find(`.${presenter.CSS_CLASSES.CELL}`);
    };

    presenter.setWCAGStatus = function(isWCAGOn) {
        presenter.isWCAGOn = isWCAGOn;
    };

    function CrosswordKeyboardController (elements, columnsCount) {
        KeyboardController.call(this, elements, columnsCount);
        this.updateMapping();
    }

    CrosswordKeyboardController.prototype = Object.create(window.KeyboardController.prototype);
    CrosswordKeyboardController.prototype.constructor = CrosswordKeyboardController;

    CrosswordKeyboardController.prototype.exitWCAGMode = function () {
        KeyboardController.prototype.exitWCAGMode.call(this);
        presenter.setWCAGStatus(false);
    };

    CrosswordKeyboardController.prototype.updateMapping = function () {
        this.mapping[presenter.SPECIAL_KEYS.BACKSPACE] = this.executeBackspace;
        this.mapping[presenter.SPECIAL_KEYS.TAB] = this.nextTabIndexElement;
        this.shiftKeysMapping[presenter.SPECIAL_KEYS.TAB] = this.previousTabIndexElement;
    };

    CrosswordKeyboardController.prototype.enter = function (event) {
        if (event) {
            event.preventDefault();
        }

        if (this.keyboardNavigationActive) {
            this.readCurrentElement();
            return;
        }
        this.keyboardNavigationActive = true;
        this.moveToFirstElement();
        this.readCurrentElementInShortForm();
    };

    CrosswordKeyboardController.prototype.moveToFirstElement = function () {
        var cellPosition;
        if (presenter.isWCAGOn) {
            cellPosition = presenter.correctAnswers[0]["position"];
        } else {
            var firstElement = findCellInputElement(presenter.tabIndexBase);
            cellPosition = getPositionOfCellInputElement($(firstElement));
        }
        if (!isPositionValid(cellPosition)) {
            return;
        }

        presenter.setTabIndexDirection();
        if (presenter.keyboardControllerObject.keyboardNavigationActive) {
            presenter.keyboardControllerObject.switchCellInputElement(cellPosition);
        } else {
            focusCellInputUsingPosition(cellPosition);
        }
    }

    /**
     Action when was called tab
     @method nextTabIndexElement
    */
    CrosswordKeyboardController.prototype.nextTabIndexElement = function (event) {
        if (presenter.isAutoNavigationInExtendedMode()) {
            presenter.setTabIndexDirection();
        }
        moveToNextEditableTabIndexCellInput(event);
    };

    function moveToNextEditableTabIndexCellInput(event, blurCurrentOnAbsenceOfNext = false) {
        _moveToCellInputWithGivenPosition(
            event,
            getNextTabIndexEditableCellPositionOfCellInput,
            blurCurrentOnAbsenceOfNext
        );
    }

    /**
     Action when was called shift + tab
     @method previousTabIndexElement
    */
    CrosswordKeyboardController.prototype.previousTabIndexElement = function (event) {
        if (presenter.isAutoNavigationInExtendedMode()) {
            presenter.setTabIndexDirection();
        }
        moveToPreviousEditableTabIndexCellInput(event);
    };

    function moveToPreviousEditableTabIndexCellInput(event, blurCurrentOnAbsenceOfNext = false) {
        _moveToCellInputWithGivenPosition(
            event,
            getPreviousTabIndexEditableCellPositionOfCellInput,
            blurCurrentOnAbsenceOfNext
        );
    }

    /**
     Action when was called right arrow
     @method nextElement
    */
    CrosswordKeyboardController.prototype.nextElement = function (event) {
        if (presenter.isAutoNavigationInExtendedMode()
            || presenter.isAutoNavigationInSimpleMode()) {
            presenter.setHorizontalDirection();
        }
        moveToNextRightCellInput(event);
    };

    function moveToNextRightCellInput(event, blurCurrentOnAbsenceOfNext = false) {
        _moveToCellInputWithGivenPosition(
            event,
            getNextRightCellPositionOfCellInput,
            blurCurrentOnAbsenceOfNext
        );
    }

    /**
     Action when was called left arrow
     @method previousElement
    */
    CrosswordKeyboardController.prototype.previousElement = function (event) {
        if (presenter.isAutoNavigationInExtendedMode()
            || presenter.isAutoNavigationInSimpleMode()) {
            presenter.setHorizontalDirection();
        }
        moveToNextLeftCellInput(event);
    };

    function moveToNextLeftCellInput(event, blurCurrentOnAbsenceOfNext = false) {
        _moveToCellInputWithGivenPosition(
            event,
            getNextLeftCellPositionOfCellInput,
            blurCurrentOnAbsenceOfNext
        );
    }

    /**
     Action when was called down arrow
     @method nextRow
    */
    CrosswordKeyboardController.prototype.nextRow = function (event) {
        if (presenter.isAutoNavigationInExtendedMode()
            || presenter.isAutoNavigationInSimpleMode()) {
            presenter.setVerticalDirection();
        }
        moveToNextBottomCellInput(event);
    };

    function moveToNextBottomCellInput(event, blurCurrentOnAbsenceOfNext = false) {
        _moveToCellInputWithGivenPosition(
            event,
            getNextBottomCellPositionOfCellInput,
            blurCurrentOnAbsenceOfNext
        );
    }

    /**
     Action when was called up arrow
     @method previousRow
    */
    CrosswordKeyboardController.prototype.previousRow = function (event) {
        if (presenter.isAutoNavigationInExtendedMode()
            || presenter.isAutoNavigationInSimpleMode()) {
            presenter.setVerticalDirection();
        }
        moveToNextTopCellInput(event);
    };

    function moveToNextTopCellInput(event, blurCurrentOnAbsenceOfNext = false) {
        _moveToCellInputWithGivenPosition(
            event,
            getNextTopCellPositionOfCellInput,
            blurCurrentOnAbsenceOfNext
        );
    }

    function _moveToCellInputWithGivenPosition(event, getNewPosition, blurCurrentOnAbsenceOfNext = false) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const currentCellInput = presenter.keyboardControllerObject.keyboardNavigationActive
            ? presenter.keyboardControllerObject.getCurrentInputElement()
            : event.target;
        const includeConstantCells = presenter.isWCAGOn;
        const nextCellPosition = getNewPosition(currentCellInput, includeConstantCells);
        if (!nextCellPosition) {
            if (blurCurrentOnAbsenceOfNext) {
                blurCellInput(currentCellInput);
            }
            return;
        }

        if (presenter.keyboardControllerObject.keyboardNavigationActive) {
            presenter.keyboardControllerObject.switchCellInputElement(nextCellPosition);
            presenter.keyboardControllerObject.readCurrentElementInShortForm();
        } else {
            focusCellInputUsingPosition(nextCellPosition);
        }
    }

    /**
     Action when was called backspace
     @method executeBackspace
    */
    CrosswordKeyboardController.prototype.executeBackspace = function (event) {
        handleBackspaceEvent(event);
    };

    function handleBackspaceEvent(event) {
        if (event) {
            event.stopPropagation();
        }

        var currentCellInput = presenter.keyboardControllerObject.keyboardNavigationActive
            ? presenter.keyboardControllerObject.getCurrentInputElement()
            : event.target;
        if (!$(currentCellInput).val()) {
            var nextCellPosition = getNextCellPositionForBackspaceAction(currentCellInput);
            if (!nextCellPosition) {
                return;
            }

            if (presenter.keyboardControllerObject.keyboardNavigationActive) {
                presenter.keyboardControllerObject.switchCellInputElement(nextCellPosition);
                if (!isPositionOfConstantCell(nextCellPosition)) {
                    $(presenter.keyboardControllerObject.getCurrentInputElement()).val('');
                }
                presenter.keyboardControllerObject.readCurrentElementInShortForm();
            } else {
                var $previousElement = $(getCellInput(nextCellPosition));
                $previousElement.focus();
                $previousElement.val('');
            }
        }
    }

    function getNextCellPositionForBackspaceAction(currentCellInput) {
        if (presenter.isTabIndexDirection() || presenter.isDirectionNotSet()) {
            const previousTabIndex = currentCellInput.tabIndex - 1;
            return getPositionOfCellInputElementWithTabIndex(previousTabIndex);
        }

        const currentCellPosition = getPositionOfCellInputElement($(currentCellInput));
        if (presenter.isVerticalDirection()) {
            return getNextTopCellPosition(currentCellPosition, presenter.isWCAGOn);
        }
        return getNextLeftCellPosition(currentCellPosition, presenter.isWCAGOn);
    }

    CrosswordKeyboardController.prototype.switchCellInputElement = function (newPosition) {
        var newPositionIndex = this.calculateNewPositionIndex(newPosition);
        this.markCurrentElement(newPositionIndex);
    };

    CrosswordKeyboardController.prototype.calculateNewPositionIndex = function (newPosition) {
        var newPositionIndex = this.keyboardNavigationElements.toArray().findIndex(
            cellElement =>
                $(cellElement).hasClass(`cell_row_${newPosition.y}`)
                && $(cellElement).hasClass(`cell_column_${newPosition.x}`)
        );

        if (newPositionIndex === -1) {
            newPositionIndex = this.keyboardNavigationCurrentElementIndex;
        } else if (newPositionIndex >= this.keyboardNavigationElementsLen) {
            newPositionIndex = this.keyboardNavigationElementsLen;
        } else if (newPositionIndex < 0) {
            newPositionIndex = this.keyboardNavigationElementsLen;
        }
        return newPositionIndex;
    }

    CrosswordKeyboardController.prototype.mark = function (element) {
        KeyboardController.prototype.mark.call(this, element);
        var inputCell = getElementInput(element);
        $(inputCell).focus();
    };

    CrosswordKeyboardController.prototype.unmark = function (element) {
        KeyboardController.prototype.unmark.call(this, element);
        var inputCell = getElementInput(element);
        $(inputCell).blur();
    };

    CrosswordKeyboardController.prototype.getTarget = function (element, willBeClicked) {
        return $(element);
    }

    CrosswordKeyboardController.prototype.getCurrentElementPosition = function () {
        return presenter.getPosition(this.getCurrentElement());
    }

    CrosswordKeyboardController.prototype.getCurrentElement = function () {
        return this.getTarget(this.keyboardNavigationCurrentElement, false);
    };

    CrosswordKeyboardController.prototype.getCurrentInputElement = function () {
        return $(this.getTarget(this.keyboardNavigationCurrentElement, false)).find("input")[0];
    };

    CrosswordKeyboardController.prototype.readCurrentElement = function () {
        var textVoiceObject = [];
        var cellInput = this.getCurrentInputElement();
        var currentPosition = getPositionOfCellInputElement($(cellInput));

        this.addMessageAboutElementIndex(textVoiceObject, currentPosition);

        if (presenter.wordNumbersHorizontal) {
            this.addMessageAboutHorizontalAnswer(textVoiceObject, currentPosition);
        }

        if (presenter.wordNumbersVertical) {
            this.addMessageAboutVerticalAnswer(textVoiceObject, currentPosition);
        }

        this.addMessageAboutValue(textVoiceObject, cellInput.value);

        if (isPositionOfConstantCell(currentPosition)) {
            pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, presenter.speechTexts.Disabled);
        } else {
            this.addMessageAboutCorrectness(textVoiceObject);
        }

        presenter.speak(textVoiceObject);
    };

    CrosswordKeyboardController.prototype.readCurrentElementInShortForm = function () {
        var textVoiceObject = [];
        var cellInput = this.getCurrentInputElement();
        var currentPosition = getPositionOfCellInputElement($(cellInput));

        this.addMessageAboutElementIndex(textVoiceObject, currentPosition);
        this.addMessageAboutValue(textVoiceObject, cellInput.value);

        if (isPositionOfConstantCell(currentPosition)) {
            pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, presenter.speechTexts.Disabled);
        } else {
            this.addMessageAboutCorrectness(textVoiceObject);
        }

        presenter.speak(textVoiceObject);
    }

    CrosswordKeyboardController.prototype.addMessageAboutElementIndex = function (textVoiceObject, position) {
        const alphabet = "ABCDEFGHIJKLMNOPRSTUWXYZ";
        const message = presenter.speechTexts.Cell
            + " " + alphabet[position.x % alphabet.length]
            + " " + (position.y + 1);
        pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, message);
    }

    CrosswordKeyboardController.prototype.addMessageAboutHorizontalAnswer = function (textVoiceObject, position) {
        var foundAnswer, trueLength, nextAnswer;
        for (var i = 0; i < presenter.correctAnswers.length; i++) {
            nextAnswer = presenter.correctAnswers[i];

            if (nextAnswer.isHorizontal) {
                trueLength = [...nextAnswer.answer].filter((x) => x !== '!').length;
                if (position.y === nextAnswer.position.y
                    && nextAnswer.position.x <= position.x
                    && position.x < nextAnswer.position.x + trueLength) {
                    foundAnswer = {...nextAnswer};
                    foundAnswer["id"] = i + 1;
                    foundAnswer["trueLength"] = trueLength;
                    break;
                }
            }
        }

        if (foundAnswer) {
            const answerIDMessage = `${presenter.speechTexts.Across} ${foundAnswer.id}`;
            pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, answerIDMessage);

            const relativePosition = position.x - foundAnswer.position.x + 1;
            const outOfMessage = `${relativePosition} ${presenter.speechTexts.OutOf} ${foundAnswer.trueLength}`;
            pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, outOfMessage);
        }
    }

    CrosswordKeyboardController.prototype.addMessageAboutVerticalAnswer = function (textVoiceObject, position) {
        var foundAnswer, trueLength, nextAnswer;
        for (var i = 0; i < presenter.correctAnswers.length; i++) {
            nextAnswer = presenter.correctAnswers[i];

            if (!nextAnswer.isHorizontal) {
                trueLength = [...nextAnswer.answer].filter((x) => x !== '!').length;
                if (position.x === nextAnswer.position.x
                    && nextAnswer.position.y <= position.y
                    && position.y < nextAnswer.position.y + trueLength) {
                    foundAnswer = {...nextAnswer};
                    foundAnswer["id"] = i + 1;
                    foundAnswer["trueLength"] = trueLength;
                    break;
                }
            }
        }

        if (foundAnswer) {
            const answerIDMessage = `${presenter.speechTexts.Down} ${foundAnswer.id}`;
            pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, answerIDMessage);

            const relativePosition = position.y - foundAnswer.position.y + 1;
            const outOfMessage = `${relativePosition} ${presenter.speechTexts.OutOf} ${foundAnswer.trueLength}`;
            pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, outOfMessage);
        }
    }

    CrosswordKeyboardController.prototype.addMessageAboutValue = function (textVoiceObject, value) {
        if (value) {
            pushMessageToTextVoiceObjectWithLanguageFromPresenter(textVoiceObject, value);
        } else {
            pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, presenter.speechTexts.Empty);
        }
    }

    CrosswordKeyboardController.prototype.addMessageAboutCorrectness = function (textVoiceObject) {
        var $cell = $(this.getCurrentElement());
        if ($cell.hasClass(presenter.CSS_CLASSES.CELL_VALID)) {
            pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, presenter.speechTexts.Correct);
        } else if ($cell.hasClass(presenter.CSS_CLASSES.CELL_INVALID)) {
            pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, presenter.speechTexts.Wrong);
        }
    }

    CrosswordKeyboardController.prototype.speakWrong = function () {
        var textVoiceObject = [];

        pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, presenter.speechTexts.Wrong);

        presenter.speak(textVoiceObject);
    }

    CrosswordKeyboardController.prototype.speakDisabled = function () {
        var textVoiceObject = [];

        pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, presenter.speechTexts.Disabled);

        presenter.speak(textVoiceObject);
    }

    function pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, message) {
        pushMessageToTextVoiceObject(textVoiceObject, message, false);
    }

    function pushMessageToTextVoiceObjectWithLanguageFromPresenter(textVoiceObject, message) {
        pushMessageToTextVoiceObject(textVoiceObject, message, true);
    }

    function pushMessageToTextVoiceObject(textVoiceObject, message, usePresenterLangTag = false) {
        if (usePresenterLangTag)
            textVoiceObject.push(window.TTSUtils.getTextVoiceObject(message, presenter.configuration.langTag));
        else
            textVoiceObject.push(window.TTSUtils.getTextVoiceObject(message));
    }

    presenter.speak = function (data) {
        var tts = presenter.getTextToSpeechOrNull(playerController);
        if (tts && presenter.isWCAGOn) {
            tts.speak(data);
        }
    };

    presenter.getTextToSpeechOrNull = function (playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    presenter.setPrintableState = function(state) {
        if (state === null || ModelValidationUtils.isStringEmpty(state))
            return;

        presenter.printableState = JSON.parse(state);
    }

    presenter.getPrintableHTML = function (model, showAnswers) {
        chosePrintableStateMode(showAnswers);
        const snapshot = createSnapshotOfVariables();

        createPrintableBaseView(model);
        modifyViewAccordingToPrintableStateMode();
        const printableHTML = presenter.$view[0].outerHTML;

        restoreSnapshotOfVariables(snapshot);
        presenter.printableStateMode = null;

        return printableHTML;
    };

    function createPrintableBaseView(model) {
        model = presenter.upgradeModel(model);

        presenter.$view = $('<div></div>');
        presenter.$view.attr("id", model.ID);
        presenter.$view.addClass(presenter.CSS_CLASSES.PRINTABLE_ADDON);

        presenter.printableConfiguration = presenter.readConfiguration(model);
        if (presenter.printableConfiguration.isError) {
            presenter.showErrorMessage(
                presenter.printableConfiguration.errorMessage,
                presenter.printableConfiguration.errorMessageSubstitutions
            );
            presenter.destroyCommands();
            return;
        }

        presenter.prepareGrid(model);
        presenter.prepareCorrectAnswers();
        presenter.createGrid();
    }

    function chosePrintableStateMode(showAnswers) {
        if (presenter.printableState) {
            if (showAnswers)
                presenter.printableStateMode = presenter.PRINTABLE_STATE_MODE.CHECK_ANSWERS;
            else
                presenter.printableStateMode = presenter.PRINTABLE_STATE_MODE.SHOW_USER_ANSWERS;
        } else {
            if (showAnswers)
                presenter.printableStateMode = presenter.PRINTABLE_STATE_MODE.SHOW_ANSWERS;
            else
                presenter.printableStateMode = presenter.PRINTABLE_STATE_MODE.EMPTY;
        }
    }

    function isInPrintableStateMode() {
        return presenter.printableStateMode !== null;
    }

    function modifyViewAccordingToPrintableStateMode() {
        switch (presenter.printableStateMode) {
            case presenter.PRINTABLE_STATE_MODE.CHECK_ANSWERS:
                updateViewToCheckAnswersInPrintableStateMode();
                break;
            case presenter.PRINTABLE_STATE_MODE.SHOW_USER_ANSWERS:
                updateViewToShowUserAnswersInPrintableStateMode();
                break;
            case presenter.PRINTABLE_STATE_MODE.SHOW_ANSWERS:
                updateViewToShowAnswersInPrintableStateMode();
                break;
            case presenter.PRINTABLE_STATE_MODE.EMPTY:
                updateViewToEmptyStateInPrintableStateMode();
                break;
        }
        replaceInputElementsByPrintableDivs();
    }

    function updateViewToCheckAnswersInPrintableStateMode() {
        setUserAnswersFromPrintableState();
        presenter.replaceAnswersBySavedUserAnswers();

        if (!presenter.isAttempted()) {
            return;
        }
        validateForPrintable();
    }

    function validateForPrintable() {
        presenter.validate(presenter.VALIDATION_MODE.SHOW_ERRORS);
        for (let row = 0; row < presenter.rowCount; row++) {
            for (let column = 0; column < presenter.columnCount; column++) {
                let $cell = presenter.$view.find(`.${presenter.CSS_CLASSES.PRINTABLE}_cell_${row}x${column}`);
                if ($cell.hasClass(presenter.CSS_CLASSES.CELL_VALID)) {
                    $cell.append(getPrintableGapSignHTML(true));
                    $cell.removeClass(presenter.CSS_CLASSES.CELL_VALID);
                    $cell.addClass(presenter.CSS_CLASSES.PRINTABLE_CELL_VALID);
                } else if ($cell.hasClass(presenter.CSS_CLASSES.CELL_INVALID)) {
                    $cell.append(getPrintableGapSignHTML(false));
                    $cell.removeClass(presenter.CSS_CLASSES.CELL_INVALID);
                    $cell.addClass(presenter.CSS_CLASSES.PRINTABLE_CELL_INVALID);
                }
            }
        }
    }

    function getPrintableGapSignHTML(isCorrectAnswer) {
        const $sign = $("<span></span>");
        if (isCorrectAnswer) {
            $sign.addClass(presenter.CSS_CLASSES.PRINTABLE_SIGN_VALID);
        } else {
            $sign.addClass(presenter.CSS_CLASSES.PRINTABLE_SIGN_INVALID);
        }
        return $sign;
    }

    function updateViewToShowUserAnswersInPrintableStateMode() {
        setUserAnswersFromPrintableState();
        presenter.replaceAnswersBySavedUserAnswers();
    }

    function setUserAnswersFromPrintableState() {
        presenter.userAnswers = [];

        let cells;
        if (presenter.printableState.hasOwnProperty("cells")) {
            cells = presenter.printableState.cells;
        } else {
            cells = presenter.printableState;
        }
        let counter = 0;
        for (let i = 0; i < presenter.rowCount; i++) {
            let row = [];
            for (let j = 0; j < presenter.columnCount; j++) {
                row.push(cells[counter]);
                counter++;
            }
            presenter.userAnswers.push(row);
        }
    }

    function updateViewToShowAnswersInPrintableStateMode() {
        presenter.replaceUserAnswersByModelAnswers();
    }

    function updateViewToEmptyStateInPrintableStateMode() {}

    function replaceInputElementsByPrintableDivs() {
        presenter.$view.find(".printable_cell_letter input").replaceWith(function() {
            let $cellContent = $('<div>' + $(this).val() + '</div>');
            $cellContent.addClass(presenter.CSS_CLASSES.PRINTABLE_CELL_LETTER_CONTENT);
            return $cellContent
        });
    }

    function createSnapshotOfVariables() {
        return {
            crossword: presenter.crossword,
            rowCount: presenter.rowCount,
            columnCount: presenter.columnCount,
            cellHeight: presenter.cellHeight,
            cellWidth: presenter.cellWidth,
            blankCellsBorderStyle: presenter.blankCellsBorderStyle,
            blankCellsBorderWidth: presenter.blankCellsBorderWidth,
            blankCellsBorderColor: presenter.blankCellsBorderColor,
            letterCellsBorderStyle: presenter.letterCellsBorderStyle,
            letterCellsBorderWidth: presenter.letterCellsBorderWidth,
            letterCellsBorderColor: presenter.letterCellsBorderColor,
            wordNumbersHorizontal: presenter.wordNumbersHorizontal,
            wordNumbersVertical: presenter.wordNumbersVertical,
            showAllAnswersInGradualShowAnswersMode: presenter.showAllAnswersInGradualShowAnswersMode,
            disableAutomaticWordNumbering: presenter.disableAutomaticWordNumbering,
            blockWrongAnswers: presenter.blockWrongAnswers,
            isVisibleByDefault: presenter.isVisibleByDefault,
            markedColumnIndex: presenter.markedColumnIndex,
            markedRowIndex: presenter.markedRowIndex,
            autoNavigationMode: autoNavigationMode,

            $view: presenter.$view,
            tabIndexBase: presenter.tabIndexBase,
            maxTabIndex: presenter.maxTabIndex,
            numberOfConstantLetters: presenter.numberOfConstantLetters,
            maxScore: presenter.maxScore,
            areUserAnswersSaved: presenter.areUserAnswersSaved,
            configuration: {...presenter.configuration},
            correctAnswers: [...presenter.correctAnswers]
        }
    }

    function restoreSnapshotOfVariables(snapshot) {
        Object.keys(snapshot).forEach(function(key) {
            if (presenter.hasOwnProperty(key)) {
                presenter[key] = snapshot[key];
            } else {
                switch (key.toString()) {
                    case "autoNavigationMode":
                        autoNavigationMode = snapshot[key];
                        break;
                    default:
                        break;
                }
            }
        });
    }

    function addClass($element, className) {
        if (isInPrintableStateMode()) {
            className = presenter.CSS_CLASSES.PRINTABLE + "_" + className;
        }
        $element.addClass(className);
    }

    return presenter;
}
