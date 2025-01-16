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
    presenter.keyboardControllerObject = null;
    presenter.colorSpeechTextMap = {};
    presenter.isTTSExitBlocked = false;
    presenter.initialState = null;
    presenter.isCanvasInitiated = false;
    presenter.defaultColorRGBA = [255, 100, 100, 255];
    presenter.whiteRGBA = [255, 255, 255, 255];
    presenter.transparentAreaTTS = "transparent";

    presenter.AREA_TYPE = {
        NORMAL: 0,
        TRANSPARENT: 1,
        USER_AREA: 2
    };

    presenter.DEFAULT_TTS_PHRASES = {
        area: "Area",
        color: "Color",
        selected: "Selected",
        correct: "Correct",
        incorrect: "Incorrect",
    };

    presenter.errorCodes = {
        'E01': 'Wrong color notation. Must be in "r g b a" format. See documentation for more details.',
        'E02': 'All color values must be between 0 - 255.',
        'E03': 'Areas are configured wrong. It should be in "x; y; color; optional TTS description" format. See documentation for more details.',
        'E04': 'Areas x & y values have to be smaller than Width and Height properties.',
        'E05': 'Tolerance value must be between 0 - 100',
        'E06': 'Areas are configured wrong. Color has an invalid value, or TTS description is not properly separated. See documentation for more details',
        'E07': 'Colors property is configured wrong. "Description" field must not be empty.',
        'A01': "Areas x & y values have to be integer values between 0 - 255."
    };

    function getErrorObject (errorCode) { return { isValid: false, isError: true, errorCode }; }
    function getCorrectObject (value) { return { isValid: true, isError: false, value }; }

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
        const wholeCanvas = presenter.ctx.getImageData(0, 0, presenter.canvasWidth, presenter.canvasHeight).data;
        const areas = configuration.areas;

        for (var i = areas.length; i--;) {
            let area = areas[i];
            let color = getColorAtPointFromCanvas(area.x, area.y, wholeCanvas);
            if (!presenter.isAlreadyInColorsThatCanBeFilled(color)) {
                configuration.colorsThatCanBeFilled.push(color);
            }
        }
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
        if (!presenter.isShowAnswersActive && !presenter.isShowErrorsModeActive) {
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
        clickedArea.colorToFill = presenter.whiteRGBA;

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
            if (!presenter.isShowAnswersActive && !presenter.isShowErrorsModeActive) {
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

            if (!presenter.isShowAnswersActive && !presenter.isShowErrorsModeActive) {
                presenter.floodFill(
                    presenter.click,
                    presenter.configuration.currentFillingColor,
                    presenter.configuration.tolerance
                );
            }

            if(!presenter.configuration.colorCorrect){
                setTimeout(function(){
                    // Without timeout there are issues on Firefox if event handling takes too long
                    presenter.userInteractionSendingEvent(getClickedArea(presenter.click));
                }, 0);
            }

            if (!presenter.isAlreadyInColorsThatCanBeFilled(presenter.configuration.currentFillingColor)) {
                presenter.configuration.colorsThatCanBeFilled.push(presenter.configuration.currentFillingColor)
            }
        }
        if(presenter.configuration.colorCorrect){
            presenter.checkIfColoredCorrectly();
            setTimeout(function(){
                // Without timeout there are issues on Firefox if event handling takes too long
                presenter.sendEvent([presenter.click.x, presenter.click.y], presenter.configuration.isErase ? 0 : 1, 1);
            }, 0);
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

    presenter.upgradeModel = function(model) {
        let upgradedModel = presenter.upgradeShowAllAnswersInGradualShowAnswersMode(model);
        upgradedModel = presenter.upgradeColors(upgradedModel);
        upgradedModel = presenter.upgradeSpeechTexts(upgradedModel);
        upgradedModel = presenter.upgradeLangTag(upgradedModel);
        upgradedModel = presenter.upgradeMarkTransparentAreas(upgradedModel);

        return upgradedModel;
    };

    presenter.upgradeShowAllAnswersInGradualShowAnswersMode = function AddonColoring_upgradeShowAllAnswersInGradualShowAnswersMode (model) {
        const upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if(!upgradedModel['showAllAnswersInGradualShowAnswersMode']) {
            upgradedModel['showAllAnswersInGradualShowAnswersMode'] = false;
        }

        return upgradedModel;
    }

    presenter.upgradeColors = function AddonColoring_upgradeColors (model) {
        const upgradedModel = {};
        jQuery.extend(true, upgradedModel, model);
        if (!upgradedModel['colors']) {
            upgradedModel['colors'] = [];
        }

        return upgradedModel;
    };

    presenter.upgradeSpeechTexts = function AddonColoring_upgradeSpeechTexts (model) {
        const defaultValue = {
            Area: { Area: "" },
            Color: { Color: "" },
            Selected: { Selected: "" },
            Correct: { Correct: "" },
            Incorrect: { Incorrect: "" }
        }

        const upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object
        if (model["speechTexts"] === undefined) {
            upgradedModel["speechTexts"] = defaultValue;
        }

        return upgradedModel;
    };

    presenter.upgradeLangTag = function AddonColoring_upgradeLangTag (model) {
        const upgradedModel = {};
        jQuery.extend(true, upgradedModel, model);
        if (model["langAttribute"] === undefined) {
            upgradedModel["langAttribute"] = "";
        }

        return upgradedModel;
    };

    presenter.upgradeMarkTransparentAreas = function AddonColoring_upgradeMarkTransparentAreas (model) {
        const upgradedModel = {};
        jQuery.extend(true, upgradedModel, model);
        if (!model.hasOwnProperty('markTransparentAreas')) {
            upgradedModel['markTransparentAreas'] = "False";
        }

        return upgradedModel;
    };


    presenter.validateModel = function(model, isPreview) {
        const validatedAreas = model['Areas'].toString().length
            ? presenter.validateAreas(model['Areas'], isPreview, model['Width'], model['Height'])
            : getCorrectObject([]);
        if (validatedAreas.isError) return validatedAreas;

        const validatedTolerance = model['Tolerance'].toString().length
            ? ModelValidationUtils.validateIntegerInRange(model['Tolerance'], 100, 0)
            : getCorrectObject(50);
         if (!validatedTolerance.isValid) return getErrorObject('E05');

        const validatedDefaultFillingColor = model['DefaultFillingColor'].toString().length
            ? presenter.validateColor(model['DefaultFillingColor'])
            : getCorrectObject(presenter.defaultColorRGBA);
        if (validatedDefaultFillingColor.isError) return validatedDefaultFillingColor;

        const validatedColors = presenter.validateColors(model['colors']);
        const colorsError = validatedColors.find(colorObject => colorObject.isError);
        if (colorsError) return colorsError;

        const validatedIsVisible = ModelValidationUtils.validateBoolean(model['Is Visible']);
        const validatedIsDisabled = ModelValidationUtils.validateBoolean(model['isDisabled']);

        return {
            'isValid': true,
            'isError': false,
            'addonID' : model['ID'],
            'imageFile': model.Image,
            'areas' : validatedAreas.value,
            'tolerance' : validatedTolerance.value,
            'currentFillingColor' : validatedDefaultFillingColor.value,
            'defaultFillingColor' : validatedDefaultFillingColor.value,
            'colors' : validatedColors,
            'isErase' : false,
            'isVisible' : validatedIsVisible,
            'isVisibleByDefault' : validatedIsVisible,
            'isDisabled' : validatedIsDisabled,
            'isDisabledByDefault' : validatedIsDisabled,
            'isActivity' : !(ModelValidationUtils.validateBoolean(model['isNotActivity'])),
            'lastUsedColor' : validatedDefaultFillingColor.value,
            'disableFill' : ModelValidationUtils.validateBoolean(model['disableFill']),
            'colorCorrect' : ModelValidationUtils.validateBoolean(model.colorCorrect),
            'showAllAnswersInGradualShowAnswersMode' : ModelValidationUtils.validateBoolean(model.showAllAnswersInGradualShowAnswersMode),
            'langTag': model.langAttribute,
            'markTransparentAreas': ModelValidationUtils.validateBoolean(model.markTransparentAreas)
        }
    };

    presenter.validateAreas = function(areasText, isPreview, modelWidth, modelHeight) {
        modelWidth = parseInt(modelWidth, 10);
        modelHeight = parseInt(modelHeight, 10);
        const areas = Helpers.splitLines(areasText)
            .map(element => element.split(';'))
            .map(element => presenter.validateArea(element, isPreview, modelWidth, modelHeight));

        const errors = areas.filter(element => element.isError);
        if (errors.length) {
            return errors[0];
        }

        return getCorrectObject(areas);
    };

    presenter.validateArea = function(element, isPreview, modelWidth, modelHeight) {
        if (element.length === 3 || element.length === 4) {
            const trimmedArray = element.map(value => value.trim());
            if (presenter.isTransparent(trimmedArray)) {
                return presenter.parseTransparentArea(trimmedArray);
            }
            const area = {
                x: parseInt(trimmedArray[0], 10),
                y: parseInt(trimmedArray[1], 10),
                type: presenter.AREA_TYPE.NORMAL,
                speechText: trimmedArray[3] ? trimmedArray[3] : presenter.speechTexts.Area,
            };

            if (isPreview && (area.x >= modelWidth || area.y >= modelHeight)) {
                return getErrorObject('E04');
            }

            const validatedColor = presenter.validateColor(trimmedArray[2]);
            if (validatedColor.isError) return getErrorObject("E06");

            area.colorToFill = validatedColor.value;
            area.isError = false;
            return area;
        }
        return getErrorObject('E03');
    }


    presenter.isTransparent = function (value) {
        return value[2] === "transparent";
    };

    presenter.parseTransparentArea = function (splittedAreaArray) {
        const area = {
            x: parseInt(Number(splittedAreaArray[0])),
            y: parseInt(Number(splittedAreaArray[1])),
            type: presenter.AREA_TYPE.TRANSPARENT,
            colorToFill: [-1, -1, -1, -1],
            speechText: splittedAreaArray[3] ? splittedAreaArray[3] : presenter.speechTexts.Area
        };

        if (isNaN(area.x) || isNaN(area.y)) {
            return getErrorObject("A01");
        }
        if (area.x < 0 || area.y < 0) {
            return getErrorObject("A01");
        }

        area.isError = false;

        return area;
    };

    presenter.validateColor = function(spaceSeparatedColor) {
        const splitted = spaceSeparatedColor.split(' '),
            validatedColors = [];

        if (splitted.length !== 4) {
            return getErrorObject('E01');
        }

        let areAllValuesInRange = true;
        $.each(splitted, function() {
            const validated = ModelValidationUtils.validateIntegerInRange(this, 255, 0);
            if (!validated.isValid) {
                areAllValuesInRange = false;
                return;
            }
            validatedColors.push(validated.value);
        });

        if (!areAllValuesInRange) {
            return getErrorObject('E02');
        }

        return getCorrectObject(validatedColors);
    };

    presenter.validateColors = function (colorsModel) {
        return colorsModel
            .filter(colorObject => colorObject?.colorRGBA.length || colorObject?.speechText.length)
            .map(colorObject => {
                const colorValidation = presenter.validateColor(colorObject.colorRGBA)
                const speechText = colorObject.speechText?.length
                    ? colorObject.speechText
                    : getErrorObject("E07");

                if (colorValidation.isError) return colorValidation;
                if (speechText.isError) return speechText;

                return {
                        speechText,
                        colorRGBA: colorValidation.value
                    }
            });
    }

    function runLogic(view, model, isPreview) {
        model = presenter.upgradeModel(model);
        presenter.setSpeechTexts(model["speechTexts"]);

        presenter.configuration = presenter.validateModel(model, isPreview);
        presenter.createColorSpeechTextsMap(presenter.configuration.colors);
        presenter.allColoredPixels = [];
        presenter.currentAreaIdInGSAMode = 0;

        if (presenter.configuration.isError) {
            DOMOperationsUtils.showErrorMessage($(view), presenter.errorCodes, presenter.configuration.errorCode);
            return;
        }

        presenter.$view = $(view);
        presenter.setVisibility(presenter.configuration.isVisible || isPreview);
        presenter.setImageElement(isPreview);
        presenter.buildKeyboardController();
    }

    presenter.createColorSpeechTextsMap = function(colors) {
        if (!colors) return;
        const whiteRGBAString = presenter.getRGBAStringFromRGBAArray(presenter.whiteRGBA);
        presenter.colorSpeechTextMap = colors.reduce((prev, curr) => {
            const color = presenter.getRGBAStringFromRGBAArray(curr.colorRGBA);
            if (color === whiteRGBAString) return prev;
            return {
                ...prev,
                [color] : curr.speechText
            }
        }, {});
    }

    presenter.setImageElement = function (isPreview) {
        const $imageElement = $('<img>');

        URLUtils.prepareImageForCanvas(presenter.playerController, $imageElement[0], presenter.configuration.imageFile);

        const canvasElement = $('<canvas></canvas>');
        presenter.ctx = canvasElement[0].getContext('2d');

        $imageElement.load(function() {
            canvasElement.attr('width', $imageElement[0].width);
            canvasElement.attr('height', $imageElement[0].height);
            presenter.canvasWidth = $imageElement[0].width;
            presenter.canvasHeight = $imageElement[0].height;
            presenter.canvas = canvasElement[0];

            presenter.ctx.drawImage($imageElement[0], 0, 0);
            presenter.imageHasBeenLoaded = true;
            presenter.imageData = presenter.ctx.getImageData(0, 0, $imageElement[0].width, $imageElement[0].height);
            presenter.image = $imageElement;

            const coloringContainer = presenter.$view.find('.coloring-container');
            coloringContainer.append(canvasElement);

            presenter.canvasOffset = canvasElement.offset();

            setColorsThatCanBeFilled();
            setAreasDefaultColors();
            setAreasPixelPosition();

            if (isPreview) {
                const coordinatesContainer = $('<div></div>'),
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

                const moduleSelector = $('.moduleSelector[data-id="'+presenter.configuration.addonID+'"]');

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
                    if (presenter.lastEvent.type != e.type) {
                        presenter.clickLogic(e, true);
                    }
                });

                presenter.recolorImage();
                presenter.runEndedDeferred.resolve();
                presenter.isCanvasInitiated = true;
            }
        });
    }

    presenter.setSpeechTexts = function AddonColoring_setSpeechTexts(speechTexts) {
        presenter.speechTexts = {
            ...presenter.DEFAULT_TTS_PHRASES
        };

        if (!speechTexts || $.isEmptyObject(speechTexts)) {
            return;
        }

        presenter.speechTexts = {
            area: TTSUtils.getSpeechTextProperty(
                speechTexts.Area.Area,
                presenter.speechTexts.area),
            color: TTSUtils.getSpeechTextProperty(
                speechTexts.Color.Color,
                presenter.speechTexts.color),
            selected: TTSUtils.getSpeechTextProperty(
                speechTexts.Selected.Selected,
                presenter.speechTexts.selected),
            correct: TTSUtils.getSpeechTextProperty(
                speechTexts.Correct.Correct,
                presenter.speechTexts.correct),
            incorrect: TTSUtils.getSpeechTextProperty(
                speechTexts.Incorrect.Incorrect,
                presenter.speechTexts.incorrect)
        };
    };

    presenter.run = function(view, model){
        runLogic(view, model, false);

        var events = ['ShowAnswers', 'HideAnswers', 'GradualShowAnswers', 'GradualHideAnswers'];
        for (let i = 0; i < events.length; i++) {
            presenter.eventBus.addEventListener(events[i], this);
        }
    };

    presenter.isAlreadyInColorsThatCanBeFilled = function(color) {
        for (let i = 0; i < presenter.configuration.colorsThatCanBeFilled.length; i++) {
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

    function getColorAtPointFromCanvas (x, y, canvas) {
        // canvas is flat - 1 dimensional
        // data is flatened by going through whole X axis before incrementing Y axis - e.g. (x:1,y:0),(x:2,y:0) etc.
        // so to jump to desired position of pixel (Y:area.y, X:area.x) we need to multiply by width - that gives us desired row
        // and then add X position (area.x) - that gives us desired column
        // multiply by 4 is because wholeCanvas doesnt store px but R,G,B,A values, so each px takes 4 places in Canvas array
        let index = (y * presenter.canvasWidth + x ) * 4;
        let color = [
          canvas[index],     //R
          canvas[index + 1], //G
          canvas[index + 2], //B
          canvas[index + 3]  //A
        ];
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

        var positionX = parseInt(client.x - rect.left, 10);
        var positionY = parseInt(client.y - rect.top, 10);
        var scaledPoint = scalePoint({x: positionX, y: positionY});

        return {x: scaledPoint.x, y: scaledPoint.y};
    }

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
        presenter.configuration.currentFillingColor = presenter.whiteRGBA;
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

    presenter.activateErrorsMode = function () {
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

        presenter.isShowErrorsModeActive = true;
    }

    function waitForElement(callback, timeout = 5000) {
        const startTime = Date.now();

        let interval = setInterval(() => {
            if (!$.isEmptyObject(presenter.canvas)) {
                clearInterval(interval);
                callback();
            } else if (Date.now() - startTime > timeout) {
                clearInterval(interval);
            }
        }, 100);
    }

    presenter.setShowErrorsMode = function(){
        waitForElement(presenter.activateErrorsMode)
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
        presenter.isShowErrorsModeActive = false;
    };

    presenter.clearCanvas = function() {
        presenter.ctx.clearRect(0, 0, presenter.canvasWidth, presenter.canvasHeight);
        presenter.ctx.drawImage(presenter.image[0], 0, 0);
    };

    presenter.reset = function(resetOnlyWrong){
        if (resetOnlyWrong) {
            $.each(presenter.configuration.areas, function () {
                var area = this;
                if (!isCorrect(area)) {
                    presenter.clearArea(area.x, area.y, true)
                }
            });
        } else {
            presenter.clearCanvas();
        }
        presenter.removeAreaMark();
        presenter.removeColorList();
        presenter.$view.find('.icon-container').remove();
        presenter.isColored = false;
        presenter.isShowAnswersActive = false;
        presenter.isShowErrorsModeActive = false;
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
        if (presenter.configuration.markTransparentAreas && presenter.isAttempted() && area.type === presenter.AREA_TYPE.TRANSPARENT) {
            return presenter.compareArrays(presenter.getColorAtPoint(area.x, area.y), area.defaultColor);
        }

        return presenter.compareArrays(presenter.getColorAtPoint(area.x, area.y), area.colorToFill);
    }

    presenter.shouldBeTakenIntoConsideration = function(area) {
        if (presenter.configuration.markTransparentAreas && presenter.isAttempted() && area.type === presenter.AREA_TYPE.TRANSPARENT) {
            return true;
        }

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
        const wasAnswersShow = presenter.isShowAnswersActive;
        const lastAreaIdInGSAMode = presenter.currentAreaIdInGSAMode;

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

        if (wasAnswersShow) {
            presenter.currentAreaIdInGSAMode = lastAreaIdInGSAMode;
            presenter.showAnswersAgain();
        }

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
            presenter.configuration.currentFillingColor = presenter.whiteRGBA;
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

    presenter.onEventReceived = function (eventName, data) {
        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        }

        if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        }

        if (eventName == "GradualShowAnswers") {
            if (presenter.configuration.addonID == data.moduleID) {
                presenter.gradualShowAnswers();
            } else if (!presenter.isShowAnswersActive) {
                presenter.activateShowAnswersMode();
            }
        }

        if (eventName == "GradualHideAnswers") {
            presenter.hideAnswers();
        }
    };

    presenter.showAnswers = function () {
        if (!presenter.configuration.isActivity) {
            return;
        }

        if (!presenter.isShowAnswersActive) {
            presenter.activateShowAnswersMode();
        }

        var areas = presenter.configuration.areas;
        for (var i=0; i< areas.length; i++) {
            presenter.fillAreaWithCorrectColor(areas[i]);
        }
    };

    presenter.gradualShowAnswers = function () {
        if (!presenter.configuration.showAllAnswersInGradualShowAnswersMode) {
            if (!presenter.configuration.isActivity) {
                return;
            }

            if (!presenter.isShowAnswersActive) {
                presenter.activateShowAnswersMode();
            }

            var area = presenter.configuration.areas[presenter.currentAreaIdInGSAMode];
            presenter.fillAreaWithCorrectColor(area);
            presenter.currentAreaIdInGSAMode++;
        } else {
            presenter.showAnswers();
        }
    };

    presenter.hideAnswers = function () {
        if (!presenter.configuration.isActivity || !presenter.isShowAnswersActive) {
            return;
        }

        presenter.deactivateShowAnswersMode();
    };

    presenter.showAnswersAgain = function () {
        if (!presenter.configuration.showAllAnswersInGradualShowAnswersMode) {
            if (!presenter.isShowAnswersActive) {
                presenter.activateShowAnswersMode();
            }

            if (presenter.currentAreaIdInGSAMode === 0) {
                presenter.showAnswers();
            } else {
                for (let i = 0; i < presenter.currentAreaIdInGSAMode; i++) {
                    const area = presenter.configuration.areas[i];
                    presenter.fillAreaWithCorrectColor(area);
                }
            }
        } else {
            presenter.showAnswers();
        }
    }

    presenter.activateShowAnswersMode = function () {
        presenter.isShowErrorsModeActive = false;

        presenter.$view.find('.icon-container').remove();
        presenter.currentScore = presenter.getScore();
        presenter.currentErrorCount = presenter.getErrorCount();

        presenter.backupUserAreas();

        presenter.clearCanvas();
        presenter.recolorImage();

        presenter.isShowAnswersActive = true;
    };

    presenter.deactivateShowAnswersMode = function () {
        presenter.currentAreaIdInGSAMode = 0;

        presenter.clearCanvas();
        presenter.recolorImage();

        presenter.restoreUserAreas();

        presenter.isShowAnswersActive = false;
    };

    presenter.backupUserAreas = function () {
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
                presenter.tmpFilledAreas.push({
                    area: area,
                    color: area.getColor()
                });
            }
        }
    };

    presenter.restoreUserAreas = function () {
        $.each(presenter.tmpFilledAreas, function() {
            presenter.floodFill({
                    x: this.area.x,
                    y: this.area.y,
                    color: presenter.whiteRGBA
                },
                this.color,
                presenter.configuration.tolerance);

            presenter.allColoredPixels = [];
        });
    };

    presenter.fillAreaWithCorrectColor = function (area) {
        presenter.floodFill({
                x: area.x,
                y: area.y,
                color: presenter.whiteRGBA
            },
            [area.colorToFill[0], area.colorToFill[1], area.colorToFill[2], area.colorToFill[3]],
            presenter.configuration.tolerance);

        presenter.allColoredPixels = [];
    };

    presenter.getActivitiesCount = function () {
        if (presenter.configuration.showAllAnswersInGradualShowAnswersMode) {
            return 1;
        }
        return presenter.configuration.areas.length;
    };

    presenter.getRGBAStringFromRGBAArray = function(rgbaArray) {
        return rgbaArray.reduce((prev, curr) => (prev === "") ? curr : `${prev} ${curr}`, "");
    }

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

    function ColoringKeyboardController (elements, columnsCount) {
        KeyboardController.call(this, elements, columnsCount);
    }

    presenter.isDeactivationBlocked = function() {
        if (presenter.isTTSExitBlocked) {
            presenter.isTTSExitBlocked = false;
            return true;
        }
        return false;
    };

    ColoringKeyboardController.prototype = Object.create(window.KeyboardController.prototype);
    ColoringKeyboardController.prototype.isColorSelectActive = false;
    ColoringKeyboardController.prototype.lastAreaElement = null;
    ColoringKeyboardController.prototype.colorElementsMap = {};
    ColoringKeyboardController.prototype.lastAreaElementIndex = null;
    ColoringKeyboardController.prototype.constructor = ColoringKeyboardController;


    presenter.buildKeyboardController = function AddonColoring_buildKeyboardController () {
        const elements = presenter.getElementsForKeyboardNavigation();
        presenter.keyboardControllerObject = new ColoringKeyboardController(elements, 1);
    };

    presenter.keyboardController = function AddonColoring_keyboardController (keycode, isShiftKeyDown, event) {
        if (presenter.shouldIgnoreKeyNav()) {
            const enterKeycode = 13;
            if (keycode === enterKeycode) presenter.keyboardControllerObject.escape(event);
            event.preventDefault();
            return;
        }
        presenter.keyboardControllerObject.handle(keycode, isShiftKeyDown, event);
    };

    presenter.shouldIgnoreKeyNav = function () {
        return !presenter.configuration.colors?.length && !presenter.isTTS();
    }

    presenter.getElementsForKeyboardNavigation = function () {
        return presenter.configuration.areas ? presenter.configuration.areas : [];
    };

    presenter.getAvailableColorsForKeyboardNavigation = function() {
        return presenter.configuration.colors;
    };

    ColoringKeyboardController.prototype.mark = function (element) {
        if (!this.isColorSelectActive) return;
        const $colorElement = this.colorElementsMap[this.keyboardNavigationCurrentElement.speechText];
        if ($colorElement) {
            $colorElement.addClass('keyboard_navigation_active_element');
        }
    };
    ColoringKeyboardController.prototype.unmark = function (element) {
        if (!this.isColorSelectActive) return;
        const $colorElement = this.colorElementsMap[this.keyboardNavigationCurrentElement.speechText];
        if ($colorElement) {
            $colorElement.removeClass('keyboard_navigation_active_element');
        }
    };

    ColoringKeyboardController.prototype.nextRow = function (event) {
        this.nextElement(event);
    }

    ColoringKeyboardController.prototype.previousRow = function (event) {
        this.previousElement(event);
    }

    ColoringKeyboardController.prototype.nextElement = function (event) {
        if (event) event.preventDefault();
        if (this.keyboardNavigationCurrentElementIndex === this.keyboardNavigationElements.length - 1) {
            this.readCurrentElement();
        } else {
            this.switchElement(1);
        }
    }

    ColoringKeyboardController.prototype.previousElement = function (event) {
        if (event) event.preventDefault();
        if (this.keyboardNavigationCurrentElementIndex === 0) {
            this.readCurrentElement();
        } else {
            this.switchElement(-1);
        }
    }

    ColoringKeyboardController.prototype.switchElement = function (move) {
        KeyboardController.prototype.switchElement.call(this, move);
        if (this.isColorSelectActive) {
            this.adjustScroll(move);
        } else {
            presenter.markAreaWithCircle(this.keyboardNavigationCurrentElement);
        }
        this.readCurrentElement();
    };

    ColoringKeyboardController.prototype.adjustScroll = function (move) {
        let currentElement = this.colorElementsMap[this.keyboardNavigationCurrentElement.speechText][0];
        let parentElement = currentElement.parentElement;

        if (!isScrollbarVisible(parentElement)) {
            return;
        }

        if (move < 0) {
            parentElement.scrollTo(0, currentElement.offsetTop);
        } else {
            let currentElementOffsetBottom = currentElement.offsetTop + currentElement.offsetHeight;
            if (currentElementOffsetBottom > parentElement.offsetHeight) {
                parentElement.scrollTo(0, currentElementOffsetBottom - parentElement.offsetHeight);
            } else {
                parentElement.scrollTo(0, 0);
            }
        }
    }

    function isScrollbarVisible(element) {
        return element.scrollHeight > element.clientHeight;
    }

    ColoringKeyboardController.prototype.enter = function (event) {
        if (presenter.isFirstEnter) {
            this.setElements.call(this, presenter.getElementsForKeyboardNavigation());
            presenter.isFirstEnter = false;
        }
        KeyboardController.prototype.enter.call(this, event);
        if (!this.isColorSelectActive) {
            presenter.markAreaWithCircle(this.keyboardNavigationCurrentElement);
        }
        this.readCurrentElement();
    };

    ColoringKeyboardController.prototype.select = function (event) {
        if (event) event.preventDefault();
        if (!this.isSelectEnabled) return;
        if (presenter.isShowAnswersActive) return;
        if (presenter.isShowErrorsModeActive) return;
        if (!presenter.configuration.colors?.length) return;

        if (this.isColorSelectActive) {
            presenter.removeColorList();
            this.colorAreaWithSelectedColor();
            this.readSelectedColor();
            this.switchElementsToAreas();
            presenter.isColored = true;
        } else {
            this.switchElementsToColors();
            this.readCurrentElement();
        }
    };

    presenter.markAreaWithCircle = function ({ x, y }) {
        presenter.removeAreaMark();
        const $mark = $("<span></span>");
        $mark.addClass("coloring-circle-mark");
        $mark.css({
            'top' : y + 20,
            'left' : x + 20,
        });
        const coloringWrapper = presenter.$view.find('.coloring-wrapper');
        coloringWrapper.append($mark);
        presenter.$areaMark = $mark;
    }

    presenter.removeAreaMark = function () {
        if (presenter.$areaMark) {
            presenter.$areaMark.remove();
        }
    }

    presenter.removeColorList = function () {
      if (presenter.$colorList) {
          presenter.$colorList.remove();
      }
    }

    ColoringKeyboardController.prototype.colorAreaWithSelectedColor = function () {
            const previousColor = presenter.configuration.currentFillingColor;
            const colorString = presenter.getRGBAStringFromRGBAArray(this.keyboardNavigationCurrentElement.colorRGBA);
            presenter.setColor(colorString);
            presenter.floodFill({
                    x: this.lastAreaElement.x,
                    y: this.lastAreaElement.y,
                    color: presenter.getColorAtPoint(this.lastAreaElement.x, this.lastAreaElement.y)
                },
                this.keyboardNavigationCurrentElement.colorRGBA,
                presenter.configuration.tolerance
            );
            presenter.configuration.currentFillingColor = previousColor;
            this.sendColoredEvent(colorString);
    }

    ColoringKeyboardController.prototype.sendColoredEvent = function (colorString) {
            const isColorWhite = colorString === presenter.getRGBAStringFromRGBAArray(presenter.whiteRGBA);
            setTimeout(() =>{
                // Without timeout there are issues on Firefox if event handling takes too long
                presenter.sendEvent(
                    [this.lastAreaElement.x, this.lastAreaElement.y],
                    isColorWhite ? 0 : 1,
                    isCorrect(this.lastAreaElement) ? 1 : 0
                );
            }, 0);
    }

    ColoringKeyboardController.prototype.switchElementsToAreas = function () {
        this.isColorSelectActive = false;
        this.setElements(presenter.getElementsForKeyboardNavigation());
        KeyboardController.prototype.switchElement.call(this, this.lastAreaElementIndex);
    }

    ColoringKeyboardController.prototype.createColorListForKeyNav = function () {
        const $colorList = $("<span></span>");
        $colorList.addClass("coloring-color-list");
        $colorList.css({
            'top': this.lastAreaElement.y,
            'left': this.lastAreaElement.x,
        });
        this.populateColorListWithColors($colorList);
        const coloringWrapper = presenter.$view.find('.coloring-wrapper');
        coloringWrapper.append($colorList);
        presenter.$colorList = $colorList;
    }

    ColoringKeyboardController.prototype.populateColorListWithColors = function ($colorList) {
        const colors = presenter.configuration.colors;

        colors.forEach(color => {
            const $color = $("<div></div>");
            $color.addClass("coloring-color-list-element");
            $color.text(color.speechText);
            $colorList.append($color);
            this.colorElementsMap[color.speechText] = $color;
        });
    }

    ColoringKeyboardController.prototype.switchElementsToColors = function () {
        this.isColorSelectActive = true;
        this.lastAreaElement = this.keyboardNavigationCurrentElement;
        this.lastAreaElementIndex = this.keyboardNavigationCurrentElementIndex;
        this.createColorListForKeyNav();
        const colors = presenter.getAvailableColorsForKeyboardNavigation();
        this.setElements(colors);
    }

    ColoringKeyboardController.prototype.readCurrentElement = function () {
        const text = this.keyboardNavigationCurrentElement.speechText;
        const textWithPrefix = this.isColorSelectActive ? getColorTTS(text) : this.getAreaTTS(text);

        presenter.speak(textWithPrefix);
    };

    ColoringKeyboardController.prototype.readSelectedColor = function () {
        const textVoiceObject = [];

        const color = this.keyboardNavigationCurrentElement.speechText;

        pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, presenter.speechTexts.selected);
        pushMessageToTextVoiceObjectWithLanguageFromPresenter(textVoiceObject, color);

        presenter.speak(textVoiceObject);
    };

    ColoringKeyboardController.prototype.escape = function (event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        if (this.isColorSelectActive) {
            presenter.isTTSExitBlocked = true;
            this.switchElementsToAreas();
            presenter.removeColorList();
            this.readCurrentElement();
        } else {
            this.exitWCAGMode();
        }
    };

    ColoringKeyboardController.prototype.exitWCAGMode = function () {
        presenter.removeAreaMark();
        presenter.removeColorList();
        this.isColorSelectActive = false;
        presenter.isFirstEnter = true;
        this.setElements.call(this, presenter.getElementsForKeyboardNavigation());
        KeyboardController.prototype.exitWCAGMode.call(this);
        presenter.setWCAGStatus(false);
    };

    function getColorTTS(colorText) {
        const textVoiceObject = [];

        const colorPrefix = presenter.speechTexts.color;
        pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, colorPrefix);

        pushMessageToTextVoiceObjectWithLanguageFromPresenter(textVoiceObject, colorText);

        return textVoiceObject;
    }

    ColoringKeyboardController.prototype.getAreaTTS = function(areaText) {
        const textVoiceObject = [];

        const areaPrefix = presenter.speechTexts.area;
        pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, areaPrefix);

        pushMessageToTextVoiceObjectWithLanguageFromPresenter(textVoiceObject, areaText);

        const colorText = this.getCurrentAreaColorSpeechText();
        if (colorText) {
            if (colorText !== presenter.transparentAreaTTS) {
                pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, presenter.speechTexts.color);
                pushMessageToTextVoiceObjectWithLanguageFromPresenter(textVoiceObject, colorText);
            }

            if (presenter.isShowErrorsModeActive) {
                if (isCorrect(this.keyboardNavigationCurrentElement)) {
                    pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, presenter.speechTexts.correct);
                } else {
                    pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, presenter.speechTexts.incorrect);
                }
            }
        }

        return textVoiceObject;
    }

    ColoringKeyboardController.prototype.getCurrentAreaColorSpeechText = function () {
        const colorArray = presenter.getColorAtPoint(
            this.keyboardNavigationCurrentElement.x,
            this.keyboardNavigationCurrentElement.y
        );
        const colorString = presenter.getRGBAStringFromRGBAArray(colorArray);
        const isAreaTransparent = this.keyboardNavigationCurrentElement.type === presenter.AREA_TYPE.TRANSPARENT &&
            presenter.isColorSimilar(colorArray, presenter.whiteRGBA, 2)

        if (presenter.configuration.markTransparentAreas && presenter.isAttempted() && isAreaTransparent) {
            return presenter.transparentAreaTTS;
        }

        return presenter.colorSpeechTextMap[colorString];
    }

    presenter.isColorSimilar = function (currentArea, defaultArea, tolerance = 0) {
        if (currentArea.length !== defaultArea.length) {
            return false;
        }

        const differences = [];
        currentArea.forEach((colorValue, index) => {
            differences.push(Math.abs(colorValue - defaultArea[index]));
        })

        return differences.every(differ => differ <= tolerance);
    }

    function pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, message) {
        textVoiceObject.push(window.TTSUtils.getTextVoiceObject(message));
    }

    function pushMessageToTextVoiceObjectWithLanguageFromPresenter(textVoiceObject, message) {
        textVoiceObject.push(window.TTSUtils.getTextVoiceObject(message, presenter.configuration.langTag));
    }

    presenter.setWCAGStatus = function(isWCAGOn) {
        presenter.isWCAGOn = isWCAGOn;
    };

    presenter.speak = function(text) {
        const tts = presenter.getTextToSpeechOrNull(presenter.playerController);
        if (tts && presenter.isWCAGOn) {
            tts.speak(text);
        }
    };

    presenter.isTTS = function () {
        return presenter.getTextToSpeechOrNull(presenter.playerController) && presenter.isWCAGOn;
    };

    presenter.getTextToSpeechOrNull = function Coloring_getTextToSpeechOrNull(playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    return presenter;
}

AddonColoring_create.__supported_player_options__ = {
    resetInterfaceVersion: 2
};
