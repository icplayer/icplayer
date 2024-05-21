function AddonGeometricConstruct_create() {
    var presenter = function () {};

    presenter.labelsList = [];
    presenter.figuresList = [];
    presenter.toolbarButtonsDict = {};

    var MAX_PREV_STATES = 20;
    presenter.prevStateIndex = -1;
    presenter.previousStates = [];

    presenter.newFigure = null;
    presenter.editFigure = null;
    presenter.isEditMode = false;
    presenter.isDragging = false;
    presenter.hasMoved = false;

    presenter.playerController = null;

    presenter.CSS_CLASSES = {
        TOOLBAR_WRAPPER: 'toolbar_wrapper',
        WORKSPACE_WRAPPER: 'workspace_wrapper',
        CANVAS_OVERLAY: 'canvas_overlay',
        REMOVE_FIGURE_BUTTON: 'remove_figure',
        CURSOR: 'Cursor',
        CURSOR_IMAGE: 'cursor-image'
    };

    presenter.createPreview = function (view, model) {
        presenterLogic(view, model, true);
    };

    presenter.run = function (view, model) {
        presenterLogic(view, model, false);
    };

    function presenterLogic(view, model, isPreview) {
        presenter.configuration = presenter.validateModel(model);
        presenter.setElements(view);
        presenter.createView(isPreview);
        presenter.pushState();
        if (!presenter.configuration.defaultVisibility) presenter.hide();
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

    presenter.validateModel = function (model) {
        console.log(model);
        var strokeColor = (model["strokeColor"] && model["strokeColor"].trim().length > 0) ? model["strokeColor"] : "black";
        var fillColor = (model["fillColor"] && model["fillColor"].trim().length > 0) ? model["fillColor"] : "blue";
        return {
            fillColor: fillColor,
            strokeColor: strokeColor,
            width: parseInt(model["Width"]),
            height: parseInt(model["Height"]),
            defaultVisibility: ModelValidationUtils.validateBoolean(model["Is Visible"])
        };
    }

    presenter.setElements = function(view) {
        presenter.view = view;
        presenter.$view = $(view);
        presenter.$toolbarWrapper = presenter.$view.find('.'+presenter.CSS_CLASSES.TOOLBAR_WRAPPER);
        presenter.$undoButton = presenter.$toolbarWrapper.find('.undo_button');
        presenter.$redoButton = presenter.$toolbarWrapper.find('.redo_button');
        presenter.$resetButton = presenter.$toolbarWrapper.find('.reset_button');
        presenter.$workspaceWrapper = presenter.$view.find('.'+presenter.CSS_CLASSES.WORKSPACE_WRAPPER);
        presenter.workspaceWrapper = presenter.$workspaceWrapper[0];
    }

    presenter.createView = function(isPreview) {
        presenter.createWorkspace(isPreview);
        presenter.createToolbar();
    };

    presenter.createWorkspace = function(isPreview) {
        presenter.canvas = document.createElement("canvas");
        presenter.$canvas = $(presenter.canvas);
        var width = presenter.$workspaceWrapper.width();
        var height = presenter.configuration.height;
        presenter.canvas.setAttribute('width', width);
        presenter.canvas.setAttribute('height', height);
        presenter.context = presenter.canvas.getContext("2d");
        presenter.$workspaceWrapper.prepend(presenter.canvas);
        presenter.canvasRect = presenter.canvas.getBoundingClientRect();
        presenter.$canvasOverlay = presenter.$workspaceWrapper.find("."+presenter.CSS_CLASSES.CANVAS_OVERLAY);
        presenter.$canvasOverlay.css('width', width);
        presenter.$canvasOverlay.css('height', height);
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
        if (!isPreview) {
            presenter.$removeFigure.on('click', removeFigureOnClickHandler);
        }
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
            presenter.pushState();
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
                    presenter.editFigure.setSelected(true);
                    presenter.$removeFigure.css('display', '');
                }
                presenter.isDragging = true;
                presenter.hasMoved = false;
            } else if (presenter.editFigure != null) {
                presenter.editFigure.setSelected(false);
                presenter.editFigure = null;
                presenter.$removeFigure.css('display', 'none');
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
        }
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
        return {
            x: (pageX - presenter.$canvas.offset().left) / scale.scaleX,
            y: (pageY - presenter.$canvas.offset().top) / scale.scaleY
        };
    }

    presenter.createToolbar = function() {
        var cursorElement = presenter.createToolbarButton("Cursor", presenter.CSS_CLASSES.CURSOR, presenter.CSS_CLASSES.CURSOR_IMAGE, () => {
            presenter.setEditMode(true);
        }, ()=>{});
        presenter.createGeometricElementButton("Point", Point);

        cursorElement.addClass('selected');
        presenter.setEditMode(true);

        presenter.$undoButton.on('click', presenter.prevState);
        presenter.$redoButton.on('click', presenter.nextState);
        presenter.$resetButton.on('click', presenter.reset);
        presenter.updateUndoRedoButtonsVisibility();
    };

    presenter.getLabel = function(index) {
        var ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var result = "";
        while (index >= 0) {
            var mod = index % 26;
            result = ALPHABET[mod] + result;
            index = Math.floor(index / 26) - 1;
        }
        return result;
    }

    presenter.createLabel = function() {
        var labelValue = '';
        var index = presenter.labelsList.indexOf('');
        if (index == -1) {
            labelValue = presenter.getLabel(presenter.labelsList.length);
            presenter.labelsList.push(labelValue);
        } else {
            labelValue = presenter.getLabel(index);
            presenter.labelsList[index] = labelValue;
        }
        return labelValue;
    }

    presenter.destroyLabel = function(labelValue) {
        var index = presenter.labelsList.indexOf(labelValue);
        if (index == -1) return;

        presenter.labelsList[index] = '';
        if (index ===  presenter.labelsList.length - 1) {
            for (var i = presenter.labelsList.length - 1; i > -1; i--) {
                if (presenter.labelsList[i] == '') {
                    presenter.labelsList.pop();
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
        presenter.$toolbarWrapper.find('.selected').removeClass('selected');
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
    }

    class GeometricElement {

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

        setSelected() {
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

        constructor() {
            super();
        }

        setIsRoot(isRoot) {
            this.isRoot = isRoot;
        }

        append() {
            if (!this.labelValue) {
                this.labelValue = presenter.createLabel();
            }
            if (this.isRoot) {
                presenter.figuresList.push(this);
            };
        }

        remove() {
            presenter.destroyLabel(this.labelValue);
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
                this.x = location.x;
                this.y = location.y;
                this.append();
                presenter.newFigure = new Point();
            }
        }

        moveHandler(e) {
            var location = getCanvasEventLocation(e);
            this.x = location.x;
            this.y = location.y;
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
                this.$label.addClass('geometricConstructLabel');
                this.$label.addClass(Point.LABEL_CLASS);
                this.$label.css('position', 'absolute');
                this.$label.insertBefore(presenter.$canvasOverlay);
            }
            this.$label.html(this.labelValue);
            this.$label.css('top', 'calc(' + (this.y) +'px - 1em)');
            this.$label.css('left', (this.x+5)+'px');
        };

        updateLabel() {
            this.$label.css('top', 'calc(' + (this.y) +'px - 1em)');
            this.$label.css('left', (this.x+5)+'px');
        }

        hideLabel() {
            if (!this.$label) {
                !this.$label.css('display', 'none');
            }
        }

        removeLabel() {
            if (this.$label) {
                this.$label.remove();
                this.$label = null;
            }
        };

        setSelected(isSelected) {
            this.isSelected = isSelected;
        }

        toJSON() {
            if (this.x == null || this.y == null) return null;
            return {
                type: Point.TYPE,
                state: {
                    x: this.x,
                    y: this.y,
                    labelValue: this.labelValue
                }
            }
        }

        loadJSON(json) {
            if (json.type != Point.TYPE) return;
            this.x = json.state.x;
            this.y = json.state.y;
            this.labelValue = json.state.labelValue;
        }

    }

    presenter.createGeometricElementButton = function(name, _class) {
        return presenter.createToolbarButton(name, _class.TYPE, _class.ICON_CLASS, () => {
            presenter.newFigure = new _class();
        },
        () => {});
    }

    presenter.createToolbarButton = function(name, type, iconClass, selectedCallback, deselectedCallback) {
        var element = $('<div></div>');
        element.addClass('toolbarButton');

        var iconElement = $('<div></div>');
        iconElement.addClass('icon');
        iconElement.addClass(iconClass);
        element.append(iconElement);

        var labelElement = $('<div></div>');
        labelElement.addClass('toolbar-button-label');
        labelElement.html(name);
        element.append(labelElement);

        element.click((e) => {
            var isSelected = element.hasClass('selected');
            presenter.finishInsert(true);
            presenter.setEditMode(false);
            if (!isSelected) {
                selectedCallback();
                element.addClass('selected');
            } else {
                deselectedCallback();
            }
            presenter.redrawCanvas();
        });
        presenter.$toolbarWrapper.append(element);
        presenter.toolbarButtonsDict[type] = element;
        return element;
    }

    presenter.clearFigures = function() {
        presenter.clearFigureSelection();
        for (var i = presenter.figuresList.length - 1; i > -1; i--) {
            presenter.figuresList[i].remove();
        }
    }

    presenter.clearPrevStates = function() {
        presenter.previousStates = [];
        presenter.prevStateIndex = -1;
    }

    presenter.reset = function() {
        presenter.clearPrevStates();
        presenter.clearLabels();
        presenter.clearFigures();
        presenter.redrawCanvas();
        var $button = presenter.toolbarButtonsDict['Cursor'];
        if ($button && !$button.hasClass('selected')) {
            $button.click();
        }
        presenter.updateUndoRedoButtonsVisibility();
        if (presenter.configuration.defaultVisibility) {
            presenter.show();
        } else {
            presenter.hide();
        }
    }

    presenter.getSelectedButtonType = function() {
        for ([type, $element] of Object.entries(presenter.toolbarButtonsDict)) {
            if ($element.hasClass('selected')) {
                return type;
            }
        }
        return '';
    }

    presenter.getState = function() {
        var state = {
            figures: [],
            labelsList: [...presenter.labelsList],
            selectedButton: presenter.getSelectedButtonType(),
            visibility: presenter.isVisible()
        };
        for (var i = 0 ; i < presenter.figuresList.length; i++) {
            state.figures.push(presenter.figuresList[i].toJSON());
        }
        return JSON.stringify(state);
    }

    presenter.setState = function(state) {
        presenter.clearFigures();
        var parsedState = JSON.parse(state);
        if (parsedState.visibility) {
            presenter.show();
        } else {
            presenter.hide();
        }
        presenter.loadFiguresFromState(parsedState.figures);
        presenter.labelsList = [...parsedState.labelsList];
        presenter.redrawCanvas();
        var $button = presenter.toolbarButtonsDict[parsedState.selectedButton];
        if ($button && !$button.hasClass('selected')) {
            $button.click();
        }
        presenter.updateUndoRedoButtonsVisibility();
    }

    presenter.loadFiguresFromState = function(figuresState) {
        for (var i = 0; i < figuresState.length; i++) {
            var figureState = figuresState[i];
            var figure = null;
            if (figureState.type == Point.TYPE) {
                figure = new Point();
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
            labelsList: [...presenter.labelsList]
        };
        for (var i = 0 ; i < presenter.figuresList.length; i++) {
            state.figures.push(presenter.figuresList[i].toJSON());
        }
        if (presenter.prevStateIndex !== presenter.previousStates.length - 1) {
            presenter.previousStates.splice(presenter.prevStateIndex + 1 - presenter.previousStates.length);
        }

        if (presenter.previousStates.length > MAX_PREV_STATES) {
            presenter.previousStates.splice(0, presenter.previousStates.length - MAX_PREV_STATES);
        }

        presenter.previousStates.push(state);
        presenter.prevStateIndex = presenter.previousStates.length - 1;
        presenter.updateUndoRedoButtonsVisibility();
    }

    presenter.prevState = function() {
        if (presenter.previousStates.length < 2 || presenter.prevStateIndex < 1) return;
        presenter.prevStateIndex -= 1;
        presenter.setStateByIndex(presenter.prevStateIndex);
        presenter.updateUndoRedoButtonsVisibility();
    }

    presenter.nextState = function() {
        if (presenter.prevStateIndex == presenter.previousStates.length - 1 || presenter.prevStateIndex == -1) return;
        presenter.prevStateIndex += 1;
        presenter.setStateByIndex(presenter.prevStateIndex);
        presenter.updateUndoRedoButtonsVisibility();
    }

    presenter.setStateByIndex = function(index) {
        if (presenter.previousStates.length == 0) return;
        var state = presenter.previousStates[index];

        presenter.clearLabels();
        presenter.clearFigures();

        presenter.loadFiguresFromState(state.figures);
        presenter.labelsList = [...state.labelsList];

        presenter.redrawCanvas();
    }

    presenter.updateUndoRedoButtonsVisibility = function() {
        if (presenter.prevStateIndex == -1 || presenter.previousStates.length < 2) {
            presenter.$undoButton.css('visibility', 'hidden');
            presenter.$redoButton.css('visibility', 'hidden');
            presenter.$resetButton.css('visibility', 'hidden');
            return;
        }
        presenter.$undoButton.css('visibility', '');
        presenter.$redoButton.css('visibility', '');
        presenter.$resetButton.css('visibility', '');
        if (presenter.prevStateIndex == 0) {
            presenter.$undoButton.css('visibility', 'hidden');
        } else if (presenter.prevStateIndex == presenter.previousStates.length - 1) {
            presenter.$redoButton.css('visibility', 'hidden');
        }
    }

    presenter.executeCommand = function (name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'reset': presenter.reset
        };
        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;

    }

    return presenter;
}