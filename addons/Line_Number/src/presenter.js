function AddonLine_Number_create() {
    var presenter = function () {};

    presenter.configuration = {};

    presenter.errorCodes = {
        'MIN01' : 'Min value cannot be empty.',
        'MIN02' : 'Min value must be a number.',
        'MAX01' : 'Max value cannot be empty.',
        'MAX02' : 'Max value must be a number',
        'MIN/MAX01' : 'Min value cannot be lower than Max value.',
        'RAN01' : 'One or more ranges are invalid.',
        'STEP01' : 'The value in Step property is invalid.',
        'VAL01' : 'One or more X axis values are invalid.'
    };

    presenter.run = function(view, model) {
        presenter.$view = $(view);
        presenter.$view.disableSelection();

        presenter.configuration = presenter.readConfiguration(model);

        if (presenter.configuration.isError) {
            return DOMOperationsUtils.showErrorMessage(presenter.$view, presenter.errorCodes, presenter.configuration.errorCode)
        }

        presenter.createSteps();
    };

    function calculateStepWidth(xAxisValues) {
        var xAxisWidth = presenter.$view.find('#x-axis').width() - 1;

        return xAxisWidth / (xAxisValues.length - 1);
    }

    function getXAxisValues() {
        var configuration = presenter.configuration;
        var xAxisValues = [];

        for (var i = configuration.min; i <= configuration.max; i += configuration.step) {
            xAxisValues.push(i);
        }
        return xAxisValues;
    }

    function createClickArea(element, value) {
        var clickArea = $('<div></div>');
        var selectedRange = $('<div></div>');

        selectedRange.addClass('selectedRange');
        clickArea.addClass('clickArea');

        $(element).append(clickArea);
        clickArea.attr('value', value);

        clickArea.on('mousedown', function (){
            presenter.configuration.mouseData.isMouseDown = true;
            if ( !presenter.configuration.isRangeAlreadyDrawn ) {
                selectedRange.addClass('current');
                element.append(selectedRange);
            }
        });

        clickArea.on('mouseup', function (e){
            drawRange(e);
            addEndRangeImages(e);
            presenter.$view.find('.current').removeClass('current');
            presenter.configuration.mouseData.isMouseDown = false;
            presenter.configuration.isRangeAlreadyDrawn = true;
        });

        clickArea.on('mouseenter', function(e) {
            if(presenter.configuration.mouseData.isMouseDown) {
                drawRange(e);
            }
        });

        presenter.$view.on('mouseup', function (e){
            presenter.$view.find('.current').removeClass('current');
            presenter.configuration.mouseData.isMouseDown = false;
        });

        clickArea.css({
            'width' :  presenter.configuration.stepWidth
        });

        moveYAxisClickArea();
    }

    function drawRange(e) {
        if (presenter.configuration.isRangeAlreadyDrawn) return;

        var endElement = $(e.target).parent();
        var startElement = presenter.$view.find('.current').parent();
        var start = parseFloat(startElement.css('left'));
        var end = parseFloat(endElement.css('left'));
        var difference = Math.abs(start - end);
        var currentSelectedRange = presenter.$view.find('.current');
        currentSelectedRange.css('width', difference + 2 + 'px');

        if (start > end) {
            currentSelectedRange.css('left', - (difference) + 'px');
        }

    }

    function addEndRangeImages(e) {
        if (presenter.configuration.isRangeAlreadyDrawn) return;

        var endElement = $(e.target).parent();
        var startElement = presenter.$view.find('.current').parent();
        var imageContainer = $('<div></div>');
        imageContainer.addClass('rangeImage');
        imageContainer.addClass('include');

        startElement.append(imageContainer.clone(true));
        endElement.append(imageContainer);
    }

    presenter.createSteps = function () {
        var xAxisValues = getXAxisValues();
        presenter.configuration.stepWidth = calculateStepWidth(xAxisValues);
        var isDrawOnlyChosen = presenter.configuration.axisXValues.length > 0;

        for (var i = 0; i < xAxisValues.length; i++) {
            var stepLine = $('<div></div>');
            stepLine.addClass('stepLine');

            if (xAxisValues[i] == 0) {
                var innerHeight = presenter.$view.find('#inner').height();
                var yAxis = presenter.$view.find('#y-axis');
                var xAxis = presenter.$view.find('#x-axis');

                yAxis.height(innerHeight);
                yAxis.css({
                    'top' : - (innerHeight / 2),
                    'left' : presenter.configuration.stepWidth * i
                });
                xAxis.append(yAxis);
            } else {
                var text = $('<div></div>');
                text.addClass('stepText');
                text.html(xAxisValues[i]);
                text.css('left', - new String(xAxisValues[i]).length * (4) + 'px');


                if (isDrawOnlyChosen && presenter.configuration.showAxisXValues) {
                    if ($.inArray(xAxisValues[i], presenter.configuration.axisXValues) !== -1) {
                        stepLine.append(text);
                    }
                } else if (presenter.configuration.showAxisXValues) {
                    stepLine.append(text);
                }

            }

            stepLine.css('left', presenter.configuration.stepWidth * i);
            createClickArea(stepLine, xAxisValues[i]);
            presenter.$view.find('#x-axis').append(stepLine);
        }
    };

    function moveYAxisClickArea() {
        var yAxisClickArea = $('#y-axis .clickArea');
        yAxisClickArea.css('top', ($('#y-axis').height() / 2) - 50 + 'px');
    }

    function checkIsMinLowerThanMax(min, max) {
        var parsedMin = parseInt(min, 10);
        var parsedMax = parseInt(max, 10);
        return parsedMin < parsedMax;
    }

    presenter.readConfiguration = function(model) {
        var isMinEmpty = ModelValidationUtils.isStringEmpty(model['Min']);

        if(isMinEmpty) {
            return {
                'isError' : true,
                'errorCode' : 'MIN01'
            }
        }

        var isMaxEmpty = ModelValidationUtils.isStringEmpty(model['Max']);

        if(isMaxEmpty) {
            return {
                'isError' : true,
                'errorCode' : 'MAX01'
            }
        }

        var isMinLowerThanMax = checkIsMinLowerThanMax(model['Min'], model['Max']);

        if(!isMinLowerThanMax) {
            return {
                'isError' : true,
                'errorCode' : 'MIN/MAX01'
            }
        }

        var validatedMin = ModelValidationUtils.validateInteger(model['Min']);
        var validatedMax = ModelValidationUtils.validateInteger(model['Max']);
        var min, max;

        if(validatedMin.isValid) {
            min = validatedMin.value;
        } else {
            return {
                'isError' : true,
                'errorCode' : 'MIN02'
            }
        }

        if(validatedMax.isValid) {
            max = validatedMax.value;
        } else {
            return {
                'isError' : true,
                'errorCode' : 'MAX02'
            }
        }

//        var rangesList = Helpers.splitLines(model['Ranges']);
        var rangesList = model['Ranges'].split(/[\n\r]+/);
        var rangesPattern = /(\(|<){1}[(?P \d)]+,[(?P \d)]+(\)|>){1},[ ]*(0|1){1}/i; // matches i.e. (1, 0), 0 or <2, 15), 1
        var validatedRanges = [];

        $.each(rangesList, function() {

            if(!rangesPattern.test(this)) {
                return {
                    'isError' : true,
                    'errorCode' : 'RAN01'
                }
            }

            var regexResult = rangesPattern.exec(this)[0];
            var onlyNumbersAndCommas = regexResult.replace(/[ \(\)<>]*/g, '');
            var onlyNumbers = onlyNumbersAndCommas.split(',');
            var min = onlyNumbers[0];
            var max = onlyNumbers[1];
            var shouldDrawRange = onlyNumbers[2] == '1';

            if(!checkIsMinLowerThanMax(min, max)) {
                return {
                    'isError' : true,
                    'errorCode' : 'MIN/MAX01'
                }
            }

            var validatedRange = {
                min: parseInt(min, 10),
                max: parseInt(max, 10),
                shouldDrawRange: shouldDrawRange
            };

            validatedRanges.push(validatedRange);
        });

        var validatedIsActivity = ModelValidationUtils.validateBoolean(model['Is Activity']);

        var validatedStep;

        if (model['Step'] == '') {
            validatedStep = 1;
        } else {
            validatedStep = ModelValidationUtils.validateIntegerInRange(model['Step'], 50, 1);

            if (!validatedStep.isValid) {
                return {
                    'isError' : true,
                    'errorCode' : 'STEP01'
                }
            }
        }

        var validatedAxisXValues = [];

        if (model['Axis X Values'] !== '') {
            var splittedValues = model['Axis X Values'].split(',');
            for (var i = 0; i < splittedValues.length; i++) {
                var value = splittedValues[i].replace(' ', '');
                var validatedValue = ModelValidationUtils.validateIntegerInRange(value, max, min);

                if (!validatedValue.isValid) {
                    return {
                        'isError' : true,
                        'errorCode' : 'VAL01'
                    }
                }

                validatedAxisXValues.push(validatedValue.value);
            }
        }

        var validatedShowAxisXValues = ModelValidationUtils.validateBoolean(model['Show Axis X Values']);

        return {
            'isError' : false,
            'min' : min,
            'max' : max,
            'ranges' : validatedRanges,
            'isActivity' : validatedIsActivity,
            'step' : validatedStep.value,
            'showAxisXValues' : validatedShowAxisXValues,
            'axisXValues' : validatedAxisXValues,
            'mouseData' : { 'isMouseDown' : false },
            'isRangeAlreadyDrawn' : false
        }
    };

    return presenter;
}       