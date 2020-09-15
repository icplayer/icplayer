function AddonStandard_Shapes_create(){
    var presenter = function() {};

    presenter.SHAPES = {
        LINE: 'Line',
        SQUARE: 'Square',
        RECTANGLE: 'Rectangle',
        CIRCLE: 'Circle',
        ELLIPSE: 'Ellipse'
    };

    presenter.LINE_ENDING = {
        NONE: 'None',
        CIRCLES: 'Circles',
        ARROWS: 'Arrows',
        NONE_AND_ARROW: 'None - Arrow',
        NONE_AND_CIRCLE: 'None - Circle',
        CIRCLE_AND_ARROW: 'Circle - Arrow'
    };

    presenter.ERROR_CODES = {
        'R01': "Rotation angle must be between 0 and 360 degrees!",
        'R02': "Rotation angle is not a number!",
        'ST1': "Stroke width must be a positive number",
        'ST2': "Stroke width is not a number!",
        'ST3': "Stroke color must be in RGB format (hexadecimal) and start with #",
        'ST4': "Stroke opacity must be a positive number between 0 and 1",
        'ST5': "Stroke opacity is not a number!",
        'F01': "Stroke color must be in RGB format (hexadecimal) and start with #",
        'RU1': "Addon dimensions are too small to draw line with endings (or stroke is too thick)!",
        'RU2': "Addon dimensions are too small to draw line with circle ending!",
        'RU3': "Addon dimensions are too small to draw line with circle-arrow ending!"
    };

    function rotatePoint(x, y, angle) {
        return {
            x: x * Math.cos(angle) - y * Math.sin(angle),
            y: x * Math.sin(angle) + y * Math.cos(angle)
        };
    }

    // Angle is counted in radians
    function rotatePoints(points, angle) {
        var rotatedPoints = [];

        for (var i = 0; i < points.length; i++) {
            var x = points[i].x;
            var y = points[i].y;

            rotatedPoints.push(rotatePoint(x, y, angle));
        }

        return rotatedPoints;
    }

    function convertToRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    function translatePoint(x, y, xOffset, yOffset) {
        return {
            x: x + xOffset,
            y: y + yOffset
        };
    }

    function translatePoints(points, xOffset, yOffset) {
        var translatedPoints = [];

        for (var i = 0; i < points.length; i++) {
            var x = points[i].x;
            var y = points[i].y;

            translatedPoints.push(translatePoint(x, y, xOffset, yOffset));
        }

        return translatedPoints;
    }

    function calculateScale(points, width, height) {
        var farLeftX = 0;
        var farRightX = 0;
        var bottomY = 0;
        var topY = 0;

        for (var i = 0; i < points.length; i++) {
            if (points[i].x < farLeftX) {
                farLeftX = points[i].x;
            }
            if (points[i].y < bottomY) {
                bottomY = points[i].y;
            }

            if (points[i].x > farRightX) {
                farRightX = points[i].x;
            }
            if (points[i].y > topY) {
                topY = points[i].y;
            }
        }

        var widthAfterRotation = Math.abs(farLeftX) + Math.abs(farRightX);
        var heightAfterRotation = Math.abs(bottomY) + Math.abs(topY);

        return Math.min(width / widthAfterRotation, height / heightAfterRotation);
    }

    function getScale(width, height, angle) {
        var points = [];
        points[0] = {x:0, y:0};
        points[1] = {x:width, y:0};
        points[2] = {x:width, y:height};
        points[3] = {x:0, y:height};

        var xOffset = -1 * width / 2;
        var yOffset = -1 * height / 2;

        var translatedPoints = translatePoints(points, xOffset, yOffset);
        var rotatedPoints = rotatePoints(translatedPoints, convertToRadians(angle));

        return calculateScale(rotatedPoints, width, height);
    }

    function drawShape(model, wrapper, width, height, angle) {
        var scale = getScale(width, height, angle);
        var length = Math.min(width, height);
        // Ugly fix for SVG elements that are smaller than 20px to position it's elements properly
        var paper = new Raphael(wrapper, width < 20 ? 20 : width, height < 20 ? 20 : height);

        switch (model.Shape) {
            case presenter.SHAPES.SQUARE:
                presenter.drawRectangle(paper, length, length, angle, scale);
                break;
            case presenter.SHAPES.RECTANGLE:
                presenter.drawRectangle(paper, width, height, angle, scale);
                break;
            case presenter.SHAPES.CIRCLE:
                presenter.drawEllipse(paper, length, length, angle, 1);
                break;
            case presenter.SHAPES.ELLIPSE:
                presenter.drawEllipse(paper, width, height, angle, scale);
                break;
            default:
                presenter.drawLine(paper, width, height, angle, scale);
        }
    }

    function presenterLogic(view, model) {
        presenter.$view = $(view);
        var containerDimensions = DOMOperationsUtils.getOuterDimensions(presenter.$view);
        var containerDistances = DOMOperationsUtils.calculateOuterDistances(containerDimensions);
        presenter.$view.css({
            width : (presenter.$view.width() - containerDistances.horizontal) + 'px',
            height : (presenter.$view.height() - containerDistances.vertical) + 'px'
        });
        presenter.configuration = presenter.validateModel(model);
        if (presenter.configuration.isError) {
            DOMOperationsUtils.showErrorMessage(presenter.$view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }
        var canvasWrapper = presenter.$view.find('.standardshapes-wrapper:first')[0];
        var wrapperDimensions = DOMOperationsUtils.getOuterDimensions(canvasWrapper);
        var wrapperDistances = DOMOperationsUtils.calculateOuterDistances(wrapperDimensions);

        var canvasWrapperWidth = presenter.$view.width() - wrapperDistances.horizontal;
        var canvasWrapperHeight = presenter.$view.height() - wrapperDistances.vertical;
        $(canvasWrapper).css({
            width : (canvasWrapperWidth < 1 ? model.Width : canvasWrapperWidth) + 'px',
            height : (canvasWrapperHeight < 1 ? model.Height : canvasWrapperHeight) + 'px'
        });

        var angle = parseInt(presenter.configuration.rotation);
        drawShape(model, canvasWrapper, canvasWrapperWidth, canvasWrapperHeight, angle);
    }

    presenter.applyStyles = function(element) {
        element.attr({
            'stroke-width': presenter.configuration.strokeWidth,
            'stroke': presenter.configuration.strokeColor,
            'stroke-opacity': presenter.configuration.strokeOpacity,
            'fill': presenter.configuration.fillColor,
            'fill-rule': 'evenodd'
        });

        if (presenter.configuration.cornersRoundings) {
            element.attr('stroke-linejoin', 'round');
        }
    };

    presenter.applyLineStyles = function(element) {
        presenter.applyStyles(element);
        element.attr('fill', presenter.configuration.strokeColor);
    };

    presenter.drawRectangle = function (paper, width, height, angle, scale) {
        var rectangle = paper.rect(presenter.configuration.strokeWidth / 2, presenter.configuration.strokeWidth / 2, width - presenter.configuration.strokeWidth, height - presenter.configuration.strokeWidth);
        presenter.applyStyles(rectangle);
        rectangle.transform("r" + angle + "s" + scale);
    };

    presenter.drawEllipse = function (paper, width, height, angle, scale) {
        var rectangle = paper.ellipse(width / 2, height / 2, (width - presenter.configuration.strokeWidth) / 2, (height - presenter.configuration.strokeWidth) / 2);
        presenter.applyStyles(rectangle);
        rectangle.transform("r" + angle + "s" + scale);
    };

    function transformShape(paper, element, scale, angle, width, height) {
        var roundedScale = Math.round(scale * 100) / 100; // Rounding scale to two decimal places
        var cx = parseInt(width / 2, 10);
        var cy = parseInt(height / 2, 10);

        element.transform("r" + angle + "," + cx + "," + cy);
        element.transform("...s" + roundedScale + "," + roundedScale + "," + cx + "," + cy);
    }

    function calculateLinePoints(width, height) {
        return [
            { x: 0, y: 0 },
            { x: width, y: 0 },
            { x: width, y: height },
            { x: 0, y: height}
        ];
    }

    function calculateArrowPoints(lineEnding, width, height, arrowHeight) {
        var points = [];

        switch(lineEnding) {
            case presenter.LINE_ENDING.ARROWS:
                points.push({
                    x: presenter.configuration.strokeWidth,
                    y: parseInt(height / 2, 10)
                });
                points.push({
                    x: parseInt(arrowHeight, 10),
                    y: presenter.configuration.strokeWidth
                });
                points.push({
                    x: parseInt(arrowHeight, 10),
                    y: parseInt(height / 2, 10)
                });
                points.push({
                    x: width - parseInt(arrowHeight, 10),
                    y: parseInt(height / 2, 10)
                });
                points.push({
                    x: width - parseInt(arrowHeight, 10),
                    y: presenter.configuration.strokeWidth
                });
                points.push({
                    x: width - presenter.configuration.strokeWidth,
                    y: parseInt(height / 2, 10)
                });
                points.push({
                    x: width - parseInt(arrowHeight, 10),
                    y: height - presenter.configuration.strokeWidth
                });
                points.push({
                    x: width - parseInt(arrowHeight, 10),
                    y: parseInt(height / 2, 10)
                });
                points.push({
                    x: parseInt(arrowHeight, 10),
                    y: parseInt(height / 2, 10)
                });
                points.push({
                    x: parseInt(arrowHeight, 10),
                    y: height - presenter.configuration.strokeWidth
                });
                break;
            case presenter.LINE_ENDING.NONE_AND_ARROW:
                points.push({
                    x: 0,
                    y: parseInt(height / 2, 10)
                });
                points.push({
                    x: width - parseInt(arrowHeight, 10),
                    y: parseInt(height / 2, 10)
                });
                points.push({
                    x: width - parseInt(arrowHeight, 10),
                    y: presenter.configuration.strokeWidth + 2
                });
                points.push({
                    x: width - presenter.configuration.strokeWidth,
                    y: parseInt(height / 2, 10)
                });
                points.push({
                    x: width - parseInt(arrowHeight, 10),
                    y: height - presenter.configuration.strokeWidth - 2
                });
                points.push({
                    x: width - parseInt(arrowHeight, 10),
                    y: parseInt(height / 2, 10)
                });
                points.push({
                    x: 0,
                    y: parseInt(height / 2, 10)
                });
                break;
        }

        return points;
    }

    function calculateCirclePoints(lineEnding, width, height, horizontalAxis) {
        var points = {};

        switch(lineEnding) {
            case presenter.LINE_ENDING.CIRCLES:
                points.pointA = {
                    x: 2 * horizontalAxis + (presenter.configuration.strokeWidth / 2) + 1.5,
                    y: parseInt(height / 2, 10)
                };
                points.pointB = {
                    x: width - 2 * horizontalAxis - (presenter.configuration.strokeWidth / 2) - 1.5,
                    y: parseInt(height / 2, 10)
                };
                points.pointC = {
                    x: width - 2 * horizontalAxis - (presenter.configuration.strokeWidth / 2) - 1.5,
                    y: parseInt(height / 2, 10)
                };
                points.pointD = {
                    x: 2 * horizontalAxis + (presenter.configuration.strokeWidth / 2) + 1.5,
                    y: parseInt(height / 2, 10)
                };
                break;
            case presenter.LINE_ENDING.NONE_AND_CIRCLE:
                points.pointA = {
                    x: 0,
                    y: parseInt(height / 2, 10)
                };
                points.pointB = {
                    x: width - 2 * horizontalAxis - (presenter.configuration.strokeWidth / 2) - 1.5,
                    y: parseInt(height / 2, 10)
                };
                points.pointC = {
                    x: width - 2 * horizontalAxis - (presenter.configuration.strokeWidth / 2) - 1.5,
                    y: parseInt(height / 2, 10)
                };
                points.pointD = {
                    x: 0,
                    y: parseInt(height / 2, 10)
                };
        }

        return points;
    }

    function calculateCircleAndArrowPoints(width, height, arrowHeight) {
        var points = {};

        points.pointA = {
            x: parseInt(height + presenter.configuration.strokeWidth / 2, 10),
            y: parseInt(height / 2 + 1, 10)
        };
        points.pointB = {
            x: width - parseInt(arrowHeight, 10),
            y: parseInt(height / 2 + 1, 10)
        };
        points.pointC = {
            x: width - parseInt(arrowHeight, 10),
            y: presenter.configuration.strokeWidth
        };
        points.pointD = {
            x: width - presenter.configuration.strokeWidth,
            y: parseInt(height / 2, 10)
        };
        points.pointE = {
            x: width - parseInt(arrowHeight, 10),
            y: parseInt(height - presenter.configuration.strokeWidth, 10)
        };
        points.pointF = {
            x: width - parseInt(arrowHeight, 10),
            y: parseInt(height / 2 + 1, 10)
        };
        points.pointG = {
            x: parseInt(height + presenter.configuration.strokeWidth / 2, 10),
            y: parseInt(height / 2 + 1, 10)
        };

        return points;
    }

    function drawLineFromPoints(points) {
        var pathString = "M" + points[0].x + "," + points[0].y;
        for (var i = 1; i < points.length; i++) {
            pathString += "L" + points[i].x + "," + points[i].y;
        }
        pathString += "L" + points[0].x + "," + points[0].y + "Z";

        return pathString;
    }

    presenter.drawLine = function (paper, width, height, angle, scale) {
        var base = height - 2 * presenter.configuration.strokeWidth;
        var arrowHeight = parseInt(base * Math.sqrt(3) / 2, 10);
        var spareSpace = width - 2 * arrowHeight - 2 * presenter.configuration.strokeWidth;

        if (presenter.configuration.lineEnding !== presenter.LINE_ENDING.NONE) {
            if (4 * presenter.configuration.strokeWidth + 2 > height) {
                DOMOperationsUtils.showErrorMessage(presenter.$view, presenter.ERROR_CODES, 'RU1');
                return;
            }
        }

        if (arrowHeight * 2 + presenter.configuration.strokeWidth <= height) {
            arrowHeight--;
        } else if (spareSpace < 2 * presenter.configuration.strokeWidth) {
            arrowHeight = parseInt(width / 2 - 4 * presenter.configuration.strokeWidth, 10);
        }

        var radius = parseInt(height / 2, 10);
        var horizontalAxis = radius - (presenter.configuration.strokeWidth + 1) * 0.5;
        var verticalAxis = horizontalAxis + 0.5;

        var points = [];
        var pathString;

        switch(presenter.configuration.lineEnding) {
            case presenter.LINE_ENDING.NONE:
                points = calculateLinePoints(width, height);
                pathString = drawLineFromPoints(points);

                break;
            case presenter.LINE_ENDING.ARROWS:
                points = calculateArrowPoints(presenter.LINE_ENDING.ARROWS, width, height, arrowHeight);
                pathString = drawLineFromPoints(points);

                break;
            case presenter.LINE_ENDING.NONE_AND_ARROW:
                points = calculateArrowPoints(presenter.LINE_ENDING.NONE_AND_ARROW, width, height, arrowHeight);
                pathString = drawLineFromPoints(points);

                break;
            case presenter.LINE_ENDING.CIRCLES:
                if (4 * radius > width - 1) {
                    DOMOperationsUtils.showErrorMessage(presenter.$view, presenter.ERROR_CODES, 'RU1');
                    return;
                }

                points = calculateCirclePoints(presenter.LINE_ENDING.CIRCLES, width, height, horizontalAxis);

                pathString = "M" + points.pointA.x + "," + points.pointA.y + "L" + points.pointB.x + "," + points.pointB.y;
                pathString += "A" + horizontalAxis + " " + verticalAxis + " 90 1 0 " + points.pointC.x + " " + (points.pointC.y - 1);
                pathString += "L" + points.pointC.x + "," + points.pointC.y;
                pathString += "L" + points.pointD.x + "," + points.pointD.y;
                pathString += "A" + horizontalAxis + " " + verticalAxis + " 90 1 1 " + points.pointA.x + " " + (points.pointA.y - 1);
                pathString += "L" + points.pointA.x + "," + points.pointA.y;
                pathString += "Z";

                break;
            case presenter.LINE_ENDING.NONE_AND_CIRCLE:
                if (2 * radius > width - 1) {
                    DOMOperationsUtils.showErrorMessage(presenter.$view, presenter.ERROR_CODES, 'RU2');
                    return;
                }

                points = calculateCirclePoints(presenter.LINE_ENDING.NONE_AND_CIRCLE, width, height, horizontalAxis);

                pathString = "M" + points.pointA.x + "," + points.pointA.y + "L" + points.pointB.x + "," + points.pointB.y;
                pathString += "A" + horizontalAxis + " " + verticalAxis + " 90 1 0 " + points.pointC.x + " " + (points.pointC.y - 1);
                pathString += "L" + points.pointC.x + "," + points.pointC.y;
                pathString += "L" + points.pointD.x + "," + points.pointD.y;
                pathString += "Z";
                break;
            case presenter.LINE_ENDING.CIRCLE_AND_ARROW:
                if (2 * radius + arrowHeight > width - 1) {
                    DOMOperationsUtils.showErrorMessage(presenter.$view, presenter.ERROR_CODES, 'RU3');
                    return;
                }

                points = calculateCircleAndArrowPoints(width, height, arrowHeight);

                pathString = "M" + points.pointA.x + "," + points.pointA.y + "L" + points.pointB.x + "," + points.pointB.y;
                pathString += "L" + points.pointC.x + "," + points.pointC.y;
                pathString += "L" + points.pointD.x + "," + points.pointD.y;
                pathString += "L" + points.pointE.x + "," + points.pointE.y;
                pathString += "L" + points.pointF.x + "," + points.pointF.y;
                pathString += "L" + points.pointG.x + "," + points.pointG.y;
                pathString += "A" + horizontalAxis + " " + verticalAxis + " 90 1 1 " + points.pointA.x + " " + (points.pointA.y - 1);
                pathString += "L" + points.pointA.x + "," + points.pointA.y;
                pathString += "Z";
                break;
        }

        var path = paper.path(pathString);
        presenter.applyLineStyles(path);
        transformShape(paper, path, scale, angle, width, height);
    };

    presenter.createPreview = function(view, model) {
        presenterLogic(view, model);
        presenter.setVisibility(true);
    };

    presenter.run = function(view, model){
        presenterLogic(view, model);
        presenter.setVisibility(presenter.configuration.isVisible);
    };

    presenter.validateModel = function(model) {
        var shape = model.Shape ? model.Shape : presenter.SHAPES.LINE;

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

        var strokeWidth = model["Stroke width"];
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

        var strokeColor = model["Stroke color"];
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

        var fillColor = model["Fill color"];
        if (!fillColor) {
            fillColor = "#FFF";
        } else {
            if (fillColor.length < 4 || fillColor.length > 7) {
                return { isError: true, errorCode: 'F01' };
            }

            colorMatch = fillColor.match(regExp);
            if (!colorMatch || colorMatch === null || colorMatch.length < 1) {
                return { isError: true, errorCode: 'F01' };
            }
            if (colorMatch[0].length < fillColor.length) {
                return { isError: true, errorCode: 'F01' };
            }
        }

        var cornersRoundings = model["Corners rounding"];
        if (!cornersRoundings) {
            cornersRoundings = false;
        } else {
            cornersRoundings = cornersRoundings === 'True';
        }

        var strokeOpacity = model["Stroke opacity"];
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

        var lineEnding = model["Line ending"];
        if (!lineEnding) {
            lineEnding = presenter.LINE_ENDING.NONE;
        }

        var isVisibleByDefault = ModelValidationUtils.validateBoolean(model["Is Visible"]);

        return {
            isError: false,
            shape: shape,
            rotation: rotation,
            strokeWidth: strokeWidth,
            strokeColor: strokeColor,
            fillColor: fillColor,
            cornersRoundings: cornersRoundings,
            strokeOpacity: strokeOpacity,
            lineEnding: lineEnding,
            isVisibleByDefault: isVisibleByDefault,
            isVisible: isVisibleByDefault
        };
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.show = function() {
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
    };

    presenter.hide = function() {
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
    };

    presenter.reset = function () {
        presenter.configuration.isVisible = presenter.configuration.isVisibleByDefault;
        presenter.setVisibility(presenter.configuration.isVisible);
    };

    presenter.getState = function() {
        return JSON.stringify({
            isVisible: presenter.configuration.isVisible
        });
    };

    presenter.setState = function (state) {
        var isVisible = JSON.parse(state).isVisible;

        presenter.configuration.isVisible = isVisible;
        presenter.setVisibility(isVisible);
    };

    presenter.getPrintableHTML = function (model, showAnswers) {
        var $printableView = $("<div></div>");
        $printableView.addClass("printable_addon_Standard_Shapes");
        $printableView.css("height", model.Height + "px");
        $printableView.css("width", model.Width + "px");
        var $wrapper = $("<div class=\"standardshapes-wrapper\"></div>");
        $printableView.append($wrapper);
        $printableView.css("visibility", "hidden");
        $('body').append($printableView);
        presenterLogic($printableView[0], model);
        $printableView.detach();
        $printableView.css("visibility", "");
        return $printableView[0].outerHTML;
    };

    return presenter;
}