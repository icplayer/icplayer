function AddonGeometricConstruct_create() {
    var presenter = function () {};

    presenter.pointsList = [];
    presenter.figuresList = [];
    presenter.newFigure = null;

    presenter.createPreview = function (view, model) {
        presenterLogic(view, model, true);
    };

    presenter.run = function (view, model) {
        presenterLogic(view, model, false);
    };

    function presenterLogic(view, model, isPreview) {
        console.log("Geometric construct test");
        console.log(view);
        console.log(model);
        presenter.configuration = presenter.validateModel(model);
        presenter.setElements(view);
        presenter.createView(isPreview);
    }

    presenter.validateModel = function (model) {
        return {
            toolbarWidth: 220
        };
    }

    presenter.setElements = function(view) {
        presenter.view = view;
        presenter.$view = $(view);
        presenter.$toolbarWrapper = presenter.$view.find('.toolbar_wrapper');
        presenter.$workspaceWrapper = presenter.$view.find('.workspace_wrapper');
        presenter.workspaceWrapper = presenter.$workspaceWrapper[0];
    }

    presenter.createView = function(isPreview) {
        presenter.setDimensions();
        presenter.createWorkspace();
        presenter.createToolbar();
    };

    presenter.setDimensions = function() {
        presenter.$toolbarWrapper.css('width', presenter.configuration.toolbarWidth + 'px');
    };

    presenter.createWorkspace = function() {
        presenter.canvas = document.createElement("canvas");
        presenter.$canvas = $(presenter.canvas);
        var rect = presenter.workspaceWrapper.getBoundingClientRect();
        presenter.canvas.setAttribute('width', rect.width);
        presenter.canvas.setAttribute('height', rect.height);
        presenter.context = presenter.canvas.getContext("2d");
        presenter.$workspaceWrapper.append(presenter.canvas);
        presenter.canvasRect = presenter.canvas.getBoundingClientRect();
        presenter.$canvas.click(canvasOnClickHandler);
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

    function canvasOnClickHandler (e) {
        console.log("canvas onlick");
        var location = getCanvasEventLocation(e);
        if (presenter.newFigure != null) {
            presenter.newFigure.clickHandler(e);
        }
    };

    function getCanvasEventLocation (e) {
        return {
            x: e.pageX - presenter.$canvas.offset().left,
            y: e.pageY - presenter.$canvas.offset().top
        };
    }

    presenter.createToolbar = function() {
        presenter.createToolbarButton("Cursor", $("<div></div>")[0], () => {
            console.log("Edit mode");
        });
        presenter.createGeometricElementButton("Point", Point);

    };

    presenter.getLabel = function(point) {
        var index = presenter.pointsList.indexOf(point);
        if (index == -1) return '';
        var ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var result = "";
        while (index >= 0) {
            var mod = index % 26;
            result = ALPHABET[mod] + result;
            index = Math.floor(index / 26) - 1;
        }
        return result;
    }

    presenter.endInsert = function(abandonChanges) {
        if (abandonChanges && presenter.newFigure != null) {
            presenter.newFigure.remove();
        }
        presenter.newFigure = null;
        presenter.$toolbarWrapper.find('.selected').removeClass('selected');
    };

    class GeometricElement {

        constructor(){}

        draw() {
            throw new Error("GeometricElement.draw is abstract but has not been implemented");
        };

        static getIcon() {
            throw new Error("GeometricElement.getIcon is abstract but has not been implemented");
        };

        addLabel() {
            throw new Error("GeometricElement.addLabel is abstract but has not been implemented");
        };

        append() {
            throw new Error("GeometricElement.append is abstract but has not been implemented");
        }

        remove() {
            throw new Error("GeometricElement.remove is abstract but has not been implemented");
        }

        clickHandler(event) {
            throw new Error("GeometricElement.clickHandler is abstract but has not been implemented");
        }

        toJSON() {
            throw new Error("GeometricElement.toJSON is abstract but has not been implemented");
        }

        loadJSON(json) {
            throw new Error("GeometricElement.loadJSON is abstract but has not been implemented");
        }
    }

    class Point extends GeometricElement {

        static TYPE = "Point";
        x;
        y;
        $label;
        isRoot = true;

        constructor() {
            super();
        }

        setIsRoot(isRoot) {
            this.isRoot = isRoot;
        }

        append() {
            presenter.pointsList.push(this);
            if (this.isRoot) {
                presenter.figuresList.push(this);
            };
        }

        remove() {
            var pointsIndex = presenter.pointsList.indexOf(this);
            if (pointsIndex != -1) {
                presenter.pointsList.splice(pointsIndex, 1);
            }
            var figuresIndex = presenter.figuresList.indexOf(this);
            if (figuresIndex != -1) {
                presenter.figuresList.splice(figuresIndex, 1);
            }
        }

        clickHandler(e) {
            if (presenter.newFigure == this) {
                var location = getCanvasEventLocation(e);
                this.x = location.x;
                this.y = location.y;
                this.append();
                presenter.endInsert(false);
                presenter.redrawCanvas();
                console.log(this.toJSON());
            }
        }

        draw() {
            if (this.x == null || this.y == null) return;
            Point.drawPoint(presenter.context, this.x, this.y, false);
        }

        static drawPoint(context, x, y, isSelected) {
            context.fillStyle = "#8888FF";
            context.strokeStyle = "#000000";
            context.beginPath();
            context.arc(x, y, 4, 0, 2 * Math.PI);
            context.fill();
            context.stroke();
            context.closePath();
            if (isSelected) {
                context.beginPath();
                context.strokeStyle = "#8888FF";
                context.arc(x, y, 8, 0, 2 * Math.PI);
                context.stroke();
                context.closePath();
            }
        }

        static getIcon() {
            var canvas = document.createElement("canvas");
            canvas.setAttribute("width", '50px');
            canvas.setAttribute("height", '50px');
            var ctx = canvas.getContext("2d");
            Point.drawPoint(ctx, 25, 25, true);
            return canvas;
        }

        addLabel() {
            if (this.x == null || this.y == null) return;
            if (!this.$label) {
                this.$label = $('<div></div>');
                this.$label.addClass('geometricConstructLabel');
                this.$label.css('position', 'absolute');
                presenter.$workspaceWrapper.append(this.$label);
            }
            this.$label.html(presenter.getLabel(this));
            this.$label.css('top', 'calc(' + (this.y) +'px - 1em)');
            this.$label.css('left', (this.x+5)+'px');
        };

        removeLabel() {
            if (this.$label) {
                this.$label.remove();
                this.$label = null;
            }
        };

        toJSON() {
            if (this.x == null || this.y == null) return null;
            return {
                type: Point.TYPE,
                state: {
                    x: this.x,
                    y: this.y
                }
            }
        }

        loadJSON(json) {
            console.log("loadJSON");
            console.log(json);
            if (json.type != Point.TYPE) return;
            this.x = json.state.x;
            this.y = json.state.y;
            console.log("loadJSON Done");
        }

    }

    presenter.createGeometricElementButton = function(name, _class) {
        console.log("createGeometricElementButton 5");
        console.log(name);
        console.log(_class);
        presenter.createToolbarButton(name, _class.getIcon(), () => {
            presenter.newFigure = new _class();
        },
        () => {});
    }

    presenter.createToolbarButton = function(name, icon, selectedCallback, deselectedCallback) {
        console.log("createToolbarButton");
        var element = $('<div></div>');
        element.append($(icon));
        element.append("<div class='toolbar-button-label'>"+name+"</div>");
        element.addClass('toolbarButton');
        element.click((e) => {
            var isSelected = element.hasClass('selected');
            presenter.endInsert(true);
            if (!isSelected) {
                selectedCallback();
                element.addClass('selected');
            } else {
                deselectedCallback();
            }
        });
        presenter.$toolbarWrapper.append(element);
    }

    presenter.clearFigures = function() {
        for (var i = presenter.figuresList.length - 1; i > -1; i--) {
            presenter.figuresList[i].remove();
        }
    }

    presenter.reset = function() {
        presenter.clearLabels();
        presenter.clearFigures();
        presenter.redrawCanvas();
    }

    presenter.getState = function() {
        var state = {
            figures: []
        };
        for (var i = 0 ; i < presenter.figuresList.length; i++) {
            state.figures.push(presenter.figuresList[i].toJSON());
        }
        console.log(state);
        return JSON.stringify(state);
    }

    presenter.setState = function(state) {
        presenter.clearFigures();
        var parsedState = JSON.parse(state);
        for (var i = 0; i < parsedState.figures.length; i++) {
            var figureState = parsedState.figures[i];
            var figure = null;
            if (figureState.type == Point.TYPE) {
                figure = new Point();
            }
            if (figure != null) {
                figure.loadJSON(figureState);
                figure.append();
            }
        }
        presenter.redrawCanvas();
    }

    return presenter;
}