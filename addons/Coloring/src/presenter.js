function AddonColoring_create(){

    var presenter = function(){};

    presenter.playerController = null;
    presenter.eventBus = null;
    presenter.lastEvent = null;

    presenter.createPreview = function(view, model){
        runLogic(view, model, true);
    };

    function setColorsThatCanBeFilled() {
        var configuration = presenter.configuration;
        configuration.colorsThatCanBeFilled = [];
        $.each(configuration.areas, function() {
            var color = getClickedAreaColor(this.x, this.y);
            if (!presenter.isAlreadyInColorsThatCanBeFilled(color)) {
                configuration.colorsThatCanBeFilled.push(color);
            }
        });
    }

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;

        presenter.runEndedDeferred = new $.Deferred();
        presenter.runEnded = presenter.runEndedDeferred.promise();

        presenter.eventBus = controller.getEventBus();
    };

    presenter.createEventData = function (item, value, score) {
        var score = score ? 1 : 0,
            value = value.toString(),
            item = item.join(';');

        return {
            'source': presenter.configuration.addonID,
            'item': item,
            'value': value,
            'score': score
        };
    };

    presenter.sendEvent = function(item, value, score) {
    	if (!presenter.isShowAnswersActive) {
    		var eventData = presenter.createEventData(item, value, score);
    		presenter.eventBus.sendEvent('ValueChanged', eventData);

    		if (presenter.isAllOK()) sendAllOKEvent();
    	}
    };

    function sendAllOKEvent() {
        var eventData = {
            'source': presenter.configuration.addonID,
            'item': 'all',
            'value': '',
            'score': ''
        };

        presenter.eventBus.sendEvent('ValueChanged', eventData);
    }

    function setAreasDefaultColors() {
        var configuration = presenter.configuration;
        $.each(configuration.areas, function() {

            this.defaultColor = getClickedAreaColor(this.x, this.y);
        });
    }

    function setAreasPixelPosition() {
        var configuration = presenter.configuration;
        $.each(configuration.areas, function() {

            this.pixelPosition = (this.x + this.y * presenter.canvasWidth) * 4;
        });
    }

    function getClickedArea() {
        var configuration = presenter.configuration,
            clickedArea = {
                x: 0,
                y: 0,
                colorToFill: [255, 255, 255, 255]
            };

        $.each(configuration.areas, function() {
            if ($.inArray(this.pixelPosition, presenter.allColoredPixels) >= 0) {
                presenter.allColoredPixels = [];
                clickedArea = this;
                return false;
            }
        });

        return clickedArea;
    }

    presenter.clickLogic = function(e, isTouch) {
        e.stopPropagation();
        e.preventDefault();

        presenter.click = getMousePositionOnCanvas(e, isTouch);

        presenter.click.color = getClickedAreaColor(presenter.click.x, presenter.click.y);

        if ( presenter.isAlreadyInColorsThatCanBeFilled(presenter.click.color) ) {

            if(!presenter.isShowAnswersActive){
                floodFill(
                    presenter.click,
                    presenter.configuration.currentFillingColor,
                    presenter.configuration.tolerance
                );
            }
            var clickedArea =  getClickedArea();

            presenter.sendEvent([clickedArea.x, clickedArea.y], presenter.configuration.isErase ? 0 : 1, isCorrect(clickedArea) ? 1 : 0);

            if (!presenter.isAlreadyInColorsThatCanBeFilled(presenter.configuration.currentFillingColor)) {
                presenter.configuration.colorsThatCanBeFilled.push(presenter.configuration.currentFillingColor)
            }
        }
    };

    function runLogic(view, model, isPreview) {
        presenter.configuration = presenter.validateModel(model);
        presenter.allColoredPixels = [];

        if (presenter.configuration.isError) {
            DOMOperationsUtils.showErrorMessage($(view), presenter.errorCodes, presenter.configuration.errorCode);
            return;
        }

        presenter.$view = $(view);

        presenter.setVisibility(presenter.configuration.isVisible);

        var imageElement = $('<img>');
        imageElement.attr('src', presenter.configuration.imageFile);

        var canvasElement = $('<canvas></canvas>'),
            ctx = canvasElement[0].getContext('2d');

        imageElement.load(function() {
            canvasElement.attr('width', imageElement[0].width);
            canvasElement.attr('height', imageElement[0].height);

            presenter.canvasWidth = imageElement[0].width;
            presenter.canvasHeight = imageElement[0].height;
            presenter.canvas = canvasElement[0];

            ctx.drawImage(imageElement[0], 0, 0);

            presenter.imageData = ctx.getImageData(0, 0, imageElement[0].width, imageElement[0].height);

            presenter.ctx = ctx;
            presenter.image = imageElement;

            var coloringContainer = presenter.$view.find('.coloring-container');

            coloringContainer.append(canvasElement);

            presenter.canvasOffset = canvasElement.offset();

            setColorsThatCanBeFilled();
            setAreasDefaultColors();
            setAreasPixelPosition();

            if (isPreview) {
                var coordinatesContainer = $('<div></div>'),
                    xContainer = $('<div>x: <span class="value"></span></div>'),
                    yContainer = $('<div>y: <span class="value"></span></div>'),
                    coloringWrapper = presenter.$view.find('.coloring-wrapper');

                coordinatesContainer.css({
                    'width' : 60,
                    'height' : 25,
                    'border' : '1px solid #696969',
                    'borderRadius' : '3px',
                    'position' : 'absolute',
                    'top' : 5,
                    'left' : 5,
                    'fontSize' : '9px',
                    'padding': '5px',
                    'lineHeight' : '12px'
                });

                coordinatesContainer
                    .append(xContainer)
                    .append(yContainer);

                coloringWrapper.append(coordinatesContainer);
                coloringWrapper.css({
                    'position' : 'relative',
                    'minHeight' : presenter.canvasHeight,
                    'minWidth' : presenter.canvasWidth
                });

                canvasElement.on('mousemove', function(e) {
                    xContainer.find('.value').html(getMousePositionOnCanvas(e).x);
                    yContainer.find('.value').html(getMousePositionOnCanvas(e).y);
                });
            } else if (!presenter.configuration.isDisabled) {
                canvasElement.on('click', function(e) {
                    presenter.clickLogic(e);
                });

                canvasElement.on('touchstart', function (e){
                    presenter.lastEvent = e;
                });

                canvasElement.on('touchend', function (e){
                    if ( presenter.lastEvent.type != e.type ) {
                        presenter.clickLogic(e, true);
                    }
                });

                presenter.runEndedDeferred.resolve();
            }


        });
    }

    presenter.run = function(view, model){
        runLogic(view, model, false);

        presenter.eventBus.addEventListener('ShowAnswers', this);
        presenter.eventBus.addEventListener('HideAnswers', this);
    };

    presenter.isAlreadyInColorsThatCanBeFilled = function(color) {
        for(var i = 0; i < presenter.configuration.colorsThatCanBeFilled.length; i++) {
            if (presenter.compareArrays(color, presenter.configuration.colorsThatCanBeFilled[i])) {
                return true;
            }
        }

        return false;
    };

    presenter.compareArrays = function(array1, array2) {
        // if the other array is a falsy value, return

        if (!array2)
            return false;

        // compare lengths - can save a lot of time
        if (array1.length != array2.length)
            return false;

        for (var i = 0, l=array1.length; i < l; i++) {
            if (array1[i] != array2[i]) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }
        return true;
    };

    function log(message) {
        console.log(message);
    }

    function getClickedAreaColor(x, y) {
        var data = presenter.ctx.getImageData(x, y, 1, 1).data,
            color = [];
        for (var i = 0; i < data.length; i++) {
            color.push(data[i]);
        }
        return color;
    }

    function fixTouch (touch) {
        var winPageX = window.pageXOffset,
            winPageY = window.pageYOffset,
            x = touch.clientX,
            y = touch.clientY;

        if (touch.pageY === 0 && Math.floor(y) > Math.floor(touch.pageY) ||
            touch.pageX === 0 && Math.floor(x) > Math.floor(touch.pageX)) {
            // iOS4 clientX/clientY have the value that should have been
            // in pageX/pageY. While pageX/page/ have the value 0
            x = x - winPageX;
            y = y - winPageY;
        } else if (y < (touch.pageY - winPageY) || x < (touch.pageX - winPageX) ) {
            // Some Android browsers have totally bogus values for clientX/Y
            // when scrolling/zooming a page. Detectable since clientX/clientY
            // should never be smaller than pageX/pageY minus page scroll
            x = touch.pageX - winPageX;
            y = touch.pageY - winPageY;
        }

        return {
            x: x,
            y: y
        };
    }

    function getMousePositionOnCanvas(e, isTouch) {
        var rect = presenter.canvas.getBoundingClientRect(),
            client = {
                x: e.clientX,
                y: e.clientY
            };

        if (isTouch) {
            client = fixTouch(event.touches[0] || event.changedTouches[0]);
        }

        return {
            x: parseInt(client.x - rect.left, 10),
            y: parseInt(client.y - rect.top, 10)
        };
    }

    presenter.errorCodes = {
        'E01' : 'Wrong color notation. Must be in "r g b a" format. See documentation for more details.',
        'E02' : 'All color values must be between 0 - 255.',
        'E03' : 'Areas are configured wrong. It should be in "x; y; color" format. See documentation for more details.'
    };

    presenter.validateModel = function(model) {
        var validatedAreas = {
            items: []
        };

        if (model['Areas'].toString().length > 0) {
            validatedAreas = presenter.validateAreas(model['Areas']);
            if (validatedAreas.isError) {
                return {
                    isError: true,
                    errorCode: validatedAreas.errorCode
                }
            }
        }

        var validatedTolerance = {};
        if (model['Tolerance'].toString().length === 0) {

            validatedTolerance.value = 50;

        } else {

            validatedTolerance = ModelValidationUtils.validateIntegerInRange(model['Tolerance'], 100, 0);
            if (validatedTolerance.isError) {
                return {
                    isError: true,
                    errorCode: validatedTolerance.errorCode
                }
            }
        }

        var validatedDefaultFillingColor = {};
        if (model['DefaultFillingColor'].toString().length === 0) {

            validatedDefaultFillingColor.value = [255, 100, 100, 255];

        } else {

            validatedDefaultFillingColor = presenter.validateColor(model['DefaultFillingColor']);
            if (validatedDefaultFillingColor.isError) {
                return {
                    isError: true,
                    errorCode: validatedDefaultFillingColor.errorCode
                }
            }

        }

        var validatedIsVisible = ModelValidationUtils.validateBoolean(model['Is Visible']),
            validatedIsActivity = !(ModelValidationUtils.validateBoolean(model['isNotActivity'])),
            validatedIsDisabled = ModelValidationUtils.validateBoolean(model['isDisabled']),
            addonID = model['ID'];

        return {
            'isError' : false,
            'imageFile' : model.Image,
            'areas' : validatedAreas.items,
            'tolerance' : validatedTolerance.value,
            'currentFillingColor' : validatedDefaultFillingColor.value,
            'defaultFillingColor' : validatedDefaultFillingColor.value,
            'isErase' : false,
            'isVisible' : validatedIsVisible,
            'isVisibleByDefault' : validatedIsVisible,
            'isDisabled' : validatedIsDisabled,
            'isDisabledByDefault' : validatedIsDisabled,
            'isActivity' : validatedIsActivity,
            'addonID' : addonID,
            'lastUsedColor' : validatedDefaultFillingColor.value
        }
    };

    presenter.validateAreas = function(areasText) {
        var splittedByNL = Helpers.splitLines(areasText),
            areas = [],
            validated = {
                isError: false
            };

        $.each(splittedByNL, function() {
            var currentLine = this.toString(),
                area = {
                    'raw' : currentLine
                },
                splittedBySemicolon = currentLine.split(';');

            if (splittedBySemicolon.length == 3) {

                $.each(splittedBySemicolon, function(i) {
                    var currentValue = $.trim(this.toString());

                    switch (i) {
                        case 0:
                            area.x = parseInt(currentValue, 10);
                            break;
                        case 1:
                            area.y = parseInt(currentValue, 10);
                            break;
                        case 2:
                            var validatedColor = presenter.validateColor(currentValue);
                            if (validatedColor.isError) {
                                validated.isError = true;
                                validated.errorCode = validatedColor.errorCode;
                                return false;
                            }
                            area.colorToFill = validatedColor.value;
                            break;
                    }
                });

            } else {

                validated.isError = true;
                validated.errorCode = 'E03';
                return false; // jQuery break

            }

            areas.push(area);
        });

        validated.items = areas;

        return validated;
    };

    presenter.validateColor = function(spaceSeparatedColor) {
        var splitted = spaceSeparatedColor.split(' '),
            validatedColors = [];

        if (splitted.length < 4) {
            return {
                isError: true,
                errorCode: 'E01'
            }
        }

        var areAllValuesInRange = true;
        $.each(splitted, function() {
            var validated = ModelValidationUtils.validateIntegerInRange(this, 255, 0);
            if (!validated.isValid) {
                areAllValuesInRange = false;
                return;
            }
            validatedColors.push(validated.value);
        });

        if (!areAllValuesInRange) {
            return {
                isError: true,
                errorCode: 'E02'
            }
        }

        return {
            value: validatedColors,
            isError: false
        };
    };

    presenter.show = function() {
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
    };

    presenter.hide = function() {
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.disable = function() {
        presenter.configuration.isDisabled = true;
        $(presenter.canvas).off('click touchstart touchend');
        $(presenter.canvas).on('click touchstart touchend', function(e) {
            e.stopPropagation();
        });
    };

    presenter.enable = function() {
        presenter.configuration.isDisabled = false;
        $(presenter.canvas).on('click', function(e){
            presenter.clickLogic(e);
        });

        $(presenter.canvas).on('touchstart', function (e){
            e.stopPropagation();
            e.preventDefault();

            presenter.lastEvent = e;
        });

        $(presenter.canvas).on('touchend', function (e){
            e.stopPropagation();
            e.preventDefault();

            if ( presenter.lastEvent.type != e.type ) {
                presenter.clickLogic(e, true);
            }
        });
    };

    presenter.getView = function() {
        return presenter.$view;
    };

    presenter.isAllOK = function() {
        return presenter.getScore() === presenter.getMaxScore();
    };

    presenter.isAttempted = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        var isAttempted = false;
        $.each(presenter.configuration.areas, function() {
            if (presenter.shouldBeTakenIntoConsideration(this)) {
                isAttempted = true;
                return false; // break;
            }
        });
        return isAttempted;
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'disable' : presenter.disable,
            'enable' : presenter.enable,
            'isAllOK' : presenter.isAllOK,
            'getView' : presenter.getView,
            'setColor' : presenter.setColorCommand,
            'setEraserOn' : presenter.setEraserOn,
            'isAttempted' : presenter.isAttempted,
            'showAnswers' : presenter.showAnswers,
            'hideAnswers' : presenter.hideAnswers
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setEraserOn = function() {
        presenter.configuration.isErase = true;
        presenter.configuration.lastUsedColor = presenter.configuration.currentFillingColor;
        presenter.configuration.currentFillingColor = [255, 255, 255, 255];
    };

    presenter.setColorCommand = function(color) {
        presenter.setColor(color[0]);
    };

    presenter.setColor = function(color) {
        var validatedDefaultFillingColor = presenter.validateColor(color);
        if (validatedDefaultFillingColor.isError) {
            DOMOperationsUtils.showErrorMessage(presenter.$view, presenter.errorCodes, validatedDefaultFillingColor.errorCode);
            return;
        }

        presenter.configuration.currentFillingColor = validatedDefaultFillingColor.value;
        presenter.configuration.isErase = false;
    };

    presenter.setShowErrorsMode = function(){
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        if (presenter.configuration.isActivity) {
            $.each(presenter.configuration.areas, function() {
                var area = this;

                if(!presenter.shouldBeTakenIntoConsideration(area)) {
                    return true; // continue
                }

                if (isCorrect(area)) {
                    displayIcon(area, false);
                } else {
                    displayIcon(area, true);
                }
            });
        }
    };

    function displayIcon(area, isWrong) {
        var iconContainer = $('<div class="icon-container"></div>'),
            container = presenter.$view.find('.coloring-container'),
            position = $(presenter.canvas).position(),
            top = area.y + position.top - 5, // -5 because it's half of the icon container width and height
            left = area.x + position.left - 5;

        iconContainer.css({
            top: top + 'px',
            left: left + 'px'
        });

        iconContainer.addClass(isWrong ? 'wrong' : 'correct');

        container.append(iconContainer);
    }

    presenter.setWorkMode = function(){
        presenter.$view.find('.icon-container').remove();
    };

    presenter.clearCanvas = function() {
        presenter.ctx.clearRect(0, 0, presenter.canvasWidth, presenter.canvasHeight);
        presenter.ctx.drawImage(presenter.image[0], 0, 0);
    };

    presenter.reset = function(){
        presenter.clearCanvas();
        presenter.$view.find('.icon-container').remove();

        presenter.configuration.isVisible = presenter.configuration.isVisibleByDefault;
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);

        presenter.configuration.isDisabled = presenter.configuration.isDisabledByDefault;
        presenter.configuration.isDisabledByDefault ? presenter.disable() : presenter.enable();

        if (presenter.configuration.isErase) {
            presenter.configuration.currentFillingColor = presenter.configuration.lastUsedColor;
            presenter.configuration.isErase = false;
        } else {
            presenter.configuration.currentFillingColor = presenter.configuration.defaultFillingColor;
        }

        setColorsThatCanBeFilled();
    };

    presenter.getErrorCount = function(){
        if (presenter.isShowAnswersActive) {
            return presenter.currentErrorCount;
        }
        if (presenter.configuration.isActivity) {
            var errorsCount = 0;
            $.each(presenter.configuration.areas, function() {
                var area = this;

                if (!presenter.shouldBeTakenIntoConsideration(area)) {
                    return true; // continue
                }

                if (!isCorrect(area)) {
                    errorsCount++;
                }
            });

            return errorsCount;
        } else {
            return 0;
        }
    };

    function isCorrect(area) {
        return presenter.compareArrays(getClickedAreaColor(area.x, area.y), area.colorToFill);
    }

    presenter.shouldBeTakenIntoConsideration = function(area) {
        return !presenter.compareArrays(getClickedAreaColor(area.x, area.y), area.defaultColor);
    };

    presenter.getMaxScore = function(){
        if (presenter.configuration.isActivity) {
            return presenter.configuration.areas.length;
        } else {
            return 0;
        }
    };

    presenter.getScore = function(){
        if (presenter.isShowAnswersActive) {
            return presenter.currentScore;
        }

        if (presenter.configuration.isActivity) {
            var scoreCount = 0;
            $.each(presenter.configuration.areas, function() {
                var area = this;

                if (!presenter.shouldBeTakenIntoConsideration(area)) {
                    return true; // continue
                }

                if (isCorrect(area)) {
                    scoreCount++;
                }
            });

            return scoreCount;
        } else {
            return 0;
        }
    };

    presenter.getState = function(){
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        var filledAreas = [];
        $.each(presenter.configuration.areas, function() {
            if (presenter.shouldBeTakenIntoConsideration(this)) {
                filledAreas.push({
                    area: this,
                    color: getClickedAreaColor(this.x, this.y)
                });
            }
        });

        var state = {
            filledAreas: filledAreas,
            currentFillingColor: presenter.configuration.currentFillingColor,
            isErase: presenter.configuration.isErase,
            colorsThatCanBeFilled: presenter.configuration.colorsThatCanBeFilled,
            isVisible: presenter.configuration.isVisible,
            isDisabled: presenter.configuration.isDisabled
        };

        return JSON.stringify(state);
    };

    presenter.setState = function(state){
        var parsed = JSON.parse(state);

        presenter.configuration.isErase = parsed.isErase;
        presenter.configuration.isVisible = parsed.isVisible;
        presenter.configuration.isDisabled = parsed.isDisabled;

        if (presenter.configuration.isErase) {
            presenter.configuration.currentFillingColor = [255, 255, 255, 255];
        } else {
            presenter.configuration.currentFillingColor = parsed.currentFillingColor;
        }

        presenter.setVisibility(presenter.configuration.isVisible);

        presenter.runEnded.then(function() {
            presenter.configuration.colorsThatCanBeFilled = parsed.colorsThatCanBeFilled;
            $.each(parsed.filledAreas, function() {
                floodFill({
                    x: this.area.x,
                    y: this.area.y,
                    color: [255, 255, 255, 255]
                },
                this.color,
                presenter.configuration.tolerance);
            });
        });
    };

    function floodFill(position, fillColor, tolerance) {
        var img = presenter.ctx.getImageData(0, 0, presenter.canvasWidth, presenter.canvasHeight),
            surface = img.data,
            length = surface.length,
            queue = [],
            x = position.x,
            y = position.y,
            targetColor = position.color,
            startingPixel = (x + y * presenter.canvasWidth) * 4,
            east = startingPixel, west = startingPixel, rightBound, leftBound, leftEdge = presenter.canvasWidth * 4;

        if(!pixelCompare(startingPixel, targetColor, fillColor, surface, length, tolerance).canFill) { return false; }

        queue.push(startingPixel);

        while(queue.length) {
            startingPixel = queue.pop();

            if(pixelCompareAndSet(startingPixel, targetColor, fillColor, surface, length, tolerance)) {
                east = startingPixel;
                west = startingPixel;
                leftBound = parseInt(startingPixel / leftEdge) * leftEdge; //left bound
                rightBound = leftBound + leftEdge;	//right bound
                while(leftBound < (west -= 4) && pixelCompareAndSet(west, targetColor, fillColor, surface, length, tolerance)); //go left until edge hit

                while(rightBound > (east += 4) && pixelCompareAndSet(east, targetColor, fillColor, surface, length, tolerance)); //go right until edge hit

                for(var j = west; j < east; j += 4) {
                    if(j - leftEdge >= 0 		&& pixelCompare(j - leftEdge, targetColor, fillColor, surface, length, tolerance).canFill) queue.push(j - leftEdge);
                    if(j + leftEdge < length	&& pixelCompare(j + leftEdge, targetColor, fillColor, surface, length, tolerance).canFill) queue.push(j + leftEdge);
                }
            }
        }

        presenter.ctx.putImageData(img, 0, 0);
    }

    function pixelCompare(i, targetColor, fillColor, surface, length, tolerance) {
        if (i < 0 || i >= length) { // out of bounds

            return {
                canFill: false,
                withinTolerance: false
            };
        }
        if (surface[i + 3] === 0) { //surface is invisible

            return {
                canFill: false,
                withinTolerance: false
            };
        }

        if (targetColor[3] === fillColor[3] && //target is same as fill
            targetColor[0] === fillColor[0] &&
            targetColor[1] === fillColor[1] &&
            targetColor[2] === fillColor[2]) {

            return {
                canFill: false,
                withinTolerance: false
            };
        }

        if (fillColor[3] === surface[i+3] && // surface matches fillColor
            fillColor[0] === surface[i]  &&
            fillColor[1] === surface[i+1] &&
            fillColor[2] === surface[i+2]) {

            return {
                canFill: false,
                withinTolerance: false
            }

        }

        if (targetColor[3] === surface[i + 3] && //target matches surface
            targetColor[0] === surface[i]  &&
            targetColor[1] === surface[i + 1] &&
            targetColor[2] === surface[i + 2]) {

            return {
                canFill: true,
                withinTolerance: false
            };
        }

        if (Math.abs(targetColor[3] - surface[i + 3]) <= (255 - tolerance) && //target to surface within tolerance
            Math.abs(targetColor[0] - surface[i]) <= tolerance &&
            Math.abs(targetColor[1] - surface[i + 1]) <= tolerance &&
            Math.abs(targetColor[2] - surface[i + 2]) <= tolerance) {

            return {
                canFill: true,
                withinTolerance: true
            };

        }

        return {
            canFill: false,
            withinTolerance: false
        }; //no match
    }

    function pixelCompareAndSet(i, targetColor, fillColor, surface, length, tolerance) {
        var compareResult = pixelCompare(i, targetColor, fillColor, surface, length, tolerance);

        if (compareResult.canFill) {
            for(var j = i; j < i + 4; j++) {
                presenter.allColoredPixels.push(j);
            }
            //fill the color
            surface[i]     = fillColor[0];
            surface[i + 1] = fillColor[1];
            surface[i + 2] = fillColor[2];
            surface[i + 3] = fillColor[3];

            return true;
        }

        return false;
    }

    presenter.onEventReceived = function (eventName) {
        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        }

        if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        }
    };

    presenter.showAnswers = function () {
        if (presenter.validateModel.isActivity) {
            return;
        }
        presenter.$view.find('.icon-container').remove();
        presenter.currentScore = presenter.getScore();
        presenter.currentErrorCount = presenter.getErrorCount();

        presenter.tmpFilledAreas = [];
        $.each(presenter.configuration.areas, function() {
            if (presenter.shouldBeTakenIntoConsideration(this)) {
                presenter.tmpFilledAreas.push({
                    area: this,
                    color: getClickedAreaColor(this.x, this.y)
                });
            }
        });

        presenter.clearCanvas();

        var areas = presenter.configuration.areas;

        for (var i=0; i<areas.length; i++) {
            floodFill({
                    x: areas[i].x,
                    y: areas[i].y,
                    color: [255, 255, 255, 255]
                },
                [areas[i].colorToFill[0], areas[i].colorToFill[1], areas[i].colorToFill[2], areas[i].colorToFill[3]],
                presenter.configuration.tolerance);
        }

        presenter.isShowAnswersActive = true;
    };

    presenter.hideAnswers = function () {
        if (presenter.validateModel.isActivity) {
            return;
        }

        presenter.clearCanvas();

        $.each(presenter.tmpFilledAreas, function() {
            floodFill({
                    x: this.area.x,
                    y: this.area.y,
                    color: [255, 255, 255, 255]
                },
                this.color,
                presenter.configuration.tolerance);
        });

        presenter.isShowAnswersActive = false;
    };

    return presenter;
}