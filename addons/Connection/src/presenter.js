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
    var currentLayoutName = "";

    presenter.uniqueIDs = [];
    presenter.elements = [];
    presenter.lastClickTime = 0;
    presenter.lastEvent = null;
    presenter.disabledConnections = [];
    presenter.keyboardControllerObject = null;
    presenter.speechTexts = {};
    presenter.columnSizes = {};
    presenter.lineStackSA = [];

    presenter.isShowAnswersActive = false;
    presenter.isGradualShowAnswersActive = false;
    presenter.GSAcounter = 0;
    presenter.isCheckActive = false;
    presenter.initialState = null;
    presenter.isHorizontal = false;

    presenter.mathJaxLoaders = {
        runLoaded: false,
        setStateLoaded: true,
    };

    presenter.PRINTABLE_STATE_MODE = {
        EMPTY: 0,
        SHOW_ANSWERS: 1,
        SHOW_USER_ANSWERS: 2,
        CHECK_ANSWERS: 3
    };

    presenter.printableState = null;
    presenter.printableParserID = "";
    presenter.printableParserCallback = null;
    presenter.printableClassNames = [];
    presenter.printableStateMode = presenter.PRINTABLE_STATE_MODE.EMPTY;

    presenter.CSS_CLASSES = {
        CONNECTION_CONTAINER: "connectionContainer",
        CONNECTIONS_LEFT_COLUMN: "connectionLeftColumn",
        CONNECTIONS_MIDDLE_COLUMN: "connectionMiddleColumn",
        CONNECTIONS_RIGHT_COLUMN: "connectionRightColumn",
        CONNECTIONS_TOP_ROW: "connectionTopRow",
        CONNECTIONS_MIDDLE_ROW: "connectionMiddleRow",
        CONNECTIONS_BOTTOM_ROW: "connectionBottomRow",
        CONTENT: "content",
        CONNECTIONS: "connections",
        CONNECTION_ITEM: "connectionItem",
        CONNECTION_ITEM_WRAPPER: "connectionItemWrapper",
        ICON: "icon",
        ICON_WRAPPER: "iconWrapper",
        INNER: "inner",
        INNER_WRAPPER: "innerWrapper",
        SELECTED: "selected",
    };

    var deferredCommandQueue = window.DecoratorUtils.DeferredSyncQueue(checkIsMathJaxLoaded);

    function checkIsMathJaxLoaded() {
        return presenter.mathJaxLoaders.runLoaded
            && presenter.mathJaxLoaders.setStateLoaded
    }

    var connections;
    var selectedItem = null;

    presenter.lineStack = new LineStack(true);
    presenter.correctConnections = new LineStack(false);
    var isSelectionPossible = true;
    var isRTL = false;


    var CORRECT_ITEM_CLASS = 'connectionItem-correct';
    var WRONG_ITEM_CLASS = 'connectionItem-wrong';

    presenter.ERROR_MESSAGES = {
        'ID not unique': 'One or more IDs are not unique.',
        'One or two not exist': 'Provided id for initial value doesn\'t exists',
        'Are from the same column': 'Provided ids for initial value are in the same column',
        'Are from the same row': 'Provided ids for initial value are in the same row',
        'Orientation layout duplication': 'More than one orientation has been assigned for at least one layout.'
    };

    presenter.ELEMENT_SIDE = {
        LEFT: 0,
        RIGHT: 1
    };

    function isEnabledOrMultiLineMode(element) {
        if (!presenter.configuration.isSingleConnectionMode) {
            return true;
        }

        var elementId = convertId($(element).attr('id'));

        for (var i = 0; i < presenter.configuration.initialConnections.length; i++) {
            var initialValue = presenter.configuration.initialConnections[i];

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
        };
    }

    function isOneOfValuesEmpty(initialValue) {
        return initialValue.from.trim() === "" && initialValue.to.trim() === "";
    }

    presenter.getCurrentActivatedElement = function () {
        return $('.keyboard_navigation_active_element');
    };

    presenter.upgradeModel = function (model) {
        let upgradedModel = presenter.upgradeFrom_01(model);
        upgradedModel = presenter.upgradeStartValues(upgradedModel);
        upgradedModel = presenter.upgradeOrientations(upgradedModel);
        upgradedModel = presenter.upgradeLangTag(upgradedModel);
        upgradedModel = presenter.upgradeSpeechTexts(upgradedModel);

        return upgradedModel;
    };

    presenter.upgradeLangTag = function (model) {
        const upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (upgradedModel["langAttribute"] === undefined) {
            upgradedModel["langAttribute"] =  '';
        }

        return upgradedModel;
    };

    presenter.upgradeSpeechTexts = function (model) {
        const upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if (!upgradedModel["speechTexts"]) {
            upgradedModel["speechTexts"] = {};
        }
        if (!upgradedModel["speechTexts"]["Connected"]) {
            upgradedModel["speechTexts"]["Connected"] = {Connected: ""};
        }
        if (!upgradedModel["speechTexts"]["Disconnected"]) {
            upgradedModel["speechTexts"]["Disconnected"] = {Disconnected: ""};
        }
        if (!upgradedModel["speechTexts"]["Selected"]) {
            upgradedModel["speechTexts"]["Selected"] = {Selected: ""};
        }
        if (!upgradedModel["speechTexts"]["Deselected"]) {
            upgradedModel["speechTexts"]["Deselected"] = {Deselected: ""};
        }
        if (!upgradedModel["speechTexts"]["Correct"]) {
            upgradedModel["speechTexts"]["Correct"] = {Correct: ""};
        }
        if (!upgradedModel["speechTexts"]["Wrong"]) {
            upgradedModel["speechTexts"]["Wrong"] = {Wrong: ""};
        }
        if (!upgradedModel["speechTexts"]["ConnectedTo"]) {
            upgradedModel["speechTexts"]["ConnectedTo"] = {"Connected to": ""};
        }

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

    presenter.upgradeOrientations = function (model) {
        const upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (upgradedModel["Orientations"] === undefined) {
            upgradedModel["Orientations"] = [];
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
                if (score == 0 && presenter.configuration.blockWrongAnswers) {
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

            for (var i = 0; i < presenter.configuration.initialConnections.length; i++) {
                var initialValue = presenter.configuration.initialConnections[i];

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

    presenter.showErrorMessage = function (view, errorCode) {
        return $(view).html(presenter.ERROR_MESSAGES[errorCode]);
    };

    presenter.parseDefinitionLinks = function () {
        $.each(presenter.$view.find('.' + presenter.CSS_CLASSES.INNER_WRAPPER), function (index, element) {
            const sanitizedLink = window.xssUtils.sanitize(presenter.textParser.parse($(element).html()));
            $(element).html(sanitizedLink);
        });

        presenter.textParser.connectLinks(presenter.$view);
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
        presenter.removeNonVisibleInnerHTMLForRoot(presenter.$view);

    };

    presenter.removeNonVisibleInnerHTMLForRoot = function ($root) {
        $.each($root.find('.' + presenter.CSS_CLASSES.INNER_WRAPPER), function (index, element) {
            var newInnerHtml = $(element).html().replace(/\\alt{([^{}|]*?)\|[^{}|]*?}(\[[a-zA-Z0-9_\- ]*?\])*/g, '$1'); // replace \alt{a|b}[c] with a
            $(element).html(newInnerHtml.replace(/\\alt{([^|{}]*?)\|[^|{}]*?}/g, '$1')); // replace \alt{a|b} with a
        });
    };

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

    presenter.setLengthOfSideObjects = function (view) {
        const $firstSide = $(view).find("." + presenter.getFirstSideCSSClassName() + ":first");
        const $middleSide = $(view).find("." + presenter.getMiddleSideCSSClassName() + ":first");
        const $secondSide = $(view).find("." + presenter.getSecondSideCSSClassName() + ":first");

        let firstSideLength, middleSideLength, secondSideLength;
        if (presenter.isHorizontal) {
            firstSideLength = "auto";
            middleSideLength = "auto";
            secondSideLength = "auto";
        } else {
            firstSideLength = presenter.configuration.columnsWidth.left;
            middleSideLength = presenter.configuration.columnsWidth.middle;
            secondSideLength = presenter.configuration.columnsWidth.right;

            if (!firstSideLength) firstSideLength = "auto";
            if (!middleSideLength) middleSideLength = "auto";
            if (!secondSideLength) secondSideLength = "auto";
        }

        const propertyName = presenter.isHorizontal ? "height" : "width";
        $firstSide.css(propertyName, firstSideLength);
        $middleSide.css(propertyName, middleSideLength);
        $secondSide.css(propertyName, secondSideLength);
    };

    presenter.run = function (view, model) {
        addonID = model.ID;

        presenter.initialize(view, model, false);

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
        model = presenter.parseAddonGaps(model);
        presenter.lineStack = new LineStack(false);
        presenter.initialize(view, model, true);
    };

    presenter.setVisibility = function (isVisible) {
        presenter.$view.css('visibility', isVisible ? 'visible' : 'hidden');
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
        presenter.isVisible = false;
    };

    presenter.show = function () {
        presenter.setVisibility(true);
        presenter.isVisible = true;
    };

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
            connected: TTSUtils.getSpeechTextProperty(speechTexts['Connected']['Connected'], presenter.speechTexts.connected),
            disconnected: TTSUtils.getSpeechTextProperty(speechTexts['Disconnected']['Disconnected'], presenter.speechTexts.disconnected),
            connectedTo: TTSUtils.getSpeechTextProperty(speechTexts['ConnectedTo']['Connected to'], presenter.speechTexts.connectedTo),
            selected: TTSUtils.getSpeechTextProperty(speechTexts['Selected']['Selected'], presenter.speechTexts.selected),
            deselected: TTSUtils.getSpeechTextProperty(speechTexts['Deselected']['Deselected'], presenter.speechTexts.deselected),
            correct: TTSUtils.getSpeechTextProperty(speechTexts['Correct']['Correct'], presenter.speechTexts.correct),
            wrong: TTSUtils.getSpeechTextProperty(speechTexts['Wrong']['Wrong'], presenter.speechTexts.wrong)
        };
    }

    presenter.addDisabledElementsFromInitialValues = function () {
        presenter.configuration.initialConnections.forEach(function (initialValue) {
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

    presenter.validateInitialConnection = function (initialValue) {
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
                return getErrorObject("One or two not exist");
            } else if (!areFromDifferentCols()) {
                const errorCode = presenter.isHorizontal ? "Are from the same row" : "Are from the same column";
                return getErrorObject(errorCode);
            }
        }

        return getValidObject(initialValue);
    };

    presenter.validateInitialConnections = function (initialConnections) {
        for (let validatedInitialValue, i = 0; i < initialConnections.length; i++) {
            validatedInitialValue = presenter.validateInitialConnection(initialConnections[i]);
            if (!validatedInitialValue.isValid) {
                return validatedInitialValue;
            }
        }

        return getValidObject(initialConnections);
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
            presenter.configuration.initialConnections.forEach(presenter.drawInitialValue);
        }

        presenter.redraw();

        this.lineStack.setSendEvents(true);
    };

    presenter.initialize = function (view, model, isPreview) {
        model = presenter.upgradeModel(model);
        presenter.model = model;
        presenter.view = view;
        presenter.$view = $(view);

        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_MESSAGES, presenter.configuration.errorCode);
            return false;
        }

        presenter.chooseOrientation(model, isPreview);
        presenter.setUpViewBody(presenter.view);
        connections = presenter.$view.find('.' + presenter.CSS_CLASSES.CONNECTIONS + ':first');

        presenter.isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);
        presenter.isVisibleByDefault = ModelValidationUtils.validateBoolean(model["Is Visible"]);
        presenter.setVisibility(presenter.isVisible || isPreview);
        isRTL = presenter.$view.css('direction').toLowerCase() === 'rtl';

        presenter.loadElements(view, model);

        const $connectionContainer = $("." + presenter.CSS_CLASSES.CONNECTION_CONTAINER);
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
                    presenter.mathJaxLoaders.runLoaded = true;
                    deferredCommandQueue.resolve();
                })
                presenter.registerListeners(presenter.view);
            });
        }

        setSpeechTexts(model["speechTexts"]);
        presenter.gatherCorrectConnections();
        presenter.buildKeyboardController();
    };

    presenter.validateModel = function (model) {
        const validatedOrientations = presenter.validateOrientations(model["Orientations"]);
        if (!validatedOrientations.isValid) {
            return validatedOrientations;
        }

        const initialValues = presenter.getInitialValues(model);
        const validatedInitialConnections = presenter.validateInitialConnections(initialValues.initialConnections)
        if (!validatedInitialConnections.isValid) {
            return validatedInitialConnections;
        }

        return {
            isValid: true,
            addonID: model["ID"],
            langTag: model["langAttribute"],
            isNotActivity: ModelValidationUtils.validateBoolean(model["isNotActivity"] || "False"),
            blockWrongAnswers: ModelValidationUtils.validateBoolean(model.blockWrongAnswers),
            removeDraggedElement: ModelValidationUtils.validateBoolean(model.removeDraggedElement),
            isTabindexEnabled: ModelValidationUtils.validateBoolean(model["Is Tabindex Enabled"]),
            connectionThickness: getModelValue(model, "Connection thickness", "1px"),
            defaultConnectionColor: getModelValue(model, "Default connection color", "#000"),
            correctConnectionColor: getModelValue(model, "Correct connection color", "#0d0"),
            incorrectConnectionColor: getModelValue(model, "Incorrect connection color", "#d00"),
            showAnswersLineColor: getModelValue(model, "Show answers line color", "#0d0"),
            isSingleConnectionMode: model["Single connection mode"].toLowerCase() === "true",
            orientations: validatedOrientations.value,
            initialConnections: initialValues.initialConnections,
            disabledConnectionColor: initialValues.disabledConnectionColor,
            columnsWidth: model["Columns width"][0],
        };
    };

    function getModelValue(model, modelKey, defaultValue) {
        return model[modelKey] != '' ? model[modelKey] : defaultValue;
    }

    presenter.validateOrientations = function (orientations) {
        const usedLayoutNames = [];
        for (let orientationConfig, i = 0; i < orientations.length; i++) {
            orientationConfig = orientations[i];
            if (usedLayoutNames.includes(orientationConfig.Layout)) {
                return getErrorObject("Orientation layout duplication");
            }
            usedLayoutNames.push(orientationConfig.Layout);
        }
        return getValidObject(orientations);
    }

    function getValidObject(value) {
        return {
            isValid: true,
            value: value
        }
    }

    function getErrorObject(errorCode, itemIndex = undefined) {
        return {
            isValid: false,
            errorCode: errorCode,
            itemIndex: itemIndex
        }
    }

    presenter.setCurrentLayoutName = function(layoutName) {
        currentLayoutName = layoutName;
    }

    presenter.chooseOrientation = function (model, isPreview) {
        presenter.isHorizontal = false;
        if (!playerController && !isPreview) {
            return;
        }

        for (let orientationConfig, i = 0; i < model["Orientations"].length; i++) {
            orientationConfig = model["Orientations"][i];
            if (orientationConfig.Layout === currentLayoutName) {
                presenter.isHorizontal = orientationConfig.Orientation === "Horizontal";
                return;
            }
        }
    }

    /**
     * Expand the view with a body consisting of three empty objects (objects without elements):
     * 1. Object in which the elements from the first side will be placed (left column/top row).
     * 2. Object for creating connections (middle column/middle row).
     * 3. Object in which the elements from the second side will be placed (right column/bottom row).
     * If isHorizontal then sides are created as rows, otherwise as columns.
     * @return undefined
    **/
    presenter.setUpViewBody = function (view) {
        $(view).attr("lang", presenter.configuration.langTag);

        const elementToExpand = view.getElementsByClassName(presenter.CSS_CLASSES.CONNECTION_CONTAINER)[0];
        const viewBody = presenter.isHorizontal ? createEmptyHorizontalViewBody() : createEmptyVerticalViewBody();
        elementToExpand.append(viewBody);

        presenter.setLengthOfSideObjects(view);
    }

    function createEmptyHorizontalViewBody() {
        const viewBody = document.createElement("tbody");

        appendHorizontalViewBodyTopRow(viewBody);
        appendHorizontalViewBodyMiddleRow(viewBody);
        appendHorizontalViewBodyBottomRow(viewBody);

        return viewBody;
    }

    function appendHorizontalViewBodyTopRow(view) {
        const cellContent = createCellContent();
        const row = createHorizontalViewBodyRow(presenter.CSS_CLASSES.CONNECTIONS_TOP_ROW, cellContent);
        view.append(row);
    }

    function appendHorizontalViewBodyMiddleRow(view) {
        const cellContent = createCellCanvas();
        const row = createHorizontalViewBodyRow(presenter.CSS_CLASSES.CONNECTIONS_MIDDLE_ROW, cellContent);
        view.append(row);
    }

    function appendHorizontalViewBodyBottomRow(view) {
        const cellContent = createCellContent();
        const row = createHorizontalViewBodyRow(presenter.CSS_CLASSES.CONNECTIONS_BOTTOM_ROW, cellContent);
        view.append(row);
    }

    function createHorizontalViewBodyRow(className, content) {
        const row = document.createElement("tr");
        row.classList.add(className);

        const cell = document.createElement("td");
        cell.append(content);
        row.append(cell);
        return row;
    }

    function createEmptyVerticalViewBody() {
        const viewBody = document.createElement("tbody");

        const sharedRow = document.createElement("tr");
        viewBody.append(sharedRow);

        appendHorizontalViewBodyLeftColumn(sharedRow);
        appendHorizontalViewBodyMiddleColumn(sharedRow);
        appendHorizontalViewBodyBottomColumn(sharedRow);

        return viewBody;
    }

    function appendHorizontalViewBodyLeftColumn(view) {
        const cellContent = createCellContent();
        const column = createVerticalViewBodyColumn(presenter.CSS_CLASSES.CONNECTIONS_LEFT_COLUMN, cellContent);
        view.append(column);
    }

    function appendHorizontalViewBodyMiddleColumn(view) {
        const cellContent = createCellCanvas();
        const column = createVerticalViewBodyColumn(presenter.CSS_CLASSES.CONNECTIONS_MIDDLE_COLUMN, cellContent);
        view.append(column);
    }

    function appendHorizontalViewBodyBottomColumn(view) {
        const cellContent = createCellContent();
        const column = createVerticalViewBodyColumn(presenter.CSS_CLASSES.CONNECTIONS_RIGHT_COLUMN, cellContent);
        view.append(column);
    }

    function createVerticalViewBodyColumn(className, content) {
        const cell = document.createElement("td");
        cell.classList.add(className);
        cell.append(content);
        return cell;
    }

    function createCellCanvas() {
        const canvas = document.createElement("canvas");
        canvas.classList.add(presenter.CSS_CLASSES.CONNECTIONS);
        return canvas;
    }

    function createCellContent() {
        const content = document.createElement("table");
        content.classList.add(presenter.CSS_CLASSES.CONTENT);

        const contentBody = document.createElement("tbody");
        content.append(contentBody);

        return content;
    }

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

    presenter.getFirstSideCSSClassName = function () {
        return presenter.isHorizontal
            ? presenter.CSS_CLASSES.CONNECTIONS_TOP_ROW
            : presenter.CSS_CLASSES.CONNECTIONS_LEFT_COLUMN;
    };

    presenter.getMiddleSideCSSClassName = function () {
        return presenter.isHorizontal
            ? presenter.CSS_CLASSES.CONNECTIONS_MIDDLE_ROW
            : presenter.CSS_CLASSES.CONNECTIONS_MIDDLE_COLUMN;
    };

    presenter.getSecondSideCSSClassName = function () {
        return presenter.isHorizontal
            ? presenter.CSS_CLASSES.CONNECTIONS_BOTTOM_ROW
            : presenter.CSS_CLASSES.CONNECTIONS_RIGHT_COLUMN;
    };

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
        if (!$(element).hasClass(presenter.CSS_CLASSES.SELECTED) && selectedItem == null) { // first element selected
            $(element).parent().find('.connectionItem').removeClass(presenter.CSS_CLASSES.SELECTED);
            $(element).addClass(presenter.CSS_CLASSES.SELECTED);
            selectedItem = $(element);
            return;
        }
        if (selectedItem != null && $(element).get(0) == selectedItem.get(0)) { // clicking the selected element again
            $(element).removeClass(presenter.CSS_CLASSES.SELECTED);
            selectedItem = null;
            return;
        }
        const firstSideClassName = presenter.getFirstSideCSSClassName();
        const secondSideClassName = presenter.getSecondSideCSSClassName();
        if (selectedItem != null &&
            ($(element).parents(`.${firstSideClassName}`).get(0) == selectedItem.parents(`.${firstSideClassName}`).get(0) ||
                $(element).parents(`.${secondSideClassName}`).get(0) == selectedItem.parents(`.${secondSideClassName}`).get(0))) {
            // element clicked in the same column
            var linesToSwitch = [];
            if (presenter.configuration.isSingleConnectionMode) {
                for (var i = 0; i < presenter.lineStack.length(); i++) {
                    if (presenter.lineStack.get(i).connects(selectedItem)) {
                        linesToSwitch.push(presenter.lineStack.get(i))
                    }
                }
            }

            selectedItem.removeClass(presenter.CSS_CLASSES.SELECTED);
            if (linesToSwitch.length == 0) {
                $(element).addClass(presenter.CSS_CLASSES.SELECTED);
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

            if (presenter.configuration.isSingleConnectionMode) {
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
        if (presenter.$view.find('#connection_line_tmp').length > 0) {
            presenter.$view.find('#connection_line_tmp').remove();
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
        presenter.$view.prepend(div);
        presenter.$view.find('#connection_line_tmp').css({
            'left': x1,
            'top': y1,
            'width': d,
            'background-color': presenter.configuration.defaultConnectionColor,
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
        presenter.$connectionContainer = $(view).find('.' + presenter.CSS_CLASSES.CONNECTION_CONTAINER);
        presenter.$connectionContainer.click(function (e) {
            e.preventDefault();
            e.stopPropagation();
        });

        const $firstSide = $(view).find('.' + this.getFirstSideCSSClassName());
        $firstSide.click(function (e) {
            e.preventDefault();
            e.stopPropagation();
        });

        const $secondSide = $(view).find('.' + this.getSecondSideCSSClassName());
        $secondSide.click(function (e) {
            e.preventDefault();
            e.stopPropagation();
        });

        const $item = $(view).find('.' + presenter.CSS_CLASSES.CONNECTION_ITEM);
        $item.on('touchstart', function (e) {
            e.preventDefault();
            e.stopPropagation();
            presenter.lastEvent = e;
        });

        let scale = playerController.getScaleInformation();
        let draggedElementColumn;

        var android_ver = MobileUtils.getAndroidVersion(window.navigator.userAgent);
        if (["4.1.1", "4.2.2", "4.4.2"].indexOf(android_ver) === -1 || window.navigator.userAgent.indexOf('Chrome') > 0) {
            $item.each(function () {
                var e = $(this);
                e.draggable({
                    revert: presenter.configuration.removeDraggedElement ? true : "invalid",
                    opacity: presenter.configuration.removeDraggedElement ? 1 : 0.7,
                    helper: presenter.configuration.removeDraggedElement ? "original" : "clone",
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
                        var $iconWrapper = $(e).find("." + presenter.CSS_CLASSES.ICON_WRAPPER);
                        scale = playerController.getScaleInformation();

                        let height = $iconWrapper.height();
                        !presenter.isHorizontal && (height /= 2);
                        let width = $iconWrapper.width();
                        presenter.isHorizontal && (width /= 2);
                        presenter.iconTop = $iconWrapper.position().top / scale.scaleY + height;
                        presenter.iconLeft = $iconWrapper.position().left / scale.scaleX + width;

                        if (!isSelectionPossible) {
                            event.stopPropagation();
                            event.preventDefault();
                            return;
                        }
                        $item.removeClass(presenter.CSS_CLASSES.SELECTED);
                        selectedItem = null;
                        ui.helper.zIndex(100);
                        clickLogic(this);
                        if (presenter.configuration.removeDraggedElement) {
                            ui.helper.find('.icon').hide();
                            ui.helper.removeClass(presenter.CSS_CLASSES.SELECTED);
                        } else {
                            ui.helper.find('.icon').remove();
                            ui.helper.width($(this).find('.inner').width());
                            ui.helper.height($(this).find('.inner').height());
                        }
                        if ($(this).parents('.' + presenter.getFirstSideCSSClassName()).length) {
                            draggedElementColumn = 'left';
                        } else {
                            draggedElementColumn = 'right';
                        }
                    },
                    drag: function (event, ui) {
                        presenter.mouseSX = parseInt(event.pageX, 10) - parseInt(presenter.$view.offset().left, 10);
                        presenter.mouseSY = parseInt(event.pageY, 10) - parseInt(presenter.$view.offset().top, 10);

                        presenter.drawTempLine(presenter.mouseSX / scale.scaleX, presenter.mouseSY / scale.scaleY);
                    },
                    stop: function (event, ui) {
                        ui.helper.zIndex(0);
                        if (presenter.configuration.removeDraggedElement) {
                            ui.helper.find('.icon').show();
                        } else {
                            ui.helper.remove();
                        }
                        presenter.redraw();
                        if (presenter.$view.find('#connection_line_tmp').length > 0) {
                            presenter.$view.find('#connection_line_tmp').remove();
                        }
                    }
                });

                e.droppable({
                    tolerance: "pointer",
                    drop: function (event, ui) {
                        $(this).removeClass(presenter.CSS_CLASSES.SELECTED);
                        basicClickLogic(this);
                        ui.draggable.removeClass(presenter.CSS_CLASSES.SELECTED);
                        if (presenter.lastEvent) {
                            presenter.lastEvent.type = "touchend";
                        }
                    },
                    over: function (event, ui) {
                        var elementColumn;
                        if ($(this).parents('.' + presenter.getFirstSideCSSClassName()).length) {
                            elementColumn = 'left';
                        } else {
                            elementColumn = 'right';
                        }
                        if (elementColumn != draggedElementColumn) {
                            $(this).addClass(presenter.CSS_CLASSES.SELECTED);
                        }
                    },
                    out: function (event, ui) {
                        $(this).removeClass(presenter.CSS_CLASSES.SELECTED);
                    }
                });
            });
        } else {
            $item.on('mouseleave', function (e) {
                e.stopPropagation();
            });

            $item.on('mouseenter', function (e) {
                e.stopPropagation();
            });

            $item.on('mouseup', function (e) {
                e.stopPropagation();
            });

            $item.on('mousedown', function (e) {
                e.stopPropagation();
            });

            $item.on('mouseover', function (e) {
                e.stopPropagation();
            });

            $item.on('mouseout', function (e) {
                e.stopPropagation();
            });
        }
        $item.on('touchend', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (presenter.lastEvent.type != e.type) {
                presenter.isClicked = false;
                clickLogic(this);
                presenter.isClicked = true;
            }
        });

        $item.click(function (e) {
            e.stopPropagation();
            if (!presenter.isClicked) {
                clickLogic(this);
            }
        });
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

    presenter.loadElements = function (view, model) {
        loadElementsToFirstSide(view, model);
        loadElementsToSecondSide(view, model);
    };

    function loadElementsToFirstSide(view, model) {
        loadElementsToSide(view, model, true);
    }

    function loadElementsToSecondSide(view, model) {
        loadElementsToSide(view, model, false);
    }

    function loadElementsToSide(view, model, isFirstSide) {
        const parentToLoadElements = findParentToLoadElements(view, isFirstSide);

        const itemsModelKey = isFirstSide ? "Left column" : "Right column";
        const itemsModel = model[itemsModelKey];
        const itemsInOneSideNumber = itemsModel.length;
        presenter.columnSizes[itemsModelKey] = model[itemsModelKey].length;

        const isRandomOrderKey = isFirstSide ? "Random order left column" : "Random order right column";
        const isRandomOrder = ModelValidationUtils.validateBoolean(model[isRandomOrderKey]);

        let rowToLoad;
        const orderedIndexes = getOrderedIndexes(itemsInOneSideNumber, isRandomOrder);
        for (let nextIndex, i = 0; i < itemsInOneSideNumber; i++) {
            nextIndex = orderedIndexes[i];
            if (!presenter.isIDUnique(itemsModel[nextIndex]["id"])) {
                return presenter.showErrorMessage("ID not unique");
            }

            if (!presenter.isHorizontal || i === 0) {
                rowToLoad = document.createElement("tr");
                parentToLoadElements.append(rowToLoad);
            }

            loadElement(itemsModel[nextIndex], rowToLoad, isFirstSide);
        }
    }

    function findParentToLoadElements(view, isFirstSide) {
        let parentClassName = presenter.isHorizontal
            ? (isFirstSide
                ? presenter.CSS_CLASSES.CONNECTIONS_TOP_ROW
                : presenter.CSS_CLASSES.CONNECTIONS_BOTTOM_ROW)
            : (isFirstSide
                ? presenter.CSS_CLASSES.CONNECTIONS_LEFT_COLUMN
                : presenter.CSS_CLASSES.CONNECTIONS_RIGHT_COLUMN
            );
        return $(view)
            .find('.' + parentClassName + ':first')
            .find('.' + presenter.CSS_CLASSES.CONTENT + ':first')
            .find('tbody:first')[0];
    }

    function getOrderedIndexes(size, isRandomOrder) {
        let orderedIndexes = [];
        if (isRandomOrder) {
            let counter = 0;
            while (counter < size) {
                let nextIndex = nextInt(size);
                if (orderedIndexes.includes(nextIndex)) {
                    continue;
                }
                orderedIndexes.push(nextIndex);
                counter++;
            }
        } else {
            for (let i = 0; i < size; i++) {
                orderedIndexes.push(i);
            }
        }
        return orderedIndexes;
    }

    function nextInt(upperBound) {
        if (presenter.printableController) {
            return presenter.printableController.nextInt(upperBound);
        }
        return Math.floor((Math.random() * upperBound))
    }

    function loadElement(itemModel, parentElement, isFirstSide) {
        const newCell = document.createElement("td");
        newCell.classList.add(presenter.CSS_CLASSES.CONNECTION_ITEM_WRAPPER);
        parentElement.append(newCell);

        const newItem = createConnectionItem(itemModel, isFirstSide);
        newCell.append(newItem);
    }

    function createConnectionItem(itemModel, isFirstSection) {
        const item = document.createElement("table");
        item.classList.add(presenter.CSS_CLASSES.CONNECTION_ITEM);
        item.id = "connection-" + itemModel["id"];

        const itemBody = document.createElement("tbody");
        item.append(itemBody);

        const contentCell = createConnectionItemContentCell(itemModel["content"], itemModel["additional class"]);
        const iconCell = createConnectionItemIconCell();
        if (presenter.isHorizontal) {
            const contentRow = document.createElement("tr");
            contentRow.append(contentCell);
            const iconRow = document.createElement("tr");
            iconRow.append(iconCell);
            if (isFirstSection) {
                itemBody.append(contentRow);
                itemBody.append(iconRow);
            } else {
                itemBody.append(iconRow);
                itemBody.append(contentRow);
            }
        } else {
            const sharedRow = document.createElement("tr");
            itemBody.append(sharedRow);
            if (isFirstSection) {
                sharedRow.append(contentCell);
                sharedRow.append(iconCell);
            } else {
                sharedRow.append(iconCell);
                sharedRow.append(contentCell);
            }
        }

        presenter.elements.push({
            element: $(item),
            id: itemModel["id"],
            connects: itemModel["connects to"]
        });

        return item;
    }

    function createConnectionItemContentCell(content, additionalClassName) {
        const contentElement = document.createElement("td");
        contentElement.classList.add(presenter.CSS_CLASSES.INNER);

        const contentWrapper = document.createElement("div");
        contentWrapper.classList.add(presenter.CSS_CLASSES.INNER_WRAPPER);
        contentWrapper.style.direction = isRTL ? "rtl" : "ltr";
        contentWrapper.innerHTML = content;
        !!additionalClassName && contentWrapper.classList.add(additionalClassName);
        presenter.configuration.isTabindexEnabled && contentWrapper.setAttribute("tabindex", 0);
        contentElement.append(contentWrapper);

        return contentElement;
    }

    function createConnectionItemIconCell() {
        const iconElement = document.createElement("td");
        iconElement.classList.add(presenter.CSS_CLASSES.ICON);

        const iconWrapper = document.createElement("div");
        iconWrapper.classList.add(presenter.CSS_CLASSES.ICON_WRAPPER);
        iconElement.append(iconWrapper);

        return iconElement;
    }

    presenter.initializeView = function (view, model) {
        const $firstSideElement = $(view).find("." + this.getFirstSideCSSClassName() + ":first");
        const firstSideSize = {
            height: $firstSideElement.outerHeight(true),
            width: $firstSideElement.outerWidth(true),
        };

        const $secondSideElement = $(view).find("." + this.getSecondSideCSSClassName() + ":first");
        const secondSideSize = {
            height: $secondSideElement.outerHeight(true),
            width: $secondSideElement.outerWidth(true),
        };

        let height = model["Height"];// leftColumnHeight > rightColumnHeight ? leftColumnHeight : rightColumnHeight;
        let width = model["Width"];
        if (presenter.isHorizontal) {
            height -= (firstSideSize.height + secondSideSize.height);
        } else {
            width -= (firstSideSize.width + secondSideSize.width);
        }

        presenter.height = height;
        presenter.width = width;

        const context = connections[0].getContext('2d');
        context.canvas.width = width;
        context.canvas.height = height;
        connections.css({
            width: width + "px",
            height: height + "px"
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

    presenter.getElementSnapPoint = function AddonConnection_getElementSnapPoint($element) {
        const offset = $element.offset();
        const scale = playerController ? playerController.getScaleInformation() : { scaleX: 1, scaleY: 1 };
        const isFirstSideElement = $element.parents('.' + presenter.getFirstSideCSSClassName()).length > 0;

        let snapPoint;
        if (presenter.isHorizontal) {
            const elementWidth = $element.outerWidth() * scale.scaleX;
            const elementHeight = $element.outerHeight(true) * scale.scaleY;
            if (isFirstSideElement) {
                snapPoint = [offset.left + elementWidth / 2, offset.top + elementHeight];
            } else {
                snapPoint = [offset.left + elementWidth / 2, offset.top];
            }
        } else {
            const elementWidth = $element.outerWidth(true) * scale.scaleX;
            const elementHeight = $element.outerHeight() * scale.scaleY;
            if (isFirstSideElement) {
                snapPoint = [offset.left + elementWidth, offset.top + elementHeight / 2];
            } else {
                snapPoint = [offset.left, offset.top + elementHeight / 2];
            }
        }

        // snapPoint[0] is x offset, [1] is y offset
        snapPoint[0] /= scale.scaleX;
        snapPoint[1] /= scale.scaleY;

        return snapPoint;
    };

    function pushConnection(line, isPreview) {
        var addLine = true, linesToRemove = [], existingLines;
        if (presenter.configuration.isSingleConnectionMode) {
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
            presenter.$view.find('.' + presenter.CSS_CLASSES.CONNECTIONS).remove();
            var canvas2 = $('<canvas></canvas>');
            canvas2.addClass(presenter.CSS_CLASSES.CONNECTIONS);
            presenter.$view.find('.' + presenter.getMiddleSideCSSClassName()).append(canvas2);

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

            connections = presenter.$view.find('.' + presenter.CSS_CLASSES.CONNECTIONS);
        } else {
            connections.clearCanvas();
        }

        for (var i = 0; i < presenter.lineStack.length(); i++) {
            drawLine(presenter.lineStack.get(i), presenter.configuration.defaultConnectionColor)
        }
    };

    presenter.redrawShowAnswers = function AddonConnection_redrawShowAnswers() {
        connections.clearCanvas();
        for (var i = 0; i < presenter.lineStack.length(); i++) {
            drawLine(presenter.lineStack.get(i), presenter.configuration.showAnswersLineColor);
        }
    };

    function drawLine(line, color) {
        if (line.isDisabled() && presenter.configuration.disabledConnectionColor !== "") {
            color = presenter.configuration.disabledConnectionColor;
        }

        var from = presenter.getElementSnapPoint(line.from);
        var to = presenter.getElementSnapPoint(line.to);
        var canvasOffset = connections.offset();
        var scale = playerController ? playerController.getScaleInformation() : { scaleX: 1, scaleY: 1 };

        canvasOffset.left /= scale.scaleX;
        canvasOffset.top /= scale.scaleY;

        connections.drawLine({
            strokeStyle: color,
            strokeWidth: presenter.configuration.connectionThickness,
            x1: to[0] - canvasOffset.left,
            y1: to[1] - canvasOffset.top,
            x2: from[0] - canvasOffset.left,
            y2: from[1] - canvasOffset.top
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
            if (presenter.configuration.isNotActivity) return 0;

            connections.clearCanvas();
            for (var i = 0; i < presenter.lineStack.length(); i++) {
                var line = presenter.lineStack.get(i);
                if (presenter.correctConnections.hasLine(line).length > 0) {
                    drawLine(presenter.lineStack.get(i), presenter.configuration.correctConnectionColor);
                    var fromElementCorrect = presenter.$view.find('#' + presenter.lineStack.get(i).from[0].id);
                    var toElementCorrect = presenter.$view.find('#' + presenter.lineStack.get(i).to[0].id);
                    $(fromElementCorrect).addClass(CORRECT_ITEM_CLASS);
                    $(toElementCorrect).addClass(CORRECT_ITEM_CLASS);
                } else {
                    drawLine(presenter.lineStack.get(i), presenter.configuration.incorrectConnectionColor);
                    var fromElementIncorrect = presenter.$view.find('#' + presenter.lineStack.get(i).from[0].id);
                    var toElementIncorrect = presenter.$view.find('#' + presenter.lineStack.get(i).to[0].id);
                    $(fromElementIncorrect).addClass(WRONG_ITEM_CLASS);
                    $(toElementIncorrect).addClass(WRONG_ITEM_CLASS);
                }
            }
            presenter.$view.find('.' + presenter.CSS_CLASSES.CONNECTION_ITEM).each(function () {
                if ($(this).hasClass(CORRECT_ITEM_CLASS) && $(this).hasClass(WRONG_ITEM_CLASS)) {
                    $(this).removeClass(CORRECT_ITEM_CLASS);
                }
            });
            presenter.$connectionContainer
                .find('.' + presenter.CSS_CLASSES.SELECTED)
                .removeClass(presenter.CSS_CLASSES.SELECTED);
            selectedItem = null;
            isSelectionPossible = false;
        }
    );

    presenter.setWorkMode = deferredCommandQueue.decorate(
        function () {
            presenter.isCheckActive = false;
            presenter.gatherCorrectConnections();
            presenter.redraw();
            presenter.$view.find('.' + presenter.CSS_CLASSES.CONNECTION_ITEM).each(function () {
                $(this).removeClass(CORRECT_ITEM_CLASS);
                $(this).removeClass(WRONG_ITEM_CLASS);
            });
            isSelectionPossible = true;
        }
    );

    presenter.reset = deferredCommandQueue.decorate(
        function (onlyWrongAnswers) {
            if (!presenter.configuration.isValid) {
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
            presenter.$connectionContainer
                .find('.' + presenter.CSS_CLASSES.SELECTED)
                .removeClass(presenter.CSS_CLASSES.SELECTED);
            presenter.$view.find('.' + presenter.CSS_CLASSES.CONNECTION_ITEM).each(function () {
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
        if (presenter.configuration.isNotActivity) return 0;

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
        if (presenter.configuration.isNotActivity) return 0;

        return presenter.correctConnections.length() - presenter.correctConnections.getDisabledCount();
    };

    // that method can return false results when called before mathjax is loaded, but cannot be moved to aysnc queue
    presenter.getScore = function () {
        if (presenter.configuration.isNotActivity) return 0;

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
        if (!presenter.mathJaxLoaders.setStateLoaded && presenter.initialState !== null) {
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
        presenter.mathJaxLoaders.setStateLoaded = false;

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
                presenter.mathJaxLoaders.setStateLoaded = true;
                deferredCommandQueue.resolve();
            }
            presenter.initialState = null;
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
            drawLine(line, presenter.configuration.correctConnectionColor);

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
            drawLine(line, presenter.configuration.incorrectConnectionColor);

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
            if (presenter.configuration.isNotActivity) {
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
            if (presenter.configuration.isNotActivity || !presenter.isShowAnswersActive) {
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

            result = result.concat(window.TTSUtils.getTextVoiceArrayFromElement(connections[i], presenter.configuration.langTag));

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
            var TextVoiceArray = window.TTSUtils.getTextVoiceArrayFromElement($active, presenter.configuration.langTag);

            if ($active.hasClass(presenter.CSS_CLASSES.SELECTED) && !presenter.isShowingAnswers()) {
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
        if (presenter.getCurrentActivatedElement().hasClass(presenter.CSS_CLASSES.SELECTED)) {
            speak([getTextVoiceObject(presenter.speechTexts.deselected)]);
        }

        Object.getPrototypeOf(ConnectionKeyboardController.prototype).select.call(this);

        if (presenter.getCurrentActivatedElement().hasClass(presenter.CSS_CLASSES.SELECTED)) {
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
    };

    presenter.isPrintableAsync = function() {
        return true;
    };

    presenter.setPrintableAsyncCallback = function(id, callback) {
        presenter.printableParserID = id;
        presenter.printableParserCallback = callback;
    };

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
        presenter.model = model;
        const root = createPrintableBaseView(model);
        const $root = $(root);

        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(root, presenter.ERROR_MESSAGES, presenter.configuration.errorCode);
            return $root[0].outerHTML;
        }

        presenter.chooseOrientation(model, false);
        const connectionContainer = createPrintableConnectionContainer();
        root.append(connectionContainer);
        presenter.setLengthOfSideObjects(root);

        const $printableWrapper = wrapInPrintableLessonTemplate($root);

        presenter.loadElements(root, model);
        this.removeNonVisibleInnerHTMLForRoot($root);

        const correctAnswers = getCorrectAnswersObject(model);
        const connectionsInformation = getPrintableConnectionsInformation(correctAnswers);
        isPrintableCheckAnswersStateMode() && this.addAnswersElements(root, model, correctAnswers);

        $printableWrapper.css("visibility", "hidden");
        let height;
        $("body").append($printableWrapper);
        waitForLoad($root, function(){
            $printableWrapper.css("visibility", "");

            root.classList.add(...presenter.printableClassNames);
            if (connectionsInformation.length > 0) {
                const connectionsSVG = $root.find("svg");
                for (let connection, i = 0; i < connectionsInformation.length; i++) {
                    connection = connectionsInformation[i];
                    drawSVGLine(connectionsSVG, connection.from, connection.to, connection.correct, model);
                }
            }

            root.classList.remove(...presenter.printableClassNames);
            $printableWrapper.detach();
            height = getPrintableTableHeight($root);
            $root.css("height", height+"px");
            const parsedView = root.outerHTML;
            $root.remove();
            $printableWrapper.remove();
            presenter.printableParserCallback(parsedView);
        });

        const $clone = $root.clone();
        $clone.attr("id", presenter.printableParserID);
        $clone.css("visibility", "");
        const result = $clone[0].outerHTML;
        $clone.remove();

        return result;
    };

    presenter.setPrintableClassNames = function (classNames) {
        presenter.printableClassNames = classNames;
    }

    function wrapInPrintableLessonTemplate($view) {
        const $lessonTemplate = $(presenter.printableController.getLessonTemplate());
        const $placeholder = $lessonTemplate.find("#printable_placeholder");
        const $placeholderParent = $placeholder.parent();
        $placeholderParent.append($view);
        $placeholder.remove();
        return $lessonTemplate;
    }

    function createPrintableBaseView(model) {
        const view = document.createElement("div");
        view.id = model.ID;
        view.classList.add("printable_addon_Connection");
        view.style.maxWidth = model.Width + "px";
        return view;
    }

    function createPrintableConnectionContainer() {
        const isCheckAnswers = isPrintableCheckAnswersStateMode();

        const connectionContainer = document.createElement("table");
        connectionContainer.classList.add("connectionContainer");

        const connectionContainerBody = document.createElement("tbody");
        connectionContainer.append(connectionContainerBody);

        const tr = document.createElement("tr");
        connectionContainerBody.append(tr);

        isCheckAnswers && tr.append(createPrintableColumn("answersLeftColumn"));
        tr.append(createPrintableColumn(presenter.getFirstSideCSSClassName()));
        tr.append(createPrintableConnectionMiddleColumn());
        tr.append(createPrintableColumn(presenter.getSecondSideCSSClassName()));
        isCheckAnswers && tr.append(createPrintableColumn("answersRightColumn"));

        return connectionContainer;
    }

    function createPrintableColumn(className) {
        const cellContent = createCellContent();
        return createVerticalViewBodyColumn(className, cellContent);
    }

    function createPrintableConnectionMiddleColumn() {
        const column = document.createElement("td");
        column.classList.add(presenter.getMiddleSideCSSClassName());

        const content = document.createElement("svg");
        content.classList.add(presenter.CSS_CLASSES.CONNECTIONS);

        column.append(content);
        return column;
    }

    function getPrintableConnectionsInformation(correctAnswers) {
        const information = [];

        if (isPrintableShowAnswersStateMode()) {
            for (let i = 0; i < correctAnswers.length; i++) {
                if (correctAnswers[i].answer) {
                    information.push({
                        from: correctAnswers[i].id,
                        to: correctAnswers[i].answer,
                        correct: true
                    });
                }
            }
            return information;
        }

        if (isPrintableShowUserAnswersStateMode()) {
            for (let i = 0; i < presenter.printableState.id.length; i++) {
                const pair = presenter.printableState.id[i].split(':');
                information.push({
                    from: pair[0],
                    to: pair[1],
                    correct: true
                });
            }
            return information;
        }

        if (isPrintableCheckAnswersStateMode()) {
            for (let i = 0; i < presenter.printableState.id.length; i++) {
                const pair = presenter.printableState.id[i].split(':');
                information.push({
                    from: pair[0],
                    to: pair[1],
                    correct: isCorrectConnection(correctAnswers, pair)
                });
            }
            return information;
        }
        return information;
    }

    function waitForLoad($element, callback) {
        var $imgs = $element.find('img');
        var loadCounter = $imgs.length + 2;
        var continuedParsing = false;
        var isReady = false;

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
