function AddonGeometricConstruct_create() {
    var presenter = function () {};

    presenter.labelsList = [];
    presenter.figuresList = [];
    presenter.pointsList = [];
    presenter.maxPointIndex = 0;
    presenter.toolbarButtonsDict = {};
    presenter.newFigure = null;
    presenter.editFigure = null;
    presenter.isEditMode = false;
    presenter.isDragging = false;

    presenter.playerController = null;

    presenter.CSS_CLASSES = {
        TOOLBAR_WRAPPER: 'toolbar_wrapper',
        WORKSPACE_WRAPPER: 'workspace_wrapper',
        CANVAS_OVERLAY: 'canvas_overlay',
        REMOVE_FIGURE_BUTTON: 'remove_figure',
        CURSOR: 'Cursor',
        CURSOR_IMAGE: 'cursor-image',
        TOOLBAR_OPTIONS: 'toolbar_options',
        TOOLBAR_SECTION: 'toolbar_section',
        TOOLBAR_BUTTON: 'toolbarButton'
    };

    presenter.createPreview = function (view, model) {
        presenterLogic(view, model, true);
    };

    presenter.run = function (view, model) {
        console.log("gc 6");
        presenterLogic(view, model, false);
    };

    function presenterLogic(view, model, isPreview) {
        presenter.configuration = presenter.validateModel(model);
        presenter.setElements(view);
        presenter.createView(isPreview);
        if (!presenter.configuration.defaultVisibility) presenter.hide();
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
        presenter.$toolbarOptions = presenter.$view.find('.'+presenter.CSS_CLASSES.TOOLBAR_OPTIONS);
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
                }
                presenter.editFigure.setSelected(true, e);
                presenter.isDragging = true;
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
        }
    }

    function removeFigureOnClickHandler (e) {
        if (presenter.editFigure != null) {
            presenter.editFigure.remove();
            presenter.editFigure = null;
            presenter.redrawCanvas();
            presenter.updateLabels();
            presenter.$removeFigure.css('display', 'none');
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

    presenter.getPointByID = function(id) {
        for (var i = 0; i < presenter.pointsList.length; i++) {
            var point = presenter.pointsList[i];
            if (point.id == id) return point;
        }
        return null;
    }

    presenter.createToolbar = function() {
        var basicSection = presenter.createToolbarSection();
        var cursorElement = presenter.createToolbarButton("Cursor", presenter.CSS_CLASSES.CURSOR, presenter.CSS_CLASSES.CURSOR_IMAGE, basicSection, () => {
            presenter.setEditMode(true);
        }, ()=>{});
        presenter.createGeometricElementButton("Point", Point, basicSection);

        var circleSection = presenter.createToolbarSection();
        presenter.createGeometricElementButton("Circle", CircleBase, circleSection);
        presenter.createGeometricElementButton("Circle passing through a point", CircleWithPoint, circleSection);

        var pointLineSection = presenter.createToolbarSection();
        presenter.createGeometricElementButton("Line Segment", LineSegment, pointLineSection);
        presenter.createGeometricElementButton("Half-open Line Segment", HalfOpenLineSegment, pointLineSection);
        presenter.createGeometricElementButton("Open Line Segment", OpenLineSegment, pointLineSection);

        cursorElement.addClass('selected');
        presenter.setEditMode(true);
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

    presenter.destroyLabel = function(labelValue, labelsList) {
        if (labelsList == undefined) labelsList = presenter.labelsList;
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

        insertMoveHandler(event) {
            // returns true if canvas needs to be redrawn
            throw new Error("GeometricElement.insertMoveHandler is abstract and has not been implemented");
        }

        moveHandler(event) {
            throw new Error("GeometricElement.moveHandler is abstract and has not been implemented");
        }

        x(event) {
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

        removeLabel() {
            throw new Error("GeometricElement.removeLabel is abstract and has not been implemented");
        }

        getLabelValues() {
            throw new Error("GeometricElement.hideLabel is abstract and has not been implemented");
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
                this.labelValue = presenter.createLabel();
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
                this.setLocation(location.x, location.y);
                this.append();
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
            if (presenter.figuresList.indexOf(this) == -1) {
                presenter.figuresList.push(this);
            }
        }

        remove() {
            if (presenter.editFigure == this && this.selectedPoint != null) {
                var selectedPoint = this.selectedPoint;
                this.selectedPoint = null;
                selectedPoint.removeAllParents();
                return;
            }
            for (var i = 0; i < this.endpoints.length; i++) {
                var point = this.endpoints[i];
                point.removeParent(this);
                point.setSelected(false);
                if (!point.hasParents() && !point.isRoot) point.remove();
            }
            var figuresIndex = presenter.figuresList.indexOf(this);
            if (figuresIndex != -1) {
                presenter.figuresList.splice(figuresIndex, 1);
            }
        }

        insertClickHandler(event) {
            if (presenter.newFigure == this && this.endpoints.length < 2) {
                this.insertEndpoint(event);
            }
            if (this.endpoints.length == 2) {
                this.creationLineLocation = null;
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
        }

        removeLabel() {
            for (var i = 0; i < this.endpoints.length; i++) this.endpoints[i].removeLabel();
        }

        getLabelValues() {
            var values = [];
            for (var i = 0; i < this.endpoints.length; i++) values = values.concat(this.endpoints[i].getLabelValues());
            return values;
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
                    endpointStates: endpointStates
                }
            }
        }

        loadJSON(json) {
            if (json.type != this.getClassType()) return;
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
        radius = 50;
        draggingDiff;

        constructor() {
            super();
        }

        draw() {
            if (this.centerPoint != null) {
                this.drawCircle(this.radius);
                this.centerPoint.draw();
            }
        };

        drawCircle(radius) {
            if (this.centerPoint == null) return;
            presenter.context.fillStyle = presenter.configuration.fillColor;
            presenter.context.strokeStyle = presenter.configuration.strokeColor;
            presenter.context.beginPath();
            presenter.context.arc(this.centerPoint.x, this.centerPoint.y, radius, 0, 2 * Math.PI);
            presenter.context.stroke();
            presenter.context.closePath();
        }

        append() {
            this.centerPoint.append();
            if (presenter.figuresList.indexOf(this) == -1) {
                presenter.figuresList.push(this);
            }
        }

        remove() {
            if (this.centerPoint == null) return;
            this.centerPoint.removeParent(this);
            this.centerPoint.setSelected(false);
            this.centerPoint.removeAllParents();
            if (!this.centerPoint.hasParents() && !this.centerPoint.isRoot) this.centerPoint.remove();

            var figuresIndex = presenter.figuresList.indexOf(this);
            if (figuresIndex != -1) {
                presenter.figuresList.splice(figuresIndex, 1);
            }
        }

        insertClickHandler(event) {
            if (presenter.newFigure == this) {
                if (this.centerPoint == null) {
                    this.insertCenterPoint(event);
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
            if (this.draggingDiff) {
                var location = getCanvasEventLocation(event);
                this.centerPoint.setLocation(location.x + this.draggingDiff.x, location.y + this.draggingDiff.y);
            } else if (this.centerPoint.isClicked()) {
                this.centerPoint.moveHandler(event);
            }
        }

        isClicked(event) {
            if (!this.centerPoint) return false;
            if(this.centerPoint.isClicked(event)) return true;
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
            static TYPE = "CircleWithPointSegment";
            static LABEL_CLASS = "circle_with_point_label";
            static ICON_CLASS = "circle-with-point-image";

            rimPoint;
            radius = 0;

            insertClickHandler(event) {
                if (presenter.newFigure == this) {
                    if (this.centerPoint == null) {
                        this.insertCenterPoint(event);
                    } else if (this.rimPoint == null) {
                        this.insertRimPoint(event);
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
                        return true;
                    }
                }
                return false;
            }

            draw() {
                super.draw();
                if (this.rimPoint != null) {
                    this.radius = this.distanceFromCenter(this.rimPoint.x, this.rimPoint.y);
                    this.rimPoint.draw();
                }
            };

            moveHandler(event) {

                // TODO FINISH
                if (!this.centerPoint || !this.rimPoint) return;

                if (this.draggingDiff) {
                    var location = getCanvasEventLocation(event);
                    this.rimPoint.setLocation(location.x + this.draggingDiff.x, location.y + this.draggingDiff.y);
                } else if (this.rimPoint.isClicked()) {
                    this.centerPoint.moveHandler(event);
                }
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
        var element = $('<div></div>');
        element.addClass(presenter.CSS_CLASSES.TOOLBAR_BUTTON);

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
        parent.append(element);
        presenter.toolbarButtonsDict[type] = element;
        return element;
    }

    presenter.clearFigures = function() {
        presenter.clearFigureSelection();
        for (var i = presenter.figuresList.length - 1; i > -1; i--) {
            presenter.figuresList[i].remove();
        }
    }

    presenter.reset = function() {
        presenter.clearLabels();
        presenter.clearFigures();
        presenter.redrawCanvas();
        var $button = presenter.toolbarButtonsDict['Cursor'];
        if ($button && !$button.hasClass('selected')) {
            $button.click();
        }
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
            visibility: presenter.isVisible(),
            maxPointIndex: presenter.maxPointIndex
        };
        for (var i = 0 ; i < presenter.figuresList.length; i++) {
            var figure = presenter.figuresList[i];
            var figureState = figure.toJSON();
            if (figureState != null) {
                state.figures.push(figureState);
            } else {
                var labels = figure.getLabelValues();
                for (var j = 0; j < labels.length; j++) {
                    presenter.destroyLabel(labels[j], state.labelsList);
                }
            }
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
        for (var i = 0; i < parsedState.figures.length; i++) {
            var figureState = parsedState.figures[i];
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
            if (figure != null) {
                figure.loadJSON(figureState);
                figure.append();
            }
        }
        presenter.labelsList = [...parsedState.labelsList];
        presenter.maxPointIndex = parsedState.maxPointIndex;
        presenter.redrawCanvas();
        var $button = presenter.toolbarButtonsDict[parsedState.selectedButton];
        if ($button && !$button.hasClass('selected')) {
            $button.click();
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