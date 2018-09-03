function AddonLine_create() {
    var presenter = function () {
    };

    presenter.LINE_ENDING = {
        NONE: 'None',
        CIRCLE: 'Circle',
        ROUND: 'Round',
        SQUARE: 'Square'
    };

    presenter.ERROR_CODES = {
        'R01': "Rotation angle must be between 0 and 360 degrees!",
        'R02': "Rotation angle is not a number!",
        'ST1': "Line width must be a positive number",
        'ST2': "Line width is not a number!",
        'ST3': "Line color must be in RGB format (hexadecimal) and start with #",
        'ST4': "Line opacity must be a positive number between 0 and 1",
        'ST5': "Line opacity is not a number!",
        'F01': "Line color must be in RGB format (hexadecimal) and start with #",
        'RU1': "Addon dimensions are too small to draw line with endings (or line is too thick)!",
        'RU2': "Addon dimensions are too small to draw line with circle ending!",
        'RU3': "Addon dimensions are too small to draw line with square ending!"
    };

    function convertToRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    function presenterLogic(view, model) {
        presenter.$view = $(view);
        var containerDimensions = DOMOperationsUtils.getOuterDimensions(presenter.$view);
        var containerDistances = DOMOperationsUtils.calculateOuterDistances(containerDimensions);

        presenter.$view.css({
            width: (presenter.$view.width() - containerDistances.horizontal) + 'px',
            height: (presenter.$view.height() - containerDistances.vertical) + 'px'
        });

        presenter.configuration = presenter.validateModel(model);
        if (presenter.configuration.isError) {
            DOMOperationsUtils.showErrorMessage(presenter.$view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        var canvasWrapper = presenter.$view.find('.line-wrapper:first')[0];
        var wrapperDimensions = DOMOperationsUtils.getOuterDimensions(canvasWrapper);
        var wrapperDistances = DOMOperationsUtils.calculateOuterDistances(wrapperDimensions);

        var canvasWrapperWidth = presenter.$view.width() - wrapperDistances.horizontal;
        var canvasWrapperHeight = presenter.$view.height() - wrapperDistances.vertical;
        $(canvasWrapper).css({
            width: (canvasWrapperWidth < 1 ? model.Width : canvasWrapperWidth) + 'px',
            height: (canvasWrapperHeight < 1 ? model.Height : canvasWrapperHeight) + 'px'
        });

        var angle = parseInt(presenter.configuration.rotation);
        presenter.drawLine(canvasWrapper, canvasWrapperWidth, canvasWrapperHeight, angle);
    }

    presenter.applyStyles = function (element) {
        element.attr({
            'stroke-width': presenter.configuration.strokeWidth,
            'stroke': presenter.configuration.strokeColor,
            'opacity': presenter.configuration.strokeOpacity,
            'fill': presenter.configuration.strokeColor,
            'fill-rule': 'evenodd'
        });

        if (presenter.configuration.cornersRoundings) {
            element.attr('stroke-linecap', 'round');
        }
    };

    function transformShape(element, angle, width, height, axis) {
        // Calculate space needed for ending display
        var neededSpace = 0;
        if (angle % 90 != 0)  neededSpace = 1.7 * Math.abs(Math.cos(convertToRadians(angle))) * presenter.configuration.strokeWidth;
        //Line length after rotation
        var newLineLengh = Math.min((width - axis) / Math.abs(Math.cos(convertToRadians(angle))), (height - axis) / Math.abs(Math.cos(convertToRadians(90 - angle)))) - neededSpace;
        var roundedScale = Math.round(newLineLengh / (width) * 100) / 100; // Rounding scale to two decimal places
        var cx = parseInt(width / 2, 10);
        var cy = parseInt(height / 2, 10);

        element.transform("r" + angle + "," + cx + "," + cy);
        element.transform("...s" + roundedScale + "," + roundedScale + "," + cx + "," + cy);
    }

    function calculateSimpleLinePoints(width, height, lineWidth, lineEnding, leftLinePart) {
        //space needed for rounded endings
        var roundSpace = 0;
        if (lineEnding == presenter.LINE_ENDING.ROUND) roundSpace = lineWidth / 2;

        var tmpY = parseInt((height) / 2, 10);
        var tmpX = parseInt((width) / 2, 10);
        if (leftLinePart) { //for left part of the line
            return [
                { x: tmpX, y: tmpY },
                { x: roundSpace, y: tmpY }
            ];
        } else {
            return [
                { x: tmpX, y: tmpY },
                { x: width - roundSpace, y: tmpY }
            ];
        }
    }

    function calculateLinePoints(lineEnding, width, height, horizontalAxis, leftLinePart) {
        var points = {};
        switch (lineEnding) {
            case presenter.LINE_ENDING.CIRCLE:
                points.pointA = {
                    x: parseInt(width / 2, 10),
                    y: parseInt(height / 2, 10)
                };
                if (leftLinePart) {
                    points.pointB = {
                        x: 2 * horizontalAxis + (presenter.configuration.strokeWidth / 2) + 1.5,
                        y: parseInt(height / 2, 10)
                    };
                    points.pointC = {
                        x: 2 * horizontalAxis + (presenter.configuration.strokeWidth / 2) + 1.5,
                        y: parseInt(height / 2, 10)
                    };
                } else {
                    points.pointB = {
                        x: width - 2 * horizontalAxis - (presenter.configuration.strokeWidth / 2) - 1.5,
                        y: parseInt(height / 2, 10)
                    };
                    points.pointC = {
                        x: width - 2 * horizontalAxis - (presenter.configuration.strokeWidth / 2) - 1.5,
                        y: parseInt(height / 2, 10)
                    };
                }
                points.pointD = {
                    x: parseInt(width / 2, 10),
                    y: parseInt(height / 2, 10)
                };

                break;
            case presenter.LINE_ENDING.SQUARE:
                var widthSpace = width - (presenter.configuration.strokeWidth / 2);
                points.pointA = {
                    x: parseInt(width / 2, 10),
                    y: parseInt(height / 2, 10)
                };

                if (leftLinePart) {
                    points.pointB = {
                        x: (presenter.configuration.strokeWidth / 2) + 2 * horizontalAxis,
                        y: parseInt(height / 2, 10)
                    };
                    points.pointC = {
                        x: (presenter.configuration.strokeWidth / 2) + 2 * horizontalAxis,
                        y: parseInt((height) / 2, 10) + horizontalAxis
                    };
                    points.pointD = {
                        x: (presenter.configuration.strokeWidth / 2),
                        y: parseInt((height) / 2, 10) + horizontalAxis
                    };
                    points.pointE = {
                        x: (presenter.configuration.strokeWidth / 2),
                        y: parseInt((height) / 2, 10) - horizontalAxis
                    };
                    points.pointF = {
                        x: (presenter.configuration.strokeWidth / 2) + 2 * horizontalAxis,
                        y: parseInt((height) / 2, 10) - horizontalAxis
                    };
                    points.pointG = {
                        x: (presenter.configuration.strokeWidth / 2) + 2 * horizontalAxis,
                        y: parseInt(height / 2, 10)
                    };
                } else {
                    points.pointB = {
                        x: widthSpace - 2 * horizontalAxis,
                        y: parseInt(height / 2, 10)
                    };
                    points.pointC = {
                        x: widthSpace - 2 * horizontalAxis,
                        y: parseInt((height) / 2, 10) + horizontalAxis
                    };
                    points.pointD = {
                        x: widthSpace,
                        y: parseInt((height) / 2, 10) + horizontalAxis
                    };
                    points.pointE = {
                        x: widthSpace,
                        y: parseInt((height) / 2, 10) - horizontalAxis
                    };
                    points.pointF = {
                        x: widthSpace - 2 * horizontalAxis,
                        y: parseInt((height) / 2, 10) - horizontalAxis
                    };
                    points.pointG = {
                        x: widthSpace - 2 * horizontalAxis,
                        y: parseInt(height / 2, 10)
                    };

                }
                points.pointH = {
                    x: parseInt(width / 2, 10),
                    y: parseInt(height / 2, 10)
                };
        }
        return points;
    }

    function createLinePath(width, height, lineEnding, horizontalAxis, leftLinePart) {
        var points = [];
        var pathString;
        var verticalAxis = horizontalAxis + 0.5;
        presenter.configuration.cornersRoundings = false;
        switch (lineEnding) {
            case presenter.LINE_ENDING.NONE:
                points = calculateSimpleLinePoints(width, height, presenter.configuration.strokeWidth, lineEnding, leftLinePart);
                //fix for one round ending and second "none"
                pathString = points[0].x + "," + points[0].y;
                pathString += "L" + points[1].x + "," + points[1].y;
                pathString += "L" + points[0].x + "," + points[0].y;
                break;
            case presenter.LINE_ENDING.ROUND:
                points = calculateSimpleLinePoints(width, height, presenter.configuration.strokeWidth, lineEnding, leftLinePart);
                if (leftLinePart) {
                    pathString = points[0].x + "," + points[0].y;
                    pathString += "L" + points[1].x + "," + points[1].y;
                } else {
                    pathString = points[0].x + "," + points[0].y;
                    pathString += "L" + points[1].x + "," + points[1].y;
                }
                presenter.configuration.cornersRoundings = true;
                break;
            case presenter.LINE_ENDING.CIRCLE:
                points = calculateLinePoints(presenter.LINE_ENDING.CIRCLE, width, height, horizontalAxis, leftLinePart);
                pathString = points.pointA.x + "," + points.pointA.y + "L" + points.pointB.x + "," + points.pointB.y;
                if (leftLinePart) {
                    pathString += "A" + horizontalAxis + " " + verticalAxis + " 90 1 1 " + points.pointC.x + " " + (points.pointC.y - 1);
                } else {
                    pathString += "A" + horizontalAxis + " " + verticalAxis + " 90 1 0 " + points.pointC.x + " " + (points.pointC.y - 1);
                }
                pathString += "L" + points.pointC.x + "," + points.pointC.y;
                pathString += "L" + points.pointD.x + "," + points.pointD.y;
                break;
            case presenter.LINE_ENDING.SQUARE:
                points = calculateLinePoints(presenter.LINE_ENDING.SQUARE, width, height, horizontalAxis, leftLinePart);
                pathString = points.pointA.x + "," + points.pointA.y + "L" + points.pointB.x + "," + points.pointB.y;
                pathString += "L" + points.pointC.x + "," + points.pointC.y;
                pathString += "L" + points.pointD.x + "," + points.pointD.y;
                pathString += "L" + points.pointE.x + "," + points.pointE.y;
                pathString += "L" + points.pointF.x + "," + points.pointF.y;
                pathString += "L" + points.pointG.x + "," + points.pointG.y;
                pathString += "L" + points.pointH.x + "," + points.pointH.y;
                break;
        }
        return pathString;
    }


    presenter.drawLine = function (wrapper, width, height, angle) {

        if ((presenter.configuration.rightLineEnding !== presenter.LINE_ENDING.NONE) || (presenter.configuration.leftLineEnding !== presenter.LINE_ENDING.NONE)) {
            if (2 * presenter.configuration.strokeWidth + 2 > height) {
                DOMOperationsUtils.showErrorMessage(presenter.$view, presenter.ERROR_CODES, 'RU1');
                return;
            }
        }

        var paper = new Raphael(wrapper, width < 20 ? 20 : width, height < 20 ? 20 : height);
        var radius = parseInt(presenter.configuration.strokeWidth / 2, 10) + 5;
        var horizontalAxis = radius - (presenter.configuration.strokeWidth) * 0.5 + 1.5;

        var pathString;
        pathString = "M";
        if (presenter.configuration.rightLineEnding == presenter.LINE_ENDING.ROUND) {    //for rounded ending sequence of creating path does matter
            // case for simply line with two rounded endings
            if ((presenter.configuration.leftLineEnding == presenter.LINE_ENDING.ROUND)) {
                pathString += parseInt(presenter.configuration.strokeWidth / 2, 10) + "," + parseInt(height / 2, 10);
                pathString += "L" + (width - parseInt(presenter.configuration.strokeWidth / 2, 10)) + "," + parseInt(height / 2, 10);
                presenter.configuration.cornersRoundings = true;
            }
            else {
                pathString += createLinePath(width, height, presenter.configuration.leftLineEnding, horizontalAxis, true);
                pathString += "L";
                pathString += createLinePath(width, height, presenter.configuration.rightLineEnding, horizontalAxis, false);
            }
        }
        else {
            pathString += createLinePath(width, height, presenter.configuration.rightLineEnding, horizontalAxis, false);
            pathString += "L";
            pathString += createLinePath(width, height, presenter.configuration.leftLineEnding, horizontalAxis, true);
        }

        var path = paper.path(pathString);
        presenter.applyStyles(path);

        transformShape(path, angle, width, height, horizontalAxis);
    };

    presenter.createPreview = function (view, model) {
        presenterLogic(view, model);
        presenter.setVisibility(true);
    };

    presenter.run = function (view, model) {
        presenterLogic(view, model);
        presenter.setVisibility(presenter.configuration.isVisible);
    };

    presenter.validateModel = function (model) {

        var rotation = model["Rotation angle"];
        if (!rotation) {
            rotation = 0;
        } else {
            rotation = parseFloat(rotation);
            if (isNaN(rotation)) {
                return { isError: true, errorCode: 'R02' };
            }

            if (rotation < 0 || rotation > 360) {
                return { isError: true, errorCode: 'R01' };
            }
        }

        var strokeWidth = model["Line width"];
        if (!strokeWidth) {
            strokeWidth = 1;
        } else {
            strokeWidth = parseFloat(strokeWidth);
            if (isNaN(strokeWidth)) {
                return { isError: true, errorCode: 'ST2' };
            }

            if (strokeWidth <= 0) {
                return { isError: true, errorCode: 'ST1' };
            }
        }

        var strokeColor = model["Line color"];
        var regExp = new RegExp("#[0-9a-fA-F]+");
        var colorMatch;

        if (!strokeColor) {
            strokeColor = "#000";
        } else {
            if (strokeColor.length < 4 || strokeColor.length > 7) {
                return { isError: true, errorCode: 'ST3' };
            }

            colorMatch = strokeColor.match(regExp);
            if (!colorMatch || colorMatch === null || colorMatch.length < 1) {
                return { isError: true, errorCode: 'ST3' };
            }
            if (colorMatch[0].length < strokeColor.length) {
                return { isError: true, errorCode: 'ST3' };
            }
        }

        var strokeOpacity = model["Line opacity"];
        if (!strokeOpacity) {
            strokeOpacity = 1;
        } else {
            strokeOpacity = parseFloat(strokeOpacity);
            if (isNaN(strokeOpacity)) {
                return { isError: true, errorCode: 'ST5' };
            }

            if (strokeOpacity < 0 || strokeOpacity > 1) {
                return { isError: true, errorCode: 'ST4' };
            }
        }

        var leftLineEnding = model["Left line ending"];
        if (!leftLineEnding) {
            leftLineEnding = presenter.LINE_ENDING.NONE;
        }
        var rightLineEnding = model["Right line ending"];
        if (!rightLineEnding) {
            rightLineEnding = presenter.LINE_ENDING.NONE;
        }

        var isVisibleByDefault = ModelValidationUtils.validateBoolean(model["Is Visible"]);

        return {
            isError: false,
            rotation: rotation,
            strokeWidth: strokeWidth,
            strokeColor: strokeColor,
            strokeOpacity: strokeOpacity,
            rightLineEnding: rightLineEnding,
            leftLineEnding: leftLineEnding,
            isVisibleByDefault: isVisibleByDefault,
            isVisible: isVisibleByDefault,
            cornersRoundings: false
        };
    };

    presenter.setVisibility = function (isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.executeCommand = function (name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.show = function () {
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
    };

    presenter.reset = function () {
        presenter.configuration.isVisible = presenter.configuration.isVisibleByDefault;
        presenter.setVisibility(presenter.configuration.isVisible);
    };

    presenter.getState = function () {
        return JSON.stringify({
            isVisible: presenter.configuration.isVisible
        });
    };

    presenter.setState = function (state) {
        var isVisible = JSON.parse(state).isVisible;

        presenter.configuration.isVisible = isVisible;
        presenter.setVisibility(isVisible);
    };

    return presenter;
}