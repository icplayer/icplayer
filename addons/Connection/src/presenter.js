function AddonConnection_create() {

    function getTextVoiceObject(text, lang) {
        return {text: text, lang: lang};
    }

    var presenter = function () {
    };

    var playerController;
    var eventBus;
    var addonID;
    var isWCAGOn = false;

    presenter.uniqueIDs = [];
    presenter.uniqueElementLeft = [];
    presenter.uniqueElementRight = [];
    presenter.elements = [];
    presenter.lastClickTime = 0;
    presenter.lastEvent = null;
    presenter.disabledConnections = [];
    presenter.keyboardControllerObject = null;
    presenter.langTag = '';
    presenter.speechTexts = {};
    presenter.columnSizes = {};
    presenter.lineStackSA = [];
    presenter.isValid = true;

    presenter.isShowAnswersActive = false;
    presenter.isGradualShowAnswersActive = false;
    presenter.GSAcounter = 0;
    presenter.isCheckActive = false;
    presenter.initialState = null;

    presenter.printableState = null;
    presenter.printableParserID = "";
    presenter.printableParserCallback = null;

    presenter.mathJaxLoaders = {
        runLoader: false,
        setStateLoader: true
    };

    presenter.PRINTABLE_STATE_MODE = {
        EMPTY: 0,
        SHOW_ANSWERS: 1,
        SHOW_USER_ANSWERS: 2,
        CHECK_ANSWERS: 3
    };

    presenter.printableStateMode = 0;

    var deferredCommandQueue = window.DecoratorUtils.DeferredSyncQueue(checkIsMathJaxLoaded);

    function checkIsMathJaxLoaded() {
        return presenter.mathJaxLoaders.runLoader && presenter.mathJaxLoaders.setStateLoader;
    }

    var connections;
    var singleMode = false;
    var selectedItem = null;
    presenter.isNotActivity = false;

    presenter.lineStack = new LineStack(true);
    presenter.correctConnections = new LineStack(false);
    var isSelectionPossible = true;
    var isRTL = false;

    var connectionColor = "#000";
    var correctConnection = "#0d0";
    var incorrectConnection = "#d00";
    var connectionThickness = "1px";
    var showAnswersColor = "#0d0";

    var CORRECT_ITEM_CLASS = 'connectionItem-correct';
    var WRONG_ITEM_CLASS = 'connectionItem-wrong';

    presenter.ERROR_MESSAGES = {
        'ID not unique': 'One or more IDs are not unique.',
        'One or two not exist': 'Provided id for initial value doesn\'t exists',
        'Are from the same column': 'Provided ids for initial value are in the same column'
    };

    presenter.ELEMENT_SIDE = {
        LEFT: 0,
        RIGHT: 1
    };

    function isEnabledOrMultiLineMode(element) {
        if (!singleMode) {
            return true;
        }

        var elementId = convertId($(element).attr('id'));

        for (var i = 0; i < presenter.initialValues.length; i++) {
            var initialValue = presenter.initialValues[i];

            if (initialValue.from === elementId || initialValue.to === elementId) {
                return !initialValue.isDisabled;
            }
        }

        return true;
    }

    function convertId(id) {
        id = id.toString();

        return id.substr(id.indexOf('-') + 1);
    }

    function convertIds(id1, id2) {
        return {
            id1: convertId(id1),
            id2: convertId(id2)
        }
    }

    function isOneOfValuesEmpty(initialValue) {
        return initialValue.from.trim() === "" && initialValue.to.trim() === "";
    }

    presenter.getCurrentActivatedElement = function () {
        return $('.keyboard_navigation_active_element');
    };

    presenter.upgradeModel = function (model) {
        var upgradedModel = presenter.upgradeFrom_01(model);
        upgradedModel = presenter.upgradeStartValues(upgradedModel);

        return upgradedModel;
    };

    presenter.upgradeStartValues = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (upgradedModel['initialConnections'] === undefined) {
            upgradedModel['initialConnections'] = [];
            upgradedModel['disabledConnectionColor'] = "";
        }

        return upgradedModel;
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
        this.shouldFireEvent = true;

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
                if (score == 0 && presenter.blockWrongAnswers) {
                    this.shouldFireEvent = false;
                    this.remove(line);
                }
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

            if (this.sendEvents && this.shouldFireEvent) {
                score = presenter.correctConnections.hasLine(line).length > 0 ? 1 : 0;
                presenter.sendEvent(pair[0], pair[1], 0, score);
            }
            this.shouldFireEvent = true;
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
        };

        this.getDisabledCount = function () {
            return this.stack.filter(function (stackElement) {
                return stackElement.isDisabled();
            }).length;
        };
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
        };

        this.isDisabled = function () {
            var ids = convertIds($(this.from).attr('id'), $(this.to).attr('id'));

            for (var i = 0; i < presenter.initialValues.length; i++) {
                var initialValue = presenter.initialValues[i];

                var initialValues = [initialValue.from, initialValue.to];

                if (initialValue.isDisabled) {
                    if ($.inArray(ids.id1, initialValues) > -1 && $.inArray(ids.id2, initialValues) > -1) {
                        return true;
                    }
                }
            }

            return false;
        };
    }

    presenter.showErrorMessage = function (errorCode) {
        return $(presenter.view).html(presenter.ERROR_MESSAGES[errorCode]);
    };

    presenter.parseDefinitionLinks = function () {
        $.each($(presenter.view).find('.innerWrapper'), function (index, element) {
            $(element).html(presenter.textParser.parse($(element).html()));
        });

        presenter.textParser.connectLinks($(presenter.view));
    };

    presenter.parseAddonGaps = function (model) {
        //This method is only needed in preview, in normal mode text parser will handle addon gaps
        for (var i = 0; i < model["Left column"].length; i++) {
            var el = model["Left column"][i];
            el.content = parseAddonGapsInContent(el.content);
        }
        for (var i = 0; i < model["Right column"].length; i++) {
            var el = model["Right column"][i];
            el.content = parseAddonGapsInContent(el.content);
        }
        return model;
    };

    function parseAddonGapsInContent (text) {
        return text.replace(/\\addon{([^\s-]*?)}/g, '<div id="addonGap-$1">$1</div>');
    }

    presenter.removeNonVisibleInnerHTML = function () {
        presenter.removeNonVisibleInnerHTMLForRoot($(presenter.view));

    };
    presenter.removeNonVisibleInnerHTMLForRoot = function ($root) {
        $.each($root.find('.innerWrapper'), function (index, element) {
            var newInnerHtml = $(element).html().replace(/\\alt{([^{}|]*?)\|[^{}|]*?}(\[[a-zA-Z0-9_\- ]*?\])*/g, '$1'); // replace \alt{a|b}[c] with a
            $(element).html(newInnerHtml.replace(/\\alt{([^|{}]*?)\|[^|{}]*?}/g, '$1')); // replace \alt{a|b} with a
        });
    }

    presenter.setPlayerController = function (controller) {
        presenter.registerMathJax();

        playerController = controller;

        presenter.textParser = new TextParserProxy(controller.getTextParser());
    };

    presenter.registerMathJax = function AddonConnection_registerMathJax() {
        var mathJaxDeferred = new jQuery.Deferred();
        presenter.mathJaxProcessEndedDeferred = mathJaxDeferred;
        presenter.mathJaxProcessEnded = mathJaxDeferred.promise();

        MathJax.Hub.Register.MessageHook("End Process", function (message) {
            if ($(message[1]).hasClass('ic_page')) {
                presenter.mathJaxProcessEndedDeferred.resolve();
            }
            if ($(message[1]).hasClass('ic_popup_page')) {
                presenter.mathJaxProcessEndedDeferred.resolve();
            }
        });
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
        addonID = model.ID;

        presenter.initialize(presenter.view, presenter.model, false);

        presenter.parseDefinitionLinks();
    };

    presenter.setEventBus = function (wrappedEventBus) {
        eventBus = wrappedEventBus;

        var events = ['ShowAnswers', 'HideAnswers', 'GradualShowAnswers', 'GradualHideAnswers'];
        for (var i = 0; i < events.length; i++) {
            eventBus.addEventListener(events[i], this);
        }
    };

    presenter.createPreview = function (view, model) {
        presenter.view = view;
        model = presenter.parseAddonGaps(model);
        presenter.model = model;
        presenter.initialize(presenter.view, presenter.model, true);
    };

    presenter.setVisibility = function (isVisible) {
        $(presenter.view).css('visibility', isVisible ? 'visible' : 'hidden');
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
        presenter.isVisible = false;
    };

    presenter.show = function () {
        presenter.setVisibility(true);
        presenter.isVisible = true;
    };

    presenter.validateTabindexEnabled = function (model) {
        presenter.isTabindexEnabled = ModelValidationUtils.validateBoolean(model["Is Tabindex Enabled"]);
    };

    function getSpeechTextProperty(rawValue, defaultValue) {
        var value = rawValue.trim();

        if (value === undefined || value === null || value === '') {
            return defaultValue;
        }

        return value;
    }

    function setSpeechTexts(speechTexts) {
        presenter.speechTexts = {
            connected: 'connected',
            disconnected: 'disconnected',
            connectedTo: 'connected to',
            selected: 'selected',
            deselected: 'deselected',
            correct: 'correct',
            wrong: 'wrong'
        };

        if (!speechTexts) {
            return;
        }

        presenter.speechTexts = {
            connected: getSpeechTextProperty(speechTexts['Connected']['Connected'], presenter.speechTexts.connected),
            disconnected: getSpeechTextProperty(speechTexts['Disconnected']['Disconnected'], presenter.speechTexts.disconnected),
            connectedTo: getSpeechTextProperty(speechTexts['ConnectedTo']['Connected to'], presenter.speechTexts.connectedTo),
            selected: getSpeechTextProperty(speechTexts['Selected']['Selected'], presenter.speechTexts.selected),
            deselected: getSpeechTextProperty(speechTexts['Deselected']['Deselected'], presenter.speechTexts.deselected),
            correct: getSpeechTextProperty(speechTexts['Correct']['Correct'], presenter.speechTexts.correct),
            wrong: getSpeechTextProperty(speechTexts['Wrong']['Wrong'], presenter.speechTexts.wrong)
        };
    }

    presenter.addDisabledElementsFromInitialValues = function () {
        presenter.initialValues.forEach(function (initialValue) {
            if (initialValue.isDisabled) {
                presenter.disabledConnections.push({
                    id1: initialValue.from,
                    id2: initialValue.to
                });
            }
        });
    };


    presenter.getInitialValues = function (model) {
        var modelValidator = new ModelValidator();
        var validated = modelValidator.validate(model, [
            ModelValidators.List("initialConnections", [
                ModelValidators.String("from", {default: "", trim: false}),
                ModelValidators.String("to", {default: "", trim: false}),
                ModelValidators.Boolean("isDisabled", {default: false})
            ]),
            ModelValidators.String("disabledConnectionColor", {default: "", trim: true})
        ]);

        return {
            initialConnections: validated.value.initialConnections,
            disabledConnectionColor: validated.value.disabledConnectionColor
        };
    };

    presenter.validateInitialValue = function (initialValue) {
        function containsID(array, idToFind, toReturn) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].id === idToFind) {
                    return toReturn;
                }
            }

            return false;
        }

        function areFromDifferentCols() {
            var fromColumn = containsID(presenter.model['Left column'], initialValue.from, "LEFT") ||
                containsID(presenter.model['Right column'], initialValue.from, "RIGHT");

            var toColumn = containsID(presenter.model['Left column'], initialValue.to, "LEFT") ||
                containsID(presenter.model['Right column'], initialValue.to, "RIGHT");

            return fromColumn !== toColumn;
        }

        function bothExists() {
            var fromExists = containsID(presenter.model['Left column'], initialValue.from, true) ||
                containsID(presenter.model['Right column'], initialValue.from, true);

            var toExists = containsID(presenter.model['Left column'], initialValue.to, true) ||
                containsID(presenter.model['Right column'], initialValue.to, true);

            return fromExists && toExists;
        }

        if (!isOneOfValuesEmpty(initialValue)) {
            if (!bothExists()) {
                presenter.showErrorMessage('One or two not exist');
                return false;
            } else if (!areFromDifferentCols()) {
                presenter.showErrorMessage('Are from the same column');
                return false;
            }
        }

        return true;
    };

    presenter.validateInitialValues = function () {
        for (var i = 0; i < presenter.initialValues.length; i++) {
            if (!presenter.validateInitialValue(presenter.initialValues[i])) {
                return false;
            }
        }

        return true;
    };

    /**
     * @param initialValue {{from: string, to: string}}
     */
    presenter.drawInitialValue = function (initialValue) {
        if (!isOneOfValuesEmpty(initialValue)) {
            pushConnection(new Line(getElementById(initialValue.from), getElementById(initialValue.to)), false);
        }
    };

    presenter.drawInitialValues = function () {
        this.lineStack.setSendEvents(false);

        if (!presenter.lineStack.length()) {
            presenter.initialValues.forEach(presenter.drawInitialValue);
        }

        presenter.redraw();

        this.lineStack.setSendEvents(true);
    };

    presenter.initialize = function (view, model, isPreview) {
        if (isPreview) {
            presenter.lineStack = new LineStack(false);
        }

        model = presenter.upgradeModel(model);

        presenter.langTag = model['langAttribute'];
        presenter.$view = $(view);
        presenter.$view.attr('lang', presenter.langTag);

        setSpeechTexts(model['speechTexts']);

        var initialValues = presenter.getInitialValues(model);
        presenter.initialValues = initialValues.initialConnections;
        presenter.disabledConnectionColor = initialValues.disabledConnectionColor;

        presenter.blockWrongAnswers = ModelValidationUtils.validateBoolean(model.blockWrongAnswers);
        presenter.isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);
        presenter.removeDraggedElement = ModelValidationUtils.validateBoolean(model["removeDraggedElement"]);
        presenter.isVisibleByDefault = ModelValidationUtils.validateBoolean(model["Is Visible"]);
        presenter.setVisibility(presenter.isVisible || isPreview);

        isRTL = presenter.$view.css('direction').toLowerCase() === 'rtl';
        connections = presenter.$view.find('.connections:first');

        this.setSingleMode(model['Single connection mode']);

        var isRandomLeft = ModelValidationUtils.validateBoolean(model['Random order left column']);
        var isRandomRight = ModelValidationUtils.validateBoolean(model['Random order right column']);

        presenter.validateTabindexEnabled(model);

        if (isPreview) {
            this.loadElements(view, model, 'connectionLeftColumn', 'Left column', false);
            this.loadElements(view, model, 'connectionRightColumn', 'Right column', true);
        } else {
            if (!isRandomLeft) {
                this.loadElements(view, model, 'connectionLeftColumn', 'Left column', false);
            } else {
                this.loadRandomElementsLeft(view, model, 'connectionLeftColumn', 'Left column', false);
            }

            if (!isRandomRight) {
                this.loadElements(view, model, 'connectionRightColumn', 'Right column', true);
            } else {
                this.loadRandomElementsRight(view, model, 'connectionRightColumn', 'Right column', true);
            }
        }

        if (!presenter.validateInitialValues()) {
            presenter.isValid = false;
            return;
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

        // isNotActivty may not exist
        presenter.isNotActivity = ModelValidationUtils.validateBoolean(model['isNotActivity'] || 'False');

        const $connectionContainer = $(".connectionContainer");

        if (isPreview) {
            waitForLoad($connectionContainer, () => {
                presenter.initializeView(view, model);
                presenter.drawConfiguredConnections();
            })
            presenter.removeNonVisibleInnerHTML();
        } else {
            presenter.mathJaxProcessEnded.then(function () {
                waitForLoad($connectionContainer, () => {
                    presenter.initializeView(view, model);
                    presenter.drawInitialValues();
                    presenter.addDisabledElementsFromInitialValues();
                })
                presenter.registerListeners(presenter.view);

                presenter.mathJaxLoaders.runLoader = true;
                deferredCommandQueue.resolve();
            });
        }

        this.gatherCorrectConnections();
        presenter.buildKeyboardController();
    };

    presenter.buildKeyboardController = function () {
        var elements = [];
        for (var i = 0; i < presenter.elements.length; i++) {
            elements.push($(presenter.elements[i].element));
        }

        presenter.keyboardControllerObject = new ConnectionKeyboardController(elements, 2);
        presenter.keyboardControllerObject.selectEnabled(true);
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
        if (!presenter.isShowingAnswers()) {
            var eventData = presenter.createEventData(addonID, fromID, toID, presenter.model, value, score);
            eventBus.sendEvent('ValueChanged', eventData);
            if (presenter.isAllOK()) {
                sendAllOKEvent();
            }
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
        if (basicClickLogic(element)) {
            presenter.redraw();
        }
    }

    function basicClickLogic(element) {
        if (!isEnabledOrMultiLineMode(element)) {
            return false;
        }

        // workaround for android webView
        // http://code.google.com/p/android/issues/detail?id=38808
        var current = new Date().getTime();
        var delta = current - presenter.lastClickTime;
        if (!isSelectionPossible || delta < 50) return;
        presenter.lastClickTime = current;
        if (!$(element).hasClass('selected') && selectedItem == null) { // first element selected
            $(element).parent().find('.connectionItem').removeClass('selected');
            $(element).addClass('selected');
            selectedItem = $(element);
            return;
        }
        if (selectedItem != null && $(element).get(0) == selectedItem.get(0)) { // clicking the selected element again
            $(element).removeClass('selected');
            selectedItem = null;
            return;
        }
        if (selectedItem != null &&
            ($(element).parents('.connectionLeftColumn').get(0) == selectedItem.parents('.connectionLeftColumn').get(0) ||
                $(element).parents('.connectionRightColumn').get(0) == selectedItem.parents('.connectionRightColumn').get(0))) {
            // element clicked in the same column
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
            if (presenter.checkIfConnectionDisabled($(element).attr('id'), selectedItem.attr('id'))) {
                return;
            }
            var line = new Line($(element), selectedItem);
            var shouldDraw = true;

            if (singleMode) {
                var usedInLines = presenter.lineStack.isItemUsed(line);
                if (usedInLines.length === 2) {
                    shouldDraw = false
                }
            }
            if (shouldDraw) {
                pushConnection(line, false);
            }
        }

        selectedItem.removeClass('selected');
        selectedItem = null;
        return true;
    }

    presenter.drawTempLine = function (x, y) {
        if ($(presenter.view).find('#connection_line_tmp').length > 0) {
            $(presenter.view).find('#connection_line_tmp').remove();
        }
        var m, angle, d, transform,
            x1 = parseInt(presenter.iconLeft, 10),
            y1 = parseInt(presenter.iconTop, 10);

        m = (y - y1) / (x - x1);
        angle = (Math.atan(m)) * 180 / (Math.PI);
        d = Math.sqrt(((x - x1) * (x - x1)) + ((y - y1) * (y - y1)));
        if (x >= x1) {
            transform = (360 + angle) % 360;
        } else {
            transform = 180 + angle;
        }

        var div = $('<div>');
        div.attr('id', 'connection_line_tmp');
        div.attr('class', 'connection_line');
        div.attr('style', 'left: ' + x1 + 'px; top: ' + y1 + 'px');
        $(presenter.view).prepend(div);
        $(presenter.view).find('#connection_line_tmp').css({
            'left': x1,
            'top': y1,
            'width': d,
            'background-color': connectionColor,
            'transform': 'rotate(' + transform + 'deg)',
            'transform-origin': '0px 0px',
            '-ms-transform': 'rotate(' + transform + 'deg)',
            '-ms-transform-origin': '0px 0px',
            '-moz-transform': 'rotate(' + transform + 'deg)',
            '-moz-transform-origin': '0px 0px',
            '-webkit-transform': 'rotate(' + transform + 'deg)',
            '-webkit-transform-origin': '0px 0px',
            '-o-transform': 'rotate(' + transform + 'deg)',
            '-o-transform-origin': '0px 0px'
        });
    };

    presenter.registerListeners = function (view) {

        presenter.$connectionContainer = $(view).find('.connectionContainer');
        presenter.$leftColumn = $(view).find('connectionLeftColumn');
        presenter.$rightColumn = $(view).find('connectionRightColumn');

        presenter.$connectionContainer.click(function (e) {
            e.preventDefault();
            e.stopPropagation();
        });

        presenter.$leftColumn.click(function (e) {
            e.preventDefault();
            e.stopPropagation();
        });

        presenter.$rightColumn.click(function (e) {
            e.preventDefault();
            e.stopPropagation();
        });

        var element = $(view).find('.connectionItem');
        var draggedElementColumn;

        element.on('touchstart', function (e) {
            e.preventDefault();
            e.stopPropagation();
            presenter.lastEvent = e;
        });

        var scale = playerController.getScaleInformation();

        var android_ver = MobileUtils.getAndroidVersion(window.navigator.userAgent);
        if (["4.1.1", "4.2.2", "4.4.2"].indexOf(android_ver) === -1 || window.navigator.userAgent.indexOf('Chrome') > 0) {
            element.each(function () {
                var e = $(this);
                e.draggable({
                    revert: presenter.removeDraggedElement ? true : "invalid",
                    opacity: presenter.removeDraggedElement ? 1 : 0.7,
                    helper: presenter.removeDraggedElement ? "original" : "clone",
                    cursorAt: {
                        left: Math.round(e.find('.inner').width() / 2),
                        top: Math.round(e.find('.inner').height() / 2)
                    },
                    start: function (event, ui) {
                        if (!isEnabledOrMultiLineMode(this)) {
                            event.preventDefault();
                            return false;
                        }
                        ui.helper.css("visibility", "hidden");
                        ui.helper.find(".inner_addon").css("display","none");
                        var $iconWrapper = $(e).find(".iconWrapper");
                        scale = playerController.getScaleInformation();

                        presenter.iconTop = $iconWrapper.position().top / scale.scaleY + ($iconWrapper.height() / 2);
                        presenter.iconLeft = $iconWrapper.position().left / scale.scaleX + $iconWrapper.width();

                        if (!isSelectionPossible) {
                            event.stopPropagation();
                            event.preventDefault();
                            return;
                        }
                        $(element).removeClass('selected');
                        selectedItem = null;
                        ui.helper.zIndex(100);
                        clickLogic(this);
                        if (presenter.removeDraggedElement) {
                            ui.helper.find('.icon').hide();
                            ui.helper.removeClass('selected');
                        } else {
                            ui.helper.find('.icon').remove();
                            ui.helper.width($(this).find('.inner').width());
                            ui.helper.height($(this).find('.inner').height());
                        }
                        if ($(this).parents('.connectionLeftColumn').length) {
                            draggedElementColumn = 'left';
                        } else {
                            draggedElementColumn = 'right';
                        }
                    },
                    drag: function (event, ui) {
                        presenter.mouseSX = parseInt(event.pageX, 10) - parseInt($(presenter.view).offset().left, 10);
                        presenter.mouseSY = parseInt(event.pageY, 10) - parseInt($(presenter.view).offset().top, 10);

                        presenter.drawTempLine(presenter.mouseSX / scale.scaleX, presenter.mouseSY / scale.scaleY);
                    },
                    stop: function (event, ui) {
                        ui.helper.zIndex(0);
                        if (presenter.removeDraggedElement) {
                            ui.helper.find('.icon').show();
                        } else {
                            ui.helper.remove();
                        }
                        presenter.redraw();
                        if ($(presenter.view).find('#connection_line_tmp').length > 0) {
                            $(presenter.view).find('#connection_line_tmp').remove();
                        }
                    }
                });

                e.droppable({
                    tolerance: "pointer",
                    drop: function (event, ui) {
                        $(this).removeClass('selected');
                        basicClickLogic(this);
                        ui.draggable.removeClass('selected');
                        if (presenter.lastEvent) {
                            presenter.lastEvent.type = "touchend";
                        }
                    },
                    over: function (event, ui) {
                        var elementColumn;
                        if ($(this).parents('.connectionLeftColumn').length) {
                            elementColumn = 'left';
                        } else {
                            elementColumn = 'right';
                        }
                        if (elementColumn != draggedElementColumn) {
                            $(this).addClass('selected');
                        }
                    },
                    out: function (event, ui) {
                        $(this).removeClass('selected');
                    }
                });
            });
        } else {
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
        }
        element.on('touchend', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (presenter.lastEvent.type != e.type) {
                presenter.isClicked = false;
                clickLogic(this);
                presenter.isClicked = true;
            }
        });

        element.click(function (e) {
            e.stopPropagation();
            if (!presenter.isClicked) {
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

    function isAnswersEqualToCorrectResults (userAnswers, correctAnswers) {
        if (userAnswers == null || correctAnswers == null) return false;
        if (userAnswers.length !== correctAnswers.length) return false;

        var userAnswersParsed = [];
        var correctAnswersParsed = []
        userAnswers.forEach(function(element, index) {
            userAnswersParsed.push(element.join(':'));
        }, userAnswers);
        correctAnswers.forEach(function(element, index) {
            correctAnswersParsed.push(element.id + ':' + element.answer);
        }, correctAnswers);
      
        userAnswersParsed.sort();
        correctAnswersParsed.sort();
      
        for (var i = 0; i < userAnswersParsed.length; ++i) {
          if (userAnswersParsed[i] !== correctAnswersParsed[i]) {
            return false;
          }
        }
        return true;
      }

    function appendAnswerDiv (column, elementId, answerDiv) {
        var element = $('<table class="answerItem" id="connection-' + elementId + '"></div>');
        var row = $('<tr></tr>');
        var innerElement = $('<td class="inner"></td>');
        var newRow = $('<tr></tr>');
        var newCell = $('<td class="connectionItemWrapper"></td>');
        innerElement.append(answerDiv);
        row.append(innerElement);
        element.append(row);
        newCell.append(element);
        newRow.append(newCell);
        column.append(newRow);
    }

    presenter.addAnswersElements = function (view, model, correctAnswers) {
        // left side
        userAnswers = []
        if (presenter.printableState.id.length > 0) {
            for (var i = 0; i < presenter.printableState.id.length; i++) {
                var pair = presenter.printableState.id[i].split(':');
                userAnswers.push(pair);
            }
        }

        var leftAnswerColumn = $(view).find('.answersLeftColumn:first').find('.content:first');
        var rightAnswerColumn = $(view).find('.answersRightColumn:first').find('.content:first');
        
        // Left answer column
        for (var i = 0; i < model["Left column"].length; i++) {
            var element = presenter.elements[i];
            var leftId = element.id;
            var userConnectionsWithLeftId = userAnswers.filter((userAnswer) => {
                return(userAnswer[0] == leftId);
            })
            if (userConnectionsWithLeftId.length == 0) {
                var emptyAnswer = [`${leftId}`, ''];
                userConnectionsWithLeftId.push(emptyAnswer);
            }
            var correctConnectionsWithLeftId = correctAnswers.filter((correctAnswer) => {
                return(correctAnswer.id == leftId);
            });
            var answerDiv = isAnswersEqualToCorrectResults(userConnectionsWithLeftId, correctConnectionsWithLeftId) ?
                    $('<div class="correctAnswerDiv"></div>') :
                    $('<div class="inCorrectAnswerDiv"></div>');
            appendAnswerDiv(leftAnswerColumn, leftId, answerDiv);
        }
        // Right answer column
        for (var i = 0; i < model["Right column"].length; i++) {
            var rightId = model["Right column"][i].id;
            var userConnectionsWithRightId = userAnswers.filter((userAnswer) => {
                return(userAnswer[1] == rightId);
            })
            var correctConnectionsWithRightId = correctAnswers.filter((correctAnswer) => {
                return(correctAnswer.answer == rightId);
            })
            var answerDiv = isAnswersEqualToCorrectResults(userConnectionsWithRightId, correctConnectionsWithRightId) ?
                $('<div class="correctAnswerDiv"></div>') :
                $('<div class="inCorrectAnswerDiv"></div>');
            appendAnswerDiv(rightAnswerColumn, rightId, answerDiv);
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

    presenter.addTabindexToElement = function (element, tabindexValue) {
        element.attr("tabindex", tabindexValue);
    };

    presenter.appendElements = function (i, model, columnModel, column, isRightColumn) {
        presenter.columnSizes[columnModel] = model[columnModel].length;
        var id = model[columnModel][i]['id'];
        if (!this.isIDUnique(id)) {
            return presenter.showErrorMessage('ID not unique');
        }
        var element = $('<table class="connectionItem" id="connection-' + id + '"></div>');
        var row = $('<tr></tr>');
        element.append(row);
        var innerElement = $('<td class="inner"></td>');
        var innerWrapper = $('<div class="innerWrapper"></div>');
        innerWrapper = presenter.addClassToElement(innerWrapper, model[columnModel][i]['additional class']);
        $(innerWrapper).css('direction', isRTL ? 'rtl' : 'ltr');
        innerWrapper.html(model[columnModel][i]['content']);

        if (presenter.isTabindexEnabled) {
            presenter.addTabindexToElement(innerWrapper, 0);
        }

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
            var i = nextInt(columnLength);
            if (presenter.isElementLeftUnique(i)) {
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
            var i = nextInt(columnLength);
            if (presenter.isElementRightUnique(i)) {
                presenter.appendElements(i, model, columnModel, column, isRightColumn);
                elementCounterRight++;
            }
        }
    };

    function nextInt(upperBound) {
        if (presenter.printableController) {
            return presenter.printableController.nextInt(upperBound);
        } else {
            return Math.floor((Math.random() * upperBound))
        }
    }

    presenter.isElementLeftUnique = function (element) {
        var isElement = false;
        for (var i = 0; i < presenter.uniqueElementLeft.length; i++) {
            if (presenter.uniqueElementLeft[i] == element) {
                isElement = true;
            }
        }
        if (isElement) {
            return false;
        } else {
            presenter.uniqueElementLeft.push(element);
            return true;
        }
    };

    presenter.isElementRightUnique = function (element) {
        var isElement = false;
        for (var i = 0; i < presenter.uniqueElementRight.length; i++) {
            if (presenter.uniqueElementRight[i] == element) {
                isElement = true;
            }
        }
        if (isElement) {
            return false;
        } else {
            presenter.uniqueElementRight.push(element);
            return true;
        }
    };

    presenter.initializeView = function (view, model) {
        var leftColumnHeight = $(view).find('.connectionLeftColumn:first').outerHeight();
        var rightColumnHeight = $(view).find('.connectionRightColumn:first').outerHeight();
        var height = model['Height'];// leftColumnHeight > rightColumnHeight ? leftColumnHeight : rightColumnHeight;
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
        presenter.redraw();
    };

    presenter.getElementSnapPoint = function AddonConnection_getElementSnapPoint(element) {
        var offset = element.offset();
        var scale = playerController ? playerController.getScaleInformation() : { scaleX: 1, scaleY: 1 };
        var snapPoint = [0, 0];

        var elementWidth = element.outerWidth(true) * scale.scaleX;
        var elementHeight = element.outerHeight() * scale.scaleY;

        if (element.parents('.connectionLeftColumn').length > 0) {
            snapPoint = [offset.left + elementWidth, offset.top + elementHeight / 2];
        }
        if (element.parents('.connectionRightColumn').length > 0) {
            snapPoint = [offset.left, offset.top + elementHeight / 2];
        }

        // snapPoint[0] is x offset, [1] is y offset
        snapPoint[0] /= scale.scaleX;
        snapPoint[1] /= scale.scaleY;

        return snapPoint;
    };

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
        readConnected(addLine);
    }

    presenter.redraw = function AddonConnection_redraw() {
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
        } else {
            connections.clearCanvas();
        }

        for (var i = 0; i < presenter.lineStack.length(); i++) {
            drawLine(presenter.lineStack.get(i), connectionColor)
        }
    };

    presenter.redrawShowAnswers = function AddonConnection_redrawShowAnswers() {
        connections.clearCanvas();
        for (var i = 0; i < presenter.lineStack.length(); i++) {
            drawLine(presenter.lineStack.get(i), showAnswersColor)
        }
    };

    function drawLine(line, color) {
        if (line.isDisabled() && presenter.disabledConnectionColor !== "") {
            color = presenter.disabledConnectionColor;
        }

        var from = presenter.getElementSnapPoint(line.from);
        var to = presenter.getElementSnapPoint(line.to);
        var canvasOffset = connections.offset();
        var scale = playerController ? playerController.getScaleInformation() : { scaleX: 1, scaleY: 1 };

        canvasOffset.left /= scale.scaleX;
        canvasOffset.top /= scale.scaleY;

        connections.drawLine({
            strokeStyle: color,
            strokeWidth: connectionThickness,
            x1: to[0] - canvasOffset.left, y1: to[1] - canvasOffset.top,
            x2: from[0] - canvasOffset.left, y2: from[1] - canvasOffset.top
        });
    }

    presenter.isShowingAnswers = function AddonConnection_isShowingAnswers(){
        return presenter.isGradualShowAnswersActive || presenter.isShowAnswersActive;
    }


    presenter.setShowErrorsMode = deferredCommandQueue.decorate(
        function () {
            presenter.isCheckActive = true;
            if (presenter.isShowAnswersActive) {
                presenter.hideAnswers();
            }
            if (presenter.isNotActivity) return 0;

            connections.clearCanvas();
            for (var i = 0; i < presenter.lineStack.length(); i++) {
                var line = presenter.lineStack.get(i);
                if (presenter.correctConnections.hasLine(line).length > 0) {
                    drawLine(presenter.lineStack.get(i), correctConnection);
                    var fromElementCorrect = $(presenter.view).find('#' + presenter.lineStack.get(i).from[0].id);
                    var toElementCorrect = $(presenter.view).find('#' + presenter.lineStack.get(i).to[0].id);
                    $(fromElementCorrect).addClass(CORRECT_ITEM_CLASS);
                    $(toElementCorrect).addClass(CORRECT_ITEM_CLASS);
                } else {
                    drawLine(presenter.lineStack.get(i), incorrectConnection);
                    var fromElementIncorrect = $(presenter.view).find('#' + presenter.lineStack.get(i).from[0].id);
                    var toElementIncorrect = $(presenter.view).find('#' + presenter.lineStack.get(i).to[0].id);
                    $(fromElementIncorrect).addClass(WRONG_ITEM_CLASS);
                    $(toElementIncorrect).addClass(WRONG_ITEM_CLASS);
                }
            }
            $(presenter.view).find('.connectionItem').each(function () {
                if ($(this).hasClass(CORRECT_ITEM_CLASS) && $(this).hasClass(WRONG_ITEM_CLASS)) {
                    $(this).removeClass(CORRECT_ITEM_CLASS);
                }
            });
            presenter.$connectionContainer.find('.selected').removeClass('selected');
            selectedItem = null;
            isSelectionPossible = false;
        }
    );

    presenter.setWorkMode = deferredCommandQueue.decorate(
        function () {
            presenter.isCheckActive = false;
            presenter.gatherCorrectConnections();
            presenter.redraw();
            $(presenter.view).find('.connectionItem').each(function () {
                $(this).removeClass(CORRECT_ITEM_CLASS);
                $(this).removeClass(WRONG_ITEM_CLASS);
            });
            isSelectionPossible = true;
        }
    );

    presenter.reset = deferredCommandQueue.decorate(
        function (onlyWrongAnswers) {
            if (!presenter.isValid) {
                return;
            }

            if (presenter.isShowAnswersActive) {
                presenter.hideAnswers();
            }

            presenter.keyboardControllerObject.selectEnabled(true);

            if (!onlyWrongAnswers) {
                presenter.lineStack.clear();
            } else {
                this.lineStack.setSendEvents(false);
                var linesToRemove = [];
                for (var i = 0; i < presenter.lineStack.length(); i++) {
                    var line = presenter.lineStack.get(i);
                    if (presenter.correctConnections.hasLine(line).length === 0) {
                        linesToRemove.push(line)
                    }
                }

                linesToRemove.forEach(function (line) {
                    presenter.lineStack.remove(line);
                });
                this.lineStack.setSendEvents(true);
            }

            isSelectionPossible = true;
            presenter.$connectionContainer.find('.selected').removeClass('selected');
            $(presenter.view).find('.connectionItem').each(function () {
                $(this).removeClass(CORRECT_ITEM_CLASS);
                $(this).removeClass(WRONG_ITEM_CLASS);
            });

            presenter.redraw();
            presenter.setVisibility(presenter.isVisibleByDefault);
            presenter.isVisible = presenter.isVisibleByDefault;
            presenter.disabledConnections = [];
            if (!onlyWrongAnswers) {
                presenter.addDisabledElementsFromInitialValues();
                presenter.drawInitialValues();
            }
        }
    );

    // that method can return false results when called before mathjax is loaded, but cannot be moved to aysnc queue
    presenter.getErrorCount = function () {
        if (presenter.isNotActivity) return 0;

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
        if (presenter.isNotActivity) return 0;

        return presenter.correctConnections.length() - presenter.correctConnections.getDisabledCount();
    };

    // that method can return false results when called before mathjax is loaded, but cannot be moved to aysnc queue
    presenter.getScore = function () {
        if (presenter.isNotActivity) return 0;

        var score = 0;
        for (var i = 0; i < presenter.lineStack.length(); i++) {
            var line = presenter.lineStack.get(i);
            if (presenter.correctConnections.hasLine(line).length > 0) {
                if (!line.isDisabled()) {
                    score++;
                }
            }
        }
        return score;
    };

    presenter.gradualShowAnswers = function (itemIndex) {
        presenter.keyboardControllerObject.selectEnabled(false);
        presenter.addCurrentAnswersToTemporary();

        presenter.lineStack.clear();
        presenter.redraw();

        while(itemIndex < presenter.GSAcounter || !presenter.elementIsShowAnswersViable(itemIndex)) {
            itemIndex++;
        }
        presenter.addCorrectAnswersToLineStack(itemIndex + 1);
        presenter.GSAcounter = itemIndex + 1;

        presenter.redrawShowAnswers();
        presenter.lineStack.clear();
        isSelectionPossible = false;

        presenter.restoreConnectionFromTemporary();
    }

    presenter.gradualHideAnswers = function () {
        presenter.isGradualShowAnswersActive = false;
        presenter.keyboardControllerObject.selectEnabled(true);
        presenter.redraw();
        isSelectionPossible = true;
        presenter.GSAcounter = 0;
    }

    presenter.elementIsShowAnswersViable = function(index) {
        var viableElement = false;
        var connects = presenter.elements[index].connects;
        for(var i = 0; i < connects.length; i++) {
            if(connects[i] !== "" && $.inArray(connects[i], presenter.uniqueIDs) >= 0) {
                viableElement = true;
                break;
            }
        }
        return viableElement;
    }

    presenter.getActivitiesCount = function () {
        var counter = 0;
        for (var i = 0; i < presenter.elements.length; i++) {
            if (presenter.elementIsShowAnswersViable(i)) counter++;
        }
        return counter;
    }

    presenter.getState = function () {
        // this is needed because run/setState method waits for MathJax process to be finished
        // if getState is called before MathJax EndProcess callback then state would be lost
        // this fix that problem
        if (!presenter.mathJaxLoaders.setStateLoader && presenter.initialState !== null) {
            return presenter.initialState;
        }

        var id = [];
        for (var i = 0; i < presenter.lineStack.ids.length; i++) {
            id.push(presenter.lineStack.ids[i].join(':'))
        }
        return JSON.stringify({
            id: id,
            isVisible: presenter.isVisible
        });
    };

    presenter.setState = function (state) {
        var hookExecuted = false;
        presenter.initialState = state;
        presenter.mathJaxLoaders.setStateLoader = false;

        presenter.mathJaxProcessEnded.then(function () {
            if (state !== '' && !hookExecuted) {
                presenter.lineStack.setSendEvents(false);
                presenter.lineStack.clear();

                var parsedState = JSON.parse(state);
                var id;
                if (typeof parsedState.isVisible !== "undefined") {
                    id = parsedState.id;
                    presenter.setVisibility(parsedState.isVisible);
                    presenter.isVisible = parsedState.isVisible;
                } else {
                    id = parsedState;
                }
                for (var i = 0; i < id.length; i++) {
                    var pair = id[i].split(':');
                    pushConnection(new Line(getElementById(pair[0]), getElementById(pair[1])), false);
                }

                presenter.lineStack.setSendEvents(true);
                presenter.redraw();
                deferredCommandQueue.resolve();
            }

            presenter.initialState = null;
            presenter.mathJaxLoaders.setStateLoader = true;
            hookExecuted = true;
        });
    };

    presenter.validateAdditionalClass = function (view, additionalClass) {
        var additionalClassElements = $(view).find('.' + additionalClass);
        var isAdditionalClass = $(view).find('.' + additionalClass).length > 0;

        if (!isAdditionalClass) {
            return {isPresent: false, count: 0};
        }

        return {isPresent: true, count: additionalClassElements.length};
    };

    presenter.validateView = function (view, searchingKeyword) {
        var validatedAdditionalClass = presenter.validateAdditionalClass(view, searchingKeyword);
        if (!validatedAdditionalClass.isPresent) {
            return {isPresent: false, count: validatedAdditionalClass.count};
        }
        return {isPresent: true, count: validatedAdditionalClass.count};
    };

    presenter.getElementById = function (id) {
        return getElementById(id);
    };

    presenter.isAllOK = function () {
        return presenter.getMaxScore() === presenter.getScore() && presenter.getErrorCount() === 0;
    };

    presenter.isOK = function (source) {
        var selectedDestinations = getConnectedPoints(source);
        var correctDestinations = getCorrectPoints(source);
        var isCorrect = isSameArrays(selectedDestinations, correctDestinations);

        return {
            value: isCorrect,
            source: source,
            selectedDestinations: selectedDestinations,
            correctDestinations: correctDestinations
        };
    };

    function getConnectedPoints(source) {
        var connectedPoints = [];

        var selectedLines = presenter.lineStack.ids;
        for (var index = 0; index < selectedLines.length; index++) {
            var selectedLinePoints = selectedLines[index];
            if (hasArrayElement(selectedLinePoints, source)) {
                var selectedDestinationPoint = selectedLinePoints[0] === source ? selectedLinePoints[1] : selectedLinePoints[0];
                connectedPoints.push(selectedDestinationPoint);
            }
        }

        return connectedPoints;
    }

    function getCorrectPoints(source) {
        var correctPoints = [];

        var correctLines = presenter.elements;
        for (var index = 0; index < correctLines.length; index++) {
            var correctLine = correctLines[index];
            var correctLinePoints = correctLine.connects.split(',');
            if (correctLine.id === source) {
                correctPoints = correctPoints.concat(correctLinePoints);
            }
            if (hasArrayElement(correctLinePoints, source)) {
                correctPoints.push(correctLine.id)
            }
        }

        correctPoints = removeDuplicates(correctPoints);
        correctPoints = correctPoints.filter(function (value) {
            return value !== ";"
        });

        return correctPoints;
    }

    function removeDuplicates(correctPoints) {
        correctPoints = correctPoints.filter(function (value, index, arr) {
            return arr.indexOf(value) === index;
        });
        return correctPoints;
    }

    function isSameArrays(selectedDestinations, correctDestinations) {
        var serializedSelectedDestinations = selectedDestinations.sort().join(',');
        var serializedCorrectDestinations = correctDestinations.sort().join(',');

        return serializedSelectedDestinations === serializedCorrectDestinations;
    }

    function hasArrayElement(array, element) {
        for (var arrayIndex = 0; arrayIndex < array.length; arrayIndex++)
            if (array[arrayIndex] === element)
                return true;

        return false;
    }

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
            'isOK': presenter.isOK,
            'isSelected': presenter.isSelectedCommand,
            'markAsCorrect': presenter.markAsCorrectCommand,
            'markAsWrong': presenter.markAsWrongCommand,
            'isAttempted': presenter.isAttemptedCommand,
            'showAnswers': presenter.showAnswers,
            'show': presenter.show,
            'hide': presenter.hide,
            'hideAnswers': presenter.hideAnswers,
            'disable': presenter.disableCommand,
            'enable': presenter.enableCommand
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.disableCommand = function (params) {
        if (params.length === 2) {
            presenter.disable(params[0], params[1]);
        }
    };

    presenter.disable = function (id1, id2) {
        presenter.disabledConnections.push({id1: id1, id2: id2});
    };

    presenter.enableCommand = function (params) {
        if (params.length === 2) {
            presenter.enable(params[0], params[1]);
        }
    };

    presenter.enable = function (id1, id2) {
        var convertedIds = convertIds(id1, id2);
        id1 = convertedIds.id1;
        id2 = convertedIds.id2;

        for (var i = 0; i < presenter.disabledConnections.length; i++) {
            if ((presenter.disabledConnections[i].id1 == id1 && presenter.disabledConnections[i].id2 == id2) ||
                (presenter.disabledConnections[i].id1 == id2 && presenter.disabledConnections[i].id2 == id1)) {
                presenter.disabledConnections.splice(i, 1);
            }
        }
    };

    presenter.checkIfConnectionDisabled = function (id1, id2) {
        var convertedIds = convertIds(id1, id2);
        id1 = convertedIds.id1;
        id2 = convertedIds.id2;

        for (var i = 0; i < presenter.disabledConnections.length; i++) {
            if ((presenter.disabledConnections[i].id1 == id1 && presenter.disabledConnections[i].id2 == id2) ||
                (presenter.disabledConnections[i].id1 == id2 && presenter.disabledConnections[i].id2 == id1)) {
                return true;
            }
        }

        return false;
    };

    presenter.onEventReceived = function (eventName, data) {
        if (eventName === "ShowAnswers") {
            presenter.showAnswers();
        } else if (eventName === "HideAnswers") {
            presenter.hideAnswers();
        } else if (eventName === "GradualShowAnswers") {
            if (!presenter.isGradualShowAnswersActive) {
                presenter.isGradualShowAnswersActive = true;
            }
            if (data.moduleID === addonID) {
                presenter.gradualShowAnswers(parseInt(data.item, 10));
            }
        } else if (eventName === "GradualHideAnswers") {
            presenter.gradualHideAnswers();
        }
    };

    presenter.addCurrentAnswersToTemporary =function () {
        presenter.tmpElements = [];
        for (var elem = 0; elem < presenter.lineStack.ids.length; elem++) {
            presenter.tmpElements.push(presenter.lineStack.ids[elem].join(':'))
        }
    }

    presenter.addCorrectAnswersToLineStack = function (length) {
        for (var i = 0; i < length; i++) {
            var connects = presenter.elements[i]['connects'].split(',');
            for (var j = 0; j < connects.length; j++) {
                if (connects[j] !== "" && $.inArray(connects[j], presenter.uniqueIDs) >= 0) {
                    var pair = [presenter.elements[i]['id'], connects[j]];
                    var line = new Line(
                        getElementById(pair[0]),
                        getElementById(pair[1])
                    );
                    presenter.lineStack.push(line);
                }
            }
        }

        presenter.lineStackSA = {
            stack: presenter.lineStack ? presenter.lineStack.stack.concat([]) : []
        };
    }

    presenter.restoreConnectionFromTemporary = function () {
        for (var element = 0; element < presenter.tmpElements.length; element++) {
            var pairs = presenter.tmpElements[element].split(':');
            pushConnection(new Line(getElementById(pairs[0]), getElementById(pairs[1])), false);
        }
    }

    presenter.showAnswers = deferredCommandQueue.decorate(
        function () {
            if (presenter.isNotActivity) {
                return;
            }

            presenter.keyboardControllerObject.selectEnabled(false);
            presenter.isShowAnswersActive = true;
            presenter.addCurrentAnswersToTemporary();

            presenter.lineStack.clear();
            presenter.redraw();

            presenter.addCorrectAnswersToLineStack(presenter.elements.length)

            presenter.redrawShowAnswers();
            presenter.lineStack.clear();
            isSelectionPossible = false;

            presenter.restoreConnectionFromTemporary();
        }
    );

    presenter.hideAnswers = deferredCommandQueue.decorate(
        function () {
            if (presenter.isNotActivity || !presenter.isShowAnswersActive) {
                return;
            }
            presenter.keyboardControllerObject.selectEnabled(true);
            presenter.redraw();
            presenter.isShowAnswersActive = false;
            isSelectionPossible = true;
        }
    );

    presenter.keyboardController = function (keycode, isShiftDown, event) {
        presenter.keyboardControllerObject.handle(keycode, isShiftDown, event);
    };

    function ConnectionKeyboardController(elements, columnsCount) {
        KeyboardController.call(this, elements, columnsCount);
    }

    presenter.getTextToSpeechOrNull = function (playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    presenter.setWCAGStatus = function (isOn) {
        isWCAGOn = isOn;
    };

    function readConnected(isDrawing) {
        var tts = presenter.getTextToSpeechOrNull(playerController);
        if (tts && presenter.$view.hasClass('ic_active_module')) {
            speak([getTextVoiceObject(
                isDrawing ? presenter.speechTexts.connected : presenter.speechTexts.disconnected
            )]);
        }
    }

    function getConnections($element) {
        var element = $element[0];
        var result = [];
        var lines = presenter.isShowingAnswers() ? presenter.lineStackSA : presenter.lineStack;

        for (var i = 0; i < lines.stack.length; i++) {
            var line = lines.stack[i];

            if (element === line.from[0]) {
                result.push(line.to);
            }

            if (element === line.to[0]) {
                result.push(line.from);
            }
        }

        return result;
    }

    function getConnectionsInfo(connections) {
        var result = [];

        for (var i = 0; i < connections.length; i++) {

            result = result.concat(window.TTSUtils.getTextVoiceArrayFromElement(connections[i], presenter.langTag));

            if (connections[i].hasClass(CORRECT_ITEM_CLASS) && presenter.isCheckActive) {
                result.push(getTextVoiceObject(presenter.speechTexts.correct));
            }

            if (connections[i].hasClass(WRONG_ITEM_CLASS) && presenter.isCheckActive) {
                result.push(getTextVoiceObject(presenter.speechTexts.wrong));
            }
        }

        return result;
    }

    function readActivatedElementConnections() {
        var tts = presenter.getTextToSpeechOrNull(playerController);
        if (tts) {
            var $active = presenter.getCurrentActivatedElement();
            var connections = getConnections($active);
            var TextVoiceArray = window.TTSUtils.getTextVoiceArrayFromElement($active, presenter.langTag);

            if ($active.hasClass('selected') && !presenter.isShowingAnswers()) {
                TextVoiceArray.push(getTextVoiceObject(presenter.speechTexts.selected, ''));
            }

            if (connections.length) {
                TextVoiceArray.push(getTextVoiceObject(presenter.speechTexts.connectedTo, ''));
                TextVoiceArray = TextVoiceArray.concat(getConnectionsInfo(connections));
            }

            speak(TextVoiceArray);
        }
    }

    function speak(data) {
        var tts = presenter.getTextToSpeechOrNull(playerController);

        if (tts && isWCAGOn) {
            tts.speak(data);
        }
    }

    ConnectionKeyboardController.prototype = Object.create(window.KeyboardController.prototype);
    ConnectionKeyboardController.prototype.constructor = ConnectionKeyboardController;

    ConnectionKeyboardController.prototype.nextRow = function (event) {
        event.preventDefault();
        var new_position_index = this.keyboardNavigationCurrentElementIndex + 1;
        if (new_position_index >= this.keyboardNavigationElementsLen || new_position_index < 0) {
            new_position_index = this.keyboardNavigationCurrentElementIndex;
        }
        if (new_position_index === presenter.columnSizes['Left column']) {
            new_position_index = this.keyboardNavigationCurrentElementIndex;
        }
        this.markCurrentElement(new_position_index);
        readActivatedElementConnections();
    };

    ConnectionKeyboardController.prototype.previousRow = function (event) {
        event.preventDefault();
        var new_position_index = this.keyboardNavigationCurrentElementIndex - 1;
        if (new_position_index >= this.keyboardNavigationElementsLen || new_position_index < 0) {
            new_position_index = this.keyboardNavigationCurrentElementIndex
        }
        if (new_position_index === presenter.columnSizes['Left column'] - 1) {
            new_position_index = this.keyboardNavigationCurrentElementIndex;
        }
        this.markCurrentElement(new_position_index);
        readActivatedElementConnections();
    };

    function indexesInTheSameColumn(index1, index2) {
        var leftColumnSize = presenter.columnSizes['Left column'];

        return (index1 < leftColumnSize && index2 < leftColumnSize) || (index1 >= leftColumnSize && index2 >= leftColumnSize);
    }

    ConnectionKeyboardController.prototype.nextElement = function () {
        var new_position_index = this.keyboardNavigationCurrentElementIndex + presenter.columnSizes['Left column'];

        if (new_position_index >= this.keyboardNavigationElementsLen) {
            new_position_index = this.keyboardNavigationElementsLen - 1;
        }

        if (indexesInTheSameColumn(new_position_index, this.keyboardNavigationCurrentElementIndex)) {
            new_position_index = this.keyboardNavigationCurrentElementIndex;
        }

        this.markCurrentElement(new_position_index);
        readActivatedElementConnections();
    };

    ConnectionKeyboardController.prototype.previousElement = function () {
        var new_position_index = this.keyboardNavigationCurrentElementIndex - presenter.columnSizes['Right column'];

        if (new_position_index < 0) {
            new_position_index = 0;
        }

        if (indexesInTheSameColumn(new_position_index, this.keyboardNavigationCurrentElementIndex)) {
            new_position_index = this.keyboardNavigationCurrentElementIndex;
        }

        this.markCurrentElement(new_position_index);
        readActivatedElementConnections();
    };

    ConnectionKeyboardController.prototype.enter = function (event) {
        if (event.shiftKey || event.ctrlKey) {
            Object.getPrototypeOf(ConnectionKeyboardController.prototype).escape.call(this);
        } else {
            Object.getPrototypeOf(ConnectionKeyboardController.prototype).enter.call(this);
            readActivatedElementConnections();
        }
    };

    ConnectionKeyboardController.prototype.select = function (event) {
        event.preventDefault();
        if (presenter.getCurrentActivatedElement().hasClass('selected')) {
            speak([getTextVoiceObject(presenter.speechTexts.deselected)]);
        }

        Object.getPrototypeOf(ConnectionKeyboardController.prototype).select.call(this);

        if (presenter.getCurrentActivatedElement().hasClass('selected')) {
            speak([getTextVoiceObject(presenter.speechTexts.selected)]);
        }
    };


    presenter.__internal__ = {
        Line: Line
    };

    function drawSVGLine(svg, firstID, secondID, correctLine, model) {
        var leftSize = model["Left column"].length;

        var isFirstIDInLeftColumn = false;
        var isFirstIDInRightColumn = false;
        var isSecondIDInLeftColumn = false;
        var isSecondIDInRightColumn = false;

        for (var i = 0; i < presenter.elements.length; i++) {
            if (presenter.elements[i].id == firstID) {
                if (i < leftSize) {
                    isFirstIDInLeftColumn = true;
                } else {
                    isFirstIDInRightColumn = true;
                }
            }
            if (presenter.elements[i].id == secondID) {
                if (i < leftSize) {
                    isSecondIDInLeftColumn = true;
                } else {
                    isSecondIDInRightColumn = true;
                }
            }
        }

        if (
            (!isFirstIDInLeftColumn && !isFirstIDInRightColumn)
            ||
            (!isSecondIDInLeftColumn && !isSecondIDInRightColumn)) {
            return;
        }
        if (!isFirstIDInLeftColumn && !isSecondIDInRightColumn
            && isFirstIDInRightColumn && isSecondIDInLeftColumn) {
            var tmp = secondID;
            secondID = firstID;
            firstID = tmp;
        }

        drawSVGLineLeftToRight(svg, firstID, secondID, correctLine, model);

    }

    function drawSVGLineLeftToRight(svg, leftID, rightID, correctLine, model) {
        var leftSize = model["Left column"].length;
        var leftTotalSize = 0;
        var rightTotalSize = 0;
        var leftPos = 0;
        var rightPos = 0;

        for (var i = 0; i < presenter.elements.length; i++) {

            if (presenter.elements[i].id == leftID) {
                leftPos = leftTotalSize + presenter.elements[i].element.closest('tr').outerHeight(true) / 2;
            } else if (presenter.elements[i].id == rightID) {
                rightPos = rightTotalSize + presenter.elements[i].element.closest('tr').outerHeight(true) / 2;
            }

            if (i < leftSize) {
                leftTotalSize += presenter.elements[i].element.closest('tr').outerHeight(true);
            } else {
                rightTotalSize += presenter.elements[i].element.closest('tr').outerHeight(true);
            }
        }
        var leftY = 100.0 * leftPos / leftTotalSize + "%";
        var rightY = 100.0 * rightPos / rightTotalSize + "%";
        var $line = correctLine
            ? $('<line class="correctConnectionLine" x1="0" x2="100%" style="stroke: rgb(0, 0, 0); stroke-width: 1;" />')
            : $('<line class="inCorrectConnectionLine" x1="0" x2="100%" style="stroke: rgb(0, 0, 0); stroke-width: 1;" stroke-dasharray="4" />');
        $line.attr('y1', leftY);
        $line.attr('y2', rightY);
        svg.append($line);
    }

    presenter.setPrintableController = function (controller) {
        presenter.printableController = controller;
    };

    presenter.setPrintableState = function(state) {
        if (state === null || ModelValidationUtils.isStringEmpty(state))
            return;
        presenter.printableState = JSON.parse(state);
    }

    presenter.isPrintableAsync = function() {
        return true;
    }

    presenter.setPrintableAsyncCallback = function(id, callback) {
        presenter.printableParserID = id;
        presenter.printableParserCallback = callback;
    }

    function getCorrectAnswersObject(model) {
        var correctAnswers = [];
        var idx = 0;
        for (var i = 0; i < model["Left column"].length; i++) {
            var element = presenter.elements[i];
            var id = element.id;
            var correctAnswersValues = element.connects.split(',');
            if (correctAnswersValues.length == 0) {
                correctAnswers[idx] = {
                    'id': id,
                    'answer': null
                };
                idx++;
            } else {
                correctAnswersValues.forEach(function (answer) {
                    correctAnswers[idx] = {
                        'id': id,
                        'answer': answer
                    };
                    idx++;
                });
            }
        }
        return correctAnswers;
    }

    function isPrintableShowAnswersStateMode () {
        return presenter.printableStateMode === presenter.PRINTABLE_STATE_MODE.SHOW_ANSWERS;
    }
    function isPrintableShowUserAnswersStateMode () {
        return presenter.printableStateMode === presenter.PRINTABLE_STATE_MODE.SHOW_USER_ANSWERS;
    }
    function isPrintableCheckAnswersStateMode () {
        return presenter.printableStateMode === presenter.PRINTABLE_STATE_MODE.CHECK_ANSWERS;
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

    function isCorrectConnection (correctAnswers, connection) {
        for (var i = 0; i < correctAnswers.length; i++) {
            var answer = correctAnswers[i];
            if (answer.id == connection[0] && answer.answer == connection[1]) return true;
        }
        return false;
    }

    presenter.getPrintableHTML = function (model, showAnswers) {
        chosePrintableStateMode(showAnswers);
        model = presenter.upgradeModel(model);
        var savedState = presenter.printableState;
        var isCheckAnswers = isPrintableCheckAnswersStateMode();
        var answerLeftColumn = isCheckAnswers ? 
        '<td class="answersLeftColumn">' +
            '<table class="content"></table>' +
        '</td>' : ''

        var answerRightColumn = isCheckAnswers ? 
        '<td class="answersRightColumn">' +
            '<table class="content"></table>' +
        '</td>' : ''
        
        var $root = $("<div></div>");
        $root.attr('id', model.ID);
        $root.addClass('printable_addon_Connection');
        $root.css("max-width", model["Width"]+"px");
        $root.html(
            '<table class="connectionContainer">' +
                '<tr>' +
                    answerLeftColumn +
                    '<td class="connectionLeftColumn">' +
                        '<table class="content"></table>' +
                    '</td>' +
                    '<td class="connectionMiddleColumn">' +
                        '<svg class="connections"></svg>' +
                    '</td>' +
                    '<td class="connectionRightColumn">' +
                        '<table class="content"></table>' +
                    '</td>' +
                    answerRightColumn +
                '</tr>' +
            '</table>');

        var isRandomLeft = ModelValidationUtils.validateBoolean(model['Random order left column']);
        var isRandomRight = ModelValidationUtils.validateBoolean(model['Random order right column']);
        if (!isRandomLeft) {
            this.loadElements($root[0], model, 'connectionLeftColumn', 'Left column', false, isCheckAnswers);
        } else {
            this.loadRandomElementsLeft($root[0], model, 'connectionLeftColumn', 'Left column', false);
        }
        if (!isRandomRight) {
            this.loadElements($root[0], model, 'connectionRightColumn', 'Right column', true, isCheckAnswers);
        } else {
            this.loadRandomElementsRight($root[0], model, 'connectionRightColumn', 'Right column', true);
        }
        this.setColumnsWidth($root[0], model["Columns width"]);
        presenter.removeNonVisibleInnerHTMLForRoot($root);

        var correctAnswers = getCorrectAnswersObject(model);

        if (isCheckAnswers) {
            presenter.addAnswersElements($root[0], model, correctAnswers);
        }

        var connected = [];
        if (isPrintableShowAnswersStateMode()) {
            for (var i = 0; i < correctAnswers.length; i++) {
                if (correctAnswers[i].answer) {
                    connected.push({
                        from: correctAnswers[i].id,
                        to: correctAnswers[i].answer,
                        correct: true
                    });
                }
            }
        } else if (isPrintableShowUserAnswersStateMode()) {
            for (var i = 0; i < savedState.id.length; i++) {
                var pair = savedState.id[i].split(':');
                connected.push({
                    from: pair[0],
                    to: pair[1],
                    correct: true
                });
            }
        } else if (isCheckAnswers) {
            for (var i = 0; i < savedState.id.length; i++) {
                var pair = savedState.id[i].split(':');
                connected.push({
                    from: pair[0],
                    to: pair[1],
                    correct: isCorrectConnection(correctAnswers, pair)
                });
            }
        }

        $root.css('visibility', 'hidden');
        $('body').append($root);
        waitForLoad($root, function(){
            if (connected.length > 0) {
                var connectionsSVG = $root.find('svg');
                for (var i = 0; i < connected.length; i++) {
                    var connection = connected[i];
                    drawSVGLine(connectionsSVG, connection.from, connection.to, connection.correct, model);
                }
            }
            $root.detach();
            $root.css('visibility', '');
            var height = getPrintableTableHeight($root);
            $root.css("height", height+"px");
            var parsedView = $root[0].outerHTML;
            $root.remove();
            presenter.printableParserCallback(parsedView);
        });

        var $clone = $root.clone();
        $clone.attr('id', presenter.printableParserID);
        $clone.css('visibility', '');
        var result = $clone[0].outerHTML;
        $clone.remove();


        return result;
    };

    function waitForLoad($element, callback) {
        var $imgs = $element.find('img');
        var loadCounter = $imgs.length + 2;
        var timeout = null;
        var continuedParsing = false;

        var loadCallback = function(){
            loadCounter -= 1;
            if (loadCounter < 1 && isReady && !continuedParsing) {
                continuedParsing = true;
                if (timeout) clearTimeout(timeout);
                callback();
            }
        };

        $imgs.each(function(){
            var $this = $(this);
            if (this.complete && this.naturalHeight !== 0) {
                loadCallback();
            } else {
                $this.load(loadCallback);
            }
        });

        $element.ready(function(){
            isReady = true;
            loadCallback();
        });

        var timeout = setTimeout(function(){
            if (loadCounter > 0 || isReady == false) {
                isReady = true;
                loadCounter = 0;
                loadCallback();
            }
        }, 15000);

        var args = [];
        args.push("Typeset", MathJax.Hub, $element[0]);
        args.push(loadCallback);
        MathJax.Hub.Queue(args);
    }

    return presenter;
}

function getPrintableTableHeight($table) {
        var $outerLessonWrapper = $("<div></div>");
        $outerLessonWrapper.css("position", "absolute");
        $outerLessonWrapper.css("visibility", "hidden");
        $outerLessonWrapper.addClass("printable_lesson");

        var $outerPageWrapper = $("<div></div>");
        $outerPageWrapper.addClass("printable_page");
        $outerLessonWrapper.append($outerPageWrapper);

        var $outerModuleWrapper = $("<div></div>");
        $outerModuleWrapper.addClass("printable_module");
        $outerModuleWrapper.addClass("printable_addon_Connection");
        $outerPageWrapper.append($outerModuleWrapper);

		$outerModuleWrapper.append($table);

		$("body").append($outerLessonWrapper);
		var height = $table[0].getBoundingClientRect().height;
		$outerLessonWrapper.remove();
		$table.remove();
		return height;
    }

AddonConnection_create.__supported_player_options__ = {
    resetInterfaceVersion: 2
};
