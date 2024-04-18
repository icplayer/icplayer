function AddonMagic_Boxes_create() {
    var presenter = function() { };

    var gridSelection = [];
    var goodSelections = [];
    var goodSelectionIndexes = [];
    var correctAnswers = [];
    var GSALetterCounter = 0;
    var usedGSAKeys = [];
    presenter.answerWords = {};
    presenter.GSAcorrectAnswerLocations = {};
    

    var gridContainerWrapper;
    var gridContainer;
    var playerController;
    var eventBus;
    var maxScore;

    presenter.isSelectionPossible = true;

    presenter.isWCAGOn = false;
    presenter.keyboardControllerObject = null;

    presenter.configuration = {
        rows: 0,
        columns: 0,
        gridElements: [],
        answers: [],
    };

    presenter.ERROR_MESSAGES = {
        COLUMNS : "Inconsistent column size. Each row has to have same number of elements!",
        ROWS : "Inconsistent row definition. Whitespaces, semicolons and commas aren't alowed in grid!",
        ANSWERS_NOT_PROVIDED : "Answers section is missing or empty!",
        GRID_NOT_PROVIDED : "Grid definition missing or empty!"
    };

    presenter.DEFAULT_TTS_PHRASES = {
        CELL: "Cell",
        SELECTED: "Selected",
        DESELECTED: "Deselected",
        CORRECT: "Correct",
        WRONG: "Wrong",
    };

    presenter.CSS_CLASSES = {
        GRID_WRAPPER: "magicGridWrapper",
        ELEMENT_WRAPPER: "selectable-element-wrapper",
        ELEMENT: "selectable-element",
        SELECTED: "selectable-element-selected",
        CORRECT_SELECTED: "selectable-element-selected-correct",
        WRONG_SELECTED: "selectable-element-selected-uncorrect",
        SHOW_ANSWERS: "selectable-element-show-answers",
    };

    presenter.setPlayerController = function (controller) {
        playerController = controller;
    };

    function showErrorMessage(errorMessage) {
        var errorContainer = '<p>' + errorMessage + '</p>';
        presenter.$view.html(errorContainer);
    }

    function reverseString(text) {
        var splitedText = text.split("");
        var reversedText = splitedText.reverse();

        return reversedText.join("");
    }

    function initGridSelection() {
        for(var row = 0; row < presenter.configuration.rows; row++) {
            gridSelection[row] = [];
            correctAnswers[row] = [];
            for(var column = 0; column < presenter.configuration.columns; column++) {
                gridSelection[row][column] = false;
                correctAnswers[row][column] = false;
            }
        }
    }

    function clearCorrectAnswers() {
        for(var row = 0; row < presenter.configuration.rows; row++) {
            correctAnswers[row] = [];
            for(var column = 0; column < presenter.configuration.columns; column++) {
                correctAnswers[row][column] = false;
            }
        }
    }

    function getElementDimensions(element) {
        element = $(element);
        
        return {
            border:{
                top:parseFloat(element.css('border-top-width'), 10),
                bottom:parseFloat(element.css('border-bottom-width'), 10),
                left:parseFloat(element.css('border-left-width'), 10),
                right:parseFloat(element.css('border-right-width'), 10)
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

    function fixTouch (touch) {
        var winPageX = window.pageXOffset,
            winPageY = window.pageYOffset,
            x = touch.clientX,
            y = touch.clientY;

        if (touch.pageY === 0 && Math.floor(y) > Math.floor(touch.pageY) ||
            touch.pageX === 0 && Math.floor(x) > Math.floor(touch.pageX)) {
            // iOS4 clientX/clientY have the value that should have been
            // in pageX/pageY. While pageX/page/ have the value 0
            x = x - winPageX;
            y = y - winPageY;
        } else if (y < (touch.pageY - winPageY) || x < (touch.pageX - winPageX) ) {
            // Some Android browsers have totally bogus values for clientX/Y
            // when scrolling/zooming a page. Detectable since clientX/clientY
            // should never be smaller than pageX/pageY minus page scroll
            x = touch.pageX - winPageX;
            y = touch.pageY - winPageY;
        }

        return {
            x: x,
            y: y
        };
    }

    function initGrid(model, preview) {
        var rows = presenter.configuration.rows;
        var columns = presenter.configuration.columns;

        for(var row = 0; row < rows; row++) {
            for(var column = 0; column < columns; column++) {
                var wrapperElement = $(document.createElement('div'));
                wrapperElement.addClass(presenter.CSS_CLASSES.ELEMENT_WRAPPER);

                var selectableElement = $(document.createElement('div'));
                selectableElement.addClass(presenter.CSS_CLASSES.ELEMENT);
                var rawChar = presenter.configuration.gridElements[row][column];
                var charToShow = isCharacterToCapitalize(rawChar) ? rawChar.toUpperCase() : rawChar;
                selectableElement.text(charToShow);

                wrapperElement.append(selectableElement);
                gridContainer.append(wrapperElement);
            }
        }

        var gridContainerWrapperDimensions = getElementDimensions(gridContainerWrapper);
        var gridContainerWrapperDistances = calculateInnerDistance(gridContainerWrapperDimensions);

        var wrapperDimensions = getElementDimensions(gridContainerWrapper.find(`.${presenter.CSS_CLASSES.ELEMENT_WRAPPER}:first`)[0]);
        var wrapperDistances = calculateInnerDistance(wrapperDimensions);

        var elementDimensions = getElementDimensions(gridContainerWrapper.find(`.${presenter.CSS_CLASSES.ELEMENT}:first`)[0]);
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

        presenter.isMouseDown = false;

        if (MobileUtils.isEventSupported('touchstart')) {
            var selectedIndex = null;

            presenter.$view.find('.magicGrid').on('touchmove', function (e) {
                e.stopPropagation();
                e.preventDefault();

                var client = fixTouch(e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]);

                var element = document.elementFromPoint(client.x, client.y);
                var index = $(element).parent().index();
                var selectedRow = parseInt(index / columns, 10);
                var selectedColumn = parseInt(index % columns, 10);
                if(index != selectedIndex && $(element).parent().hasClass(presenter.CSS_CLASSES.ELEMENT_WRAPPER)){
                    selectionHandler(selectedRow, selectedColumn);
                    selectedIndex = index;
                }
            });
        }else{
            var $magicWrapper = presenter.$view.find(`.${presenter.CSS_CLASSES.GRID_WRAPPER}`);
            $magicWrapper.on('mousedown', function () {
                presenter.isMouseDown = true;
            });

            $magicWrapper.on('mouseup', function () {
                presenter.isMouseDown = false;
            });

            $magicWrapper.on('mouseleave', function () {
                presenter.isMouseDown = false;
            });
        }

        gridContainer.find(`.${presenter.CSS_CLASSES.ELEMENT_WRAPPER}`).each(function() {
            var index = $(this).index();
            var selectedRow = parseInt(index / columns, 10);
            var selectedColumn = parseInt(index % columns, 10);

            $(this).width(wrapperWidth + horizontalGap / columns);
            $(this).height(wrapperHeight + verticalGap / rows);

            var selectableElement = $(this).find(`.${presenter.CSS_CLASSES.ELEMENT}:first`);
            selectableElement.width(elementWidth + horizontalGap / columns);
            selectableElement.height(elementHeight + verticalGap / rows);
            var lineHeight = selectedRow === rows -1 ? elementHeight + verticalGap : elementHeight;
            selectableElement.css('line-height', lineHeight + "px");

            applySelectionStyle(selectedRow, selectedColumn);
            if (!preview) {
                if (MobileUtils.isEventSupported('touchstart')) {
                    function handler(e){
                        e.stopPropagation();
                        e.preventDefault();
                        selectionHandler(selectedRow, selectedColumn);
                        $(this).unbind('click');
                        setTimeout(function(){selectableElement.click(handler)}, 500);
                    }

                    selectableElement.click(handler);
                }else{
                    presenter.wasMoved = false;
                    selectableElement.on('mousemove', function (e) {
                        e.preventDefault();
                        if(presenter.isMouseDown && !presenter.wasMoved){
                            selectionHandler(selectedRow, selectedColumn);
                            presenter.wasMoved = true;
                        }
                    });

                    selectableElement.on('mouseout', function (e) {
                        e.stopPropagation();
                        e.preventDefault();
                        presenter.wasMoved = false;
                    });

                    selectableElement.on('mousedown', function (e) {
                        e.stopPropagation();
                        e.preventDefault();
                        presenter.isMouseDown = true;
                        selectionHandler(selectedRow, selectedColumn);
                        presenter.wasMoved = true;
                    });

                    selectableElement.on('mouseup', function (e) {
                        e.stopPropagation();
                        e.preventDefault();
                        presenter.isMouseDown = false;
                    });
                }
            }
        });
    }

    function isCharacterToCapitalize (character) {
        return !(/\u00DF/.test(character));
    }

    presenter.calculateScoreForEvent = function (prevScore, currentScore) {
        var score;
        if(currentScore > prevScore){
            score = 1;
        }else{
            score = 0;
        }

        return score;
    };

    function selectionHandler(row, column) {
        var prevScore = presenter.getScore();
        if(presenter.isSelectionPossible) {
            gridSelection[row][column] = gridSelection[row][column] ? false : true;
            applySelectionStyle(row, column);

            var item = (row+1) +"-"+ (column+1);
            var index = row * presenter.configuration.columns + column;
            var element = gridContainerWrapper.find(`.${presenter.CSS_CLASSES.ELEMENT}:eq(${index})`);
            var currentScore = presenter.getScore();

            var eventData = presenter.createEventData(item, element.text(), presenter.calculateScoreForEvent(prevScore, currentScore));
            eventBus.sendEvent('ValueChanged', eventData);

            if(presenter.isAllOK()){
                var allOKEventData = presenter.createAllOKEventData();
                eventBus.sendEvent('ValueChanged', allOKEventData);
            }
        }
    }

    function applySelectionStyle(row, column) {
        if (row >= presenter.configuration.rows || column >= presenter.configuration.columns) return;
        var index = row * presenter.configuration.columns + column;
        var element = gridContainerWrapper.find(`.${presenter.CSS_CLASSES.ELEMENT}:eq(${index})`);

        if(gridSelection[row][column]) {// is selected
            if(!element.hasClass(presenter.CSS_CLASSES.SELECTED)) {
                element.addClass(presenter.CSS_CLASSES.SELECTED);
            }
        } else {
            if(element.hasClass(presenter.CSS_CLASSES.SELECTED)) {
                element.removeClass(presenter.CSS_CLASSES.SELECTED);
            }
        }
    }

    function applyAnswerStyles() {
        if(presenter.configuration.checkByWords){
            gridContainerWrapper.find(`.${presenter.CSS_CLASSES.ELEMENT}`).each(function(index) {
                if($(this).hasClass(presenter.CSS_CLASSES.SELECTED)){
                    $(this).addClass(presenter.CSS_CLASSES.WRONG_SELECTED);
                }
            });

            for (var i=0; i<presenter.configuration.answers.length; i++){
                if(presenter.checkIfWordIsSelected(presenter.configuration.answers[i].toString())){
                    var word = presenter.configuration.answers[i].toString();
                    for(var j=0; j < presenter.answerWords[word.toLowerCase()].column.length; j++){
                        var index = presenter.answerWords[word.toLowerCase()].row[j] * presenter.configuration.columns + presenter.answerWords[word.toLowerCase()].column[j];
                        var element = gridContainerWrapper.find(`.${presenter.CSS_CLASSES.ELEMENT}:eq(${index})`);
                        element.removeClass(presenter.CSS_CLASSES.WRONG_SELECTED);
                        element.addClass(presenter.CSS_CLASSES.CORRECT_SELECTED);
                    }
                }
            }
        }else{
            gridContainerWrapper.find(`.${presenter.CSS_CLASSES.ELEMENT}`).each(function(index) {
                if(!$(this).hasClass(presenter.CSS_CLASSES.SELECTED)) {
                    return true; // jQeury equivalent of continue
                }

                var className;

                if(goodSelectionIndexes[index] != -1){
                    className = presenter.CSS_CLASSES.CORRECT_SELECTED;
                }else{
                    className = presenter.CSS_CLASSES.WRONG_SELECTED;
                }

                $(this).addClass(className);
            });
        }
    }

    function cleanAnswersStyles() {
        // Clearing correct/uncorrect styles which where set when user
        // pressed 'check answers' button.
        gridContainerWrapper.find(`.${presenter.CSS_CLASSES.ELEMENT}`).each(function() {
            if($(this).hasClass(presenter.CSS_CLASSES.CORRECT_SELECTED)) {
                $(this).removeClass(presenter.CSS_CLASSES.CORRECT_SELECTED);
            }
            if($(this).hasClass(presenter.CSS_CLASSES.WRONG_SELECTED)) {
                $(this).removeClass(presenter.CSS_CLASSES.WRONG_SELECTED);
            }
        });
    }

    presenter.reset = function() {
        if(presenter.isShowAnswersActive){
            presenter.hideAnswers();
        }

        presenter.isSelectionPossible = true;

        cleanAnswersStyles();

        for(var row = 0; row < presenter.configuration.rows; row++) {
            for(var column = 0; column < presenter.configuration.columns; column++) {
                gridSelection[row][column] = false;
                applySelectionStyle(row, column);
            }
        }
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);
        presenter.configuration.isVisible = presenter.isVisibleByDefault;
    };

    presenter.setShowErrorsMode = function() {
        if(presenter.isShowAnswersActive){
            presenter.hideAnswers();
        }

        presenter.isSelectionPossible = false;
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

        presenter.isSelectionPossible = true;
    };

    presenter.getMaxScore = function() {
        if(presenter.configuration.isError){
            return 0;
        }

        return maxScore;
    };

    presenter.getScore = function() {
        if(presenter.configuration.isError){
            return 0;
        }

        if(presenter.configuration.checkByWords){
            return presenter.countScoreForWords().score;
        }else{
            return presenter.calculateScore(goodSelections, gridSelection).correct;
        }
    };

    presenter.getErrorCount = function() {
        if(presenter.configuration.isError){
            return 0;
        }

        if(presenter.configuration.checkByWords){
            if(presenter.isAttempted()){
                return presenter.countScoreForWords().errors;
            }else{
                return 0;
            }
        }else{
            return presenter.calculateScore(goodSelections, gridSelection).errors;
        }
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

        return JSON.stringify({
            serializeGridSelection: presenter.serializeGridSelection(gridSelection, rows, columns),
            isVisible: presenter.configuration.isVisible
        });
    };

    presenter.setState = function(state) {
        var rows = presenter.configuration.rows;
        var columns = presenter.configuration.columns;
        var row;
        var column;

        initGridSelection();

        var serializeGridSelection, parsedState;
        if (state.indexOf("}") > -1 && state.indexOf("{") > -1){
            parsedState = JSON.parse(state);
            serializeGridSelection = parsedState.serializeGridSelection;
        }else{
            serializeGridSelection = state;
            parsedState = undefined;
        }

        var dematerialisedState = presenter.deserialiseGridSelection(serializeGridSelection);

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

        if(parsedState){
            if(parsedState.isVisible != undefined){
                presenter.setVisibility(parsedState.isVisible);
                presenter.configuration.isVisible = parsedState.isVisible;
            }
        }
    };

    presenter.initializeCorrectAnswerLocations = function () {
        for(var i = 0; i< presenter.configuration.answers.length; i++){
            presenter.answerWords[presenter.configuration.answers[i].toString().toLowerCase()] = {
                row : [],
                column : []
            };
            presenter.GSAcorrectAnswerLocations[presenter.configuration.answers[i].toString().toLowerCase()] = {
                row : [],
                column : []
            };
        }
    };

    function presenterLogic(view, model, isPreview){
        presenter.view = view;
        presenter.$view = $(view);
        gridContainerWrapper = presenter.$view.find(`.${presenter.CSS_CLASSES.GRID_WRAPPER}:first`);
        gridContainer = gridContainerWrapper.find(".magicGrid:first");

        let upgradedModel = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(upgradedModel);
        presenter.setSpeechTexts(upgradedModel['speechTexts']);

        presenter.setVisibility(presenter.configuration.isVisible || isPreview);

        if(presenter.configuration.answers){
            presenter.initializeCorrectAnswerLocations();
        }

        if(presenter.configuration.isError) {
            showErrorMessage(presenter.configuration.errorMessage);
        } else {
            initGridSelection();
            initGrid(model, isPreview);
            goodSelections = presenter.findGoodSelections(presenter.configuration.gridElements, presenter.configuration.answers);

            if(presenter.configuration.checkByWords){
                maxScore = presenter.configuration.answers.length;
            }else{
                maxScore = presenter.calculateMaxScore(goodSelections);
            }

            if (isPreview) {
                gridSelection = goodSelections;
                presenter.setWorkMode();
            } else {
                presenter.buildKeyboardController();
            }
        }
    }

    presenter.upgradeModel = function (model) {
        let upgradedModel = presenter.upgradeLangTag(model);
        return presenter.upgradeSpeechTexts(upgradedModel);
    };

    presenter.upgradeLangTag = function (model) {
        return presenter.upgradeAttribute(model, "langAttribute", '');
    };

    presenter.upgradeSpeechTexts = function (model) {
        const upgradedModel = presenter.upgradeAttribute(model, "speechTexts", {});

        const modelSpeechTexts = upgradedModel["speechTexts"];
        const properties = ["Cell", "Selected", "Deselected", "Correct", "Wrong"];
        properties.forEach(name => {
            if (!modelSpeechTexts[name]) modelSpeechTexts[name] = {[name]: ""}
        })

        return upgradedModel;
    };

    presenter.upgradeAttribute = function (model, attrName, defaultValue) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if (model[attrName] === undefined) {
            upgradedModel[attrName] = defaultValue;
        }

        return upgradedModel;
    };

    presenter.setSpeechTexts = function(speechTexts) {
        presenter.speechTexts = {
            Cell: presenter.DEFAULT_TTS_PHRASES.CELL,
            Selected: presenter.DEFAULT_TTS_PHRASES.SELECTED,
            Deselected: presenter.DEFAULT_TTS_PHRASES.DESELECTED,
            Correct: presenter.DEFAULT_TTS_PHRASES.CORRECT,
            Wrong: presenter.DEFAULT_TTS_PHRASES.WRONG,
        };

        if (!speechTexts || $.isEmptyObject(speechTexts)) {
            return;
        }

        presenter.speechTexts = {
            Cell: TTSUtils.getSpeechTextProperty(
                speechTexts.Cell.Cell,
                presenter.speechTexts.Cell),
            Selected: TTSUtils.getSpeechTextProperty(
                speechTexts.Selected.Selected,
                presenter.speechTexts.Selected),
            Deselected: TTSUtils.getSpeechTextProperty(
                speechTexts.Deselected.Deselected,
                presenter.speechTexts.Deselected),
            Correct: TTSUtils.getSpeechTextProperty(
                speechTexts.Correct.Correct,
                presenter.speechTexts.Correct),
            Wrong: TTSUtils.getSpeechTextProperty(
                speechTexts.Wrong.Wrong,
                presenter.speechTexts.Wrong)
        };
    };

    presenter.createPreview = function(view, model) {
        presenterLogic(view, model, true);
    };

    presenter.run = function(view, model) {
        presenter.addonID = model.ID;
        presenterLogic(view, model, false);
    };

    presenter.setEventBus = function (wrappedEventBus) {
        eventBus = wrappedEventBus;

        eventBus.addEventListener('ShowAnswers', this);
        eventBus.addEventListener('HideAnswers', this);
        eventBus.addEventListener('GradualShowAnswers', this);
        eventBus.addEventListener('GradualHideAnswers', this);
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
            var answer = answers[i].toString().toLowerCase();

            goodSelections = presenter.findGoodHorizontalSelections(grid, answer, goodSelections);
            goodSelections = presenter.findGoodVerticalSelections(grid, answer, goodSelections);
            goodSelections = presenter.findGoodDiagonalSelections(grid, answer, goodSelections);
            goodSelections = presenter.findGoodReverseDiagonalSelections(grid, answer, goodSelections);
        }

        var rows = grid.length;
        var columns = grid[0].length;

        return presenter.convertSelectionToArray(goodSelections, rows, columns);
    };

    presenter.findGoodHorizontalSelections = function (grid, answer, goodSelections) {
        for (var r = 0; r < grid.length; r++) {
            var horizontalResult = presenter.isWordInRow(grid, r, answer);
            for (var hr = 0; hr < horizontalResult.positions.length; hr++) {
                for (l = 0; l < answer.length; l++) {
                    if(presenter.configuration.checkByWords){
                        presenter.answerWords[answer].row.push(r);
                        presenter.answerWords[answer].column.push(horizontalResult.positions[hr] + l);
                    }
                    
                    presenter.GSAcorrectAnswerLocations[answer].row.push(r);
                    presenter.GSAcorrectAnswerLocations[answer].column.push(horizontalResult.positions[hr] + l);

                    goodSelections.push({
                        row: r,
                        column: horizontalResult.positions[hr] + l
                    });
                }
            }
        }
        return goodSelections;
    }

    presenter.findGoodVerticalSelections = function (grid, answer, goodSelections) {
        for (var c = 0; c < grid[0].length; c++) {
            var verticalResult = presenter.isWordInColumn(grid, c, answer);
            for (var vr = 0; vr < verticalResult.positions.length; vr++) {
                for (l = 0; l < answer.length; l++) {
                    if(presenter.configuration.checkByWords){
                        presenter.answerWords[answer].row.push(verticalResult.positions[vr] + l);
                        presenter.answerWords[answer].column.push(c);
                    }

                    presenter.GSAcorrectAnswerLocations[answer].row.push(verticalResult.positions[vr] + l);
                    presenter.GSAcorrectAnswerLocations[answer].column.push(c);

                    goodSelections.push({
                        row: verticalResult.positions[vr] + l,
                        column: c
                    });
                }
            }
        }
        return goodSelections;
    }

    presenter.findGoodDiagonalSelections = function (grid, answer, goodSelections) {
        var diagonalResult = presenter.isWordOnDiagonals(grid, answer, presenter.DIAGONALS.NORMAL);
        for (var dr = 0; dr < diagonalResult.positions.length; dr++) {
            for (l = 0; l < answer.length; l++) {
                if(presenter.configuration.checkByWords){
                    presenter.answerWords[answer].row.push(diagonalResult.positions[dr].row + l);
                    presenter.answerWords[answer].column.push(diagonalResult.positions[dr].column + l);
                }

                presenter.GSAcorrectAnswerLocations[answer].row.push(diagonalResult.positions[dr].row + l);
                presenter.GSAcorrectAnswerLocations[answer].column.push(diagonalResult.positions[dr].column + l);

                goodSelections.push({
                    row: diagonalResult.positions[dr].row + l,
                    column: diagonalResult.positions[dr].column + l
                });
            }
        }
        return goodSelections;
    }

    presenter.findGoodReverseDiagonalSelections = function (grid, answer, goodSelections) {
        var reverseDiagonalResult = presenter.isWordOnDiagonals(grid, answer, presenter.DIAGONALS.REVERSED);
        for (var rdr = 0; rdr < reverseDiagonalResult.positions.length; rdr++) {
            for (l = 0; l < answer.length; l++) {
                if(presenter.configuration.checkByWords){
                    presenter.answerWords[answer].row.push(reverseDiagonalResult.positions[rdr].row + l);
                    presenter.answerWords[answer].column.push(reverseDiagonalResult.positions[rdr].column - l);
                }
                    
                presenter.GSAcorrectAnswerLocations[answer].row.push(reverseDiagonalResult.positions[rdr].row + l);
                presenter.GSAcorrectAnswerLocations[answer].column.push(reverseDiagonalResult.positions[rdr].column - l);

                goodSelections.push({
                    row: reverseDiagonalResult.positions[rdr].row + l,
                    column: reverseDiagonalResult.positions[rdr].column - l
                });
            }
        }
        return goodSelections;
    }

    presenter.countScoreForWords = function () {
        var score = 0;
        var errors = 0;

        clearCorrectAnswers();
        for (var i=0; i<presenter.configuration.answers.length; i++){
            if(presenter.checkIfWordIsSelected(presenter.configuration.answers[i].toString())){
                fillCorrectAnswers(presenter.configuration.answers[i].toString());
                score++;
            }
        }

        for (var j=0; j<presenter.configuration.rows; j++){
            for (var k=0; k<presenter.configuration.columns; k++){
                if(gridSelection[j][k]  && !correctAnswers[j][k]){
                    errors++;
                }
            }
        }

        return {
            score: score,
            errors: errors
        };
    };

    function fillCorrectAnswers(word) {
        for (var i = 0; i<presenter.answerWords[word.toLowerCase()].column.length; i++ ){
            correctAnswers[presenter.answerWords[word.toLowerCase()].row[i]][presenter.answerWords[word.toLowerCase()].column[i]] = true;
        }
    }

    presenter.checkIfWordIsSelected = function(word) {
        var correct = 0;
        var incorrect= 0;

        for(var i=0; i < presenter.answerWords[word.toLowerCase()].column.length; i++){
            if(gridSelection[presenter.answerWords[word.toLowerCase()].row[i]][presenter.answerWords[word.toLowerCase()].column[i]]){
                correct++;
            }else{
                incorrect++;
            }
        }
        return correct>0 && incorrect == 0;
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
            answers: answersValidationResult.answers,
            checkByWords: ModelValidationUtils.validateBoolean(model['CheckByWords']),
            isVisible: ModelValidationUtils.validateBoolean(model["Is Visible"]),
            isVisibleByDefault: ModelValidationUtils.validateBoolean(model["Is Visible"]),
            langTag: model['langAttribute']
        };
    };

    presenter.executeCommand = function (name, params) {
        if (!presenter.isSelectionPossible) return;

        var commands = {
            'isAllOK': presenter.isAllOK,
            'showAnswers' : presenter.showAnswers,
            'hideAnswers' : presenter.hideAnswers,
            'show': presenter.show,
            'hide': presenter.hide
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setVisibility = function (isVisible) {
        presenter.$view.css('visibility', isVisible ? 'visible' : 'hidden');
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
    };

    presenter.show = function () {
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
    };

    presenter.isAllOK = function () {
        return presenter.getMaxScore() === presenter.getScore() && presenter.getErrorCount() === 0;
    };

    presenter.createAllOKEventData = function () {
        return {
            'source': presenter.addonID,
            'item': 'all',
            'value': '',
            'score': ''
        };
    };

    presenter.createEventData = function (item, value, score) {
        return {
            'source': presenter.addonID,
            'item': item,
            'value': value,
            'score': score
        };
    };

    presenter.onEventReceived = function (eventName, data) {
        switch (eventName) {
            case "ShowAnswers":
                presenter.showAnswers();
                break;

            case "HideAnswers":
                presenter.hideAnswers();
                break;

            case "GradualShowAnswers":
                presenter.gradualShowAnswers(data);
                break;

            case "GradualHideAnswers":
                presenter.gradualHideAnswers();
                break;
        }
    };

    function applyShowAnswerStyles() {
        gridContainerWrapper.find(`.${presenter.CSS_CLASSES.ELEMENT}`).each(function(index) {

            var className;

            if(goodSelectionIndexes[index] != -1){
                className = presenter.CSS_CLASSES.SHOW_ANSWERS;
            }

            $(this).addClass(className);
        });
    }

    function cleanShowAnswersStyles() {
        gridContainerWrapper.find(`.${presenter.CSS_CLASSES.ELEMENT}`).each(function() {
            if($(this).hasClass(presenter.CSS_CLASSES.SHOW_ANSWERS)) {
                $(this).removeClass(presenter.CSS_CLASSES.SHOW_ANSWERS);
            }
        });
    }

    presenter.isAttempted = function () {
        for (var i = 0; i<presenter.configuration.rows; i++){
            for (var j = 0; j<presenter.configuration.columns; j++){
                if(gridSelection[i][j] == true){
                    return true;
                }
            }
        }
        return false;
    };

    function checkIfSelected (row, column){
        var index = row * presenter.configuration.columns + column;
        var element = gridContainerWrapper.find(`.${presenter.CSS_CLASSES.ELEMENT}:eq(${index})`);

        if(gridSelection[row][column]) {// is selected
            if(element.hasClass(presenter.CSS_CLASSES.SELECTED)) {
                element.removeClass(presenter.CSS_CLASSES.SELECTED);
                return true;
            }else{
                return false;
            }
        }
        return false;
    }

    function addClassToSelectedElement (row, column){
        var index = row * presenter.configuration.columns + column;
        var element = gridContainerWrapper.find(`.${presenter.CSS_CLASSES.ELEMENT}:eq(${index})`);
            element.addClass(presenter.CSS_CLASSES.SELECTED);
    }

    presenter.getActivitiesCount = function() {
        if(presenter.configuration.checkByWords){
            return presenter.configuration.answers.length;
        } else {
            goodSelectionIndexes = presenter.convertSelectionToIndexes(goodSelections, presenter.configuration.rows, presenter.configuration.columns);
            let numberOfLetters = 0;
            for (let i = 0; i < goodSelectionIndexes.length; i++) {
                if (goodSelectionIndexes[i] == 1) numberOfLetters++;
            }
            return numberOfLetters;
        }
    }

    presenter.saveUserSelectionBeforeShowAnswers = function () {
        presenter.isSelected = [];
        presenter.setWorkMode();

        for(var row1 = 0; row1 < presenter.configuration.rows; row1++) {
            presenter.isSelected[row1] = [];
            for(var column1 = 0; column1 < presenter.configuration.columns; column1++) {
                presenter.isSelected[row1][column1] = 0;
            }
        }

        for(var row = 0; row < presenter.configuration.rows; row++) {
            for(var column = 0; column < presenter.configuration.columns; column++) {
                if(checkIfSelected(row, column)){
                    presenter.isSelected[row][column] = 1;
                }
            }
        }
    }

    presenter.showAnswers = function () {
        presenter.isShowAnswersActive = true;
        presenter.saveUserSelectionBeforeShowAnswers();

        presenter.isSelectionPossible = false;
        var rows = presenter.configuration.rows;
        var columns = presenter.configuration.columns;

        goodSelectionIndexes = presenter.convertSelectionToIndexes(goodSelections, rows, columns);

        applyShowAnswerStyles();
    };

    presenter.hideAnswers = function () {
        if (!presenter.isShowAnswersActive) {
            return;
        }

        cleanShowAnswersStyles();

        for(var row = 0; row < presenter.configuration.rows; row++) {
            for(var column = 0; column < presenter.configuration.columns; column++) {
                if(presenter.isSelected[row][column] == 1){
                    addClassToSelectedElement(row, column);
                }
            }
        }

        presenter.isSelectionPossible = true;

        presenter.isShowAnswersActive = false;
        presenter.isGradualShowAnswersActive = false;
    };

    presenter.gradualShowAnswers = function (data) {
        if(data.moduleID !== presenter.addonID) return;

        if(!presenter.isGradualShowAnswersActive){
            presenter.saveUserSelectionBeforeShowAnswers();
        }

        presenter.isShowAnswersActive = true;
        presenter.isGradualShowAnswersActive = true;
        presenter.isSelectionPossible = false;

        for(const key in presenter.GSAcorrectAnswerLocations) {
            if (usedGSAKeys.includes(key)) {
                continue;
            } else if (presenter.configuration.checkByWords) {
                usedGSAKeys.push(key);
            }
            if (!presenter.GSAcorrectAnswerLocations.hasOwnProperty(key)) continue;

            const answer = presenter.GSAcorrectAnswerLocations[key];
            const row = answer["row"];
            const column = answer["column"];
            if (row.length !== column.length) continue;
            
            presenter.configuration.checkByWords
                    ? presenter.showNextWord(row, column)
                    : presenter.showNextLetter(key, row, column);

            break;
        }
    };

    presenter.showNextWord = function (row, column) {
        const columns = presenter.configuration.columns;

        for (let i = 0; i < row.length; i++){
            let index = row[i] * columns + column[i];
            let element = gridContainerWrapper.find(`.selectable-element:eq(${index})`);
            element.addClass('selectable-element-show-answers');
        }
    };

    presenter.showNextLetter = function (key, row, column) { 
        const columns = presenter.configuration.columns;

        var element;
        do {
            let index = row[GSALetterCounter] * columns + column[GSALetterCounter];
            element = gridContainerWrapper.find(`.selectable-element:eq(${index})`);
            GSALetterCounter++;
        } while(element.hasClass("selectable-element-show-answers"));
        element.addClass('selectable-element-show-answers');

        if (GSALetterCounter === row.length) {
            usedGSAKeys.push(key);
            GSALetterCounter = 0;
        }
    };

    presenter.gradualHideAnswers = function () {
        if (!presenter.isGradualShowAnswersActive) {
            return;
        }

        GSALetterCounter = 0;
        usedGSAKeys = [];

        presenter.hideAnswers();
    };

    presenter.keyboardController = function (keycode, isShiftKeyDown, event) {
        presenter.keyboardControllerObject.handle(keycode, isShiftKeyDown, event);
    };

    function MagicBoxesKeyboardController (elements, columnsCount) {
        KeyboardController.call(this, elements, columnsCount);
        this.updateMapping();
    }

    MagicBoxesKeyboardController.prototype = Object.create(window.KeyboardController.prototype);
    MagicBoxesKeyboardController.prototype.constructor = MagicBoxesKeyboardController;

    presenter.buildKeyboardController = function () {
        const keyNavElements = presenter.getElementsForKeyboardNavigation();
        presenter.keyboardControllerObject = new MagicBoxesKeyboardController(
            keyNavElements, presenter.configuration.columns
        );
    };

    presenter.getElementsForKeyboardNavigation = function () {
        return presenter.$view.find(`.${presenter.CSS_CLASSES.ELEMENT_WRAPPER}`);
    };

    MagicBoxesKeyboardController.prototype.updateMapping = function () {
        this.mapping[window.KeyboardControllerKeys.TAB] = this.nextTabElement;
        this.shiftKeysMapping[window.KeyboardControllerKeys.TAB] = this.previousTabElement;
    };

    MagicBoxesKeyboardController.prototype.nextTabElement = function (event) {
        KeyboardController.prototype.nextElement.call(this, event);
    };

    MagicBoxesKeyboardController.prototype.previousTabElement = function (event) {
        KeyboardController.prototype.previousElement.call(this, event);
    };

    MagicBoxesKeyboardController.prototype.nextElement = function (event) {
        if (event) {
            event.preventDefault();
        }
        const newPositionIndex = this.calculateNewPositionIndexForHorizontalMove(1);
        if (newPositionIndex !== undefined) {
            this.markCurrentElement(newPositionIndex);
        }
    };

    MagicBoxesKeyboardController.prototype.previousElement = function (event) {
        if (event) {
            event.preventDefault();
        }
        const newPositionIndex = this.calculateNewPositionIndexForHorizontalMove(-1);
        if (newPositionIndex !== undefined) {
            this.markCurrentElement(newPositionIndex);
        }
    };

    MagicBoxesKeyboardController.prototype.nextRow = function (event) {
        if (event) {
            event.preventDefault();
        }
        const newPositionIndex = this.calculateNewPositionIndexForVerticalMove(this.columnsCount);
        if (newPositionIndex !== undefined) {
            this.markCurrentElement(newPositionIndex);
        }
    };

    MagicBoxesKeyboardController.prototype.previousRow = function (event) {
        if (event) {
            event.preventDefault();
        }
        const newPositionIndex = this.calculateNewPositionIndexForVerticalMove(-this.columnsCount);
        if (newPositionIndex !== undefined) {
            this.markCurrentElement(newPositionIndex);
        }
    };

    MagicBoxesKeyboardController.prototype.calculateNewPositionIndexForHorizontalMove = function (move) {
        return this.calculateNewPositionIndexForMoveInOneAxis(move, true);
    };

    MagicBoxesKeyboardController.prototype.calculateNewPositionIndexForVerticalMove = function (move) {
        return this.calculateNewPositionIndexForMoveInOneAxis(move, false);
    };

    MagicBoxesKeyboardController.prototype.calculateNewPositionIndexForMoveInOneAxis = function (move, isHorizontal = true) {
        const oldPosition = this.calculatePosition();
        const newPosition = this.calculatePosition(move);
        const newPositionIndex = this.keyboardNavigationCurrentElementIndex + move;
        if (move === 0
            || (isHorizontal && newPosition.y !== oldPosition.y)
            || (!isHorizontal && newPosition.x !== oldPosition.x)
            || (newPositionIndex >= this.keyboardNavigationElementsLen)
            || (newPositionIndex < 0)) {
            return undefined;
        }
        return newPositionIndex;
    };

    MagicBoxesKeyboardController.prototype.calculatePosition = function (move = 0) {
        const newIndex = this.keyboardNavigationCurrentElementIndex + move;
        return {
            x: newIndex % this.columnsCount,
            y: Math.floor(newIndex / this.columnsCount)
        }
    };

    MagicBoxesKeyboardController.prototype.markCurrentElement = function (new_position_index) {
        KeyboardController.prototype.markCurrentElement.call(this, new_position_index);

        if (presenter.isTTS()) {
            this.readCurrentElement();
        }
    };

    MagicBoxesKeyboardController.prototype.enter = function (event) {
        const isFirstEnter = !this.keyboardNavigationActive;
        KeyboardController.prototype.enter.call(this, event);

        if (presenter.isTTS() && !isFirstEnter) {
            this.readCurrentElement();
        }
    };

    MagicBoxesKeyboardController.prototype.select = function (event) {
        if (event) {
            event.preventDefault();
        }

        if (!this.isSelectEnabled || !presenter.isSelectionPossible) {
            return;
        }

        const $currentSelectableElement = this.getCurrentSelectableElement();
        const hadSelectedClass = $currentSelectableElement.hasClass(presenter.CSS_CLASSES.SELECTED);

        this.selectAction();

        const haveSelectedClass = $currentSelectableElement.hasClass(presenter.CSS_CLASSES.SELECTED);
        const classChanged = hadSelectedClass !== haveSelectedClass;
        if (classChanged) {
            if (haveSelectedClass) {
                readSelected();
            } else {
                readDeselected();
            }
        }
    };

    MagicBoxesKeyboardController.prototype.selectAction = function () {
        const currentPosition = this.calculatePosition();
        selectionHandler(currentPosition.y, currentPosition.x);
    };

    MagicBoxesKeyboardController.prototype.getCurrentSelectableElement = function () {
        const $elementWrapper = this.getCurrentElement();
        return $elementWrapper.find(`.${presenter.CSS_CLASSES.ELEMENT}:first`);
    };

    MagicBoxesKeyboardController.prototype.getCurrentElement = function () {
        return this.getTarget(this.keyboardNavigationCurrentElement, false);
    };

    MagicBoxesKeyboardController.prototype.getTarget = function (element, willBeClicked) {
        return $(element);
    };

    MagicBoxesKeyboardController.prototype.readCurrentElement = function () {
        const $element = this.getCurrentSelectableElement();

        let textVoices = window.TTSUtils.getTextVoiceArrayFromElement($element, presenter.configuration.langTag);
        this.unshiftElementIndexTextVoice(textVoices);
        this.addElementStateInfoTextVoices(textVoices, $element);

        presenter.speak(textVoices);
    };

    MagicBoxesKeyboardController.prototype.unshiftElementIndexTextVoice = function (textVoices) {
        const alphabet = "ABCDEFGHIJKLMNOPRSTUWXYZ";
        const position = this.calculatePosition();
        const message = presenter.speechTexts.Cell
            + " " + alphabet[position.x % alphabet.length]
            + " " + (position.y + 1);
        textVoices.unshift(window.TTSUtils.getTextVoiceObject(message));
    };

    MagicBoxesKeyboardController.prototype.addElementStateInfoTextVoices = function (textVoices, $selectableElement) {
        if ($selectableElement.hasClass(presenter.CSS_CLASSES.SELECTED)
            || $selectableElement.hasClass(presenter.CSS_CLASSES.SHOW_ANSWERS)) {
            addTextVoiceWithLanguageFromLesson(textVoices, presenter.speechTexts.Selected);
        }

        switch (true) {
            case ($selectableElement.hasClass(presenter.CSS_CLASSES.CORRECT_SELECTED)):
                addTextVoiceWithLanguageFromLesson(textVoices, presenter.speechTexts.Correct);
                break;
            case ($selectableElement.hasClass(presenter.CSS_CLASSES.WRONG_SELECTED)):
                addTextVoiceWithLanguageFromLesson(textVoices, presenter.speechTexts.Wrong);
                break;
            default:
                break;
        }
    };

    presenter.setWCAGStatus = function(isWCAGOn) {
        presenter.isWCAGOn = isWCAGOn;
    };

    MagicBoxesKeyboardController.prototype.exitWCAGMode = function () {
        KeyboardController.prototype.exitWCAGMode.call(this);
        presenter.setWCAGStatus(false);
    };

    function readSelected () {
        let textVoices = [];
        addTextVoiceWithLanguageFromLesson(textVoices, presenter.speechTexts.Selected);
        presenter.speak(textVoices);
    }

    function readDeselected () {
        let textVoices = [];
        addTextVoiceWithLanguageFromLesson(textVoices, presenter.speechTexts.Deselected);
        presenter.speak(textVoices);
    }

    function addTextVoiceWithLanguageFromLesson(textVoices, message) {
        textVoices.push(window.TTSUtils.getTextVoiceObject(message));
    }

    presenter.isTTS = function () {
        return presenter.isWCAGOn && presenter.getTextToSpeechOrNull(playerController);
    };

    presenter.speak = function(data) {
        const tts = presenter.getTextToSpeechOrNull(playerController);
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

    return presenter;
}
