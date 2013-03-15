function AddonMagic_Boxes_create() {
    var presenter = function() { };

    var gridSelection = [];
    var goodSelections = [];
    var goodSelectionIndexes = [];

    var viewContainer;
    var gridContainerWrapper;
    var gridContainer;

    presenter.configuration = {
        rows: 0,
        columns: 0,
        gridElements: [],
        answers: []
    };

    var maxScore;
    var isSelectionPossible = true;

    presenter.ERROR_MESSAGES = {
        COLUMNS : "Inconsistent culumn size. Each row has to have same number of elements!",
        ROWS : "Inconsistent row definition. Whitespaces, semicolons and commas aren't alowed in grid!",
        ANSWERS_NOT_PROVIDED : "Answers section is missing or empty!",
        GRID_NOT_PROVIDED : "Grid definition missing or empty!"
    };

    function showErrorMessage(errorMessage) {
        var errorContainer = '<p>' + errorMessage + '</p>';
        viewContainer.html(errorContainer);
    }

    function reverseString(text) {
        var splitedText = text.split("");
        var reversedText = splitedText.reverse();

        return reversedText.join("");
    }

    function initGridSelection() {
        for(var row = 0; row < presenter.configuration.rows; row++) {
            gridSelection[row] = [];
            for(var column = 0; column < presenter.configuration.columns; column++) {
                gridSelection[row][column] = false;
            }
        }
    }

    function getElementDimensions(element) {
        element = $(element);

        return {
            border:{
                top:parseInt(element.css('border-top-width'), 10),
                bottom:parseInt(element.css('border-bottom-width'), 10),
                left:parseInt(element.css('border-left-width'), 10),
                right:parseInt(element.css('border-right-width'), 10)
            },
            margin:{
                top:parseInt(element.css('margin-top'), 10),
                bottom:parseInt(element.css('margin-bottom'), 10),
                left:parseInt(element.css('margin-left'), 10),
                right:parseInt(element.css('margin-right'), 10)
            },
            padding:{
                top:parseInt(element.css('padding-top'), 10),
                bottom:parseInt(element.css('padding-bottom'), 10),
                left:parseInt(element.css('padding-left'), 10),
                right:parseInt(element.css('padding-right'), 10)
            }
        };
    }

    function calculateInnerDistance(elementDimensions) {
        var vertical = elementDimensions.border.top + elementDimensions.border.bottom;
        vertical += elementDimensions.margin.top + elementDimensions.margin.bottom;
        vertical += elementDimensions.padding.top + elementDimensions.padding.top;

        var horizontal = elementDimensions.border.left + elementDimensions.border.right;
        horizontal += elementDimensions.margin.left + elementDimensions.margin.right;
        horizontal += elementDimensions.padding.left + elementDimensions.padding.right;

        return {
            vertical : vertical,
            horizontal : horizontal
        };
    }

    function initGrid(model, preview) {
        var rows = presenter.configuration.rows;
        var columns = presenter.configuration.columns;

        for(var row = 0; row < rows; row++) {
            for(var column = 0; column < columns; column++) {
                var wrapperElement = $(document.createElement('div'));
                wrapperElement.addClass('selectable-element-wrapper');

                var selectableElement = $(document.createElement('div'));
                selectableElement.addClass('selectable-element');
                selectableElement.text(presenter.configuration.gridElements[row][column].toUpperCase());

                wrapperElement.append(selectableElement);
                gridContainer.append(wrapperElement);
            }
        }

        var gridContainerWrapperDimensions = getElementDimensions(gridContainerWrapper);
        var gridContainerWrapperDistances = calculateInnerDistance(gridContainerWrapperDimensions);

        var wrapperDimensions = getElementDimensions(gridContainerWrapper.find('.selectable-element-wrapper:first')[0]);
        var wrapperDistances = calculateInnerDistance(wrapperDimensions);

        var elementDimensions = getElementDimensions(gridContainerWrapper.find('.selectable-element:first')[0]);
        var elementDistances = calculateInnerDistance(elementDimensions);

        var wrapperWidth = parseInt((model.Width - gridContainerWrapperDistances.horizontal - (wrapperDistances.horizontal * columns)) / columns, 10);
        var wrapperHeight = parseInt((model.Height - gridContainerWrapperDistances.vertical - (wrapperDistances.vertical * rows)) / rows, 10);

        var elementWidth = wrapperWidth - elementDistances.horizontal;
        var elementHeight = wrapperHeight - elementDistances.vertical;

        var newContainerWrapperHeight = wrapperHeight * rows + wrapperDistances.vertical * rows;
        var newContainerWrapperWidth = wrapperWidth * columns + wrapperDistances.horizontal * columns;

        var verticalGap = model.Height - newContainerWrapperHeight;
        var horizontalGap = model.Width - newContainerWrapperWidth;

        gridContainerWrapper.css('height', model.Height + 'px');
        gridContainerWrapper.css('width', model.Width + 'px');
        gridContainer.css('height', model.Height + 'px');
        gridContainer.css('width', model.Width + 'px');

        gridContainer.find(".selectable-element-wrapper").each(function() {
            var index = $(this).index();
            var selectedRow = parseInt(index / columns, 10);
            var selectedColumn = parseInt(index % columns, 10);

            $(this).width(selectedColumn === columns - 1 ? wrapperWidth + horizontalGap : wrapperWidth);
            $(this).height(selectedRow === rows - 1 ? wrapperHeight + verticalGap : wrapperHeight);

            var selectableElement = $(this).find('.selectable-element:first');
            selectableElement.width(selectedColumn === columns - 1 ? elementWidth + horizontalGap : elementWidth);
            selectableElement.height(selectedRow === rows -1 ? elementHeight + verticalGap : elementHeight);
            var lineHeight = selectedRow === rows -1 ? elementHeight + verticalGap : elementHeight;
            selectableElement.css('line-height', lineHeight + "px");

            applySelectionStyle(selectedRow, selectedColumn);
            if (!preview) {
                selectableElement.click(function(){
                    selectionHandler(selectedRow, selectedColumn);
                });
            }
        });
    }

    function selectionHandler(row, column) {
        if(isSelectionPossible) {
            gridSelection[row][column] = gridSelection[row][column] ? false : true;
            applySelectionStyle(row, column);
        }
    }

    function applySelectionStyle(row, column) {
        var index = row * presenter.configuration.columns + column;
        var element = gridContainerWrapper.find(".selectable-element:eq(" + index + ")");

        if(gridSelection[row][column]) {// is selected
            if(!element.hasClass('selectable-element-selected')) {
                element.addClass('selectable-element-selected');
            }
        } else {
            if(element.hasClass('selectable-element-selected')) {
                element.removeClass('selectable-element-selected');
            }
        }
    }

    function applyAnswerStyles() {
        gridContainerWrapper.find(".selectable-element").each(function(index) {
            if(!$(this).hasClass("selectable-element-selected")) {
                return true; // jQeury equivalent of continue
            }

            var className = goodSelectionIndexes[index] != -1 ? 'selectable-element-selected-correct' : 'selectable-element-selected-uncorrect'
            $(this).addClass(className);
        });
    }

    function cleanAnswersStyles() {
        // Clearing correct/uncorrect styles which where set when user
        // pressed 'check answers' button.
        gridContainerWrapper.find(".selectable-element").each(function() {
            if($(this).hasClass('selectable-element-selected-correct')) {
                $(this).removeClass('selectable-element-selected-correct');
            }
            if($(this).hasClass('selectable-element-selected-uncorrect')) {
                $(this).removeClass('selectable-element-selected-uncorrect');
            }
        });
    }

    presenter.reset = function() {
        isSelectionPossible = true;

        cleanAnswersStyles();

        for(var row = 0; row < presenter.configuration.rows; row++) {
            for(var column = 0; column < presenter.configuration.columns; column++) {
                gridSelection[row][column] = false;
                applySelectionStyle(row, column);
            }
        }
    };

    presenter.setShowErrorsMode = function() {
        isSelectionPossible = false;
        var rows = presenter.configuration.rows;
        var columns = presenter.configuration.columns;

        goodSelectionIndexes = presenter.convertSelectionToIndexes(goodSelections, rows, columns);

        applyAnswerStyles();
    };

    presenter.setWorkMode = function() {
        cleanAnswersStyles();

        for(var row = 0; row < presenter.configuration.rows; row++) {
            for(var column = 0; column < presenter.configuration.columns; column++) {
                applySelectionStyle(row, column);
            }
        }

        isSelectionPossible = true;
    };

    presenter.getMaxScore = function() {
        return maxScore;
    };

    presenter.getScore = function() {
        return presenter.calculateScore(goodSelections, gridSelection).correct;
    };

    presenter.getErrorCount = function() {
        return presenter.calculateScore(goodSelections, gridSelection).errors;
    };

    presenter.serializeGridSelection = function(gridSelection, rows, columns) {
        var serializedArray = '';
        var counter = 0;

        for(var row = 0; row < rows; row++) {
            for(var column = 0; column < columns; column++) {
                if(gridSelection[row][column]) {
                    counter++;
                    var index = row * columns + column;
                    serializedArray += index.toString() + ',';
                }
            }
        }

        // Remove last comma separator
        if(counter !== 0) {
            serializedArray = serializedArray.substr(0, serializedArray.length - 1);
        }

        return serializedArray;
    };

    presenter.deserialiseGridSelection = function(serializedArray) {
        var deserialisedArray = [];
        if (serializedArray.length === 0) {
            return deserialisedArray;
        }

        var splittedArray = serializedArray.split(',');

        for(var i = 0; i < splittedArray.length; i++) {
            var index = parseInt(splittedArray[i], 10);
            deserialisedArray.push(index);
        }

        return deserialisedArray;
    };

    presenter.getState = function() {
        var rows = presenter.configuration.rows;
        var columns = presenter.configuration.columns;

        return presenter.serializeGridSelection(gridSelection, rows, columns);
    };

    presenter.setState = function(state) {
        var rows = presenter.configuration.rows;
        var columns = presenter.configuration.columns;
        var row;
        var column;

        initGridSelection();

        var dematerialisedState = presenter.deserialiseGridSelection(state);

        for(var i = 0; i < dematerialisedState.length; i++) {
            row = parseInt(dematerialisedState[i] / columns, 10);
            column = parseInt(dematerialisedState[i] % columns, 10);
            gridSelection[row][column] = true;
        }

        for(row = 0; row < rows; row++) {
            for(column = 0; column < columns; column++) {
                applySelectionStyle(row, column);
            }
        }
    };

    function presenterLogic(view, model, preview){
        viewContainer = $(view);
        gridContainerWrapper = viewContainer.find(".magicGridWrapper:first");
        gridContainer = gridContainerWrapper.find(".magicGrid:first");
        presenter.configuration = presenter.validateModel(model);
        if(presenter.configuration.isError) {
            showErrorMessage(presenter.configuration.errorMessage);
        } else {
            initGridSelection();
            initGrid(model, preview);
            goodSelections = presenter.findGoodSelections(presenter.configuration.gridElements, presenter.configuration.answers);
            maxScore = presenter.calculateMaxScore(goodSelections);

            if (preview) {
                gridSelection = goodSelections;
                presenter.setWorkMode();
            }
        }
    }

    presenter.createPreview = function(view, model) {
        presenterLogic(view, model, true);
    };

    presenter.run = function(view, model) {
        presenterLogic(view, model, false);
    };

    presenter.isWordInRow = function(grid, row, word) {
        word = word.toLowerCase();
        var positions = [];

        if (word.length > grid[row].length) {
            return {
                wordFound: false,
                positions: positions
            };
        }

        for (var i = 0; i < (grid[row].length - word.length + 1); i++) {
            var gridWord = "";

            for (var j = 0; j < word.length; j++) {
                gridWord += grid[row][j + i].toLowerCase();
            }

            if (gridWord === word || reverseString(gridWord) === word) {
                positions.push(i);
            }
        }

        return {
            wordFound: positions.length > 0,
            positions: positions
        };
    };

    presenter.isWordInColumn = function(grid, column, word) {
        var positions = [];
        word = word.toLowerCase();

        if (word.length > grid.length) {
            return {
                wordFound: false,
                positions: positions
            };
        }

        for (var i = 0; i < (grid.length - word.length + 1); i++) {
            var gridWord = "";

            for (var j = 0; j < word.length; j++) {
                gridWord += grid[j + i][column].toLowerCase();
            }

            if (gridWord === word || reverseString(gridWord) === word) {
                positions.push(i);
            }
        }

        return {
            wordFound: positions.length > 0,
            positions: positions
        };
    };

    presenter.DIAGONALS = {
        NORMAL: 0,
        REVERSED: 1
    };

    presenter.isWordOnDiagonals = function(grid, word, direction) {
        var rows = grid.length;
        var columns = grid[0].length;
        var positions = [];
        word = word.toLowerCase();

        if (word.length > rows || word.length > columns) {
            return {
                wordFound: false,
                positions: positions
            };
        }

        for (var row = 0; row < rows; row++) {
            for (var column = 0; column < columns; column++) {
                var columnCondition = direction === presenter.DIAGONALS.NORMAL ? word.length <= columns - column : word.length <= column + 1;
                var isWordSmallEnough = word.length <= (rows - row);
                isWordSmallEnough = isWordSmallEnough && columnCondition;

                if (isWordSmallEnough) {
                    var gridWord = "";

                    for (var i = 0; i < word.length; i++) {
                        var columnIndex = direction === presenter.DIAGONALS.NORMAL ? column + i : column - i;
                        gridWord += grid[row + i][columnIndex].toLowerCase();
                    }

                    if (gridWord === word || reverseString(gridWord) === word) {
                        positions.push({
                            row: row,
                            column: column
                        });
                    }
                }
            }
        }

        return {
            wordFound: positions.length > 0,
            positions: positions
        };
    };

    presenter.findGoodSelections = function (grid, answers) {
        var goodSelections = [];
        var l;

        for (var i = 0; i < answers.length; i++) {
            var answer = answers[i].toString();

            // Horizontal words
            for (var r = 0; r < grid.length; r++) {
                var horizontalResult = presenter.isWordInRow(grid, r, answer);
                for (var hr = 0; hr < horizontalResult.positions.length; hr++) {
                    for (l = 0; l < answer.length; l++) {
                        goodSelections.push({
                            row: r,
                            column: horizontalResult.positions[hr] + l
                        });
                    }
                }
            }

            // Vertical words
            for (var c = 0; c < grid[0].length; c++) {
                var verticalResult = presenter.isWordInColumn(grid, c, answer);
                for (var vr = 0; vr < verticalResult.positions.length; vr++) {
                    for (l = 0; l < answer.length; l++) {
                        goodSelections.push({
                            row: verticalResult.positions[vr] + l,
                            column: c
                        });
                    }
                }
            }

            // Diagonal words
            var diagonalResult = presenter.isWordOnDiagonals(grid, answer, presenter.DIAGONALS.NORMAL);
            for (var dr = 0; dr < diagonalResult.positions.length; dr++) {
                for (l = 0; l < answer.length; l++) {
                    goodSelections.push({
                        row: diagonalResult.positions[dr].row + l,
                        column: diagonalResult.positions[dr].column + l
                    });
                }
            }

            // Reverse diagonal words
            var reverseDiagonalResult = presenter.isWordOnDiagonals(grid, answer, presenter.DIAGONALS.REVERSED);
            for (var rdr = 0; rdr < reverseDiagonalResult.positions.length; rdr++) {
                for (l = 0; l < answer.length; l++) {
                    goodSelections.push({
                        row: reverseDiagonalResult.positions[rdr].row + l,
                        column: reverseDiagonalResult.positions[rdr].column - l
                    });
                }
            }
        }

        var rows = grid.length;
        var columns = grid[0].length;

        return presenter.convertSelectionToArray(goodSelections, rows, columns);
    };

    presenter.convertSelectionToArray = function (selections, rows, columns) {
        var selectionArray = [];
        for (var i = 0; i < rows; i++) {
            selectionArray[i] = [];

            for (var j = 0; j < columns; j++) {
                selectionArray[i][j] = false;
            }
        }

        for (var s = 0; s < selections.length; s++) {
            var row = selections[s].row;
            var column = selections[s].column;

            selectionArray[row][column] = true;
        }

        return selectionArray;
    };

    presenter.convertSelectionToIndexes = function (selections, rows, columns) {
        var selectionIndexes = [];

        for(var row = 0; row < rows; row++) {
            for(var column = 0; column < columns; column++) {
                var index = row * columns + column;
                if (selections[row][column]) {
                    selectionIndexes[index] = 1;
                } else {
                    selectionIndexes[index] = -1;
                }
            }
        }

        return selectionIndexes;
    };

    presenter.calculateMaxScore = function(goodSelections) {
        var rows = goodSelections.length;
        var columns = goodSelections[0].length;

        var maxScore = 0;

        for (var row = 0; row < rows; row++) {
            for (var column = 0; column < columns; column++) {
                if (goodSelections[row][column]) {
                    maxScore++;
                }
            }
        }

        return maxScore;
    };

    presenter.calculateScore = function (goodSelections, selections) {
        var correct = 0;
        var errors = 0;

        var rows = goodSelections.length;
        var columns = goodSelections[0].length;

        for (var row = 0; row < rows; row++) {
            for (var column = 0; column < columns; column++) {
                if (selections[row][column]) {
                    if (selections[row][column] === goodSelections[row][column]) {
                        correct++;
                    } else {
                        errors++;
                    }
                }
            }
        }

        return {
            correct: correct,
            errors: errors
        };
    };

    presenter.validateGrid = function(gridDefinition) {
        var gridElements = [];
        var columnCount = 0;
        var rowCount = 0;

        if(typeof gridDefinition === "undefined" || gridDefinition.length === 0) {
            return {
                isError: true,
                errorMessage: presenter.ERROR_MESSAGES.GRID_NOT_PROVIDED
            };
        }

        // Following StackOverflow suggestion : replace -> split
        // http://stackoverflow.com/questions/5034781/js-regex-to-split-by-line
        var rowsArray = $(gridDefinition.split("\n"));
        for (var i = 0; i < rowsArray.length; i++) {
            var row = String(rowsArray[i]);
            if (row.length === 0) {
                return {
                    isError: true,
                    errorMessage: presenter.ERROR_MESSAGES.ROWS
                };
            }

            if(row.search(/[\s\,\;]+/gm) != -1) { // Search for whitespace characters
                return {
                    isError: true,
                    errorMessage: presenter.ERROR_MESSAGES.ROWS
                };
            }

            gridElements[i] = row.split("");

            // Parsing grid definition
            if(rowCount === 0) {
                columnCount = row.length;
            }

            if(columnCount != row.length) {
                return {
                    isError: true,
                    errorMessage: presenter.ERROR_MESSAGES.COLUMNS
                };
            }

            rowCount++;
        }

        return {
            isError: false,
            columns: columnCount,
            rows: rowCount,
            gridElements: gridElements
        };
    };

    presenter.validateAnswers = function(answersDefinition) {
        var answers = [];

        if(typeof answersDefinition === "undefined" || answersDefinition.length === 0) {
            return {
                isError: true,
                errorMessage: presenter.ERROR_MESSAGES.ANSWERS_NOT_PROVIDED
            };
        }

        $(answersDefinition.split("\n")).each(function() {
            var answer = String(this);
            $(answer.split(/[\s\,\;]+/gm)).each(function() {
                answers.push(this);
            });
        });

        return {
            isError: false,
            answers: answers
        };
    };

    presenter.validateModel = function(model) {
        var gridDefinition = model.Grid;
        var answersDefinition = model.Answers;

        var gridValidationResult = presenter.validateGrid(gridDefinition);
        if (gridValidationResult.isError) {
            return {
                isError: true,
                errorMessage: gridValidationResult.errorMessage
            };
        }

        var answersValidationResult = presenter.validateAnswers(answersDefinition);
        if (answersValidationResult.isError) {
            return {
                isError: true,
                errorMessage: answersValidationResult.errorMessage
            };
        }

        return {
            isError: false,
            columns: gridValidationResult.columns,
            rows: gridValidationResult.rows,
            gridElements: gridValidationResult.gridElements,
            answers: answersValidationResult.answers
        };
    };

    return presenter;
}