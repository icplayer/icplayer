function AddonTable_create() {

    /*
        INTEGRATION WITH MATH MODULE:
            Table supports integration with Math module. Table which is not activity, will show answers provided by
            Math module. Requires implementation of methods and variables listed below.

            Attributes:
                @param isConnectedWith {boolean}  required by Math module, to detect if table is connected with Math

            Methods:
                presenter.setGapAnswer (gapIndex, answer, answersLength) - method used by Math to set gap answer at
                    show answers when table is not activity. Gap index based by DOM occurence order. 1-n based

                presenter.setUserValue (gapIndex, value) - method used by Math module to restore user answer at hide answers

                presenter.getValue (gapIndex) - method used by Math module to get user value in gap by index

                presenter.isActivity - method used by Math module to determine if addon is activity
     */


    var presenter = function () {
    };

    var isConnectedWithMath = false;
    presenter.gapsSize = [];
    presenter.isSetShowErrorsMode = false;

    presenter.ERROR_CODES = {
        'RW_01': 'Number of rows must be a positive integer!',
        'CL_01': 'Number of columns must be a positive integer!',
        'CO_01': 'Row number must be a positive integer!',
        'CO_02': 'Column number must be a positive integer',
        'CO_03': 'Row number must be a number from 1 to rows count!',
        'CO_04': 'Column number must be a number from 1 to columns count',
        'CO_05': 'Each table cell can be defined only once!',
        'CO_06': 'Empty table cell definition must contain only one empty element!',
        'CR_00': 'Column and row numbers must be sequential within one table cell',
        'CW_01': "Number of items in 'Columns width' property cannot be higher than number of columns!",
        'RH_01': "Number of items in 'Rows height' property cannot be higher than number of rows!",
        'GW_01': "Gap width incorrect!"
    };

    presenter.replaceGapID = function (gap, parsedText) {
        var gapID = presenter.configuration.addonID + gap.id;
        var patt = new RegExp("id='" + gap.id + "'");
        var rep = "id='" + gapID + "'";
        return  parsedText.replace(patt, rep);
    };

    function getParsedHTMLView () {
        return presenter.textParser.parseGaps(presenter.$view.html(),
            { isCaseSensitive: presenter.configuration.isCaseSensitive }
        );
    }

    presenter.parseGaps = function (isPreview) {
        if (presenter.configuration.gapType == "draggable") {
            return presenter.parseGapsWrapper(presenter.DraggableDroppableGap, isPreview);
        } else {
            return presenter.parseGapsWrapper(presenter.EditableInputGap, isPreview);
        }
    };

    function changeInlineGapsIDs (inlineGaps, parsedText) {
        inlineGaps.forEach(function (gap) {
            parsedText = presenter.replaceGapID(gap, parsedText);
            var gapID = presenter.configuration.addonID + gap.id;

            presenter.gapsContainer.addGap(new presenter.SelectGap(gapID, [gap.answer], gap.value));
        });

        return parsedText;
    }

    function changeSimpleGapsIDs (simpleGaps, parsedText, objectType) {
        simpleGaps.forEach(function (gap) {
            parsedText = presenter.replaceGapID(gap, parsedText);
            var gapID = presenter.configuration.addonID + gap.id;
            presenter.gapsContainer.addGap(new objectType(gapID, gap.answers, 1));
        });

        return parsedText;
    }

    presenter.parseGapsWrapper = function (objectType, isPreview) {
        var textParserResult = getParsedHTMLView();

        var parsedText = textParserResult.parsedText;
        parsedText = changeSimpleGapsIDs(textParserResult.gaps, parsedText, objectType);
        parsedText = changeInlineGapsIDs(textParserResult.inLineGaps, parsedText, objectType);

        if(!isPreview){
            presenter.$view.html(parsedText);

            presenter.getInputsSize();
        }
    };

    presenter.getInputsSize = function () {
        presenter.$view.find('input').each(function () {
            var inputID = $(this).attr('id'),
                inputSize = $(this).attr('size');

            presenter.gapsSize.push({id : inputID, size: inputSize})
        });
    };

    presenter.setGapsClassAndWidth = function () {
        presenter.$view.find('.ic_inlineChoice').addClass('ic_gap');
        presenter.$view.find('.ic_inlineChoice').css('width', presenter.configuration.gapWidth.value+"px");
    };

    presenter.initializeGaps = function (isPreview) {
        presenter.parseGaps(isPreview);

        if(presenter.configuration.gapType == 'math'){
            presenter.gapsContainer.gaps = [];
            $(presenter.$view).find('input').each(function () {
                $(this).replaceWith("\\gap{" +
                    $(this).attr('id') +
                    "|" +
                    1 +
                    "|" +
                    presenter.configuration.gapWidth.value +
                    "|" +
                    "{{value:" + $(this).attr('id') + "}}" +
                    "}");
            });
        }

        presenter.gapsContainer.replaceDOMViewWithGap();
        presenter.setGapsClassAndWidth();
    };

    function deleteCommands () {
        delete presenter.getScore;
        delete presenter.getMaxScore;
        delete presenter.getState;
        delete presenter.setState;
        delete presenter.getGapTextCommand;
        delete presenter.getGapTextCommand;
        delete presenter.markGapAsEmptyCommand;
        delete presenter.markGapAsCorrectCommand;
        delete presenter.markGapAsWrongCommand;
        delete presenter.enableGapCommand;
        delete presenter.enableAllGaps;
        delete presenter.disableGapCommand;
        delete presenter.disableAllGaps;
    }

    function replaceInputsInPreview () {
        if (presenter.configuration.gapType == "draggable") {
            var inputs = presenter.$wrapper.find("input");

            for (var i = 0; i < inputs.length; i++) {
                $(inputs[i]).replaceWith(presenter.DraggableDroppableGap.prototype.createView());
            }
        }
    }

    presenter.logic = function (view, model, isPreview) {
        presenter.$view = $(view);
        presenter.$wrapper = presenter.$view.find('.table-addon-wrapper');
        presenter.configuration = presenter.validateModel(presenter.upgradeModel(model));
        presenter.isPreview = isPreview;

        if(presenter.configuration.gapType == "math"){
            var mathJaxDeferred = new jQuery.Deferred();
            presenter.mathJaxProcessEndedDeferred = mathJaxDeferred;
            presenter.mathJaxProcessEnded = mathJaxDeferred.promise();

            MathJax.Hub.Register.MessageHook("End Process", function (message) {
                if ($(message[1]).hasClass('ic_page')) {
                    presenter.mathJaxProcessEndedDeferred.resolve();
                }
            });
        }

        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            deleteCommands();
            return;
        }

        if(presenter.configuration.gapType == "math"){
            presenter.mainLogic(isPreview);
            presenter.mathJaxProcessEnded.then(function() {
                MathJax.CallBack.Queue().Push(function () {
                    MathJax.Hub.Typeset(presenter.$view.find(".table-addon-wrapper")[0]);
                    if(!isPreview){
                        var checkSelector = setInterval(function () {
                            if ($(presenter.$view).find('input').length > 0) {
                                presenter.gapsContainer.gaps = [];
                                $(presenter.$view).find('input').each(function (_, index) {
                                    for(var i = 0; i < presenter.gapsAnswers.length; i++){
                                        if(presenter.gapsAnswers[i].id == $(this).attr('id')){
                                            var correctAnswers = presenter.gapsAnswers[i].answers;
                                        }
                                    }
                                    presenter.gapsContainer.addGap(new presenter.EditableInputGap($(this).attr('id'), correctAnswers, 1));
                                });
                                clearInterval(checkSelector);
                                presenter.eventBus.sendEvent('ValueChanged', []);
                            }
                        }, 100);
                    }
                });
            });
        }else{
            presenter.mainLogic(isPreview);
        }

        if(isPreview) {
            presenter.setEditorGapWidth();
        } else {
            presenter.setInputsSize();
        }
    };

    presenter.setInputsSize = function () {
        for (var i = 0; i < presenter.gapsSize.length; i++) {
            var inputId = presenter.gapsSize[i].id,
                size = presenter.gapsSize[i].size;

            presenter.$view.find('#'+inputId).attr('size', size);
        }
    };

    presenter.setEditorGapWidth = function () {
        presenter.$view.find('input').css("width", presenter.configuration.gapWidth.value+"px");
        presenter.$view.find('span').css("width", presenter.configuration.gapWidth.value+"px");
    };

    presenter.mainLogic = function (isPreview) {
        presenter.gapsContainer = new presenter.GapsContainerObject();

        var $table = presenter.generateTable(presenter.configuration.contents, isPreview);
        presenter.setColumnWidth($table, presenter.configuration.columnsWidths, presenter.configuration.rowsHeights);
        presenter.setRowHeight($table, presenter.configuration.rowsHeights);
        presenter.setVisibility(presenter.configuration.isVisible);

        presenter.initializeGaps(isPreview);

        if (!isPreview) {
            presenter.parseDefinitionLinks();
        } else {
            var currentView = presenter.$view.html(),
                properView = presenter.textParser.parseGaps(currentView);
            presenter.$view.html(properView.parsedText);

            replaceInputsInPreview();
            presenter.setGapsClassAndWidth();
            presenter.$view.find('input').attr("size", "auto");
            if (presenter.configuration.gapType == "draggable") {
                presenter.$view.find('input').addClass("draggable-gap");
            }
        }

        presenter.gapsContainer.replaceGapsDOMWithView();
        presenter.lastDraggedItem = {};

        if (presenter.configuration.isDisabledByDefault) {
            presenter.gapsContainer.lockAllGaps();
        }
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();
        presenter.textParser = new TextParserProxy(controller.getTextParser());
        presenter.eventBus.addEventListener('ShowAnswers', this);
        presenter.eventBus.addEventListener('HideAnswers', this);
        presenter.eventBus.addEventListener('ItemSelected', this);
    };

    presenter.setTextParser = function (textParser) {
        presenter.textParser = new TextParserProxy(textParser());
    };

    presenter.getSelectedItem = function () {
        var item = presenter.lastDraggedItem;

        presenter.lastDraggedItem = {};

        return item;
    };

    presenter.createPreview = function (view, model) {
        presenter.logic(view, model, true);
    };

    presenter.run = function (view, model) {
        presenter.logic(view, model, false);
    };

    presenter.reset = function () {
        presenter.gapsContainer.reset();
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);
        presenter.isSetShowErrorsMode = false;
    };

    presenter.getState = function () {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        if(isConnectedWithMath){
            presenter.gapsContainer.unlockAllGaps();
        }

        var spans;
        var gaps = presenter.gapsContainer.getGapsState();

        if (presenter.configuration.gapType === "draggable") {
            spans = presenter.gapsContainer.getState();
        } else {
            spans = null;
        }

        return JSON.stringify({
            isVisible: presenter.configuration.isVisible,
            gaps: gaps,
            spans: spans
        });
    };

    presenter.setState = function (rawState) {
        var state = JSON.parse(rawState);

        presenter.setVisibility(state.isVisible);
        presenter.configuration.isVisible = state.isVisible;

        if(presenter.configuration.gapType == 'math'){
            var checkSelector = setInterval(function () {
                if ($(presenter.$view).find('.mathGap').length == presenter.gapsAnswers.length) {
                    try{
                    presenter.gapsContainer.setGapsState(state.gaps);
                    presenter.gapsContainer.setSpansState(state.spans);
                    clearInterval(checkSelector);
                    }catch(e){}
                }
            }, 100);
        }else{
            presenter.gapsContainer.setGapsState(state.gaps);
            presenter.gapsContainer.setSpansState(state.spans);
        }
    };

    /**
     * Generate table row (tr) element. Each cell has col_C and row_R classes where R is row number
     * (counted from 1 to rows count) and C is column number (from 1 to columns count).
     *
     * @param row row number counted from 0
     * @param content row content array
     * @param isPreview
     *
     * @return {jQuery} jQuery reference to new table row element
     */
    presenter.generateRow = function (row, content, isPreview) {
        var $rowElement = $(document.createElement('tr')), i, length;

        for (i = 0, length = content.length; i < length; i++) {
            if (!content[i]) continue;

            var $element = $(document.createElement('td'));

            $element.addClass('row_' + (row + 1));
            $element.addClass('col_' + (i + 1));
            $element.html(content[i].content);
            $element.attr({
                colspan: content[i].colSpan,
                rowspan: content[i].rowSpan
            });
            if (content[i].class) {
                $element.addClass(content[i].class)
            }
            if (content[i].style) {
                $element.attr({style:content[i].style})
            }

            $rowElement.append($element);
        }

        return $rowElement;
    };

    presenter.parseDefinitionLinks = function () {
        $.each(presenter.$view.find('td'), function (index, element) {
            $(element).html(presenter.textParser.parse($(element).html()));
        });

        presenter.textParser.connectLinks(presenter.$view);
    };

    /**
     * Generate table element with content based on provided array.
     *
     * @param content array with table cells contents
     * @param isPreview
     *
     * @return {jQuery} jQuery reference to new table element
     */
    presenter.generateTable = function (content, isPreview) {
        var $table = $(document.createElement('table'));

        for (var i = 0, length = content.length; i < length; i++) {
            var $row = presenter.generateRow(i, content[i], isPreview);

            $table.append($row);
        }

        presenter.$wrapper.html($table);

        return $table;
    };

    presenter.setColumnWidth = function ($table, columnWidth, rowsHeights) {
        var i = 0;
        if (presenter.configuration.newWidthCalculate) {
            var rowsNumber = rowsHeights.length;
            var columsNumber = columnWidth.length;
            for (var row = 1; row <= rowsNumber; row++) {
                var foundedRow = $table.find('.row_' + row);
                for (i = 0; i < columsNumber; i++) {
                    $(foundedRow[i]).css('width', columnWidth[i]);
                }
            }
        } else {
            var firstRow = $table.find('.row_1');

            for (i = 0; i < columnWidth.length; i++) {
                $(firstRow[i]).css('width', columnWidth[i]);
            }
        }
};


    presenter.setRowHeight = function ($table, rowHeight) {
        var i;
        for (i = 0; i < rowHeight.length; i++) {
            $table.find('.row_' + (i + 1)).each(function () {
                $(this).css('height', rowHeight[i]);
            });
        }
    };

    /**
     * Validate content list and convert it into multidimensional {Array}. Not specified contents equals empty elements.
     *
     * @param content list of content definition (consist Row, Column and Content fields)
     * @param rowsCount number of rows
     * @param columnsCount number of columns
     *
     * @return {Object} validation result
     * @return {Boolean} isValid
     * @return {String} error code if any occurs
     * @return {Array} contents array of contents. Dimensions based on Rows and Columns properties
     */
    presenter.validateContent = function (content, rowsCount, columnsCount) {
        var validatedContent = [], controlArray = [], c, r;

        for (r = 0; r < rowsCount; r++) {
            validatedContent[r] = [];
            controlArray[r] = [];

            for (c = 0; c < columnsCount; c++) {
                validatedContent[r][c] = { content: "", rowSpan: 1, colSpan: 1 };
                controlArray[r][c] = false;
            }
        }

        if (ModelValidationUtils.isArrayElementEmpty(content[0])) {
            if (content.length === 1) {
                return { isValid: true, content: validatedContent };
            } else {
                return { isValid: false, errorCode: 'CO_06' };
            }
        }

        for (var i = 0, length = content.length; i < length; i++) {
            var rows = presenter.validateSequence(content[i].Row, rowsCount, true);
            if (!rows.isValid)  return { isValid: false, errorCode: rows.errorCode };

            var columns = presenter.validateSequence(content[i].Column, columnsCount, false);
            if (!columns.isValid)  return { isValid: false, errorCode: columns.errorCode };

            for (r = 0; r < rows.values.length; r++) {
                for (c = 0; c < columns.values.length; c++) {
                    var row = rows.values[r] - 1;
                    var column = columns.values[c] - 1;

                    if (controlArray[row][column]) return { isValid: false, errorCode: 'CO_05' };
                    controlArray[row][column] = true;

                    if (r === 0 && c == 0) {
                        validatedContent[row][column] = {
                            content: content[i].Content,
                            rowSpan: rows.values.length,
                            colSpan: columns.values.length,
                            class : content[i].hasOwnProperty("CSS Class") ? content[i]["CSS Class"] : "",
                            style: content[i].hasOwnProperty("CSS Style") ? content[i]["CSS Style"] : ""
                        };
                    } else {
                        validatedContent[row][column] = undefined;
                    }
                }
            }
        }

        return { isValid: true, content: validatedContent };
    };

    presenter.validateSingleNumber = function (column, columnsCount, isRowValidated) {
        var validatedColumn = ModelValidationUtils.validatePositiveInteger(column);

        if (!validatedColumn.isValid) return { isValid: false, errorCode: isRowValidated ? 'CO_01' : 'CO_02'};
        if (validatedColumn.value > columnsCount) return { isValid: false, errorCode: isRowValidated ? 'CO_03' : 'CO_04' };

        return {isValid: true, value: validatedColumn.value };
    };

    presenter.validateSequence = function (columns, columnsCount, isRowValidated) {
        var values = [], validatedColumn, splittedColumns, i;

        splittedColumns = columns.indexOf(',') === -1 ? [columns] : columns.split(',');

        for (i = 0; i < splittedColumns.length; i++) {
            validatedColumn = presenter.validateSingleNumber(splittedColumns[i], columnsCount, isRowValidated);

            if (!validatedColumn.isValid) return { isValid: false, errorCode: validatedColumn.errorCode };

            values.push(validatedColumn.value);
        }

        if (values.length > 1) {
            for (i = 1; i < values.length; i++) {
                if (values[i - 1] + 1 !== values[i]) {
                    return { isValid: false, errorCode: 'CR_00' };
                }
            }
        }

        return { values: values, isValid: true };
    };

    presenter.convertDimensionsArray = function (columnWidth, columnsCount, propertyName) {
        if (columnWidth.length > columnsCount) return { isValid: false };

        var widths = [], value, i;
        for (i = 0; i < columnWidth.length; i++) {
            if (ModelValidationUtils.isStringEmpty(columnWidth[i][propertyName])) {
                value = 'auto';
            } else {
                value = columnWidth[i][propertyName];
            }

            widths.push(value);
        }

        if (columnWidth.length < columnsCount) {
            for (i = columnWidth.length; i < columnsCount; i++) {
                widths.push('auto');
            }
        }

        return { isValid: true, dimensions: widths };
    };

    /**
     * Validate user input configuration.
     *
     * @param model {Array} of properties injected into Addon
     *
     * @return {Object} validation result
     * @return {Boolean} isValid
     * @return {String} error code if any occurs
     * @return {Object} contents array of contents. Dimensions based on Rows and Columns properties
     */
    presenter.validateModel = function (model) {

        if (model["newWidthCalculate"] === undefined) {
            model["newWidthCalculate"] = false;
        }

        var validatedRows = ModelValidationUtils.validatePositiveInteger(model.Rows);
        if (!validatedRows.isValid) {
            return { isValid: false, errorCode: 'RW_01' };
        }

        var validatedColumns = ModelValidationUtils.validatePositiveInteger(model.Columns);
        if (!validatedColumns.isValid) {
            return { isValid: false, errorCode: 'CL_01' };
        }

        var validatedContents = presenter.validateContent(model["Table cells"], validatedRows.value, validatedColumns.value);
        if (!validatedContents.isValid) {
            return { isValid: false, errorCode: validatedContents.errorCode };
        }

        var convertedColumnWidth = presenter.convertDimensionsArray(model["Columns width"], validatedColumns.value, 'Width');
        if (!convertedColumnWidth.isValid) {
            return { isValid: false, errorCode: 'CW_01' };
        }

        var convertedRowWidths = presenter.convertDimensionsArray(model["Rows height"], validatedRows.value, 'Height');
        if (!convertedRowWidths.isValid) {
            return { isValid: false, errorCode: 'RH_01' };
        }

        var gapWidth = { isSet: false, value: undefined };
        if (!ModelValidationUtils.isStringEmpty(model["Gap width"])) {
            var validatedGapWidth = ModelValidationUtils.validatePositiveInteger(model["Gap width"]);
            if (!validatedGapWidth.isValid) {
                return { isValid: false, errorCode: 'GW_01' };
            } else {
                gapWidth = { isSet: true, value: validatedGapWidth.value };
            }
        }

        var isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);

        return {
            addonID: model.ID,
            isValid: true,
            contents: validatedContents.content,
            columnsWidths: convertedColumnWidth.dimensions,
            rowsHeights: convertedRowWidths.dimensions,
            isVisible: isVisible,
            isVisibleByDefault: isVisible,
            isActivity: !ModelValidationUtils.validateBoolean(model["Is not an activity"]),
            isNotActivity: ModelValidationUtils.validateBoolean(model["Is not an activity"]),
            isDisabledByDefault: ModelValidationUtils.validateBoolean(model["Is disabled"]),
            isPunctuationIgnored: ModelValidationUtils.validateBoolean(model["Ignore punctuation"]),
            isCaseSensitive: ModelValidationUtils.validateBoolean(model["Case sensitive"]),
            newWidthCalculate: ModelValidationUtils.validateBoolean(model["newWidthCalculate"]),
            gapWidth: gapWidth,
            gapType: model["Gap Type"]
        };
    };

    presenter.addColumnsWidth = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!model["Columns width"]) {
            upgradedModel["Columns width"] = [
                { Width: "" }
            ];
        }

        return upgradedModel;
    };

    presenter.addRowHeights = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!model["Rows height"]) {
            upgradedModel["Rows height"] = [
                { Height: "" }
            ];
        }

        return upgradedModel;
    };

    presenter.upgradeModel = function (model) {
        var modelWithColumnsWidth = presenter.addColumnsWidth(model);

        return presenter.addRowHeights(modelWithColumnsWidth);
    };

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

    presenter.getGapText = function (gapIndex) {
        return executeFunctionOnGap(gapIndex, "getGapValueByIndex");
    };

    presenter.getGapValue = function (gapIndex) {
        return presenter.getGapText(gapIndex);
    };

    presenter.getGapTextCommand = function (params) {
        return presenter.getGapText(parseInt(params[0], 10));
    };

    function executeFunctionOnGap(gapIndex, functionToCall) {
        var validatedGapIndex = presenter.validateGapIndex(gapIndex);

        if (validatedGapIndex.isValid) {
            return presenter.gapsContainer[functionToCall](validatedGapIndex.index);
        }
    }

    presenter.validateGapIndex = function (gapIndex) {
        if (isNaN(gapIndex) || gapIndex < 1 || gapIndex > presenter.gapsContainer.getLength()) {
            return {isValid: false};
        }

        return {
            isValid: true,
            index: parseInt(gapIndex, 10) - 1
        };
    };


    presenter.markGapAsCorrect = function (gapIndex) {
        executeFunctionOnGap(gapIndex, "markGapByIndexAsCorrect");
    };

    presenter.markGapAsCorrectCommand = function (params) {
        presenter.markGapAsCorrect(parseInt(params[0], 10));
    };

    presenter.markGapAsWrong = function (gapIndex) {
        executeFunctionOnGap(gapIndex, "markGapByIndexAsWrong");
    };

    presenter.markGapAsWrongCommand = function (params) {
        presenter.markGapAsWrong(parseInt(params[0], 10));
    };

    presenter.markGapAsEmpty = function (gapIndex) {
        executeFunctionOnGap(gapIndex, "markGapByIndexAsEmpty");
    };

    presenter.markGapAsEmptyCommand = function (params) {
        presenter.markGapAsEmpty(parseInt(params[0], 10));
    };

    presenter.enableGap = function (gapIndex) {
        executeFunctionOnGap(gapIndex, "unlockGapByIndex");
    };

    presenter.enableGapCommand = function (params) {
        presenter.enableGap(parseInt(params[0], 10));
    };

    presenter.enableAllGaps = function () {
        presenter.gapsContainer.unlockAllGaps();
    };

    presenter.disableGap = function (gapIndex) {
        executeFunctionOnGap(gapIndex, "lockGapByIndex");
    };

    presenter.disableGapCommand = function (params) {
        presenter.disableGap(parseInt(params[0], 10));
    };

    presenter.disableAllGaps = function () {
        presenter.gapsContainer.lockAllGaps();
    };

    presenter.getView = function() {
        return presenter.$view;
    };

    presenter.isAllOK = function() {
        var score = presenter.getScore();
        return score == presenter.getMaxScore() && score != 0;
    };

    presenter.executeCommand = function (name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'getGapText': presenter.getGapTextCommand,
            'getGapValue': presenter.getGapTextCommand,
            'markGapAsEmpty': presenter.markGapAsEmptyCommand,
            'markGapAsCorrect': presenter.markGapAsCorrectCommand,
            'markGapAsWrong': presenter.markGapAsWrongCommand,
            'enableGap': presenter.enableGapCommand,
            'enableAllGaps': presenter.enableAllGaps,
            'disableGap': presenter.disableGapCommand,
            'disableAllGaps': presenter.disableAllGaps,
            'getView' : presenter.getView,
            'isAllOK' : presenter.isAllOK
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.sendAllOKEvent = function () {
        var eventData = {
            'source': presenter.configuration.addonID,
            'item': 'all',
            'value': '',
            'score': ''
        };

        presenter.eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.getMaxScore = function () {
        if (presenter.configuration.isNotActivity) {
            return 0;
        }

        if (presenter.gapsContainer == undefined) {
            return 0;
        }

        return presenter.gapsContainer.getMaxScore();
    };

    presenter.getScore = function () {
        if (presenter.configuration.isNotActivity) {
            return 0;
        }

        if (presenter.gapsContainer == undefined) {
            return 0;
        }

        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        return presenter.gapsContainer.getScore();
    };

    presenter.getErrorCount = function () {
        if (presenter.configuration.isNotActivity) {
            return 0;
        }

        if (presenter.gapsContainer == undefined) {
            return 0;
        }

        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        return presenter.gapsContainer.getErrorCount();
    };

    presenter.setShowErrorsMode = function () {
        if (!presenter.isSetShowErrorsMode) {
            presenter.gapsContainer.check();
            presenter.isSetShowErrorsMode = true;
        }

        if (isConnectedWithMath) {
            presenter.gapsContainer.unlockAllGaps();
            presenter.gapsContainer.lockAllNotEmptyGaps();
        }
    };

    presenter.setWorkMode = function () {
        if (presenter.isSetShowErrorsMode) {
            presenter.gapsContainer.check();
            presenter.isSetShowErrorsMode = false;
        }

        presenter.gapsContainer.removeAllGapsClasses();

        if (isConnectedWithMath) {
            presenter.gapsContainer.unlockAllGaps();
        }
    };

    presenter.createEventData = function (item, value, score) {
        return {
            source: presenter.configuration.addonID,
            item: "" + item,
            value: "" + value,
            score: "" + score
        };
    };
    
    presenter.onEventReceived = function (eventName, eventData) {
        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        }

        if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        }

        if (eventName == "ItemSelected") {
            presenter.lastDraggedItem = eventData;
        }
    };
    
    presenter.showAnswers = function () {
        if (presenter.configuration.isActivity) {
            presenter.gapsContainer.showAnswers();
            presenter.isShowAnswersActive = true;
            presenter.isSetShowErrorsMode = false;
            presenter.renderMathJax();
        }
    };

    presenter.hideAnswers = function () {
        if (presenter.configuration.isActivity || isConnectedWithMath) {
            presenter.gapsContainer.hideAnswers();
            if(isConnectedWithMath){
                presenter.gapsContainer.unlockAllGaps();
            }
            presenter.isShowAnswersActive = false;
            presenter.isSetShowErrorsMode = false;
            presenter.renderMathJax();
        }
    };

    presenter.getCSSConfiguration = function () {
        return {
            correct: "ic_gap-correct",
            wrong: "ic_gap-wrong",
            showAnswers: "ic_gap-show-answers",
            block: "ic_gap-empty"
        };
    };

    presenter.GapUtils = function (configuration) {
        if(!presenter.isPreview){
            DraggableDroppableObject.call(this, configuration, presenter.getCSSConfiguration());
        }

        this.gapScore = configuration.gapScore;
        this.gapType = presenter.GapUtils.GAP_TYPE.NORMAL;
        this.isDisabled = false;
        this.isEnabled = true;
        this.mathShowAnswersValue = "";
        this.mathCSSClass = "math-answer";
        this.valueChangeObserver = new presenter.ValueChangeObserver();
    };

    presenter.GapUtils.prototype = Object.create(DraggableDroppableObject.prototype);
    presenter.GapUtils.parent = DraggableDroppableObject.prototype;

    presenter.GapUtils.GAP_TYPE = {
        NORMAL: 0,
        SELECT: 1
    };

    presenter.GapUtils.prototype.getParsedCorrectAnswers = function () {
        return this.showAnswersValue.map(function (value) {
            return this.parseValue(value);
        }, this);
    };

    presenter.GapUtils.prototype.getParsedValue = function () {
        return this.parseValue(this.getValue());
    };

    presenter.GapUtils.prototype.isCorrect = function () {
        var correctAnswers = this.getParsedCorrectAnswers();
        var value = this.getParsedValue();

        return (correctAnswers.indexOf(value) !== -1);
    };

    presenter.GapUtils.prototype.parseValue = function (value) {
        if(presenter.configuration.gapType == 'math') {
            return value;
        }

        if (!presenter.configuration.isCaseSensitive) {
            value = value.toLowerCase();
        }

        if (presenter.configuration.isPunctuationIgnored) {
            value = value.replace(/\W/g, '');
        }

        return value;
    };

    presenter.GapUtils.prototype.isValueEmpty = function () {
        return this.getValue().trim() == "";
    };

    presenter.GapUtils.prototype.setCssOnCorrect = function () {
        if (presenter.configuration.isNotActivity) {
            return true;
        }

        DraggableDroppableObject.prototype.setCssOnCorrect.call(this);
    };

    presenter.GapUtils.prototype.setCssOnUnCorrect = function () {
        this.removeAllClasses();
    };

    presenter.GapUtils.prototype.onBlock = function () {
        if (!this.isDisabled) {
            this.lock();
        }
    };

    presenter.GapUtils.prototype.onUnblock = function () {
        if (this.isDisabled && this.isEnabled) {
            this.unlock();
        }
    };

    presenter.GapUtils.prototype.onCorrect = function () {
        this.onBlock();
    };

    presenter.GapUtils.prototype.onUnCorrect = function () {
        this.onUnblock();
    };

    presenter.GapUtils.prototype.onWrong = function () {
        this.onBlock();
    };

    presenter.GapUtils.prototype.onUnWrong = function () {
        this.onUnblock();
    };

    presenter.GapUtils.prototype.setCssOnWrong = function () {
        if (presenter.configuration.isNotActivity) {
            return true;
        }

        if (this.isValueEmpty()) {
            this.addCssClass('ic_gap-empty');
            return;
        }

        DraggableDroppableObject.prototype.setCssOnWrong.call(this);
    };

    presenter.GapUtils.prototype.setCssOnUnWrong = function () {
        this.removeAllClasses();
    };

    presenter.GapUtils.prototype.setCssOnShowAnswers = function () {
        if (presenter.configuration.isActivity || isConnectedWithMath) {
            DraggableDroppableObject.prototype.setCssOnShowAnswers.call(this);
        }

        if (isConnectedWithMath) {
            this.addCssClass(this.mathCSSClass);
        }
    };

    presenter.GapUtils.prototype.setCssOnHideAnswers = function () {
        if (presenter.configuration.isActivity || isConnectedWithMath) {
            DraggableDroppableObject.prototype.setCssOnHideAnswers.call(this);
    	}

        if (isConnectedWithMath) {
            this.removeCssClass(this.mathCSSClass);
        }
    };

    presenter.GapUtils.prototype.onShowAnswers = function () {
        if (presenter.configuration.isActivity) {
            this.onBlock();
            this.setViewValue(this.showAnswersValue[0]);
        }

        if (isConnectedWithMath) {
            this.onBlock();
            this.setViewValue(this.mathShowAnswersValue);
        }
    };

    presenter.GapUtils.prototype.onHideAnswers = function () {
        if (presenter.configuration.isActivity || isConnectedWithMath) {
            this.setViewValue(this.value);
            this.onUnblock();
        }
    };

    presenter.GapUtils.prototype.setGapWidth = function () {
        if (presenter.configuration.gapWidth.isSet && !presenter.isPreview) {
            this.$view.width(presenter.configuration.gapWidth.value + 'px');
        }
    };

    presenter.GapUtils.prototype.removeAllClasses = function () {
        this.removeCssClass('ic_gap-correct');
        this.removeCssClass('ic_gap-wrong');
        this.removeCssClass('ic_gap-empty');
    };

    presenter.GapUtils.prototype.getScore = function () {
        return this.isCorrect() ? this.gapScore : 0;
    };

    presenter.GapUtils.prototype.getErrorCount = function () {
        if (this.getValue().trim() == "") {
            return 0;
        }

        return this.isCorrect() ? 0 : 1;
    };

    presenter.GapUtils.prototype.notify = function () {
        this.valueChangeObserver.notify(this.getValueChangeEventData());
    };

    presenter.GapUtils.prototype.getValueChangeEventData = function () {
        return {
            objectID: this.getObjectID(),
            isCorrect: this.isCorrect(),
            value: this.getValue()
        };
    };

    presenter.GapUtils.prototype.setIsEnabled = function (isEnabled) {
        if (this.isDisabled && isEnabled) {
            this.unlock();
        }

        if (!this.isDisabled && !isEnabled) {
            this.lock();
        }

        this.isEnabled = isEnabled;
    };

    presenter.GapUtils.prototype.setMathShowAnswersValue = function (value) {
        this.mathShowAnswersValue = value;
    };

    presenter.GapUtils.prototype.getGapState = function () {
        return {
            value: this.getValue(),
            isEnabled: this.isEnabled
        };
    };

    presenter.GapUtils.prototype.getState = function () {
        return {
            value: this.getValue(),
            item: this.getSource(),
            droppedElement: this.getDroppedElement()
        };
    };

    presenter.GapUtils.prototype.setState = function (value, source, isEnabled, droppedElement) {
        DraggableDroppableObject.prototype.setState.call(this, value, source, droppedElement);

        if (isEnabled !== undefined) {
            this.setIsEnabled(isEnabled);
        }
    };

    presenter.GapUtils.prototype.onReset = function () {
        DraggableDroppableObject.prototype.onReset.call(this);

        if (presenter.configuration.isDisabledByDefault) {
            this.setIsEnabled(false);
        } else {
            this.setIsEnabled(true);
        }

        this.removeAllClasses();
        this.removeCssClass("gapFilled");
    };


    presenter.SelectGap = function (htmlID, correctAnswer, gapScore) {
        var configuration = {
            addonID: presenter.configuration.addonID,
            objectID: htmlID,
            eventBus: presenter.eventBus,
            getSelectedItem: presenter.getSelectedItem,

            showAnswersValue: correctAnswer,

            connectEvents: presenter.SelectGap.prototype.connectEvents,
            setViewValue: presenter.SelectGap.prototype.setViewValue,

            gapScore: gapScore
        };

        presenter.GapUtils.call(this, configuration);

        this.gapType = presenter.GapUtils.GAP_TYPE.SELECT;
        this.setGapWidth();
    };

    presenter.SelectGap.prototype = Object.create(presenter.GapUtils.prototype);
    presenter.SelectGap.constructor = presenter.SelectGap;

    presenter.SelectGap.prototype.connectEvents = function () {
        this.$view.off('change').bind('change', this.onEdit.bind(this));
    };

    presenter.SelectGap.prototype.onEdit = function (event) {
        this.notifyEdit();
        this.value = this.$view.find(":selected").text();
        this.notify();
    };

    presenter.SelectGap.prototype.setViewValue = function (value) {
        this.$view.val(value);
    };

    presenter.SelectGap.prototype.lock = function () {
        this.isDisabled = true;
        this.$view.attr('disabled','disabled');
    };

    presenter.SelectGap.prototype.unlock = function () {
        this.isDisabled = false;
        this.$view.removeAttr('disabled');
    };

    presenter.gapsAnswers = [];

    function addGapAnswers(htmlID, correctAnswer) {
        var isInTable = false;
        for (var i = 0; i < presenter.gapsAnswers.length; i++){
            if(presenter.gapsAnswers[i].id == htmlID){
                isInTable = true;
            }
        }

        if(!isInTable){
            presenter.gapsAnswers.push({id: htmlID, answers: correctAnswer});
        }
    }

    presenter.EditableInputGap = function (htmlID, correctAnswer, gapScore) {
        addGapAnswers(htmlID, correctAnswer);
        var configuration = {
            addonID: presenter.configuration.addonID,
            objectID: htmlID,
            eventBus: presenter.eventBus,
            getSelectedItem: presenter.getSelectedItem,

            showAnswersValue: correctAnswer,

            createView: presenter.EditableInputGap.prototype.createView,
            connectEvents: this.connectEvents,
            setViewValue: presenter.EditableInputGap.prototype.setViewValue,

            gapScore: gapScore
        };

        presenter.GapUtils.call(this, configuration);
        this.setGapWidth();
    };

    presenter.EditableInputGap.prototype = Object.create(presenter.GapUtils.prototype);
    presenter.EditableInputGap.constructor = presenter.EditableInputGap;

    presenter.EditableInputGap.prototype.connectEvents = function () {
        this.$view.on("input", this.onEdit.bind(this));
        this.$view.on("blur", this.blurHandler.bind(this));
        this.$view.off('change').bind('change', this.onEdit.bind(this));
    };

    presenter.EditableInputGap.prototype.createView = function () {
        if(presenter.configuration.gapType == 'math'){
            return $(presenter.$view).find("input[id='"+this.objectID+"']");
        }else{
            var $inputGap = $('<input type="text" value="" id="' + this.objectID + '" />');
            $inputGap.css({
                width: presenter.configuration.gapWidth + "px"
            });

            $inputGap.addClass("ic_gap");

            return $inputGap;
        }
    };

    presenter.EditableInputGap.prototype.onEdit = function (event) {
        this.notifyEdit();
        this.value = this.getViewValue();
    };

    presenter.EditableInputGap.prototype.blurHandler = function (event) {
        this.notify();
    };

    presenter.EditableInputGap.prototype.getViewValue = function () {
        return this.$view.val();
    };

    presenter.EditableInputGap.prototype.lock = function () {
        this.isDisabled = true;
        this.$view.attr('disabled','disabled');
    };

    presenter.EditableInputGap.prototype.unlock = function () {
        this.isDisabled = false;
        this.$view.removeAttr('disabled');
    };

    presenter.EditableInputGap.prototype.getValue = function () {
        return this.value;
    };

    presenter.EditableInputGap.prototype.setViewValue = function (value) {
        return this.$view.val(value);
    };

    presenter.DraggableDroppableGap = function (htmlID, correctAnswers, gapScore) {
        var configuration = {
            addonID: presenter.configuration.addonID,
            objectID: htmlID,
            eventBus: presenter.eventBus,
            getSelectedItem: presenter.getSelectedItem,
            createView: presenter.DraggableDroppableGap.prototype.createView,

            showAnswersValue: correctAnswers,
            fillGap: presenter.DraggableDroppableGap.prototype.fillGap,
            makeGapEmpty: presenter.DraggableDroppableGap.prototype.makeGapEmpty,

            gapScore: gapScore
        };

        presenter.GapUtils.call(this, configuration);
        this.setGapWidth();
    };

    presenter.DraggableDroppableGap.prototype = Object.create(presenter.GapUtils.prototype);
    presenter.DraggableDroppableGap.parent = presenter.GapUtils.prototype;
    presenter.DraggableDroppableGap.constructor = presenter.DraggableDroppableGap;

    presenter.DraggableDroppableGap.prototype.createView = function () {
        var $view = DraggableDroppableObject.prototype.createView.call(this);

        $view.css({
            width: presenter.configuration.gapWidth + "px",
            display: 'inline-block'
        });

        $view.addClass("draggable-gap");
        $view.addClass("ic_gap");

        return $view;
    };

    presenter.DraggableDroppableGap.prototype.lock = function () {
        this.isDisabled = true;
        DraggableDroppableObject.prototype.lock.call(this);
    };

    presenter.DraggableDroppableGap.prototype.unlock = function () {
        this.isDisabled = false;
        DraggableDroppableObject.prototype.unlock.call(this);
    };

    presenter.DraggableDroppableGap.prototype.fillGap = function (selectedItem) {
        DraggableDroppableObject.prototype.fillGap.call(this, selectedItem);
        this.addCssClass("gapFilled");
        this.notify();

        presenter.renderMathJax();
    };

    presenter.DraggableDroppableGap.prototype.makeGapEmpty = function () {
        DraggableDroppableObject.prototype.makeGapEmpty.call(this);
        this.removeCssClass("gapFilled");
        this.notify();
    };

    presenter.GapsContainerObject = function () {
        this.gaps = [];
    };

    presenter.GapsContainerObject.prototype.addGap = function (gap) {
        this.gaps.push(gap);
    };

    presenter.GapsContainerObject.prototype.replaceDOMViewWithGap = function () {
        this.gaps.filter(function (gap) {
            return gap.gapType == presenter.GapUtils.GAP_TYPE.NORMAL;
        }).forEach(function (gap) {
            var gapID = "#" + gap.getObjectID(),
                element = presenter.$view.find(gapID),
                placeholder = element.attr("placeholder");

            element.replaceWith(gap.getView());
            element = presenter.$view.find(gapID);
            if(placeholder) {
                element.attr("placeholder", placeholder);
                element.removeClass("ic_gap").addClass("ic_filled_gap");
            }
        });
    };

    presenter.GapsContainerObject.prototype.replaceGapsDOMWithView = function () {
        this.gaps.forEach(function (gap) {
            gap.$view = presenter.$view.find("#" + gap.getObjectID());
            if(!presenter.isPreview){
                gap.connectEvents();
            }
        });
    };

    presenter.GapsContainerObject.prototype.removeAllGapsClasses = function () {
        this.gaps.forEach(function (gap) {
            gap.removeAllClasses();
        });
    };

    presenter.GapsContainerObject.prototype.check = function (isSetShow) {
        this.gaps.forEach(function (gap) {
            gap.check(isSetShow);
        });
    };

    presenter.GapsContainerObject.prototype.showAnswers = function () {
        this.gaps.forEach(function (gap) {
            gap.showAnswers();
        });
    };

    presenter.GapsContainerObject.prototype.showAnswersMath = function () {
        this.gaps.forEach(function (gap) {
            if(gap.mathShowAnswersValue != ""){
                gap.showAnswers();
            }else{
                gap.lock();
            }
        });
    };

    presenter.GapsContainerObject.prototype.hideAnswers = function () {
        this.gaps.forEach(function (gap) {
            gap.hideAnswers();
            gap.removeAllClasses();
        });
    };

    presenter.GapsContainerObject.prototype.reset = function () {
        this.gaps.forEach(function (gap) {
            gap.reset();
        });
    };

    presenter.GapsContainerObject.prototype.getErrorCount = function () {
        return this.gaps.reduce(function (errorCount, gap) {
            return errorCount += gap.getErrorCount();
        }, 0);
    };

    presenter.GapsContainerObject.prototype.getScore = function () {
        return this.gaps.reduce(function (score, gap) {
            return score += gap.getScore();
        }, 0);
    };

    presenter.GapsContainerObject.prototype.getMaxScore = function () {
        return this.gaps.reduce(function (maxScore, gap) {
            return maxScore += gap.gapScore;
        }, 0);
    };

    presenter.GapsContainerObject.prototype.markGapByIndexWithClass = function (index, cssClass) {
        this.gaps[index].removeAllClasses();
        this.gaps[index].addCssClass(cssClass);
        this.gaps[index].notifyEdit();
    };

    presenter.GapsContainerObject.prototype.markGapByIndexAsCorrect = function (index) {
        this.markGapByIndexWithClass(index, this.gaps[index].correctCSS);
    };

    presenter.GapsContainerObject.prototype.markGapByIndexAsWrong = function (index) {
        this.markGapByIndexWithClass(index, this.gaps[index].wrongCSS);
    };

    presenter.GapsContainerObject.prototype.markGapByIndexAsEmpty = function (index) {
        this.markGapByIndexWithClass(index, 'ic_gap-empty');
    };
    
    presenter.GapsContainerObject.prototype.getLength = function () {
        return this.gaps.length;
    };

    presenter.GapsContainerObject.prototype.getGapValueByIndex = function (index) {
        return this.gaps[index].getValue();
    };

    presenter.GapsContainerObject.prototype.setLockGapByIndex = function (index, lock) {
        this.gaps[index].setIsEnabled(lock);
        this.gaps[index].notifyEdit();
    };

    presenter.GapsContainerObject.prototype.lockGapByIndex = function (index) {
        this.setLockGapByIndex(index, false);
    };

    presenter.GapsContainerObject.prototype.unlockGapByIndex = function (index) {
        this.setLockGapByIndex(index, true);
    };

    presenter.GapsContainerObject.prototype.unlockAllGaps = function () {
        this.gaps.map(function (gap, index) {
            this.unlockGapByIndex(index);
        }, this);
    };

    presenter.GapsContainerObject.prototype.lockAllGaps = function () {
        this.gaps.map(function (gap, index) {
            this.lockGapByIndex(index);
        }, this);
    };

    presenter.GapsContainerObject.prototype.lockAllNotEmptyGaps = function () {
        this.gaps.map(function (gap, index) {
            if(!gap.isValueEmpty()){
                this.lockGapByIndex(index);
            }
        }, this);
    };

    presenter.GapsContainerObject.prototype.getGapIndexByObjectID = function (objectID) {
        for (var index = 0; index < this.gaps.length; index++) {
            if (this.gaps[index].getObjectID() === objectID) {
                return (index + 1);
            }
        }
    };

    presenter.GapsContainerObject.prototype.getGapsState = function () {
        return this.gaps.map(function (gap) {
            return gap.getGapState();
        });
    };

    presenter.GapsContainerObject.prototype.getState = function () {
        return this.gaps.map(function (gap) {
            return gap.getState();
        });
    };

    presenter.GapsContainerObject.prototype.setGapsState = function (state) {
        state.map(function (stateData, index) {
            this.gaps[index].setState(stateData.value, "", stateData.isEnabled);
        }, this);
    };

    presenter.GapsContainerObject.prototype.setSpansState = function (state, undefinedAttr) {
        if ((state !== undefinedAttr) && (state !== null)) {
            state.map(function (stateData, index) {
                this.gaps[index].setState(stateData.value, stateData.item, undefined, stateData.droppedElement);

                if (stateData.value == "") {
                    this.gaps[index].destroyDraggableProperty();
                }else{
                    this.gaps[index].addCssClass("gapFilled");
                }

            }, this);
        }
    };

    presenter.GapsContainerObject.prototype.setMathShowAnswersValueByGapIndex = function (index, value) {
        this.gaps[index].setMathShowAnswersValue(value);
    };

    presenter.ValueChangeObserver = function () {};

    presenter.ValueChangeObserver.prototype.notify = function (data) {
        presenter.eventBus.sendEvent('ValueChanged', this.getEventData(data));

        if (presenter.isAllOK()) presenter.sendAllOKEvent();
    };

    presenter.ValueChangeObserver.prototype.getEventData = function (data) {
        return {
            score: data.isCorrect ? "1" : "0",
            value: data.value,
            source: presenter.configuration.addonID,
            item: presenter.gapsContainer.getGapIndexByObjectID(data.objectID)
        };
    };

    presenter.isActivity = function () {
        return presenter.configuration.isActivity;
    };

    presenter.setMathShowAnswersCounter = function (counter) {
        presenter.configuration.mathShowAnswersCounter = counter;
    };

    presenter.tickMathCounter = function () {
        if (presenter.configuration.mathShowAnswersCounter) {
            presenter.configuration.mathShowAnswersCounter = presenter.configuration.mathShowAnswersCounter - 1;
        }
    };

    presenter.shouldTriggerMathShowAnswers = function () {
        return presenter.configuration.mathShowAnswersCounter == 0;
    };

    //showAnswers from Math
    presenter.setGapAnswer = function (gapIndex, answer, counter) {
        if (presenter.configuration.mathShowAnswersCounter === undefined) {
            presenter.setMathShowAnswersCounter(counter);
        }

        presenter.gapsContainer.setMathShowAnswersValueByGapIndex((gapIndex - 1), answer);

        presenter.tickMathCounter();

        if (presenter.shouldTriggerMathShowAnswers()) {
            presenter.gapsContainer.removeAllGapsClasses();
            presenter.gapsContainer.showAnswersMath();
            presenter.setMathShowAnswersCounter(counter);
        }
    };

    //hideAnswers from Math
    //hideAnswers is called anyway so just void function
    presenter.setUserValue = function () {};

    presenter.markConnectionWithMath = function() {
        isConnectedWithMath = true;
        presenter.isConnectedWithMath = true;
    };

    presenter.getValue = function (index) {
        return presenter.gapsContainer.getGapValueByIndex((index-1))
    };

    presenter.renderMathJax = function () {
        MathJax.CallBack.Queue().Push(function () {
            MathJax.Hub.Typeset(presenter.$view.find(".table-addon-wrapper")[0]);
        });
    };

    return presenter;
}