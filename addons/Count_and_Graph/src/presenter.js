function AddonCount_and_Graph_create() {
    /*
        KNOWN ISSUES:
            Properties:
                Float user input - should be noticed but parsed to INT with parseInt, due to backward compatibility issue

                Axis Y Maximum Value:
                    Validation of property due to earlier versions of working & invalid validation, converts floats to ints,
                    thats why it have to use parseFloat & parseInt

                Axis Y Values:
                   Validation requires below requirements due to backward compatibility:
                   - Supported only 1 cyclic value
                   - cyclic value is every string ending with "*", and parseInt validated

                Bars width:
                    - Values between 0-1 are parsed to 1

                Border:
                    - negative numbers are ignored -> no border
                    - strings are ignored -> no border

                Axis X Data:
                    Answers values can be negative numbers or greater than axis Y max. It makes no sense, due to
                    addon activity is not solvable. Backward compatibility requires showing addon without being solvable.
                    Preview logic should show message  with addon, that addon configuration is invalid with answers.
    */

    var presenter = function () {};

    presenter.graph = null;
    presenter.isShowAnswersActive = false;
    presenter.errorMode = false;
    presenter.observer = undefined;

    presenter.ERROR_MESSAGES = {
        YAM_01: "Axis Y maximum value cant be lower or equal than 0.",
        YAM_02: "Axis Y maximum value have to be a integer string.",
        YAV_01: "Axis Y values cant be a non digit string.",
        YAV_02: "Axis Y cyclic value cant be equal or lower than 0.",
        YAV_03: "Axis Y fixed values cant be lower than 0.",
        YAV_04: "Axis Y values can\'t be greater than \"Axis Y Maximum Value\"",
        BW_01: "Bars width cant be lower than 0.",
        BW_02: "Bars width cant be a string.",
        BC_01: "Background color is not proper #RGB format.",
        AXD_01: "Axis data answers cant be empty string.",
        AXD_02: "Axis data answers have to be a positive integer value."
    };

    presenter.showErrorMessage = function (message, substitutions) {
        var errorContainer;
        if (typeof(substitutions) == 'undefined') {
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

    presenter.getErrorObject = function (errorCode) {
        return { isValid: false, errorCode: errorCode };
    };

    presenter.GRAPH_EVENT_TYPE = {
        BAR_SELECTED: 0,
        IMAGE_HAS_FINISHED_LOADING: 1,
        GRAPH_HAS_FINISHED_LOADING: 2
    };

    presenter.barObject = function (parentColumn, color, width, height, barValue, columnIndex, isExample) {
        this._column = parentColumn;
        this._color = color;
        this._width = width;
        this._height = height;
        this._barValue = barValue;
        this._columnIndex = columnIndex;
        this._isExample = isExample;
        this.$view;
        this._$innerDiv;
        this._initView();
        this._connectEvents();
    };

    presenter.barObject.prototype._initView = function () {
        this.$view = $('<div></div>');
        this.$view.css({
            'background-color': 'white',
            'height': this._height + "px",
            'width': this._width + "px",
            'position': 'relative'
        });

        this._createInnerDivWithLabel();
    };

    presenter.barObject.prototype._createInnerDivWithLabel = function () {
        this._$innerDiv = $('<div></div>');
        this._$innerDiv.addClass(this._getInitialClassName());
        this._$innerDiv.css({
            'position': 'absolute',
            'height': "0px",
            'width': "0px",
            'top': (this._height / 2) + "px",
            'left': (this._width / 2) + "px"
        });

        this.$view.append(this._$innerDiv);
    };

    presenter.barObject.prototype._getInitialClassName = function () {
        return "jqplot-point-label jqplot-series-" + (this._barValue - 1) + " jqplot-point-" + this._columnIndex;
    };

    presenter.barObject.prototype.restoreInitialClassName = function () {
        this._$innerDiv.addClass(this._getInitialClassName());
    };

    presenter.barObject.prototype._connectEvents = function () {
        if (this._isExample) return;
        if (MobileUtils.isMobileUserAgent(navigator.userAgent)) {
            this.$view[0].addEventListener("touchend", this, false);
        } else {
            this.$view[0].addEventListener("click", this, false);
        }
    };

    presenter.barObject.prototype.block = function () {
        if (this._isExample) return;
        if (MobileUtils.isMobileUserAgent(navigator.userAgent)) {
            this.$view[0].removeEventListener("touchend", this, false);
        } else {
            this.$view[0].removeEventListener("click", this, false);
        }
    };

    presenter.barObject.prototype.unblock = function() {
        this._connectEvents()
    };

    presenter.barObject.prototype._notify = function (event) {
        this._column.update(event);
    };

    presenter.barObject.prototype.handleEvent = function (event) {
        event.preventDefault();
        event.stopPropagation();

        switch(event.type) {
            case "click":
                var barEvent = this._createSelectEvent();
                this._highLight();
                this._notify(barEvent);
                break;
            case "touchend":
                var barEvent = this._createSelectEvent();
                this._highLight();
                this._notify(barEvent);
                break;
        }
    };

    presenter.barObject.prototype._createSelectEvent = function () {
        return {
            type: presenter.GRAPH_EVENT_TYPE.BAR_SELECTED,
            barValue: this._barValue
        };
    };

    presenter.barObject.prototype._highLight = function () {
        this.$view.css('background-color', 'rgb(224, 223, 219)');
    };

    presenter.barObject.prototype.setOff = function() {
        this.$view.css('background-color', 'white');
    };

    presenter.barObject.prototype.setOn = function() {
        this.$view.css('background-color', this._color);
    };

    presenter.barObject.prototype.setCssClass = function (cssClass) {
        this._$innerDiv.addClass(cssClass);
    };

    presenter.barObject.prototype.removeCssClass = function (cssClass) {
        this._$innerDiv.removeClass(cssClass);
    };

    presenter.columnObject = function (axisYMaximumValue, color, columnWidth, columnHeight, answer, columnIndex, isExample) {
        this._axisYMaximumValue = axisYMaximumValue;
        this._barsNumber = axisYMaximumValue;
        this._barsColor = color;
        this._topSelectedBarNumber = -1;
        this._height = columnHeight;
        this._columnWidth = columnWidth;
        this._answer = answer;
        this._columnIndex = columnIndex;
        this.$view;
        this._bars;
        this.isExample = isExample;
        this._initializeColumn();
    };

    presenter.columnObject.prototype._initializeColumn = function () {
        this._bars = this._createBars();
        this._initView();
        this._appendBarsToColumn(this._bars);
        if (this.isExample) {
            this.showAnswer();
        }
    };

    presenter.columnObject.prototype._appendBarsToColumn = function (barsArray) {
        for (var i = barsArray.length - 1; i >= 0; i--) {
            this.$view.append(barsArray[i].$view);
        }
    };

    presenter.columnObject.prototype._getBarWidth = function () {
        return this._columnWidth;
    };

    presenter.columnObject.prototype._getBarHeight = function () {
        return (this._height / this._barsNumber);
    };

    presenter.columnObject.prototype._initView = function () {
        this.$view = $('<div></div>');
        this.$view.addClass("column");
        this.$view.css({
            'height': this._height + "px",
            'width': this._columnWidth + "px"
        });
        if (this.isExample) {
            this.$view.addClass('example_column');
        }
    };

    presenter.columnObject.prototype.update = function (event) {
        switch(event.type) {
            case presenter.GRAPH_EVENT_TYPE.BAR_SELECTED:
                this._selectingBarLogic(event.barValue - 1);
                break;
        }
    };

    presenter.columnObject.prototype._createBars = function () {
        var bars = [];
        var barWidth = this._getBarWidth();
        var barHeight = this._getBarHeight();

        for(var i = 0; i < this._barsNumber; i++) {
            var bar = new presenter.barObject(this, this._barsColor, barWidth, barHeight, i + 1, this._columnIndex, this.isExample);
            bars.push(bar);
        }

        return bars;
    };

    presenter.columnObject.prototype._selectingBarLogic = function (selectedBarIndex) {
        var previousValue = this._topSelectedBarNumber;
        var change = "";
        this._setOffSelectedBar(selectedBarIndex);

        if(this._columnShouldGetRaised(selectedBarIndex)) {
            this._raiseColumn();
            change = "increase";
        } else {
            this._lowerColumn();
            change = "decrease";
        }

        this._sendEvents(change, previousValue);
    };

    presenter.columnObject.prototype._sendEvents = function (changeType, previousValue) {
        if(this._isCorrect()) {
            presenter.sendEvent(true, this._columnIndex, changeType);
        } else {
            this._sendIncorrectEvent(previousValue + 1, changeType);
        }

        if(presenter.isAllOk()) {
            presenter.sendEventAllOk();
        }
    };

    presenter.columnObject.prototype._sendIncorrectEvent = function (previousValue, changeType) {
        if (previousValue >= this._answer) {
            presenter.sendEvent(false, this._columnIndex, changeType);
        }
    };

    presenter.columnObject.prototype._isCorrect = function () {
        return ((this._topSelectedBarNumber + 1) == this._answer);
    };

    presenter.columnObject.prototype._setOffSelectedBar = function (selectedBarIndex) {
        if (selectedBarIndex > this._topSelectedBarNumber) {
            this._setOffBar(selectedBarIndex);
        } else {
            this._setOnBar(selectedBarIndex);
        }
    };

    presenter.columnObject.prototype._columnShouldGetRaised = function (selectedBarIndex) {
        return (selectedBarIndex > this._topSelectedBarNumber);
    };

    presenter.columnObject.prototype._setOffBar = function (barIndex) {
        this._bars[barIndex].setOff();
    };

    presenter.columnObject.prototype._lowerColumn = function () {
        this._setOffBar(this._topSelectedBarNumber);
        this._topSelectedBarNumber -= 1;
    };

    presenter.columnObject.prototype._raiseColumn = function () {
        this._setOnBar(this._topSelectedBarNumber + 1);
        this._topSelectedBarNumber += 1;
    };

    presenter.columnObject.prototype._setOnBar = function (barIndex) {
        this._bars[barIndex].setOn();
    };

    presenter.columnObject.prototype.setPosition = function (left) {
        this.$view.css({
            left: left + 'px'
        });
    };

    presenter.columnObject.prototype.getWidth = function () {
        return this.$view.width();
    };

    presenter.columnObject.prototype.showAnswer = function () {
        this.cleanSelection();
        this._drawCorrectAnswer();
    };

    presenter.columnObject.prototype.hideAnswer = function () {
        this.cleanSelection();
        this._drawUserAnswer();
    };

    presenter.columnObject.prototype._drawCorrectAnswer = function () {
        for(var i = 0; i < this._answer; i++) {
            this._setOnBar(i);
        }
    };

    presenter.columnObject.prototype._drawUserAnswer = function () {
        for(var i = 0; i <= this._topSelectedBarNumber; i++) {
            this._setOnBar(i);
        }
    };

    presenter.columnObject.prototype.block = function () {
        this._bars.forEach(function (element) {
            element.block();
        });
    };

    presenter.columnObject.prototype.unblock = function () {
        this._bars.forEach(function (element) {
            element.unblock();
        });
    };

    presenter.columnObject.prototype.cleanSelection = function () {
        this._bars.forEach(function (element) {
            element.setOff();
        });
    };

    presenter.columnObject.prototype._resetUserAnswer = function () {
        this._topSelectedBarNumber = -1;
    };

    presenter.columnObject.prototype.reset = function () {
        this.cleanSelection();
        this._resetUserAnswer();
    };

    presenter.columnObject.prototype.getScore = function () {
        if (this.isExample) return 0;

        if(this._isCorrect()) {
            return 1;
        }

        return 0;
    };

    presenter.columnObject.prototype.setShowErrorsMode = function () {
        if (this._topSelectedBarNumber > -1) {
            var cssClass = this._getCssClassForCheckAnswers();

            this._setBarCssClass(this._topSelectedBarNumber, cssClass);
        }
    };

    presenter.columnObject.prototype._getCssClassForCheckAnswers = function () {
        return ("jqplot-point-label jqplot-series-" + this._topSelectedBarNumber + " jqplot-point-" + this._columnIndex +
                " " + this._getUserAnswerStatus());
    };

    presenter.columnObject.prototype._getUserAnswerStatus = function () {
        var userAnswer = this._topSelectedBarNumber + 1;

        if (userAnswer == this._answer) {
            return "ok";
        }

        if (userAnswer > this._answer) {
            return "down";
        }

        return "up";
    };

    presenter.columnObject.prototype._setBarCssClass = function (barIndex, cssClass) {
        this._bars[barIndex].setCssClass(cssClass);
    };

    presenter.columnObject.prototype._removeBarCssClass = function (barIndex, cssClass) {
        this._bars[barIndex].removeCssClass(cssClass);
    };

    presenter.columnObject.prototype.setWorkMode = function () {
        if (this._topSelectedBarNumber > -1) {
            var cssClass = this._getCssClassForCheckAnswers();

            this._removeBarCssClass(this._topSelectedBarNumber, cssClass);
            this._restoreBarInitialClassName(this._topSelectedBarNumber);
        }
    };

    presenter.columnObject.prototype._restoreBarInitialClassName = function (barIndex) {
        this._bars[barIndex].restoreInitialClassName();
    };

    presenter.columnObject.prototype.setState = function (userSelection) {
        this.reset();
        this._topSelectedBarNumber = (userSelection - 1);
        this._drawUserAnswer();
    };

    presenter.columnObject.prototype.getState = function () {
        if (this.isExample) return 0;
        return (this._topSelectedBarNumber + 1);
    };


    presenter.graphObject = function ($parentDiv, axisYMaximumValue, answers, colors, descriptions, imagesDescriptions,
                                      barsWidth, backgroundColor, gridLineColor, cyclicValue, fixedValues, axisSpace,
                                      border, axisYDescription, axisXDescription, exampleColumns, axisXImageHeight, axisXImageWidth) {
        this._axisSpace = axisSpace || 30;
        this._$parentDiv = $parentDiv;
        this._axisYMaximumValue = axisYMaximumValue;
        this._answers = answers;
        this._columnsNumber = answers.length;
        this._colors = colors;
        this._descriptions = descriptions;
        this._imagesDescriptions = imagesDescriptions;
        this._barsWidth = barsWidth;
        this._backgroundColor = backgroundColor;
        this._gridLineColor = gridLineColor;
        this._$graphContainer;
        this.$view;
        this.$upperContainer;
        this.$bottomContainer;
        this._$axisYContainer;
        this._$axisXContainer;
        this._columns;
        this._width = $parentDiv.width();
        this._height = $parentDiv.height();
        this._cyclicValue = cyclicValue;
        this._fixedValues = fixedValues;
        this._axisX;
        this._axisY;
        this._isBlocked = false;
        this._border = border;
        this._columnsAtMaxOffset = 10;
        this._axisXDescription = axisXDescription;
        this._axisYDescription = axisYDescription;
        this._axisXImageHeight = axisXImageHeight;
        this._axisXImageWidth =  axisXImageWidth;
        this._exampleColumns = [];
        this._exampleColumnsNumber = 0;
        if (exampleColumns != undefined) {
            this._exampleColumns = exampleColumns;
            for (var i = 0; i < this._exampleColumns.length; i++) {
                if (this._exampleColumns[i]) this._exampleColumnsNumber += 1;
            }
        }
    };

    presenter.graphObject.prototype._getGraphWidth = function () {
        return (this._width - this._axisSpace);
    };

    presenter.graphObject.prototype._getGraphHeight = function () {
        if (MobileUtils.isSafariMobile(navigator.userAgent)) {
            return this._getIOSGraphHeight();
        } else {
            return this._getDefaultGraphHeight();
        }
    };

    presenter.graphObject.prototype._getDefaultGraphHeight = function () {
        return (this._height - this._axisSpace);
    };

    presenter.graphObject.prototype._getIOSGraphHeight = function () {
        var barHeight = this._getDefaultGraphHeight() / this._axisYMaximumValue;

        if ((barHeight % 1) != 0) {
            return (Math.floor(barHeight) * this._axisYMaximumValue);
        }

        return this._getDefaultGraphHeight();
    };

    presenter.graphObject.prototype._getAxisYWidth = function () {
        return this._axisSpace;
    };

    presenter.graphObject.prototype._getAxisYHeight = function () {
        return this._getGraphHeight();
    };

    presenter.graphObject.prototype._getAxisXHeight = function () {
        return (this._axisXImageHeight || this._axisSpace);
    };

    presenter.graphObject.prototype._createGrid = function ($graphContainer) {
        var width = $graphContainer.width();
        var height = $graphContainer.height();
        var gridStep = this._getGridLineStep(height);

        for (var i = 0, step = 0; i <= this._axisYMaximumValue; i++, step += gridStep) {
            var $grid = this._getGridLine(width);
            $grid = this._positionGridLine($grid, step);
            $graphContainer.append($grid);
        }
    };

    presenter.graphObject.prototype._positionGridLine = function ($grid, top) {
        var topRepaired = top;

        if(top == 0) {
            topRepaired = 0;
        }

        $grid.css({
            'position': 'absolute',
            'top': topRepaired + 'px'
        });

        return $grid;
    };

    presenter.graphObject.prototype._getGridLineStep = function (height) {
        return (height / this._axisYMaximumValue);
    };

    presenter.graphObject.prototype._getGridLine = function (width) {
        var gridLine = $("<div></div>");

        gridLine.css({
            'border-top': '1px solid ' + this._gridLineColor,
            'width': width + "px",
            'left': 0 + "px",
            'height': 1 + "px"
        });

        return gridLine;
    };

    presenter.graphObject.prototype._createGraph = function () {
        this._$graphContainer = this._getGraphContainer(this._getGraphWidth(), this._getGraphHeight());

        this._createGrid(this._$graphContainer);

        this._columns = this._getColumns(this._getColumnWidth(), this._getGraphHeight());

        this._appendColumns(this._$graphContainer, this._columns);
        this._positionColumnsInGraph();

        return this._$graphContainer;
    };

    presenter.graphObject.prototype._positionColumnsInGraph = function () {
        var left = 0;
        var columnsMaxWidth = this._getColumnsMaxWidth();
        var rigth = columnsMaxWidth;
        for(var i = 0; i < this._columns.length; i++) {

            var middleOfSection = this._getMiddleOfColumnSection(left, rigth, this._columns[i].getWidth());
            this._columns[i].setPosition(middleOfSection);

            left += columnsMaxWidth;
            rigth += columnsMaxWidth;
        }
    };

    presenter.graphObject.prototype._getBorderOffset = function () {
        // bars have 1px border, which creates offset for columns, and they dont fit into graph
        return (this._axisYMaximumValue - 1) * 2
    };

    presenter.graphObject.prototype._getMiddleOfColumnSection = function (left, right, columnsWidth) {
        var range = right - left;

        if(columnsWidth == range) {
            return left;
        }

        return ((range - columnsWidth) / 2) + left;
    };

    presenter.graphObject.prototype._getColumnsMaxWidth = function () {
        return (this._getGraphWidth() / this._columnsNumber);
    };

    presenter.graphObject.prototype._getColumnWidth = function () {
        if(this._barsWidth > this._getColumnsMaxWidth()) {
            if ((this._getColumnsMaxWidth() - this._columnsAtMaxOffset) < 0) {
                return 1;
            }

            return (this._getColumnsMaxWidth() - this._columnsAtMaxOffset);
        }

        return this._barsWidth;
    };

    presenter.graphObject.prototype._appendColumns = function ($container, columnsArray) {
        columnsArray.forEach(function (element) {
            $container.append(element.$view);
        });
    };

    presenter.graphObject.prototype._getGraphContainer = function (width, height) {
        var $graphContainer = $('<div></div>');
        $graphContainer.addClass("graph_container");
        $graphContainer.css({
            'background-color': this._backgroundColor + '',
            'height': height + "px",
            'width':  width + "px"
        });

        this._setGraphContainerBorder($graphContainer);

        return $graphContainer;
    };

    presenter.graphObject.prototype._setGraphContainerBorder = function ($graphContainer) {
        if(this._border > 0) {
            if(this._border > 3) {
                $graphContainer.css({
                    "border": "3px solid black",
                    "margin": "0px",
                    "padding": "0px"
                });
            } else {
                $graphContainer.css({
                    border: this._border + "px solid black",
                    "margin": "0px",
                    "padding": "0px"
                });
            }
        } else {
            $graphContainer.css({
                border: 0 + "px solid black",
                "margin": "0px",
                "padding": "0px"
            })
        }
    };

    presenter.graphObject.prototype._createAxisY = function () {
        var axisY = new presenter.axisYObject(this._axisYMaximumValue, this._getAxisYWidth(), this._getAxisYHeight(),
                                              this._cyclicValue, this._fixedValues, this._axisYDescription,
                                              this._gridLineColor);
        this._axisY = axisY;

        return axisY.$view;
    };

    presenter.graphObject.prototype._getColumnsDescriptionsPositions = function () {
        var values = [];
        var columnsMaxWidth = this._getColumnsMaxWidth();

        for(var i = 0, left = 0; i < this._columnsNumber; i++, left += columnsMaxWidth) {
            values.push(left);
        }

        return values;
    };

    presenter.graphObject.prototype._createAxisX = function () {
        this._axisX = new presenter.axisXObject (
            this._getGraphWidth(), this._getAxisXHeight(), this._columnsNumber, this._descriptions, this._imagesDescriptions,
            this._getColumnsDescriptionsPositions(), this._getColumnsMaxWidth(), this._getColumnWidth(), this._axisXDescription,
            this._$graphContainer.css("border-bottom-width"), this._axisXImageWidth
        );

        return this._axisX.$view;
    };

    presenter.graphObject.prototype._getGraphHasFinishedLoadingEvent = function () {
        return {
            type: presenter.GRAPH_EVENT_TYPE.GRAPH_HAS_FINISHED_LOADING
        };
    };

    presenter.graphObject.prototype.notify = function () {
        var event = this._getGraphHasFinishedLoadingEvent();
        presenter.observer.update(event);
    };

    presenter.graphObject.prototype.setCallbackForAddonView = function () {
        this._$parentDiv.ready(function () {
            presenter.graph.notify();
        });
    };

    presenter.graphObject.prototype.initializeGraph = function () {
        this.$view = this._createMainContainer();

        this._$graphContainer = this._createGraph();
        this._appendGraph(this._$graphContainer);

        this._$axisYContainer = this._createAxisY();
        this._appendAxisY(this._$axisYContainer);

        this._$axisXContainer = this._createAxisX();
        this._appendAxisX(this._$axisXContainer);

        this._$parentDiv.append(this.$view);

        this.setCallbackForAddonView();
    };

    presenter.graphObject.prototype._appendAxisX = function ($axisXContainer) {
        this._setAxisXPosition($axisXContainer);
        this.$bottomContainer.append($axisXContainer);
    };

    presenter.graphObject.prototype._setAxisXPosition = function ($axisXContainer) {
        $axisXContainer.css({
            'left': this._axisSpace + "px"
        });
    };

    presenter.graphObject.prototype._appendGraph = function ($graphContainer) {
        this._setGraphPosition($graphContainer);
        this.$upperContainer.append($graphContainer);
    };

    presenter.graphObject.prototype._createMainContainer = function () {
        var $view = $('<div></div>');
        $view.addClass("main_container");
        $view.css({
            'height': this._height + "px",
            'width':  this._width + "px"
        });

        this.$upperContainer = $('<div></div>');
        this.$upperContainer.addClass("upper_container");
        this.$upperContainer.css({
            'width': this._width + "px",
            'height': this._getGraphHeight() + "px"
        });

        this.$bottomContainer = $('<div></div>');
        this.$bottomContainer.addClass("bottom_container");
        this.$bottomContainer.css({
            'width': this._width + "px",
            height: this._getAxisYWidth()
        });

        $view.append(this.$upperContainer);
        $view.append(this.$bottomContainer);

        return $view;
    };

    presenter.graphObject.prototype._setGraphPosition = function ($graphContainer) {

    };

    presenter.graphObject.prototype._appendAxisY = function ($axisYContainer) {
        this.$upperContainer.append($axisYContainer);
    };

    presenter.graphObject.prototype._getColumns = function (columnWidth, height) {
        var columns = [];
        for(var index = 0; index < this._columnsNumber; index++) {
            var column = new presenter.columnObject(
                this._axisYMaximumValue, this._colors[index], columnWidth, height, this._answers[index], index, this._exampleColumns[index]
            );
            columns.push(column);
        }

        return columns;
    };

    presenter.graphObject.prototype.showAnswers = function () {
        this._columns.forEach(function (element) {
            if (!element.isExample) {
                element.showAnswer();
            }
        });
    };

    presenter.graphObject.prototype.gradualShowAnswers = function (item) {
        var exampleCount = 0;
        this._columns.forEach(function (element, index) {
            if (element.isExample) {
                exampleCount += 1;
            } else {
                if (index - exampleCount <= item) {
                    element.showAnswer();
                } else {
                    element.cleanSelection();
                }
            }
        });
    };

    presenter.graphObject.prototype.hideAnswers = function () {
        this._columns.forEach(function (element) {
            if (!element.isExample) {
                element.hideAnswer();
            }
        });
    };

    presenter.graphObject.prototype.getActivitiesCount = function () {
        return this._columns.length - this._exampleColumnsNumber;
    };

    presenter.graphObject.prototype.reset = function () {
        this._columns.forEach(function (element) {
            if (!element.isExample) {
                element.reset();
            }
        });
    };

    presenter.graphObject.prototype.block = function () {
        if (!this._isBlocked) {
            this._columns.forEach(function (element) {
                element.block();
            });
            this._isBlocked = true;
        }
    };

    presenter.graphObject.prototype.unblock = function () {
        if (this._isBlocked) {
            this._columns.forEach(function (element) {
                element.unblock();
            });

            this._isBlocked = false;
        }
    };

    presenter.graphObject.prototype.getMaxScore = function () {
        return this._columnsNumber - this._exampleColumnsNumber;
    };

    presenter.graphObject.prototype.getScore = function () {
        return this._columns.map(function (column) {
            return column.getScore();
        }).reduce(function (previousValue, nextValue) {
            return previousValue + nextValue;
        });
    };

    presenter.graphObject.prototype.getErrorCount = function () {
        if(!this.isAttempted()) {
            return 0;
        }

        return (this.getMaxScore() - this.getScore());
    };

    presenter.graphObject.prototype.setShowErrorsMode = function () {
        this._columns.forEach(function (column) {
            column.setShowErrorsMode();
        });
    };

    presenter.graphObject.prototype.setWorkMode = function () {
        this._columns.forEach(function (column) {
            column.setWorkMode();
        });
    };

    presenter.graphObject.prototype.getState = function () {
        return this._columns.map(function(column) {
            return column.getState();
        });
    };

    presenter.graphObject.prototype.setState = function (userSelectionArray) {
        for(var i = 0; i < userSelectionArray.length; i++) {
            if (!this._columns[i].isExample) {
                this._columns[i].setState(userSelectionArray[i]);
            }
        }
    };

    presenter.graphObject.prototype.getImagesHeight = function () {
        return this.$view.find(".countGraph_image").height();
    };

    presenter.graphObject.prototype.getImagesWidth = function () {
        return this.$view.find(".countGraph_image").width();
    };

    presenter.graphObject.prototype._setRescaledSizes = function () {
        this._axisXImageHeight = this.getImagesHeight() + this._axisSpace;
        this._axisXImageWidth = this.getImagesWidth();

        this._height -= this._axisXImageHeight;
    };

    presenter.graphObject.prototype.rescale = function () {
        this._setRescaledSizes();

        var currentState = this.getState();

        this.$view.remove();
        this.initializeGraph();

        this.setState(currentState);
    };

    presenter.axisYObject = function (axisYMaximumValue, width, height, cyclicValue, fixedValues, axisYDescription,
                                      axisYColor) {
        this._axisYMaximumValue = axisYMaximumValue;
        this._width = width;
        this._height = height;
        this._cyclicValue = cyclicValue;
        this._fixedValues = fixedValues;
        this._axisYDescription = axisYDescription;
        this._$axisYDescription = null;
        this._axisYColor = axisYColor;
        this.$view = null;
        this._init();
    };

    presenter.axisYObject.prototype._init = function () {
        this.$view = this._createAxisYContainer();
        this._createAxisYDescription();

        this._createTicks(this._getTicksValues());
    };

    presenter.axisYObject.prototype._createAxisYDescription = function () {
        this._$axisYDescription = this._getAxisYDescription();
        this._appendAxisYDescription(this._$axisYDescription);
    };

    presenter.axisYObject.prototype._getAxisYDescription = function () {
        var $div = $("<div></div>");
        $div.addClass("jqplot-yaxis-label");
        $div.css({
            top: ((this._height - 30) / 2) + "px"
        });

        $div.append(this._axisYDescription);

        return $div;
    };

    presenter.axisYObject.prototype._appendAxisYDescription = function ($axisDescription) {
        this.$view.append($axisDescription);
    };

    presenter.axisYObject.prototype._createTicks = function (tickValues) {
        var stepsValues = this._getReversedAxisYStepsValues();

        for(var i = 0; i < tickValues.length; i++) {
            var value = tickValues[i];
            var $tick = this._getTick(value);
            this._appendTickToContainer($tick, value, stepsValues);
        }
    };

    presenter.axisYObject.prototype._getReversedAxisYStepsValues = function () {
        var step = this._getAxisYStep();
        var values = [];

        for(var i = 0; i <= this._axisYMaximumValue; i++) {
            values.push((i * step));
        }

        return values.reverse();
    };

    presenter.axisYObject.prototype._getTick = function (value) {
        var $tick = $('<div></div>');
        $tick.addClass("jqplot-yaxis-tick");

        this._setTickCss($tick);

        $tick.append(value);

        return $tick;
    };

    presenter.axisYObject.prototype._setTickCss = function ($tick) {
        $tick.css({
           width: "10px"
        });
    };

    presenter.axisYObject.prototype._appendTickToContainer = function ($tick, value, reversedAxisYSteps) {
        this.$view.append($tick);

        $tick.css({
            'top': (reversedAxisYSteps[value] - 7.5) + "px"
        });
    };

    presenter.axisYObject.prototype._createTicksFromCyclicValue = function () {
        var ticks = [];
        var cyclicValue = this._cyclicValue[0];

        for(var i = 0; i <= this._axisYMaximumValue; i += cyclicValue) {
            ticks.push(i);
        }

        return ticks;
    };

    presenter.axisYObject.prototype._getTicksValues = function () {
        if (this._fixedValues) {
            return this._fixedValues;
        } else {
            return this._createTicksFromCyclicValue();
        }
    };

    presenter.axisYObject.prototype._createAxisYContainer = function () {
        var $view = $('<div></div>');
        $view.addClass("jqplot-axis");
        $view.addClass("jqplot-yaxis");
        $view.css({
            'background-color': "transparent",
            'height': this._height + "px",
            'width':  this._width + "px",
            'border-right-style': "solid",
            'border-width': 1 + "px",
            'border-right-color': this._axisYColor
        });

        return $view;
    };

    presenter.axisYObject.prototype._getAxisYStep = function () {
        return (this._height) / this._axisYMaximumValue;
    };

    presenter.axisYObject.prototype._createAxisYLines = function () {
        var axisStep = this._getAxisYStep();

        var $firstDash = this._getDash();
        this._appendDashToContainer($firstDash, -0.5);

        for(var i = 1, step = axisStep; i <= this._axisYMaximumValue; i++, step += axisStep) {
            var $dash = this._getDash();
            this._appendDashToContainer($dash, step);
        }
    };

    presenter.axisYObject.prototype._getDash = function () {
        var $dash = $("<div></div>");
        $dash.css({
            height: "2px",
            width: "8px",
            'background-color': "black"
        });

        return $dash;
    };

    presenter.axisYObject.prototype._appendDashToContainer = function ($dash, step) {
        this.$view.append($dash);
        $dash.css({
            position: "absolute",
            top: (step + 0.5) + "px",
            left: 26 + "px"
        });
    };

    presenter.axisXObject = function (width, height, numberOfColumns, seriesDescription, seriesImageDescriptions,
                                      columnsPositions, columnsMaxWidth, columnWidth, axisXDescription,
                                      graphContainerBorderWidth, imageLeftMargin) {
        this._width = width;
        this._height = height;
        this._numberOfColumns = numberOfColumns;
        this._seriesDescriptions = seriesDescription;
        this._seriesImageDescriptions = seriesImageDescriptions;
        this._columnsPositions = columnsPositions;
        this._columnsMaxWidth = columnsMaxWidth;
        this._columnWidth = columnWidth;
        this._axisXDescription = axisXDescription;
        this._graphContainerBorderWidth = parseInt(graphContainerBorderWidth, 10);
        this._$axisXDescription = null;
        this._imageLeftMargin = ((imageLeftMargin / 2) || 15);
        this.$view = null;
        this._initView();
    };

    presenter.axisXObject.prototype._initView = function () {
        this.$view = this._getMainContainer();
        this._createAxisXDescription();
        this._createDashes();
        this._createDescriptions();
    };

    presenter.axisXObject.prototype._createAxisXDescription = function () {
        this._$axisXDescription = this._getAxisXDescription();
        this._appendAxisXDescription(this._$axisXDescription);
    };

    presenter.axisXObject.prototype._getAxisXDescription = function () {
        var $div = $("<div></div>");

        $div.addClass("jqplot-xaxis-label");
        $div.css({
            top: (this._height - 5) + "px",
            height: 10 + "px",
            left: ((this._width - 30) / 2)  + "px"
        });

        $div.append(this._axisXDescription);

        return $div;
    };

    presenter.axisXObject.prototype._appendAxisXDescription = function ($axisDescription) {
        this.$view.append($axisDescription);
    };

    presenter.axisXObject.prototype._getMainContainer = function () {
        var $mainContainer = $("<div></div>");
        $mainContainer.addClass("jqplot-axis");
        $mainContainer.addClass("jqplot-xaxis");
        $mainContainer.css({
            'width': (this._width + 2) + "px",
            'height': this._height + "px",
            'background-color': "transparent"
        });

        return $mainContainer;
    };

    presenter.axisXObject.prototype._createDescriptions = function () {
        for(var i = 0; i < this._seriesDescriptions.length; i++) {
            var $description;
            if (this._shouldCreateTextDescription(i)) {
                $description = this._getTextDescription(i);
            } else {
                $description = this._getImageDescription(i);
            }

            this._setDescriptionPosition($description, i);
        }
    };

    presenter.axisXObject.prototype._shouldCreateTextDescription = function (index) {
        return (this._seriesDescriptions[index].length > 0);
    };

    presenter.axisXObject.prototype._getTextDescription = function (index) {
        var $description = $("<div></div>");
        $description.addClass("jqplot-xaxis-tick");
        $description.append(this._seriesDescriptions[index]);

        return $description;
    };

    presenter.axisXObject.prototype._getImageDescription = function (index) {
        var $description = $("<div></div>");
        $description.addClass("jqplot-xaxis-tick");

        if (this._seriesImageDescriptions[index].length > 0) {
            var $image = $("<img/>");
            this._setCssToImageDescription($image, index);

            $description.append($image);
        }

        return $description;
    };

    presenter.axisXObject.prototype._setCssToImageDescription = function ($image, index) {
        $image.addClass("countGraph_image");
        this._addLoadingEventHandler($image);
        $image.attr('src', this._seriesImageDescriptions[index]);
        $image.css({
           "margin-left": -(this._imageLeftMargin) + "px"
        });
    };

    presenter.axisXObject.prototype._getImageHasFinishedLoadingEvent = function (width, height) {
        return {
            type: presenter.GRAPH_EVENT_TYPE.IMAGE_HAS_FINISHED_LOADING,
            data: {
                width: width,
                height: height
            }
        };
    };

    presenter.axisXObject.prototype._addLoadingEventHandler = function ($image) {

        var callbackFunction = this._notify;

        $image.on("load", function () {
            var event = this._getImageHasFinishedLoadingEvent($image.width(), $image.height());
            callbackFunction(event);
        }.bind(this));
    };

    presenter.axisXObject.prototype._notify = function (event) {
        presenter.observer.update(event);
    };

    presenter.axisXObject.prototype._setDescriptionPosition = function ($description, index) {
        this.$view.append($description);

        $description.css({
            'left': (this._columnsPositions[index]) + "px",
            'width': this._columnsMaxWidth + "px"
        });
    };

    presenter.axisXObject.prototype._createDashes = function () {
        for(var i = 0; i < this._numberOfColumns + 1; i++) {
            var $dash = this._getVerticalDash();
            this.$view.append($dash);
            this._positionDash($dash, i * this._columnsMaxWidth);
        }
    };

    presenter.axisXObject.prototype._positionDash = function ($dash, position) {
        var top = 1 + this._graphContainerBorderWidth;
        $dash.css({
            'left': position + "px",
            'top': top + "px"
        });
    };

    presenter.axisXObject.prototype._getVerticalDash = function () {
        var $dash = $("<div></div>");
        $dash.addClass("axis_x_dash");

        return $dash;
    };

    presenter.graphObserver = function () {
        this._shouldGraphGetRescaled = false;
        this._imagesHeight = undefined;
        this._imagesHasFinishedLoading = false;
        this._graphHasFinishedLoading = false;
        this._graphHasBeenRescaled = false;
    };

    presenter.graphObserver.prototype.update = function (event) {
        switch(event.type) {
            case presenter.GRAPH_EVENT_TYPE.IMAGE_HAS_FINISHED_LOADING:
                this._imageHasFinishedLoadingHandler(event);
                break;
            case presenter.GRAPH_EVENT_TYPE.GRAPH_HAS_FINISHED_LOADING:
                this._graphHasFinishedLoadingHandler();
                break;
        }

        this._updateGraph();
    };

    presenter.graphObserver.prototype._setGraphShouldGetRescaled = function () {
        this._shouldGraphGetRescaled = this._areGraphActionsSynchronised() && this.areImagesRescaled();
    };

    presenter.graphObserver.prototype._imageHasFinishedLoadingHandler = function (event) {
        if (!this._imagesHasFinishedLoading) {
            this._setObserverAfterImagesHasLoaded(event);
        }
    };

    presenter.graphObserver.prototype._setObserverAfterImagesHasLoaded = function (event) {
        this._imagesHasFinishedLoading = true;
        this._imagesHeight = event.data.height;
        this._setGraphShouldGetRescaled();
    };

    presenter.graphObserver.prototype._graphHasFinishedLoadingHandler = function () {
        if (!this._graphHasFinishedLoading) {
            this._setObserverAfterGraphHasLoaded();
        }
    };

    presenter.graphObserver.prototype._setObserverAfterGraphHasLoaded = function () {
        this._graphHasFinishedLoading = true;
        this._setGraphShouldGetRescaled();
    };

    presenter.graphObserver.prototype._updateGraph = function () {
        var task = this._getUpdateGraphTask();
        task.execute();
    };

    presenter.graphObserver.prototype._getUpdateGraphTask = function () {
        if (this._shouldCreateRescalingTask()) {
            return this._createRescalingTask();
        }
        return this._createNullTask();
    };

    presenter.graphObserver.prototype._shouldCreateRescalingTask = function () {
        return (this._shouldGraphGetRescaled && !this._graphHasBeenRescaled);
    };

    presenter.graphObserver.prototype.setGraphHasBeenRescaled = function (graphHasBeenRescaled) {
        this._graphHasBeenRescaled = graphHasBeenRescaled;
    };

    presenter.graphObserver.prototype._createRescalingTask = function () {
        return {
            execute: function () {
                presenter.observer.setGraphHasBeenRescaled(true);
                presenter.graph.rescale();
            }
        };
    };

    presenter.graphObserver.prototype._createNullTask = function () {
        return {
            execute: function () {}
        };
    };

    presenter.graphObserver.prototype._areGraphActionsSynchronised = function () {
        return (this._graphHasFinishedLoading && this._imagesHasFinishedLoading);
    };

    presenter.graphObserver.prototype.areImagesRescaled = function () {
        return this._areImagesRescaled(this._imagesHeight);
    };

    presenter.graphObserver.prototype._areImagesRescaled = function (height) {
        if (height == undefined) {
            return false;
        }

        return (height != 30);
    };

    presenter.run = function(view, model) {
        presenter.runLogic(view, model, false);

        presenter.addEventsListeners();
    };

    presenter.addEventsListeners = function () {
        presenter.eventBus.addEventListener('ShowAnswers', this);
        presenter.eventBus.addEventListener('HideAnswers', this);
        presenter.eventBus.addEventListener('PageLoaded', this);
        presenter.eventBus.addEventListener('GradualShowAnswers', this);
        presenter.eventBus.addEventListener('GradualHideAnswers', this);
    };

    presenter.createPreview = function(view, model) {
        presenter.runLogic(view, model, true);
    };

    presenter.validateModel = function(model) {
        var validatedAxisYMaximumValue = presenter.validateAxisYMaximumValue(model);
        if (!validatedAxisYMaximumValue.isValid) {
            return validatedAxisYMaximumValue;
        }

        var validatedAxisYValues = presenter.validateAxisYValues(model, validatedAxisYMaximumValue.value);
        if (!validatedAxisYValues.isValid) {
            return validatedAxisYValues;
        }

        var validatedBarsWidth = presenter.validateBarsWidth(model);
        if (!validatedBarsWidth.isValid) {
            return validatedBarsWidth;
        }

        var validatedBackgroundColor = presenter.validateBackgroundColor(model);
        if (!validatedBackgroundColor.isValid) {
            return validatedBackgroundColor;
        }

        var validatedGridLineColor = presenter.validateGridLineColor(model);
        if (!validatedGridLineColor.isValid) {
            return validatedGridLineColor;
        }

        var validatedBorder = presenter.validateBorder(model);
        if (!validatedBorder.isValid) {
            return validatedBorder;
        }

        var validatedAxisXData = presenter.validateAxisXData(model, validatedAxisYMaximumValue.value);
        if (!validatedAxisXData.isValid) {
            return validatedAxisXData;
        }

        return {
            isValid: true,
            ID: model.ID,
            isVisible: ModelValidationUtils.validateBoolean(model["Is Visible"]),
            isVisibleByDefault: ModelValidationUtils.validateBoolean(model["Is Visible"]),
            wasFloat: {
                axisYMaximumValue: validatedAxisYMaximumValue.wasFloat,
                axisYValues: validatedAxisYValues.wasFloat,
                axisXData: validatedAxisXData.wasFloat
            },
            axisYMaximumValue: validatedAxisYMaximumValue.value,
            axisYValues: {
                fixedValues: validatedAxisYValues.fixedValues,
                cyclicValue: validatedAxisYValues.cyclicValue
            },
            barsWidth: validatedBarsWidth.value,
            backgroundColor: validatedBackgroundColor.value,
            gridLineColor: validatedGridLineColor.value,
            border: validatedBorder.value,
            answers: validatedAxisXData.answers,
            answersBeyondAxisRange: validatedAxisXData.answersBeyondAxisRange,
            columnsColors: validatedAxisXData.colors,
            columnsDescriptions: validatedAxisXData.descriptions,
            columnsDescriptionsImages: validatedAxisXData.descriptionsImages,
            columnsNumber: validatedAxisXData.columnsNumber,
            axisXDescription: model["X axis description"],
            axisYDescription: model["Y axis description"],
            isNotActivity: ModelValidationUtils.validateBoolean(model["isNotActivity"]),
            exampleColumns: validatedAxisXData.examples
        };
    };

    presenter.validateAxisYMaximumValue = function (model) {
        var axisYMax = model["Y axis maximum value"].trim();

        if (ModelValidationUtils.isStringEmpty(axisYMax)) {
            return presenter.getErrorObject("YAM_02");
        }

        var wasFloat = false;
        var parsedAxisYMax = parseFloat(axisYMax);

        if (presenter.isFloat(parsedAxisYMax)) {
            wasFloat = true;
        }

        if(isNaN(parsedAxisYMax)) {
            return presenter.getErrorObject("YAM_02");
        }

        if (parsedAxisYMax <= 0) {
            return presenter.getErrorObject("YAM_01");
        }

        return {isValid: true, value: parseInt(parsedAxisYMax), wasFloat: wasFloat};
    };

    function parseCyclicValue(axisYValues, axisYMaxValue) {
        var parsedValue = parseFloat(axisYValues);

        if (isNaN(parsedValue)) {
            return presenter.getErrorObject("YAV_01");
        }

        if (parsedValue < 1) {
            return presenter.getErrorObject("YAV_02");
        }

        if (parsedValue > axisYMaxValue) {
            return presenter.getErrorObject("YAV_04");
        }

        return {isValid: true, cyclicValue: [parseInt(parsedValue)], wasFloat: presenter.isFloat(parsedValue)};
    }

    function isValueNumber (value) {
        return !isNaN(value);
    }

    function isValuePositive(value) {
        return value >= 0;
    }

    presenter.isFloat = function (value) {
        return Boolean(value % 1);
    };

    presenter.isFloatInValues = function (valuesArray) {
        return valuesArray.filter(presenter.isFloat).length > 0;
    };

    presenter.isRGB = function (value) {
        if (value.charAt(0) != "#") {
            return false;
        }

        if (value.length != 7) {
            return false;
        }

        return value.slice(1, 7).split("").every(function (element) {
            return ("abcdefABCDEF0123456789".indexOf(element) != -1);
        })
    };

    function isInAxisRange(value) {
        //function for map, requires axisYMax passed to thisArg
        return value <= this;
    }

    function parseValueToInt (value) {
        return parseInt(value);
    }

    function parseValueToBoolean (value) {
        return value != null && value.toLowerCase() == 'true';
    }

    function parseFixedValues(axisYValues, axisYMaxValue) {

        var parsedValues = axisYValues.split(";").map(function (element) {
            return element.trim();
        }).map(function (element) {
            return parseFloat(element);
        });

        if (!parsedValues.every(isValueNumber)) {
            return presenter.getErrorObject("YAV_01");
        }

        if (!parsedValues.every(isValuePositive)) {
            return presenter.getErrorObject("YAV_03");
        }

        if (!parsedValues.every(isInAxisRange, axisYMaxValue)) {
            return presenter.getErrorObject("YAV_04");
        }

        var parsedIntValues = parsedValues.map(parseValueToInt);

        return {isValid: true, fixedValues: parsedIntValues, wasFloat: presenter.isFloatInValues(parsedValues)};
    }

    presenter.validateAxisYValues = function (model, axisYMaxValue) {
        var axisYValues = model["Y axis values"].trim();

        if (ModelValidationUtils.isStringEmpty(axisYValues)) {
            return {isValid: true, cyclicValue: [1], wasFloat: false};
        }

        if (axisYValues.charAt(axisYValues.length - 1) == "*") {
            return parseCyclicValue(axisYValues, axisYMaxValue);
        } else {
            return parseFixedValues(axisYValues, axisYMaxValue);
        }
    };

    presenter.validateBarsWidth = function (model) {
        var barsWidth = model["Bars width"].trim();

        if (ModelValidationUtils.isStringEmpty(barsWidth)) {
            return {isValid: true, value: 1};
        }

        var parsedBarsWidth = parseFloat(barsWidth);

        if (isNaN(parsedBarsWidth)) {
            return presenter.getErrorObject("BW_02");
        }

        if (parsedBarsWidth < 0) {
            return presenter.getErrorObject("BW_01");
        }

        if (parsedBarsWidth >= 0 && parsedBarsWidth <= 1) {
            return {isValid: true, value: 1};
        }

        return {isValid: true, value: parsedBarsWidth};
    };

    function validateRGBColor (color, errorCode) {
        if (color.charAt(0) == "#") {
            if (!presenter.isRGB(color)) {
                return presenter.getErrorObject(errorCode);
            }
        }

        return {isValid: true, value: color}
    }

    presenter.validateBackgroundColor = function (model) {
        var backgroundColor = model["Background color"].trim();
        var validatedRGB = validateRGBColor(backgroundColor, "BC_01");

        return setDefaultColorToValidatedRGB(validatedRGB, "#F5F5DC");
    };

    presenter.validateGridLineColor = function (model) {
        var gridLineColor = model["Grid line color"].trim();
        var validatedRGB = validateRGBColor(gridLineColor, "GLC_01");

        return setDefaultColorToValidatedRGB(validatedRGB, "black");
    };

    function setDefaultColorToValidatedRGB (validatedRGB, color) {
        if (validatedRGB.isValid) {
            if (ModelValidationUtils.isStringEmpty(validatedRGB.value)) {
                validatedRGB.value = color;
            }
        }

        return validatedRGB;
    }

    presenter.validateBorder = function (model) {
        var parsedBorder = parseFloat(model["Border"].trim());

        if (isNaN(parsedBorder)) {
            return {isValid: true, value: 0};
        }

        if (parsedBorder < 0) {
            return {isValid: true, value: 0};
        }

        return {isValid: true, value: parsedBorder};
    };


    function getAttributeValueFromObject (element) {
        //function for map, requires passed object to thisArg {"attribute": "attributeString"}
        return element[this.attribute];
    }

    function isEmptyStringInValues (valuesArray) {
        var emptyStringsArray = valuesArray.map(ModelValidationUtils.isStringEmpty).filter(function (element) {
            return element;
        });

        return (emptyStringsArray.length > 0)
    }

    presenter.validateAxisXData = function (model, axisYMaximumValue) {
        var axisXData = model["X axis data"];

        var answers = axisXData.map(getAttributeValueFromObject, {attribute: "Answer"});
        var colors = axisXData.map(getAttributeValueFromObject, {attribute: "Color"});
        var descriptions = axisXData.map(getAttributeValueFromObject, {attribute: "Description"});
        var descriptionsImages = axisXData.map(getAttributeValueFromObject, {attribute: "Description image"});
        var examples = axisXData.map(getAttributeValueFromObject, {attribute: "Example"});

        if (isEmptyStringInValues(answers)) {
            return presenter.getErrorObject("AXD_01");
        }

        var parsedAnswers = answers.map(function (element) {
            return Number(element);
        });

        if (!parsedAnswers.every(isValueNumber)) {
            return presenter.getErrorObject("AXD_02");
        }

        var wasFloat = presenter.isFloatInValues(parsedAnswers);
        var areValuesInScope = parsedAnswers.every(isValuePositive) && parsedAnswers.every(isInAxisRange, axisYMaximumValue);

        var answersParsedToInt = parsedAnswers.map(parseValueToInt);
        var examplesParsedToBool = examples.map(parseValueToBoolean);

        return {
            isValid: true,
            wasFloat: wasFloat,
            answersBeyondAxisRange: !areValuesInScope,
            answers: answersParsedToInt,
            colors: colors,
            descriptions: descriptions,
            descriptionsImages: descriptionsImages,
            columnsNumber: answersParsedToInt.length,
            examples: examplesParsedToBool
        };
    };

    function deleteCommands () {
        delete presenter.getMaxScore;
        delete presenter.getScore;
        delete presenter.setState;
        delete presenter.getState;
        delete presenter.setWorkMode;
        delete presenter.setShowErrorsMode;
        delete presenter.reset;
    }

    presenter.upgradeModel = function(model) {
        return presenter.upgradeExample(model);
    }

    presenter.upgradeExample = function(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (upgradedModel['X axis data'] === undefined) {
            upgradedModel['X axis data'] = [];
        }

        for (var i = 0; i < upgradedModel['X axis data'].length; i++) {
            var axisXData = upgradedModel['X axis data'][i];
            if (axisXData['Example'] === undefined) {
                axisXData['Example'] = 'False';
            }
        }

        return upgradedModel;
    }

    presenter.runLogic = function (view, model, isPreview) {
        presenter.$view = $(view);
        var upgradedModel = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(upgradedModel);

        if (!presenter.configuration.isValid) {
            presenter.showErrorMessage(presenter.ERROR_MESSAGES[presenter.configuration.errorCode]);
            deleteCommands();
            return;
        }

        presenter.$view.find("div").attr('id', presenter.configuration.ID);
        presenter.setVisibility(presenter.configuration.isVisible || isPreview);


        presenter.observer = new presenter.graphObserver();

        if(!isPreview) {
            initializeGraphFromConfiguration();
        } else {
            initializeGraphFromConfiguration();
            presenter.graph.block();
        }
    };

    function initializeGraphFromConfiguration() {
        presenter.graph = new presenter.graphObject(
            presenter.$view,
            presenter.configuration.axisYMaximumValue,
            presenter.configuration.answers,
            presenter.configuration.columnsColors,
            presenter.configuration.columnsDescriptions,
            presenter.configuration.columnsDescriptionsImages,
            presenter.configuration.barsWidth,
            presenter.configuration.backgroundColor,
            presenter.configuration.gridLineColor,
            presenter.configuration.axisYValues.cyclicValue,
            presenter.configuration.axisYValues.fixedValues,
            30,
            presenter.configuration.border,
            presenter.configuration.axisYDescription,
            presenter.configuration.axisXDescription,
            presenter.configuration.exampleColumns
        );

        presenter.graph.initializeGraph();
    }

    presenter.setPlayerController = function (controller) {
        presenter.eventBus = controller.getEventBus();
    };

    presenter.sendEvent = function (isCorrect, column, change) {
        presenter.eventBus.sendEvent('ValueChanged', {
            'source': presenter.configuration.ID,
            'item': (column + 1) + (change === "noChange" ? "" : " " + change),
            'value': '',
            'score': isCorrect ? '1' : '0'
        });
    };

    presenter.sendEventAllOk = function () {
        presenter.eventBus.sendEvent('ValueChanged', {
            'source': presenter.configuration.ID,
            'item': 'all',
            'value': '',
            'score': ''
        });
    };

    presenter.isAllOk = function () {
        return (presenter.getScore() == presenter.getMaxScore());
    };

    presenter.onEventReceived = function (eventName, data) {
        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        }

        if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        }

        if (eventName == "GradualShowAnswers" && data["moduleID"] === presenter.configuration.ID) {
            if (!isNaN(data["item"])) {
                var item = Number(data["item"]);
                presenter.gradualShowAnswers(item);
            }
        }

        if (eventName == "GradualHideAnswers") {
            presenter.hideAnswers();
        }
    };

    presenter.getActivitiesCount = function () {
        return presenter.graph.getActivitiesCount();
    }

    presenter.setVisibility = function (isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.executeCommand = function (name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'getValue': presenter.getValue,
            'showAnswers' : presenter.showAnswers,
            'hideAnswers' : presenter.hideAnswers
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
    };

    presenter.show = function () {
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
    };

    presenter.showAnswers = function () {
        if (presenter.configuration.isNotActivity) return;

        if (presenter.errorMode) {
            presenter.graph.setWorkMode();
            presenter.errorMode = false;
        }

        presenter.graph.block();
        presenter.graph.showAnswers();
        presenter.isShowAnswersActive = true;
    };

    presenter.gradualShowAnswers = function(item) {
        if (presenter.configuration.isNotActivity) return;

        if (presenter.errorMode) {
            presenter.graph.setWorkMode();
            presenter.errorMode = false;
        }

        presenter.graph.block();
        presenter.graph.gradualShowAnswers(item);
        presenter.isShowAnswersActive = true;
    }

    presenter.hideAnswers = function () {
        if (presenter.configuration.isNotActivity || !presenter.isShowAnswersActive) {
            return;
        }

        presenter.graph.unblock();
        presenter.graph.hideAnswers();
        presenter.isShowAnswersActive = false;
    };

    presenter.reset = function () {
        presenter.graph.setWorkMode();
        presenter.graph.reset();
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);
        presenter.graph.unblock();
    };

    presenter.getMaxScore = function () {
        if (presenter.configuration.isNotActivity) return 0;

        return presenter.graph.getMaxScore();
    };

    presenter.getScore = function () {
        if (presenter.configuration.isNotActivity) return 0;

        return presenter.graph.getScore();
    };

    presenter.graphObject.prototype.isAttempted = function () {
        return !this._columns.every(function(column) {
            return column.getState() == 0;
        });
    };

    presenter.getErrorCount = function () {
        if (presenter.configuration.isNotActivity) return 0;

        return presenter.graph.getErrorCount();
    };

    presenter.setShowErrorsMode = function () {
        if (presenter.configuration.isNotActivity) return;

        if(presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        presenter.graph.block();
        presenter.graph.setShowErrorsMode();
        presenter.errorMode = true;

        return false;
    };

    presenter.setWorkMode = function () {
        if (presenter.configuration.isNotActivity) return;

        if(presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        presenter.graph.unblock();
        presenter.graph.setWorkMode();
        presenter.errorMode = false;

        return false;
    };

    presenter.getState = function () {
        if(presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        var selected = presenter.graph.getState();

        return JSON.stringify({
            selected: selected,
            isVisible: presenter.configuration.isVisible
        });
    };

    presenter.setState = function (stateString) {
        if(!stateString) return;

        var state = JSON.parse(stateString);

        if(presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        presenter.configuration.isVisible = state.isVisible;
        presenter.graph.setState(state.selected);
        presenter.setVisibility(state.isVisible);
    };

    return presenter;
}