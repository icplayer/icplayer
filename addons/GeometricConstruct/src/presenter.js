function AddonGeometricConstruct_create() {
    var presenter = function () {};

    presenter.labelsList = [];
    presenter.greekLabelsList = [];
    presenter.lowerLabelsList = [];
    presenter.figuresList = [];
    presenter.pointsList = [];
    presenter.maxPointIndex = 0;
    presenter.toolbarButtonsDict = {};
    presenter.labelsVisibility = true;
    presenter.angleMeasuresVisibility = true;
    presenter.lengthMeasuresVisibility = true;
    presenter.axisLabels = {
        x: {},
        y: {}
    }

    var MAX_PREV_STATES = 20;
    presenter.prevStateIndex = -1;
    presenter.previousStates = [];

    presenter.newFigure = null;
    presenter.editFigure = null;
    presenter.isEditMode = false;
    presenter.isDragging = false;
    presenter.hasMoved = false;
    var originalConfigPopupDisplay = '';

    presenter.playerController = null;

    presenter.CSS_CLASSES = {
        SELECTED: 'selected',
        TOOLBAR_WRAPPER: 'toolbar_wrapper',
        WORKSPACE_WRAPPER: 'workspace_wrapper',
        CANVAS_OVERLAY: 'canvas_overlay',
        REMOVE_FIGURE_BUTTON: 'remove_figure',
        EDIT_FIGURE_BUTTON: 'edit_figure',
        CURSOR: 'Cursor',
        CURSOR_IMAGE: 'cursor-image',
        UNDO_BUTTON: 'undo_button',
        REDO_BUTTON: 'redo_button',
        RESET_BUTTON: 'reset_button',
        LABELS_BUTTON: 'labels_button',
        LABELS_BUTTON_SHOW: 'show',
        LABELS_BUTTON_HIDE: 'hide',
        LABEL: 'geometricConstructLabel',
        TOOLBAR_BUTTON: 'toolbarButton',
        TOOLBAR_BUTTON_LABEL: 'toolbar-button-label',
        TOOLBAR_BUTTON_ICON: 'icon',
        TOOLBAR_OPTIONS: 'toolbar_options',
        TOOLBAR_SECTION: 'toolbar_section',
        TOOLBAR_BUTTON: 'toolbarButton',
        CONFIG_POPUP: 'config_popup',
        CONFIG_POPUP_TITLE: 'title',
        CONFIG_POPUP_VALUES: 'values',
        CONFIG_POPUP_ACCEPT: 'accept',
        CONFIG_POPUP_CANCEL: 'cancel',
        CONFIG_PROP_WRAPPER: 'property_wrapper',
        CONFIG_PROP_TITLE: 'property_title',
        CONFIG_PROP_INPUT: 'property_input',
        AXIS_LABEL: 'axis_label'
    };

    presenter.labels = {
        point: "Point",
        cursor: "Cursor",
        circle: "Circle with a specified radius",
        circleWithPoint: "Circle passing through a point",
        compasses: "Compasses",
        arcWithCenterPoint: "Arc with a defined center",
        angle: "Angle",
        lineSegment: "Line Segment",
        halfOpenLineSegment: "Half-open Line Segment",
        openLineSegment: "Open Line Segment",
        circlePopupTitle: "Circle with a specified radius",
        accept: "ACCEPT",
        cancel: "CANCEL",
        radius: "Radius"
    }

    presenter.ERROR_CODES = {
        'IV_01': "Axis increment must be a positive number or left empty",
        'IV_02': "Unit length must be a positive number or left empty",
        'IV_03': "X and Y axis position must be a positive number or left empty",
        'IV_04': "Angle's decimal point must be an non-negative integer or left empty",
        'IV_05': "Length's decimal point must be an non-negative integer or left empty"
    }

    presenter.enabledFigures = {
        point: true,
        circle: true,
        circleWithPoint: true,
        compasses: true,
        arcWithCenterPoint: true,
        angle: true,
        lineSegment: true,
        halfOpenLineSegment: true,
        openLineSegment: true
    }

    var ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var LOWER_ALPHABET = ALPHABET.toLowerCase();
    var GREEK_ALPHABET = "αβγδεζηθικλμνξοπρστυφχψω";

    presenter.createPreview = function (view, model) {
        presenterLogic(view, model, true);
    };

    presenter.run = function (view, model) {
        presenterLogic(view, model, false);
    };

    function presenterLogic(view, model, isPreview) {
        var upgradedModel = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(upgradedModel);
        if (!presenter.configuration.isValid) {
            $(view).html(presenter.ERROR_CODES[presenter.configuration.errorCode]);
            return;
        }
        presenter.setElements(view);
        presenter.createView(isPreview);
        if (!presenter.configuration.defaultVisibility) presenter.hide();
        presenter.setLabelsVisibility(presenter.configuration.labelsDefaultVisibility);
        presenter.setAngleMeasuresVisibility(presenter.configuration.angleMeasuresDefaultVisibility);
        presenter.setLengthMeasuresVisibility(presenter.configuration.lengthMeasuresDefaultVisibility);
        presenter.pushState();
    }

    presenter.show = function() {
        presenter.$view.css('visibility', '');
        presenter.$view.css('display', '');
    }

    presenter.hide = function() {
        presenter.$view.css('visibility', 'hidden');
        presenter.$view.css('display', 'none');
    }

    presenter.isVisible = function() {
        return presenter.$view.css('display') != 'none' &&  presenter.$view.css('visibility') != 'hidden';
    }

    presenter.showLabels = function() {
        presenter.setLabelsVisibility(true);
    }

    presenter.hideLabels = function() {
        presenter.setLabelsVisibility(false);
    }

    presenter.setLabelsVisibility = function(visible) {
        presenter.labelsVisibility = visible;
        for (var i = 0; i < presenter.figuresList.length; i++) {
            var figure = presenter.figuresList[i];
            if (presenter.labelsVisibility) {
                figure.showLabel();
            } else {
                figure.hideLabel();
            }
        }
        if (!presenter.configuration.disableLabelToggle) {
            if (presenter.labelsVisibility) {
                presenter.$labelsButton.removeClass(presenter.CSS_CLASSES.LABELS_BUTTON_SHOW);
                presenter.$labelsButton.addClass(presenter.CSS_CLASSES.LABELS_BUTTON_HIDE);
            } else {
                presenter.$labelsButton.removeClass(presenter.CSS_CLASSES.LABELS_BUTTON_HIDE);
                presenter.$labelsButton.addClass(presenter.CSS_CLASSES.LABELS_BUTTON_SHOW);
            }
        }
    }

    presenter.showAngleMeasures = function() {
        presenter.setAngleMeasuresVisibility(true);
    }

    presenter.hideAngleMeasures = function() {
        presenter.setAngleMeasuresVisibility(false);
    }

    presenter.setAngleMeasuresVisibility = function(visible) {
        presenter.angleMeasuresVisibility = visible;
        for (var i = 0; i < presenter.figuresList.length; i++) {
            var figure = presenter.figuresList[i];
            if (figure.showAngleMeasure !== undefined) {
                if (presenter.angleMeasuresVisibility) {
                    figure.showAngleMeasure();
                } else {
                    figure.hideAngleMeasure();
                }
            }
        }
    }

    presenter.showLengthMeasures = function() {
        presenter.setLengthMeasuresVisibility(true);
    }

    presenter.hideLengthMeasures = function() {
        presenter.setLengthMeasuresVisibility(false);
    }

    presenter.setLengthMeasuresVisibility = function(visible) {
        presenter.lengthMeasuresVisibility = visible;
        for (var i = 0; i < presenter.figuresList.length; i++) {
            var figure = presenter.figuresList[i];
            if (figure.showLengthMeasure !== undefined) {
                if (presenter.lengthMeasuresVisibility) {
                    figure.showLengthMeasure();
                } else {
                    figure.hideLengthMeasure();
                }
            }
        }
    }

    presenter.upgradeModel = function(model) {
        var upgradedModel = presenter.upgradeAxisConfig(model);
        upgradedModel = presenter.upgradeAngle(upgradedModel);
        upgradedModel = presenter.upgradeHideAxes(upgradedModel);
        upgradedModel = presenter.upgradeAngleMeasuresVisibility(upgradedModel);
        upgradedModel = presenter.upgradeLengthMeasure(upgradedModel);
        return presenter.upgradeGridColor(upgradedModel);
    }

    presenter.upgradeAngle = function(model) {
        const upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (upgradedModel["figures"]["Angle"] === undefined) {
            upgradedModel["figures"]["Angle"] =  {
                "Angle": "",
                "Disabled": ""
            };
        }
        if (upgradedModel["angleDecimalPoint"] == undefined) {
            upgradedModel["angleDecimalPoint"] = "";
        }

        return upgradedModel;
    }

    presenter.upgradeAxisConfig = function (model) {
        const upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object
        if (upgradedModel["axisIncrement"] === undefined) {
            upgradedModel["axisIncrement"] =  '';
        }
        if (upgradedModel["xAxisPosition"] === undefined) {
            upgradedModel["xAxisPosition"] =  '';
        }
        if (upgradedModel["yAxisPosition"] === undefined) {
            upgradedModel["yAxisPosition"] =  '';
        }
        if (upgradedModel["axisColor"] === undefined) {
            upgradedModel["axisColor"] =  '';
        }
        if (upgradedModel["unitLength"] === undefined) {
            upgradedModel["unitLength"] =  '';
        }

        return upgradedModel;
    };

    presenter.upgradeHideAxes = function(model) {
        const upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (upgradedModel["hideXAxis"] == undefined) {
            upgradedModel["hideXAxis"] = "";
        }
        if (upgradedModel["hideYAxis"] == undefined) {
            upgradedModel["hideYAxis"] = "";
        }

        return upgradedModel;
    }

    presenter.upgradeAngleMeasuresVisibility = function(model) {
        const upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (upgradedModel["angleMeasuresVisibility"] == undefined) {
            upgradedModel["angleMeasuresVisibility"] = "";
        }

        return upgradedModel;
    }

    presenter.upgradeLengthMeasure = function(model) {
        const upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (upgradedModel["lengthDecimalPoint"] == undefined) {
            upgradedModel["lengthDecimalPoint"] = "";
        }

        if (upgradedModel["lengthMeasuresVisibility"] == undefined) {
            upgradedModel["lengthMeasuresVisibility"] = "";
        }

        return upgradedModel;
    }
          
    presenter.upgradeGridColor = function(model) {
        const upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (upgradedModel["gridColor"] == undefined) {
            upgradedModel["gridColor"] = "";
        }

        return upgradedModel;
    }

    presenter.getActualUnitLength = function() {
        return presenter.configuration.unitLength;
    }

    presenter.convertToUnit = function(value) {
        return value / presenter.getActualUnitLength();
    }

    presenter.validatePositiveInteger = function (rawValue, defaultValue, errorCode) {
        var resultValue = defaultValue;
        if (rawValue.trim().length != 0) {
            var result = ModelValidationUtils.validateInteger(rawValue);
            if (!result.isValid || result.value <= 0) {
                return {isValid: false, errorCode: errorCode};
            }
            return result;
        }
        return {isValid: true, value: resultValue};
    }


    presenter.validateModel = function (model) {
        var strokeColor = (model["strokeColor"] && model["strokeColor"].trim().length > 0) ? model["strokeColor"] : "black";
        var fillColor = (model["fillColor"] && model["fillColor"].trim().length > 0) ? model["fillColor"] : "blue";
        var axisColor = (model["axisColor"] && model["axisColor"].trim().length > 0) ? model["axisColor"] : "#444444";

        var axisIncrementResult = presenter.validatePositiveInteger(model['axisIncrement'], 1, 'IV_01');
        if (!axisIncrementResult.isValid) return axisIncrementResult;
        var axisIncrement = axisIncrementResult.value;

        var unitLengthResult = presenter.validatePositiveInteger(model['unitLength'], 25, 'IV_02');
        if (!unitLengthResult.isValid) return unitLengthResult;
        var unitLength = unitLengthResult.value;

        var xAxisPositionResult = presenter.validatePositiveInteger(model['xAxisPosition'], 0, 'IV_03');
        if (!xAxisPositionResult.isValid) return xAxisPositionResult;
        var xAxisPosition = xAxisPositionResult.value;

        var yAxisPositionResult = presenter.validatePositiveInteger(model['yAxisPosition'], 0, 'IV_03');
        if (!yAxisPositionResult.isValid) return yAxisPositionResult;
        var yAxisPosition = yAxisPositionResult.value;

        setLabels(model["labels"], model["figures"]);
        setEnabledFigures(model["figures"]);

        var angleDecimalPoint = 0;
        if (model["angleDecimalPoint"].trim().length > 0) {
            var angleDecimalPointResult = ModelValidationUtils.validateInteger(model["angleDecimalPoint"]);
            if (!angleDecimalPointResult.isValid || angleDecimalPointResult.value < 0) {
                return {isValid: false, errorCode: "IV_04"};
            }
            angleDecimalPoint = angleDecimalPointResult.value;
        }
        
        var lengthDecimalPoint = 0;
        if (model["lengthDecimalPoint"].trim().length > 0) {
            var lengthDecimalPointResult = ModelValidationUtils.validateInteger(model["lengthDecimalPoint"]);
            if (!lengthDecimalPointResult.isValid || lengthDecimalPointResult.value < 0) {
                return {isValid: false, errorCode: "IV_05"};
            }
            lengthDecimalPoint = lengthDecimalPointResult.value;
        }

        return {
            isValid: true,
            fillColor: fillColor,
            strokeColor: strokeColor,
            width: parseInt(model["Width"]),
            height: parseInt(model["Height"]),
            defaultVisibility: ModelValidationUtils.validateBoolean(model["Is Visible"]),
            labelsDefaultVisibility: ModelValidationUtils.validateBoolean(model["labelsVisibility"]),
            angleMeasuresDefaultVisibility: ModelValidationUtils.validateBoolean(model["angleMeasuresVisibility"]),
            disableUndoRedoButton: ModelValidationUtils.validateBoolean(model["DisableUndoRedoButton"]),
            disableResetButton: ModelValidationUtils.validateBoolean(model["DisableResetButton"]),
            disableLabelToggle: ModelValidationUtils.validateBoolean(model["DisableLabelToggle"]),
            axisColor: axisColor,
            axisIncrement: axisIncrement,
            unitLength: unitLength,
            xAxisPosition: xAxisPosition,
            yAxisPosition: yAxisPosition,
            angleDecimalPoint: angleDecimalPoint,
            hideXAxis: ModelValidationUtils.validateBoolean(model["hideXAxis"]),
            hideYAxis: ModelValidationUtils.validateBoolean(model["hideYAxis"]),
            lengthDecimalPoint: lengthDecimalPoint,
            lengthMeasuresDefaultVisibility: ModelValidationUtils.validateBoolean(model["lengthMeasuresVisibility"]),
            gridColor: model["gridColor"]
        };
    }
    
    function getLabelValue (rawValue, defaultValue) {
        var value = rawValue.trim();

        if (value === undefined || value === null || value === '') {
            return defaultValue;
        }

        return value;
    }

    function setLabels(labels, figures) {
        if (!labels || !figures) {
            return;
        }

        presenter.labels = {
            point: getLabelValue(figures['Point']['Point'], presenter.labels.point),
            cursor: getLabelValue(labels['Cursor']['Cursor'], presenter.labels.cursor),
            circle: getLabelValue(figures['Circle']['Circle'], presenter.labels.circle),
            circleWithPoint: getLabelValue(figures['CircleWithPoint']['CircleWithPoint'], presenter.labels.circleWithPoint),
            compasses: getLabelValue(figures['Compasses']['Compasses'], presenter.labels.compasses),
            arcWithCenterPoint: getLabelValue(figures['ArcWithCenterPoint']['ArcWithCenterPoint'], presenter.labels.arcWithCenterPoint),
            angle: getLabelValue(figures['Angle']['Angle'], presenter.labels.angle),
            lineSegment: getLabelValue(figures['LineSegment']['LineSegment'], presenter.labels.lineSegment),
            halfOpenLineSegment: getLabelValue(figures['HalfOpenLineSegment']['HalfOpenLineSegment'], presenter.labels.halfOpenLineSegment),
            openLineSegment: getLabelValue(figures['OpenLineSegment']['OpenLineSegment'], presenter.labels.openLineSegment),
            circlePopupTitle: getLabelValue(labels['CirclePopupTitle']['CirclePopupTitle'], presenter.labels.circlePopupTitle),
            accept: getLabelValue(labels['Accept']['Accept'], presenter.labels.accept),
            cancel: getLabelValue(labels['Cancel']['Cancel'], presenter.labels.cancel),
            radius: getLabelValue(labels['Radius']['Radius'], presenter.labels.radius)
        };
    }

    function setEnabledFigures(figures) {
        if (!figures) return;

        presenter.enabledFigures = {
            point: !ModelValidationUtils.validateBoolean(figures['Point']["Disabled"]),
            circle: !ModelValidationUtils.validateBoolean(figures['Circle']["Disabled"]),
            circleWithPoint: !ModelValidationUtils.validateBoolean(figures['CircleWithPoint']["Disabled"]),
            compasses: !ModelValidationUtils.validateBoolean(figures['Compasses']["Disabled"]),
            arcWithCenterPoint: !ModelValidationUtils.validateBoolean(figures['ArcWithCenterPoint']["Disabled"]),
            angle: !ModelValidationUtils.validateBoolean(figures['Angle']["Disabled"]),
            lineSegment: !ModelValidationUtils.validateBoolean(figures['LineSegment']["Disabled"]),
            halfOpenLineSegment: !ModelValidationUtils.validateBoolean(figures['HalfOpenLineSegment']["Disabled"]),
            openLineSegment: !ModelValidationUtils.validateBoolean(figures['OpenLineSegment']["Disabled"])
        }
    }

    presenter.setElements = function(view) {
        presenter.view = view;
        presenter.$view = $(view);
        presenter.$toolbarWrapper = presenter.$view.find('.'+presenter.CSS_CLASSES.TOOLBAR_WRAPPER);
        presenter.$undoButton = presenter.$toolbarWrapper.find('.'+presenter.CSS_CLASSES.UNDO_BUTTON);
        presenter.$redoButton = presenter.$toolbarWrapper.find('.'+presenter.CSS_CLASSES.REDO_BUTTON);
        presenter.$resetButton = presenter.$toolbarWrapper.find('.'+presenter.CSS_CLASSES.RESET_BUTTON);
        presenter.$labelsButton = presenter.$toolbarWrapper.find('.'+presenter.CSS_CLASSES.LABELS_BUTTON);
        presenter.$toolbarOptions = presenter.$view.find('.'+presenter.CSS_CLASSES.TOOLBAR_OPTIONS);
        presenter.$workspaceWrapper = presenter.$view.find('.'+presenter.CSS_CLASSES.WORKSPACE_WRAPPER);
        presenter.workspaceWrapper = presenter.$workspaceWrapper[0];
    }

    presenter.createView = function(isPreview) {
        presenter.createWorkspace(isPreview);
        presenter.createToolbar();
        presenter.redrawCanvas();
    };

    presenter.createWorkspace = function(isPreview) {
        presenter.canvas = document.createElement("canvas");
        presenter.$canvas = $(presenter.canvas);
        presenter.canvasWidth = presenter.$workspaceWrapper.width();
        presenter.canvasHeight = presenter.configuration.height;
        presenter.canvas.setAttribute('width', presenter.canvasWidth);
        presenter.canvas.setAttribute('height', presenter.canvasHeight);
        presenter.context = presenter.canvas.getContext("2d");
        presenter.$workspaceWrapper.prepend(presenter.canvas);
        presenter.canvasRect = presenter.canvas.getBoundingClientRect();
        presenter.$canvasOverlay = presenter.$workspaceWrapper.find("."+presenter.CSS_CLASSES.CANVAS_OVERLAY);
        presenter.$canvasOverlay.css('width', presenter.canvasWidth);
        presenter.$canvasOverlay.css('height', presenter.canvasHeight);
        if (!isPreview) {
            presenter.$canvasOverlay.on('mousedown', canvasOnMouseDownHandler);
            presenter.$canvasOverlay.on('touchstart', canvasOnMouseDownHandler);
            presenter.$canvasOverlay.on('mousemove', canvasOnMouseMoveHandler);
            presenter.$canvasOverlay.on('touchmove', canvasOnMouseMoveHandler);
            presenter.$canvasOverlay.on('mouseup', canvasOnMouseUpHandler);
            presenter.$canvasOverlay.on('touchend', canvasOnMouseUpHandler);
        }

        presenter.$removeFigure = presenter.$workspaceWrapper.find("."+presenter.CSS_CLASSES.REMOVE_FIGURE_BUTTON);
        presenter.$removeFigure.css('display', 'none');
        presenter.$editFigure = presenter.$workspaceWrapper.find("."+presenter.CSS_CLASSES.EDIT_FIGURE_BUTTON);
        presenter.$editFigure.css('display', 'none');
        if (!isPreview) {
            presenter.$removeFigure.on('click', removeFigureOnClickHandler);
            presenter.$editFigure.on('click', editFigureOnClickHandler);
        }
        presenter.$configPopup = presenter.$workspaceWrapper.find('.'+presenter.CSS_CLASSES.CONFIG_POPUP);
        var popupRect = presenter.$configPopup[0].getBoundingClientRect();
        var popupTop = Math.round((presenter.canvasHeight - popupRect.height)/2);
        if (popupTop < 0) popupTop = 0;
        var popupLeft = Math.round((presenter.canvasWidth - popupRect.width)/2);
        if (popupLeft < 0) popupLeft = 0;
        presenter.$configPopup.css('top', popupTop + 'px');
        presenter.$configPopup.css('left', popupLeft + 'px');
        var originalConfigPopupDisplay = presenter.$configPopup.css('display');
        presenter.hideConfigPopup();
        presenter.$configPopupTitle = presenter.$configPopup.find('.'+presenter.CSS_CLASSES.CONFIG_POPUP_TITLE);
        presenter.$configPopupValues = presenter.$configPopup.find('.'+presenter.CSS_CLASSES.CONFIG_POPUP_VALUES);
        presenter.$configPopupAccept = presenter.$configPopup.find('.'+presenter.CSS_CLASSES.CONFIG_POPUP_ACCEPT);
        presenter.$configPopupCancel = presenter.$configPopup.find('.'+presenter.CSS_CLASSES.CONFIG_POPUP_CANCEL);
        presenter.$configPopupAccept.html(presenter.labels.accept);
        presenter.$configPopupCancel.html(presenter.labels.cancel);
    };

    presenter.clearCanvas = function () {
        presenter.context.clearRect(0, 0, presenter.canvas.width, presenter.canvas.height);
    };

    presenter.clearLabels = function () {
        for (var i = 0; i < presenter.figuresList.length; i++) {
            presenter.figuresList[i].removeLabel();
        }
    }

    presenter.redrawCanvas = function () {
        presenter.clearCanvas();
        presenter.drawBackground();
        for (var i = 0; i < presenter.figuresList.length; i++) {
            var f = presenter.figuresList[i];
            f.draw();
            f.addLabel();
        }
    };

    function canvasOnMouseDownHandler (e) {
        e.preventDefault();
        e.stopPropagation();
        var location = getCanvasEventLocation(e);
        if (presenter.newFigure != null) {
            presenter.newFigure.insertClickHandler(e);
            presenter.redrawCanvas();
        } else if (presenter.isEditMode) {
            var selectedFigure = null;
            for (var i = 0; i < presenter.figuresList.length; i++) {
                var figure = presenter.figuresList[i];
                if (figure.isClicked(e)) {
                    selectedFigure = figure;
                    break;
                }
            }
            if (selectedFigure != null) {
                if (presenter.editFigure != selectedFigure) {
                    presenter.clearFigureSelection();
                    presenter.editFigure = selectedFigure;
                    presenter.$removeFigure.css('display', '');
                    if (selectedFigure.isEditButtonAvailable) {
                        presenter.$editFigure.css('display', '');
                    }
                }
                presenter.editFigure.setSelected(true, e);
                presenter.isDragging = true;
                presenter.hasMoved = false;
            } else if (presenter.editFigure != null) {
                presenter.editFigure.setSelected(false);
                presenter.editFigure = null;
                presenter.$removeFigure.css('display', 'none');
                presenter.$editFigure.css('display', 'none');
            }
            presenter.redrawCanvas();
        }
    };

    function canvasOnMouseMoveHandler (e) {
        e.preventDefault();
        e.stopPropagation();
        if (presenter.isEditMode && presenter.isDragging && presenter.editFigure != null) {
            presenter.hasMoved = true;
            presenter.editFigure.moveHandler(e);
            presenter.redrawCanvas();
        } else if (presenter.newFigure != null) {
            var redraw = presenter.newFigure.insertMoveHandler(e);
            if (redraw) presenter.redrawCanvas();
        }
    }

    function canvasOnMouseUpHandler (e) {
        e.preventDefault();
        e.stopPropagation();
        if (presenter.isEditMode && presenter.isDragging) {
            presenter.isDragging = false;
            if (presenter.hasMoved) {
                presenter.hasMoved = false;
                presenter.pushState();
            }
        }
    }

    function removeFigureOnClickHandler (e) {
        if (presenter.editFigure != null) {
            presenter.editFigure.remove();
            presenter.editFigure = null;
            presenter.redrawCanvas();
            presenter.updateLabels();
            presenter.$removeFigure.css('display', 'none');
            presenter.pushState();
            presenter.$editFigure.css('display', 'none');
        }
    }

    function editFigureOnClickHandler (e) {
        if (presenter.editFigure != null && presenter.editFigure.isEditButtonAvailable) {
            presenter.editFigure.openEditPopup();
        }
    }

    function labelsButtonHandler (e) {
        var newLabelsVisibilityValue = !presenter.labelsVisibility
        presenter.setLabelsVisibility(newLabelsVisibilityValue);
    }

    presenter.updateLabels = function() {
        for (var i = 0; i < presenter.figuresList.length; i++) {
            presenter.figuresList[i].updateLabel();
        }
    }

    function getCanvasEventLocation (e) {
        var scale = {scaleX: 1.0, scaleY: 1.0};
        if (presenter.playerController) {
            scale = presenter.playerController.getScaleInformation();
        }
        var pageX = 0;
        var pageY = 0;
        if (e.type == "mousedown" || e.type == "mousemove" || e.type == "mouseup") {
            pageX = e.pageX;
            pageY = e.pageY;
        } else if (e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length > 0) {
            var touch = e.originalEvent.touches[0];
            pageX = touch.pageX;
            pageY = touch.pageY;
        }
        var result = {
            x: (pageX - presenter.$canvas.offset().left) / scale.scaleX,
            y: (pageY - presenter.$canvas.offset().top) / scale.scaleY
        };
        if (result.x < 0) result.x = 0;
        if (result.x > presenter.canvasWidth) result.x = presenter.canvasWidth;
        if (result.y < 0) result.y = 0;
        if (result.y > presenter.canvasHeight) result.y = presenter.canvasHeight;
        return result;
    }

    presenter.getClickedPoint = function(event) {
        for (var i = 0; i < presenter.pointsList.length; i++) {
            var point = presenter.pointsList[i];
            if (point.isClicked(event)) return point;
        }
        return null;
    }

    presenter.getClickedOrCreatePoint = function(event) {
        var point;
        var clickedPoint = presenter.getClickedPoint(event);
        if (clickedPoint != null) {
            point = clickedPoint;
        } else {
            var location = getCanvasEventLocation(event);
            point = new Point();
            point.setLocation(location.x, location.y);
        }
        return point;
    }

    presenter.getAngle = function(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    }

    presenter.getPointByID = function(id) {
        for (var i = 0; i < presenter.pointsList.length; i++) {
            var point = presenter.pointsList[i];
            if (point.id == id) return point;
        }
        return null;
    }

    presenter.getOrCreateChildPointByID = function(id, parent) {
        var point;
        var existingPoint = presenter.getPointByID(id);
        if (existingPoint != null) {
            point = existingPoint;
        } else {
            point = new Point();
            point.setIsRoot(false);
        }
        point.addParent(parent);
        return point;
    }

    presenter.createToolbar = function() {
        var basicSection = presenter.createToolbarSection();
        var cursorElement = presenter.createToolbarButton(presenter.labels.cursor, presenter.CSS_CLASSES.CURSOR, presenter.CSS_CLASSES.CURSOR_IMAGE, basicSection, () => {
            presenter.setEditMode(true);
        }, ()=>{});
        if (presenter.enabledFigures.point)
            presenter.createGeometricElementButton(presenter.labels.point, Point, basicSection);

        var circleSection = presenter.createToolbarSection();
        if (presenter.enabledFigures.circle)
            presenter.createGeometricElementButton(presenter.labels.circle, Circle, circleSection);
        if (presenter.enabledFigures.circleWithPoint)
            presenter.createGeometricElementButton(presenter.labels.circleWithPoint, CircleWithPoint, circleSection);
        if (presenter.enabledFigures.compasses)
            presenter.createGeometricElementButton(presenter.labels.compasses, Compasses, circleSection);
        if (presenter.enabledFigures.arcWithCenterPoint)
            presenter.createGeometricElementButton(presenter.labels.arcWithCenterPoint, ArcWithCenterPoint, circleSection);
        if (presenter.enabledFigures.angle)
            presenter.createGeometricElementButton(presenter.labels.angle, Angle, circleSection);
        if (circleSection.children().length == 0) circleSection.remove();

        var pointLineSection = presenter.createToolbarSection();
        if (presenter.enabledFigures.lineSegment)
            presenter.createGeometricElementButton(presenter.labels.lineSegment, LineSegment, pointLineSection);
        if (presenter.enabledFigures.halfOpenLineSegment)
            presenter.createGeometricElementButton(presenter.labels.halfOpenLineSegment, HalfOpenLineSegment, pointLineSection);
        if (presenter.enabledFigures.openLineSegment)
            presenter.createGeometricElementButton(presenter.labels.openLineSegment, OpenLineSegment, pointLineSection);
        if (pointLineSection.children().length == 0) pointLineSection.remove();

        cursorElement.addClass(presenter.CSS_CLASSES.SELECTED);
        presenter.setEditMode(true);

        if (!presenter.configuration.disableUndoRedoButton) {
            presenter.$undoButton.on('click', presenter.prevState);
            presenter.$redoButton.on('click', presenter.nextState);
        }
        if (!presenter.configuration.disableResetButton)
            presenter.$resetButton.on('click', presenter.resetWithoutVisibility);
        presenter.updateStateButtonsVisibility();
        if (!presenter.configuration.disableLabelToggle) {
            presenter.$labelsButton.on('click', labelsButtonHandler);
        } else {
            presenter.$labelsButton.css('visibility', 'hidden');
        }
    };

    presenter.getLabel = function(index, alphabet) {
        var result = "";
        while (index >= 0) {
            var mod = index % alphabet.length;
            result = alphabet[mod] + result;
            index = Math.floor(index / alphabet.length) - 1;
        }
        return result;
    }

    presenter.createLabel = function(labelsList, alphabet) {
        var labelValue = '';
        var index = labelsList.indexOf('');
        if (index == -1) {
            labelValue = presenter.getLabel(labelsList.length, alphabet);
            labelsList.push(labelValue);
        } else {
            labelValue = presenter.getLabel(index, alphabet);
            labelsList[index] = labelValue;
        }
        return labelValue;
    }

    presenter.destroyLabel = function(labelValue, labelsList) {
        var index = labelsList.indexOf(labelValue);
        if (index == -1) return;
        labelsList[index] = '';
        if (index ===  labelsList.length - 1) {
            for (var i = labelsList.length - 1; i > -1; i--) {
                if (labelsList[i] == '') {
                    labelsList.pop();
                } else {
                    break;
                }
            }
        }
    }

    presenter.finishInsert = function(abandonChanges) {
        if (abandonChanges && presenter.newFigure != null) {
            presenter.newFigure.remove();
        }
        presenter.newFigure = null;
        presenter.$toolbarWrapper.find('.'+presenter.CSS_CLASSES.SELECTED).removeClass(presenter.CSS_CLASSES.SELECTED);
    };

    presenter.setEditMode = function(isEditMode) {
        presenter.editFigure = null;
        presenter.clearFigureSelection();
        presenter.isDragging = false;
        presenter.isEditMode = isEditMode;
    }

    presenter.clearFigureSelection = function() {
        for (var i = 0; i < presenter.figuresList.length; i++) presenter.figuresList[i].setSelected(false);
        presenter.$removeFigure.css('display', 'none');
        presenter.$editFigure.css('display', 'none');
    }

    presenter.removePointFromFigure = function(point, parent) {
        point.removeParent(parent);
        if (!point.hasParents()) {
            if (point.isSelected || presenter.newFigure == parent) {
                point.remove();
            } else if (!point.isRoot) {
                point.setIsRoot(true);
            }
        } else if (presenter.editFigure == parent) {
            point.setSelected(false);
        }
    }

    presenter.showConfigPopup = function (title, config, acceptCallback, cancelCallback) {
        presenter.$configPopupTitle.html(title);
        presenter.$configPopupValues.html('');
        var properties = [];
        for (var i = 0; i < config.length; i++) {
            var property = config[i];
            var $propertyWrapper = $('<div></div>');
            $propertyWrapper.addClass(presenter.CSS_CLASSES.CONFIG_PROP_WRAPPER);
            var $propertyTitle = $('<div></div>');
            $propertyTitle.addClass(presenter.CSS_CLASSES.CONFIG_PROP_TITLE);
            $propertyTitle.html(property.title);
            var $propertyInput = $('<input></input>');
            $propertyInput.addClass(presenter.CSS_CLASSES.CONFIG_PROP_INPUT);
            $propertyInput.attr('name', property.name);
            $propertyInput.attr('type', property.type);
            if (property.min !== undefined) $propertyInput.attr('min', property.min);
            $propertyInput[0].value = property.value;
            $propertyWrapper.append($propertyTitle);
            $propertyWrapper.append($propertyInput);
            presenter.$configPopupValues.append($propertyWrapper);
            properties.push({
                name: property.name,
                input: $propertyInput
            });
        }
        presenter.$configPopupAccept.off('click');
        presenter.$configPopupAccept.on('click', () => {
            var result = [];
            for (var i = 0; i < properties.length; i++) {
                var property = properties[i];
                result.push({
                    name: property.name,
                    value: property.input.val() * presenter.getActualUnitLength()
                });
            }
            acceptCallback(result);
            presenter.hideConfigPopup();
        });
        presenter.$configPopupCancel.off('click');
        presenter.$configPopupCancel.on('click', () => {
            cancelCallback();
            presenter.hideConfigPopup();
        });
        presenter.$configPopup.css('display', originalConfigPopupDisplay);
    }

    presenter.hideConfigPopup = function() {
        presenter.$configPopup.css('display','none');
    }

    presenter.drawBackground = function() {
        var spacing = presenter.configuration.axisIncrement * presenter.getActualUnitLength();
        var yPosition = presenter.configuration.yAxisPosition != 0 ? presenter.configuration.yAxisPosition : Math.round(presenter.canvasWidth/2);
        var xPosition = presenter.configuration.xAxisPosition != 0 ? presenter.configuration.xAxisPosition : Math.round(presenter.canvasHeight/2);
        presenter.drawGrid(yPosition, xPosition, spacing);
        presenter.drawAxis(yPosition, xPosition, spacing, presenter.configuration.axisIncrement);
    }

    presenter.getOrCreateAxisLabel = function(value, isVertical) {
        var axis = isVertical ? 'y' : 'x';
        if (presenter.axisLabels[axis][value] != undefined) {
            return presenter.axisLabels[axis][value];
        } else {
            var $el = $("<div></div>");
            $el.addClass(presenter.CSS_CLASSES.AXIS_LABEL);
            $el.css('position','absolute');
            $el.html(value);
            presenter.axisLabels[axis][value] = $el;
            return $el;
        }
    }

    presenter.drawAxisLabel = function(value, isVertical, x, y) {
        var $label = presenter.getOrCreateAxisLabel(value, isVertical);
        if ($label.parent().length == 0) {
            $label.insertBefore(presenter.$canvasOverlay);
        }
        var rect = $label[0].getBoundingClientRect();
        if (isVertical) {
            y -= Math.round(rect.height/2);
        } else {
            x -= Math.round(rect.width/2);
        }
        $label.css('top', y+'px');
        $label.css('left', x+'px');
    }

    presenter.drawAxis = function(centerX, centerY, spacing, increment) {
        if (!presenter.configuration.hideYAxis && 0 <= centerX && centerX < presenter.canvasWidth) {
            presenter.context.strokeStyle = presenter.configuration.axisColor;
            presenter.context.beginPath();
            presenter.context.moveTo(centerX, presenter.canvasHeight);
            presenter.context.lineTo(centerX, 0);
            presenter.context.moveTo(centerX + 5, 5);
            presenter.context.lineTo(centerX, 0);
            presenter.context.moveTo(centerX - 5, 5);
            presenter.context.lineTo(centerX, 0);
            var tmpY = centerY + spacing;
            var multiplier = 0;
            if (presenter.configuration.hideXAxis) {
                multiplier = 1;
                tmpY = centerY;
            }
            while (tmpY < presenter.canvasHeight - 10) {
                multiplier -= 1;
                presenter.drawAxisLabel(increment * multiplier, true, centerX + 10, tmpY);
                presenter.context.moveTo(centerX - 5, tmpY);
                presenter.context.lineTo(centerX + 5, tmpY);
                tmpY += spacing;
            }
            tmpY = centerY - spacing;
            multiplier = 0;
            while (tmpY > 0) {
                multiplier += 1;
                presenter.drawAxisLabel(increment * multiplier, true, centerX + 10, tmpY);
                presenter.context.moveTo(centerX - 5, tmpY);
                presenter.context.lineTo(centerX + 5, tmpY);
                tmpY -= spacing;
            }
            presenter.context.stroke();
            presenter.context.closePath();
        }
        if (!presenter.configuration.hideXAxis && 0 <= centerY && centerY < presenter.canvasHeight) {
            presenter.context.strokeStyle = presenter.configuration.axisColor;
            presenter.context.beginPath();
            presenter.context.moveTo(0, centerY);
            presenter.context.lineTo(presenter.canvasWidth, centerY);
            presenter.context.moveTo(presenter.canvasWidth - 5, centerY - 5);
            presenter.context.lineTo(presenter.canvasWidth, centerY);
            presenter.context.moveTo(presenter.canvasWidth - 5, centerY + 5);
            presenter.context.lineTo(presenter.canvasWidth, centerY);
            var tmpX = centerX + spacing;
            var multiplier = 0;
            if (presenter.configuration.hideYAxis) {
                multiplier = -1;
                tmpX = centerX;
            }
            while (tmpX < presenter.canvasWidth) {
                multiplier += 1;
                presenter.drawAxisLabel(increment * multiplier, false, tmpX, centerY + 10);
                presenter.context.moveTo(tmpX, centerY - 5);
                presenter.context.lineTo(tmpX, centerY + 5);
                tmpX += spacing;
            }
            tmpX = centerX - spacing;
            multiplier = 0;
            while (tmpX > 10) {
                multiplier -= 1;
                presenter.drawAxisLabel(increment * multiplier, false, tmpX, centerY + 10);
                presenter.context.moveTo(tmpX, centerY - 5);
                presenter.context.lineTo(tmpX, centerY + 5);
                tmpX -= spacing;
            }
            presenter.context.stroke();
            presenter.context.closePath();
        }
    }

    presenter.drawGrid = function(centerX, centerY, spacing) {
        var color = presenter.configuration.gridColor;
        if (color.trim().length == 0) return;
        presenter.context.strokeStyle = color;
        presenter.context.beginPath();
        var tmpX = centerX % spacing;
        if (centerX < 0) tmpX = spacing + tmpX;
        var iter = 0;
        while (tmpX < presenter.canvasWidth && iter < 100) {
            presenter.context.moveTo(tmpX, 0);
            presenter.context.lineTo(tmpX, presenter.canvasHeight);
            tmpX += spacing;
            iter += 1;
        }
        var tmpY = centerY % spacing;
        if (centerY < 0) tmpY = spacing + tmpY;
        iter = 0;
        while (tmpY < presenter.canvasHeight && iter < 100) {
            presenter.context.moveTo(0, tmpY);
            presenter.context.lineTo(presenter.canvasWidth, tmpY);
            tmpY += spacing;
            iter += 1;
        }
        presenter.context.stroke();
        presenter.context.closePath();
    }

    class GeometricElement {

        isEditButtonAvailable = false;

        constructor(){}

        draw() {
            throw new Error("GeometricElement.draw is abstract and has not been implemented");
        };

        append() {
            throw new Error("GeometricElement.append is abstract and has not been implemented");
        }

        remove() {
            throw new Error("GeometricElement.remove is abstract and has not been implemented");
        }

        insertClickHandler(event) {
            throw new Error("GeometricElement.insertClickHandler is abstract and has not been implemented");
        }

        insertMoveHandler(event) {
            // returns true if canvas needs to be redrawn
            throw new Error("GeometricElement.insertMoveHandler is abstract and has not been implemented");
        }

        moveHandler(event) {
            throw new Error("GeometricElement.moveHandler is abstract and has not been implemented");
        }

        isClicked(event) {
            throw new Error("GeometricElement.isClicked is abstract and has not been implemented");
        }

        addLabel() {
            throw new Error("GeometricElement.addLabel is abstract and has not been implemented");
        }

        updateLabel() {
            throw new Error("GeometricElement.updateLabel is abstract and has not been implemented");
        }

        hideLabel() {
            throw new Error("GeometricElement.hideLabel is abstract and has not been implemented");
        }

        showLabel() {
            throw new Error("GeometricElement.showLabel is abstract and has not been implemented");
        }

        removeLabel() {
            throw new Error("GeometricElement.removeLabel is abstract and has not been implemented");
        }

        getLabelValues() {
            throw new Error("GeometricElement.getLabelValues is abstract and has not been implemented");
        }

        setSelected(isSelected, event) {
            // event is optional
            throw new Error("GeometricElement.setSelected is abstract and has not been implemented");
        }

        toJSON() {
            throw new Error("GeometricElement.toJSON is abstract and has not been implemented");
        }

        loadJSON(json) {
            throw new Error("GeometricElement.loadJSON is abstract and has not been implemented");
        }
    }

    class Point extends GeometricElement {

        static TYPE = "Point";
        static LABEL_CLASS = "point_label";
        static ICON_CLASS = "point-image";
        x;
        y;
        $label;
        labelValue = "";
        isRoot = true;
        isSelected = false;
        id;
        parentFigures = [];

        constructor() {
            super();
            presenter.maxPointIndex += 1;
            this.id = presenter.maxPointIndex;
        }

        setIsRoot(isRoot) {
            this.isRoot = isRoot;
            var figuresIndex = presenter.figuresList.indexOf(this);
            if (this.isRoot && figuresIndex == -1) {
                presenter.figuresList.push(this);
            } else if (!this.isRoot && figuresIndex != -1) {
                presenter.figuresList.splice(figuresIndex, 1);
            }
        }

        append() {
            if (!this.labelValue) {
                this.labelValue = presenter.createLabel(presenter.labelsList, ALPHABET);
            }
            if (presenter.pointsList.indexOf(this) == -1) {
                presenter.pointsList.push(this);
            };
            if (this.isRoot && presenter.figuresList.indexOf(this) == -1) {
                presenter.figuresList.push(this);
            };
        }

        addParent(figure) {
            if (this.parentFigures.indexOf(figure) == -1) this.parentFigures.push(figure);
        }

        removeParent(figure) {
            var parentIndex = this.parentFigures.indexOf(figure);
            if (parentIndex != -1) {
                this.parentFigures.splice(parentIndex, 1);
            }
        }

        hasParents() {
            return this.parentFigures.length > 0;
        }

        removeAllParents() {
            while (this.parentFigures.length > 0) {
                var parent = this.parentFigures.pop();
                parent.remove();
            }
        }

        remove() {
            presenter.destroyLabel(this.labelValue, presenter.labelsList);
            this.labelValue = '';
            var figuresIndex = presenter.figuresList.indexOf(this);
            if (figuresIndex != -1) {
                presenter.figuresList.splice(figuresIndex, 1);
            }
            this.removeLabel();
        }

        insertClickHandler(e) {
            if (presenter.newFigure == this) {
                var location = getCanvasEventLocation(e);
                this.setLocation(location.x, location.y);
                this.append();
                presenter.pushState();
                presenter.newFigure = new Point();
            }
        }

        insertMoveHandler(e) {return false;};

        setLocation(x, y) {
            this.x = x;
            this.y = y;
        }

        moveHandler(e) {
            var location = getCanvasEventLocation(e);
            this.setLocation(location.x, location.y);
            if (this.$label) this.addLabel();
        }

        isClicked(e) {
            var location = getCanvasEventLocation(e);
            return Math.abs(location.x - this.x) < 10 && Math.abs(location.y - this.y) < 10;
        }

        draw() {
            if (this.x == null || this.y == null) return;
            Point.drawPoint(presenter.context, this.x, this.y, this.isSelected);
        }

        static drawPoint(context, x, y, isSelected) {
            context.fillStyle = presenter.configuration.fillColor;
            context.strokeStyle = presenter.configuration.strokeColor;
            context.beginPath();
            context.arc(x, y, 4, 0, 2 * Math.PI);
            context.fill();
            context.stroke();
            context.closePath();
            if (isSelected) {
                context.beginPath();
                context.arc(x, y, 8, 0, 2 * Math.PI);
                context.stroke();
                context.closePath();
            }
        }

        addLabel() {
            if (this.x == null || this.y == null) return;
            if (!this.$label) {
                this.$label = $('<div></div>');
                this.$label.addClass(presenter.CSS_CLASSES.LABEL);
                this.$label.addClass(Point.LABEL_CLASS);
                this.$label.css('position', 'absolute');
                this.$label.insertBefore(presenter.$canvasOverlay);
            }
            this.$label.html(this.labelValue);
            this.$label.css('top', 'calc(' + (this.y) +'px - 1em)');
            this.$label.css('left', (this.x+5)+'px');
            if (!presenter.labelsVisibility) this.hideLabel();
        };

        updateLabel() {
            this.$label.css('top', 'calc(' + (this.y) +'px - 1em)');
            this.$label.css('left', (this.x+5)+'px');
        }

        hideLabel() {
            if (this.$label) {
                this.$label.css('display', 'none');
            }
        }

        showLabel() {
            if (this.$label) {
                this.$label.css('display', '');
            }
        }

        removeLabel() {
            if (this.$label) {
                this.$label.remove();
                this.$label = null;
            }
        };

        getLabelValues() {
            var values = [];
            if (this.labelValue.length > 0) values.push(this.labelValue);
            return values;
        }

        setSelected(isSelected, event) {
            this.isSelected = isSelected;
        }

        toJSON() {
            if (this.x == null || this.y == null) return null;
            return {
                type: Point.TYPE,
                state: {
                    x: this.x,
                    y: this.y,
                    labelValue: this.labelValue,
                    id: this.id
                }
            }
        }

        loadJSON(json) {
            if (json.type != Point.TYPE) return;
            this.x = json.state.x;
            this.y = json.state.y;
            this.labelValue = json.state.labelValue;
            this.id = json.state.id;
        }

    }

    class LineSegment extends GeometricElement {

        static TYPE = "LineSegment";
        static LABEL_CLASS = "line_segment_label";
        static ICON_CLASS = "line-segment-image";

        endpoints = [];
        selectedPoint;
        creationLineLocation;
        draggingDiff;
        $lengthLabel;
        lengthLabelValue;

        constructor(){
            super();
        }

        draw() {
            if (this.endpoints.length == 1 && this.creationLineLocation != null) {
                presenter.context.strokeStyle = presenter.configuration.strokeColor;
                presenter.context.beginPath();
                presenter.context.moveTo(this.endpoints[0].x, this.endpoints[0].y);
                presenter.context.lineTo(this.creationLineLocation.x, this.creationLineLocation.y);
                presenter.context.stroke();
                presenter.context.closePath();
            }
            this.drawLines();
            for (var i = 0; i < this.endpoints.length; i++) this.endpoints[i].draw();
            this.updateLengthLabel();
        };

        drawLines() {
            if (this.endpoints.length == 2) {
                presenter.context.strokeStyle = presenter.configuration.strokeColor;
                presenter.context.beginPath();
                presenter.context.moveTo(this.endpoints[0].x, this.endpoints[0].y);
                presenter.context.lineTo(this.endpoints[1].x, this.endpoints[1].y);
                presenter.context.stroke();
                presenter.context.closePath();
            }
        }

        append() {
            for (var i = 0; i < this.endpoints.length; i++) this.endpoints[i].append();
            if (!this.lengthLabelValue) {
                this.lengthLabelValue = presenter.createLabel(presenter.lowerLabelsList, LOWER_ALPHABET);
            }
            if (presenter.figuresList.indexOf(this) == -1) {
                presenter.figuresList.push(this);
            }
        }

        remove() {
            var selectedPoint = this.selectedPoint;
            if (presenter.editFigure == this && selectedPoint != null) {
                this.selectedPoint = null;
                selectedPoint.removeParent(this);
                selectedPoint.removeAllParents();
            }

            for (var i = 0; i < this.endpoints.length; i++) {
                presenter.removePointFromFigure(this.endpoints[i], this);
            }

            var figuresIndex = presenter.figuresList.indexOf(this);
            if (figuresIndex != -1) {
                presenter.figuresList.splice(figuresIndex, 1);
            }

            presenter.destroyLabel(this.lengthLabelValue, presenter.lowerLabelsList);
            this.removeLengthLabel();
        }

        insertClickHandler(event) {
            if (presenter.newFigure == this && this.endpoints.length < 2) {
                this.insertEndpoint(event);
            }
            if (this.endpoints.length == 2) {
                this.addLengthLabel();
                this.creationLineLocation = null;
                presenter.pushState();
                presenter.newFigure = new LineSegment();
            }
        }

        insertMoveHandler(event) {
            if (this.endpoints.length == 1) {
                var location = getCanvasEventLocation(event);
                if (this.creationLineLocation == null || (Math.abs(location.x - this.creationLineLocation.x) >= 1 || Math.abs(location.y - this.creationLineLocation.y) >= 1)) {
                    this.creationLineLocation = location;
                    return true;
                }
            }
            return false;
        }

        insertEndpoint(event) {
            var point;
            var clickedPoint = presenter.getClickedPoint(event);
            if (clickedPoint != null) {
                point = clickedPoint;
            } else {
                var location = getCanvasEventLocation(event);
                point = new Point();
                point.setLocation(location.x, location.y);
            }
            point.setIsRoot(false);
            point.addParent(this);
            this.endpoints.push(point);
            this.append();
        }

        moveHandler(event) {
            if (this.selectedPoint) this.selectedPoint.moveHandler(event);
            if (this.draggingDiff) {
                var location = getCanvasEventLocation(event);
                for (var i = 0; i < this.endpoints.length; i++)
                    this.endpoints[i].setLocation(location.x + this.draggingDiff[i].x, location.y + this.draggingDiff[i].y);
            }
        }

        isClicked(event) {
            for (var i = 0; i < this.endpoints.length; i++) {
                if (this.endpoints[i].isClicked(event)) return true;
            }
            return this.isLineClicked(event);
        }

        isLineClicked(event) {
            if (this.endpoints.length < 2) return false;
            var location = getCanvasEventLocation(event);
            var left, right, top, bottom;
            if (this.endpoints[0].x > this.endpoints[1].x) {
                left = this.endpoints[1].x;
                right = this.endpoints[0].x;
            } else {
                left = this.endpoints[0].x;
                right = this.endpoints[1].x;
            }

            if (this.endpoints[0].y > this.endpoints[1].y) {
                top = this.endpoints[1].y;
                bottom = this.endpoints[0].y;
            } else {
                top = this.endpoints[0].y;
                bottom = this.endpoints[1].y;
            }

            if (right - left < 10) {
                right += 5;
                left -= 5;
            }

            if (bottom - top < 10) {
                top -= 5;
                bottom += 5;
            }

            if (location.x < left || location.x > right || location.y < top || location.y > bottom) return false;
            return this.distanceFromPoint(location.x, location.y) < 5;

        }

        distanceFromPoint(x,y) {
            if (this.endpoints.length < 2) return null;
            var x1 = this.endpoints[0].x;
            var y1 = this.endpoints[0].y;
            var x2 = this.endpoints[1].x;
            var y2 = this.endpoints[1].y;
            var base = Math.pow((x2-x1),2) + Math.pow((y2-y1),2);
            if (base <= 0) return null;
            return Math.abs((x2-x1)*(y-y1)-(x-x1)*(y2-y1)) / Math.sqrt(base);
        }

        addLabel() {
            for (var i = 0; i < this.endpoints.length; i++) this.endpoints[i].addLabel();
        }

        updateLabel() {
            for (var i = 0; i < this.endpoints.length; i++) this.endpoints[i].updateLabel();
        }

        hideLabel() {
            for (var i = 0; i < this.endpoints.length; i++) this.endpoints[i].hideLabel();
            this.setLengthLabelAndMeasureVisibility(false, presenter.lengthMeasuresVisibility);
        }

        showLabel() {
            for (var i = 0; i < this.endpoints.length; i++) this.endpoints[i].showLabel();
            this.setLengthLabelAndMeasureVisibility(true, presenter.lengthMeasuresVisibility);
        }

        hideLengthMeasure() {
            this.setLengthLabelAndMeasureVisibility(presenter.labelsVisibility, false);
        }

        showLengthMeasure() {
            this.setLengthLabelAndMeasureVisibility(presenter.labelsVisibility, true);
        }

        setLengthLabelAndMeasureVisibility(isLabelVisible, isMeasureVisible) {
            if (!this.$lengthLabel) return;
            if (!isLabelVisible && !isMeasureVisible) {
                this.$lengthLabel.css('display', 'none');
            } else {
                this.$lengthLabel.css('display', '');
                var text = "";
                if (isLabelVisible) {
                    text = this.lengthLabelValue;
                }
                if (isMeasureVisible) {
                    var length = this.getUnitLength();
                    if (length != null) {
                        if (text.length > 0) {
                            text += " = ";
                        }
                        var lengthLabelMultiplier = Math.pow(10, presenter.configuration.lengthDecimalPoint) * 1.0;
                        text += Math.round(lengthLabelMultiplier * length)/lengthLabelMultiplier;
                    }
                }
                if (text.length > 0) {
                    this.$lengthLabel.html(text);
                } else {
                    this.$lengthLabel.css('display', 'none');
                }
            }
        }

        removeLabel() {
            for (var i = 0; i < this.endpoints.length; i++) this.endpoints[i].removeLabel();
        }

        removeLengthLabel() {
            if (this.$lengthLabel) {
                this.$lengthLabel.remove();
                this.$lengthLabel = null;
            }
        }

        getLabelValues() {
            var values = [];
            for (var i = 0; i < this.endpoints.length; i++) values = values.concat(this.endpoints[i].getLabelValues());
            return values;
        }

        getLowerLabelValues() {
            var values = [];
            if (!!this.lengthLabelValue) values.push(this.lengthLabelValue);
            return values;
        }

        getLengthLabelPosition() {
            if (this.endpoints.length < 2) return null;
            return {
                x: (this.endpoints[0].x + this.endpoints[1].x)/2.0,
                y: (this.endpoints[0].y + this.endpoints[1].y)/2.0
            };
        }

        getLength() {
            if (this.endpoints.length < 2 || this.getClassType() != "LineSegment") return null;
            return Math.sqrt(Math.pow(this.endpoints[0].x - this.endpoints[1].x, 2) + Math.pow(this.endpoints[0].y - this.endpoints[1].y, 2));
        }

        getUnitLength() {
            var length = this.getLength();
            if (length == null) return null;
            return presenter.convertToUnit(length);
        }

        addLengthLabel() {
            if (this.endpoints.length < 2) return;
            if (!this.$lengthLabel) {
                this.$lengthLabel = $('<div></div>');
                this.$lengthLabel.addClass(presenter.CSS_CLASSES.LABEL);
                this.$lengthLabel.addClass(LineSegment.LABEL_CLASS);
                this.$lengthLabel.css('position', 'absolute');
                this.$lengthLabel.insertBefore(presenter.$canvasOverlay);
            }
            this.setLengthLabelAndMeasureVisibility(presenter.labelsVisibility, presenter.lengthMeasuresVisibility);
            var position = this.getLengthLabelPosition();
            this.$lengthLabel.css('top', 'calc(' + position.y + 'px - 0.5em)');
            this.$lengthLabel.css('left', 'calc(' + position.x + 'px - 0.5em)');
        }

        updateLengthLabel() {
            if (this.endpoints.length < 2 || !this.$lengthLabel) return;
            this.setLengthLabelAndMeasureVisibility(presenter.labelsVisibility, presenter.lengthMeasuresVisibility);
            var position = this.getLengthLabelPosition();
            this.$lengthLabel.css('top', 'calc(' + position.y + 'px - 0.5em)');
            this.$lengthLabel.css('left', 'calc(' + position.x + 'px - 0.5em)');
        }

        setSelected(isSelected, event) {
            if (this.endpoints.length == 0) return;
            for (var i = 0; i < this.endpoints.length; i++) this.endpoints[i].setSelected(false, event);
            this.selectedPoint = null;
            this.draggingDiff = null;
            if (isSelected) {
                if (this.endpoints.length == 2 && this.endpoints[1].isClicked(event)) {
                    this.selectedPoint = this.endpoints[1];
                } else if (this.endpoints[0].isClicked(event)) {
                    this.selectedPoint = this.endpoints[0];
                }
                if (this.selectedPoint) {
                    this.selectedPoint.setSelected(isSelected, event);
                } else {
                    for (var i = 0; i < this.endpoints.length; i++) this.endpoints[i].setSelected(isSelected, event);
                    var location = getCanvasEventLocation(event);
                    this.draggingDiff = [];
                    this.draggingDiff.push({
                        x: this.endpoints[0].x - location.x,
                        y: this.endpoints[0].y - location.y,
                    });
                    this.draggingDiff.push({
                        x: this.endpoints[1].x - location.x,
                        y: this.endpoints[1].y - location.y,
                    });
                }
            }
        }

        getClassType() {
            return LineSegment.TYPE;
        }

        toJSON() {
            if (this.endpoints.length < 2) return null;
            var endpointStates = [null, null];
            for (var i = 0; i < this.endpoints.length; i++) {
                endpointStates[i] = this.endpoints[i].toJSON();
                if (endpointStates[i] == null) return null;
            }
            return {
                type: this.getClassType(),
                state: {
                    endpointStates: endpointStates,
                    lengthLabelValue: !!this.lengthLabelValue ? this.lengthLabelValue : ""
                }
            }
        }

        loadJSON(json) {
            if (json.type != this.getClassType()) return;
            if (!!json.state.lengthLabelValue) this.lengthLabelValue = json.state.lengthLabelValue;
            for (var i = 0; i < 2; i++) {
                if (i < this.endpoints.length) {
                    this.endpoints[i].loadJSON(json.state.endpointStates[i]);
                } else {
                    var point;
                    var existingPoint = presenter.getPointByID(json.state.endpointStates[i].state.id);
                    if (existingPoint != null) {
                        point = existingPoint;
                    } else {
                        point = new Point();
                        point.setIsRoot(false);
                    }
                    point.addParent(this);
                    this.endpoints.push(point);
                    point.loadJSON(json.state.endpointStates[i]);
                }
            }
            this.addLengthLabel();
        }
    }

    class HalfOpenLineSegment extends LineSegment {

        static TYPE = "HalfOpenLineSegment";
        static LABEL_CLASS = "half_open_line_segment_label";
        static ICON_CLASS = "half-open-line-segment-image";

        drawLines() {
            super.drawLines();
            if (this.endpoints.length == 1 && this.creationLineLocation != null) {
                this.drawLineExtension(this.endpoints[0], this.creationLineLocation);
            } else if (this.endpoints.length == 2) {
                this.drawLineExtension(this.endpoints[0], this.endpoints[1]);
            }
        }

        drawLineExtension(point1, point2) {
            var targetX = -1;
            var targetY = -1;
            var dx = point2.x - point1.x;
            var dy = point2.y - point1.y;
            if (dx == 0 && dy == 0) return;

            var maxX = dx > 0 ? presenter.canvasWidth - point2.x : point2.x;
            var y = maxX * dy / dx;
            y = dx > 0 ? point2.y + y : point2.y - y;
            if (y > 0 && y < presenter.canvasHeight) {
                targetX = dx > 0 ? presenter.canvasWidth : 0;
                targetY = y;
            } else {
                var maxY = dy > 0 ? presenter.canvasHeight - point2.y : point2.y;
                var x = maxY * dx / dy;
                x = dy > 0 ? point2.x + x : point2.x - x;
                if (x > 0 && x < presenter.canvasWidth) {
                    targetX = x;
                    targetY = dy > 0 ? presenter.canvasHeight : 0;
                }
            }

            if (targetX >= 0 && targetY >= 0) {
                presenter.context.strokeStyle = presenter.configuration.strokeColor;
                presenter.context.beginPath();
                presenter.context.moveTo(point2.x, point2.y);
                presenter.context.lineTo(targetX, targetY);
                presenter.context.stroke();
                presenter.context.closePath();
            }
        }

        isLineClicked(event) {
            if (this.endpoints.length < 2) return false;
            var location = getCanvasEventLocation(event);
            if (this.endpoints[0].x < this.endpoints[1].x) {
                if (location.x < this.endpoints[0].x) return false;
            } else {
                if (location.x > this.endpoints[0].x) return false;
            }
            if (this.endpoints[0].y < this.endpoints[1].y) {
                if (location.y < this.endpoints[0].y) return false;
            } else {
                if (location.y > this.endpoints[0].y) return false;
            }
            return this.distanceFromPoint(location.x, location.y) < 5;
        }

        insertClickHandler(event) {
            if (presenter.newFigure == this && this.endpoints.length < 2) {
                this.insertEndpoint(event);
            }
            if (this.endpoints.length == 2) {
                this.addLengthLabel();
                presenter.pushState();
                presenter.newFigure = new HalfOpenLineSegment();
            }
        }

        getClassType() {
            return HalfOpenLineSegment.TYPE;
        }

    }

    class OpenLineSegment extends HalfOpenLineSegment {

        static TYPE = "OpenLineSegment";
        static LABEL_CLASS = "open_line_segment_label";
        static ICON_CLASS = "open-line-segment-image";

        drawLines() {
            super.drawLines();
            if (this.endpoints.length == 1 && this.creationLineLocation != null) {
                this.drawLineExtension(this.creationLineLocation, this.endpoints[0]);
            } else if (this.endpoints.length == 2) {
                this.drawLineExtension(this.endpoints[1], this.endpoints[0]);
            }
        }

        isLineClicked(event) {
            if (this.endpoints.length < 2) return false;
            var location = getCanvasEventLocation(event);
            return this.distanceFromPoint(location.x, location.y) < 5;
        }

        insertClickHandler(event) {
            if (presenter.newFigure == this && this.endpoints.length < 2) {
                this.insertEndpoint(event);
            }
            if (this.endpoints.length == 2) {
                this.addLengthLabel();
                presenter.pushState();
                presenter.newFigure = new OpenLineSegment();
            }
        }

        getClassType() {
            return OpenLineSegment.TYPE;
        }

    }

    class CircleBase extends GeometricElement {
        static TYPE = "CircleBaseSegment";
        static LABEL_CLASS = "circle_base_label";
        static ICON_CLASS = "circle-base-image";

        centerPoint;
        radius = 0;
        draggingDiff;

        constructor() {
            super();
        }

        draw() {
            if (this.centerPoint != null) {
                this.drawCircle(this.centerPoint.x, this.centerPoint.y, this.radius);
                this.centerPoint.draw();
            }
        };

        drawCircle(x, y, radius) {
            presenter.context.fillStyle = presenter.configuration.fillColor;
            presenter.context.strokeStyle = presenter.configuration.strokeColor;
            presenter.context.beginPath();
            presenter.context.arc(x, y, radius, 0, 2 * Math.PI);
            presenter.context.stroke();
            presenter.context.closePath();
        }

        append() {
            if (this.centerPoint) {
                this.centerPoint.append();
            }

            if (presenter.figuresList.indexOf(this) == -1) {
                presenter.figuresList.push(this);
            }
        }

        remove() {
            if (presenter.editFigure == this && this.draggingDiff == null) {
                this.centerPoint.removeParent(this);
                this.centerPoint.removeAllParents();
            }

            if (!!this.centerPoint) {
                presenter.removePointFromFigure(this.centerPoint, this);
            }

            var figuresIndex = presenter.figuresList.indexOf(this);
            if (figuresIndex != -1) {
                presenter.figuresList.splice(figuresIndex, 1);
            }
        }

        insertClickHandler(event) {
            if (presenter.newFigure == this) {
                if (this.centerPoint == null) {
                    this.insertCenterPoint(event);
                    presenter.pushState();
                    presenter.newFigure = new CircleBase();
                }
            }
        }

        insertCenterPoint(event) {
            var point;
            var clickedPoint = presenter.getClickedPoint(event);
            if (clickedPoint != null) {
                point = clickedPoint;
            } else {
                var location = getCanvasEventLocation(event);
                point = new Point();
                point.setLocation(location.x, location.y);
            }
            point.setIsRoot(false);
            point.addParent(this);
            this.centerPoint = point;
            this.append();
        }

        insertMoveHandler(event) {
            return false;
        }

        moveHandler(event) {
            if (!this.centerPoint) return;
            if (this.draggingDiff != null) {
                var location = getCanvasEventLocation(event);
                this.centerPoint.setLocation(location.x + this.draggingDiff.x, location.y + this.draggingDiff.y);
            } else {
                this.centerPoint.moveHandler(event);
            }
        }

        isClicked(event) {
            if (!this.centerPoint) return false;
            if (this.centerPoint.isClicked(event)) return true;
            return this.isRimClicked(event);
        }

        isRimClicked(event) {
            if (!this.centerPoint) return false;
            var location = getCanvasEventLocation(event);
            var distance = this.distanceFromCenter(location.x, location.y);
            return Math.abs(this.radius - distance) < 5;
        }

        distanceFromCenter(x, y) {
            var diffX = this.centerPoint.x - x;
            var diffY = this.centerPoint.y - y;
            return Math.sqrt(diffX * diffX + diffY * diffY);
        }

        addLabel() {
            if (this.centerPoint) this.centerPoint.addLabel();
        }

        updateLabel() {
            if (this.centerPoint) this.centerPoint.updateLabel(event);
        }

        hideLabel() {
            if (this.centerPoint) this.centerPoint.hideLabel(event);
        }

        showLabel() {
            if (this.centerPoint) this.centerPoint.showLabel(event);
        }

        removeLabel() {
            if (this.centerPoint) this.centerPoint.removeLabel(event);
        }

        getLabelValues() {
            if (this.centerPoint) return this.centerPoint.getLabelValues(event);
            return [];
        }

        setSelected(isSelected, event) {
            if (!this.centerPoint) return;
            this.draggingDiff = null;
            this.centerPoint.setSelected(isSelected, event);
            if (isSelected && !this.centerPoint.isClicked(event) && !!event) {
                var location = getCanvasEventLocation(event);
                this.draggingDiff = {
                    x: this.centerPoint.x - location.x,
                    y: this.centerPoint.y - location.y
                };
            }
        }

        getClassType() {
            return CircleBase.TYPE;
        }

        toJSON() {
            if (this.centerPoint == null || this.radius == 0) return null;
            var centerPointState = this.centerPoint.toJSON();
            if (centerPointState == null) return null;

            return {
                type: this.getClassType(),
                state: {
                    centerPoint: centerPointState,
                    radius: this.radius
                }
            }
        }

        loadJSON(json) {
            if (json.type != this.getClassType()) return;
            if (this.centerPoint == null) {
                var point;
                var existingPoint = presenter.getPointByID(json.state.centerPoint.state.id);
                if (existingPoint != null) {
                    point = existingPoint;
                } else {
                    point = new Point();
                    point.setIsRoot(false);
                }
                point.addParent(this);
                this.centerPoint = point;
            }
            this.centerPoint.loadJSON(json.state.centerPoint);
            this.radius = json.state.radius;
        }
    }

    class CircleWithPoint extends CircleBase {
            static TYPE = "CircleWithPoint";
            static LABEL_CLASS = "circle_with_point_label";
            static ICON_CLASS = "circle-with-point-image";

            rimPoint;
            radius = 0;
            selectedPoint;

        setSelected(isSelected, event) {
            if (!this.centerPoint || !this.rimPoint) return;
            this.draggingDiff = null;
            this.selectedPoint = null;
            this.centerPoint.setSelected(false);
            this.rimPoint.setSelected(false);
            if (!!event) {
                if (this.centerPoint.isClicked(event)) {
                    this.centerPoint.setSelected(isSelected, event);
                    if (isSelected) this.selectedPoint = this.centerPoint;
                } else if (this.rimPoint.isClicked(event)) {
                    this.rimPoint.setSelected(isSelected, event);
                    if (isSelected) this.selectedPoint = this.rimPoint;
                } else {
                    this.centerPoint.setSelected(isSelected, event);
                    this.rimPoint.setSelected(isSelected, event);
                    var location = getCanvasEventLocation(event);
                    this.draggingDiff = {
                        x: this.centerPoint.x - location.x,
                        y: this.centerPoint.y - location.y
                    };
                }
            }
        }

        insertClickHandler(event) {
            if (presenter.newFigure == this) {
                if (this.centerPoint == null) {
                    this.insertCenterPoint(event);
                } else if (this.rimPoint == null) {
                    this.insertRimPoint(event);
                    presenter.pushState();
                    presenter.newFigure = new CircleWithPoint();
                }
            }
        }

        insertRimPoint(event) {
            var point;
            var clickedPoint = presenter.getClickedPoint(event);
            if (clickedPoint != null) {
                point = clickedPoint;
            } else {
                var location = getCanvasEventLocation(event);
                point = new Point();
                point.setLocation(location.x, location.y);
            }
            point.setIsRoot(false);
            point.addParent(this);
            this.rimPoint = point;
            this.radius = this.distanceFromCenter(this.rimPoint.x, this.rimPoint.y);
            this.append();
        }

        insertMoveHandler(event) {
            if (this.centerPoint != null && this.rimPoint == null) {
                var location = getCanvasEventLocation(event);
                var newRadius = this.distanceFromCenter(location.x, location.y);
                if (Math.abs(this.radius - newRadius) >= 1) {
                    this.radius = newRadius;
                    return true;
                }
            }
            return false;
        }

        append() {
            super.append();
            if (this.rimPoint != null) {
                this.rimPoint.append();
            }
        }

        draw() {
            super.draw();
            if (this.rimPoint != null) {
                this.radius = this.distanceFromCenter(this.rimPoint.x, this.rimPoint.y);
                this.rimPoint.draw();
            }
        };

        moveHandler(event) {
            if (!this.centerPoint || !this.rimPoint) return;

            if (this.selectedPoint) {
                this.selectedPoint.moveHandler(event);
            }
            else {
                var oldX = this.centerPoint.x;
                var oldY = this.centerPoint.y;
                var location = getCanvasEventLocation(event);
                this.centerPoint.setLocation(location.x + this.draggingDiff.x, location.y + this.draggingDiff.y);
                this.rimPoint.setLocation(this.rimPoint.x + this.centerPoint.x - oldX, this.rimPoint.y + this.centerPoint.y - oldY);
            }
        }

        addLabel() {
            super.addLabel();
            if (this.rimPoint) this.rimPoint.addLabel();
        }

        updateLabel() {
            super.updateLabel();
            if (this.rimPoint) this.rimPoint.updateLabel();
        }

        hideLabel() {
            super.hideLabel();
            if (this.rimPoint) this.rimPoint.hideLabel();
        }

        showLabel() {
            super.showLabel();
            if (this.rimPoint) this.rimPoint.showLabel(event);
        }

        removeLabel() {
            super.removeLabel();
            if (this.rimPoint) this.rimPoint.removeLabel();
        }

        getLabelValues() {
            var values = super.getLabelValues();
            if (!!this.rimPoint) values = values.concat(this.rimPoint.getLabelValues());
            return values;
        }

        getClassType() {
            return CircleWithPoint.TYPE;
        }

        remove() {
            if (presenter.editFigure == this && this.draggingDiff == null) {
                if (!!this.centerPoint && this.centerPoint.isSelected) {
                    this.centerPoint.removeParent(this);
                    this.centerPoint.removeAllParents();
                }
                if (!!this.rimPoint && this.rimPoint.isSelected) {
                    this.rimPoint.removeParent(this);
                    this.rimPoint.removeAllParents();
                }
            }

            if (!!this.centerPoint) presenter.removePointFromFigure(this.centerPoint, this);
            if (!!this.rimPoint) presenter.removePointFromFigure(this.rimPoint, this);

            var figuresIndex = presenter.figuresList.indexOf(this);
            if (figuresIndex != -1) {
                presenter.figuresList.splice(figuresIndex, 1);
            }
        }

        toJSON() {
            if (this.rimPoint == null) return null;
            var rimPointState = this.rimPoint.toJSON();
            if (rimPointState == null) return null;

            var circleState = super.toJSON();
            circleState.state.rimPoint = rimPointState;
            return circleState;
        }

        loadJSON(json) {
            if (json.type != this.getClassType()) return;
            super.loadJSON(json);
            if (this.rimPoint == null) {
                var point;
                var existingPoint = presenter.getPointByID(json.state.rimPoint.state.id);
                if (existingPoint != null) {
                    point = existingPoint;
                } else {
                    point = new Point();
                    point.setIsRoot(false);
                }
                point.addParent(this);
                this.rimPoint = point;
            }
            this.rimPoint.loadJSON(json.state.rimPoint);
        }

    }

    class Circle extends CircleBase {
            static TYPE = "Circle";
            static LABEL_CLASS = "circle_label";
            static ICON_CLASS = "circle-image";

            isEditButtonAvailable = true;

            getClassType() {
                return Circle.TYPE;
            }

            insertClickHandler(event) {
                if (presenter.newFigure == this) {
                    if (this.centerPoint == null) {
                        var self = this;
                        presenter.showConfigPopup(presenter.labels.circlePopupTitle, [{
                            name: 'radius',
                            title: presenter.labels.radius,
                            value: '',
                            type: 'number',
                            min: 0
                        }], (result) => {
                            for (var i = 0; i < result.length; i++) {
                                if (result[i].name == 'radius') {
                                    if (result[i].value > 0) {
                                        self.radius = result[i].value;
                                        self.insertCenterPoint(event);
                                        presenter.redrawCanvas();
                                        presenter.pushState();
                                        presenter.newFigure = new Circle();
                                    }
                                    return;
                                }
                            }
                        }, ()=>{});
                    }
                }
            }

            openEditPopup() {
                var self = this;
                presenter.showConfigPopup(presenter.labels.circlePopupTitle, [{
                    name: 'radius',
                    title: presenter.labels.radius,
                    value: presenter.convertToUnit(this.radius),
                    type: 'number',
                    min: 0
                }], (result) => {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].name == 'radius') {
                            if (result[i].value > 0) {
                                self.radius = result[i].value;
                                presenter.pushState();
                                presenter.redrawCanvas();
                            }
                            return;
                        }
                    }
                }, ()=>{});
            }

    }

    class Compasses extends CircleBase {
            static TYPE = "Compasses";
            static LABEL_CLASS = "compasses_label";
            static ICON_CLASS = "compasses-image";

            referencePoints = [];
            tmpLocation;
            angle;
            isReady = false;

            getClassType() {
                return Compasses.TYPE;
            }

            draw() {
                if (this.radius > 0 && this.centerPoint == null && this.tmpLocation != null && presenter.newFigure == this) {
                    this.drawCircle(this.tmpLocation.x, this.tmpLocation.y, this.radius);
                } else if (this.centerPoint != null) {
                    if (this.isReady) {
                        this.drawArc();
                    } else {
                        this.drawCircle(this.centerPoint.x, this.centerPoint.y, this.radius);
                        this.drawArcCenterPoint();
                    }
                    this.centerPoint.draw();
                }
            }

            drawArc() {
                presenter.context.fillStyle = presenter.configuration.fillColor;
                presenter.context.strokeStyle = presenter.configuration.strokeColor;
                presenter.context.beginPath();
                presenter.context.arc(this.centerPoint.x, this.centerPoint.y, this.radius, this.angle - Math.PI / 8, this.angle + Math.PI / 8);
                presenter.context.stroke();
                presenter.context.closePath();
            }

            drawArcCenterPoint() {
                var x = this.centerPoint.x + this.radius * Math.cos(this.angle);
                var y = this.centerPoint.y + this.radius * Math.sin(this.angle);
                Point.drawPoint(presenter.context, x, y, false);
            }

            isArcClicked(event) {
                if (!this.isRimClicked(event)) return false;
                var location = getCanvasEventLocation(event);
                var angle = this.getAngle(location.x, location.y);
                var maxAngle = this.angle + Math.PI / 8;
                var minAngle = this.angle - Math.PI / 8;
                if (minAngle < -1.0 * Math.PI && 2.0 * Math.PI + minAngle < angle) return true;
                if (maxAngle > Math.PI && -2.0 * Math.PI + maxAngle > angle) return true;
                return angle <= maxAngle && angle >= minAngle;
            }

            isClicked(event) {
                if (!this.centerPoint) return false;
                if (this.centerPoint.isClicked(event)) return true;
                return this.isArcClicked(event);
            }

            insertClickHandler(event) {
                if (this.referencePoints.length < 2) {
                    var clickedPoint = presenter.getClickedPoint(event);
                    if (clickedPoint != null) {
                        if (this.referencePoints.length == 1 && this.referencePoints[0] == clickedPoint) {
                            clickedPoint.setSelected(false);
                            this.referencePoints.pop();
                        }
                        clickedPoint.setSelected(true, event);
                        this.referencePoints.push(clickedPoint);
                        if (this.referencePoints.length == 2) {
                            this.radius = this.distanceBetweenPoints(this.referencePoints[0], this.referencePoints[1]);
                            this.append();
                            presenter.redrawCanvas();
                        }
                    }
                } else {
                    if (this.centerPoint == null) {
                    var clickedPoint = presenter.getClickedPoint(event);
                    if (clickedPoint != null) {
                        this.centerPoint = clickedPoint;
                    } else {
                        var location = getCanvasEventLocation(event);
                        this.centerPoint = new Point();
                        this.centerPoint.setLocation(location.x, location.y);
                    }
                    this.centerPoint.setIsRoot(false);
                    this.centerPoint.addParent(this);
                    this.centerPoint.setSelected(true);
                    this.append();
                    } else {
                        var location = getCanvasEventLocation(event);
                        this.angle = this.getAngle(location.x, location.y);
                        this.isReady = true;
                        this.centerPoint.setSelected(false);
                        for (var i = 0; i < this.referencePoints.length; i++) {
                            this.referencePoints[i].setSelected(false);
                        }
                        presenter.pushState();
                        presenter.newFigure = new Compasses();
                    }
                }
            }

            insertMoveHandler(event) {
                if (this.referencePoints.length == 2) {
                    var newLocation = getCanvasEventLocation(event);
                    if (this.tmpLocation == null || Math.abs(this.tmpLocation.x - newLocation.x) >= 1 || Math.abs(this.tmpLocation.y - newLocation.y) >= 1) {
                        this.tmpLocation = newLocation;
                        if (this.centerPoint != null) {
                            this.angle = this.getAngle(newLocation.x, newLocation.y);
                        }
                        return true;
                    }
                }
                return false;
            }

            distanceBetweenPoints(point1, point2) {
                return Math.sqrt(Math.pow(point1.x-point2.x, 2) + Math.pow(point1.y-point2.y, 2));
            }

            getAngle(x, y) {
                if (this.centerPoint == null) return 0;
                return presenter.getAngle(this.centerPoint.x, this.centerPoint.y, x, y);
            }

            setSelected(isSelected, event) {
                if (!this.centerPoint) return;
                this.angleDiff = null;
                this.centerPoint.setSelected(isSelected, event);
                if (isSelected && !this.centerPoint.isClicked(event) && !!event) {
                    var location = getCanvasEventLocation(event);
                    var newAngle = this.getAngle(location.x, location.y);
                    this.angleDiff = this.angle - newAngle;
                }
            }

            moveHandler(event) {
                if (!this.centerPoint) return;
                if (this.angleDiff != null) {
                    var location = getCanvasEventLocation(event);
                    var newAngle = this.getAngle(location.x, location.y);
                    this.angle = newAngle + this.angleDiff;
                } else {
                    this.centerPoint.moveHandler(event);
                }
            }

            remove() {
                if (presenter.editFigure == this && this.angleDiff == null) {
                    this.centerPoint.removeParent(this);
                    this.centerPoint.removeAllParents();
                }

                if (!!this.centerPoint) {
                    presenter.removePointFromFigure(this.centerPoint, this);
                }

                var figuresIndex = presenter.figuresList.indexOf(this);
                if (figuresIndex != -1) {
                    presenter.figuresList.splice(figuresIndex, 1);
                }
            }

            toJSON() {
                if (!this.isReady) return null;
                var circleState = super.toJSON();
                if (circleState != null) {
                    circleState.state.angle = this.angle;
                }
                return circleState;
            }

            loadJSON(json) {
                if (json.type != this.getClassType()) return;
                super.loadJSON(json);
                this.angle = json.state.angle;
                this.isReady = true;
            }

    }

    class ArcWithCenterPoint extends CircleBase {
        static TYPE = "ArcWithCenterPoint";
        static LABEL_CLASS = "arc_with_center_point_label";
        static ICON_CLASS = "arc-with-center-point-image";

        arcStartPoint;
        arcEndPoint;
        tmpEndLocation;

        getClassType() {
            return ArcWithCenterPoint.TYPE;
        }

        draw() {
            if (this.centerPoint) this.centerPoint.draw();
            if (this.arcEndPoint || this.tmpEndLocation) {
                this.drawArc();
            }
            if (this.arcStartPoint) this.arcStartPoint.draw();
            if (this.arcEndPoint) this.arcEndPoint.draw();
        }

        drawArc() {
            this.radius = this.distanceFromCenter(this.arcStartPoint.x, this.arcStartPoint.y);
            var startAngle = this.getStartAngle();
            var endAngle;
            if (this.arcEndPoint) {
                endAngle = this.getEndAngle();
            } else if (this.tmpEndLocation) {
                endAngle = this.getTmpEndAngle();
            } else {
                return;
            }
            presenter.context.fillStyle = presenter.configuration.fillColor;
            presenter.context.strokeStyle = presenter.configuration.strokeColor;
            presenter.context.beginPath();
            presenter.context.arc(this.centerPoint.x, this.centerPoint.y, this.radius, endAngle, startAngle);
            presenter.context.stroke();
            presenter.context.closePath();
        }

        getStartAngle() {
            return presenter.getAngle(this.centerPoint.x, this.centerPoint.y, this.arcStartPoint.x, this.arcStartPoint.y);
        }

        getEndAngle() {
            return presenter.getAngle(this.centerPoint.x, this.centerPoint.y, this.arcEndPoint.x, this.arcEndPoint.y);
        }

        getTmpEndAngle() {
            return presenter.getAngle(this.centerPoint.x, this.centerPoint.y, this.tmpEndLocation.x, this.tmpEndLocation.y);
        }

        insertClickHandler(event) {
            if (presenter.newFigure == this) {
                if (this.centerPoint == null) {
                    this.insertCenterPoint(event);
                } else if (this.arcStartPoint == null) {
                    this.insertArcStartPoint(event);
                } else if (this.arcEndPoint == null) {
                    this.insertArcEndPoint(event);
                    if (this.arcEndPoint != null) {
                        presenter.pushState();
                        presenter.newFigure = new ArcWithCenterPoint();
                    }
                }
            }
        }

        insertArcStartPoint(event) {
            var point = presenter.getClickedOrCreatePoint(event);
            if (point == this.centerPoint) return;
            point.setIsRoot(false);
            point.addParent(this);
            this.arcStartPoint = point;
            this.radius = this.distanceFromCenter(this.arcStartPoint.x, this.arcStartPoint.y);
            this.append();
        }

        insertArcEndPoint(event) {
            var point = presenter.getClickedOrCreatePoint(event);
            if (point == this.centerPoint || point == this.arcStartPoint) return;
            point.setIsRoot(false);
            point.addParent(this);
            this.arcEndPoint = point;
            this.append();
        }

        append() {
            super.append();
            if (this.arcStartPoint != null) {
                this.arcStartPoint.append();
            }
            if (this.arcEndPoint != null) {
                this.arcEndPoint.append();
            }
        }

        insertMoveHandler(event) {
            if (this.centerPoint != null && this.arcStartPoint != null && this.arcEndPoint == null) {
                var location = getCanvasEventLocation(event);
                if (this.tmpEndLocation == null || Math.abs(this.tmpEndLocation.x - location.x) > 1 || Math.abs(this.tmpEndLocation.y - location.y) > 1) {
                    this.tmpEndLocation = location;
                    return true;
                }
            }
            return false;
        }

        addLabel() {
            super.addLabel();
            if (this.arcStartPoint) this.arcStartPoint.addLabel();
            if (this.arcEndPoint) this.arcEndPoint.addLabel();
        }

        updateLabel() {
            super.updateLabel();
            if (this.arcStartPoint) this.arcStartPoint.updateLabel();
            if (this.arcEndPoint) this.arcEndPoint.updateLabel();
        }

        hideLabel() {
            super.hideLabel();
            if (this.arcStartPoint) this.arcStartPoint.hideLabel();
            if (this.arcEndPoint) this.arcEndPoint.hideLabel();
        }

        showLabel() {
            super.showLabel();
            if (this.arcStartPoint) this.arcStartPoint.showLabel();
            if (this.arcEndPoint) this.arcEndPoint.showLabel();
        }

        removeLabel() {
            super.removeLabel();
            if (this.arcStartPoint) this.arcStartPoint.removeLabel();
            if (this.arcEndPoint) this.arcEndPoint.removeLabel();
        }

        remove() {
            if (presenter.editFigure == this && this.draggingDiff == null) {
                if (!!this.centerPoint && this.centerPoint.isSelected) {
                    this.centerPoint.removeParent(this);
                    this.centerPoint.removeAllParents();
                }
                if (!!this.arcStartPoint && this.arcStartPoint.isSelected) {
                    this.arcStartPoint.removeParent(this);
                    this.arcStartPoint.removeAllParents();
                }
                if (!!this.arcEndPoint && this.arcEndPoint.isSelected) {
                    this.arcEndPoint.removeParent(this);
                    this.arcEndPoint.removeAllParents();
                }
            }

            if (!!this.centerPoint) presenter.removePointFromFigure(this.centerPoint, this);
            if (!!this.arcStartPoint) presenter.removePointFromFigure(this.arcStartPoint, this);
            if (!!this.arcEndPoint) presenter.removePointFromFigure(this.arcEndPoint, this);

            var figuresIndex = presenter.figuresList.indexOf(this);
            if (figuresIndex != -1) {
                presenter.figuresList.splice(figuresIndex, 1);
            }
        }

        setSelected(isSelected, event) {
            if (!this.centerPoint || !this.arcStartPoint|| !this.arcEndPoint) return;
            this.draggingDiff = null;
            this.centerPoint.setSelected(false);
            this.arcStartPoint.setSelected(false);
            this.arcEndPoint.setSelected(false);
            if (!!event) {
                if (this.centerPoint.isClicked(event)) {
                    this.centerPoint.setSelected(isSelected, event);
                } else if (this.arcStartPoint.isClicked(event)) {
                    this.arcStartPoint.setSelected(isSelected, event);
                } else if (this.arcEndPoint.isClicked(event)) {
                   this.arcEndPoint.setSelected(isSelected, event);
                } else {
                    this.centerPoint.setSelected(isSelected, event);
                    this.arcStartPoint.setSelected(isSelected, event);
                    this.arcEndPoint.setSelected(isSelected, event);
                    var location = getCanvasEventLocation(event);
                    this.draggingDiff = {
                        x: this.centerPoint.x - location.x,
                        y: this.centerPoint.y - location.y
                    };
                }
            }
        }

        moveHandler(event) {
            if (!this.centerPoint || !this.arcStartPoint || !this.arcEndPoint) return;

            if (this.draggingDiff != null) {
                var oldX = this.centerPoint.x;
                var oldY = this.centerPoint.y;
                var location = getCanvasEventLocation(event);
                this.centerPoint.setLocation(location.x + this.draggingDiff.x, location.y + this.draggingDiff.y);
                this.arcStartPoint.setLocation(this.arcStartPoint.x + this.centerPoint.x - oldX, this.arcStartPoint.y + this.centerPoint.y - oldY);
                this.arcEndPoint.setLocation(this.arcEndPoint.x + this.centerPoint.x - oldX, this.arcEndPoint.y + this.centerPoint.y - oldY);
            } else if (this.centerPoint.isSelected) {
                this.centerPoint.moveHandler(event);
            } else if (this.arcStartPoint.isSelected) {
                this.arcStartPoint.moveHandler(event);
            } else if (this.arcEndPoint.isSelected) {
                this.arcEndPoint.moveHandler(event);
            }
        }

        isArcClicked(event) {
            if (!this.isRimClicked(event)) return false;
            var location = getCanvasEventLocation(event);
            var angle = presenter.getAngle(this.centerPoint.x, this.centerPoint.y, location.x, location.y);
            var startAngle = this.getStartAngle();
            var endAngle = this.getEndAngle();
            if (startAngle > endAngle) {
                return endAngle <= angle && angle <= startAngle;
            } else {
                return endAngle <= angle || angle <= startAngle;
            }
        }

        isClicked(event) {
            if (!this.centerPoint || !this.arcStartPoint || !this.arcEndPoint) return false;
            if (this.centerPoint.isClicked(event)) return true;
            if (this.arcStartPoint.isClicked(event)) return true;
            if (this.arcEndPoint.isClicked(event)) return true;
            return this.isArcClicked(event);
        }

        getLabelValues() {
            var values = super.getLabelValues();
            if (!!this.arcStartPoint) values = values.concat(this.arcStartPoint.getLabelValues());
            if (!!this.arcEndPoint) values = values.concat(this.arcEndPoint.getLabelValues());
            return values;
        }

        toJSON() {
            if (!this.centerPoint || !this.arcStartPoint || !this.arcEndPoint) return null;
            var circleState = super.toJSON();
            if (circleState != null) {
                circleState.state.arcStartPoint = this.arcStartPoint.toJSON();
                circleState.state.arcEndPoint = this.arcEndPoint.toJSON();
            }
            return circleState;
        }

        loadJSON(json) {
            if (json.type != this.getClassType()) return;
            super.loadJSON(json);
            this.arcStartPoint = presenter.getOrCreateChildPointByID(json.state.arcStartPoint.state.id, this);
            this.arcStartPoint.loadJSON(json.state.arcStartPoint);
            this.arcEndPoint = presenter.getOrCreateChildPointByID(json.state.arcEndPoint.state.id, this);
            this.arcEndPoint.loadJSON(json.state.arcEndPoint);
        }
    }

    class Angle extends ArcWithCenterPoint {
        static TYPE = "Angle";
        static LABEL_CLASS = "angle_label";
        static ICON_CLASS = "angle-image";
        static DEF_RADIUS = 20;

        $angleLabel = null;

        getClassType() {
            return Angle.TYPE;
        }

        drawArc() {
            this.radius = Angle.DEF_RADIUS;
            this.updateAngleLabel();
            var startAngle = this.getStartAngle();
            var endAngle;
            if (this.arcEndPoint) {
                endAngle = this.getEndAngle();
            } else if (this.tmpEndLocation) {
                endAngle = this.getTmpEndAngle();
            } else {
                return;
            }
            var endX = this.centerPoint.x + this.radius * Math.cos(endAngle);
            var endY = this.centerPoint.y + this.radius * Math.sin(endAngle);
            presenter.context.fillStyle = presenter.configuration.fillColor;
            presenter.context.strokeStyle = presenter.configuration.strokeColor;
            presenter.context.beginPath();
            presenter.context.moveTo(this.centerPoint.x, this.centerPoint.y);
            presenter.context.lineTo(endX, endY);
            presenter.context.arc(this.centerPoint.x, this.centerPoint.y, this.radius, endAngle, startAngle);
            presenter.context.lineTo(this.centerPoint.x, this.centerPoint.y);
            presenter.context.stroke();
            presenter.context.closePath();
        }

        getAngleDegreeValue() {
            if (!this.centerPoint || !this.arcStartPoint || !this.arcEndPoint) return null;
            var radResult = null;
            var startAngle = this.getStartAngle();
            var endAngle = this.getEndAngle();
            if (startAngle > endAngle) {
                radResult = startAngle - endAngle;
            } else {
                radResult = 2*Math.PI + startAngle - endAngle;
            }
            return radResult * 180.0 / Math.PI;
        }

        addAngleLabel() {
            if (!this.centerPoint || !this.arcStartPoint || !this.arcEndPoint) return null;
            if (!this.$angleLabel) {
                this.$angleLabel = $('<div></div>');
                this.$angleLabel.addClass(presenter.CSS_CLASSES.LABEL);
                this.$angleLabel.addClass(Angle.LABEL_CLASS);
                this.$angleLabel.css('position', 'absolute');
                this.$angleLabel.insertBefore(presenter.$canvasOverlay);
            }
            if (presenter.angleMeasuresVisibility) {
                this.showAngleMeasure();
            } else {
                this.hideAngleMeasure();
            }
            var position = this.getAngleLabelPosition();
            this.$angleLabel.css('top', 'calc(' + position.y + 'px - 0.5em)');
            this.$angleLabel.css('left', 'calc(' + position.x + 'px - 0.5em)');
            if (!presenter.labelsVisibility) this.hideLabel();
        };

        updateAngleLabel() {
            if (!this.centerPoint || !this.arcStartPoint || !this.arcEndPoint || !this.$angleLabel) return null;
            if (presenter.angleMeasuresVisibility) {
                this.showAngleMeasure();
            } else {
                this.hideAngleMeasure();
            }
            var position = this.getAngleLabelPosition();
            this.$angleLabel.css('top', 'calc(' + position.y + 'px - 0.5em)');
            this.$angleLabel.css('left', 'calc(' + position.x + 'px - 0.5em)');
        }

        getAngleLabelPosition() {
            if (!this.centerPoint || !this.arcStartPoint || !this.arcEndPoint) return null;
            var resultAngle;
            var startAngle = this.getStartAngle();
            var endAngle = this.getEndAngle();
            if (startAngle > endAngle) {
                resultAngle = (startAngle + endAngle) / 2;
            } else {
                resultAngle = endAngle + (2 * Math.PI + startAngle - endAngle)/2;
            }

            var x = Math.round(this.centerPoint.x + this.radius * Math.cos(resultAngle));
            var y = Math.round(this.centerPoint.y + this.radius * Math.sin(resultAngle));
            return {x:x, y:y};
        }

        setAngleLabelAndMeasureVisibility(isLabelVisible, isMeasureVisible) {
            if (!this.$angleLabel) return;
            if (!isLabelVisible && !isMeasureVisible) {
                this.$angleLabel.css('display', 'none');
            } else {
                this.$angleLabel.css('display', '');
                var text = "";
                if (isLabelVisible) {
                    text = this.angleLabelValue;
                }
                if (isMeasureVisible) {
                    if (text.length > 0) {
                        text += " = ";
                    }
                    var angleLabelMultiplier = Math.pow(10, presenter.configuration.angleDecimalPoint) * 1.0;
                    text += Math.round(angleLabelMultiplier * this.getAngleDegreeValue())/angleLabelMultiplier + '°';
                }
                this.$angleLabel.html(text);
            }
        }

        hideAngleMeasure() {
            this.setAngleLabelAndMeasureVisibility(presenter.labelsVisibility, false);
        }

        showAngleMeasure() {
            this.setAngleLabelAndMeasureVisibility(presenter.labelsVisibility, true);
        }
        
        hideLabel() {
            super.hideLabel();
            this.setAngleLabelAndMeasureVisibility(false, presenter.angleMeasuresVisibility);
        }
        
        showLabel() {
            super.showLabel();
            this.setAngleLabelAndMeasureVisibility(true, presenter.angleMeasuresVisibility);
        }

        isArcClicked(event) {
            if (!this.centerPoint) return false;
            var location = getCanvasEventLocation(event);
            var distance = this.distanceFromCenter(location.x, location.y);
            if (distance > this.radius + 5 || distance < 10) return false;
            var angle = presenter.getAngle(this.centerPoint.x, this.centerPoint.y, location.x, location.y);
            var startAngle = this.getStartAngle();
            var endAngle = this.getEndAngle();
            if (startAngle > endAngle) {
                return endAngle <= angle && angle <= startAngle;
            } else {
                return endAngle <= angle || angle <= startAngle;
            }
        }

        append() {
            super.append();
            if (!this.angleLabelValue) {
                this.angleLabelValue = presenter.createLabel(presenter.greekLabelsList, GREEK_ALPHABET);
            }
        }

        insertClickHandler(event) {
            if (presenter.newFigure == this) {
                if (this.arcStartPoint == null) {
                    this.insertArcStartPoint(event);
                } else if (this.centerPoint == null) {
                    this.insertCenterPoint(event);
                } else if (this.arcEndPoint == null) {
                    this.insertArcEndPoint(event);
                    if (this.arcEndPoint != null) {
                        this.addAngleLabel();
                        presenter.pushState();
                        presenter.newFigure = new Angle();
                    }
                }
            }
        }

        insertCenterPoint(event) {
            var point = presenter.getClickedOrCreatePoint(event);
            if (point == this.arcStartPoint) return;
            point.setIsRoot(false);
            point.addParent(this);
            this.centerPoint = point;
            this.append();
        }

        insertArcStartPoint(event) {
            var point = presenter.getClickedOrCreatePoint(event);
            point.setIsRoot(false);
            point.addParent(this);
            this.arcStartPoint = point;
            this.append();
        }

        remove() {
            super.remove();
            if (this.$angleLabel) {
                this.$angleLabel.remove();
                this.$angleLabel = null;
            }
            presenter.destroyLabel(this.angleLabelValue, presenter.greekLabelsList);
        }

        getGreekLabelValues() {
            var values = [];
            if (!!this.angleLabelValue) values.push(this.angleLabelValue);
            return values;
        }

        toJSON() {
            var json = super.toJSON();
            if (json == null) return null;
            json.state.angleLabelValue = !!this.angleLabelValue ? this.angleLabelValue : "";
            return json;
        }

        loadJSON(json) {
            if (json.type != this.getClassType()) return;
            this.angleLabelValue = json.state.angleLabelValue;
            super.loadJSON(json);
            this.addAngleLabel();
        }
}

    presenter.createToolbarSection = function() {
        var element = $('<div></div>');
        element.addClass(presenter.CSS_CLASSES.TOOLBAR_SECTION);
        presenter.$toolbarOptions.append(element);
        return element;
    }

    presenter.createGeometricElementButton = function(name, _class, parent) {
        return presenter.createToolbarButton(name, _class.TYPE, _class.ICON_CLASS, parent, () => {
            presenter.newFigure = new _class();
        },
        () => {});
    }

    presenter.createToolbarButton = function(name, type, iconClass, parent, selectedCallback, deselectedCallback) {
        var element = $('<button></button>');
        element.addClass(presenter.CSS_CLASSES.TOOLBAR_BUTTON);

        var iconElement = $('<div></div>');
        iconElement.addClass(presenter.CSS_CLASSES.TOOLBAR_BUTTON_ICON);
        iconElement.addClass(iconClass);
        element.append(iconElement);

        var labelElement = $('<div></div>');
        labelElement.addClass(presenter.CSS_CLASSES.TOOLBAR_BUTTON_LABEL);
        labelElement.html(name);
        element.append(labelElement);

        element.click((e) => {
            var isSelected = element.hasClass(presenter.CSS_CLASSES.SELECTED);
            presenter.finishInsert(true);
            presenter.setEditMode(false);
            if (!isSelected) {
                selectedCallback();
                element.addClass(presenter.CSS_CLASSES.SELECTED);
            } else {
                deselectedCallback();
            }
            presenter.redrawCanvas();
        });
        parent.append(element);
        presenter.toolbarButtonsDict[type] = element;
        return element;
    }

    presenter.clearFigures = function() {
        presenter.clearFigureSelection();
        while (presenter.figuresList.length > 0) {
            presenter.figuresList[presenter.figuresList.length - 1].remove();
        }
        presenter.pointsList = [];
    }

    presenter.clearPrevStates = function() {
        presenter.previousStates = [];
        presenter.prevStateIndex = -1;
    }

    presenter.reset = function() {
        presenter.resetWithoutVisibility();
        if (presenter.configuration.defaultVisibility) {
            presenter.show();
        } else {
            presenter.hide();
        }
    }

    presenter.resetWithoutVisibility = function() {
        presenter.clearPrevStates();
        presenter.clearLabels();
        presenter.clearFigures();
        presenter.redrawCanvas();
        var $button = presenter.toolbarButtonsDict['Cursor'];
        if ($button && !$button.hasClass(presenter.CSS_CLASSES.SELECTED)) {
            $button.click();
        }
        presenter.prevStateIndex = -1;
        presenter.previousStates = [];
        presenter.pushState();
        presenter.updateStateButtonsVisibility();
        presenter.setLabelsVisibility(presenter.configuration.labelsDefaultVisibility);
        presenter.setAngleMeasuresVisibility(presenter.configuration.angleMeasuresDefaultVisibility);
        presenter.setLengthMeasuresVisibility(presenter.configuration.lengthMeasuresDefaultVisibility);
    }

    presenter.getSelectedButtonType = function() {
        for ([type, $element] of Object.entries(presenter.toolbarButtonsDict)) {
            if ($element.hasClass(presenter.CSS_CLASSES.SELECTED)) {
                return type;
            }
        }
        return '';
    }

    presenter.getState = function() {
        var state = {
            figures: [],
            labelsList: [...presenter.labelsList],
            greekLabelsList: [...presenter.greekLabelsList],
            lowerLabelsList: [...presenter.lowerLabelsList],
            selectedButton: presenter.getSelectedButtonType(),
            visibility: presenter.isVisible(),
            maxPointIndex: presenter.maxPointIndex,
            labelsVisibility: presenter.labelsVisibility,
            angleMeasuresVisibility: presenter.angleMeasuresVisibility,
            lengthMeasuresVisibility: presenter.lengthMeasuresVisibility
        };

        var validFiguresLabels = [];
        var validFiguresGreekLabels = [];
        var validFiguresLowerLabels = [];
        for (var i = 0 ; i < presenter.figuresList.length; i++) {
            var figure = presenter.figuresList[i];
            var figureState = figure.toJSON();
            var labels = figure.getLabelValues();
            var greekLabels = !!(figure["getGreekLabelValues"]) ? figure.getGreekLabelValues() : [];
            var lowerLabels = !!(figure["getLowerLabelValues"]) ? figure.getLowerLabelValues() : [];
            if (figureState != null) {
                state.figures.push(figureState);
                validFiguresLabels = validFiguresLabels.concat(labels);
                validFiguresGreekLabels = validFiguresGreekLabels.concat(greekLabels);
                validFiguresLowerLabels = validFiguresLowerLabels.concat(lowerLabels);
            } else {
                // labels of invalid figures need to be removed from the state's labels list,
                // unless they are also a part of a valid figure
                for (var j = 0; j < labels.length; j++) {
                    var label = labels[j];
                    if (validFiguresLabels.indexOf(label) == -1) {
                        presenter.destroyLabel(label, state.labelsList);
                    }
                }
                for (var j = 0; j < greekLabels.length; j++) {
                    var label = greekLabels[j];
                    if (validFiguresGreekLabels.indexOf(label) == -1) {
                        presenter.destroyLabel(label, state.greekLabelsList);
                    }
                }
                for (var j = 0; j < lowerLabels.length; j++) {
                    var label = lowerLabels[j];
                    if (validFiguresLowerLabels.indexOf(label) == -1) {
                        presenter.destroyLabel(label, state.lowerLabelsList);
                    }
                }
            }
        }

        return JSON.stringify(state);
    }

    presenter.upgradeState = function(state) {
        if (state["greekLabelsList"] == undefined) {
            state["greekLabelsList"] = [];
        }

        if (state["angleMeasuresVisibility"] == undefined) {
            state["angleMeasuresVisibility"] = true;
        }

        if (state["lowerLabelsList"] == undefined) {
            state["lowerLabelsList"] = [];
        }
    }

    presenter.setState = function(state) {
        presenter.clearFigures();
        var parsedState = JSON.parse(state);
        presenter.upgradeState(parsedState);
        if (parsedState.visibility) {
            presenter.show();
        } else {
            presenter.hide();
        }
        presenter.setLabelsVisibility(parsedState.labelsVisibility);
        presenter.setAngleMeasuresVisibility(parsedState.angleMeasuresVisibility);
        presenter.setLengthMeasuresVisibility(parsedState.lengthMeasuresVisibility);
        presenter.loadFiguresFromState(parsedState.figures);
        presenter.labelsList = [...parsedState.labelsList];
        presenter.greekLabelsList = [...parsedState.greekLabelsList];
        presenter.lowerLabelsList = [...parsedState.lowerLabelsList];
        presenter.redrawCanvas();
        var $button = presenter.toolbarButtonsDict[parsedState.selectedButton];
        if ($button && !$button.hasClass(presenter.CSS_CLASSES.SELECTED)) {
            $button.click();
        }

        presenter.prevStateIndex = -1;
        presenter.previousStates = [];
        presenter.pushState();
        presenter.updateStateButtonsVisibility();
    }

    presenter.loadFiguresFromState = function(figuresState) {
        for (var i = 0; i < figuresState.length; i++) {
            var figureState = figuresState[i];
            var figure = null;
            if (figureState.type == Point.TYPE) {
                figure = new Point();
            }
            if (figureState.type == LineSegment.TYPE) {
                figure = new LineSegment();
            }
            if (figureState.type == HalfOpenLineSegment.TYPE) {
                figure = new HalfOpenLineSegment();
            }
            if (figureState.type == OpenLineSegment.TYPE) {
                figure = new OpenLineSegment();
            }
            if (figureState.type == CircleWithPoint.TYPE) {
                figure = new CircleWithPoint();
            }
            if (figureState.type == Circle.TYPE) {
                figure = new Circle();
            }
            if (figureState.type == Compasses.TYPE) {
                figure = new Compasses();
            }
            if (figureState.type == ArcWithCenterPoint.TYPE) {
                figure = new ArcWithCenterPoint();
            }
            if (figureState.type == Angle.TYPE) {
                figure = new Angle();
            }
            if (figure != null) {
                figure.loadJSON(figureState);
                figure.append();
            }
        }
    }

    presenter.pushState = function() {
        var state = {
            figures: [],
            labelsList: [...presenter.labelsList],
            greekLabelsList: [...presenter.greekLabelsList],
            lowerLabelsList: [...presenter.lowerLabelsList],
        };
        for (var i = 0 ; i < presenter.figuresList.length; i++) {
            var figureState = presenter.figuresList[i].toJSON();
            if (figureState != null) {
                state.figures.push(figureState);
            }
        }
        if (presenter.prevStateIndex !== presenter.previousStates.length - 1) {
            presenter.previousStates.splice(presenter.prevStateIndex + 1 - presenter.previousStates.length);
        }

        if (presenter.previousStates.length > MAX_PREV_STATES) {
            presenter.previousStates.splice(0, presenter.previousStates.length - MAX_PREV_STATES);
        }
        presenter.previousStates.push(state);
        presenter.prevStateIndex = presenter.previousStates.length - 1;
        presenter.updateStateButtonsVisibility();
    }

    presenter.prevState = function() {
        if (presenter.previousStates.length < 2 || presenter.prevStateIndex < 1) return;
        presenter.prevStateIndex -= 1;
        presenter.setStateByIndex(presenter.prevStateIndex);
        presenter.updateStateButtonsVisibility();
    }

    presenter.nextState = function() {
        if (presenter.prevStateIndex == presenter.previousStates.length - 1 || presenter.prevStateIndex == -1) return;
        presenter.prevStateIndex += 1;
        presenter.setStateByIndex(presenter.prevStateIndex);
        presenter.updateStateButtonsVisibility();
    }

    presenter.setStateByIndex = function(index) {
        if (presenter.previousStates.length == 0) return;
        var state = presenter.previousStates[index];

        presenter.clearLabels();
        presenter.clearFigures();
        presenter.loadFiguresFromState(state.figures);
        presenter.labelsList = [...state.labelsList];
        presenter.greekLabelsList = [...state.greekLabelsList];
        presenter.lowerLabelsList = [...state.lowerLabelsList];
        presenter.maxPointIndex = state.maxPointIndex;
        presenter.redrawCanvas();
    }

    presenter.updateStateButtonsVisibility = function() {
        presenter.updateResetButtonVisibility();
        presenter.updateUndoRedoButtonsVisibility();
    }

    presenter.updateUndoRedoButtonsVisibility = function() {
        if (presenter.prevStateIndex == -1 || presenter.previousStates.length < 2
            || presenter.configuration.disableUndoRedoButton) {
            presenter.$undoButton.css('visibility', 'hidden');
            presenter.$redoButton.css('visibility', 'hidden');
            return;
        }
        presenter.$undoButton.css('visibility', '');
        presenter.$redoButton.css('visibility', '');
        if (presenter.prevStateIndex == 0) {
            presenter.$undoButton.css('visibility', 'hidden');
        } else if (presenter.prevStateIndex == presenter.previousStates.length - 1) {
            presenter.$redoButton.css('visibility', 'hidden');
        }
    }

    presenter.updateResetButtonVisibility = function() {
        if (((presenter.prevStateIndex == -1 || presenter.previousStates.length < 2)
            && presenter.figuresList.length == 0) || presenter.configuration.disableResetButton) {
            presenter.$resetButton.css('visibility', 'hidden');
        } else {
            presenter.$resetButton.css('visibility', '');
        }
    }

    presenter.executeCommand = function (name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'reset': presenter.reset,
            'prevState': presenter.prevState,
            'nextState': presenter.nextState,
            'showLabels': presenter.showLabels,
            'hideLabels': presenter.hideLabels,
            'showAngleMeasures': presenter.showAngleMeasures,
            'hideAngleMeasures': presenter.hideAngleMeasures,
            'showLengthMeasures': presenter.showLengthMeasures,
            'hideLengthMeasures': presenter.hideLengthMeasures
        };
        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;

    }

    return presenter;
}