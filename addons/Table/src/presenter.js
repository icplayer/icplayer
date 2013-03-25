function AddonTable_create() {
    var presenter = function () {};
    presenter.textParser = null;
    presenter.playerController = null;

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
        'RH_01': "Number of items in 'Rows height' property cannot be higher than number of rows!"
    };

    function presenterLogic(view, model, isPreview) {
        presenter.$view = $(view);
        presenter.model = presenter.upgradeModel(model);

        presenter.configuration = presenter.validateModel(presenter.model);

        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        var $table = presenter.generateTable(presenter.configuration.contents, isPreview);
        presenter.$view.find('.table-addon-wrapper').html($table);
        presenter.setColumnWidth($table, presenter.configuration.columnsWidths);
        presenter.setRowHeight($table, presenter.configuration.rowsHeight);
        presenter.setVisibility(presenter.configuration.isVisible);
    }

    presenter.setPlayerController = function(controller){
        this.playerController = controller;
    };

    presenter.createPreview = function (view, model) {
        presenterLogic(view, model, true);
    };

    presenter.run = function (view, model) {
        presenterLogic(view, model, false);
        this.textParser.connectLinks(view);
    };

    presenter.reset = function () {
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);
    };

    presenter.getState = function () {
        return JSON.stringify({
            isVisible: presenter.configuration.isVisible
        });
    };

    presenter.setState = function (jsonState) {
        var state = JSON.parse(jsonState);

        presenter.setVisibility(state.isVisible);
    };

    /**
     * Generate table row (tr) element. Each cell has col_C and row_R classes where R is row number
     * (counted from 1 to rows count) and C is column number (from 1 to columns count).
     *
     * @param row row number counted from 0
     * @param content row content array
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
            var parsedText = isPreview ? content[i].content : this.parseText(content[i].content);
            $element.html(parsedText);
            $element.attr({
                colspan: content[i].colSpan,
                rowspan: content[i].rowSpan
            });

            $rowElement.append($element);
        }


        return $rowElement;
    };

    presenter.parseText = function (content) {
        presenter.textParser = presenter.playerController.getTextParser();
        return this.textParser.parse(content);
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

        if (ModelValidationUtils.isArrayElementEmpty(content[0])){
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
     * @return {Array} contents array of contents. Dimensions based on Rows and Columns properties
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

        var isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);

        return {
            isValid: true,
            contents: validatedContents.content,
            columnsWidths: convertedColumnWidth.dimensions,
            rowsHeight: convertedRowWidths.dimensions,
            isVisible: isVisible,
            isVisibleByDefault: isVisible
        };
    };

    presenter.addColumnsWidth = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!model["Columns width"]) {
            upgradedModel["Columns width"] = [{ Width: "" }];
        }

        return upgradedModel;
    };

    presenter.addRowHeights = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!model["Rows height"]) {
            upgradedModel["Rows height"] = [{ Height: "" }];
        }

        return upgradedModel;
    };

    presenter.upgradeModel = function(model) {
        var modelWithColumnsWidth = presenter.addColumnsWidth(model);

        return presenter.addRowHeights(modelWithColumnsWidth);
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.show = function() {
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
    };

    presenter.hide = function() {
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    return presenter;
}