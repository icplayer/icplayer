function AddonLearnPen_Report_create() {

    // utilities functions
    function getCorrectObject(val) { return { isValid: true, value: val } }

    function getErrorObject(ec) { return { isValid: false, errorCode: ec } }

    function isInteger(n) { return n % 1 === 0; }

    function round(n, precision) { return Math.round(n * Math.pow(10, precision)) / Math.pow(10, precision); }

    function getLastElements (array, num) {
        num = num || 1;

        if (array.length < num) {
            return this;
        }

        return this.slice(array.length - num);
    }

    function shouldGetDataFromSensors (){
        for (var addon in presenter.addons) {
            if(presenter.addons[addon] == true){
                return true;
            }
        }

        return false;
    }

    function getColorFromStatus(status) {
        switch (status) {
            case  1: return presenter.configuration.colors.above;
            case  0: return presenter.configuration.colors.correct;
            case -1: return presenter.configuration.colors.below;
        }

        return "black";
    }

    function half(v) { return parseInt(v / 2, 10); }

    function hookToDrawingAreas(addon) {
        var $addon = $('.' + addon);

        $addon.find('canvas').on('mousedown touchstart', function (){
            presenter.addons[addon] = true;
        });

        $addon.find('canvas').on('mouseup mouseleave touchend', function (){
            presenter.addons[addon] = false;
        });
    }

    var presenter = function() {};
    
    presenter.addons = {
        "addon_Drawing": false,
        "addon_Shape_Tracing": false,
        "addon_LearnPen": false
    };

    presenter.data = {
        $canvas: null,
        context: null,
        $img: null,

        sensorData: {
            below: 0,
            correct: 0,
            above: 0
        },

        sensorsDataHistory: [],

        isPreview: false,
        isIntervalOn: false,
        intervalId: null,
        isPaused: false
    };

    presenter.SENSOR = {
        'All': 'ALL',
        'Squeeze': 'SQUEEZE',
        'Pressure': 'PRESSURE',
        'Squeeze A': 'SQUEEZEA',
        'Squeeze B': 'SQUEEZEB',
        'Squeeze C': 'SQUEEZEC',
        DEFAULT: 'All'
    };
    // {Pie chart, Circle in circle, Four circles}
    presenter.GRAPH = {
        'Pie chart': 'PIE',
        'Circle in circle': 'CINC',
        'Four circles': '4CIRCLES',
        'Horizontal Bar': 'BAR',
        DEFAULT: 'Pie chart'
    };

    presenter.filteredDataCount = 0;

    presenter.ERROR_CODES = {
        R01: "Number of arguments in Correct range is different then 2",
        R02: "All values in Correct range has to be numeric",
        R03: "All values in Correct range has to be between 0 and 100",
        R04: "Second argument in Correct range hast to be bigger then the first",

        C01: "Number of argument is property Colors is different then 3",

        I01: "Property Data update interval has to be numeric",
        I02: "Value of property Data update interval has to be between 50 and 2000 ms",

        G01: "You cannot set sensor different then All and graph Circle in Circle or Four circles",

        CALC01: "Property Calculate from last values has to be integer",
        CALC02: "Property Calculate from last values has to be positive value"
    };

    function toPercent(val) { return parseInt(val / 1024 * 100); }
    
    function isDataNotNoise(element, index, array) {
        return element >= 200;
    }


    function getCurrentDataFromSensor() {
        if(window.LearnPen) {
            var a = window.LearnPen.getA();
            var b = window.LearnPen.getB();
            var c = window.LearnPen.getC();
            var p = window.LearnPen.getP();
            var isValid = [a, b, c].some(isDataNotNoise);
            
            if(!isValid) {
                isValid = (p >= 200);
            }

            return {
                isValid: isValid,
                a: toPercent(a),
                b: toPercent(b),
                c: toPercent(c),
                p: toPercent(p)
            };
        } else {
            return {
                isValid: false,
                a: 0,
                b: 0,
                c: 0,
                p: 0

//                isValid: true,
//                a: toPercent(Math.floor(Math.random() * 1000)),
//                b: toPercent(Math.floor(Math.random() * 1000)),
//                c: toPercent(Math.floor(Math.random() * 1000)),
//                p: toPercent(Math.floor(Math.random() * 1000))
            };            
        }
    }

    function getSensorHistory(historyArray, sensorsArray) {
        var noise = toPercent(200);

        function filterNoise(element) {
            return this.some(function (variable) {
               return element[variable] > noise;
            }, this);
        }

        return historyArray.filter(filterNoise, sensorsArray);
    }

    function getValues() {
        var returnedData;
        if (presenter.configuration.calculateFromLastValues === 0) {
            returnedData = getSensorHistory(presenter.data.sensorsDataHistory, getSensorsConfiguration());
        } else {
            returnedData = getSensorHistory(getLastElements(presenter.data.sensorsDataHistory, getSensorsConfiguration(), presenter.configuration.calculateFromLastValues));
        }

        return returnedData;
    }

    function getSensorsConfiguration () {
        switch (presenter.configuration.sensor) {
            case presenter.SENSOR.All:
                return ['a', 'b', 'c', 'p'];
                break;
            case presenter.SENSOR.Pressure:
                return ['p'];
                break;
            case presenter.SENSOR.Squeeze:
                return ['a', 'b', 'c'];
                break;
            case presenter.SENSOR['Squeeze A']:
                return ['a'];
                break;
            case presenter.SENSOR['Squeeze B']:
                return ['b'];
                break;
            case presenter.SENSOR['Squeeze C']:
                return ['c'];
                break;
            default:
                return ['a', 'b', 'c', 'p'];
                break;
        }
    }

    function updateSensorDataHistory(data) {
        if (data.isValid) {
            presenter.filteredDataCount = 0;
            presenter.data.sensorsDataHistory.push(data);
        }

        if (presenter.configuration.calculateFromLastValues > 0) {
            if(!data.isValid) {
                if (presenter.filteredDataCount < presenter.configuration.calculateFromLastValues) {
                    presenter.filteredDataCount += 1;
                    presenter.data.sensorsDataHistory.push(data);
                }
            }
        }
    }

    function getStatus(v) {
        if (v > presenter.configuration.range.end) {
            return 1;
        } else if (v < presenter.configuration.range.start) {
            return -1;
        }

        return 0;
    }

    function updateResultDataFromSensorValue(value, result) {
        switch (getStatus(value)) {
            case  1: result.above++; break;
            case  0: result.correct++; break;
            case -1: result.below++; break;
        }
    }

    function prepareData() {
        var resultObject = {
            above: 0,
            correct: 0,
            below: 0,
            aStatus: 0,
            bStatus: 0,
            cStatus: 0,
            pStatus: 0
        };

        getValues().forEach(function(sensorDataObj, _, arr) {
            switch (presenter.configuration.sensor) {
                case presenter.SENSOR.All: updateResultDataFromSensorValue((sensorDataObj.a + sensorDataObj.b + sensorDataObj.c + sensorDataObj.p) / 4, resultObject); break;
                case presenter.SENSOR.Pressure: updateResultDataFromSensorValue(sensorDataObj.p, resultObject); break;
                case presenter.SENSOR.Squeeze: updateResultDataFromSensorValue((sensorDataObj.a + sensorDataObj.b + sensorDataObj.c) / 3, resultObject); break;
                case presenter.SENSOR['Squeeze A']: updateResultDataFromSensorValue(sensorDataObj.a, resultObject); break;
                case presenter.SENSOR['Squeeze B']: updateResultDataFromSensorValue(sensorDataObj.b, resultObject); break;
                case presenter.SENSOR['Squeeze C']: updateResultDataFromSensorValue(sensorDataObj.c, resultObject); break;
            }

            resultObject.aStatus += sensorDataObj.a / arr.length;
            resultObject.bStatus += sensorDataObj.b / arr.length;
            resultObject.cStatus += sensorDataObj.c / arr.length;
            resultObject.pStatus += sensorDataObj.p / arr.length;
        });

        resultObject.aStatus = getStatus(resultObject.aStatus);
        resultObject.bStatus = getStatus(resultObject.bStatus);
        resultObject.cStatus = getStatus(resultObject.cStatus);
        resultObject.pStatus = getStatus(resultObject.pStatus);

        return resultObject;
    }

    function validateRange(range) {
        if (ModelValidationUtils.isStringEmpty(range)) {
            return getCorrectObject({ start: 40, end: 80 });
        }

        var values = range.split(';');

        if (values.length !== 2) {
            return getErrorObject('R01');
        }

        for (var i=0; i<values.length; i++) {
            if (isInteger(values[i])) {
                values[i] = parseInt(values[i], 10);
            } else {
                return getErrorObject('R02');
            }

            if (0 > values[i] || values[i] > 100) {
                return getErrorObject('R03');
            }
        }

        if (values[0] >= values[1]) {
            return getErrorObject('R04');
        }

        return getCorrectObject({ start: values[0], end: values[1] });
    }

    function validateColors(colors) {
        if (ModelValidationUtils.isStringEmpty(colors)) {
            return getCorrectObject({ above: "red", correct: "green", below: "yellow" });
        }

        colors = colors.split(';');

        if (colors.length !== 3) {
            return getErrorObject('C01');
        }

        return getCorrectObject({ above: colors[0], correct: colors[1], below: colors[2] });
    }

    function validateInterval(interval) {
        if (ModelValidationUtils.isStringEmpty(interval)) {
            return getCorrectObject(100);
        }

        if (isInteger(interval)) {
            interval = parseInt(interval, 10);
        } else {
            return getErrorObject('I01');
        }

        if (interval < 0 || interval > 2000) {
            return getErrorObject('I02');
        }

        return getCorrectObject(interval);
    }

    function validateInteger(val) {
        if (ModelValidationUtils.isStringEmpty(val)) {
            return getCorrectObject(0);
        }

        if (isInteger(val)) {
            val = parseInt(val, 10);
        } else {
            return getErrorObject('CALC01');
        }

        if (val < 0) {
            return getErrorObject('CALC02');
        }

        return getCorrectObject(val);
    }

    presenter.validateModel = function(model) {
        var validatedRange = validateRange(model.correctRange);
        if (validatedRange.errorCode) {
            return validatedRange;
        }

        var graph = ModelValidationUtils.validateOption(presenter.GRAPH, model.graphType);
        var sensor = ModelValidationUtils.validateOption(presenter.SENSOR, model.sensor);

        if ((graph === presenter.GRAPH['Circle in circle'] || graph === presenter.GRAPH['Four circles']) && sensor !== presenter.SENSOR['All']) {
            return getErrorObject('G01');
        }

        var validatedColors = validateColors(model.colors);
        if (validatedColors.errorCode) {
            return validatedColors;
        }

        var validatedDataUpdateInterval = validateInterval(model.dataUpdateInterval);
        if (validatedDataUpdateInterval.errorCode) {
            return validatedDataUpdateInterval;
        }

        var validatedCalcFromLastValues = validateInteger(model.calculateFromLastValues);
        if (validatedCalcFromLastValues.errorCode) {
            return validatedCalcFromLastValues;
        }

        return {
            isValid: true,
            isVisible: ModelValidationUtils.validateBoolean(model["Is Visible"]),
            isVisibleByDefault: ModelValidationUtils.validateBoolean(model["Is Visible"]),
            ID: model.ID,
            width: parseInt(model.Width, 10),
            height: parseInt(model.Height, 10),

            isDisable: ModelValidationUtils.validateBoolean(model.isDisable),
            range: validatedRange.value,
            graphType: graph,
            sensor: sensor,
            colors: validatedColors.value,
            updateTime: validatedDataUpdateInterval.value,
            calculateFromLastValues: validatedCalcFromLastValues.value
        }
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();
        presenter.eventBus.addEventListener('PageLoaded', this);
    };

    presenter.onEventReceived = function (eventName) {
        if (eventName == "PageLoaded") {
            for (var addon in presenter.addons) {
                if (presenter.addons.hasOwnProperty(addon)) {
                    hookToDrawingAreas(addon);
                }
            }
        }
    };


    presenter.run = function(view, model) {
        presenter.view = view;
        presenterLogic(view, model, false);

        if (!presenter.configuration.isDisable) {
            presenter.record();
        }

        MutationObserverService.createDestroyObserver(presenter.configuration.ID, presenter.destroy, presenter.view);
        MutationObserverService.setObserver();
    };

    function presenterLogic(view, model, isPreview) {
        presenter.$view = $(view);

        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        presenter.setVisibility(presenter.configuration.isVisible || isPreview);

        presenter.data.$img = presenter.$view.find('img');
        presenter.data.$canvas = presenter.$view.find('canvas');
        presenter.data.context = presenter.data.$canvas[0].getContext('2d');

        presenter.data.$canvas[0].width = presenter.configuration.width;
        presenter.data.$canvas[0].height = presenter.configuration.height;

        presenter.data.isPreview = isPreview;
    }

    presenter.destroy = function (event) {
        if (event.target !== presenter.view) { return; }

        if (presenter.data.isIntervalOn) {
            clearInterval(presenter.data.intervalId);
            presenter.data.isIntervalOn = false;
        }
    };

    presenter.createPreview = function(view, model) {
        presenterLogic(view, model, true);

        if (presenter.configuration.isValid) {
            presenter.displayCurrentData();
        }
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    function getRotateCoordinates(x, y, rad) {
        // Subtract midpoints, so that midpoint is translated to origin and add it in the end again
        return {
            x: round(x * Math.cos(rad) - y * Math.sin(rad), 2),
            y: round(x * Math.sin(rad) + y * Math.cos(rad), 2)
        }
    }

    function generateHorizontalBar(above, correct, below) {
        function drawRec(ctx, x, y, w, h, color, percent) {
            if(percent > 0){
                ctx.beginPath();
                ctx.lineWidth="1";
                ctx.strokeStyle=color;
                ctx.rect(x, y, w, h);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.stroke();
            }
        }

        function drawText(ctx, x, y, text) {
            if(text > 0){
                ctx.font = "12px Calibri";
                ctx.textAlign = "center";
                ctx.fillStyle = "black";
                ctx.fillText(text + '%', x, y);
            }
        }

        var moduleHeight = presenter.configuration.height;

        var sum = above + correct + below;

        var text = [];
        text[0] = Math.round((below / sum) * 100);
        text[1] = Math.round((correct / sum) * 100);
        text[2] = Math.round(100 - (text[0] + text[1]));

        var widthA = Math.round(((text[0]/100)*presenter.configuration.width));
        var widthB = Math.round(((text[1]/100)*presenter.configuration.width));
        var widthC = Math.round(((text[2]/100)*presenter.configuration.width));
        var moduleWidth = widthA + widthB + widthC;

        var xA = 0;
        var xB = widthA;
        var xC = widthA + widthB;

        presenter.data.context.clearRect(0, 0, presenter.configuration.width, presenter.configuration.height);

        drawRec(presenter.data.context, xA, Math.round(moduleHeight/4), widthA, Math.round(moduleHeight/2), presenter.configuration.colors.below, text[0]);
        drawRec(presenter.data.context, xB, Math.round(moduleHeight/4), widthB, Math.round(moduleHeight/2), presenter.configuration.colors.correct, text[1]);
        drawRec(presenter.data.context, xC, Math.round(moduleHeight/4), widthC, Math.round(moduleHeight/2), presenter.configuration.colors.above, text[2]);

        var xTextA = xA + (widthA/2);
        var xTextB = xB + (widthB/2);
        var xTextC = xC + (widthC/2);

        if(text[0] > 0 && xTextA < 10){
            xTextA = 10;
        }
        if(text[2] > 0 && xTextC > (moduleWidth-11)){
            xTextC = moduleWidth-11;
        }
        if(text[0] == 0 && xTextB < 10){
            xTextB = 10;
        }
        if(text[2] == 0 && xTextB > (moduleWidth-10)){
            xTextB = moduleWidth-10;
        }
        if(text[0] > 0 && xTextB < (xTextA+19)){
            xTextB = xTextA+19;
        }else if(text[2] > 0 && xTextB > (xTextC-20)){
            xTextB = xTextC-20;
        }else{} // 10, 19, 20.. - width of text

        drawText(presenter.data.context, xTextA, Math.round(moduleHeight/4)-3, text[0]);
        drawText(presenter.data.context, xTextB, Math.round(moduleHeight/4)-3, text[1]);
        drawText(presenter.data.context, xTextC, Math.round(moduleHeight/4)-3, text[2]);
    }

    function generatePieChart(above, correct, below) {
        function drawArc(ctx, x, y, r, start, end, color) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.arc(x, y, r, start, end, false);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
        }

        function drawText(ctx, x, y, r, start, end, text) {
            var halfAngle = (end - start) / 2;
            var coordinates = getRotateCoordinates(r / 2, 0, halfAngle + start);

            ctx.font = "20px Calibri";
            ctx.textAlign = "center";
            ctx.fillStyle = "black";
            ctx.fillText(text + '%', coordinates.x + x, coordinates.y + y);
        }

        var sum = above + correct + below;
        var centerX = Math.floor(presenter.configuration.width / 2);
        var centerY = Math.floor(presenter.configuration.height / 2);
        var radius = Math.min(presenter.configuration.width, presenter.configuration.height) / 2;

        var sep = [];
        sep[0] = 0;
        sep[1] = (below / sum) * 2 * Math.PI;
        sep[2] = ((below + correct) / sum) * 2 * Math.PI;
        sep[3] = 2 * Math.PI;

        var text = [];
        text[0] = round((below / sum) * 100, 2);
        text[1] = round((correct / sum) * 100, 2);
        text[2] = round(100 - (text[0] + text[1]), 2);

        presenter.data.context.clearRect(0, 0, presenter.configuration.width, presenter.configuration.height);

        drawArc(presenter.data.context, centerX, centerY, radius, sep[0], sep[1], presenter.configuration.colors.above);
        drawArc(presenter.data.context, centerX, centerY, radius, sep[1], sep[2], presenter.configuration.colors.correct);
        drawArc(presenter.data.context, centerX, centerY, radius, sep[2], sep[3], presenter.configuration.colors.below);

        drawText(presenter.data.context, centerX, centerY, radius, sep[0], sep[1], text[0]);
        drawText(presenter.data.context, centerX, centerY, radius, sep[1], sep[2], text[1]);
        drawText(presenter.data.context, centerX, centerY, radius, sep[2], sep[3], text[2]);
    }

    function drawCircle(ctx, x, y, r, color) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }

    function generateFourCircles(aStatus, bStatus, cStatus, pStatus) {
        function getCircleData(_x, _y, _r, _c) { return { x: _x, y: _y, r: _r, color: _c }; }

        var min = Math.min(presenter.configuration.width, presenter.configuration.height);
        var smallRadius = parseInt(min / 8, 10);
        var bigRadius = parseInt(min / 3, 10);

        var offset = half(Math.abs(presenter.configuration.width - presenter.configuration.height));

        var a, b, c, p;

        var aColor = getColorFromStatus(aStatus);
        var bColor = getColorFromStatus(bStatus);
        var cColor = getColorFromStatus(cStatus);
        var pColor = getColorFromStatus(pStatus);

        if (presenter.configuration.height > presenter.configuration.width) {
            a = getCircleData(smallRadius, offset + smallRadius, smallRadius, aColor);
            b = getCircleData(min - smallRadius, offset + smallRadius, smallRadius, bColor);
            c = getCircleData(half(min), offset + min - smallRadius, smallRadius, cColor);
            p = getCircleData(half(min), offset + parseInt(min * 0.41, 10), bigRadius, pColor);
        } else {
            a = getCircleData(offset + smallRadius, smallRadius, smallRadius, aColor);
            b = getCircleData(offset + min - smallRadius, smallRadius, smallRadius, bColor);
            c = getCircleData(offset + half(min), min - smallRadius, smallRadius, cColor);
            p = getCircleData(offset + half(min), parseInt(min * 0.41, 10), bigRadius, pColor);
        }

        drawCircle(presenter.data.context, a.x, a.y, a.r, a.color);
        drawCircle(presenter.data.context, b.x, b.y, b.r, b.color);
        drawCircle(presenter.data.context, c.x, c.y, c.r, c.color);
        drawCircle(presenter.data.context, p.x, p.y, p.r, p.color);
    }

    function generateCircleInCircle(aStatus, bStatus, cStatus, pStatus) {
        var centerX = Math.floor(presenter.configuration.width / 2);
        var centerY = Math.floor(presenter.configuration.height / 2);

        var radiusOuter = Math.min(presenter.configuration.width, presenter.configuration.height) / 2;
        var radiusInner = parseInt(radiusOuter / 2, 10);

        var colorOuter = getColorFromStatus(Math.round((aStatus + bStatus + cStatus) / 3));
        var colorInner = getColorFromStatus(pStatus);

        drawCircle(presenter.data.context, centerX, centerY, radiusOuter, colorOuter);
        drawCircle(presenter.data.context, centerX, centerY, radiusInner, colorInner);
    }

    presenter.displayCurrentData = function() {
        var shouldUpdate = shouldGetDataFromSensors();
        if (shouldUpdate){
            var dataFromSensors = getCurrentDataFromSensor();
            updateSensorDataHistory(dataFromSensors);
        }

        var data = presenter.getData();
        presenter.displayData(data);
    };

    presenter.getData = function getData() {
        return presenter.data.isPreview ? {
            above: 1,
            correct: 1,
            below: 1,
            aStatus: 0,
            bStatus: 0,
            cStatus: 0,
            pStatus: 0
        } : prepareData();
    };

    presenter.displayData = function (data) {
        switch (presenter.configuration.graphType) {
            case presenter.GRAPH['Pie chart']: generatePieChart(data.above, data.correct, data.below); break;
            case presenter.GRAPH['Four circles']: generateFourCircles(data.aStatus, data.bStatus, data.cStatus, data.pStatus); break;
            case presenter.GRAPH['Circle in circle']: generateCircleInCircle(data.aStatus, data.bStatus, data.cStatus, data.pStatus); break;
            case presenter.GRAPH['Horizontal Bar']: generateHorizontalBar(data.above, data.correct, data.below); break;
            default: break;
        }

        // copy chart to img
        presenter.data.$img.attr("src", presenter.data.$canvas[0].toDataURL("image/png"));
    };

    presenter.reset = function() {
        var addon;
        presenter.data.sensorsDataHistory = [];
        presenter.displayData(presenter.getData());
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);

        for (addon in presenter.addons) {
            if (presenter.addons.hasOwnProperty(addon)) {
                hookToDrawingAreas(addon);
            }
        }
    };

    presenter.show = function() {
        presenter.setVisibility(true);
    };

    presenter.hide = function() {
        presenter.setVisibility(false);
    };

    presenter.record = function() {
        if (presenter.configuration.isDisable) { return false; }

        if (!presenter.data.isIntervalOn) {
            presenter.data.isIntervalOn = true;
            presenter.data.intervalId = setInterval(presenter.displayCurrentData, presenter.configuration.updateTime);
        }
    };

    presenter.pause = function() {
        if (presenter.configuration.isDisable) { return false; }

        if (presenter.data.isIntervalOn) {
            clearInterval(presenter.data.intervalId);
            presenter.data.isIntervalOn = false;
        }
    };

    presenter.stop = function() {
        if (presenter.configuration.isDisable) { return false; }

        if (presenter.data.isIntervalOn) {
            clearInterval(presenter.data.intervalId);
            presenter.data.isIntervalOn = false;
        }
        presenter.reset();
    };

    presenter.executeCommand = function(name, params) {
        if (!presenter.configuration.isValid) { return false; }

        Commands.dispatch({
            "reset": presenter.reset,
            "show": presenter.show,
            "hide": presenter.hide,
            "record": presenter.record,
            "stop": presenter.stop,
            "pause": presenter.pause
        }, name, params, presenter);
    };

    presenter.getState = function() {
        presenter.pause();

        return JSON.stringify({
            sensorData: presenter.data.sensorData,
            isVisible: presenter.configuration.isVisible
        });
    };

    presenter.setState = function(state) {
        if (ModelValidationUtils.isStringEmpty(state)) { return; }

        var parsedState = JSON.parse(state);

        presenter.data.sensorData = parsedState.sensorData;
        presenter.configuration.isVisible = parsedState.isVisible;

        presenter.record();
    };

    presenter.setShowErrorsMode = function() {
        presenter.pause();
    };

    presenter.setWorkMode = function() {
        presenter.record();
    };

    return presenter;
}