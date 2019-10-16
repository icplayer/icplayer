function AddonColoring_create(){
    /*
        KNOWN ISSUES:
            Areas - property validation - backward compatibility:
                Co-ordinates X & Y:
                    Due to invalid validation, those values can be negative numbers or non-numbers strings. The addon behavior is to
                    display image, pass the validation and just do nothing. Browser probably will throw a small stack trace with function's
                    referring to getImageData on canvas. You shouldn't broke this invalid validation due to backward compatibility
                Transparent color:
                    It's have been added with validation : only numbers between range 0-255, without inproper strings

            Default Filling Color - backward compatibility:
                Empty string:
                    Default color is [255, 100, 100, 255], when provided string is just empty one.

    * */

    var presenter = function(){};

    presenter.playerController = null;
    presenter.eventBus = null;
    presenter.lastEvent = null;
    presenter.imageHasBeenLoaded = false;

    presenter.initialState = null;
    presenter.isCanvasInitiated = false;

    presenter.AREA_TYPE = {
        NORMAL: 0,
        TRANSPARENT: 1,
        USER_AREA: 2
    };

    function areaObject(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.defaultColor;
        this.pixelPosition;
        this.colorToFill = [];

        this.getColor = function () {
            return presenter.getColorAtPoint(this.x, this.y);
        };

        this.setPixelPosition = function () {
            this.pixelPosition = ((this.x + this.y * presenter.canvasWidth) * 4);
        };
    }

    presenter.createPreview = function(view, model){
        runLogic(view, model, true);
    };

    function setColorsThatCanBeFilled() {
        var configuration = presenter.configuration;
        configuration.colorsThatCanBeFilled = [];
        $.each(configuration.areas, function() {
            var color = presenter.getColorAtPoint(this.x, this.y);
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
        var score;

        if (ModelValidationUtils.isStringEmpty(score)) {
            score = "";
        } else {
            score = score ? 1 : 0;
        }

        return {
            'source': presenter.configuration.addonID,
            'item': item.join(';'),
            'value': value.toString(),
            'score': score
        };
    };

    presenter.sendEvent = function(item, value, score) {
        if (!presenter.isShowAnswersActive && !presenter.setShowErrorsModeActive) {
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
            this.defaultColor = presenter.getColorAtPoint(this.x, this.y);
        });
    }

    function setAreasPixelPosition() {
        var configuration = presenter.configuration;
        $.each(configuration.areas, function() {
            this.pixelPosition = (this.x + this.y * presenter.canvasWidth) * 4;
        });
    }

    function getClickedArea(clickObject) {
        var configuration = presenter.configuration;
        var clickedArea = new areaObject(clickObject.x, clickObject.y, presenter.AREA_TYPE.USER_AREA);
        clickedArea.setPixelPosition();
        clickedArea.colorToFill = [255, 255, 255, 255];

        for(var i = 0; i < configuration.areas.length; i++) {
            var area = configuration.areas[i];

            if(isAreaColored(area)) {
                presenter.allColoredPixels = [];
                return area;
            }
        }

        if (presenter.configuration.userAreas == undefined) {
            presenter.configuration.userAreas = [];
        }

        if (!isUserAreaExists()) {
            presenter.configuration.userAreas.push(clickedArea);
        }

        presenter.allColoredPixels = [];
        return clickedArea;
    }

    function isUserAreaExists() {
        var userAreas = presenter.configuration.userAreas;
        for(var i = 0; i < userAreas.length; i++) {
            if(isAreaColored(userAreas[i])) {
                return true;
            }
        }

        return false;
    }

    function isAreaColored(area) {
        return (presenter.allColoredPixels.indexOf(area.pixelPosition) != -1);
    }

    presenter.clearArea = function (x, y, isRemovingWrongColor) {
        presenter.fillArea(x, y, '255 255 255 255', isRemovingWrongColor);
    };

    presenter.fillArea = function (x, y, color, isRemovingWrongColor) {
        presenter.isColored = true;

        presenter.click = {
            x: parseInt(x, 10),
            y: parseInt(y, 10)
        };

        presenter.click.color = presenter.getColorAtPoint(presenter.click.x, presenter.click.y);

        if (color == undefined) {
            presenter.fillColor = presenter.configuration.currentFillingColor;
        } else {
            var validatedDefaultFillingColor = presenter.validateColor(color);
            if (validatedDefaultFillingColor.isError) {
                DOMOperationsUtils.showErrorMessage(presenter.$view, presenter.errorCodes, validatedDefaultFillingColor.errorCode);
                return;
            }
            presenter.fillColor = validatedDefaultFillingColor.value;
        }

        if ( presenter.isAlreadyInColorsThatCanBeFilled(presenter.click.color) || isRemovingWrongColor) {
            if (!presenter.isShowAnswersActive && !presenter.setShowErrorsModeActive) {
                presenter.floodFill(
                    presenter.click,
                    presenter.fillColor,
                    presenter.configuration.tolerance
                );
            }

            if (!presenter.isAlreadyInColorsThatCanBeFilled(presenter.fillColor)) {
                presenter.configuration.colorsThatCanBeFilled.push(presenter.fillColor)
            }
        }

        presenter.allColoredPixels = [];
    };

    presenter.checkIfColoredCorrectly = function () {
        $.each(presenter.configuration.areas, function() {
            var area = this;

            if(!presenter.shouldBeTakenIntoConsideration(area)) {
                return true; // continue
            }

            if (!isCorrect(area)) {
                    var r = area.colorToFill[0],
                        g = area.colorToFill[1],
                        b = area.colorToFill[2],
                        a = area.colorToFill[3],
                        color = r + " " + g + " " + b + " " + a;
                if(r != -1){
                    presenter.fillArea(area.x, area.y, color, false);
                }else{
                    presenter.fillArea(area.x, area.y, '0 0 0 0', false);
                }
            }
        });
    };

    presenter.clickLogic = function(e, isTouch) {
        e.stopPropagation();
        e.preventDefault();

        presenter.isColored = true;

        presenter.click = getMousePositionOnCanvas(e, isTouch);

        presenter.click.color = presenter.getColorAtPoint(presenter.click.x, presenter.click.y);

        if (presenter.configuration.disableFill) {
            presenter.sendEvent([presenter.click.x, presenter.click.y], '', '');

            return false;
        }

        if ( presenter.isAlreadyInColorsThatCanBeFilled(presenter.click.color) ) {

            if (!presenter.isShowAnswersActive && !presenter.setShowErrorsModeActive) {
                presenter.floodFill(
                    presenter.click,
                    presenter.configuration.currentFillingColor,
                    presenter.configuration.tolerance
                );
            }

            if(!presenter.configuration.colorCorrect){
                presenter.userInteractionSendingEvent(getClickedArea(presenter.click));
            }

            if (!presenter.isAlreadyInColorsThatCanBeFilled(presenter.configuration.currentFillingColor)) {
                presenter.configuration.colorsThatCanBeFilled.push(presenter.configuration.currentFillingColor)
            }
        }
        if(presenter.configuration.colorCorrect){
            presenter.checkIfColoredCorrectly();
            presenter.sendEvent([presenter.click.x, presenter.click.y], presenter.configuration.isErase ? 0 : 1, 1);
        }
    };

    presenter.userInteractionSendingEvent = function (clickedArea) {
        if (clickedArea.type == presenter.AREA_TYPE.USER_AREA) {
            presenter.sendEvent([clickedArea.x, clickedArea.y], presenter.configuration.isErase ? 0 : 1, "");
        } else {
            presenter.sendEvent([clickedArea.x, clickedArea.y], presenter.configuration.isErase ? 0 : 1, isCorrect(clickedArea) ? 1 : 0);
        }
    };

    presenter.recolorImage = function () {
        var imageData = presenter.ctx.getImageData(0, 0,presenter.canvasWidth, presenter.canvasHeight);

        for (var i=0; i<imageData.data.length; i+=4) {
            if (imageData.data[i]==0 &&
                imageData.data[i+1]==0 &&
                imageData.data[i+2]==0 &&
                imageData.data[i+3]==255
                ){
                imageData.data[i]=55;
                imageData.data[i+1]=55;
                imageData.data[i+2]=55;
                imageData.data[i+3]=255;
            }
        }

        presenter.ctx.putImageData(imageData,0,0);
    };

    function runLogic(view, model, isPreview) {
        presenter.configuration = presenter.validateModel(model, isPreview);
        presenter.allColoredPixels = [];

        if (presenter.configuration.isError) {
            DOMOperationsUtils.showErrorMessage($(view), presenter.errorCodes, presenter.configuration.errorCode);
            return;
        }

        presenter.$view = $(view);

        presenter.setVisibility(presenter.configuration.isVisible || isPreview);

        var imageElement = $('<img>');

        if(presenter.configuration.imageFile.indexOf("/file/serve") == 0){
            presenter.configuration.imageFile = presenter.configuration.imageFile + "?no_gcs=true";
        }

        imageElement.attr('src', presenter.configuration.imageFile);

        var canvasElement = $('<canvas></canvas>');
        presenter.ctx = canvasElement[0].getContext('2d');

        imageElement.load(function() {
            canvasElement.attr('width', imageElement[0].width);
            canvasElement.attr('height', imageElement[0].height);
            presenter.canvasWidth = imageElement[0].width;
            presenter.canvasHeight = imageElement[0].height;
            presenter.canvas = canvasElement[0];

            presenter.ctx.drawImage(imageElement[0], 0, 0);
            presenter.imageHasBeenLoaded = true;

            presenter.imageData = presenter.ctx.getImageData(0, 0, imageElement[0].width, imageElement[0].height);

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

                var moduleSelector = $('.moduleSelector[data-id="'+presenter.configuration.addonID+'"]');

                moduleSelector.on('mousemove', function(e) {
                    xContainer.find('.value').html(getMousePositionOnCanvas(e).x);
                    yContainer.find('.value').html(getMousePositionOnCanvas(e).y);
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

                presenter.recolorImage();
                presenter.runEndedDeferred.resolve();
                presenter.isCanvasInitiated = true;
            }
        });
    }

    presenter.run = function(view, model){
        runLogic(view, model, false);

        presenter.eventBus.addEventListener('ShowAnswers', this);
        presenter.eventBus.addEventListener('HideAnswers', this);
    };

    presenter.isAlreadyInColorsThatCanBeFilled = function(color) {
        for (var i = 0; i < presenter.configuration.colorsThatCanBeFilled.length; i++) {
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
            if (array1[i] != array2[i] && (array1[i]+1) != array2[i] && (array1[i]-1) != array2[i]) {
                //Due to the lossy nature of converting to and from premultiplied alpha color values,
                // pixels that have just been set using putImageData() might be returned to an equivalent getImageData() as different values. http://www.w3.org/TR/2dcontext/#dom-context-2d-getimagedata
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }
        return true;
    };

    presenter.getColorAtPoint = function(x, y) {
        var data = presenter.ctx.getImageData(x, y, 1, 1).data,
            color = [];
        for (var i = 0; i < data.length; i++) {
            color.push(data[i]);
        }
        return color;
    };

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

        var positionX = parseInt(client.x - rect.left, 10);
        var positionY = parseInt(client.y - rect.top, 10);
        var scaledPoint = scalePoint({x: positionX, y: positionY});

        return {x: scaledPoint.x, y: scaledPoint.y};
    }

    presenter.errorCodes = {
        'E01': 'Wrong color notation. Must be in "r g b a" format. See documentation for more details.',
        'E02': 'All color values must be between 0 - 255.',
        'E03': 'Areas are configured wrong. It should be in "x; y; color" format. See documentation for more details.',
        'E04': 'Areas x & y values have to be smaller than Width and Height properties.',
        'A01': "Areas x & y values have to be integer values between 0 - 255."
    };

    presenter.validateModel = function(model, isPreview) {
        var validatedAreas = {
            items: []
        };

        if (model['Areas'].toString().length > 0) {
            validatedAreas = presenter.validateAreas(model['Areas'], isPreview, model['Width'], model['Height']);
            if (validatedAreas.isError) {
                return { isError: true, errorCode: validatedAreas.errorCode};
            }
        }

        var validatedTolerance = {};
        if (model['Tolerance'].toString().length === 0) {
            validatedTolerance.value = 50;
        } else {
            validatedTolerance = ModelValidationUtils.validateIntegerInRange(model['Tolerance'], 100, 0);
            if (validatedTolerance.isError) {
                return { isError: true, errorCode: validatedTolerance.errorCode};
            }
        }

        var validatedDefaultFillingColor = {};
        if (model['DefaultFillingColor'].toString().length === 0) {

            validatedDefaultFillingColor.value = [255, 100, 100, 255];

        } else {

            validatedDefaultFillingColor = presenter.validateColor(model['DefaultFillingColor']);
            if (validatedDefaultFillingColor.isError) {
                return { isError: true, errorCode: validatedDefaultFillingColor.errorCode};
            }

        }

        var validatedIsVisible = ModelValidationUtils.validateBoolean(model['Is Visible']),
            validatedIsDisabled = ModelValidationUtils.validateBoolean(model['isDisabled']);

        return {
            'isValid': true,
            'isError': false,
            'addonID' : model['ID'],

            'imageFile': model.Image,
            'areas' : validatedAreas.items,
            'tolerance' : validatedTolerance.value,
            'currentFillingColor' : validatedDefaultFillingColor.value,
            'defaultFillingColor' : validatedDefaultFillingColor.value,
            'isErase' : false,
            'isVisible' : validatedIsVisible,
            'isVisibleByDefault' : validatedIsVisible,
            'isDisabled' : validatedIsDisabled,
            'isDisabledByDefault' : validatedIsDisabled,
            'isActivity' : !(ModelValidationUtils.validateBoolean(model['isNotActivity'])),
            'lastUsedColor' : validatedDefaultFillingColor.value,
            'disableFill' : ModelValidationUtils.validateBoolean(model['disableFill']),
            'colorCorrect' : ModelValidationUtils.validateBoolean(model.colorCorrect)
        }
    };

    presenter.getErrorObject = function (errorCode) {
        return {isValid: false, isError: true, errorCode: errorCode};
    };

    presenter.parseTransparentArea = function (splitedAreaArray) {
        var area = {
            x: parseInt(Number(splitedAreaArray[0])),
            y: parseInt(Number(splitedAreaArray[1])),
            type: presenter.AREA_TYPE.TRANSPARENT,
            colorToFill: [-1, -1, -1, -1]
        };

        if (isNaN(area.x) || isNaN(area.y)) {
            return presenter.getErrorObject("A01");
        }

        if (area.x < 0 || area.y < 0) {
            return presenter.getErrorObject("A01");
        }

        area.isError = false;

        return area;
    };

    presenter.isTransparent = function (value) {
        if (value.length === 3) {
            return value[2] === "transparent";
        }

        return false;
    };

    presenter.validateAreas = function(areasText, isPreview, modelWidth, modelHeight) {
        modelWidth = parseInt(modelWidth, 10);
        modelHeight = parseInt(modelHeight, 10);
        var areas = Helpers.splitLines(areasText).map(function (element) {
           return element.split(';');
        }).map(function (element) {

            if (element.length === 3) {
                var trimmedArray = element.map(function (value) {return value.trim();});

                if (presenter.isTransparent(trimmedArray)) {
                    return presenter.parseTransparentArea(trimmedArray);
                } else {
                    var area = {
                        x: parseInt(trimmedArray[0], 10),
                        y: parseInt(trimmedArray[1], 10),
                        type: presenter.AREA_TYPE.NORMAL
                    };

                    if(isPreview && (area.x>=modelWidth || area.y>=modelHeight)) {
                        return {isValid: false, isError: true, errorCode: 'E04'};
                    }

                    var validatedColor = presenter.validateColor(trimmedArray[2]);
                    if(!validatedColor.isError) {
                      area.colorToFill = validatedColor.value;
                      area.isError = false;
                      return area;
                    }
                }

                return {isValid: false, isError: true, errorCode: validatedColor.errorCode};
            }

            return {isValid: false, isError: true, errorCode: 'E03'};
        });

        var errors = areas.filter(function (element) {if (element.isError) return element;});
        if (errors.length > 0) {
            return errors[0];
        }

        return {isValid: true, isError: false, items: areas};
    };

    presenter.validateColor = function(spaceSeparatedColor) {
        var splitted = spaceSeparatedColor.split(' '),
            validatedColors = [];

        if (splitted.length < 4) {
            return {isError: true, errorCode: 'E01'};
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
            return { isError: true, errorCode: 'E02'};
        }

        return { value: validatedColors, isError: false};
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
        $(presenter.canvas).off('click');
        $(presenter.canvas).on('click', function(e){
            presenter.clickLogic(e);
        });

        $(presenter.canvas).off('touchstart');
        $(presenter.canvas).on('touchstart', function (e){
            e.stopPropagation();
            e.preventDefault();

            presenter.lastEvent = e;
        });

        $(presenter.canvas).off('touchend');
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
        var actualScore = presenter.getScore();

        if (presenter.configuration.transparentAreaError) {
            return false;
        }

        return actualScore === presenter.getMaxScore();
    };

    presenter.isAttempted = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        return presenter.isColored || false;
    };

    presenter.getColor = function(x, y) {
        if (x === undefined || y === undefined) return;

        return presenter.getColorAtPoint(x, y).join(' ');
    };

    presenter.removeWrongColors = function () {
        $.each(presenter.configuration.areas, function() {
            var area = this;

            if(!presenter.shouldBeTakenIntoConsideration(area)) {
                return true; // continue
            }

            if (!isCorrect(area)) {
                presenter.clearArea(area.x, area.y, true);
            }
        });
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
            'hideAnswers' : presenter.hideAnswers,
            'fillArea' : presenter.fillAreaCommand,
            'clearArea' : presenter.clearAreaCommand,
            'getColor' : presenter.getColor,
            'removeWrongColors': presenter.removeWrongColors
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setEraserOn = function() {
        presenter.configuration.isErase = true;
        presenter.configuration.lastUsedColor = presenter.configuration.currentFillingColor;
        presenter.configuration.currentFillingColor = [255, 255, 255, 255];
    };

    presenter.clearAreaCommand = function (coordinates){
        presenter.clearArea(coordinates[0], coordinates[1], false);
    };

    presenter.fillAreaCommand = function(coordinatesAndColor) {
        presenter.fillArea(coordinatesAndColor[0], coordinatesAndColor[1], coordinatesAndColor[2], false);
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
        presenter.setShowErrorsModeActive = true;
    };

    function displayIcon(area, isWrong) {
        var iconContainer = $('<div class="icon-container"></div>'),
            container = presenter.$view.find('.coloring-container'),
            containerWidth = container.width(),
            canvasWidth = $(presenter.canvas).width(),
            leftDistance = (containerWidth-canvasWidth)/ 2,
            position = $(presenter.canvas).position(),
            top = area.y + position.top - 5, // -5 because it's half of the icon container width and height
            left = area.x + leftDistance - 5;

        iconContainer.css({
            top: top + 'px',
            left: left + 'px'
        });

        iconContainer.addClass(isWrong ? 'wrong' : 'correct');

        container.append(iconContainer);
    }

    presenter.setWorkMode = function(){
        presenter.$view.find('.icon-container').remove();
        presenter.setShowErrorsModeActive = false;
    };

    presenter.clearCanvas = function() {
        presenter.ctx.clearRect(0, 0, presenter.canvasWidth, presenter.canvasHeight);
        presenter.ctx.drawImage(presenter.image[0], 0, 0);
    };

    presenter.reset = function(){
        presenter.clearCanvas();
        presenter.$view.find('.icon-container').remove();
        presenter.isColored = false;
        presenter.isShowAnswersActive = false;
        presenter.setShowErrorsModeActive = false;
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
        presenter.recolorImage();
    };

    presenter.getErrorCount = function(){
        if (presenter.isShowAnswersActive) {
            return presenter.currentErrorCount;
        }

        if (presenter.configuration.isActivity && presenter.imageHasBeenLoaded) {
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
        } else if (presenter.configuration.isActivity && presenter.savedErrorCount) {
            return 0;
        } else {
            return 0;
        }
    };

    function isCorrect(area) {
        return presenter.compareArrays(presenter.getColorAtPoint(area.x, area.y), area.colorToFill);
    }

    presenter.shouldBeTakenIntoConsideration = function(area) {
        return !presenter.compareArrays(presenter.getColorAtPoint(area.x, area.y), area.defaultColor);
    };

    presenter.getMaxScore = function(){
        if (presenter.configuration.isActivity) {
            var normalAreas = presenter.configuration.areas.filter(function (element) {
                   return (element.type == presenter.AREA_TYPE.NORMAL);
            });

            return normalAreas.length;
        } else {
            return 0;
        }
    };

    presenter.getScoreForNormalArea = function (area) {
        if (!presenter.shouldBeTakenIntoConsideration(area)) {
            return 0; // continue
        }

        if (isCorrect(area)) {
            return 1;
        }

        return 0;
    };

    presenter.getScoreForTransparentArea = function (area) {

        if(!presenter.compareArrays(presenter.getColorAtPoint(area.x, area.y), area.defaultColor)) {
            presenter.configuration.transparentAreaError = true;
        }

        return 0;
    };

    presenter.getScore = function(){
        if (presenter.isShowAnswersActive) {
            return presenter.currentScore;
        }

        if (presenter.configuration.isActivity && presenter.imageHasBeenLoaded) {
            var scoreCount = 0;
            presenter.configuration.transparentAreaError = false;
            $.each(presenter.configuration.areas, function() {
                switch(this.type) {
                    case presenter.AREA_TYPE.NORMAL:
                        scoreCount += presenter.getScoreForNormalArea(this);
                        break;
                    case presenter.AREA_TYPE.TRANSPARENT:
                        scoreCount += presenter.getScoreForTransparentArea(this);
                        break;
                }
            });

            return scoreCount;
        } else if (presenter.configuration.isActivity && presenter.savedScore) {
            return 0;
        } else {
            return 0;
        }
    };

    presenter.getState = function(){

        if (!presenter.isCanvasInitiated && presenter.initialState != null) {
            return presenter.initialState;
        }

        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        var filledAreas = [];
        $.each(presenter.configuration.areas, function() {
            if (presenter.shouldBeTakenIntoConsideration(this)) {
                filledAreas.push({
                    area: this,
                    color: presenter.getColorAtPoint(this.x, this.y)
                });
            }
        });

        var userAreas = [];
        if (presenter.configuration.userAreas != undefined) {
            userAreas = presenter.configuration.userAreas.map(function (elem) {
                return {
                    area: {x: elem.x, y: elem.y, type: elem.type, pixelPosition: elem.pixelPosition, colorToFill: elem.colorToFill},
                    color: elem.getColor()};
            });
        }


        var state = {
            filledAreas: filledAreas,
            currentFillingColor: presenter.configuration.currentFillingColor,
            isErase: presenter.configuration.isErase,
            colorsThatCanBeFilled: presenter.configuration.colorsThatCanBeFilled,
            isVisible: presenter.configuration.isVisible,
            isDisabled: presenter.configuration.isDisabled,
            isColored: presenter.isColored,
            score: presenter.getScore(),
            errorCount: presenter.getErrorCount(),
            userAreas: userAreas
        };
        return JSON.stringify(state);
    };

    presenter.upgradeState = function(state) {

        if (state.userAreas == undefined) {
            return presenter.upgradeUserAreas(state);
        }

        return state;
    };

    presenter.upgradeUserAreas = function(state) {
        var upgradedState = {};
        jQuery.extend(true, upgradedState, state); // Deep copy of model object

        if(state.userAreas == undefined) {
            upgradedState["userAreas"] = [];
        }

        return upgradedState;
    };

    presenter.restoreUserAreasFromState = function (state) {
        presenter.configuration.userAreas = [];

        $.each(state.userAreas, function() {
            var userArea = new areaObject(this.area.x, this.area.y, this.area.type);
            userArea.pixelPosition = this.area.pixelPosition;
            userArea.colorToFill = this.area.colorToFill;

            presenter.configuration.userAreas.push(userArea);
        });

    };

    presenter.getAreasToFillFromSetState = function (state) {
        var filledAreasArray = state.filledAreas;
        filledAreasArray = filledAreasArray.concat(state.userAreas);

        return filledAreasArray
    };

    presenter.setCurrentFillingColorInSetState = function (state) {
        if (presenter.configuration.isErase) {
            presenter.configuration.currentFillingColor = [255, 255, 255, 255];
        } else {
            presenter.configuration.currentFillingColor = state.currentFillingColor;
        }
    };

    presenter.setState = function(state){
        if (!presenter.isCanvasInitiated) {
            presenter.initialState = state;
        }

        if (ModelValidationUtils.isStringEmpty(state)) {
            return;
        }

        var parsed = JSON.parse(state);
        var upgradedState = presenter.upgradeState(parsed);

        presenter.configuration.isErase = upgradedState.isErase;
        presenter.configuration.isVisible = upgradedState.isVisible;
        presenter.configuration.isDisabled = upgradedState.isDisabled;
        presenter.isColored = upgradedState.isColored;
        presenter.savedScore = upgradedState.score;
        presenter.savedErrorCount = upgradedState.errorCount;

        presenter.setCurrentFillingColorInSetState(upgradedState);

        presenter.setVisibility(presenter.configuration.isVisible);

        presenter.restoreUserAreasFromState(upgradedState);

        var areasToFill = presenter.getAreasToFillFromSetState(upgradedState);

        if (upgradedState.colorsThatCanBeFilled) {
            presenter.restoreColoringAtState(areasToFill, upgradedState)
        }
    };

    presenter.restoreColoringAtState = function (filledAreasArray, state) {
        presenter.runEnded.then(function() {
            presenter.configuration.colorsThatCanBeFilled = state.colorsThatCanBeFilled;
            $.each(filledAreasArray, presenter.restoreFilledArea);
        });
    };

    presenter.restoreFilledArea = function (_, areaToFillObject) {
        presenter.floodFill({
            x: areaToFillObject.area.x,
            y: areaToFillObject.area.y,
            color: presenter.getColorAtPoint(areaToFillObject.area.x, areaToFillObject.area.y)
        },

        areaToFillObject.color,
        presenter.configuration.tolerance);
        presenter.allColoredPixels = [];
    };

    presenter.floodFill = function (position, fillColor, tolerance) {
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
    };

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
        if (!presenter.configuration.isActivity) {
            return;
        }
        presenter.setShowErrorsModeActive = false;

        presenter.$view.find('.icon-container').remove();
        presenter.currentScore = presenter.getScore();
        presenter.currentErrorCount = presenter.getErrorCount();

        presenter.tmpFilledAreas = [];
        $.each(presenter.configuration.areas, function() {
            if (presenter.shouldBeTakenIntoConsideration(this)) {
                presenter.tmpFilledAreas.push({
                    area: this,
                    color: presenter.getColorAtPoint(this.x, this.y)
                });
            }

        });

        if (presenter.configuration.userAreas) {
            for (var i = 0; i < presenter.configuration.userAreas.length; i++) {
                var area = presenter.configuration.userAreas[i];
                presenter.tmpFilledAreas.push({area: area, color: area.getColor()});
            }
        }

        presenter.clearCanvas();
        presenter.recolorImage();

        var areas = presenter.configuration.areas;
        for (var i=0; i< areas.length; i++) {
            presenter.floodFill({
                    x: areas[i].x,
                    y: areas[i].y,
                    color: [255, 255, 255, 255]
                },
                [areas[i].colorToFill[0], areas[i].colorToFill[1], areas[i].colorToFill[2], areas[i].colorToFill[3]],
                presenter.configuration.tolerance);

            presenter.allColoredPixels = [];
        }

        presenter.isShowAnswersActive = true;
    };

    presenter.hideAnswers = function () {
        if (!presenter.configuration.isActivity) {
            return;
        }

        presenter.clearCanvas();
        presenter.recolorImage();
        $.each(presenter.tmpFilledAreas, function() {
            presenter.floodFill({
                    x: this.area.x,
                    y: this.area.y,
                    color: [255, 255, 255, 255]
                },
                this.color,
                presenter.configuration.tolerance);

            presenter.allColoredPixels = [];
        });

        presenter.isShowAnswersActive = false;
    };

    function scalePoint({x, y}) {
        var scaledPoint = {x: x, y: y};
        if (!presenter.playerController)
            return scaledPoint;

        var scale = presenter.playerController.getScaleInformation();
        if (scale.scaleX !== 1.0 || scale.scaleY !== 1.0) {
            scaledPoint.x = Math.floor(scaledPoint.x / scale.scaleX);
            scaledPoint.y = Math.floor(scaledPoint.y / scale.scaleY);
        }
        return scaledPoint;
    }

    return presenter;
}