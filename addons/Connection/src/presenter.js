/**
 * Model version: 2
 * Last modified: 2012-06-22 10:55
 *
 */
function AddonConnection_create(){
    var presenter = function() {};

    var isAlreadyInitialized = false;
    var playerController;
    var eventBus; // Modules communication
    var addonID;

    presenter.uniqueIDs = [];
    presenter.elements = [];

    var connections;
    var singleMode = false;
    var selectedItem = null;

    presenter.lineStack = new LineStack(true);
    presenter.correctConnections = new LineStack(false);
    var isSelectionPossible = true;
    var isRTL = false;

    var connectionColor = "#000";
    var correctConnection = "#0d0";
    var incorrectConnection = "#d00";
    var connectionThickness = "1px";

    presenter.ERROR_MESSAGES = {
        'ID not unique' : 'One or more IDs are not unique.'
    };

    presenter.upgradeModel = function(model) {
        return presenter.upgradeFrom_01(model);
    };

    presenter.upgradeFrom_01 = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (!upgradedModel["Columns width"]) {
            upgradedModel["Columns width"] = [{
                left: "",
                middle: "",
                right: ""
            }];
        }

        return upgradedModel;
    };

    function LineStack(sendEvents) {
        this.stack = [];
        this.ids = [];
        this.sendEvents = sendEvents;

        this.push = function(line) {
            var pair = [], score, i;
            for (i = 0; i < presenter.elements.length; i++) {
                if (presenter.elements[i].element.get(0) == line.from.get(0) || presenter.elements[i].element.get(0) == line.to.get(0)) {
                    pair.push(presenter.elements[i].id);
                    if(pair.length == 2) { break; }
                }
            }
            this.ids.push(pair);
            this.stack.push(line);

            if (this.sendEvents) {
                score = presenter.correctConnections.hasLine(line).length > 0 ? 1 : 0;
                sendEvent(pair[0], pair[1], 1, score);
            }
        };

        this.length = function() {
            return this.stack.length;
        };

        this.get = function(i) {
            return this.stack[i];
        };

        this.remove = function(line) {
            var linePosition = this.stack.indexOf(line);
            this.stack.splice(linePosition, 1);
            var lineFromID = $(line.from).find('.innerWrapper').html();
            var lineToID = $(line.to).find('.innerWrapper').html();
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
                sendEvent(pair[0], pair[1], 0, score);
            }
        };

        this.clear = function() {
            this.ids.splice(0, this.ids.length);
            this.stack.splice(0, this.stack.length);
        };

        this.hasLine = function(line) {
            for (var i = 0, stackLength = this.stack.length; i < stackLength; i++) {
                if ((this.stack[i].from.get(0) == line.from.get(0) && this.stack[i].to.get(0) == line.to.get(0)) ||
                    (this.stack[i].from.get(0) == line.to.get(0) && this.stack[i].to.get(0) == line.from.get(0))) {
                    return [this.stack[i]];
                }
            }
            return [];
        };

        this.hasPair = function(pair) {
            for(var i = 0; i < this.ids.length; i++) {
                if(this.ids[i][0] == pair[0] && this.ids[i][1] == pair[1] ||
                    this.ids[i][1] == pair[0] && this.ids[i][0] == pair[1]) {
                    return true;
                }
            }
            return false;
        };

        this.isItemUsed = function(line) {
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

        this.connects = function(element) {
            return from.get(0) == element.get(0) || to.get(0) == element.get(0);
        };

        this.otherSide = function(element) {
            if (from.get(0) == element.get(0)) {
                return to;
            }
            return from;
        }
    }

    presenter.setPlayerController = function(controller) {
        playerController = controller;
    };

    presenter.setColumnsWidth = function(view, columnsWidth) {
        var leftColumn = $(view).find(".connectionLeftColumn:first");
        var middleColumn = $(view).find(".connectionMiddleColumn:first");
        var rightColumn = $(view).find(".connectionRightColumn:first");

        var leftWidth = columnsWidth[0].left;
        var middleWidth = columnsWidth[0].middle;
        var rightWidth = columnsWidth[0].right;

        if(!leftWidth)
            leftWidth = "auto";
        if(!middleWidth)
            middleWidth = "auto";
        if(!rightWidth)
            rightWidth = "auto";

        $(leftColumn).css('width', leftWidth);
        $(middleColumn).css('width', middleWidth);
        $(rightColumn).css('width', rightWidth);
    };


    presenter.run = function(view, model){
        presenter.view = view;
        presenter.model = model;

        eventBus = playerController.getEventBus();
        addonID = model.ID;

        presenter.initialize(presenter.view, presenter.model, false);
        presenter.registerListeners(presenter.view);
    };

    presenter.createPreview = function(view, model) {
        presenter.view = view;
        presenter.model = model;
        presenter.initialize(presenter.view, presenter.model, true);
    };


    presenter.initialize = function(view, model, isPreview) {
        if (isPreview) {
            presenter.lineStack = new LineStack(false);
        }
        isRTL = $(view).css('direction').toLowerCase() === 'rtl';
        connections = $(view).find('.connections:first');

        model = presenter.upgradeModel(model);

        this.setSingleMode(model['Single connection mode']);
        this.loadElements(view, model, 'connectionLeftColumn', 'Left column', false);
        this.loadElements(view, model, 'connectionRightColumn', 'Right column', true);

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

        MathJax.Hub.Register.MessageHook("End Process", function(){
            if(!isAlreadyInitialized) {
                presenter.initializeView(view, model);
                if(isPreview){
                    presenter.drawConfiguredConnections();
                }
            }
            isAlreadyInitialized = true;
        });

        this.gatherCorrectConnections();
    };

    function getElementById(id) {
        for (var i = 0; i < presenter.elements.length; i++) {
            if( presenter.elements[i].id == id) {
                return presenter.elements[i].element;
            }
        }
        return -1;
    }

    presenter.ELEMENT_SIDE = {
        LEFT: 0,
        RIGHT: 1
    };

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

    presenter.createEventData = function(source, elementFromID, elementToID, model, value, score) {
        var leftColumn = model["Left column"];
        var rightColumn = model["Right column"];

        var fromElementSide = presenter.establishElementSide(elementFromID, leftColumn, rightColumn);
        var itemStr = "";
        switch(fromElementSide) {
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

    function sendEvent(fromID, toID, value, score) {
        var eventData = presenter.createEventData(addonID, fromID, toID, presenter.model, value, score);
        eventBus.sendEvent('ValueChanged', eventData);

        if (presenter.isAllOK()) sendAllOKEvent();
    }

    function sendAllOKEvent () {
        var eventData = {
            'source': addonID,
            'item': 'all',
            'value': '',
            'score': ''
        };

        eventBus.sendEvent('ValueChanged', eventData);
    }

    presenter.registerListeners = function(view) {
        presenter.$connectionContainer = $(view).find('.connectionContainer');
        $(view).find('.connectionItem').click(function () {
            if (!isSelectionPossible) return;

            if (!$(this).hasClass('selected') && selectedItem == null) {
                // zaznaczony pierwszy element
                $(this).parent().find('.connectionItem').removeClass('selected');
                $(this).addClass('selected');
                selectedItem = $(this);
                return;
            }
            if (selectedItem != null && $(this).get(0) == selectedItem.get(0)) {
                // ponownie kliknięty już zaznaczony element
                $(this).removeClass('selected');
                selectedItem = null;
                return;
            }
            if (selectedItem != null &&
                ($(this).parents('.connectionLeftColumn').get(0) == selectedItem.parents('.connectionLeftColumn').get(0) ||
                    $(this).parents('.connectionRightColumn').get(0) == selectedItem.parents('.connectionRightColumn').get(0))) {
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
                    $(this).addClass('selected');
                    selectedItem = $(this);
                    return;
                } else {
                    for (i in linesToSwitch) {
                        presenter.lineStack.remove(linesToSwitch[i]);
                        pushConnection(new Line($(this), linesToSwitch[i].otherSide(selectedItem)), false);
                    }
                }
            } else {
                var line = new Line($(this), selectedItem);
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
            selectedItem = null
        });
    };

    presenter.setSingleMode = function(singleModeString) {
        singleMode = (singleModeString.toLowerCase() === 'true')
    };

    presenter.addClassToElement = function(element, additionalClass) {
        if(additionalClass) {
            $(element).addClass(additionalClass);
        }

        return element;
    };

    presenter.loadElements = function(view, model, columnClass, columnModel, isRightColumn) {
        var column = $(view).find('.' + columnClass + ':first').find('.content:first')
        for (var i = 0, columnLength = model[columnModel].length; i < columnLength; i++) {
            var id = model[columnModel][i]['id'];
            if(!this.isIDUnique(id)) {
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
        }
    };

    presenter.isIDUnique = function(id) {
        if(id == '') return true;
        if($.inArray(id, presenter.uniqueIDs) < 0) {
            presenter.uniqueIDs.push(id);
            return true;
        } else {
            return false;
        }
    };

    presenter.initializeView = function(view, model) {
        var leftColumnHeight = $(view).find('.connectionLeftColumn:first').outerHeight();
        var rightColumnHeight = $(view).find('.connectionRightColumn:first').outerHeight();
        var height = leftColumnHeight > rightColumnHeight ? leftColumnHeight : rightColumnHeight;
        var leftColumnWidth = $(view).find('.connectionLeftColumn:first').outerWidth(true);
        var rightColumnWidth = $(view).find('.connectionRightColumn:first').outerWidth(true);
        var width = model['Width'] - leftColumnWidth - rightColumnWidth;

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

    presenter.gatherCorrectConnections = function() {
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


                    if(!presenter.correctConnections.hasPair(pair)){
                        presenter.correctConnections.push(line);
                    }
                }
            }
        }
    };

    presenter.drawConfiguredConnections = function() {
        for (var i = 0; i < presenter.correctConnections.length(); i++) {
            pushConnection(presenter.correctConnections.get(i), true)
        }
        redraw();
    };

    function getElementSnapPoint(element) {
        var offset = element.offset();
        var snapPoint = [0, 0];
        if (element.parents('.connectionLeftColumn').length > 0) {
            snapPoint = [offset.left + element.outerWidth(true), offset.top + element.outerHeight()/2]
        }
        if (element.parents('.connectionRightColumn').length > 0) {
            snapPoint = [offset.left, offset.top + element.outerHeight()/2]
        }
        return snapPoint
    }

    function pushConnection(line, isPreview) {
        var addLine = true, linesToRemove = [], existingLines;
        if (singleMode) {
            existingLines = presenter.lineStack.isItemUsed(line);
            if (existingLines.length > 0) {
                if(!isPreview) {
                    linesToRemove.push.apply(linesToRemove, existingLines)
                }
                if (presenter.lineStack.hasLine(line).length > 0) {
                    addLine = false
                }
            }
        } else {
            existingLines = presenter.lineStack.hasLine(line);
            if (existingLines.length > 0) {
                if(!isPreview) {
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
        connections.clearCanvas();
        for (var i = 0; i < presenter.lineStack.length(); i++) {
            drawLine(presenter.lineStack.get(i), connectionColor)
        }
    }

    function drawLine(line, color) {
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

    presenter.setShowErrorsMode = function(){
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

    presenter.setWorkMode = function(){
        redraw();
        isSelectionPossible = true;
    };

    presenter.reset = function(){
        presenter.lineStack.clear();
        isSelectionPossible = true;
        presenter.$connectionContainer.find('.selected').removeClass('selected');

        redraw();
    };

    presenter.getErrorCount = function(){
        var errors = 0;
        for (var i = 0; i < presenter.lineStack.length(); i++) {
            var line = presenter.lineStack.get(i);
            if (presenter.correctConnections.hasLine(line).length == 0) {
                errors++;
            }
        }
        return errors;
    };

    presenter.getMaxScore = function(){
        return presenter.correctConnections.length();
    };

    presenter.getScore = function(){
        var score = 0;
        for (var i = 0; i < presenter.lineStack.length(); i++) {
            var line = presenter.lineStack.get(i);
            if (presenter.correctConnections.hasLine(line).length > 0) {
                score++;
            }
        }
        return score;
    };

    presenter.getState = function() {
        var id = [];
        for (var i = 0; i < presenter.lineStack.ids.length; i++) {
            id.push(presenter.lineStack.ids[i].join(':'))
        }
        return JSON.stringify(id);
    };

    presenter.setState = function(state) {
        var hookExecuted = false;

        MathJax.Hub.Register.MessageHook("End Process", function(){
            if (state != '' && !hookExecuted) {
                var id = JSON.parse(state);
                for (var i = 0; i < id.length; i++) {
                    var pair = id[i].split(':');
                    pushConnection(new Line(getElementById(pair[0]), getElementById(pair[1])), false);
                }

                redraw();
            }

            hookExecuted = true;
        });
    };

    presenter.validateAdditionalClass = function(view, additionalClass) {
        var additionalClassElements = $(view).find('.' + additionalClass);
        var isAdditionalClass = $(view).find('.' + additionalClass).length > 0;

        if (!isAdditionalClass) {
            return { isPresent : false, count : 0 };
        }

        return { isPresent: true, count : additionalClassElements.length };
    };

    presenter.validateView = function(view, searchingKeyword) {
        var validatedAdditionalClass = presenter.validateAdditionalClass(view, searchingKeyword);
        if (!validatedAdditionalClass.isPresent) {
            return { isPresent: false, count: validatedAdditionalClass.count };
        }
        return { isPresent: true, count: validatedAdditionalClass.count };
    };

    presenter.getElementById = function(id) {
        return getElementById(id);
    };

    presenter.isAllOK = function () {
        return presenter.getMaxScore() === presenter.getScore() && presenter.getErrorCount() === 0;
    };

    presenter.executeCommand = function(name, params) {
        if (!isSelectionPossible) {
            return;
        }

        var commands = {
            'isAllOK': presenter.isAllOK
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    return presenter;
}