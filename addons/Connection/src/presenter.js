function AddonConnection_create() {
    var presenter = function () {
    };

    var playerController;
    var eventBus; // Modules communication
    var addonID;

    presenter.uniqueIDs = [];
    presenter.uniqueElementLeft = [];
    presenter.uniqueElementRight = [];
    presenter.elements = [];
    presenter.lastClickTime = 0;
    presenter.lastEvent = null;

    var connections;
    var singleMode = false;
    var selectedItem = null;
    var isNotActivity = false;

    presenter.lineStack = new LineStack(true);
    presenter.correctConnections = new LineStack(false);
    var isSelectionPossible = true;
    var isRTL = false;

    var connectionColor = "#000";
    var correctConnection = "#0d0";
    var incorrectConnection = "#d00";
    var connectionThickness = "1px";
    var showAnswersColor = "#0d0";

    presenter.ERROR_MESSAGES = {
        'ID not unique': 'One or more IDs are not unique.'
    };

    presenter.ELEMENT_SIDE = {
        LEFT: 0,
        RIGHT: 1
    };

    presenter.upgradeModel = function (model) {
        return presenter.upgradeFrom_01(model);
    };

    presenter.upgradeFrom_01 = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (!upgradedModel["Columns width"]) {
            upgradedModel["Columns width"] = [
                {
                    left: "",
                    middle: "",
                    right: ""
                }
            ];
        }

        return upgradedModel;
    };

    function LineStack(sendEvents) {
        this.stack = [];
        this.ids = [];
        this.sendEvents = sendEvents;

        this.setSendEvents = function (value) {
            this.sendEvents = value;
        };

        this.push = function (line) {
            var pair = [], score, i;
            for (i = 0; i < presenter.elements.length; i++) {
                if (presenter.elements[i].element.get(0) == line.from.get(0) || presenter.elements[i].element.get(0) == line.to.get(0)) {
                    pair.push(presenter.elements[i].id);
                    if (pair.length == 2) {
                        break;
                    }
                }
            }
            this.ids.push(pair);
            this.stack.push(line);

            if (this.sendEvents) {
                score = presenter.correctConnections.hasLine(line).length > 0 ? 1 : 0;
                presenter.sendEvent(pair[0], pair[1], 1, score);
            }
        };

        this.length = function () {
            return this.stack.length;
        };

        this.get = function (i) {
            return this.stack[i];
        };

        this.remove = function (line) {
            function getID(element) {
                // innerWrapper -> td -> tr -> tbody -> table (which has id attribute)
                var rawID = $(element).find('.innerWrapper').parent().parent().parent().parent().attr('id');

                return rawID.split('connection-')[1];
            }

            var linePosition = this.stack.indexOf(line);
            this.stack.splice(linePosition, 1);
            var lineFromID = getID(line.from);
            var lineToID = getID(line.to);
            var pair = [lineFromID, lineToID];
            var score;

            for (var i = 0; i < this.ids.length; i++) {
                if ((this.ids[i][0] == pair[0] && this.ids[i][1] == pair[1]) ||
                    (this.ids[i][0] == pair[1] && this.ids[i][1] == pair[0])) {
                    this.ids.splice(i, 1);

                    break;
                }
            }

            if (this.sendEvents) {
                score = presenter.correctConnections.hasLine(line).length > 0 ? 1 : 0;
                presenter.sendEvent(pair[0], pair[1], 0, score);
            }
        };

        this.clear = function () {
            this.ids.splice(0, this.ids.length);
            this.stack.splice(0, this.stack.length);
        };

        this.hasLine = function (line) {
            for (var i = 0, stackLength = this.stack.length; i < stackLength; i++) {
                if ((this.stack[i].from.get(0) == line.from.get(0) && this.stack[i].to.get(0) == line.to.get(0)) ||
                    (this.stack[i].from.get(0) == line.to.get(0) && this.stack[i].to.get(0) == line.from.get(0))) {
                    return [this.stack[i]];
                }
            }
            return [];
        };

        this.hasPair = function (pair) {
            for (var i = 0; i < this.ids.length; i++) {
                if (this.ids[i][0] == pair[0] && this.ids[i][1] == pair[1] ||
                    this.ids[i][1] == pair[0] && this.ids[i][0] == pair[1]) {
                    return true;
                }
            }
            return false;
        };

        this.isItemUsed = function (line) {
            var lines = [];
            for (var i = 0; i < this.stack.length; i++) {
                if ((this.stack[i].from.get(0) == line.from.get(0) || this.stack[i].to.get(0) == line.to.get(0)) ||
                    (this.stack[i].from.get(0) == line.to.get(0) || this.stack[i].to.get(0) == line.from.get(0))) {
                    lines.push(this.stack[i])
                }
            }
            return lines;
        }
    }

    function Line(from, to) {
        this.from = from;
        this.to = to;

        this.connects = function (element) {
            return from.get(0) == element.get(0) || to.get(0) == element.get(0);
        };

        this.otherSide = function (element) {
            if (from.get(0) == element.get(0)) {
                return to;
            }
            return from;
        }
    }

    presenter.parseDefinitionLinks = function () {
        $.each($(presenter.view).find('.innerWrapper'), function (index, element) {
            $(element).html(presenter.textParser.parse($(element).html()));
        });

        presenter.textParser.connectLinks($(presenter.view));
    };

    presenter.setPlayerController = function (controller) {
        var mathJaxDeferred = new jQuery.Deferred();
        presenter.mathJaxProcessEndedDeferred = mathJaxDeferred;
        presenter.mathJaxProcessEnded = mathJaxDeferred.promise();

        MathJax.Hub.Register.MessageHook("End Process", function (message) {
            if ($(message[1]).hasClass('ic_page')) {
                presenter.mathJaxProcessEndedDeferred.resolve();
            }
        });

        playerController = controller;

        presenter.textParser = new TextParserProxy(controller.getTextParser());
    };

    presenter.setColumnsWidth = function (view, columnsWidth) {
        var leftColumn = $(view).find(".connectionLeftColumn:first");
        var middleColumn = $(view).find(".connectionMiddleColumn:first");
        var rightColumn = $(view).find(".connectionRightColumn:first");

        var leftWidth = columnsWidth[0].left;
        var middleWidth = columnsWidth[0].middle;
        var rightWidth = columnsWidth[0].right;

        if (!leftWidth)
            leftWidth = "auto";
        if (!middleWidth)
            middleWidth = "auto";
        if (!rightWidth)
            rightWidth = "auto";

        $(leftColumn).css('width', leftWidth);
        $(middleColumn).css('width', middleWidth);
        $(rightColumn).css('width', rightWidth);
    };

    presenter.run = function (view, model) {
        presenter.view = view;
        presenter.model = model;
        eventBus = playerController.getEventBus();
        addonID = model.ID;

        presenter.initialize(presenter.view, presenter.model, false);
        presenter.registerListeners(presenter.view);

        presenter.parseDefinitionLinks();

        eventBus.addEventListener('ShowAnswers', this);
        eventBus.addEventListener('HideAnswers', this);
    };

    presenter.createPreview = function (view, model) {
        presenter.view = view;
        presenter.model = model;
        presenter.initialize(presenter.view, presenter.model, true);
    };

    presenter.initialize = function (view, model, isPreview) {
        if (isPreview) {
            presenter.lineStack = new LineStack(false);
        }
        isRTL = $(view).css('direction').toLowerCase() === 'rtl';
        connections = $(view).find('.connections:first');

        model = presenter.upgradeModel(model);

        this.setSingleMode(model['Single connection mode']);

        var isRandomLeft = ModelValidationUtils.validateBoolean(model['Random order left column']);
        var isRandomRight = ModelValidationUtils.validateBoolean(model['Random order right column']);

        if(!isPreview){
            if(!isRandomLeft){
                this.loadElements(view, model, 'connectionLeftColumn', 'Left column', false);
            }else{
                this.loadRandomElementsLeft(view, model, 'connectionLeftColumn', 'Left column', false);
            }

            if(!isRandomRight){
                this.loadElements(view, model, 'connectionRightColumn', 'Right column', true);
            }else{
                this.loadRandomElementsRight(view, model, 'connectionRightColumn', 'Right column', true);
            }
        }else{
            this.loadElements(view, model, 'connectionLeftColumn', 'Left column', false);
            this.loadElements(view, model, 'connectionRightColumn', 'Right column', true);
        }

        this.setColumnsWidth(view, model["Columns width"]);

        if (model['Connection thickness'] != '') {
            connectionThickness = model['Connection thickness'];
        }
        if (model['Default connection color'] != '') {
            connectionColor = model['Default connection color'];
        }
        if (model['Correct connection color'] != '') {
            correctConnection = model['Correct connection color'];
        }
        if (model['Incorrect connection color'] != '') {
            incorrectConnection = model['Incorrect connection color'];
        }
        if (model['Show answers line color'] != '') {
            showAnswersColor = model['Show answers line color'];
        }

        if (model['isNotActivity'] != undefined){
            isNotActivity = (model['isNotActivity'].toLowerCase() === 'true');
        }
        else {
            isNotActivity = false;
        }

        if (isPreview) {
            presenter.initializeView(view, model);
            presenter.drawConfiguredConnections();
        } else {
            presenter.mathJaxProcessEnded.then(function () {
                presenter.initializeView(view, model);
            });
        }

        this.gatherCorrectConnections();
    };

    function getElementById(id) {
        for (var i = 0; i < presenter.elements.length; i++) {
            if (presenter.elements[i].id == id) {
                return presenter.elements[i].element;
            }
        }
        return -1;
    }

    presenter.establishElementSide = function (elementID, modelLeftSide, modelRightSide) {
        var i, arrayLength;

        for (i = 0, arrayLength = modelLeftSide.length; i < arrayLength; i += 1) {
            if (modelLeftSide[i].id === elementID) {
                return presenter.ELEMENT_SIDE.LEFT;
            }
        }

        for (i = 0, arrayLength = modelRightSide.length; i < arrayLength; i += 1) {
            if (modelRightSide[i].id === elementID) {
                return presenter.ELEMENT_SIDE.RIGHT;
            }
        }
    };

    presenter.createEventData = function (source, elementFromID, elementToID, model, value, score) {
        var leftColumn = model["Left column"];
        var rightColumn = model["Right column"];

        var fromElementSide = presenter.establishElementSide(elementFromID, leftColumn, rightColumn);
        var itemStr = "";
        switch (fromElementSide) {
            case presenter.ELEMENT_SIDE.LEFT:
                itemStr = elementFromID + '-' + elementToID;
                break;
            case presenter.ELEMENT_SIDE.RIGHT:
                itemStr = elementToID + '-' + elementFromID;
                break;
        }

        return {
            'source': source,
            'item': itemStr,
            'value': value.toString(),
            'score': score.toString()
        };
    };

    presenter.sendEvent = function (fromID, toID, value, score) {
    	if(!presenter.isShowAnswersActive) {
        var eventData = presenter.createEventData(addonID, fromID, toID, presenter.model, value, score);
        eventBus.sendEvent('ValueChanged', eventData);
            if (presenter.isAllOK()) sendAllOKEvent();
        }
    };

    function sendAllOKEvent() {
        var eventData = {
            'source': addonID,
            'item': 'all',
            'value': '',
            'score': ''
        };

        eventBus.sendEvent('ValueChanged', eventData);
    }

    function clickLogic(element) {
        // workaround for android webView
        // http://code.google.com/p/android/issues/detail?id=38808
        var current = new Date().getTime();
        var delta = current - presenter.lastClickTime;
        if (!isSelectionPossible || delta < 50) return;
        presenter.lastClickTime = current;
        if (!$(element).hasClass('selected') && selectedItem == null) {
            // zaznaczony pierwszy element
            $(element).parent().find('.connectionItem').removeClass('selected');
            $(element).addClass('selected');
            selectedItem = $(element);
            return;
        }
        if (selectedItem != null && $(element).get(0) == selectedItem.get(0)) {
            // ponownie kliknięty już zaznaczony element
            $(element).removeClass('selected');
            selectedItem = null;
            return;
        }
        if (selectedItem != null &&
            ($(element).parents('.connectionLeftColumn').get(0) == selectedItem.parents('.connectionLeftColumn').get(0) ||
                $(element).parents('.connectionRightColumn').get(0) == selectedItem.parents('.connectionRightColumn').get(0))) {
            // kliknięty element w tej samej kolumnie
            var linesToSwitch = [];
            if (singleMode) {
                for (var i = 0; i < presenter.lineStack.length(); i++) {
                    if (presenter.lineStack.get(i).connects(selectedItem)) {
                        linesToSwitch.push(presenter.lineStack.get(i))
                    }
                }
            }

            selectedItem.removeClass('selected');
            if (linesToSwitch.length == 0) {
                $(element).addClass('selected');
                selectedItem = $(element);
                return;
            } else {
                for (i in linesToSwitch) {
                    presenter.lineStack.remove(linesToSwitch[i]);
                    pushConnection(new Line($(element), linesToSwitch[i].otherSide(selectedItem)), false);
                }
            }
        } else {
            var line = new Line($(element), selectedItem);
            var shouldDraw = true;

            if (singleMode) {
                var usedInLines = presenter.lineStack.isItemUsed(line);
                if (usedInLines.length == 2) {
                    shouldDraw = false
                }
            }
            if (shouldDraw) {
                pushConnection(line, false);
            }
        }

        redraw();
        selectedItem.removeClass('selected');
        selectedItem = null;
    }

    presenter.registerListeners = function (view) {

        presenter.$connectionContainer = $(view).find('.connectionContainer');
        presenter.$leftColumn = $(view).find('connectionLeftColumn');
        presenter.$rightColumn = $(view).find('connectionRightColumn');

        presenter.$connectionContainer.click(function (e){
            e.preventDefault();
            e.stopPropagation();
        });

        presenter.$leftColumn.click(function (e){
            e.preventDefault();
            e.stopPropagation();
        });

        presenter.$rightColumn.click(function (e){
            e.preventDefault();
            e.stopPropagation();
        });

        var element = $(view).find('.connectionItem');

        element.on('touchstart', function (e) {
            e.preventDefault();
            e.stopPropagation();
            presenter.lastEvent = e;
        });

        element.on('touchend', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (presenter.lastEvent.type != e.type) {
                presenter.isClicked = false;
                clickLogic(this);
                presenter.isClicked = true;
            }
        });

        element.on('mouseleave', function (e) {
            e.stopPropagation();
        });

        element.on('mouseenter', function (e) {
            e.stopPropagation();
        });

        element.on('mouseup', function (e) {
            e.stopPropagation();
        });

        element.on('mousedown', function (e) {
            e.stopPropagation();
        });

        element.on('mouseover', function (e) {
            e.stopPropagation();
        });

        element.on('mouseout', function (e) {
            e.stopPropagation();
        });

        element.click(function (e) {
            e.stopPropagation();
            if(!presenter.isClicked){
                clickLogic(this);
            }
        });

    };

    presenter.setSingleMode = function (singleModeString) {
        singleMode = (singleModeString.toLowerCase() === 'true')
    };

    presenter.addClassToElement = function (element, additionalClass) {
        if (additionalClass) {
            $(element).addClass(additionalClass);
        }

        return element;
    };

    presenter.loadElements = function (view, model, columnClass, columnModel, isRightColumn) {
        var column = $(view).find('.' + columnClass + ':first').find('.content:first');
        for (var i = 0, columnLength = model[columnModel].length; i < columnLength; i++) {
            presenter.appendElements(i, model, columnModel, column, isRightColumn);
        }
    };

    presenter.isIDUnique = function (id) {
        if (id == '') return true;
        if ($.inArray(id, presenter.uniqueIDs) < 0) {
            presenter.uniqueIDs.push(id);
            return true;
        } else {
            return false;
        }
    };

    presenter.appendElements = function (i, model, columnModel, column, isRightColumn) {
        var id = model[columnModel][i]['id'];
        if (!this.isIDUnique(id)) {
            return $(this.view).html(this.ERROR_MESSAGES['ID not unique']);
        }
        var element = $('<table class="connectionItem" id="connection-' + id + '"></div>');
        var row = $('<tr></tr>');
        element.append(row);
        var innerElement = $('<td class="inner"></td>');
        var innerWrapper = $('<div class="innerWrapper"></div>');
        innerWrapper = presenter.addClassToElement(innerWrapper, model[columnModel][i]['additional class']);
        $(innerWrapper).css('direction', isRTL ? 'rtl' : 'ltr');
        innerWrapper.html(model[columnModel][i]['content']);
        innerElement.append(innerWrapper);
        var iconElement = $('<td class="icon"></td>');
        var iconWrapper = $('<div class="iconWrapper"></div>');
        iconElement.append(iconWrapper);
        if (isRightColumn) {
            row.append(iconElement);
            row.append(innerElement);
        } else {
            row.append(innerElement);
            row.append(iconElement);
        }
        presenter.elements.push({
            element: element,
            id: id,
            connects: model[columnModel][i]['connects to']
        });
        var newRow = $('<tr></tr>');
        var newCell = $('<td class="connectionItemWrapper"></td>');
        newCell.append(element);
        newRow.append(newCell);
        column.append(newRow);
    };

    presenter.loadRandomElementsLeft = function (view, model, columnClass, columnModel, isRightColumn) {
        var column = $(view).find('.' + columnClass + ':first').find('.content:first');
        var elementCounterLeft = 0;
        var columnLength = model[columnModel].length;
        while (elementCounterLeft < model[columnModel].length) {
            var i = Math.floor((Math.random() * columnLength));
            if (presenter.isElementLeftUnique(i)){
                presenter.appendElements(i, model, columnModel, column, isRightColumn);
                elementCounterLeft++;
            }
        }
    };

    presenter.loadRandomElementsRight = function (view, model, columnClass, columnModel, isRightColumn) {
        var column = $(view).find('.' + columnClass + ':first').find('.content:first');
        var elementCounterRight = 0;
        var columnLength = model[columnModel].length;
        while (elementCounterRight < model[columnModel].length) {
            var i = Math.floor((Math.random() * columnLength));
            if (presenter.isElementRightUnique(i)){
                presenter.appendElements(i, model, columnModel, column, isRightColumn);
                elementCounterRight++;
            }
        }
    };

    presenter.isElementLeftUnique = function (element) {
        var isElement = false;
        for (var i=0; i<presenter.uniqueElementLeft.length; i++){
            if(presenter.uniqueElementLeft[i] == element){
              isElement = true;
            }
        }
        if(isElement){
            return false;
        }else{
            presenter.uniqueElementLeft.push(element);
            return true;
        }
    };

    presenter.isElementRightUnique = function (element) {
        var isElement = false;
        for (var i=0; i<presenter.uniqueElementRight.length; i++){
            if(presenter.uniqueElementRight[i] == element){
                isElement = true;
            }
        }
        if(isElement){
            return false;
        }else{
            presenter.uniqueElementRight.push(element);
            return true;
        }
    };

    presenter.initializeView = function (view, model) {
        var leftColumnHeight = $(view).find('.connectionLeftColumn:first').outerHeight();
        var rightColumnHeight = $(view).find('.connectionRightColumn:first').outerHeight();
        var height = leftColumnHeight > rightColumnHeight ? leftColumnHeight : rightColumnHeight;
        var leftColumnWidth = $(view).find('.connectionLeftColumn:first').outerWidth(true);
        var rightColumnWidth = $(view).find('.connectionRightColumn:first').outerWidth(true);
        var width = model['Width'] - leftColumnWidth - rightColumnWidth;

        presenter.height = height;
        presenter.width = width;

        var context = connections[0].getContext('2d');
        context.canvas.width = width;
        context.canvas.height = height;
        connections.css({
            width: width + 'px',
            height: height + 'px'
        });
        connections.translateCanvas({
            x: 0.5, y: 0.5
        });
    };

    presenter.gatherCorrectConnections = function () {
        presenter.correctConnections.clear();
        var elements = presenter.elements;
        for (var i = 0, elementsLength = elements.length; i < elementsLength; i++) {
            var connects = elements[i]['connects'].split(',');
            for (var j = 0; j < connects.length; j++) {
                if (connects[j] != "" &&
                    $.inArray(connects[j], presenter.uniqueIDs) >= 0) {
                    var pair = [elements[i]['id'], connects[j]];
                    var line = new Line(
                        getElementById(pair[0]),
                        getElementById(pair[1])
                    );
                   if (!presenter.correctConnections.hasPair(pair)) {
                        presenter.correctConnections.push(line);
                    }
                }
            }
        }
    };

    presenter.drawConfiguredConnections = function () {
        for (var i = 0; i < presenter.correctConnections.length(); i++) {
            pushConnection(presenter.correctConnections.get(i), true)
        }
        redraw();
    };

    function getElementSnapPoint(element) {
        var offset = element.offset();
        var snapPoint = [0, 0];
        if (element.parents('.connectionLeftColumn').length > 0) {
            snapPoint = [offset.left + element.outerWidth(true), offset.top + element.outerHeight() / 2]
        }
        if (element.parents('.connectionRightColumn').length > 0) {
            snapPoint = [offset.left, offset.top + element.outerHeight() / 2]
        }
        return snapPoint
    }

    function pushConnection(line, isPreview) {
        var addLine = true, linesToRemove = [], existingLines;
        if (singleMode) {
            existingLines = presenter.lineStack.isItemUsed(line);
            if (existingLines.length > 0) {
                if (!isPreview) {
                    linesToRemove.push.apply(linesToRemove, existingLines)
                }
                if (presenter.lineStack.hasLine(line).length > 0) {
                    addLine = false
                }
            }
        } else {
            existingLines = presenter.lineStack.hasLine(line);
            if (existingLines.length > 0) {
                if (!isPreview) {
                    linesToRemove.push.apply(linesToRemove, existingLines);
                }
                addLine = false;
            }
        }
        for (var i = 0; i < linesToRemove.length; i++) {
            presenter.lineStack.remove(linesToRemove[i]);
        }
        if (addLine) {
            presenter.lineStack.push(line);
        }
    }

    function redraw() {
        connections.width = connections.width;

        var android_ver = MobileUtils.getAndroidVersion(window.navigator.userAgent);
        if (["4.1.1", "4.1.2", "4.2.2", "4.3", "4.4.2"].indexOf(android_ver) !== -1) {
            $(presenter.view).find('.connections').remove();
            var canvas2 = $('<canvas></canvas>');
            canvas2.addClass('connections');
            $(presenter.view).find('.connectionMiddleColumn').append(canvas2);

            var context = canvas2[0].getContext('2d');
            context.canvas.width = presenter.width;
            context.canvas.height = presenter.height;
            canvas2.css({
                width: presenter.width + 'px',
                height: presenter.height + 'px'
            });
            canvas2.translateCanvas({
                x: 0.5, y: 0.5
            });

            connections = $(presenter.view).find('.connections');
        }else{
            connections.clearCanvas();
        }

        for (var i = 0; i < presenter.lineStack.length(); i++) {
            drawLine(presenter.lineStack.get(i), connectionColor)
        }
    }

    function redrawShowAnswers () {
        connections.width = connections.width;
        connections.clearCanvas();
        for (var i = 0; i < presenter.lineStack.length(); i++) {
            drawLine(presenter.lineStack.get(i), showAnswersColor)
        }
    }

    function drawLine(line, color) {
        connections.width = connections.width;
        var from = getElementSnapPoint(line.from);
        var to = getElementSnapPoint(line.to);
        var canvasOffset = connections.offset();
        connections.drawLine({
            strokeStyle: color,
            strokeWidth: connectionThickness,
            x1: to[0] - canvasOffset.left, y1: to[1] - canvasOffset.top,
            x2: from[0] - canvasOffset.left, y2: from[1] - canvasOffset.top
        });
    }

    presenter.setShowErrorsMode = function () {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        if (isNotActivity) return 0;

        connections.width = connections.width;
        connections.clearCanvas();
        for (var i = 0; i < presenter.lineStack.length(); i++) {
            var line = presenter.lineStack.get(i);
            if (presenter.correctConnections.hasLine(line).length > 0) {
                drawLine(presenter.lineStack.get(i), correctConnection);
            } else {
                drawLine(presenter.lineStack.get(i), incorrectConnection);
            }
        }
        presenter.$connectionContainer.find('.selected').removeClass('selected');
        selectedItem = null;
        isSelectionPossible = false;
    };

    presenter.setWorkMode = function () {
        presenter.gatherCorrectConnections();
        redraw();
        isSelectionPossible = true;
    };

    presenter.reset = function () {
        presenter.lineStack.clear();
        isSelectionPossible = true;
        presenter.$connectionContainer.find('.selected').removeClass('selected');

        redraw();
    };

    presenter.getErrorCount = function () {
        if (isNotActivity) return 0;

        var errors = 0;
        for (var i = 0; i < presenter.lineStack.length(); i++) {
            var line = presenter.lineStack.get(i);
            if (presenter.correctConnections.hasLine(line).length == 0) {
                errors++;
            }
        }
        return errors;
    };

    presenter.getMaxScore = function () {
        if (isNotActivity) return 0;

        return presenter.correctConnections.length();
    };

    presenter.getScore = function () {
        if (isNotActivity) return 0;

        var score = 0;
        for (var i = 0; i < presenter.lineStack.length(); i++) {
            var line = presenter.lineStack.get(i);
            if (presenter.correctConnections.hasLine(line).length > 0) {
                score++;
            }
        }
        return score;
    };

    presenter.getState = function () {
        var id = [];
        for (var i = 0; i < presenter.lineStack.ids.length; i++) {
            id.push(presenter.lineStack.ids[i].join(':'))
        }
        return JSON.stringify(id);
    };

    presenter.setState = function (state) {
        var hookExecuted = false;

        presenter.mathJaxProcessEnded.then(function () {
            if (state != '' && !hookExecuted) {
                presenter.lineStack.setSendEvents(false);

                var id = JSON.parse(state);
                for (var i = 0; i < id.length; i++) {
                    var pair = id[i].split(':');
                    pushConnection(new Line(getElementById(pair[0]), getElementById(pair[1])), false);
                }

                presenter.lineStack.setSendEvents(true);
                redraw();
            }

            hookExecuted = true;
        });
    };

    presenter.validateAdditionalClass = function (view, additionalClass) {
        var additionalClassElements = $(view).find('.' + additionalClass);
        var isAdditionalClass = $(view).find('.' + additionalClass).length > 0;

        if (!isAdditionalClass) {
            return { isPresent: false, count: 0 };
        }

        return { isPresent: true, count: additionalClassElements.length };
    };

    presenter.validateView = function (view, searchingKeyword) {
        var validatedAdditionalClass = presenter.validateAdditionalClass(view, searchingKeyword);
        if (!validatedAdditionalClass.isPresent) {
            return { isPresent: false, count: validatedAdditionalClass.count };
        }
        return { isPresent: true, count: validatedAdditionalClass.count };
    };

    presenter.getElementById = function (id) {
        return getElementById(id);
    };

    presenter.isAllOK = function () {
        return presenter.getMaxScore() === presenter.getScore() && presenter.getErrorCount() === 0;
    };

    presenter.isSelected = function (leftIndex, rightIndex) {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        var leftElement = getElementById(leftIndex);
        var rightElement = getElementById(rightIndex);
        var line = new Line(leftElement, rightElement);
        return (presenter.lineStack.hasLine(line).length > 0);
    };

    presenter.isAttempted = function () {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        return (presenter.lineStack.stack.length > 0)
    };


    presenter.markAsCorrect = function (leftIndex, rightIndex) {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        var leftElement = getElementById(leftIndex);
        var rightElement = getElementById(rightIndex);
        var line = new Line(leftElement, rightElement);
        presenter.correctConnections.push(line);
        if (presenter.lineStack.hasLine(line))
            drawLine(line, correctConnection);

    };

    presenter.markAsWrong = function (leftIndex, rightIndex) {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        var leftElement = getElementById(leftIndex);
        var rightElement = getElementById(rightIndex);
        var line = new Line(leftElement, rightElement);
        if (presenter.correctConnections.hasLine(line))
            presenter.correctConnections.remove(line);
        if (presenter.lineStack.hasLine(line))
        drawLine(line, incorrectConnection);

    };

    presenter.isSelectedCommand = function (params) {
        presenter.isSelected(params[0], params[1]);
    };

    presenter.markAsCorrectCommand = function (params) {
        presenter.markAsCorrect(params[0], params[1]);
    };

    presenter.markAsWrongCommand = function (params) {
        presenter.markAsWrong(params[0], params[1]);
    };

    presenter.isAttemptedCommand = function () {
        return presenter.isAttempted();
    };


    presenter.executeCommand = function (name, params) {
        if (!isSelectionPossible) {
            return;
        }

        var commands = {
            'isAllOK': presenter.isAllOK,
            'isSelected': presenter.isSelectedCommand,
            'markAsCorrect': presenter.markAsCorrectCommand,
            'markAsWrong': presenter.markAsWrongCommand,
            'isAttempted' : presenter.isAttemptedCommand,
            'showAnswers': presenter.showAnswers,
            'hideAnswers': presenter.hideAnswers
        };

        Commands.dispatch(commands, name, params, presenter);
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
        if (isNotActivity) {
            return;
        }

        presenter.isShowAnswersActive = true;
        presenter.tmpElements = [];
        for (var elem = 0; elem < presenter.lineStack.ids.length; elem++) {
            presenter.tmpElements.push(presenter.lineStack.ids[elem].join(':'))
        }

        presenter.lineStack.clear();
        redraw();

        var elements = presenter.elements;
        for (var i = 0, elementsLength = elements.length; i < elementsLength; i++) {
            var connects = elements[i]['connects'].split(',');
            for (var j = 0; j < connects.length; j++) {
                if (connects[j] != "" && $.inArray(connects[j], presenter.uniqueIDs) >= 0) {
                    var pair = [elements[i]['id'], connects[j]];
                    var line = new Line(
                        getElementById(pair[0]),
                        getElementById(pair[1])
                    );
                    presenter.lineStack.push(line);
                }
            }
        }

        redrawShowAnswers();
        presenter.lineStack.clear();
        isSelectionPossible = false;

        for (var element = 0; element <  presenter.tmpElements.length; element++) {
            var pairs =  presenter.tmpElements[element].split(':');
            pushConnection(new Line(getElementById(pairs[0]), getElementById(pairs[1])), false);
        }
    };

    presenter.hideAnswers = function () {
        if(isNotActivity) {
            return;
        }
        redraw();
        presenter.isShowAnswersActive = false;
        isSelectionPossible = true;
    };

    return presenter;
}