function AddonTable_create() {
    var presenter = function () {
    };

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

    presenter.parseGaps = function () {
        var parseResult = { content: [], descriptions: [] },
            isDisabled = presenter.configuration.isDisabled;

        var textParserCell = presenter.textParser.parseGaps(presenter.$view.html());
        var parsedText = textParserCell.parsedText;

        var simpleGaps = textParserCell.gaps;

        $.each(simpleGaps, function (index, gap) {
            parsedText = presenter.replaceGapID(gap, parsedText);
            parseResult.descriptions.push({
                answers: gap.answers,
                id: presenter.configuration.addonID + gap.id,
                value: "",
                score: 1,
                isEnabled: !isDisabled
            });
        });
        var inlineGaps = textParserCell.inLineGaps;

        $.each(inlineGaps, function (index, gap) {
            parsedText = presenter.replaceGapID(gap, parsedText);
            parseResult.descriptions.push({
                answers: gap.distractors,
                id: presenter.configuration.addonID + gap.id,
                value: "",
                score: gap.value,
                isEnabled: !isDisabled
            });
        });
        presenter.$view.html(parsedText);
        return parseResult;
    };

    presenter.setGapsWidth = function () {
        if (presenter.configuration.gapWidth.isSet) {
            presenter.$view.find('.ic_gap').width(presenter.configuration.gapWidth.value + 'px');
        }
    };

    presenter.setGapsClass = function () {
        presenter.$view.find('.ic_inlineChoice').addClass('ic_gap');
    };

    presenter.getGapIndex = function (gap) {
        var $gap = $(gap),
            id = $gap.attr('id'),
            index = id.substring(presenter.configuration.addonID.length + 1); // +1 comes from addon ID and index separator - '-' character

        return parseInt(index, 10) - 1; // Gaps indexes are counted from 0, but theirs ID from 1
    };

    presenter.valueChangedEventHandler = function () {
        var gapIndex = presenter.getGapIndex(this);
        presenter.configuration.gaps.descriptions[gapIndex].value = $(this).val();
        presenter.sendValueChangeEvent(gapIndex);
    };

    presenter.valueClickEventHandler = function (event) {
        event.stopPropagation();
        event.preventDefault();
    };

    presenter.attachGapsHandlers = function () {
        presenter.$view.find('.ic_gap').blur(presenter.valueChangedEventHandler);
        presenter.$view.find('.ic_gap').click(presenter.valueClickEventHandler);
    };

    presenter.gapLogic = function (isPreview) {
        if (!isPreview) {
            presenter.configuration.gaps = presenter.parseGaps();
            presenter.resetIsEnabledProperty();
        }
        presenter.setGapsClass();
        presenter.setGapsWidth();


    };

    presenter.logic = function (view, model, isPreview) {
        presenter.$view = $(view);
        presenter.model = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(presenter.model);

        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        var $table = presenter.generateTable(presenter.configuration.contents, isPreview);
        presenter.setColumnWidth($table, presenter.configuration.columnsWidths);
        presenter.setRowHeight($table, presenter.configuration.rowsHeight);
        presenter.setVisibility(presenter.configuration.isVisible);

       presenter.gapLogic(isPreview);

        if (!isPreview) presenter.parseDefinitionLinks();
        if (!isPreview) presenter.attachGapsHandlers();
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();
        presenter.textParser = new TextParserProxy(controller.getTextParser());
    };

    presenter.createPreview = function (view, model) {
        presenter.logic(view, model, true);
    };

    presenter.run = function (view, model) {
        presenter.logic(view, model, false);
    };

    presenter.setGapDisableProperties = function (index, isEnabled) {
        if (isEnabled) {
            presenter.enableGap(index + 1);
        } else {
            presenter.disableGap(index + 1);
        }
    };

    presenter.resetIsEnabledProperty = function () {
        var isEnabled = !presenter.configuration.isDisabled;
        $.each(presenter.configuration.gaps.descriptions, function (index) {
            presenter.setGapDisableProperties(index, isEnabled);
        });
    };

    presenter.reset = function () {
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);
        presenter.removeMarkClassesFromAllGaps();
        presenter.resetIsEnabledProperty();

        var emptyGapsValues = $.map(presenter.configuration.gaps.descriptions, function () {
            return "";
        });
        presenter.restoreGapValues(emptyGapsValues);
    };

    presenter.getState = function () {
        var gaps = $.map(presenter.configuration.gaps.descriptions, function (gap) {
            return { value: gap.value, isEnabled: gap.isEnabled };
        });

        return JSON.stringify({
            isVisible: presenter.configuration.isVisible,
            gaps: gaps
        });
    };

    presenter.restoreGapValues = function (gapValues) {
        $.each(gapValues, function (index, value) {
            presenter.configuration.gaps.descriptions[index].value = gapValues[index];
            var gapIndex = presenter.configuration.addonID + "-" + (index + 1);
            $("#" + gapIndex).val(gapValues[index]);
        });
    };

    presenter.setState = function (rawState) {
        var state = JSON.parse(rawState);

        var gapValues = $.map(state.gaps, function (gap) {
            return gap.value;
        });

        presenter.restoreGapValues(gapValues);

        presenter.setVisibility(state.isVisible);
        presenter.configuration.isVisible = state.isVisible;

        $.each(state.gaps, function (index, gap) {
            presenter.setGapDisableProperties(index, gap.isEnabled);
        });
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

        presenter.$view.find('.table-addon-wrapper').html($table);

        return $table;
    };

    presenter.setColumnWidth = function ($table, columnWidth) {
        var firstRow = $table.find('.row_1'), i;

        for (i = 0; i < columnWidth.length; i++) {
            $(firstRow[i]).css('width', columnWidth[i]);
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
                            colSpan: columns.values.length
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
            rowsHeight: convertedRowWidths.dimensions,
            isVisible: isVisible,
            isVisibleByDefault: isVisible,
            isActivity: !ModelValidationUtils.validateBoolean(model["Is not an activity"]),
            isDisabled: ModelValidationUtils.validateBoolean(model["Is disabled"]),
            isPunctuationIgnored: ModelValidationUtils.validateBoolean(model["Ignore punctuation"]),
            isCaseSensitive: ModelValidationUtils.validateBoolean(model["Case sensitive"]),
            gapWidth: gapWidth
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
        var descriptions = presenter.configuration.gaps.descriptions;

        if (!presenter.isGapIndexCorrect(gapIndex)) return undefined;

        return descriptions[gapIndex - 1].value;
    };

    presenter.getGapValue = function (gapIndex) {
        return presenter.getGapText(gapIndex);
    };

    presenter.getGapTextCommand = function (params) {
        return presenter.getGapText(parseInt(params[0], 10));
    };

    presenter.isGapIndexCorrect = function (gapIndex) {
        var descriptions = presenter.configuration.gaps.descriptions;

        return !(isNaN(gapIndex) || gapIndex < 1 || gapIndex > descriptions.length);
    };

    presenter.markGapAsCorrect = function (gapIndex) {
        var descriptions = presenter.configuration.gaps.descriptions;

        if (!presenter.isGapIndexCorrect(gapIndex)) return;

        var $gap = presenter.$view.find('#' + descriptions[gapIndex - 1].id);
        presenter.removeMarkClasses($gap);
        $gap.addClass('ic_gap-correct');
    };

    presenter.markGapAsCorrectCommand = function (params) {
        presenter.markGapAsCorrect(parseInt(params[0], 10));
    };

    presenter.markGapAsWrong = function (gapIndex) {
        var descriptions = presenter.configuration.gaps.descriptions;

        if (!presenter.isGapIndexCorrect(gapIndex)) return;

        var $gap = presenter.$view.find('#' + descriptions[gapIndex - 1].id);
        presenter.removeMarkClasses($gap);
        $gap.addClass('ic_gap-wrong');
    };

    presenter.markGapAsWrongCommand = function (params) {
        presenter.markGapAsWrong(parseInt(params[0], 10));
    };

    presenter.markGapAsEmpty = function (gapIndex) {
        var descriptions = presenter.configuration.gaps.descriptions;

        if (!presenter.isGapIndexCorrect(gapIndex)) return;

        var $gap = presenter.$view.find('#' + descriptions[gapIndex - 1].id);
        presenter.removeMarkClasses($gap);
        $gap.addClass('ic_gap-empty');
    };

    presenter.markGapAsEmptyCommand = function (params) {
        presenter.markGapAsEmpty(parseInt(params[0], 10));
    };

    presenter.enableGap = function (gapIndex) {
        var descriptions = presenter.configuration.gaps.descriptions;

        if (!presenter.isGapIndexCorrect(gapIndex)) return;

        var $gap = presenter.$view.find('#' + descriptions[gapIndex - 1].id);
        descriptions[gapIndex - 1].isEnabled = true;
        $gap.removeAttr('disabled');
    };

    presenter.enableGapCommand = function (params) {
        presenter.enableGap(parseInt(params[0], 10));
    };

    presenter.enableAllGaps = function () {
        jQuery.each(presenter.configuration.gaps.descriptions, function (index, element) {
            presenter.$view.find('#' + element.id).removeAttr('disabled');
            element.isEnabled = true;
        });
    };

    presenter.disableGap = function (gapIndex) {
        var descriptions = presenter.configuration.gaps.descriptions;

        if (!presenter.isGapIndexCorrect(gapIndex)) return;

        var $gap = presenter.$view.find('#' + descriptions[gapIndex - 1].id);
        descriptions[gapIndex - 1].isEnabled = false;
        $gap.attr('disabled', 'disabled');
    };

    presenter.disableGapCommand = function (params) {
        presenter.disableGap(parseInt(params[0], 10));
    };

    presenter.disableAllGaps = function () {
        jQuery.each(presenter.configuration.gaps.descriptions, function (index, element) {
            presenter.$view.find('#' + element.id).attr('disabled', 'disabled');
            element.isEnabled = false;
        });
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
            'disableAllGaps': presenter.disableAllGaps
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.getMaxScore = function () {
        if (!presenter.configuration.isActivity) return 0;

        var score = 0;
        $.each(presenter.configuration.gaps.descriptions, function (index, gap) {
            score += gap.score;
        });

        return score;
    };

    presenter.isGapCorrect = function (gap, isCaseSensitive, isPunctuationIgnored) {
        var isCorrect = false;
        if ($("#" + gap.id).hasClass("ic_inlineChoice")) {
            isCorrect = gap.value == gap.answers[0];
        }
        else {
            $.each(gap.answers, function (index, element) {
                var answer = isCaseSensitive ? gap.value : gap.value.toLowerCase(),
                    properAnswer = isCaseSensitive ? element : element.toLowerCase();

                if (isPunctuationIgnored) {
                    // replace(/\W/g, '') replaces every non-word characters (NOT the range 0 - 9, A - Z and a - z) to empty string
                    answer = answer.replace(/\W/g, '');
                    properAnswer = properAnswer.replace(/\W/g, '');
                }

                if (answer === properAnswer) {
                    isCorrect = true;
                    return false; // jQuery.each break statement
                }

                return true; // jQuery.each continue
            });
        }
        return isCorrect;
    };

    presenter.getScore = function () {
        if (!presenter.configuration.isActivity) return 0;

        var score = 0,
            isCaseSensitive = presenter.configuration.isCaseSensitive,
            isPunctuationIgnored = presenter.configuration.isPunctuationIgnored;
        $.each(presenter.configuration.gaps.descriptions, function (index, gap) {

            if (presenter.isGapCorrect(gap, isCaseSensitive, isPunctuationIgnored)) {
                score += gap.score;
            }
        });

        return score;
    };

    presenter.getErrorCount = function () {
        if (!presenter.configuration.isActivity) return 0;

        var errorCount = 0,
            isCaseSensitive = presenter.configuration.isCaseSensitive,
            isPunctuationIgnored = presenter.configuration.isPunctuationIgnored;
        $.each(presenter.configuration.gaps.descriptions, function (index, gap) {
            if (gap.value.trim() !== "" && !presenter.isGapCorrect(gap, isCaseSensitive, isPunctuationIgnored)) {
                errorCount++;
            }
        });

        return errorCount;
    };

    presenter.setShowErrorsMode = function () {
        var isCaseSensitive = presenter.configuration.isCaseSensitive,
            isPunctuationIgnored = presenter.configuration.isPunctuationIgnored,
            isActivity = presenter.configuration.isActivity;

        $.each(presenter.$view.find('.ic_gap'), function (index, gap) {
            $(gap).attr('disabled', 'disabled');
            if (!isActivity) return true;
            var gapIndex = presenter.getGapIndex(gap);
            var gapDescription = presenter.configuration.gaps.descriptions[gapIndex];
            if (gapDescription.value.trim() === "") {
                $(gap).addClass('ic_gap-empty');
                return true; // jQuery.each continue
            }

            if (presenter.isGapCorrect(gapDescription, isCaseSensitive, isPunctuationIgnored)) {
                $(gap).addClass('ic_gap-correct');
            } else {
                $(gap).addClass('ic_gap-wrong');
            }

            return true;
        });
    };

    presenter.removeMarkClasses = function (gap) {
        $(gap).removeClass('ic_gap-correct');
        $(gap).removeClass('ic_gap-wrong');
        $(gap).removeClass('ic_gap-empty');
    };

    presenter.removeMarkClassesFromAllGaps = function () {
        $.each(presenter.$view.find('.ic_gap'), function (index, gap) {
            presenter.removeMarkClasses(gap);
        });
    };

    presenter.setWorkMode = function () {
        $.each(presenter.$view.find('.ic_gap'), function (index, gap) {
            var gapIndex = presenter.getGapIndex(gap),
                gapDescription = presenter.configuration.gaps.descriptions[gapIndex];
            if (gapDescription.isEnabled) $(gap).removeAttr('disabled');
            presenter.removeMarkClasses(gap);
        });
    };

    presenter.createEventData = function (item, value, score) {
        return {
            source: presenter.configuration.addonID,
            item: "" + item,
            value: "" + value,
            score: "" + score
        };
    };

    presenter.sendValueChangeEvent = function (gapIndex) {
        var gapDescription = presenter.configuration.gaps.descriptions[gapIndex],
            isCaseSensitive = presenter.configuration.isCaseSensitive,
            isPunctuationIgnored = presenter.configuration.isPunctuationIgnored,
            isCorrect = presenter.isGapCorrect(gapDescription, isCaseSensitive, isPunctuationIgnored),
            score = isCorrect ? 1 : 0,
            eventData = presenter.createEventData(gapIndex + 1, gapDescription.value, score);

        presenter.eventBus.sendEvent('ValueChanged', eventData);
    };

    return presenter;
}