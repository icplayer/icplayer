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
    presenter.keyboardControllerObject = null;
    presenter.isWCAGOn = false;
    presenter.gapNavigation = false;
    presenter.addonKeyboardNavigationActive = false;
    presenter.gapIndex = 0;
    presenter.isGradualShowAnswersActive = false;
    presenter.printableState = null;
    presenter.printableStateMode = null;
    presenter.printableParserID = null;
    presenter.printableParserCallback = null;

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
        var patt = new RegExp("id=\"" + gap.id + "\"");
        var rep = "id=\"" + gapID + "\"";
        return  parsedText.replace(patt, rep);
    };

    function getParsedHTMLView () {
        return presenter.textParser.parseGaps(presenter.$view.html(),
            {
                isCaseSensitive: presenter.configuration.isCaseSensitive,
                isKeepOriginalOrder: presenter.configuration.keepOriginalOrder
            }
        );
    }

    presenter.parseGaps = function (isPreview) {
        if (presenter.configuration.gapType === "draggable") {
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

        presenter.$view.html(parsedText);

        if(!isPreview){
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

        if (presenter.hasMathGaps()){
            presenter.gapsContainer.gaps = [];
            $(presenter.$view).find('input').each(function () {
                $(this).replaceWith(
                    generateMathGap(
                        window.xssUtils.sanitize($(this).attr('id')),
                        presenter.configuration.gapWidth.value
                    )
                );
            });
        }

        presenter.gapsContainer.replaceDOMViewWithGap();
        presenter.gapsContainer.updateGapMaxLength();
        presenter.setGapsClassAndWidth();
        presenter.gapsContainer.addMaxLengthParamToGaps();
    };

    /**
     * String generated by this function can be replaced by MathJax to input.
     * See media/js/forminput.js
     * @param id
     * @param width
     */
    function generateMathGap(id, width) {
        return `\\gap{${id}|1|${width}|{{value:${id}}}}`;
    }

    function deleteCommands () {
        delete presenter.getScore;
        delete presenter.getMaxScore;
        delete presenter.getState;
        delete presenter.setState;
        delete presenter.getGapTextCommand;
        delete presenter.getGapTextCommand;
        delete presenter.setGapTextCommand;
        delete presenter.markGapAsEmptyCommand;
        delete presenter.markGapAsCorrectCommand;
        delete presenter.markGapAsWrongCommand;
        delete presenter.enableGapCommand;
        delete presenter.enableAllGaps;
        delete presenter.disableGapCommand;
        delete presenter.disableAllGaps;
        delete presenter.isAttempted;
    }

    function replaceInputsInPreview () {
        if (presenter.configuration.gapType === "draggable") {
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

        if (presenter.hasMathGaps()){
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

        presenter.mainLogic(isPreview);

        if (presenter.hasMathGaps()){
            presenter.mathJaxProcessEnded.then(function() {
                MathJax.CallBack.Queue().Push(function () {
                    if(!isPreview){
                        presenter.renderMathJax();
                        presenter.keyboardControllerObject.setElements(presenter.getElementsForKeyboardNavigation());
                        var checkSelector = setInterval(function () {
                            if ($(presenter.$view).find('input').length > 0) {
                                presenter.gapsContainer.gaps = [];
                                $(presenter.$view).find('input').each(function (_, index) {
                                    for(var i = 0; i < presenter.gapsAnswers.length; i++){
                                        if(presenter.gapsAnswers[i].id === $(this).attr('id')){
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
        presenter.setVisibility(presenter.configuration.isVisible || isPreview);

        presenter.initializeGaps(isPreview);

        if (!isPreview) {
            presenter.parseDefinitionLinks();
        } else {
            replaceInputsInPreview();
            presenter.setGapsClassAndWidth();
            presenter.$view.find('input').attr("size", "auto");
            if (presenter.configuration.gapType === "draggable") {
                presenter.$view.find('input').addClass("draggable-gap");
            }
        }

        presenter.gapsContainer.replaceGapsDOMWithView();
        presenter.lastDraggedItem = {};

        if (presenter.configuration.isDisabledByDefault) {
            presenter.disableAllGaps();
        }

        presenter.buildKeyboardController();
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.textParser = new TextParserProxy(controller.getTextParser());

    };

    presenter.setEventBus = function (eventBus) {
        presenter.eventBus = eventBus;

        presenter.eventBus.addEventListener('ShowAnswers', this);
        presenter.eventBus.addEventListener('HideAnswers', this);
        presenter.eventBus.addEventListener('ItemSelected', this);
        presenter.eventBus.addEventListener('ItemConsumed', this);
        presenter.eventBus.addEventListener('GradualShowAnswers', this);
        presenter.eventBus.addEventListener('GradualHideAnswers', this);
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
        presenter.attemptedGaps = [];
    };

    presenter.getState = function () {
        var spans;
        var gaps = presenter.gapsContainer.getGapsState();

        if (presenter.configuration.gapType === "draggable") {
            spans = presenter.gapsContainer.getState();
        } else {
            spans = null;
        }

        return JSON.stringify({
            gaps: gaps,
            isVisible: presenter.configuration.isVisible,
            spans: spans
        });
    };

    presenter.setState = function (rawState) {
        var state = JSON.parse(rawState);

        presenter.setVisibility(state.isVisible);
        presenter.configuration.isVisible = state.isVisible;
        presenter.attemptedGaps = state.attemptedGaps === undefined ? presenter.attemptedGaps : state.attemptedGaps;

        if (presenter.hasMathGaps()) {
            var checkSelector = setInterval(
                function () {
                    if ($(presenter.$view).find('.mathGap').length === presenter.gapsAnswers.length) {
                        try{
                            presenter.gapsContainer.setGapsState(state.gaps);
                            presenter.gapsContainer.setSpansState(state.spans);
                            clearInterval(checkSelector);
                        } catch (e) { }
                    }
                }, 100);
        } else {
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

            var $element;
            if ((row === 0 && presenter.configuration.isFirstRowHeader) ||
                (i === 0 && presenter.configuration.isFirstColumnHeader)) {
                $element = $(document.createElement('th'));
            } else {
                $element = $(document.createElement('td'));
            }

            $element.addClass('table_cell');
            $element.addClass('row_' + (row + 1));
            $element.addClass('col_' + (i + 1));
            $element.html(content[i].content);
            $element.attr({
                colspan: content[i].colSpan,
                rowspan: content[i].rowSpan
            });

            if ( presenter.configuration.isTabindexEnabled) {
                $element.attr('tabindex', '0');
            }

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
        $.each(presenter.$view.find('.table_cell'), function (index, element) {
            const sanitizedLink = window.xssUtils.sanitize(presenter.textParser.parse($(element).html()));
            $(element).html(sanitizedLink);
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

                    if (r === 0 && c === 0) {
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

    function getSpeechTextProperty (rawValue, defaultValue) {
        var value = rawValue.trim();

        if (value === undefined || value === null || value === '') {
            return defaultValue;
        }

        return value;
    }

    presenter.setSpeechTexts = function(speechTexts) {
        presenter.speechTexts = {
            correct:  'correct',
            wrong: 'wrong',
            empty: 'empty',
            gap: 'gap',
            dropdown: 'dropdown',
            inserted: 'inserted',
            removed: 'removed',
            cell: 'cell',
            row: 'row',
            column: 'column',
            rowSpan: 'row span',
            colSpan: 'column span'
        };

        if (!speechTexts) {
            return;
        }

        presenter.speechTexts = {
            correct:    getSpeechTextProperty(speechTexts['Correct']['Correct'], presenter.speechTexts.correct),
            wrong: getSpeechTextProperty(speechTexts['Wrong']['Wrong'], presenter.speechTexts.wrong),
            empty:  getSpeechTextProperty(speechTexts['Empty']['Empty'], presenter.speechTexts.empty),
            gap:     getSpeechTextProperty(speechTexts['Gap']['Gap'], presenter.speechTexts.gap),
            dropdown:   getSpeechTextProperty(speechTexts['Dropdown']['Dropdown'], presenter.speechTexts.dropdown),
            inserted:      getSpeechTextProperty(speechTexts['Inserted']['Inserted'], presenter.speechTexts.inserted),
            removed:        getSpeechTextProperty(speechTexts['Removed']['Removed'], presenter.speechTexts.removed),
            cell:        getSpeechTextProperty(speechTexts['Cell']['Cell'], presenter.speechTexts.cell),
            row:        getSpeechTextProperty(speechTexts['Row']['Row'], presenter.speechTexts.row),
            column:        getSpeechTextProperty(speechTexts['Column']['Column'], presenter.speechTexts.column),
            rowSpan:        getSpeechTextProperty(speechTexts['RowSpan']['RowSpan'], presenter.speechTexts.rowSpan),
            colSpan:        getSpeechTextProperty(speechTexts['ColSpan']['ColSpan'], presenter.speechTexts.colSpan)
        };
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

        presenter.setSpeechTexts(model['speechTexts']);

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

        var isFirstRowHeader = ModelValidationUtils.validateBoolean(model["isFirstRowHeader"]);
        var isFirstColumnHeader = ModelValidationUtils.validateBoolean(model["isFirstColumnHeader"]);

        var isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);

        var isTabindexEnabled = ModelValidationUtils.validateBoolean(model['Is Tabindex Enabled']);

        const gapMaxLength = ModelValidationUtils.validatePositiveInteger(model["GapMaxLength"]);

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
            gapType: model["Gap Type"],
            gapMaxLength: gapMaxLength,
            isTabindexEnabled: isTabindexEnabled,
            columnsCount: validatedColumns.value,
            rowsCount: validatedRows.value,
            langTag: model["langAttribute"],
            useNumericKeyboard: ModelValidationUtils.validateBoolean(model["useNumericKeyboard"]),
            keepOriginalOrder: ModelValidationUtils.validateBoolean(model["keepOriginalOrder"]),
            isFirstRowHeader: isFirstRowHeader,
            isFirstColumnHeader: isFirstColumnHeader
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

    presenter.addLangTag = function AddonTable_addLangTag(model) {
         var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!model['langAttribute']) {
            upgradedModel['langAttribute'] =  '';
        }

        return upgradedModel;
    };

    presenter.addSpeechTexts = function(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!model['speechTexts']) {
            upgradedModel['speechTexts'] = {
                Gap: {Gap: "Gap"},
                Dropdown: {Dropdown: "Dropdown"},
                Correct: {Correct: "Correct"},
                Wrong: {Wrong: "Wrong"},
                Empty: {Empty: "Empty"},
                Inserted: {Inserted: "Inserted"},
                Removed: {Removed: "Removed"},
                Cell: {Cell: "Cell"}
            }
        }
        return upgradedModel;
    };

    presenter.addUseNumericKeyboard = function (model) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if(model.useNumericKeyboard === undefined) {
            upgradedModel["useNumericKeyboard"] = "False";
        }

        return upgradedModel;
    };

    presenter.addKeepOriginalOrder = function(model) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if(model.keepOriginalOrder === undefined) {
            upgradedModel["keepOriginalOrder"] = "False";
        }

        return upgradedModel;
    };

    presenter.addHeaders = function(model) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model);

        if (model.isFirstRowHeader === undefined) {
            upgradedModel["isFirstRowHeader"] = "False";
        }

        if (model.isFirstColumnHeader === undefined) {
            upgradedModel["isFirstColumnHeader"] = "False";
        }

        if (model['speechTexts']["Row"] === undefined) {
            upgradedModel['speechTexts']["Row"] = {Row: "Row"};
        }

        if (model['speechTexts']["Column"] === undefined) {
            upgradedModel['speechTexts']["Column"] = {Column: "Column"};
        }

        return upgradedModel;
    };

    presenter.addSpanSpeechTexts = function(model) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model);

        if (model['speechTexts']["RowSpan"] === undefined) {
            upgradedModel['speechTexts']["RowSpan"] = {RowSpan: "Row span"};
        }

        if (model['speechTexts']["ColSpan"] === undefined) {
            upgradedModel['speechTexts']["ColSpan"] = {ColSpan: "Column span"};
        }

        return upgradedModel;
    };

    presenter.addGapMaxLength = function (model) {
        const upgradedModel = {};
        jQuery.extend(true, upgradedModel, model);

        if (!upgradedModel.hasOwnProperty('GapMaxLength')) {
            upgradedModel['GapMaxLength'] = '0';
        }

        return upgradedModel;
    }

    presenter.upgradeModel = function (model) {
        var upgradedModel = presenter.addColumnsWidth(model);
        upgradedModel = presenter.addRowHeights(upgradedModel);
        upgradedModel = presenter.addLangTag(upgradedModel);
        upgradedModel = presenter.addSpeechTexts(upgradedModel);
        upgradedModel = presenter.addUseNumericKeyboard(upgradedModel);
        upgradedModel = presenter.addKeepOriginalOrder(upgradedModel);
        upgradedModel = presenter.addHeaders(upgradedModel);
        upgradedModel = presenter.addSpanSpeechTexts(upgradedModel);
        upgradedModel = presenter.addGapMaxLength(upgradedModel);
        return upgradedModel;
    };

    presenter.setVisibility = function (isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.show = function () {
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
        presenter.enableAllGaps();
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
        presenter.disableAllGaps();
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

    presenter.setGapText = function (gapIndex, text) {
        if (["draggable", "math"].includes(presenter.configuration.gapType)) {
            return;
        }

        const validatedGapIndex = presenter.validateGapIndex(gapIndex);
        if (validatedGapIndex.isValid) {
            presenter.gapsContainer.setGapTextByIndex(validatedGapIndex.index, text);
        }
    };

    presenter.setGapTextCommand = function (params) {
        presenter.setGapText(parseInt(params[0], 10), params[1]);
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
        executeFunctionOnGap(gapIndex, "enableGapByIndex");
    };

    presenter.enableGapCommand = function (params) {
        presenter.enableGap(parseInt(params[0], 10));
    };

    presenter.enableAllGaps = function () {
        presenter.gapsContainer.enableAllGaps();
    };

    presenter.disableGap = function (gapIndex) {
        executeFunctionOnGap(gapIndex, "disableGapByIndex");
    };

    presenter.disableGapCommand = function (params) {
        presenter.disableGap(parseInt(params[0], 10));
    };

    presenter.disableAllGaps = function () {
        presenter.gapsContainer.disableAllGaps();
    };

    presenter.getView = function() {
        return presenter.$view;
    };

    presenter.isAllOK = function() {
        var score = presenter.getScore();
        return score === presenter.getMaxScore() && score !== 0;
    };

    presenter.executeCommand = function (name, params) {
        var commands = {
            'disableAllGaps': presenter.disableAllGaps,
            'disableGap': presenter.disableGapCommand,
            'enableAllGaps': presenter.enableAllGaps,
            'enableGap': presenter.enableGapCommand,
            'getGapText': presenter.getGapTextCommand,
            'getGapValue': presenter.getGapTextCommand,
            'setGapText': presenter.setGapTextCommand,
            'getView': presenter.getView,
            'hide': presenter.hide,
            'isAllOK': presenter.isAllOK,
            'isAttempted': presenter.isAttempted,
            'markGapAsCorrect': presenter.markGapAsCorrectCommand,
            'markGapAsEmpty': presenter.markGapAsEmptyCommand,
            'markGapAsWrong': presenter.markGapAsWrongCommand,
            'show': presenter.show
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

        if (presenter.gapsContainer === undefined) {
            return 0;
        }

        return presenter.gapsContainer.getMaxScore();
    };

    presenter.getScore = function () {
        if (presenter.configuration.isNotActivity) {
            return 0;
        }

        if (presenter.gapsContainer === undefined) {
            return 0;
        }

        return presenter.gapsContainer.getScore();
    };

    presenter.getErrorCount = function () {
        if (presenter.configuration.isNotActivity) {
            return 0;
        }

        if (presenter.gapsContainer === undefined) {
            return 0;
        }

        return presenter.gapsContainer.getErrorCount();
    };

    presenter.setShowErrorsMode = function () {
        if (!presenter.isSetShowErrorsMode) {
            presenter.gapsContainer.check();
            presenter.isSetShowErrorsMode = true;
        }

        if (isConnectedWithMath) {
            if (presenter.isShowAnswersActive) {
                presenter.gapsContainer.gaps.forEach(function(gap) {
                    gap.onHideAnswers();
                })
            }
            presenter.gapsContainer.lockAllGaps();
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
        switch (eventName) {
            case "ShowAnswers":
                presenter.showAnswers();
                break;
            case "HideAnswers":
                presenter.hideAnswers();
                break;
            case "GradualShowAnswers":
                if (!presenter.isGradualShowAnswersActive) {
                    presenter.isGradualShowAnswersActive = true;
                }
                if (eventData.moduleID === presenter.configuration.addonID) {
                    presenter.gradualShowAnswers(parseInt(eventData.item, 10));
                }
                break;
            case "GradualHideAnswers":
                presenter.gradualHideAnswers();
                break;
            case "ItemSelected":
                if(presenter.configuration.isVisible) {
                    presenter.lastDraggedItem = eventData;
                }
                break;
            case "ItemConsumed":
                const isEqualToDraggedValue = presenter.lastDraggedItem.value && eventData.value === presenter.lastDraggedItem.value
                const isEqualToDraggedItem = presenter.lastDraggedItem.item && eventData.item === presenter.lastDraggedItem.item

                if (isEqualToDraggedValue  && isEqualToDraggedItem && presenter.configuration.isVisible) {
                    presenter.lastDraggedItem = {};
                }
                break;
            default:
                break;
            
        }
    };

    presenter.showAnswers = function () {
        if (presenter.configuration.isActivity) {
            presenter.gapsContainer.showAnswers();
            presenter.isShowAnswersActive = true;
            presenter.isSetShowErrorsMode = false;
            presenter.renderMathJax();
        } else {
            if (presenter.isSetShowErrorsMode) {
                presenter.setWorkMode();

                if (isConnectedWithMath) {
                    presenter.gapsContainer.lockAllGaps();
                }
            }
            if (isConnectedWithMath) {
                presenter.isShowAnswersActive = true;
                presenter.isSetShowErrorsMode = false;
            }
        }
    };

    presenter.hideAnswers = function () {
        if (!presenter.isShowAnswersActive) {
            return;
        }

        if (presenter.configuration.isActivity || isConnectedWithMath) {
            presenter.gapsContainer.hideAnswers();
            if (isConnectedWithMath){
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
            block: "ic_gap-empty",
            droppableHover: "table-addon-gap-highlight"
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
        this.isAttempted = false;
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
        if(presenter.hasMathGaps()) {
            return value;
        }
        if (presenter.textParser) {
            value = presenter.textParser.parseAnswer(value);
        }

        if (!presenter.configuration.isCaseSensitive) {
            value = value.toLowerCase();
        }

        if (presenter.configuration.isPunctuationIgnored) {
            value = value.replace(/\W/g, '');
        }

        return value.trim();
    };

    presenter.GapUtils.prototype.isValueEmpty = function () {
        var value = this.getValue().trim();
        return value.length === 0 || (this.gapType===1 && 0 === value.localeCompare("---")); //gapType===1 is the dropdown gap
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
        if (this.getValue().trim() === "") {
            return 0;
        }

        return this.isCorrect() ? 0 : 1;
    };

    presenter.GapUtils.prototype.notify = function () {
        if (this.isValueEmpty()) {
            this.isAttempted = false;
        } else {
            this.isAttempted = true;
        }

        this.valueChangeObserver.notify(this.getValueChangeEventData());
    };

    /**
     *
     * @returns {{objectID: (string|*), isCorrect: boolean, value: string}}
     */
    presenter.GapUtils.prototype.getValueChangeEventData = function () {
        return {
            objectID: this.getObjectID(),
            isCorrect: this.isCorrect(),
            value: this.getValue()
        };
    };

    presenter.GapUtils.prototype.setIsEnabled = function (value) {
        if (this.isDisabled && value) {
            this.unlock();
        }

        if (!this.isDisabled && !value) {
            this.lock();
        }

        this.isEnabled = value;
    };

    presenter.GapUtils.prototype.setIsLocked = function (value) {
        if (this.isEnabled && this.isDisabled && !value) {
            this.unlock();
        }

        if (!this.isDisabled && value) {
            this.lock();
        }
    };

    presenter.GapUtils.prototype.setMathShowAnswersValue = function (value) {
        this.mathShowAnswersValue = value;
    };

    presenter.GapUtils.prototype.getGapState = function () {
        return {
            isAttempted: this.isAttempted,
            isEnabled: this.isEnabled,
            value: this.getValue()
        };
    };

    presenter.GapUtils.prototype.getState = function () {
        return {
            droppedElement: this.getDroppedElement(),
            isAttempted: this.isAttempted,
            item: this.getSource(),
            value: this.getValue()
        };
    };

    presenter.GapUtils.prototype.setState = function (configuration) {
        var value = configuration.value;
        var source = configuration.source;
        var isEnabled = configuration.isEnabled;
        var droppedElement = configuration.droppedElement;
        this.isAttempted = configuration.isAttempted === undefined ? false : configuration.isAttempted;

        if (presenter.configuration.gapType === "draggable") {
            DraggableDroppableObject.prototype.setState.call(this, value, source, droppedElement);
        } else {
            this.value = value;
            this.source = source;
            this.setViewValue(value);
        }

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
        this.isAttempted = false;
    };

    presenter.GapUtils.prototype.setAttempted = function (value) {
        this.isAttempted = value;
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

            gapScore: gapScore,
            maxLength: presenter.getMaxLength(correctAnswer)
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
        var escaped = presenter.textParser.escapeXMLEntities(value);
        this.$view.val(escaped);
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
            if(presenter.gapsAnswers[i].id === htmlID){
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

            gapScore: gapScore,
            maxLength: presenter.getMaxLength(correctAnswer)
        };

        presenter.GapUtils.call(this, configuration);
        this.setGapWidth();
    };

    presenter.EditableInputGap.prototype = Object.create(presenter.GapUtils.prototype);
    presenter.EditableInputGap.constructor = presenter.EditableInputGap;

    presenter.EditableInputGap.prototype.connectEvents = function () {
        this.$view.on("input", this.onEdit.bind(this));
        this.$view.on("blur", this.blurHandler.bind(this));
        this.$view.on('keyup', this.onKeyUp.bind(this));
        this.$view.on("keypress", this.onKeyPress.bind(this));
        this.$view.off('change').bind('change', this.onEdit.bind(this));
    };

    presenter.EditableInputGap.prototype.createView = function () {
        var $gapView;
        if (presenter.hasMathGaps()) {
            $gapView = $(presenter.$view).find("input[id='"+this.objectID+"']");
        } else {
            var inputType = "text";
            if (presenter.configuration.useNumericKeyboard) {
                inputType = "tel";
            }
            $gapView = $('<input type="' + inputType + '" value="" id="' + this.objectID + '" />');
            $gapView.css({
                width: presenter.configuration.gapWidth + "px"
            });

            $gapView.addClass("ic_gap");
            if (presenter.configuration.useNumericKeyboard) {
                $gapView.attr("step", "any");
            }
        }
        $gapView.attr("autocomplete", "off");
        return $gapView;
    };

    presenter.EditableInputGap.prototype.onKeyUp = function(event) {
        event.stopPropagation();
        if (presenter.configuration.useNumericKeyboard) {
            var newText = String(event.target.value);
            var pattern = StringUtils.getNumericPattern();
            if (newText.length > 0 && !newText.match(pattern)) {
                var patternWithoutLastCharacter = pattern.slice(0, -1);
                var regExp = RegExp(patternWithoutLastCharacter);
                var match = regExp.exec(newText);

                if (match) {
                    this.setViewValue(match[0]);
                } else {
                    this.setViewValue("");
                }
                this.value = this.getViewValue();
            }
        }
    };

    presenter.EditableInputGap.prototype.onKeyPress = function(event) {
        event.stopPropagation();
        if (presenter.configuration.useNumericKeyboard) {
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

            gapScore: gapScore,
            maxLength: presenter.getMaxLength(correctAnswers)
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
        presenter.rerenderMathJax();
    };

    presenter.DraggableDroppableGap.prototype.makeGapEmpty = function () {
        DraggableDroppableObject.prototype.makeGapEmpty.call(this);
        this.removeCssClass("gapFilled");
        this.notify();
    };

    presenter.getMaxLength = function (correctAnswers) {
        let maxLength = presenter.configuration.gapMaxLength.value;

        correctAnswers.forEach(answers => {
            if (answers.length > maxLength) {
                maxLength = answers.length;
            }
        });

        return maxLength;
    };

    presenter.GapsContainerObject = function () {
        this.gaps = [];
    };

    presenter.GapsContainerObject.prototype.addGap = function (gap) {
        this.gaps.push(gap);
    };

    presenter.GapsContainerObject.prototype.replaceDOMViewWithGap = function () {
        this.gaps.filter(function (gap) {
            return gap.gapType === presenter.GapUtils.GAP_TYPE.NORMAL;
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

    presenter.GapsContainerObject.prototype.updateGapMaxLength = function () {
        this.gaps.filter(function (gap) {
            return gap.gapType === presenter.GapUtils.GAP_TYPE.NORMAL;
        }).forEach(gap => {
            const gapMaxLength = gap.getGapMaxLength();
            const element = presenter.$view.find(`#${gap.getObjectID()}`);
            const placeholder = element.attr('placeholder');
            const placeholderLength = placeholder ? placeholder.length : 0;

            gap.setGapMaxLength(Math.max(gapMaxLength, placeholderLength));
        });
    };

    presenter.GapsContainerObject.prototype.addMaxLengthParamToGaps = function () {
        this.gaps.filter(gap => {
            return gap.gapType === presenter.GapUtils.GAP_TYPE.NORMAL;
        }).forEach(gap => {
            const gapMaxLength = gap.getGapMaxLength();
            const element = presenter.$view.find(`#${gap.getObjectID()}`);
            $(element).attr('maxlength', gapMaxLength);
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

    presenter.GapsContainerObject.prototype.showAnswer = function (item) {
        this.gaps[item].showAnswers();
    }

    presenter.GapsContainerObject.prototype.showAnswersMath = function () {
        this.gaps.forEach(function (gap) {
            if(gap.mathShowAnswersValue !== ""){
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

    presenter.GapsContainerObject.prototype.setGapTextByIndex = function (index, text) {
        this.gaps[index].setValue(text);
        this.gaps[index].setViewValue(text);
        this.gaps[index].notifyEdit();
    };

    presenter.GapsContainerObject.prototype.setLockGapByIndex = function (index, value) {
        this.gaps[index].setIsLocked(value);
    };

    presenter.GapsContainerObject.prototype.lockGapByIndex = function (index) {
        this.setLockGapByIndex(index, true);
    };

    presenter.GapsContainerObject.prototype.unlockGapByIndex = function (index) {
        this.setLockGapByIndex(index, false);
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

    presenter.GapsContainerObject.prototype.setEnableGapByIndex = function (index, isEnabled) {
        this.gaps[index].setIsEnabled(isEnabled);
        this.gaps[index].notifyEdit();
    };

    presenter.GapsContainerObject.prototype.disableGapByIndex = function (index) {
        this.setEnableGapByIndex(index, false);
    };

    presenter.GapsContainerObject.prototype.enableGapByIndex = function (index) {
        this.setEnableGapByIndex(index, true);
    };

    presenter.GapsContainerObject.prototype.enableAllGaps = function () {
        this.gaps.map(function (gap, index) {
            this.enableGapByIndex(index);
        }, this);
    };

    presenter.GapsContainerObject.prototype.disableAllGaps = function () {
        this.gaps.map(function (gap, index) {
            this.disableGapByIndex(index);
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
            var configuration = {
                droppedElement: undefined,
                isAttempted: stateData.isAttempted === undefined ? false : stateData.isAttempted,
                isEnabled: stateData.isEnabled,
                source: "",
                value: stateData.value
            };

            this.gaps[index].setState(configuration);
            this.gaps[index].$view.trigger('change');
        }, this);
    };

    presenter.GapsContainerObject.prototype.setSpansState = function (state, undefinedAttr) {
        if ((state !== undefinedAttr) && (state !== null)) {
            state.map(function (stateData, index) {
                var configuration = {
                    value: stateData.value,
                    source: stateData.item,
                    isEnabled: undefined,
                    droppedElement: stateData.droppedElement
                };

                this.gaps[index].setState(configuration);

                if (stateData.value === "") {
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

    presenter.GapsContainerObject.prototype.isGapAttempted = function (index) {
        return this.gaps[index].isAttempted;
    };

    presenter.GapsContainerObject.prototype.isAnyGapAttempted = function () {
        return this.gaps.some(function (gap) {
            return gap.isAttempted;
        });
    };

    presenter.GapsContainerObject.prototype.setIsAttemptedByGapId = function(objectID, value) {
        for (var index = 0; index < this.gaps.length; index++) {
            if (this.gaps[index].getObjectID() === objectID) {
                this.gaps[index].setAttempted(value);
                break;
            }
        }
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
        return presenter.configuration.mathShowAnswersCounter === 0;
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

        addDisplayStyleToMathJaxElements();
    };

    presenter.rerenderMathJax = function () {
        MathJax.CallBack.Queue().Push(function () {
            MathJax.Hub.Rerender(presenter.$view.find(".table-addon-wrapper")[0]);
        });

        addDisplayStyleToMathJaxElements();
    };

    function addDisplayStyleToMathJaxElements() {
        $('annotation-xml').css({display: 'flex'});
    }

    function TableKeyboardController (elements, columnsCount, rowsCount) {
        var newElements = accountForMergedCells(elements, columnsCount, rowsCount);
        KeyboardController.call(this, newElements, columnsCount);
        this.rowsCount = rowsCount;
    }

    function accountForMergedCells(elements, columnsCount, rowsCount) {
        if (columnsCount === undefined || rowsCount === undefined ||
            elements.length === 0 || elements[0].getAttribute === undefined) return elements;
        var elementsArray = Array.from(Array(rowsCount), () => new Array(columnsCount));
        var i = 0;
        for (var ri = 0; ri < rowsCount; ri++) {
            for (var ci = 0; ci < columnsCount; ci++) {
                if (elementsArray[ri][ci] === undefined && i < elements.length) {
                    var element = elements[i];
                    i++;
                    var colNumber = getColspan(element);
                    var rowNumber = getRowspan(element);
                    for (var rj = 0; rj < rowNumber; rj++) {
                        for (var cj = 0; cj < colNumber; cj++) {
                            var newColIndex = ci + cj;
                            var newRowIndex = ri + rj;
                            if (newRowIndex < rowsCount && newColIndex < columnsCount) {
                                elementsArray[newRowIndex][newColIndex] = element;
                            }
                        }
                    }
                }
            }
        }
        var newElements = [];
        for (var i = 0; i < rowsCount; i++) newElements = newElements.concat(elementsArray[i]);
        return newElements;
    }

    function getColspan(element) {
        return getAttributeNumberValue(element, "colspan", 1);
    }

    function getRowspan(element) {
        return getAttributeNumberValue(element, "rowspan", 1);
    }

    function getAttributeNumberValue(element, attributeName, defaultValue) {
        if (element.getAttribute(attributeName)!= null && !isNaN(element.getAttribute(attributeName))) {
            return new Number(element.getAttribute(attributeName));
        } else {
            return defaultValue;
        }
    }

    TableKeyboardController.prototype.reload = function (elements, columnsCount, rowsCount) {
        var newElements = accountForMergedCells(elements, columnsCount, rowsCount);
        KeyboardController.prototype.reload.call(this, newElements, columnsCount);
    }

    TableKeyboardController.prototype = Object.create(window.KeyboardController.prototype);
    TableKeyboardController.prototype.constructor = TableKeyboardController;

    TableKeyboardController.prototype.select = function (event) {
        event.preventDefault();
        presenter.addWhiteSpaceToValue();
        if (presenter.gapNavigation && presenter.configuration.gapType === 'draggable' && presenter.getCurrentGapsNumber() > 0) {
            var $gap = presenter.getGap(presenter.gapIndex);

            if (!$gap || !$gap.is('span')) return;

            var oldVal = $gap.text();
            $gap.click();
            var value = $gap.text();

            if (0 !== oldVal.localeCompare(value)) {
                var data = [];
                if (value) {
                    data.push(window.TTSUtils.getTextVoiceObject(value, presenter.configuration.langTag));
                    data.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.inserted));
                } else {
                    data.push(window.TTSUtils.getTextVoiceObject(oldVal, presenter.configuration.langTag));
                    data.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.removed));
                }
                presenter.speak(data);
            }
        }
    };

    presenter.addWhiteSpaceToValue = function () {
        if (!presenter.getGap(presenter.gapIndex)) return;

        var gap = presenter.getGap(presenter.gapIndex)[0];
        var classNames = ['ic_filled_gap', 'ic_gap'];
        var isInputTypeGap = classNames.some(className => gap.classList.contains(className));
        if (!gap || !isInputTypeGap) return;

        var oldValue = gap.value;
        $(gap).val(`${oldValue} `);
    }

    TableKeyboardController.prototype.mark =  function (element) {
        KeyboardController.prototype.mark.call(this, element);
        this.getTarget(element, false).focus();
    };

    TableKeyboardController.prototype.unmark = function (element) {
        KeyboardController.prototype.unmark.call(this, element);
        this.getTarget(element, false).blur();
    };

    presenter.buildKeyboardController = function () {
        presenter.keyboardControllerObject = new TableKeyboardController(presenter.getElementsForKeyboardNavigation(), presenter.configuration.columnsCount, presenter.configuration.rowsCount);
    };

    presenter.getElementsForKeyboardNavigation = function () {
        return presenter.$view.find('.table_cell');
    };

    presenter.keyboardController = function(keycode, isShiftKeyDown, event) {
        presenter.keyboardControllerObject.handle(keycode, isShiftKeyDown, event);
    };

    TableKeyboardController.prototype.getTarget = function (element, willBeClicked){
        return $(element);
    };

    TableKeyboardController.prototype.escape = function (event) {
        if (presenter.gapNavigation) {
            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }
            presenter.gapNavigation = false;
            presenter.clearCurrentCell();
            presenter.readCurrentCellTitle();
        } else {
            // must be set to false, otherwise module won't exit navigation
            presenter.addonKeyboardNavigationActive = false;
            KeyboardController.prototype.escape.call(this, event);
        }
    };

    TableKeyboardController.prototype.enter = function (event){
        KeyboardController.prototype.enter.call(this, event);

        if (presenter.addonKeyboardNavigationActive && !presenter.gapNavigation) {
            presenter.gapNavigation = true;
            presenter.selectGap(0);
        }
        if (!presenter.addonKeyboardNavigationActive){
            presenter.addonKeyboardNavigationActive = true;
            presenter.readCurrentCellTitle();
        } else {
            presenter.readCurrentNavigationElement();
        }
    }

    KeyboardController.prototype.switchElement = function (move) {
        var new_position_index = this.keyboardNavigationCurrentElementIndex + move;
        if (new_position_index >= this.keyboardNavigationElementsLen) {
            new_position_index = new_position_index - this.keyboardNavigationElementsLen;
        } else if (new_position_index < 0) {
            new_position_index = this.keyboardNavigationElementsLen + new_position_index;
        }
        if (this.keyboardNavigationCurrentElement === this.keyboardNavigationElements[new_position_index]
            && this.keyboardNavigationCurrentElementIndex != new_position_index) {
                this.keyboardNavigationCurrentElementIndex = new_position_index;
                if (move == this.columnsCount || move == -1 * this.columnsCount) {
                    if (new_position_index + move >=0 && new_position_index + move < this.keyboardNavigationElementsLen) {
                        this.switchElement(move);
                    } else {
                        this.markCurrentElement(new_position_index);
                    }
                } else {
                if (move < 0) {
                    if (new_position_index % this.columnsCount != 0) {
                        this.switchElement(-1);
                    } else {
                        this.markCurrentElement(new_position_index);
                    }
                } else {
                    if (new_position_index % this.columnsCount != this.columnsCount - 1) {
                        this.switchElement(1);
                    } else {
                        this.markCurrentElement(new_position_index);
                    }
                }
            }
        } else {
            this.markCurrentElement(new_position_index);
        }
    };

    presenter.readCurrentNavigationElement = function() {
        var html = $(presenter.keyboardControllerObject.keyboardNavigationCurrentElement);
        var data = window.TTSUtils.getTextVoiceArrayFromElementWithGaps(html, presenter.configuration.langTag, presenter.speechTexts);
        presenter.speak(data);
    };

    presenter.readCurrentCellTitle = function() {
        var row = Math.floor(presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex / presenter.configuration.columnsCount);
        var column = presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex % presenter.configuration.columnsCount;
        var element = presenter.keyboardControllerObject.keyboardNavigationCurrentElement;
        var rowSpan = getRowspan(element);
        var colSpan = getColspan(element);

        if (rowSpan != 1 || colSpan != 1) {
            var classNames = element.className.split(' ');
            for (var i = 0; i < classNames.length; i++) {
                var className = classNames[i];
                if (className.startsWith('col_')) {
                    var numberString = className.replace('col_', '').trim();
                    if (numberString.length > 0 && !isNaN(numberString)) column = new Number(numberString) - 1;
                }
                if (className.startsWith('row_')) {
                    var numberString = className.replace('row_', '').trim();
                    if (numberString.length > 0 && !isNaN(numberString)) row = new Number(numberString) - 1;
                }
            }
        }
        var alphabet = "ABCDEFGHIJKLMNOPRSTUWXYZ";
        var content = presenter.speechTexts.cell + " " + alphabet[column % alphabet.length] + " " + (row+1);
        var data = [window.TTSUtils.getTextVoiceObject(content)];
        if (rowSpan > 1) {
            data.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.rowSpan+" "+rowSpan));
        }
        if (colSpan > 1) {
            data.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.colSpan+" "+colSpan));
        }
        if (presenter.configuration.isFirstRowHeader) {
            data = data.concat(getCellHeaderUtterances('.row_1.col_'+(column+1), presenter.speechTexts.column));
        }
        if (presenter.configuration.isFirstColumnHeader) {
            data = data.concat(getCellHeaderUtterances('.col_1.row_'+(row+1), presenter.speechTexts.row));
        }
        presenter.speak(data);
    };

    function getCellHeaderUtterances(headerSelector, headerTypeSpeechText) {
        var data = [];
        var html = presenter.$view.find(headerSelector);
        if (html.length > 0) {
            var headerContent = window.TTSUtils.getTextVoiceArrayFromElementWithGaps(html, presenter.configuration.langTag, presenter.speechTexts);
            if (headerContent.length > 0) {
                data.push(window.TTSUtils.getTextVoiceObject(headerTypeSpeechText));
                data = data.concat(headerContent);
            }
        }
        return data;
    }

    // TAB or Right Arrow
    TableKeyboardController.prototype.nextElement = function (event) {
        if(event.keyCode === 9) { //TAB
            this.handleTab(event);
            event.preventDefault();
            return;
        }

        if (presenter.gapNavigation){
            presenter.switchSelectedValue(1);
            return;
        }

        event.preventDefault();

        if (this.keyboardNavigationCurrentElementIndex % this.columnsCount === this.columnsCount - 1) {
            presenter.readCurrentCellTitle();
        } else {
            this.switchElement(1);
            presenter.readCurrentCellTitle();
        }
    };

    // SHIFT+TAB or Left Arrow
    TableKeyboardController.prototype.previousElement = function (event) {
        if(event.keyCode === 9) { //TAB
            this.handleTab(event);
            return;
        }

        if (presenter.gapNavigation){
            presenter.switchSelectedValue(-1);
            return;
        }

        event.preventDefault();

        if (this.keyboardNavigationCurrentElementIndex % this.columnsCount === 0) {
            presenter.readCurrentCellTitle();
        } else {
            this.switchElement(-1);
            presenter.readCurrentCellTitle();
        }
    };

    TableKeyboardController.prototype.handleTab = function (event) {
        if (presenter.getCurrentGapsNumber() > 0) {
            if (!presenter.gapNavigation) {
                presenter.gapNavigation = true;
                presenter.selectGap(0);
            } else {
                if ( !event.shiftKey ) {
                    presenter.selectGap(presenter.gapIndex + 1);
                } else {
                    presenter.selectGap(presenter.gapIndex - 1);
                }
            }

            var $gap = presenter.getGap(presenter.gapIndex);
            var $cell = $(presenter.keyboardControllerObject.keyboardNavigationCurrentElement);
            var data = window.TTSUtils.getTextVoiceArrayFromGap($gap, $cell, presenter.configuration.langTag, presenter.speechTexts);
            presenter.speak(data);

        }

    };

    // UP Arrow
    TableKeyboardController.prototype.previousRow = function (event) {
        if (presenter.gapNavigation) {
            presenter.switchSelectedValue(-1);
            return;
        }

        if (event) {
            event.preventDefault();
        }

        if (Math.floor(this.keyboardNavigationCurrentElementIndex / this.columnsCount) === 0) {
            presenter.readCurrentCellTitle();
        } else {
            this.switchElement(-this.columnsCount);
            presenter.readCurrentCellTitle();
        }
    };

    // DOWN Arrow
    TableKeyboardController.prototype.nextRow = function (event) {
        if (presenter.gapNavigation) {
            presenter.switchSelectedValue(1);
            return;
        }

        if (event) {
            event.preventDefault();
        }

        if (Math.floor(this.keyboardNavigationCurrentElementIndex / this.columnsCount) === this.rowsCount - 1) {
            presenter.readCurrentCellTitle();
        } else {
            this.switchElement(this.columnsCount);
            presenter.readCurrentCellTitle();
        }
    };

    function getTableKeyboardController() {
        return TableKeyboardController;
    }

    getTableKeyboardController().prototype.exitWCAGMode = function () {
        presenter.gapNavigation = false;
        presenter.clearCurrentCell();
        presenter.addonKeyboardNavigationActive = false;
        KeyboardController.prototype.exitWCAGMode.call(this);
    };

    presenter.getTextToSpeechOrNull = function AddonTable_getTextToSpeechOrNull(playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    presenter.setWCAGStatus = function AddonTable_setWCAGStatus(isOn) {
        presenter.isWCAGOn = isOn;
    };

    presenter.speak = function AddonTable_speak(data) {
        var tts = presenter.getTextToSpeechOrNull(presenter.playerController);
        if (tts && presenter.isWCAGOn) {
            tts.speak(data);
        }
    };

    presenter.isDeactivationBlocked = function() {
        return presenter.addonKeyboardNavigationActive || presenter.gapNavigation;
    };

    presenter.getCurrentGapsNumber = function() {
        return $(presenter.keyboardControllerObject.keyboardNavigationCurrentElement).find('.ic_gap, ic_inlineChoice, .ic_filled_gap').length;
    };

    presenter.clearCurrentCell = function() {
        var $cell = $(presenter.keyboardControllerObject.keyboardNavigationCurrentElement);
        $cell.find('.keyboard_navigation_active_element').removeClass('keyboard_navigation_active_element');
        if ($cell.find('input:focus').length > 0) {
            $cell.find('input:focus').blur();
        }
    };

    presenter.getGap = function (index) {
        var $gaps = $(presenter.keyboardControllerObject.keyboardNavigationCurrentElement).find('.ic_gap, ic_inlineChoice, .ic_filled_gap');
        if ($gaps.length === 0) return;
        if (index < 0) index = 0;
        if (index >= $gaps.length) index = $gaps.length-1;
        return $gaps.eq(index);
    };

    presenter.selectGap = function(index) {
        var $gaps = $(presenter.keyboardControllerObject.keyboardNavigationCurrentElement).find('.ic_gap, ic_inlineChoice, .ic_filled_gap');
        if ($gaps.length === 0) return;
        if(index < 0) index = 0;
        if(index >= $gaps.length) index = $gaps.length - 1;
        var $gap = $gaps.eq(index);

        presenter.clearCurrentCell();
        $gap.addClass('keyboard_navigation_active_element');

        presenter.gapIndex = index;
        if ($gap.is('input')) {
            $gap.focus();
        }
    };

    presenter.switchSelectedValue = function(move) {
        if(presenter.isShowAnswersActive || presenter.isSetShowErrorsMode) return;
        var $gap = presenter.getGap(presenter.gapIndex);

        if (!$gap || !$gap.is('select')) return;

        var index = $gap.prop("selectedIndex");
        var optionSize = $gap.find('option').size();
        index = index + move;

        if (0 <= index && index < optionSize) {
            $gap.prop("selectedIndex", index);
            $gap.change();
            var value = $gap.val();
            if (value.length === 0 || value === '-' || value === '---') {
                var data = [window.TTSUtils.getTextVoiceObject(presenter.speechTexts.empty)];
            } else {
                var data = [window.TTSUtils.getTextVoiceObject($gap.val(), presenter.configuration.langTag)];
            }
            presenter.speak(data);
        }
    };

    /**
    * @method isAttempted method returning if user has interacted with addon
    * @return boolean
    */
    presenter.isAttempted = function AddonTable_isAttempted () {
        if (presenter.configuration.isNotActivity) {
            return true;
        }

        return presenter.gapsContainer.getLength() === 0 ? true : presenter.gapsContainer.isAnyGapAttempted();
    };


    /**
     * @param gapIndex - index of gap to check
     * @returns boolean
     */
    presenter.isGapAttempted = function AddonTableisGapAttempted (gapIndex) {
        if (gapIndex > 0) {
            gapIndex = gapIndex - 1;
        }

        return presenter.gapsContainer.isGapAttempted(gapIndex);
    };

    presenter.PRINTABLE_STATE_MODE = {
        EMPTY: 0,
        SHOW_ANSWERS: 1,
        SHOW_USER_ANSWERS: 2,
        CHECK_ANSWERS: 3
    };

    function isPrintableShowAnswersStateMode() {
        return presenter.printableStateMode === presenter.PRINTABLE_STATE_MODE.SHOW_ANSWERS;
    }
    function isPrintableShowUserAnswersStateMode() {
        return presenter.printableStateMode === presenter.PRINTABLE_STATE_MODE.SHOW_USER_ANSWERS;
    }
    function isPrintableCheckAnswersStateMode() {
        return presenter.printableStateMode === presenter.PRINTABLE_STATE_MODE.CHECK_ANSWERS;
    }
    function isPrintableStateMode() {
        return isPrintableShowUserAnswersStateMode() || isPrintableCheckAnswersStateMode();
    }

    presenter.setPrintableState = function(state) {
        if (state === null || ModelValidationUtils.isStringEmpty(state))
            return;
        presenter.printableState = JSON.parse(state);
    }

    presenter.setPrintableController = function(controller) {
        presenter.textParser = new TextParserProxy(controller.getTextParser());
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

    presenter.setPrintableAsyncCallback = function(id, callback) {
        presenter.printableParserID = id;
        presenter.printableParserCallback = callback;
    }

    presenter.isPrintableAsync = function() {
        return true;
    }

    presenter.hasMathGaps = function() {
        return presenter.configuration.gapType === 'math';
    }

    presenter.getPrintableHTML = function(model, showAnswers) {
        presenter.configuration = presenter.validateModel(presenter.upgradeModel(model));
        chosePrintableStateMode(showAnswers);
        createPrintableHTMLStructure(model);

        presenter.$view.addClass("printable_module");
        const clone = presenter.$view.clone();
        clone.attr('id', presenter.printableParserID);

        if (presenter.hasMathGaps()) {
            presenter.transformMathGaps();
        } else {
            // normal gaps don't need additional parsing like math gaps, this just notifies callback asynchronusly
            setTimeout(function() {
                const result = parsePrintableGaps(presenter.$view[0].outerHTML);

                presenter.notifyParserCallback(result);
            }, 0);
        }

        return clone[0].outerHTML;

    };

    function createPrintableHTMLStructure(model) {
        createPrintableHTMLWrapper(model);
        var $table = presenter.generateTable(presenter.configuration.contents, false);
        presenter.$wrapper.append($table);
    }

    function createPrintableHTMLWrapper(model) {
        presenter.$view = $('<div></div>');
        presenter.$view.attr("id", model.ID);
        presenter.$view.addClass('printable_addon_Table');
        presenter.$view.css('max-width', model.Width + 'px');
        presenter.$wrapper = $('<div></div>');
        presenter.$wrapper.addClass('table-addon-wrapper');
        presenter.$view.append(presenter.$wrapper);

        presenter.$view.addClass(getViewClassesBasedOnMode());
    }

    function getViewClassesBasedOnMode() {
        switch(presenter.printableStateMode) {
            case presenter.PRINTABLE_STATE_MODE.EMPTY: {
                return "printable_addon_Table-empty-mode";
            }
            case presenter.PRINTABLE_STATE_MODE.SHOW_ANSWERS: {
                return "printable_addon_Table-show-answers";
            }
            case presenter.PRINTABLE_STATE_MODE.SHOW_USER_ANSWERS: {
                return "printable_addon_Table-show-user-answers";
            }
            case presenter.PRINTABLE_STATE_MODE.CHECK_ANSWERS: {
                return "printable_addon_Table-check-answers";
            }
        }

    }

    function matchGap(gapRegex, textToSearch, closingSignGapSize) {
        let closingBracketIndex = 0;

        let gapMatch = textToSearch.match(gapRegex);
        if (gapMatch == null)
            return [];

        const gapsMatches = [];
        while (gapMatch != null) {
            const textWithoutFoundGapBeginning = textToSearch.substring(gapMatch.index + gapMatch[0].length);

            closingBracketIndex = presenter.textParser.findClosingBracket(textWithoutFoundGapBeginning);
            if (closingBracketIndex > 0) {
                const gapEndIndex = gapMatch.index + gapMatch[0].length + closingBracketIndex + closingSignGapSize;
                const wholeGapTextToTheEndingBracket = textToSearch.substring(gapMatch.index, gapEndIndex);
                // ex: \gap{lorem|ispum|\(\frac{1}{4}\)}
                gapsMatches.push(wholeGapTextToTheEndingBracket);
                textToSearch = textToSearch.substring(gapEndIndex);
            } else {
                // gap has no ending bracket, so syntax is broken and in fact it doesn't contain gap, ex:
                // \gap{lorem|ispum|\(\frac{1}{4}\)
                break;
            }

            gapMatch = textToSearch.match(gapRegex);
        }

        return gapsMatches;
    }

    function matchGapAndFilledGap(html) {
        const gapsRegex = /\\gap{|\\filledGap{/;
        return matchGap(gapsRegex, html, "}".length);
    }

    function matchDropdownGap(html) {
        // match last {{ ex. \frac{1}{{{gap_definition}}} will match last two "{{" from "{{{"
        const gapRegex = /{{(?!{)/;
        return matchGap(gapRegex, html, "}}".length);
    }

    function parsePrintableGaps (html) {
        let gapsMatches = matchGapAndFilledGap(html);
        gapsMatches = gapsMatches.concat(matchDropdownGap(html));

        const tablePrintableOptions = indexRegexMatchesBaseOnGapsTypes(gapsMatches);
        for (let i = 0; i < tablePrintableOptions.length; i++) {
            const tablePrintableOption = tablePrintableOptions[i];
            const optionHTML = tablePrintableOption.getPrintableHTML();
            html = html.replace(tablePrintableOption.text, optionHTML);
        }
        return html;
    }

    /**
     To properly parse math gaps, gaps need to be transformed to special syntax \gap{id|width|size|{{value:value}}
     and it needs to be passed into mathjax processor.
     Then gaps will be changed to html inputs which can be transformed into proper printable gap html
     */
    presenter.transformMathGaps = function() {
        let result = parsePrintableMathGaps(presenter.$view[0].outerHTML);
        presenter.$view.html(result.html);

        function mathJaxTypesetEnd() {
            // replace each input with its corresponding gap html
            presenter.$view.find('input').each(function (index, element) {
                let html = result.printableOptions[index].getPrintableHTML();
                $(this).replaceWith(html);
            });

            presenter.notifyParserCallback(presenter.$view[0].outerHTML);
        }

        const args = [];
        args.push("Typeset", MathJax.Hub, presenter.$view[0]);
        args.push(mathJaxTypesetEnd);
        MathJax.Hub.Queue(args);
    }

    presenter.notifyParserCallback = function (outerHTML) {
        presenter.printableStateMode = null;

        presenter.printableParserCallback(
            presenter.textParser.parseAltTexts(outerHTML)
        );
    }

    function parsePrintableMathGaps(html) {
        const gapsMatches = matchGapAndFilledGap(html);
        const tablePrintableOptions = indexRegexMatchesBaseOnGapsTypes(gapsMatches);

        // replace normal gap syntax with math gap syntax
        for (let i = 0; i < gapsMatches.length; i++) {
            const match = gapsMatches[i];
            const gapId = `${presenter.configuration.addonID}-${i}`;
            html = html.replace(match, generateMathGap(gapId, presenter.configuration.gapWidth.value));
        }

        return {
            printableOptions: tablePrintableOptions,
            html: html
        }
    }

    function indexRegexMatchesBaseOnGapsTypes(gapsMatches) {
        const normalGapRegex = /\\gap{.*?}/g,
            filledGapRegex = /\\filledGap{.*?}/g,
            dropdownGapRegex = /{{.*?}}/g;
        var tablePrintableOptions = [],
            stateIndex = 0,
            isMatchesGapType,
            gapMatch,
            gapMatchIndex;

        for (gapMatchIndex = 0; gapMatchIndex < gapsMatches.length; gapMatchIndex++) {
            gapMatch = gapsMatches[gapMatchIndex];

            isMatchesGapType = gapMatch.match(normalGapRegex);
            if (isMatchesGapType != null) {
                tablePrintableOptions.push(
                    new TablePrintableNormalGapOption(
                        gapMatch,
                        stateIndex
                    )
                )
                stateIndex += 1;
                continue;
            }

            isMatchesGapType = gapMatch.match(filledGapRegex);
            if (isMatchesGapType != null) {
                tablePrintableOptions.push(
                    new TablePrintableFilledGapOption(
                        gapMatch,
                        stateIndex
                    )
                )
                stateIndex += 1;
            }
        }
        for (gapMatchIndex = 0; gapMatchIndex < gapsMatches.length; gapMatchIndex++) {
            gapMatch = gapsMatches[gapMatchIndex];

            isMatchesGapType = gapMatch.match(dropdownGapRegex);
            if (isMatchesGapType != null) {
                tablePrintableOptions.push(
                    new TablePrintableDropdownGapOption(
                        gapMatch,
                        stateIndex
                    )
                );
                stateIndex += 1;
            }
        }
        return tablePrintableOptions;
    }

    function getTextWidthInPixels(html) {
        var $outerLessonWrapper = $("<div></div>");
        $outerLessonWrapper.css("position", "absolute");
        $outerLessonWrapper.css("visibility", "hidden");
        $outerLessonWrapper.addClass("printable_lesson");

        var $outerPageWrapper = $("<div></div>");
        $outerPageWrapper.addClass("printable_page");
        $outerLessonWrapper.append($outerPageWrapper);

        var $outerModuleWrapper = $("<div></div>");
        $outerModuleWrapper.addClass("printable_module");
        $outerModuleWrapper.addClass("printable_addon_Table");
        $outerPageWrapper.append($outerModuleWrapper);

        var $wrapper = $("<div></div>");
		$wrapper.css("margin", "0px");
		$wrapper.css("padding", "0px");
		$wrapper.addClass("printable_gap");
		$outerModuleWrapper.append($wrapper);

		$wrapper.html(html);
		$("body").append($outerLessonWrapper);
		var width = $wrapper[0].getBoundingClientRect().width;
		$outerLessonWrapper.detach();
		return width;
    }

    presenter.gradualShowAnswers = function(item) {
        presenter.gapsContainer.showAnswer(item);
        presenter.renderMathJax();
    }

    presenter.gradualHideAnswers = function() {
         presenter.gapsContainer.hideAnswers();
         presenter.renderMathJax();
         presenter.isGradualShowAnswersActive = false;
    }

    presenter.getActivitiesCount = function () {
        return presenter.gapsContainer.getLength();
    }

    /**
    * TablePrintableOption
    * */
    function TablePrintableOption (text, stateID) {
        this.text = text;
        this.stateID = stateID;
        this.options = [];
    }

    TablePrintableOption.prototype = Object.create(Object.prototype);
    TablePrintableOption.prototype.constructor = TablePrintableOption;

    TablePrintableOption.prototype.getPrintableGapSignHTML = function() {
        var $signSpan = $("<span></span>");
        if (this.hasCorrectAnswer()) {
            $signSpan.addClass("printable_gap_correct");
        } else {
            $signSpan.addClass("printable_gap_wrong");
        }
        return $signSpan[0].outerHTML;
    }

    /**
     * TablePrintableEditableGapOption
     */

    /**
     * @param text
     * @param stateID
     * @constructor
     */
    function TablePrintableEditableGapOption (text, stateID) {
        TablePrintableOption.call(this, text, stateID)
        this.initialValue = "";
        this.correctAnswer = "";
    }

    TablePrintableEditableGapOption.prototype = Object.create(TablePrintableOption.prototype);
    TablePrintableEditableGapOption.prototype.constructor = TablePrintableEditableGapOption;

    TablePrintableEditableGapOption.prototype.getPrintableHTML = function () {
        this.getGapTextData();
        var gapInnerText = this.generateInnerText();
        var gapHTML = this.generateGapHTML(gapInnerText);
        if (isPrintableCheckAnswersStateMode() && this.hasAnswer()) {
            gapHTML += this.getPrintableGapSignHTML();
        }
        return gapHTML;
    }

    TablePrintableEditableGapOption.prototype.getAnswer = function () {
        const gapState = presenter.printableState.gaps[this.stateID];
        return gapState === undefined ? null : gapState.value;
    }

    TablePrintableEditableGapOption.prototype.hasCorrectAnswer = function () {
        return this.correctAnswer === this.getAnswer();
    }

    TablePrintableEditableGapOption.prototype.hasAnswer = function () {
        return this.getAnswer() !== "" && this.getAnswer() !== null;
    }

    TablePrintableEditableGapOption.prototype.generateInnerText = function() {
        switch(presenter.printableStateMode) {
            case presenter.PRINTABLE_STATE_MODE.EMPTY: {
                return this.generateInnerTextForEmptyStateMode();
            }
            case presenter.PRINTABLE_STATE_MODE.SHOW_ANSWERS: {
                return this.correctAnswer;
            }
            case presenter.PRINTABLE_STATE_MODE.SHOW_USER_ANSWERS:
            case presenter.PRINTABLE_STATE_MODE.CHECK_ANSWERS: {
                return this.hasAnswer() ? this.getAnswer() : this.generateInnerTextForEmptyStateMode();
            }
        }
    }

    TablePrintableEditableGapOption.prototype.generateInnerTextForEmptyStateMode = function(){
        var longestAnswer = "";
        for (var i = 0; i < this.options.length; i++) {
            if (this.options[i].length > longestAnswer.length) {
                longestAnswer = this.options[i];
            }
        }
        if (longestAnswer.length === 0)
            longestAnswer = "&nbsp;&nbsp;&nbsp;";

        var gapWidth = 0;
        if (presenter.configuration.gapWidth.isSet) {
            gapWidth = presenter.configuration.gapWidth.value;
        } else {
            gapWidth = getTextWidthInPixels(longestAnswer);
        }

        var value = this.initialValue;
        var initialValueLength = 0;
        if (this.initialValue.length > 0) {
            initialValueLength = getTextWidthInPixels(this.initialValue);
        }

        var spaceWidth = getTextWidthInPixels('&nbsp;');
        var spaceCount = Math.ceil((gapWidth - initialValueLength) / spaceWidth);
        var maxSplitFreeWidth = 50; //must be at least minSplitSize * 2
        var minSplitSize = 20;

        if (spaceCount > maxSplitFreeWidth) {
            for (i = 0; i < minSplitSize; i++) {
                value += "&nbsp;";
            }

            var nextNbsp = false;
            for (i = 0; i < spaceCount - 2 * minSplitSize; i++) {
                if (nextNbsp) {
                    value += "&nbsp;";
                } else {
                    value += " ";
                }
                nextNbsp = !nextNbsp;
            }

            for (i = 0; i < minSplitSize; i++) {
                value += "&nbsp;";
            }
        } else {
            for (i = 0; i < spaceCount; i++) {
                value += "&nbsp;";
            }
        }
        return value;
    }

    TablePrintableEditableGapOption.prototype.generateGapHTML = function(gapInnerText) {
        const $span = $("<span></span>");
        const classes = presenter.hasMathGaps() ? "printable_gap printable_math_gap" : "printable_gap";
        $span.addClass(classes);
        $span.html(gapInnerText);
        return $span[0].outerHTML;
    }

    /**
     * TablePrintableNormalGapOption
     */

    function TablePrintableNormalGapOption (text, stateID) {
        TablePrintableEditableGapOption.call(this, text, stateID)
    }

    TablePrintableNormalGapOption.prototype = Object.create(TablePrintableEditableGapOption.prototype);
    TablePrintableNormalGapOption.prototype.constructor = TablePrintableNormalGapOption;

    TablePrintableNormalGapOption.prototype.getGapTextData = function() {
        // remove "\\gap{" and last "}"
        this.options = this.text.replace("\\gap{", "").replace(/}$/, "").split("|");
        this.correctAnswer = this.options[0];
    }


    /**
     * TablePrintableFilledGapOption
     */

    function TablePrintableFilledGapOption (text, stateID) {
        TablePrintableEditableGapOption.call(this, text, stateID)
    }

    TablePrintableFilledGapOption.prototype = Object.create(TablePrintableEditableGapOption.prototype);
    TablePrintableFilledGapOption.prototype.constructor = TablePrintableFilledGapOption;

    TablePrintableFilledGapOption.prototype.getGapTextData = function() {
        this.options = this.text.replace("\\filledGap{", "").replace(/}$/, "").split("|");
        this.correctAnswer = this.options[1];
        this.initialValue = this.options.splice(0, 1)[0];
    }

    /**
    * TablePrintableDropdownGapOption
    * */

    function TablePrintableDropdownGapOption (text, stateID) {
        TablePrintableOption.call(this, text, stateID);
        this.correctOptionRegex = /[0-9]*?:/;
        this.correctOptionIndex = null;
        this.chosenOptionIndex = null;
    }

    TablePrintableDropdownGapOption.prototype = Object.create(TablePrintableOption.prototype);
    TablePrintableDropdownGapOption.prototype.constructor = TablePrintableDropdownGapOption;

    TablePrintableDropdownGapOption.prototype.getPrintableHTML = function() {
        this.getGapTextData();
        if (!presenter.configuration.keepOriginalOrder)
            this.sortOptions();
        this.findCorrectOptionIndex();
        this.removeScoreInformationFromCorrectOption();

        if (isPrintableStateMode())
            this.findChosenOptionIndex();

        var gapHTML = this.generateGapHTML();
        if (isPrintableCheckAnswersStateMode() && this.hasAnswer()){
            gapHTML += this.getPrintableGapSignHTML();
        }
        return gapHTML;
    }

    TablePrintableDropdownGapOption.prototype.getAnswer = function () {
        return this.chosenOptionIndex;
    }

    TablePrintableDropdownGapOption.prototype.hasAnswer = function () {
        return this.chosenOptionIndex !== null;
    }

    TablePrintableDropdownGapOption.prototype.hasCorrectAnswer = function () {
        return this.chosenOptionIndex === this.correctOptionIndex;
    }

    TablePrintableDropdownGapOption.prototype.getGapTextData = function() {
        this.options = this.text.replace("{{","").replace("}}","").split("|");
    }

    TablePrintableDropdownGapOption.prototype.sortOptions = function() {
        this.options.sort(function(a,b){
            return a.replace(this.correctOptionRegex, "").localeCompare(b.replace(this.correctOptionRegex, ""));
        }.bind(this));
    }

    TablePrintableDropdownGapOption.prototype.findCorrectOptionIndex = function() {
        for (var i = 0; i < this.options.length; i++) {
            if (this.correctOptionRegex.test(this.options[i])) {
                this.correctOptionIndex = i;
                return;
            }
        }
    }

    TablePrintableDropdownGapOption.prototype.removeScoreInformationFromCorrectOption = function() {
        this.options[this.correctOptionIndex]
            = this.options[this.correctOptionIndex].replace(this.correctOptionRegex, "");
    }

    TablePrintableDropdownGapOption.prototype.findChosenOptionIndex = function() {
        const gapState = presenter.printableState.gaps[this.stateID];
        const gapValue = gapState === undefined ? null : gapState.value;
        for (var i = 0; i < this.options.length; i++) {
            if (this.options[i] === gapValue) {
                this.chosenOptionIndex = i;
                return;
            }
        }
    }

    TablePrintableDropdownGapOption.prototype.generateGapHTML = function() {
        var $span = $("<span></span>");
        $span.addClass("printable_gap");

        if (isPrintableShowAnswersStateMode()) {
            $span.html(this.options[this.correctOptionIndex]);
            this.options[this.correctOptionIndex] = $span[0].outerHTML;
        } else if (isPrintableStateMode()) {
            $span.html(this.options[this.chosenOptionIndex]);
            this.options[this.chosenOptionIndex] = $span[0].outerHTML;
        }
        return this.options.join(" / ");
    }

    return presenter;
}
