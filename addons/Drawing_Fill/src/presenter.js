function AddonDrawing_Fill_create(){

    var presenter = function(){};

    presenter.createPreview = function(view, model){
        presenter.configuration = presenter.validateModel(model);

        if (presenter.configuration.isError) {
            DOMOperationsUtils.showErrorMessage($(view), presenter.errorCodes, presenter.configuration.errorCode);
        }
    };

    presenter.run = function(view, model){
        presenter.configuration = presenter.validateModel(model);

        if (presenter.configuration.isError) {
            DOMOperationsUtils.showErrorMessage($(view), presenter.errorCodes, presenter.configuration.errorCode);
        }

        presenter.$view = $(view);

        var imageElement = $('<img>');
        imageElement.attr('src', presenter.configuration.imageFile);

        var canvasElement = $('<canvas></canvas>'),
            ctx = canvasElement[0].getContext('2d');

        imageElement.load(function() {
            canvasElement.attr('width', imageElement[0].width);
            canvasElement.attr('height', imageElement[0].height);

            presenter.canvasWidth = imageElement[0].width;
            presenter.canvasHeight = imageElement[0].height;

            ctx.drawImage(imageElement[0], 0, 0);

            presenter.imageData = ctx.getImageData(0, 0, imageElement[0].width, imageElement[0].height);
            presenter.ctx = ctx;

            presenter.$view.html(canvasElement);

            presenter.canvasOffset = canvasElement.offset();

            canvasElement.on('click', function(e) {
                presenter.click = {
                    x: getMousePositionOnCanvas(e, 'x'),
                    y: getMousePositionOnCanvas(e, 'y')
                };

                presenter.click.color = getClickedAreaColor();

                if ( presenter.compareColors(presenter.click.color, presenter.configuration.colorToBeFilled) ) {
                    // script available in ../tools/canvasfloodfill.js
                    floodfill(presenter.click.x, presenter.click.y, presenter.configuration.colorToFill, ctx, presenter.canvasWidth, presenter.canvasHeight, presenter.configuration.tolerance);
                }
            });

            canvasElement.on('mousemove', function(e) {
                //console.log(getMousePositionOnCanvas(e, 'x'), getMousePositionOnCanvas(e, 'y'))
            });
        });
    };

    presenter.compareColors = function(color1, color2) {
        var compared = true;
        $.each(color1, function(i, color) {
            if (Math.abs(color - color2[i]) > presenter.configuration.tolerance) {
                compared = false;
                return;
            }
        });

        return compared;
    };

    function log(message) {
        console.log(message);
    }

    function getClickedAreaColor() {
        return presenter.ctx.getImageData(presenter.click.x, presenter.click.y, 1, 1).data;
    }

    function getMousePositionOnCanvas(e, axis) {
        if (axis == 'x') {
            return parseInt(e.pageX - presenter.canvasOffset.left, 10)
        }

        if (axis == 'y') {
            return parseInt(e.pageY - presenter.canvasOffset.top, 10)
        }
    }

    presenter.errorCodes = {
        'E01' : 'Wrong color notation. Must be in "r g b a" format. See documentation for more details.',
        'E02' : 'All color values must be between 0 - 255.'
    };

    presenter.validateModel = function(model) {
        var validatedColorToFill = presenter.convertColor(model['ColorToFill']);
        if (validatedColorToFill.isError) {
            return {
                isError: true,
                errorCode: validatedColorToFill.errorCode
            }
        }

        var validatedColorToBeFilled = presenter.convertColor(model['ColorToBeFilled']);
        if (validatedColorToBeFilled.isError) {
            return {
                isError: true,
                errorCode: validatedColorToBeFilled.errorCode
            }
        }

        var validatedTolerance = ModelValidationUtils.validateIntegerInRange(model['Tolerance'], 255, 0);
        if (validatedTolerance.isError) {
            return {
                isError: true,
                errorCode: validatedTolerance.errorCode
            }
        }

        return {
            'isError' : false,
            'imageFile' : model.Image,
            'colorToBeFilled' : validatedColorToBeFilled.color,
            'colorToFill' : validatedColorToFill.color,
            'tolerance' : validatedTolerance.value
        }
    };

    presenter.convertColor = function(spaceSeparatedColor) {
        var splitted = spaceSeparatedColor.split(' '),
            validatedColors = [];

        if (splitted.length < 3) {
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
            color: validatedColors,
            isError: false
        };
    };

    presenter.setShowErrorsMode = function(){
    };

    presenter.setWorkMode = function(){
    };

    presenter.reset = function(){
    };

    presenter.getErrorCount = function(){
    };

    presenter.getMaxScore = function(){
    };

    presenter.getScore = function(){
    };

    presenter.getState = function(){
    };

    presenter.setState = function(state){
    };

    return presenter;
}