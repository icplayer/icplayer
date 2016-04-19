function Addoncrossword_create(){
    var presenter = function() {};

    var playerController;
    var eventBus;

    presenter.rowCount         = null;
    presenter.columnCount      = null;
    presenter.cellHeight       = null;
    presenter.cellWidth        = null;
    presenter.maxScore         = null;
    presenter.score            = null;
    presenter.id               = null;
    presenter.blankCellsBorderStyle  = "solid";
    presenter.blankCellsBorderWidth  = 0;
    presenter.blankCellsBorderColor  = "transparent";
    presenter.letterCellsBorderStyle = "solid";
    presenter.letterCellsBorderWidth = 0;
    presenter.letterCellsBorderColor = "transparent";
    presenter.wordNumbersHorizontal = false;
    presenter.wordNumbersVertical = false;
    presenter.disableAutomaticWordNumbering = false;
    presenter.markedColumnIndex = 0;
    presenter.markedRowIndex = 0;

    presenter.numberOfConstantLetters = 0;

    presenter.ERROR_MESSAGES = {
        ROWS_NOT_SPECIFIED:                     "Amount of rows is not specified",
        COLUMNS_NOT_SPECIFIED:                  "Amount of columns is not specified",
        INVALID_MARKED_COLUMN_INDEX:            "Marked column index cannot be negative, use 0 to disable",
        INVALID_MARKED_ROW_INDEX:               "Marked row index cannot be negative, use 0 to disable",
        CELL_WIDTH_NOT_SPECIFIED:               "Cell width is not specified",
        CELL_HEIGHT_NOT_SPECIFIED:              "Cell height is not specified",
        INVALID_BLANK_CELLS_BORDER_WIDTH:       "Blank cells border width must be greater on equal to 0",
        INVALID_LETTER_CELLS_BORDER_WIDTH:      "Letter cells border width must be greater on equal to 0",
        INVALID_AMOUNT_OF_ROWS_IN_CROSSWORD:    "Amount of lines (that act as rows) in the specified Crossword is different that amount of rows you have specified in Properties",
        INVALID_AMOUNT_OF_COLUMNS_IN_CROSSWORD: "Amount of characters (that act as columns) in row %row% of specified Crossword is different that amount of columns you have specified in Properties",
        DOUBLED_EXCLAMATION_MARK:               "You cannot type 2 exclamation marks in a row",
        LAST_CHARACTER_EXCLAMATION_MARK:        "You cannot type exclamation mark at the end of line",
        EXCLAMATION_MARK_BEFORE_EMPTY_FIELD:    "You cannot type exclamation mark before empty field"
    };

    presenter.VALIDATION_MODE = {
        COUNT_SCORE: 0,
        SHOW_ERRORS: 1
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
        presenter.tabIndexBase = ($("div.crossword_container").length * 5000) + 5000;
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

    presenter.isHorizontalWordBegin = function(i, j) {
        if(!presenter.wordNumbersHorizontal)
            return false;

        return (
            // Skip empty cells
            presenter.crossword[i][j] != ' ' &&

                // We don't have a letter on the left
                (j === 0 ||  presenter.crossword[i][j-1] == ' ') &&

                // We do have a letter on the right
                (presenter.columnCount > j+1 && presenter.crossword[i][j+1] != ' '));
    };

    presenter.isVerticalWordBegin = function(i, j) {
        if(!presenter.wordNumbersVertical)
            return false;

        return (
            // Skip empty cells
            presenter.crossword[i][j] != ' ' &&

                // We don't have a letter above
                (i === 0 ||  presenter.crossword[i-1][j] == ' ') &&

                // We do have a letter below
                (presenter.rowCount > i+1 && presenter.crossword[i+1][j] != ' '));
    };

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

    presenter.onCellInputKeyUp = function(event) {
        // Allow: backspace, delete, tab, shift and escape
        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 16 ||
            // Allow:  dot
            (event.keyCode == 190) ||
            // Allow: Ctrl+A
            (event.keyCode == 65 && event.ctrlKey === true) ||
            // Allow: home, end, left, right
            (event.keyCode >= 35 && event.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }

        event.target.value = event.target.value.toUpperCase();
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
        var usersLetter = event.target.value;
        var pos = presenter.getPosition($(event.target).parent(''));
        var correctLetter = presenter.crossword[pos.y][pos.x][0];
        var isOk = usersLetter === correctLetter;
        presenter.sendScoreEvent(pos, usersLetter, isOk);
        var score = isOk ? 1 : 0;
        if(score == 0 && presenter.blockWrongAnswers){
            event.target.value = "";
        }
    };

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

        var gridContainer = $('<div class="crossword_container"></div>');
        gridContainer
            .css({ width:      presenter.columnCount * presenter.cellWidth + 'px',
                height:     presenter.rowCount * presenter.cellHeight + 'px',
                marginLeft: -1 * Math.round(presenter.columnCount * presenter.cellWidth / 2) + 'px',
                marginTop:  -1 * Math.round(presenter.rowCount * presenter.cellHeight / 2) + 'px' });

        var tabIndexOffset = 0;
        for(var i = 0; i < presenter.rowCount; i++) {
            for(var j = 0; j < presenter.columnCount; j++) {
                var cellContainer = $('<div class="cell_container"></div>');
                cellContainer.css({ width:  presenter.cellWidth + 'px',
                    height: presenter.cellHeight + 'px' });

                var cell = $('<div class="cell"></div>')
                    .addClass('cell_' + i + 'x' + j)
                    .addClass('cell_row_' + i)
                    .addClass('cell_column_' + j);

                if(presenter.markedRowIndex > 0 && presenter.markedRowIndex == i+1) {
                    cell.addClass('cell_row_marked');
                }

                if(presenter.markedColumnIndex > 0 && presenter.markedColumnIndex == j+1) {
                    cell.addClass('cell_column_marked');
                }

                cellContainer.append(cell);

                if(presenter.crossword[i][j] == ' ') {
                    cell.addClass('cell_blank');
                    cellContainer.addClass('cell_container_blank');
                } else {
                    cell.addClass('cell_letter');
                    cellContainer.addClass('cell_container_letter');

                    var input = $('<input type="text" maxlength="1" size="1"/>');

                    if (presenter.crossword[i][j][0] === '!') {
                        input
                            .val(presenter.crossword[i][j][1])
                            .prop('disabled', true);

                        cell.addClass("cell_constant_letter");
                        cell.addClass("");
                    } else {
                        input
                            .attr('tabIndex', presenter.tabIndexBase + tabIndexOffset++)
                            .keyup(presenter.onCellInputKeyUp)
                            .focus(presenter.onCellInputFocus)
                            .mouseup(presenter.onCellInputMouseUp)
                            .focusout(presenter.onCellInputFocusOut)
                            .click(function(e) { e.stopPropagation(); });
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

                    if(horizontalWordBegin || verticalWordBegin) {
                        cell.addClass('cell_word_begin');

                        if(horizontalWordBegin)
                            cell.addClass('cell_word_begin_horizontal');

                        if(verticalWordBegin)
                            cell.addClass('cell_word_begin_vertical');

                        if(!presenter.disableAutomaticWordNumbering) {
                            var wordNumber = $('<div class="word_number"></div>').html(wordNumberCounter++);

                            cell.append(wordNumber);
                        }
                    }
                }

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
                    cell.addClass('cell_first_in_row');
                } else if(j == presenter.columnCount - 1) {
                    cell.addClass('cell_last_in_row');
                }

                if(i == 0) {
                    cell.addClass('cell_first_in_column');
                } else if(i == presenter.rowCount - 1) {
                    cell.addClass('cell_last_in_column');
                }

                gridContainer.append(cellContainer);
            }
        }

        presenter.$view.append(gridContainer);
    };

    function returnErrorMessage(errorMessage, errorMessageSubstitutions) {
        return {
            isError: true,
            errorMessage: errorMessage,
            errorMessageSubstitutions: errorMessageSubstitutions
        }
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

        presenter.blockWrongAnswers = ModelValidationUtils.validateBoolean(model.blockWrongAnswers);

        return {
            isError: false
        };
    };

    presenter.initializeLogic = function(view, model) {
        presenter.$view = $(view);
        presenter.ID = model.ID;

        var configuration = presenter.readConfiguration(model);
        if(configuration.isError) {
            presenter.showErrorMessage(configuration.errorMessage, configuration.errorMessageSubstitutions);
            return;
        }

        presenter.$view.find(".cell").live("blur", presenter.cellBlurEventHandler);
        presenter.prepareGrid(model);
        presenter.createGrid();
    };

    presenter.validate = function(mode) {
        var wordValid, k, l, score, markedCell;
        var filled = false;
        
        if (presenter.isShowAnswersActive && mode == presenter.VALIDATION_MODE.SHOW_ERRORS) {
            presenter.hideAnswers();
            for(var i = 0; i < presenter.rowCount; i++) {
                for(var j = 0; j < presenter.columnCount; j++) {
                    if(presenter.$view.find('.cell_' + i + 'x' + j + ' input').val() != '' && typeof(presenter.$view.find('.cell_' + i + 'x' + j + ' input').val()) !== "undefined" && presenter.crossword[i][j][0] !== '!') {
                        filled = true;
                    }
                 }
            }
            if (!filled) {
                return;
            }
        }

        if(mode == presenter.VALIDATION_MODE.SHOW_ERRORS) {
            presenter.$view.find(".cell_letter input").attr('disabled', true);
        } else if(mode == presenter.VALIDATION_MODE.COUNT_SCORE) {
            score = 0;
        }

        for(i = 0; i < presenter.rowCount; i++) {
            for(j = 0; j < presenter.columnCount; j++) {
                if(presenter.isHorizontalWordBegin(i, j)) {
                    wordValid = true;

                    for(k = j; k < presenter.columnCount; k++) {
                        if(presenter.crossword[i][k] == ' ') {
                            break;
                        }

                        if(presenter.crossword[i][k] != presenter.$view.find('.cell_' + i + 'x' + k + " input").attr('value').toUpperCase() && presenter.crossword[i][k][0] !== '!') {
                            wordValid = false;
                        }
                    }

                    if(mode == presenter.VALIDATION_MODE.COUNT_SCORE && wordValid) {
                        score++;
                    }

                    if(mode == presenter.VALIDATION_MODE.SHOW_ERRORS) {
                        for(l = j; l < k; l++) {
                            markedCell = presenter.$view.find('.cell_' + i + 'x' + l);
                            if(!markedCell.hasClass('cell_valid'))
                                markedCell.addClass('cell_' + (wordValid ? 'valid' : 'invalid'));

                            if(wordValid && markedCell.hasClass('cell_invalid'))
                                markedCell.removeClass('cell_invalid');
                        }
                    }
                }

                if(presenter.isVerticalWordBegin(i, j)) {
                    wordValid = true;

                    for(k = i; k < presenter.rowCount; k++) {
                        if(presenter.crossword[k][j] == ' ') {
                            break;
                        }

                        if(presenter.crossword[k][j] != presenter.$view.find('.cell_' + k + 'x' + j + " input").attr('value').toUpperCase() && presenter.crossword[k][j][0] !== '!') {
                            wordValid = false;
                        }
                    }

                    if(mode == presenter.VALIDATION_MODE.COUNT_SCORE && wordValid) {
                        score++;
                    }

                    if(mode == presenter.VALIDATION_MODE.SHOW_ERRORS) {
                        for(l = i; l < k; l++) {
                            markedCell = presenter.$view.find('.cell_' + l + 'x' + j);
                            if(!markedCell.hasClass('cell_valid'))
                                markedCell.addClass('cell_' + (wordValid ? 'valid' : 'invalid'));

                            if(wordValid && markedCell.hasClass('cell_invalid'))
                                markedCell.removeClass('cell_invalid');

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

        presenter.validate(presenter.VALIDATION_MODE.SHOW_ERRORS);
    };

    presenter.setWorkMode = function() {
        presenter.$view.find(".cell_letter:not(.cell_constant_letter) input").attr('disabled', false);
        presenter.$view.find(".cell_valid").removeClass("cell_valid");
        presenter.$view.find(".cell_invalid").removeClass("cell_invalid");
    };

    presenter.cellBlurEventHandler = function () {
        if (presenter.isAllOK()) {
            presenter.sendAllOKEvent();
        }
    };

    presenter.run = function(view, model) {
        presenter.preview = false;
        eventBus = playerController.getEventBus();
        presenter.initializeLogic(view, model);
        eventBus.addEventListener('ShowAnswers', this);
        eventBus.addEventListener('HideAnswers', this);
    };

    presenter.createPreview = function(view, model) {
        presenter.preview = true;
        presenter.initializeLogic(view, model);
    };

    presenter.reset = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
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
        presenter.setWorkMode();
    };

    presenter.isAttempted = function() {
        var countedConstantLetters = 0;

        jQuery.each(presenter.$view.find('.cell input'), function() {
            if (!ModelValidationUtils.isStringEmpty($(this).val())) countedConstantLetters++;
        });

        return presenter.numberOfConstantLetters < countedConstantLetters;
    };

    presenter.getScore = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        var score = presenter.validate(presenter.VALIDATION_MODE.COUNT_SCORE);

        return presenter.isAttempted() ? score : 0;
    };

    presenter.getMaxScore = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        return presenter.maxScore;
    };

    presenter.getErrorCount = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        var score = presenter.validate(presenter.VALIDATION_MODE.COUNT_SCORE),
            errorCount = presenter.getMaxScore() - score;

        return presenter.isAttempted() ? errorCount : 0;
    };

    presenter.getState = function() {
        var s = [];
        var cell;
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        for(var i = 0; i < presenter.rowCount; i++) {
            for(var j = 0; j < presenter.columnCount; j++) {
                cell = presenter.$view.find('.cell_' + i + 'x' + j + ' input').attr('value');
                if(typeof(cell) == "string")
                    cell = cell.replace("\"", "\\\"");

                s.push(cell);
            }
        }

        return "[\"" + s.join("\",\"") + "\"]";
    };

    presenter.setState = function(state) {
        var s = $.parseJSON(state.toString());
        var counter = 0;

        for(var i = 0; i < presenter.rowCount; i++) {
            for(var j = 0; j < presenter.columnCount; j++) {
                presenter.$view.find('.cell_' + i + 'x' + j + ' input').attr('value', s[counter]);
                counter++;
            }
        }
    };

    presenter.setPlayerController = function (controller) {
        playerController = controller;
    };

    presenter.executeCommand = function (name, params) {
        if (presenter.configuration.isErrorMode) return;

        var commands = {
            'isAllOK': presenter.isAllOK
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.isAllOK = function() {
        return presenter.getMaxScore() === presenter.getScore() && presenter.getErrorCount() === 0;
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

    presenter.sendScoreEvent = function(pos, value, isOk) {
        var item = '[row][col]'.replace('col', pos.x + 1).replace('row', pos.y + 1);
        var score = isOk ? '1' : '0';
        eventBus.sendEvent('ValueChanged', getEventObject(item, value, score));
    };

    presenter.onEventReceived = function (eventName) {
        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        }

        if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        }
    };

    presenter.showAnswers = function () {
        if (presenter.wordNumbersHorizontal || presenter.wordNumbersVertical) {
            if (presenter.isShowAnswersActive) {
                presenter.hideAnswers();
            }
            presenter.isShowAnswersActive = true;
            presenter.setWorkMode();
            presenter.userAnswers = new Array(presenter.rowCount);
            presenter.$view.find(".cell_letter input:enabled").attr('disabled', true);
            presenter.$view.find(".cell_letter input").addClass('crossword_cell_show-answers');

            for (var i = 0; i < presenter.rowCount; i++) {
                presenter.userAnswers[i] = new Array(presenter.columnCount);
                for(var j = 0; j < presenter.columnCount; j++) {
                    presenter.userAnswers[i][j] = presenter.$view.find('.cell_' + i + 'x' + j + ' input').val();
                    presenter.$view.find('.cell_' + i + 'x' + j + ' input').val(presenter.crossword[i][j].replace(/[!]/g,""));
                 }
            }
        }
    };
    
    presenter.hideAnswers = function () {
        if (presenter.wordNumbersHorizontal || presenter.wordNumbersVertical) {
            presenter.isShowAnswersActive = false;
            presenter.$view.find(".cell_letter input").attr('disabled', false);
            presenter.$view.find(".cell_letter input").removeClass('crossword_cell_show-answers');
            for (var i = 0; i < presenter.rowCount; i++) {
                for (var j = 0; j < presenter.columnCount; j++) {
                    presenter.$view.find('.cell_' + i + 'x' + j + ' input').val(presenter.userAnswers[i][j]);
                }
            }
        }
    };
    
    return presenter;
}