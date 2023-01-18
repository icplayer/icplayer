function AddonWritingCalculations_create() {
    var presenter = function () {};

    presenter.$view = null;
    presenter.model = null;
    presenter.correctAnswersList = [];
    presenter.playerController = null;
    presenter.answers = [];
    presenter.isCommutativity;
    presenter.useNumericKeyboard = false;
    var eventBus;

    presenter.ELEMENT_TYPE = {
        "NUMBER" : 1,        // Non box numbers
        "EMPTY_BOX" : 2,
        "SYMBOL" : 3,
        "EMPTY_SPACE" : 4,
        "LINE" : 5,
        "DOT" : 6
    };

    presenter.upgradeModel = function (model) {
        return presenter.upgradeSigns(model);
    };

    presenter.upgradeSigns = function (model) {
        if ('Signs' in model) return model;

        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object
        upgradedModel['Signs'] = [{
            'Addition' : '',
            'Subtraction' : '',
            'Division' : '',
            'Multiplication' : '',
            'Equals' : ''
        }];
        return upgradedModel;
    };

    presenter.ERROR_MESSAGES = {
        V01 : 'Error in row number %rowIndex%. Missing closing bracket.',
        V02 : 'Error in row number %rowIndex%. Missing opening bracket.',
        V03 : 'Error in row number %rowIndex%. Missing number between brackets.',
        V04 : 'Error in row number %rowIndex%. Number between brackets must be from 0 to 9.',
        V05 : 'Error in row number %rowIndex%. Given value "%value%" is not a valid number.',
    };

    presenter.run = function(view, model) {
        presenterLogic(view, model);
        presenter.setVisibility(presenter.isVisible);
        eventBus = presenter.playerController.getEventBus();
        eventBus.addEventListener('ShowAnswers', this);
        eventBus.addEventListener('HideAnswers', this);
    };

    presenter.createPreview = function(view, model) {
        presenterLogic(view, model);
        presenter.setVisibility(true);
    };

    presenter.upgradeModel = function (model) {
        var upgradedModel = presenter.upgradeNumericKeyboard(model);
        return upgradedModel;
    };

    presenter.upgradeNumericKeyboard = function (model) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if(model.useNumericKeyboard === undefined) {
            upgradedModel["useNumericKeyboard"] = "False";
        }

        return upgradedModel;
    };

    function presenterLogic(view, model) {
        model = presenter.upgradeModel(model);
        presenter.isCommutativity = ModelValidationUtils.validateBoolean(model['Commutativity']) || false;
        presenter.$view = $(view);
        presenter.model = presenter.upgradeModel(model);
        presenter.signs = presenter.readSigns( presenter.model['Signs'][0] );
        presenter.isNotActivity = ModelValidationUtils.validateBoolean(model['Is not activity']);
        presenter.useNumericKeyboard = ModelValidationUtils.validateBoolean(model['useNumericKeyboard']);
        presenter.multisigns = ModelValidationUtils.validateBoolean(model['Multisigns']);
        presenter.isVisible = ModelValidationUtils.validateBoolean(model['Is Visible']);
        presenter.isVisibleByDefault = ModelValidationUtils.validateBoolean(model['Is Visible']);

        let validatedElementsData = presenter.validateModelValue(model['Value']);
        if (!validatedElementsData.isValid) {
            presenter.showErrorMessage(
                presenter.ERROR_MESSAGES[validatedElementsData.errorCode],
                validatedElementsData.errorMessageSubstitutions);
        } else {
            presenter.createView(validatedElementsData.value);
            presenter.bindValueChangeEvent();
        }

        presenter.setContainerWidth();
        presenter.addAdditionalStyles();
    }

    presenter.readSigns = function( signs ) {
        var properSigns = {};
        for ( var key in signs ) {
            if ( signs.hasOwnProperty(key) ) {
                if ( signs[key] == '' || signs[key] == '<br>' ) {
                    properSigns[key] = presenter.useDefaultSign( key );
                } else {
                    properSigns[key] = signs[key];
                }
            }
        }
        return properSigns;
    };

    presenter.useDefaultSign = function( key ) {
        if (key == 'Addition') {
            return "\\(+\\)";
        }
        if (key == 'Subtraction') {
            return "\\(-\\)";
        }
        if (key == 'Division') {
            return "\\(\\big)\\)";
        }
        if (key == 'Multiplication') {
            return "\\(\\times\\)";
        }
        if (key == 'Equals') {
            return "\\(=\\)";
        }
    };

    presenter.addAdditionalStyleToElement = function (row, column, style, clazz) {
        var rowElement = presenter.$view.find('.row-' + row),
            cellElement = rowElement.find('.cell-' + column);

        cellElement.addClass(clazz);
        cellElement.attr('style', style);
    };

    presenter.addAdditionalStyles = function() {
        if (!presenter.model['Styles']) {
            return;
        }
        $.each(presenter.model['Styles'], function() {
            var columns = this['Column'],
                rows = this['Row'];

            if (rows) {
                rows = rows.split(',');
            }

            if (columns) {
                columns = columns.split(',');
            }

            for (var row = 0; row < rows.length; row++) {
                for (var column = 0; column < columns.length; column++) {
                    presenter.addAdditionalStyleToElement(rows[row], columns[column], this['Style'], this['Class']);
                }
            }
        });
    };

    presenter.setContainerWidth = function() {
        var viewWrapper = this.$view.find("#writing-calculations-wrapper");
        var width = $(viewWrapper).children().outerWidth();
        $(viewWrapper).css('width', width);
    };

    presenter.bindValueChangeEvent = function() {
        var $input = presenter.$view.find(".writing-calculations-input");
        $input.on('click', function(event) {
            event.stopPropagation();
        });

        $input.on('keyup', function(event) {
            presenter.onKeyUp(event)
        });

        $input.on('keypress', function(event) {
            presenter.onKeyPress(event)
        });

        $input.on("change", function(event) {
            event.stopPropagation();

            var value = event.target.value;
            var rowIndex = $(event.target).attr("row");
            var cellIndex = $(event.target).attr("cell");
            var item = rowIndex + "-" + cellIndex;
            var isCorrect = 0;
            var answer = presenter.createAnswer(rowIndex, cellIndex, value);
            if(presenter.isCorrect(answer)) {
                isCorrect = 1;
            }

            if (presenter.isCommutativity && presenter.isAllFilled()) {
                presenter.triggerValueChangeEvent("", "all", presenter.isAllCorrectlyFilled() ? 1 : 0);
            }

            if (!presenter.isCommutativity) {
                presenter.triggerValueChangeEvent(value, item, isCorrect);
            }

            if(!presenter.isCommutativity && presenter.allAnswersCorrect()) {
                presenter.triggerValueChangeEvent("", "all", "");
            }
        });
    };

    presenter.onKeyUp = function(event) {
        event.stopPropagation();
        if (presenter.useNumericKeyboard) {
            var newText = String(event.target.value);
            var pattern = StringUtils.getNumericPattern();
            if (newText.length > 0 && !newText.match(pattern)) {
                var patternWithoutLastCharacter = pattern.slice(0, -1);
                var regExp = RegExp(patternWithoutLastCharacter);
                var match = regExp.exec(newText);
                var rowIndex = $(event.target).attr("row");
                var cellIndex = $(event.target).attr("cell");

                if (match) {
                    presenter.setCellElementValue(rowIndex, cellIndex, match[0]);
                } else {
                    presenter.setCellElementValue(rowIndex, cellIndex, "");
                }
            }
        }
    };

    presenter.onKeyPress = function(event) {
        event.stopPropagation();
        if (presenter.useNumericKeyboard) {
            var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
            var selectionStartIdx = event.target.selectionStart;
            var selectionEndIdx = event.target.selectionEnd;
            var oldText = String(event.target.value);
            var newText = oldText.substring(0, selectionStartIdx)
                            + key
                            + oldText.substring(selectionEndIdx);
            var pattern = StringUtils.getNumericPattern();
            if (!newText.match(pattern)) {
                event.preventDefault();
            }
        }
    };

    presenter.createView = function (elementsData) {
        let viewWrapper = this.$view.find("#writing-calculations-wrapper");
        elementsData.forEach((elementsRow, rowIndex) => {
            let rowWrapper = presenter.createRowWrapper(rowIndex);
            let cellIndex = 0;
            elementsRow.forEach((elementData) => {
                let createdElement = presenter.createElement(elementData.type);

                if (elementData.type !== presenter.ELEMENT_TYPE.LINE) {
                    addCellClass(createdElement, cellIndex);
                }

                presenter.transformElement(createdElement, elementData.rawValue, elementData.type);

                if (elementData.isVisiblePosition()
                    && (elementData.type === presenter.ELEMENT_TYPE.EMPTY_BOX
                        || elementData.type === presenter.ELEMENT_TYPE.NUMBER)) {
                    presenter.addPosition(createdElement, elementData.getPosition());
                }

                rowWrapper.append(createdElement);

                if (elementData.type !== presenter.ELEMENT_TYPE.DOT) {
                    cellIndex++;
                }
            })
            viewWrapper.append(rowWrapper);
        })
    }

    function addCellClass(createdElement, cellIndex) {
        $(createdElement).addClass('cell-' + (cellIndex + 1));
    }

    presenter.addPosition = function(element, position) {
        let input = $(element).find(".writing-calculations-input, .container-number")[0];

        $(input).attr({
            "row" : position.rowIndex,
            "cell" : position.cellIndex
        });
    };

    presenter.setCellElementValue = function (row, cell, value) {
        var inputs = presenter.getInputs();

        for (var i = 0; i < inputs.length; i++) {
            if ($(inputs[i]).attr("row") === row && $(inputs[i]).attr("cell") === cell) {
                $(inputs[i]).val(value)
            }
        }
    }

    presenter.parseValue = function (value) {
        if (!this.isEmptyBox(value)) {
            return value;
        }

        const openingBracketIndex = 1;
        const endingBracketIndex = value.length - 1;
        return value.slice(openingBracketIndex, endingBracketIndex);
    };

    presenter.createRowWrapper = function(index) {
        var rowWrapper = $("<div></div>");
        rowWrapper.addClass("wrapper-row row-" + (index + 1));
        return rowWrapper;
    };

    presenter.createElement = function(type) {
        let createdElement;
        switch (type) {
            case this.ELEMENT_TYPE.NUMBER:
                createdElement = this.createWrapperAndContainer("number");
                break;
            case this.ELEMENT_TYPE.SYMBOL:
                createdElement = this.createWrapperAndContainer("symbol");
                break;
            case this.ELEMENT_TYPE.EMPTY_SPACE:
                createdElement = this.createWrapperAndContainer("emptySpace", 'wrapper-empty-space');
                break;
            case this.ELEMENT_TYPE.EMPTY_BOX:
                createdElement = this.createWrapperAndContainer("emptyBox");
                break;
            case this.ELEMENT_TYPE.LINE:
                createdElement = this.createWrapperAndContainer("line", 'wrapper-line');
                break;
            case this.ELEMENT_TYPE.DOT:
                createdElement = this.createWrapperAndContainer("dot", 'wrapper-dot');
                break;
        }

        return createdElement;
    };

    presenter.createWrapperAndContainer = function(cssClass, wrapperClass) {
        if (!wrapperClass || wrapperClass === undefined) {
            wrapperClass = "wrapper-cell";
        }
        var wrapper = $("<div></div>");
        wrapper.addClass(wrapperClass);
        var container = $("<div></div>");
        container.addClass("container-" + cssClass);
        wrapper.append(container);
        return wrapper;
    };

    presenter.transformElement = function(element, value, type) {
        var container = $(element).find("[class*=container]");
        switch(type) {
            case this.ELEMENT_TYPE.EMPTY_SPACE:
                break;
            case this.ELEMENT_TYPE.EMPTY_BOX:
                var inputType = "text";
                if (presenter.useNumericKeyboard) {
                    inputType = "tel";
                }
                var input = $("<input type='" + inputType + "'>");
                input.addClass("writing-calculations-input");
                if(!presenter.multisigns){
                    input.attr("maxlength", 1);
                }
                if (presenter.useNumericKeyboard) {
                    input.attr("step", "any");
                }
                container.append(input);
                break;
            case this.ELEMENT_TYPE.LINE:
                break;
            case this.ELEMENT_TYPE.SYMBOL:
                container.html(this.convertLaTeX(value));
                break;
            case this.ELEMENT_TYPE.DOT:
                container.html(value);
                break;
            default:
                container.html(value);
        }

    };

    presenter.convertLaTeX = function (value) {
        if (value === "*") {
            return presenter.signs['Multiplication'];
        }
        else if (value === ":" || value === ")") {
            return presenter.signs['Division'];
        }
        else if (value === "+") {
            return presenter.signs['Addition'];
        } else if (value === "-") {
            return presenter.signs['Subtraction'];
        } else if (value === "#") {
            return presenter.signs['Equals'];
        }
    };

    presenter.getElementType = function(element) {
        if( this.isInteger(element) ) return this.ELEMENT_TYPE.NUMBER;
        if( this.isSymbol(element) ) return this.ELEMENT_TYPE.SYMBOL;
        if( this.isEmptySpace(element) ) return this.ELEMENT_TYPE.EMPTY_SPACE;
        if( this.isEmptyBox(element) ) return this.ELEMENT_TYPE.EMPTY_BOX;
        if( this.isLine(element) ) return this.ELEMENT_TYPE.LINE;
        if( this.isDot(element)) return this.ELEMENT_TYPE.DOT;
    };

    presenter.isDot = function(element) {
        return element == "." || element == ",";
    };

    /**
     Check if valid box == will be empty box in run
     @method isEmptyBox

     @param {String} element element HTML
    */
    presenter.isEmptyBox = function(element) {
        if (element.length < 2) {
            return false;
        }
        if (element[0] !== '[' && element[element.length - 1] !== ']') {
            return false;
        }

        if (!presenter.multisigns) {
            const pattern = /\[[\d.,]?\]/g; // matches: '[number]' or '[.]' or '[,]'
            return pattern.test(element);
        }

        const content = element.slice(1, element.length - 1);
        return !!(presenter.multisigns
            && (presenter.isDot(content) || presenter.isIntegerOrFloat(content)));
    };

    presenter.isEmptySpace = function(element) {
        return element == "_";
    };

    presenter.isSymbol = function(element) {
        if (element.length != 1) {
            return false;
        }
        const pattern = /[#+\-*:\)]/g; // matches: '#', '+', '-', ':', ')' and '*'
        return pattern.test(element);
    };

    presenter.isInteger = function (value) {
        if (value === undefined || value === null) {
            return false;
        }
        value = value.toString().trim();
        const commonTestsResult = isNotANumberCommonTests(value);
        if (commonTestsResult === false) {
            return false;
        }

        if (value % 1 !== 0) {
            return false;
        }

        return /\d+/.test(value);
    };

    presenter.isIntegerOrFloat = function (value) {
        if (value === undefined || value === null) {
            return false;
        }
        value = value.toString().trim();
        const commonTestsResult = isNotANumberCommonTests(value);
        if (commonTestsResult === false) {
            return false;
        }

        if (value.charAt(0) == "-") {
            value = value.slice(1, value.length);
        }

        let i, commasNumber = 0;
        const digitPattern = /[0-9]/;
        const separatorPattern = /[,.]/;

        if (separatorPattern.test(value.charAt(0))) {
            return false;
        }

        for (i = 0; i < value.length; i++) {
            if (separatorPattern.test(value.charAt(i))) {
                if (commasNumber >= 1) {
                    return false;
                }
                commasNumber ++;
            } else {
                if (digitPattern.test(value.charAt(i))) {
                    continue;
                } else {
                    return false;
                }
            }
        }

        return true;
    };

    function isNotANumberCommonTests (value) {
        value = value.trim();
        return !(ModelValidationUtils.isStringEmpty(value)
            || isStartsWithPlus(value)
            || isTooManyZeroes(value)
            || isMinusZero(value)
            || isOnlyMinus(value)
        );
    }

    function isStartsWithPlus (value) {
        return value.charAt(0) == "+";
    }

    function isMinusZero (value) {
        return value == "-0";
    }

    function isOnlyMinus (value) {
        return value == "-";
    }

    function isTooManyZeroes (value) {
        const tooManyZeroesPattern = /^-?0{2,}/;
        return tooManyZeroesPattern.test(value);
    }

    presenter.isLine = function(element) {
        return element == "=";
    };

    presenter.convertStringToArray = function(stringToConvert) {
        return stringToConvert.split(/[\n\r]+/);
    };

    presenter.isCorrect = function(answer) {
        var result = false;
        var correctAnswers = presenter.correctAnswersList;
        for (var i = 0; i < correctAnswers.length; i++) {
            if (presenter.isEqual(answer, correctAnswers[i])) {
                result = true;
            }
        }
        return result;
    };

    presenter.allAnswersCorrect = function() {
        var maxScore = presenter.getPoints("all");
        var score = presenter.getPoints("correct");
        var errorCount = presenter.getPoints("incorrect");

        return maxScore === score && errorCount === 0;
    };

    presenter.executeCommand = function (name, params) {
        var commands = {
            'isAllOK': presenter.isAllOK,
            'show': presenter.show,
            'hide': presenter.hide
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setVisibility = function (isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.show = function () {
        presenter.setVisibility(true);
        presenter.isVisible = true;
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
        presenter.isVisible = false;
    };

    presenter.isAllOK = function () {
        var maxScore = presenter.getPoints("all"),
            score = presenter.getPoints("correct"),
            errorCount = presenter.getPoints("incorrect");

        return maxScore === score && errorCount === 0;
    };

    presenter.isEqual = function(answer, correctAnswer) {
        return answer.value === correctAnswer.value && answer.rowIndex === correctAnswer.rowIndex && answer.cellIndex === correctAnswer.cellIndex;
    };

    presenter.getInputs = function() {
        return $(this.$view).find(".writing-calculations-input");
    };

    presenter.isAllFilled = function() {
        var inputs = presenter.getInputs();

        for (var i = 0; i < inputs.length; i++) {
            if ($(inputs[i]).val().length == 0) return false;
        }

        return true;
    };

    presenter.setShowErrorsMode = function() {
        if(presenter.isNotActivity){
            return;
        }

        var inputs = $(this.$view).find(".writing-calculations-input");

        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        if (!presenter.isCommutativity) {
            $.each(inputs, function(){
                var answer = presenter.createAnswer($(this).attr("row"), $(this).attr("cell"), $(this).val());

                if (ModelValidationUtils.isStringEmpty($(this).val())) {
                    presenter.markEmpty($(this));
                } else if( presenter.isCorrect(answer) ) {
                    presenter.markCorrect($(this));
                } else {
                    presenter.markIncorrect($(this));
                }
            });
        } else if (presenter.isAllFilled()) {
            var isCorrect = presenter.isAllCorrectlyFilled();

            if (isCorrect) {
                presenter.$view.addClass('correct');
            } else {
                presenter.$view.addClass('wrong');
            }

            disableAllInputs(inputs);
        } else {
            disableAllInputs(inputs);
        }
    };

    function disableAllInputs(inputs) {
        $(inputs).attr("disabled", "disabled");
    }

    presenter.compareAnswers = function(correctAnswers, userAnswers) {
        var answers = $.extend(true, [], userAnswers);

        correctAnswers = $.extend(true, [], correctAnswers);

        var userResult = answers.pop(),
            declaredResult = correctAnswers.pop();

        var cleanedAnswers = [],
            cleanedCorrectAnswers = [],
            logicalFoundArray = [],
            found = false,
            result = true,
            i;

        for (i = 0; i <= answers.length; i++) {
            if (answers[i] !== undefined) {
                cleanedAnswers.push(answers[i]);
            }

            if (correctAnswers[i] !== undefined) {
                cleanedCorrectAnswers.push(correctAnswers[i]);
            }
        }

        for (i = 0; i < cleanedCorrectAnswers.length; i++) {
            found = presenter.wasRowFound(cleanedCorrectAnswers[i], cleanedAnswers);
            logicalFoundArray.push(found);
        }

        jQuery.each(logicalFoundArray, function (_, element) {
            if (!element) {
                result = false;
                return false; // jQuery.each break statement
            }
        });

        result = result && presenter.compareResults(userResult, declaredResult);

        return result;
    };


    presenter.compareResults = function(userResult, declaredResult) {
        return userResult.toString() === declaredResult.toString();
    };

    /*
     This method get one of correctAnswers row
     and comparing it with each givenAnswers rows.

     Takes: correctAnswers as all correct values in one row
     and givenAnswers as answers in all rows given by user.

     Returns: boolean value if declared row in correctAnswers
     was found in givenAnswers.
     */
    presenter.wasRowFound = function(correctAnswers, givenAnswers) {
        var wasRowFound = false;

        for (var j = 0; j < givenAnswers.length; j++) { //answers given by user
            if (givenAnswers[j] !== undefined && correctAnswers.toString() === givenAnswers[j].toString()) {
                delete givenAnswers[j];
                wasRowFound = true;
                break;
            } else {
                wasRowFound = false;
            }
        }

        return wasRowFound;
    };

    presenter.getAllAnswers = function(elements) {
        var answers = [];

        $.each(elements, function(){
            if ($(this).hasClass('writing-calculations-input')) {
                if (answers[$(this).attr("row") - 1] === undefined) {
                    answers[$(this).attr("row") - 1] = [$(this).val()];
                } else {
                    answers[$(this).attr("row") - 1].push($(this).val());
                }
            } else if ($(this).hasClass('container-number')) {
                if (answers[$(this).attr("row") - 1] === undefined) {
                    answers[$(this).attr("row") - 1] = [$(this).html()];
                } else {
                    answers[$(this).attr("row") - 1].push($(this).html());
                }
            }
        });

        return answers;
    };

    presenter.isAllCorrectlyFilled = function() {
        var elements = $(this.$view).find('.container-number, .writing-calculations-input');
        var answers = presenter.getAllAnswers(elements);

        return presenter.compareAnswers(presenter.answers, answers);
    };

    presenter.createAnswer = function(rowIndex, cellIndex, rawValue) {
        return {
            rowIndex: parseInt(rowIndex, 10),
            cellIndex: parseInt(cellIndex, 10),
            value: presenter.parseValue(rawValue)
        }
    };

    presenter.createElementData = function (rowIndex, cellIndex, elementValue, isVisiblePosition = false) {
        return new ElementData(rowIndex, cellIndex, elementValue, isVisiblePosition)
    };

    function ElementData (rowIndex, cellIndex, elementValue, isVisiblePosition = false) {
        this.rawValue = elementValue;
        this.parsedValue = presenter.parseValue(elementValue);
        this.type = presenter.getElementType(elementValue);

        // Element's position data
        this.visiblePosition = isVisiblePosition;
        this.rowIndex = rowIndex;
        this.cellIndex = cellIndex;
    }

    ElementData.prototype.getPosition = function () {
        return {
            rowIndex: this.rowIndex,
            cellIndex: this.cellIndex,
        };
    }

    ElementData.prototype.createAnswer = function () {
        return {
            rowIndex: this.rowIndex,
            cellIndex: this.cellIndex,
            value: this.parsedValue,
        };
    }

    ElementData.prototype.isVisiblePosition = function () {
        return this.visiblePosition;
    }

    ElementData.prototype.isEmptyBoxValid = function () {
        if (this.type !== presenter.ELEMENT_TYPE.EMPTY_BOX) {
            return false;
        }

        return (
            (presenter.multisigns && presenter.isIntegerOrFloat(this.parsedValue))
            || (!presenter.multisigns && presenter.isInteger(this.parsedValue))
        )
    }

    presenter.createAnswer = function(rowIndex, cellIndex, elementValue) {
        return {
            rowIndex: parseInt(rowIndex, 10),
            cellIndex: parseInt(cellIndex, 10),
            value: presenter.parseValue(elementValue)
        }
    };

    presenter.markIncorrect = function(element) {
        presenter.markAs(element, "incorrect");
    };

    presenter.markCorrect = function(element) {
        presenter.markAs(element, "correct");
    };

    presenter.markEmpty = function(element) {
        presenter.markAs(element, "empty");
    };

    presenter.markAs = function(element, className) {
        $(element).addClass(className);
        $(element).attr("disabled", "disabled");
    };

    presenter.setWorkMode = function() {
        if(presenter.isNotActivity){
            return;
        }

        this.clean(true, false);
    };

    presenter.reset = function() {
        this.clean(true, true);
        var inputs = $(this.$view).find(".writing-calculations-input");
        if(typeof(presenter.userAnswers) !== "undefined") {
            $.each(inputs, function(index){
                presenter.userAnswers[index] = '';
            });
        }

        presenter.setVisibility(presenter.isVisibleByDefault);
        presenter.isVisible = presenter.isVisibleByDefault;
    };

    presenter.clean = function(removeMarks, removeValues) {
        var inputs = $(this.$view).find(".writing-calculations-input");
        $.each(inputs, function(){
            if(removeMarks) {
                presenter.removeMark($(this));
            }
            if(removeValues) {
                presenter.removeValue($(this));
            }
        });
        if (presenter.$view.hasClass('wrong')) {
            presenter.$view.removeClass('wrong');
        } else if (presenter.$view.hasClass('correct')) {
            presenter.$view.removeClass('correct');
        }
    };

    presenter.removeMark = function(element) {
        $(element).removeClass("incorrect correct empty");
        $(element).removeAttr("disabled");
    };

    presenter.removeValue = function(element) {
        $(element).val("");
    };


    presenter.getInputsData = function() {
        var inputs = $(this.$view).find(".writing-calculations-input");
        var inputsData = {
            values : [],
            correctAnswersCount : 0,
            incorrectAnswersCount : 0
        };

        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        $.each(inputs, function () {
            var value = $(this).val();
            value = presenter.parseValue(value);
            inputsData.values.push(value);

            if (value === undefined || value === "") return true; // jQuery.each continue

            var answer = presenter.createAnswer($(this).attr("row"), $(this).attr("cell"), $(this).val());
            if( presenter.isCorrect(answer) ) {
                inputsData.correctAnswersCount++;
            } else {
                inputsData.incorrectAnswersCount++;
            }
        });
        return inputsData;
    };

    presenter.getState = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        return JSON.stringify({
            "inputsData" : this.getInputsData(),
            "isVisible" : presenter.isVisible
        });
    };

    presenter.setState = function(stateString) {
        if (ModelValidationUtils.isStringEmpty(stateString)) return;

        var state = JSON.parse(stateString);
        if (state.inputsData) {
            var inputs = $(this.$view).find(".writing-calculations-input");
            var inputsData = state.inputsData;
            $.each(inputs, function(index){
                $(this).val(inputsData.values[index].toString());
            });
        }

        if(state.isVisible != undefined) {
            presenter.isVisible = state.isVisible;
            presenter.setVisibility(presenter.isVisible);
        }
    };

    presenter.getScore = function() {
        if(presenter.isNotActivity){
            return 0;
        }

        if (presenter.isShowAnswersActive) {
            return presenter.currentScore;
        }
        return this.getPoints("correct");
    };

    presenter.getMaxScore = function() {
        if(presenter.isNotActivity){
            return 0;
        }

        if (presenter.isShowAnswersActive) {
            return presenter.currentMaxScore;
        }
        return this.getPoints("all");
    };

    presenter.getErrorCount = function() {
        if(presenter.isNotActivity){
            return 0;
        }

        if (presenter.isShowAnswersActive) {
            return presenter.currentErrorCount;
        }
        return this.getPoints("incorrect");
    };

    presenter.getPoints = function(type) {
        var inputsData = this.getInputsData();

        if (presenter.isCommutativity) {
            switch (type) {
                case 'correct':
                    return presenter.isAllCorrectlyFilled() ? 1 : 0;
                case 'incorrect':
                    if (presenter.isAllFilled()) {
                        return presenter.isAllCorrectlyFilled() ? 0 : 1;
                    } else {
                        return 0;
                    }
                case 'all':
                    return 1;
                default:
                    return 0;
            }
        } else {
            switch (type) {
                case 'correct':
                    return inputsData.correctAnswersCount;
                case 'incorrect':
                    return inputsData.incorrectAnswersCount;
                case 'all':
                    return inputsData.values.length;
                default:
                    return 0;
            }
        }
    };


    presenter.createEventData = function(value, item, isCorrect) {
        return {
            source : this.model.ID,
            item : "" + item,
            value : "" + value,
            score : "" + isCorrect
        };
    };

    presenter.triggerValueChangeEvent = function(value, item, isCorrect) {
        var eventData = this.createEventData(value, item, isCorrect);
        if (this.playerController !== null) {
            this.playerController.getEventBus().sendEvent('ValueChanged', eventData);
        }
    };

    presenter.setPlayerController = function(controller) {
        this.playerController = controller;
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
        if(presenter.isNotActivity){
            return;
        }

        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        presenter.userAnswers = [];
        presenter.currentScore = presenter.getScore();
        presenter.currentErrorCount = presenter.getErrorCount();
        presenter.currentMaxScore = presenter.getMaxScore();
        presenter.isShowAnswersActive = true;
        presenter.clean(true,false);
        var inputs = $(this.$view).find(".writing-calculations-input");
        var correctAnswers = presenter.correctAnswersList;

        $.each(inputs, function(index){
            $(this).addClass('writing-calculations_show-answers');
            $(this).attr("disabled", true);
            presenter.userAnswers.push($(this).val());
            $(this).val(correctAnswers[index].value);
        });
    };

    presenter.hideAnswers = function () {
        if(presenter.isNotActivity || !presenter.isShowAnswersActive) {
            return;
        }

        presenter.isShowAnswersActive = false;
        var inputs = $(this.$view).find(".writing-calculations-input");
        $.each(inputs, function(index){
            $(this).val(presenter.userAnswers[index]);
            $(this).removeClass('writing-calculations_show-answers');
            $(this).attr("disabled", false);
        });
    };

    presenter.validateModelValue = function (modelValue) {
        const rows = presenter.convertStringToArray(modelValue);
        let elementsData = [];

        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            let row = rows[rowIndex];

            const validatedBracketsNumber = validateBracketsNumber(row, rowIndex);
            if (!validatedBracketsNumber.isValid) {
                return validatedBracketsNumber;
            }

            let cellBoxIndex = 0;
            elementsData.push([]);
            for (let startingIndex = 0; startingIndex < row.length; ) {
                let elementValue = row[startingIndex];
                let elementLength = 1;
                let elementData = {};

                const isEndOfGap = elementValue === ']';
                if (isEndOfGap) {
                    return getErrorObject("V02", {rowIndex: rowIndex + 1});
                }

                const isStartOfGap = elementValue === '[';
                if (isStartOfGap) {
                    const validatedGapLength = validateGapLength(row, rowIndex, startingIndex);
                    if (!validatedGapLength.isValid) {
                        return validatedGapLength;
                    }

                    elementLength = validatedGapLength.value;
                    elementValue = row.slice(startingIndex, startingIndex + elementLength);

                    elementData = presenter.createElementData(rowIndex + 1, ++cellBoxIndex, elementValue, true);
                    if (!elementData.isEmptyBoxValid()) {
                        return getErrorObject("V05", {rowIndex: rowIndex + 1, value: elementData.rawValue});
                    }

                    if (presenter.answers[rowIndex] === undefined) {
                        presenter.answers[rowIndex] = [];
                    }

                    let answer = elementData.createAnswer();
                    presenter.answers[rowIndex].push(answer.value);
                    presenter.correctAnswersList.push(answer);
                } else {
                    if (presenter.isCommutativity) {
                        ++cellBoxIndex;
                    }
                    elementData = presenter.createElementData(rowIndex + 1, cellBoxIndex, elementValue, presenter.isCommutativity);
                    if (!isNaN(parseInt(elementValue, 10))) {
                        if (presenter.answers[rowIndex] === undefined) {
                            presenter.answers[rowIndex] = [];
                        }

                        presenter.answers[rowIndex].push(elementValue);
                    }
                }
                startingIndex += elementLength;
                elementsData[rowIndex].push(elementData);
            }
        }
        return getCorrectObject(elementsData);
    }

    function validateBracketsNumber(row, rowIndex) {
        const errorMessageSubstitutions = {rowIndex: rowIndex + 1};
        const openingBracketsCount = row.split('').filter(x => x === '[').length;
        const closingBracketsCount = row.split('').filter(x => x === ']').length;
        if (openingBracketsCount > closingBracketsCount) {
            return getErrorObject("V01", errorMessageSubstitutions);
        } else if (openingBracketsCount < closingBracketsCount) {
            return getErrorObject("V02", errorMessageSubstitutions);
        }
        return getCorrectObject(openingBracketsCount + closingBracketsCount);
    }

    function validateGapLength(rowString, rowIndex, startIndex) {
        const errorMessageSubstitutions = {rowIndex: rowIndex + 1};

        const nextClosingBracketIndex = rowString.indexOf(']', startIndex);
        if (nextClosingBracketIndex === -1) {
            return getErrorObject("V01", errorMessageSubstitutions);
        }

        const nextOpeningBracketIndex = rowString.indexOf('[', startIndex + 1);
        if (nextOpeningBracketIndex !== - 1 && nextOpeningBracketIndex <= nextClosingBracketIndex) {
            return getErrorObject("V01", errorMessageSubstitutions);
        }

        const length = nextClosingBracketIndex - startIndex + 1;
        if (length === 2) {
            return getErrorObject("V03", errorMessageSubstitutions);
        }

        if (!presenter.multisigns && length !== 3) {
            return getErrorObject("V04", errorMessageSubstitutions);
        }
        return getCorrectObject(length);
    }

    presenter.showErrorMessage = function(message, substitutions) {
        let errorContainer;
        if (typeof(substitutions) == 'undefined') {
            errorContainer = '<p>' + message + '</p>';
        } else {
            let messageSubst = message;
            for (const key in substitutions) {
                if (!substitutions.hasOwnProperty(key)) continue;
                messageSubst = messageSubst.replace('%' + key + '%', substitutions[key]);
            }
            errorContainer = '<p>' + messageSubst + '</p>';
        }

        presenter.$view.html(errorContainer);
    };

    function getErrorObject (errorCode, errorMessageSubstitutions) {
        return {
            isValid: false,
            errorCode: errorCode,
            errorMessageSubstitutions: errorMessageSubstitutions,
        };
    }

    function getCorrectObject (value) {
        return {
            isValid: true,
            value: value
        };
    }

    return presenter;
}
