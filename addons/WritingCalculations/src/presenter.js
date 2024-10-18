function AddonWritingCalculations_create() {
    var presenter = function () {};

    presenter.$view = null;
    presenter.model = null;
    presenter.correctAnswersList = [];
    presenter.playerController = null;
    presenter.answers = [];
    presenter.isCommutativity;
    presenter.useNumericKeyboard = false;
    presenter.isGradualShowAnswersActive = false;
    presenter.isScoreSaved = false;
    presenter.userAnswers = [];
    presenter.helpBoxesDefaultValues = [];
    presenter.helpBoxesUserAnswers = [];
    presenter.isDisabled = false;
    presenter.isWCAGOn = false;
    presenter.elementsTable = [];
    presenter.gapElements = [];
    presenter.isGapFocused = false;
    var eventBus;

    presenter.keyboardState = {
        x: 0,
        y: -1,
        gapIndex: -1
    }
    presenter.KEYBOARD_SELECTED_CLASS = 'keyboard_navigation_active_element';

    presenter.ELEMENT_TYPE = {
        "NUMBER" : 1,        // Non box numbers
        "EMPTY_BOX" : 2,
        "SYMBOL" : 3,
        "EMPTY_SPACE" : 4,
        "LINE" : 5,
        "DOT" : 6,
        "HELP_BOX" : 7,
    };

    presenter.upgradeModel = function (model) {
        let upgradedModel = presenter.upgradeSigns(model);
        upgradedModel = presenter.upgradeNumericKeyboard(upgradedModel);
        upgradedModel =  presenter.upgradeModelAddShowAllAnswersInGSA(upgradedModel);
        return presenter.upgradeTTS(upgradedModel);
    };

    presenter.upgradeModelAddShowAllAnswersInGSA = function (model) {
        const upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!upgradedModel.hasOwnProperty('showAllAnswersInGSA')) {
            upgradedModel['showAllAnswersInGSA'] = 'False';
        }

        return upgradedModel;
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

    presenter.upgradeTTS = function (model) {
        if ('speechTexts' in model) return model;

        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (!upgradedModel["speechTexts"]) {
            upgradedModel["speechTexts"] = {};
        }
        if (!upgradedModel["speechTexts"]["Gap"]) {
            upgradedModel["speechTexts"]["Gap"] = {Gap: ""};
        }
        if (!upgradedModel["speechTexts"]["AdditionalGap"]) {
            upgradedModel["speechTexts"]["AdditionalGap"] = {AdditionalGap: ""};
        }
        if (!upgradedModel["speechTexts"]["Empty"]) {
            upgradedModel["speechTexts"]["Empty"] = {Empty: ""};
        }
        if (!upgradedModel["speechTexts"]["AdditionSign"]) {
            upgradedModel["speechTexts"]["AdditionSign"] = {AdditionSign: ""};
        }
        if (!upgradedModel["speechTexts"]["SubtractionSign"]) {
            upgradedModel["speechTexts"]["SubtractionSign"] = {SubtractionSign: ""};
        }
        if (!upgradedModel["speechTexts"]["DivisionSign"]) {
            upgradedModel["speechTexts"]["DivisionSign"] = {DivisionSign: ""};
        }
        if (!upgradedModel["speechTexts"]["MultiplicationSign"]) {
            upgradedModel["speechTexts"]["MultiplicationSign"] = {MultiplicationSign: ""};
        }
        if (!upgradedModel["speechTexts"]["EqualsSign"]) {
            upgradedModel["speechTexts"]["EqualsSign"] = {EqualsSign: ""};
        }
        if (!upgradedModel["speechTexts"]["DecimalSeparator"]) {
            upgradedModel["speechTexts"]["DecimalSeparator"] = {DecimalSeparator: ""};
        }
        if (!upgradedModel["speechTexts"]["Line"]) {
            upgradedModel["speechTexts"]["Line"] = {Line: ""};
        }
        if (!upgradedModel["speechTexts"]["Correct"]) {
            upgradedModel["speechTexts"]["Correct"] = {Correct: ""};
        }
        if (!upgradedModel["speechTexts"]["Wrong"]) {
            upgradedModel["speechTexts"]["Wrong"] = {Wrong: ""};
        }

        if (!upgradedModel["DescriptionOfOperation"]) {
            upgradedModel["DescriptionOfOperation"] = "";
        }

        if (!upgradedModel["LangTag"]) {
            upgradedModel["LangTag"] = "";
        }

        return upgradedModel;
    };

    presenter.ERROR_MESSAGES = {
        V01 : 'Error in row number %rowIndex%. Missing closing square bracket.',
        V02 : 'Error in row number %rowIndex%. Missing opening square bracket.',
        V03 : 'Error in row number %rowIndex%. Missing number between square brackets.',
        V04 : 'Error in row number %rowIndex%. Number between brackets must be from 0 to 9.',
        V05 : 'Error in row number %rowIndex%. Given value "%value%" in square brackets is not a valid number.',
        V06 : 'Error in row number %rowIndex%. Missing closing curly bracket.',
        V07 : 'Error in row number %rowIndex%. Missing opening curly bracket.',
        V08 : 'Error in row number %rowIndex%. Given value "%value%" in curly brackets is not a valid. Curly brackets must be empty or have a valid number.',
    };

    presenter.run = function(view, model) {
        presenterLogic(view, model);
        presenter.setVisibility(presenter.isVisible);
        eventBus = presenter.playerController.getEventBus();
        eventBus.addEventListener('ShowAnswers', this);
        eventBus.addEventListener('HideAnswers', this);
        eventBus.addEventListener('GradualShowAnswers', this);
        eventBus.addEventListener('GradualHideAnswers', this);
    };

    presenter.createPreview = function(view, model) {
        presenterLogic(view, model);
        presenter.setVisibility(true);
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
        presenter.ID = model["ID"];
        presenter.showAllAnswersInGSA = ModelValidationUtils.validateBoolean(model['showAllAnswersInGSA']);
        presenter.langTag = model["LangTag"];
        presenter.descriptionOfOperation = model["DescriptionOfOperation"];
        presenter.setSpeechTexts(model["speechTexts"]);
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

    presenter.setSpeechTexts = function(speechTexts) {
        presenter.speechTexts = {
            gap: 'gap',
            additionalGap: 'additional gap',
            empty: 'empty',
            additionSign: 'addition sign',
            subtractionSign: 'subtraction sign',
            divisionSign: 'division sign',
            multiplicationSign: 'multiplication sign',
            equalsSign: 'equals sign',
            decimalSeparator: 'decimal separator',
            line: 'line',
            correct: 'correct',
            wrong: 'wrong',

        };

        if (!speechTexts) {
            return;
        }

        presenter.speechTexts = {
            gap: TTSUtils.getSpeechTextProperty(speechTexts['Gap']['Gap'], presenter.speechTexts.gap),
            additionalGap: TTSUtils.getSpeechTextProperty(speechTexts['AdditionalGap']['AdditionalGap'], presenter.speechTexts.additionalGap),
            empty: TTSUtils.getSpeechTextProperty(speechTexts['Empty']['Empty'], presenter.speechTexts.empty),
            additionSign: TTSUtils.getSpeechTextProperty(speechTexts['AdditionSign']['AdditionSign'], presenter.speechTexts.additionSign),
            subtractionSign: TTSUtils.getSpeechTextProperty(speechTexts['SubtractionSign']['SubtractionSign'], presenter.speechTexts.subtractionSign),
            divisionSign: TTSUtils.getSpeechTextProperty(speechTexts['DivisionSign']['DivisionSign'], presenter.speechTexts.divisionSign),
            multiplicationSign: TTSUtils.getSpeechTextProperty(speechTexts['MultiplicationSign']['MultiplicationSign'], presenter.speechTexts.multiplicationSign),
            equalsSign: TTSUtils.getSpeechTextProperty(speechTexts['EqualsSign']['EqualsSign'], presenter.speechTexts.equalsSign),
            decimalSeparator: TTSUtils.getSpeechTextProperty(speechTexts['DecimalSeparator']['DecimalSeparator'], presenter.speechTexts.decimalSeparator),
            line: TTSUtils.getSpeechTextProperty(speechTexts['Line']['Line'], presenter.speechTexts.line),
            correct: TTSUtils.getSpeechTextProperty(speechTexts['Correct']['Correct'], presenter.speechTexts.correct),
            wrong: TTSUtils.getSpeechTextProperty(speechTexts['Wrong']['Wrong'], presenter.speechTexts.wrong)
        };
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
        const $inputs = presenter.getInputs();
        const $emptyBoxesInputs = presenter.getEmptyBoxesInputs();

        $inputs.on('click', function(event) {
            event.stopPropagation();
        });

        $inputs.on('keyup', function(event) {
            presenter.onKeyUp(event);
        });

        $inputs.on('keypress', function(event) {
            presenter.onKeyPress(event);
        });

        $emptyBoxesInputs.on("change", function(event) {
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

            if (presenter.isCommutativity && presenter.isAllEmptyBoxInputsFilled()) {
                presenter.triggerValueChangeEvent("", "all", presenter.isAllEmptyBoxInputsCorrectlyFilled() ? 1 : 0);
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
        presenter.elementsTable = [];
        presenter.gapElements = [];
        const $viewWrapper = this.$view.find("#writing-calculations-wrapper");
        elementsData.forEach((elementsRow, rowIndex) => {
            var createdElementsRow = [];
            const $rowWrapper = presenter.createRowWrapper(rowIndex);
            let cellIndex = 0;
            elementsRow.forEach((elementData) => {
                const createdElement = presenter.createElement(elementData.type);

                if (elementData.type !== presenter.ELEMENT_TYPE.LINE) {
                    addCellClass(createdElement, cellIndex);
                }

                presenter.transformElement(createdElement, elementData.parsedValue, elementData.type);

                const ELEMENT_TYPES_WITH_POSITION = [
                    presenter.ELEMENT_TYPE.EMPTY_BOX,
                    presenter.ELEMENT_TYPE.NUMBER,
                    presenter.ELEMENT_TYPE.HELP_BOX
                ];
                if (elementData.isVisiblePosition()
                    && (ELEMENT_TYPES_WITH_POSITION.includes(elementData.type))) {
                    presenter.addPosition(createdElement, elementData.getPosition());
                }

                $rowWrapper.append(createdElement);

                if (elementData.type !== presenter.ELEMENT_TYPE.DOT) {
                    cellIndex++;
                    createdElementsRow.push(createdElement);
                }

                if (elementData.type == presenter.ELEMENT_TYPE.EMPTY_BOX || elementData.type == presenter.ELEMENT_TYPE.HELP_BOX) {
                    presenter.gapElements.push({
                        x: createdElementsRow.length - 1,
                        y: presenter.elementsTable.length,
                        el: createdElement
                    });
                }
            });
            $viewWrapper.append($rowWrapper);
            presenter.elementsTable.push(createdElementsRow);
        });
    };

    function addCellClass(createdElement, cellIndex) {
        $(createdElement).addClass('cell-' + (cellIndex + 1));
    }

    presenter.addPosition = function(element, position) {
        const input = $(element).find(".writing-calculations-input, .container-number")[0];

        $(input).attr({
            "row" : position.rowIndex,
            "cell" : position.cellIndex
        });
    };

    presenter.setCellElementValue = function (row, cell, value) {
        const $inputs = presenter.getInputs();

        for (let i = 0; i < $inputs.length; i++) {
            if ($($inputs[i]).attr("row") === row && $($inputs[i]).attr("cell") === cell) {
                $($inputs[i]).val(value);
            }
        }
    };

    presenter.parseValue = function (value) {
        if (!this.isEmptyBox(value) && !this.isHelpBox(value)) {
            return value;
        }

        const openingBracketIndex = 1;
        const endingBracketIndex = value.length - 1;
        return value.slice(openingBracketIndex, endingBracketIndex);
    };

    presenter.createRowWrapper = function(index) {
        const rowWrapper = document.createElement("div");
        rowWrapper.classList.add("wrapper-row");
        rowWrapper.classList.add("row-" + (index + 1));
        return $(rowWrapper);
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
            case this.ELEMENT_TYPE.HELP_BOX:
                createdElement = this.createWrapperAndContainer("helpBox");
                break;
        }

        return createdElement;
    };

    presenter.getContainerType = function ($el) {
        if ($el.hasClass("container-number")) return presenter.ELEMENT_TYPE.NUMBER;
        if ($el.hasClass("container-symbol")) return presenter.ELEMENT_TYPE.SYMBOL;
        if ($el.hasClass("container-emptySpace")) return presenter.ELEMENT_TYPE.EMPTY_SPACE;
        if ($el.hasClass("container-emptyBox")) return presenter.ELEMENT_TYPE.EMPTY_BOX;
        if ($el.hasClass("container-line")) return presenter.ELEMENT_TYPE.LINE;
        if ($el.hasClass("container-dot")) return presenter.ELEMENT_TYPE.DOT;
        if ($el.hasClass("container-helpBox")) return presenter.ELEMENT_TYPE.HELP_BOX;
        return -1;
    }

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
        const $container = $(element).find("[class*=container]");
        let inputType, input;
        switch(type) {
            case this.ELEMENT_TYPE.EMPTY_SPACE:
                break;
            case this.ELEMENT_TYPE.EMPTY_BOX:
                inputType = presenter.useNumericKeyboard ? "tel" : "text";
                input = $("<input type='" + inputType + "'>");
                input.addClass("writing-calculations-input");
                if(!presenter.multisigns){
                    input.attr("maxlength", 1);
                }
                if (presenter.useNumericKeyboard) {
                    input.attr("step", "any");
                }
                $container.append(input);
                break;
            case this.ELEMENT_TYPE.LINE:
                break;
            case this.ELEMENT_TYPE.SYMBOL:
                $container.html(this.convertLaTeX(value));
                $container.data('value',value);
                break;
            case this.ELEMENT_TYPE.DOT:
                $container.html(value);
                break;
            case this.ELEMENT_TYPE.HELP_BOX:
                inputType = presenter.useNumericKeyboard ? "tel" : "text";
                input = $("<input type='" + inputType + "'>");
                input.addClass("writing-calculations-input");
                if (presenter.useNumericKeyboard) {
                    input.attr("step", "any");
                }
                input.val(value);
                $container.append(input);
                break;
            default:
                $container.html(value);
        }
    };

    presenter.convertLaTeX = function (value) {
        if (value === "*") {
            return presenter.signs['Multiplication'];
        } else if (value === ":" || value === ")") {
            return presenter.signs['Division'];
        } else if (value === "+") {
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
        if( this.isHelpBox(element)) return this.ELEMENT_TYPE.HELP_BOX;
    };

    presenter.isDot = function(element) {
        return element == "." || element == ",";
    };

    /**
     Check if valid empty box == will be empty box in run
     @method isEmptyBox

     @param {String} element element HTML
    */
    presenter.isEmptyBox = function(element) {
        if ((element.length < 2)
            || (element[0] !== '[' || element[element.length - 1] !== ']')) {
            return false;
        }

        if (!presenter.multisigns) {
            const pattern = /\[[\d.,]?\]/g; // matches: '[number]' or '[.]' or '[,]'
            return pattern.test(element);
        }

        const content = element.slice(1, element.length - 1);
        return (presenter.isDot(content) || presenter.isIntegerOrFloat(content));
    };

    /**
     Check if valid help box
     @method isHelpBox

     @param {String} element element HTML
    */
    presenter.isHelpBox = function(element) {
        if ((element.length < 2)
            || (element[0] !== '{' || element[element.length - 1] !== '}')) {
            return false;
        }

        const content = element.slice(1, element.length - 1);
        return (presenter.isDot(content) || presenter.isIntegerOrFloat(content)) || content === "";
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
        const commonTestsResult = isNaNCommonTests(value);
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
        const commonTestsResult = isNaNCommonTests(value);
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

    function isNaNCommonTests (value) {
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
        return this.$view.find(".writing-calculations-input");
    }

    presenter.getEmptyBoxesInputs = function() {
        return this.$view.find(".container-emptyBox .writing-calculations-input");
    };

    presenter.getHelpBoxesInputs = function() {
        return this.$view.find(".container-helpBox .writing-calculations-input");
    };

    presenter.isAllEmptyBoxInputsFilled = function() {
        const $emptyBoxesInputs = presenter.getEmptyBoxesInputs();

        for (let i = 0; i < $emptyBoxesInputs.length; i++) {
            if ($($emptyBoxesInputs[i]).val().length == 0) return false;
        }

        return true;
    };

    presenter.handleShownAnswers = function () {
        presenter.isShowAnswersActive && presenter.hideAnswers();
        presenter.isGradualShowAnswersActive && presenter.gradualHideAnswers();
    }

    presenter.setShowErrorsMode = function() {
        if(presenter.isNotActivity){
            return;
        }

        const $emptyBoxesInputs = presenter.getEmptyBoxesInputs();
        const $helpBoxesInputs = presenter.getHelpBoxesInputs();
        disableInputs($helpBoxesInputs);

        presenter.handleShownAnswers();

        if (!presenter.isCommutativity) {
            $.each($emptyBoxesInputs, function(){
                const answer = presenter.createAnswer($(this).attr("row"), $(this).attr("cell"), $(this).val());

                if (ModelValidationUtils.isStringEmpty($(this).val())) {
                    presenter.markEmpty($(this));
                } else if (presenter.isCorrect(answer)) {
                    presenter.markCorrect($(this));
                } else {
                    presenter.markIncorrect($(this));
                }
            });
        } else if (presenter.isAllEmptyBoxInputsFilled()) {
            const isCorrect = presenter.isAllEmptyBoxInputsCorrectlyFilled();

            if (isCorrect) {
                presenter.$view.addClass('correct');
            } else {
                presenter.$view.addClass('wrong');
            }

            disableInputs($emptyBoxesInputs);
        } else {
            disableInputs($emptyBoxesInputs);
        }
    };

    function disableInputs(inputs) {
        inputs.attr("disabled", "disabled");
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

    presenter.getAllAnswers = function($elements) {
        const answers = [];

        $.each($elements, function(){
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

    presenter.isAllEmptyBoxInputsCorrectlyFilled = function() {
        const $elements = this.$view.find('.container-number, .container-emptyBox .writing-calculations-input');
        const answers = presenter.getAllAnswers($elements);

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
        const $emptyBoxesInputs = presenter.getEmptyBoxesInputs();
        if (typeof(presenter.userAnswers) !== "undefined") {
            $.each($emptyBoxesInputs, function(index){
                presenter.userAnswers[index] = '';
            });
        }

        const $helpBoxesInputs = presenter.getHelpBoxesInputs();
        if (typeof(presenter.helpBoxesUserAnswers) !== "undefined") {
            const defaultValues = presenter.helpBoxesDefaultValues.flat();
            $.each($helpBoxesInputs, function(index){
                presenter.helpBoxesUserAnswers[index] = defaultValues[index];
                $(this).val(presenter.helpBoxesUserAnswers[index]);
            });
        }

        presenter.setVisibility(presenter.isVisibleByDefault);
        presenter.isVisible = presenter.isVisibleByDefault;
        presenter.isScoreSaved = false;
        presenter.isDisabled = false;
    };

    presenter.clean = function(removeMarks, removeValues) {
        const $inputs = presenter.getInputs();
        $.each($inputs, function(){
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

    presenter.getEmptyBoxesInputsData = function() {
        const $inputs = presenter.getEmptyBoxesInputs();
        const inputsData = {
            values : [],
            correctAnswersCount : 0,
            incorrectAnswersCount : 0
        };

        presenter.handleShownAnswers();

        $.each($inputs, function () {
            let value = $(this).val();
            value = presenter.parseValue(value);
            inputsData.values.push(value);

            if (value === undefined || value === "") return true; // jQuery.each continue

            const answer = presenter.createAnswer($(this).attr("row"), $(this).attr("cell"), $(this).val());
            if( presenter.isCorrect(answer) ) {
                inputsData.correctAnswersCount++;
            } else {
                inputsData.incorrectAnswersCount++;
            }
        });
        return inputsData;
    };

    presenter.getHelpBoxesInputsData = function() {
        const $inputs = presenter.getHelpBoxesInputs();
        const inputsData = {
            values : [],
        };

        presenter.handleShownAnswers();

        $.each($inputs, function () {
            let value = $(this).val();
            value = presenter.parseValue(value);
            inputsData.values.push(value);
        });
        return inputsData;
    };

    presenter.getState = function() {
        presenter.handleShownAnswers();

        return JSON.stringify({
            "inputsData" : this.getEmptyBoxesInputsData(),
            "helpBoxesInputsData" : presenter.getHelpBoxesInputsData(),
            "isVisible" : presenter.isVisible,
        });
    };

    presenter.setState = function(stateString) {
        if (ModelValidationUtils.isStringEmpty(stateString)) return;

        const state = JSON.parse(stateString);
        if (state.inputsData) {
            const $emptyBoxesInputs = presenter.getEmptyBoxesInputs();
            const inputsData = state.inputsData;
            $.each($emptyBoxesInputs, function(index){
                $(this).val(inputsData.values[index].toString());
            });
        }

        if (state.helpBoxesInputsData) {
            const $helpBoxesInputs = presenter.getHelpBoxesInputs();
            const helpBoxesInputsData = state.helpBoxesInputsData;
            $.each($helpBoxesInputs, function(index){
                $(this).val(helpBoxesInputsData.values[index].toString());
            });
        }

        if (state.isVisible != undefined) {
            presenter.isVisible = state.isVisible;
            presenter.setVisibility(presenter.isVisible);
        }
    };

    presenter.getScore = function() {
        if(presenter.isNotActivity){
            return 0;
        }

        if (presenter.isShowAnswersActive || presenter.isGradualShowAnswersActive) {
            return presenter.currentScore;
        }
        return this.getPoints("correct");
    };

    presenter.getMaxScore = function() {
        if(presenter.isNotActivity){
            return 0;
        }

        if (presenter.isShowAnswersActive || presenter.isGradualShowAnswersActive) {
            return presenter.currentMaxScore;
        }
        return this.getPoints("all");
    };

    presenter.getErrorCount = function() {
        if(presenter.isNotActivity){
            return 0;
        }

        if (presenter.isShowAnswersActive || presenter.isGradualShowAnswersActive) {
            return presenter.currentErrorCount;
        }
        return this.getPoints("incorrect");
    };

    presenter.getPoints = function(type) {
        const inputsData = this.getEmptyBoxesInputsData();

        if (presenter.isCommutativity) {
            switch (type) {
                case 'correct':
                    return presenter.isAllEmptyBoxInputsCorrectlyFilled() ? 1 : 0;
                case 'incorrect':
                    if (presenter.isAllEmptyBoxInputsFilled()) {
                        return presenter.isAllEmptyBoxInputsCorrectlyFilled() ? 0 : 1;
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

    presenter.onEventReceived = function (eventName, eventData) {
        switch (eventName) {
            case "ShowAnswers":
                presenter.showAnswers();
                break;

            case "GradualShowAnswers":
                presenter.gradualShowAnswers(eventData);
                break;

            case "HideAnswers":
                presenter.hideAnswers();
                break;

            case "GradualHideAnswers":
                presenter.gradualHideAnswers();
                break;
        }
    };

    presenter.disableInputs = function () {
        if (presenter.isDisabled) {
            return;
        }

        presenter.isDisabled = true;
        const $inputs = presenter.getInputs();
        $.each($inputs, function() {
            $(this).attr("disabled", true);
        });
    }

    presenter.enableInputs = function () {
        presenter.isDisabled = false;

        const $inputs = presenter.getInputs();
        $.each($inputs, function() {
            $(this).attr("disabled", false);
        });
    }

    presenter.showAnswers = function () {
        if (presenter.isNotActivity){
            return;
        }

        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        presenter.saveCurrentScore();
        presenter.isShowAnswersActive = true;
        presenter.clean(true,false);
        presenter.isDisabled = true;
        const correctAnswers = presenter.correctAnswersList;

        const $emptyBoxesInputs = presenter.getEmptyBoxesInputs();
        $.each($emptyBoxesInputs, function(index){
            $(this).addClass('writing-calculations_show-answers');
            $(this).attr("disabled", true);
            presenter.userAnswers.push($(this).val());
            $(this).val(correctAnswers[index].value);
        });

        const $helpBoxesInputs = presenter.getHelpBoxesInputs();
        $.each($helpBoxesInputs, function(){
            $(this).addClass('writing-calculations_show-answers');
            $(this).attr("disabled", true);
            presenter.helpBoxesUserAnswers.push($(this).val());
            $(this).val("");
        });
    };

    presenter.gradualShowAnswers = function (eventData) {
        presenter.disableInputs();

        if (eventData.moduleID !== presenter.ID) {
            return;
        }

        if (presenter.showAllAnswersInGSA) {
            presenter.showAnswers();
            return;
        }

        if (!presenter.isGradualShowAnswersActive) {
            const $helpBoxesInputs = presenter.getHelpBoxesInputs();
            $.each($helpBoxesInputs, function(){
                $(this).addClass('writing-calculations_show-answers');
                $(this).attr("disabled", true);
                presenter.helpBoxesUserAnswers.push($(this).val());
                $(this).val("");
            });
        }
        presenter.isGradualShowAnswersActive = true;
        presenter.saveCurrentScore();
        const input = presenter.getEmptyBoxesInputs()[eventData.item];

        $(input).addClass('writing-calculations_show-answers');
        presenter.userAnswers.push($(input).val());
        $(input).val(presenter.correctAnswersList[eventData.item].value);
    }

    presenter.hideAnswers = function () {
        if (presenter.isNotActivity || !presenter.isShowAnswersActive) {
            return;
        }

        presenter.isShowAnswersActive = false;
        const $emptyBoxesInputs = presenter.getEmptyBoxesInputs();
        $.each($emptyBoxesInputs, function(index){
            $(this).val(presenter.userAnswers[index]);
            $(this).removeClass('writing-calculations_show-answers');
            $(this).attr("disabled", false);
        });

        const $helpBoxesInputs = presenter.getHelpBoxesInputs();
        $.each($helpBoxesInputs, function(index){
            $(this).val(presenter.helpBoxesUserAnswers[index]);
            $(this).removeClass('writing-calculations_show-answers');
            $(this).attr("disabled", false);
        });

        presenter.userAnswers = [];
        presenter.helpBoxesUserAnswers = [];
        presenter.isDisabled = false;
    };

    presenter.gradualHideAnswers = function () {
        if (presenter.showAllAnswersInGSA && presenter.isShowAnswersActive) {
            presenter.hideAnswers();
            return;
        }

        presenter.enableInputs();

        if (presenter.isNotActivity || !presenter.isGradualShowAnswersActive) {
            return;
        }

        presenter.isGradualShowAnswersActive = false;
        presenter.isScoreSaved = false;

        const $emptyBoxesInputs = presenter.getEmptyBoxesInputs();
        presenter.userAnswers.forEach((userAnswer, index) => {
            const input = $emptyBoxesInputs[index];
            $(input).val(presenter.userAnswers[index]);
            $(input).removeClass('writing-calculations_show-answers');
        });

        const $helpBoxesInputs = presenter.getHelpBoxesInputs();
        $.each($helpBoxesInputs, function(index){
            $(this).val(presenter.helpBoxesUserAnswers[index]);
            $(this).removeClass('writing-calculations_show-answers');
        });

        presenter.userAnswers = [];
        presenter.helpBoxesUserAnswers = [];
    };

    presenter.saveCurrentScore = function () {
        if (presenter.isScoreSaved) {
            return;
        }
        presenter.currentScore = presenter.getScore();
        presenter.currentErrorCount = presenter.getErrorCount();
        presenter.currentMaxScore = presenter.getMaxScore();

        presenter.isScoreSaved = true;
    }

    presenter.getActivitiesCount = function () {
        return presenter.showAllAnswersInGSA ? 1 : presenter.getEmptyBoxesInputs().length;
    }

    presenter.validateModelValue = function (modelValue) {
        const rows = presenter.convertStringToArray(modelValue);
        const elementsData = [];

        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            let row = rows[rowIndex];

            const validatedAnswerBracketsNumber = validateAnswerBracketsNumber(row, rowIndex);
            if (!validatedAnswerBracketsNumber.isValid) {
                return validatedAnswerBracketsNumber;
            }

            const validatedHelpBracketsNumber = validateHelpBracketsNumber(row, rowIndex);
            if (!validatedHelpBracketsNumber.isValid) {
                return validatedHelpBracketsNumber;
            }

            let cellBoxIndex = 0;
            elementsData.push([]);
            for (let startingIndex = 0; startingIndex < row.length; ) {
                let elementValue = row[startingIndex];
                let elementLength = 1;
                let elementData = {};

                const isEndOfAnswerGap = elementValue === ']';
                if (isEndOfAnswerGap) {
                    return getErrorObject("V02", {rowIndex: rowIndex + 1});
                }

                const isEndOfHelpGap = elementValue === '}';
                if (isEndOfHelpGap) {
                    return getErrorObject("V07", {rowIndex: rowIndex + 1});
                }

                const isStartOfAnswerGap = elementValue === '[';
                const isStartOfHelpGap = elementValue === '{';
                if (isStartOfHelpGap) {
                    const validatedGapLength = validateHelpGapLength(row, rowIndex, startingIndex);
                    if (!validatedGapLength.isValid) {
                        return validatedGapLength;
                    }

                    elementLength = validatedGapLength.value;
                    elementValue = row.slice(startingIndex, startingIndex + elementLength);
                    elementData = presenter.createElementData(rowIndex + 1, ++cellBoxIndex, elementValue, true);
                    if (elementData.type !== presenter.ELEMENT_TYPE.HELP_BOX) {
                        return getErrorObject("V08", {rowIndex: rowIndex + 1, value: elementData.rawValue});
                    }

                    if (presenter.helpBoxesDefaultValues[rowIndex] === undefined) {
                        presenter.helpBoxesDefaultValues[rowIndex] = [];
                    }

                    const answer = elementData.createAnswer();
                    presenter.helpBoxesDefaultValues[rowIndex].push(answer.value);
                } else if (isStartOfAnswerGap) {
                    const validatedGapLength = validateAnswerGapLength(row, rowIndex, startingIndex);
                    if (!validatedGapLength.isValid) {
                        return validatedGapLength;
                    }

                    elementLength = validatedGapLength.value;
                    elementValue = row.slice(startingIndex, startingIndex + elementLength);
                    elementData = presenter.createElementData(rowIndex + 1, ++cellBoxIndex, elementValue, true);
                    if (elementData.type !== presenter.ELEMENT_TYPE.EMPTY_BOX) {
                        return getErrorObject("V05", {rowIndex: rowIndex + 1, value: elementData.rawValue});
                    }

                    if (presenter.answers[rowIndex] === undefined) {
                        presenter.answers[rowIndex] = [];
                    }

                    const answer = elementData.createAnswer();
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

    function validateAnswerBracketsNumber(row, rowIndex) {
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

    function validateHelpBracketsNumber(row, rowIndex) {
        const errorMessageSubstitutions = {rowIndex: rowIndex + 1};
        const openingBracketsCount = row.split('').filter(x => x === '{').length;
        const closingBracketsCount = row.split('').filter(x => x === '}').length;
        if (openingBracketsCount > closingBracketsCount) {
            return getErrorObject("V06", errorMessageSubstitutions);
        } else if (openingBracketsCount < closingBracketsCount) {
            return getErrorObject("V07", errorMessageSubstitutions);
        }
        return getCorrectObject(openingBracketsCount + closingBracketsCount);
    }

    function validateAnswerGapLength(rowString, rowIndex, startIndex) {
        const errorMessageSubstitutions = {rowIndex: rowIndex + 1};

        const nextClosingAnswerBracketIndex = rowString.indexOf(']', startIndex);
        if (nextClosingAnswerBracketIndex === -1) {
            return getErrorObject("V01", errorMessageSubstitutions);
        }

        const nextOpeningAnswerBracketIndex = rowString.indexOf('[', startIndex + 1);
        if (nextOpeningAnswerBracketIndex !== - 1 && nextOpeningAnswerBracketIndex <= nextClosingAnswerBracketIndex) {
            return getErrorObject("V01", errorMessageSubstitutions);
        }

        const length = nextClosingAnswerBracketIndex - startIndex + 1;
        if (length === 2) {
            return getErrorObject("V03", errorMessageSubstitutions);
        }

        if (!presenter.multisigns && length !== 3) {
            return getErrorObject("V04", errorMessageSubstitutions);
        }
        return getCorrectObject(length);
    }

    function validateHelpGapLength(rowString, rowIndex, startIndex) {
        const errorMessageSubstitutions = {rowIndex: rowIndex + 1};

        const nextClosingHelpBracketIndex = rowString.indexOf('}', startIndex);
        if (nextClosingHelpBracketIndex === -1) {
            return getErrorObject("V06", errorMessageSubstitutions);
        }

        const nextOpeningHelpBracketIndex = rowString.indexOf('{', startIndex + 1);
        if (nextOpeningHelpBracketIndex !== - 1 && nextOpeningHelpBracketIndex <= nextClosingHelpBracketIndex) {
            return getErrorObject("V07", errorMessageSubstitutions);
        }

        const length = nextClosingHelpBracketIndex - startIndex + 1;
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

    presenter.setWCAGStatus = function(isOn) {
        presenter.isWCAGOn = isOn;
    }

     presenter.keyboardController = function(keycode, isShift, event) {
        if (!presenter.isGapFocused) event.preventDefault();
        switch (keycode) {
            case 9: // TAB
                if (isShift) {
                    prevGap();
                    if (!presenter.isGapFocused) readCurrentCell();
                } else {
                    nextGap();
                    if (!presenter.isGapFocused) readCurrentCell();
                }
                break;
            case 13: //ENTER
                if (isShift) {
                    exitModuleInTTS();
                } else {
                    enter();
                    readCurrentCell();
                }
                break;
            case 32: // SPACE
                break;
            case 38: // UP
                prevRow();
                if (!presenter.isGapFocused) readCurrentCell();
                break;
            case 40: // DOWN
                nextRow();
                if (!presenter.isGapFocused) readCurrentCell();
                break;
            case 37: // LEFT
                prevColumn();
                if (!presenter.isGapFocused) readCurrentCell();
                break;
            case 39: // RIGHT
                nextColumn();
                if (!presenter.isGapFocused) readCurrentCell();
                break;
            case 27: // ESC
                escape(event);
                break;
        }
    }

    function nextRow() {
        if (!presenter.isWCAGOn || presenter.isGapFocused) return;
        if (presenter.keyboardState.y + 1 < presenter.elementsTable.length) {
            presenter.keyboardState.y += 1;
            if (presenter.keyboardState.y != -1 && presenter.keyboardState.x >= presenter.elementsTable[presenter.keyboardState.y].length) {
                presenter.keyboardState.x = presenter.elementsTable[presenter.keyboardState.y].length - 1;
            }
        }
        updateGapIndex();
        updateKeyboardNavigationSelectionClass();
    }

    function prevRow() {
        if (!presenter.isWCAGOn || presenter.isGapFocused) return;
        if (presenter.keyboardState.y - 1 > -2) {
            presenter.keyboardState.y -= 1;
            if (presenter.keyboardState.y == -1) {
                presenter.keyboardState.x = 0;
            } else if (presenter.keyboardState.x >= presenter.elementsTable[presenter.keyboardState.y].length) {
                presenter.keyboardState.x = presenter.elementsTable[presenter.keyboardState.y].length - 1;
            }
        }
        updateGapIndex();
        updateKeyboardNavigationSelectionClass();
    }

    function nextColumn() {
        if (!presenter.isWCAGOn || presenter.isGapFocused) return;
        if (presenter.keyboardState.y != -1  && presenter.keyboardState.x + 1 < presenter.elementsTable[presenter.keyboardState.y].length) {
            presenter.keyboardState.x += 1;
        }
        updateGapIndex();
        updateKeyboardNavigationSelectionClass();
    }

    function prevColumn() {
        if (!presenter.isWCAGOn || presenter.isGapFocused) return;
        if (presenter.keyboardState.y != -1  && presenter.keyboardState.x > 0) {
            presenter.keyboardState.x -= 1;
        }
        updateGapIndex();
        updateKeyboardNavigationSelectionClass();
    }

    function nextGap() {
        if (presenter.isGapFocused) return;
        if (presenter.keyboardState.gapIndex + 1 < presenter.gapElements.length) {
            presenter.keyboardState.gapIndex += 1;
            var gap = presenter.gapElements[presenter.keyboardState.gapIndex];
            presenter.keyboardState.x = gap.x;
            presenter.keyboardState.y = gap.y;
            updateKeyboardNavigationSelectionClass();
        }
    }

    function prevGap() {
        if (presenter.isGapFocused) return;
        if (presenter.keyboardState.gapIndex - 1 > -1 && presenter.gapElements.length > 0) {
            presenter.keyboardState.gapIndex -= 1;
            var gap = presenter.gapElements[presenter.keyboardState.gapIndex];
            presenter.keyboardState.x = gap.x;
            presenter.keyboardState.y = gap.y;
            updateKeyboardNavigationSelectionClass();
        }
    }

    function updateGapIndex() {
        presenter.keyboardState.gapIndex = -1;
        for (var i = 0; i < presenter.gapElements.length; i++) {
            if (presenter.keyboardState.x == presenter.gapElements[i].x && presenter.keyboardState.y == presenter.gapElements[i].y) {
                presenter.keyboardState.gapIndex = i;
                break;
            }
        }
    }

        function enter() {
            if (presenter.keyboardState.y != -1) {
                var $gap = presenter.elementsTable[presenter.keyboardState.y][presenter.keyboardState.x].find('input.writing-calculations-input');
                if ($gap.length > 0) {
                    presenter.isGapFocused = true;
                    $gap.addClass('keyboard_navigation_active_element');
                    $gap.focus();
                }
            }
        }

        function escape(event) {
            if (presenter.isGapFocused) {
                if (event) {
                    event.stopPropagation();
                    event.preventDefault();
                }
                var $gap = presenter.elementsTable[presenter.keyboardState.y][presenter.keyboardState.x].find('input.writing-calculations-input');
                if ($gap.length > 0) {
                    setTimeout(()=>{
                        presenter.isGapFocused = false;
                    }, 0);
                    $gap.removeClass('keyboard_navigation_active_element');
                    $gap.blur();
                }
            } else {
                exitModuleInTTS();
            }
        }

        function exitModuleInTTS() {
            presenter.isGapFocused = false;
            presenter.keyboardState.x = 0;
            presenter.keyboardState.y = -1;
            presenter.keyboardState.gapIndex = -1;
            updateKeyboardNavigationSelectionClass();
        }

    function updateKeyboardNavigationSelectionClass() {
        presenter.$view.find('.'+presenter.KEYBOARD_SELECTED_CLASS).removeClass(presenter.KEYBOARD_SELECTED_CLASS);
        if (presenter.keyboardState.y >= 0) {
            presenter.elementsTable[presenter.keyboardState.y][presenter.keyboardState.x].children().first().addClass(presenter.KEYBOARD_SELECTED_CLASS);
        }
    }

    function readCurrentCell() {
        presenter.readCell(presenter.keyboardState.x, presenter.keyboardState.y);
    }

    presenter.getCellTitle = function (x, y) {
        var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var title = "";
        do {
            var mod = x % 26;
            title = alphabet[mod] + " " + title;
            x -= mod;
            x = x / 26 - 1;
        } while (x >= 0);
        title += (y+1);
        return title;
    }

    presenter.readCell = function(x, y) {
        if (!presenter.isWCAGOn) return;
        var data = [];
        if (y < 0) {
            data.push(window.TTSUtils.getTextVoiceObject(presenter.descriptionOfOperation, presenter.langTag)); //TODO
        } else {
            data.push(window.TTSUtils.getTextVoiceObject(presenter.getCellTitle(x,y)));

            var container = presenter.elementsTable[y][x].children().first();
            var containerType = presenter.getContainerType(container);

            switch(containerType) {
                case presenter.ELEMENT_TYPE.NUMBER:
                    data.push(window.TTSUtils.getTextVoiceObject(container.html(), presenter.langTag));
                    break;
                case presenter.ELEMENT_TYPE.SYMBOL:
                    var value = container.data('value');
                    if (value === "*") {
                        data.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.multiplicationSign));
                    } else if (value === ":" || value === ")") {
                        data.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.divisionSign));
                    } else if (value === "+") {
                        data.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.additionSign));
                    } else if (value === "-") {
                        data.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.subtractionSign));
                    } else if (value === "#") {
                        data.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.equalsSign));
                    }
                    break;
                case presenter.ELEMENT_TYPE.EMPTY_BOX:
                    data.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.gap));
                    var input = container.find('input');
                    if (input.length > 0) {
                        var inputVoices = presenter.getTextVoicesFromInput(input);
                        data = data.concat(inputVoices);
                    }
                    break;
                case presenter.ELEMENT_TYPE.LINE:
                    data.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.line));
                    break;
                case presenter.ELEMENT_TYPE.HELP_BOX:
                    data.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.additionalGap));
                    var input = container.find('input');
                    if (input.length > 0) {
                        var inputVoices = presenter.getTextVoicesFromInput(input);
                        data = data.concat(inputVoices);
                    }
                    break;
                default:
                    break;
            }

            var nextSibling = presenter.elementsTable[y][x].next();
            if (nextSibling.length > 0 && presenter.getContainerType(nextSibling.children().first()) == presenter.ELEMENT_TYPE.DOT) {
                data.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.decimalSeparator));
            }
        }
        presenter.speak(data);
    }

    presenter.getTextVoicesFromInput = function(inputElement) {
        var data =[];
        var value = inputElement.val();
        if (value.length == 0) {
            data.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.empty));
        } else {
            data.push(window.TTSUtils.getTextVoiceObject(value, presenter.langTag));
        }
        if (inputElement.hasClass('correct')) {
            data.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.correct));
        } else if (inputElement.hasClass('incorrect')) {
            data.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.wrong));
        }
        return data;
    };

    presenter.getTextToSpeechOrNull = function (playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    presenter.speak = function (data) {
        if (data.length == 0) return;
        var tts = presenter.getTextToSpeechOrNull(presenter.playerController);

        if (tts && presenter.isWCAGOn) {
            tts.speak(data);
        }
    }

    presenter.isDeactivationBlocked = function() {
        return presenter.isGapFocused;
    };

    return presenter;
}
