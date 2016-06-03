function AddonLearnPen_create() {
    var presenter = function() {};

    // work-around for double line in android browser
    function setOverflowWorkAround(turnOn) {

        if (!MobileUtils.isAndroidWebBrowser(window.navigator.userAgent)) { return false; }

        var android_ver = MobileUtils.getAndroidVersion(window.navigator.userAgent);
        if (["4.1.1", "4.1.2", "4.2.2", "4.3"].indexOf(android_ver) !== -1) {

            presenter.$view.parents("*").each(function() {
                var overflow = null;
                if (turnOn) {
                    $(this).attr("data-overflow", $(this).css("overflow"));
                    $(this).css("overflow", "visible");
                } else {
                    overflow = $(this).attr("data-overflow");
                    if (overflow !== "") {
                        $(this)[0].removeAttribute("data-overflow");
                        $(this).css("overflow", overflow);
                    }
                }
            });

        }

        return true;
    }

    // constant values
    var val = {
        maxThickness: 40,
        defaultThickness: 15,
        defaultColor: "rgba(0, 0, 0, 0)",
        sensors: ["SQUEEZE_A", "SQUEEZE_B", "SQUEEZE_C", "SQUEEZE_SUM", "SQUEEZE_MAX", "PRESSURE", "ALL"]
    };

    presenter.position = {
        pre_x: 0,
        pre_y: 0,
        x: 0,
        y: 0
    };

    presenter.drawingData = {
        isDrawingOn: true,
        pre_color: val.defaultColor,
        color: val.defaultColor,
        thickness: val.defaultThickness
    };

    presenter.data = {
        canvas: null,
        context: null,

        isStarted: false,
        isPencil: true,
        color: val.defaultColor,
        zoom: 1,
        lineCounter: 0,
        allPoints: [],
        pencilThickness: 0,
        eraserThickness: 0
    };

    var eventBus;

    function updateZoomMultiplier() {
        var zoom = $('#_icplayer').css('zoom');
        if (zoom === '' || zoom === undefined || zoom === "normal") {
            zoom = 1;
        }
        presenter.data.zoom = parseInt(zoom, 10);
    }

    presenter.hexToRGBA = function(hex, opacity) {
        var r = parseInt(hex.substring(1,3), 16),
            g = parseInt(hex.substring(3,5), 16),
            b = parseInt(hex.substring(5,7), 16);

        return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
    };

    presenter.colourNameToHex = function(color) {
        var colors = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff","beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887","cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff","darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f","darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1","darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff","firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff","gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f","honeydew":"#f0fff0","hotpink":"#ff69b4","indianred ":"#cd5c5c","indigo ":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c","lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2","lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de","lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6","magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee","mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5","navajowhite":"#ffdead","navy":"#000080","oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6","palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1","saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4","tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0","violet":"#ee82ee","wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5","yellow":"#ffff00","yellowgreen":"#9acd32"};

        if (typeof colors[color.toLowerCase()] !== 'undefined') {
            return colors[color.toLowerCase()];
        }
        return false;
    };

    function eventCreator(a, b, c, p) {
        function sendSensorEvent(eventData, smartPenValue) {
            if (eventData.reactionScope[0] <= smartPenValue && smartPenValue <= eventData.reactionScope[1]) {
                eventBus.sendEvent('ItemReturned', {
                    'source': presenter.configuration.id,
                    'item': eventData.item,
                    'value': eventData.value,
                    'score': eventData.score
                });
            }
        }

        var eventsArray = presenter.configuration.events;
        for (var i=0; i<eventsArray.length; i++) {
            switch(eventsArray[i].sensor) {
                case "SQUEEZE_A": sendSensorEvent(eventsArray[i], a); break;
                case "SQUEEZE_B": sendSensorEvent(eventsArray[i], b); break;
                case "SQUEEZE_C": sendSensorEvent(eventsArray[i], c); break;
                case "SQUEEZE_SUM": sendSensorEvent(eventsArray[i], ((a+b+c)/3)); break;
                case "SQUEEZE_MAX": sendSensorEvent(eventsArray[i], Math.max(a,b,c)); break;
                case "PRESSURE": sendSensorEvent(eventsArray[i], p); break;
                case "ALL": sendSensorEvent(eventsArray[i], ((a+b+c+p)/4)); break;
            }
        }
    }

    function areLimitsOk(a, b, c, p) {
        var isPressureOK = presenter.configuration.pressureLimits[0] <= p && p <= presenter.configuration.pressureLimits[1];

        if (presenter.configuration.squeezeLimitsInterpretation === "TOGETHER") {
            var sum = a + b + c;
            var isSqueezeOK = (presenter.configuration.squeezeLimits[0] * 3) <= sum && sum <= (presenter.configuration.squeezeLimits[1] * 3);

            return isPressureOK && isSqueezeOK;
        } else if (presenter.configuration.squeezeLimitsInterpretation === "SEPARATELY") {
            var isSqueezeAOK = presenter.configuration.squeezeLimits[0] <= a && a <= presenter.configuration.squeezeLimits[1];
            var isSqueezeBOK = presenter.configuration.squeezeLimits[0] <= b && b <= presenter.configuration.squeezeLimits[1];
            var isSqueezeCOK = presenter.configuration.squeezeLimits[0] <= c && c <= presenter.configuration.squeezeLimits[1];

            return isSqueezeAOK && isSqueezeBOK && isSqueezeCOK && isPressureOK;
        }

        return false;
    }

    presenter.calculateValue = function(v, collection, defaultVal) {
        var result = defaultVal;
        for (var i=0; i<collection.length; i++) {
            if (collection[i][0] >= v) {
                result = collection[i][1];
                break;
            }
        }
        return result;
    };

    function getValue(a, b, c, p, collection, defaultValue) {
        switch(collection.sensor) {
            case "SQUEEZE_A": return presenter.calculateValue(a, collection.values, defaultValue);
            case "SQUEEZE_B": return presenter.calculateValue(b, collection.values, defaultValue);
            case "SQUEEZE_C": return presenter.calculateValue(c, collection.values, defaultValue);
            case "SQUEEZE_SUM": return presenter.calculateValue(parseInt((a + b + c) / 3, 10), collection.values, defaultValue);
            case "SQUEEZE_MAX": return presenter.calculateValue(Math.max(a, b, c), collection.values, defaultValue);
            case "PRESSURE": return presenter.calculateValue(p, collection.values, defaultValue);
            case "ALL": return presenter.calculateValue(parseInt((a + b + c + p)/ 3, 10), collection.values, defaultValue);
        }
        return false;
    }

    function getColor(a, b, c, p) {
        return getValue(a, b, c, p, presenter.configuration.colors, "#000000");
    }

    function getOpacity(a, b, c, p) {
        return getValue(a, b, c, p, presenter.configuration.opacity, 1);
    }

    function getThickness(a, b, c, p) {
        return getValue(a, b, c, p, presenter.configuration.thickness, val.defaultThickness);
    }

    function updateDrawingData(e) {
        var a, b, c, p;
        if (presenter.configuration.isSmartPen) {
            if (window.LearnPen === undefined) {
                presenter.drawingData.isDrawingOn = true;
                presenter.drawingData.pre_color = presenter.drawingData.color = "black";
                presenter.drawingData.thickness = 1;
            } else {
                a = parseInt(window.LearnPen.getA() / 10, 10);
                b = parseInt(window.LearnPen.getB() / 10, 10);
                c = parseInt(window.LearnPen.getC() / 10, 10);
                p = parseInt(window.LearnPen.getP() / 10, 10);

                eventCreator(a, b, c, p);

                if (areLimitsOk(a, b, c, p)) {
                    presenter.drawingData.isDrawingOn = true;
                    presenter.drawingData.pre_color = presenter.drawingData.color;
                    presenter.drawingData.color = presenter.hexToRGBA(getColor(a, b, c, p), getOpacity(a, b, c, p));
                    presenter.drawingData.thickness = getThickness(a, b, c, p);
                } else {
                    presenter.drawingData.isDrawingOn = false;
                    presenter.noDraw = true;
                }
            }
        } else {
            presenter.drawingData.pre_color = presenter.drawingData.color;
            if (presenter.data.isPencil) {
                presenter.drawingData.color = presenter.hexToRGBA(presenter.data.color, presenter.configuration.opacity);
            }
            presenter.drawingData.thickness = presenter.data.isPencil ? presenter.data.pencilThickness : presenter.data.eraserThickness;
        }

        presenter.position.pre_x = presenter.position.x;
        presenter.position.pre_y = presenter.position.y;

        if (MobileUtils.isEventSupported('touchstart')) {
            presenter.position.x = parseInt(event.changedTouches[0].pageX - $(presenter.data.canvas).offset().left, 10);
            presenter.position.y = parseInt(event.changedTouches[0].pageY - $(presenter.data.canvas).offset().top, 10);
        } else {
            presenter.position.x = parseInt((e.pageX - presenter.data.canvas.offset().left) / presenter.data.zoom, 10);
            presenter.position.y = parseInt((e.pageY - presenter.data.canvas.offset().top) / presenter.data.zoom, 10);
        }
    }

    function resizeCanvas() {
        var con = presenter.$view.find('.drawing').parent();
        presenter.data.canvas[0].width = con.width() - 2;
        presenter.data.canvas[0].height = con.height();
    }

    function fillCanvasWithColor() {
        if (presenter.configuration.backgroundColor !== "NO_BG") {
            presenter.data.context.fillStyle = presenter.configuration.backgroundColor;
            presenter.data.context.fillRect(0, 0, presenter.data.canvas[0].width, presenter.data.canvas[0].height);
        }
    }

    function drawVerticalLineIfIsMirror() {
        if (presenter.configuration.isMirror) {
            var w = presenter.data.canvas[0].width;

            presenter.data.context.beginPath();
            presenter.data.context.moveTo(w / 2, 0);
            presenter.data.context.lineTo(w / 2, presenter.data.canvas[0].height);

            presenter.data.context.lineWidth = presenter.configuration.border;
            presenter.data.context.strokeStyle = 'black';
            presenter.data.context.stroke();
        }
    }

    function createCanvas(isPreview) {
        presenter.data.isPencil = true;
        presenter.data.pencilThickness = presenter.configuration.thickness;

        presenter.$view.find('.drawing').append("<canvas class='canv'>Canvas is not supported by your browser</canvas>");

        presenter.data.canvas = presenter.$view.find('canvas');
        presenter.data.context = presenter.data.canvas[0].getContext("2d");

        presenter.$view.find('.drawing').css('opacity', presenter.configuration.opacity);
        resizeCanvas();

        fillCanvasWithColor();
        drawVerticalLineIfIsMirror();

        if (!isPreview) {
            presenter.turnOnEventListeners();
        }

        presenter.setVisibility(presenter.configuration.isVisible);
    }

    function returnErrorObject(errorCode) {
        return { isValid: false, errorCode: errorCode };
    }

    function returnCorrectObject(v) {
        return { isValid: true, value: v };
    }

    presenter.SQ_LIMITS_INTERPRETATION = {
        'Separately': 'SEPARATELY',
        'Together': 'TOGETHER',
        DEFAULT: 'Separately'
    };

    presenter.ERROR_CODES = {
        F01: "Value range has to be between 0 and 100%",
        F02: "Range values has to be ascending",

        S01: "Value sensor cannot be empty",
        S02: "Wrong sensor name",

        C01: "Property colors cannot be empty",
        C02: "One of the value in property colors has wrong length in hex format, should be # and 6 digits [0 - F]",
        C03: "One of the value in property color has wrong color name",

        T01: "Property thickness cannot be empty when SmartPen is on",
        T02: "Property thickness cannot be smaller than 1 and bigger then " + val.maxThickness,

        O02: "Property opacity cannot be smaller than 0 and bigger than 1",

        SQL01: "Wrong amount of values in property squeeze limits",
        SQL02: "Values in property squeeze limits must be numeric",
        SQL03: "2nd value in property squeeze limits cannot be smaller than 1st",
        SQL04: "Values in property squeeze limits cannot be smaller than 0",
        SQL05: "Values in property squeeze limits cannot be bigger than 100",

        PL01: "Wrong amount of numbers in property pressure limits",
        PL02: "Values in Property pressure limits must be numeric",
        PL03: "2nd value in property pressure limits cannot be smaller than 1st",
        PL04: "Values in property pressure limits cannot be smaller than 0",
        PL05: "Values in property pressure limits cannot be bigger than 100",

        E01: "Value in property Events cannot be different then 0 or 1",
        E02: "Score in property Events cannot be different then 0 or 1",

        RS02: "Wrong amount of numbers in Reaction scope in Events property",
        RS03: "Values in Reaction scope in Events property must be numeric",
        RS04: "2nd value in Reaction scope in Events property cannot be smaller than 1st",
        RS05: "Values in Reaction scope in Events property cannot be smaller than 0",
        RS06: "Values in Reaction scope in Events property cannot be bigger than 100",

        B02: "Property border cannot be smaller than 0",
        B03: "Property border cannot be bigger than 5"
    };

    function addPointsToHistory(x, y) {
        presenter.data.allPoints.push({x: x, y: y});
    }

    function sendEvent() {
        function round(num, x) {
            x = Math.pow(10, x);
            return Math.round(num * x) / x;
        }

        var distance = 0;

        for (var i = 0; i < presenter.data.allPoints.length-1; i++) {
            distance += Math.sqrt(Math.pow(presenter.data.allPoints[i].x - presenter.data.allPoints[i+1].x, 2) + Math.pow(presenter.data.allPoints[i].y - presenter.data.allPoints[i+1].y, 2));
        }

        if (presenter.data.allPoints.length !== 0) {
            eventBus.sendEvent('ItemReturned', {
                'source': presenter.configuration.id,
                'item': presenter.data.lineCounter++,
                'value': round(distance, 2),
                'score': presenter.mouseleave || presenter.noDraw ? '0' : '1'
            });
        }

        presenter.data.allPoints = [];
    }

    presenter.turnOnEventListeners = function() {
        var canvas = presenter.data.canvas,
            ctx = presenter.data.context,
            isDown = false;

        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        // TOUCH events
        if (MobileUtils.isEventSupported('touchstart')) {
            canvas.on('touchend', function() {
                canvas.off('touchmove', presenter.onPainting);
                sendEvent();
                setOverflowWorkAround(false);
            });

            canvas.on('touchstart', function(e) {
                presenter.data.isStarted = true;
                presenter.noDraw = false;

                updateZoomMultiplier();
                presenter.drawPoint();
                canvas.on('touchmove', presenter.onPainting);
                setOverflowWorkAround(true);
            });
        } else { // MOUSE events
            canvas.on('mouseup', function() {
                canvas.off('mousemove', presenter.onPainting);

                sendEvent();
                isDown = false;
                presenter.mouseleave = false;
                setOverflowWorkAround(false);
            });

            canvas.on('mouseleave', function() {
                canvas.off('mousemove', presenter.onPainting);

                if(isDown) {
                    sendEvent();
                    isDown = false;
                    presenter.mouseleave = true;
                }
                setOverflowWorkAround(false);
            });

            canvas.on('mousedown', function(e) {
                //updateDrawingData(e);
                presenter.data.isStarted = true;
                presenter.noDraw = false;
                isDown = true;

                updateZoomMultiplier();
                presenter.drawPoint(e);

                canvas.on('mousemove', presenter.onPainting);
                setOverflowWorkAround(true);
            });
        }

        function createGradient(pre_x, pre_y, x, y) {
            var grad = presenter.data.context.createLinearGradient(pre_x, pre_y, x, y);

            grad.addColorStop(0, presenter.data.isPencil ? presenter.drawingData.pre_color : "rgba(0,0,0,1)");
            grad.addColorStop(1, presenter.data.isPencil ? presenter.drawingData.color : "rgba(0,0,0,1)");

            return grad;
        }

        presenter.onPainting = function(e) {
            e.preventDefault();
            e.stopPropagation();
            updateDrawingData(e);

            if (presenter.drawingData.isDrawingOn) {
                updateZoomMultiplier();
                addPointsToHistory(presenter.position.x, presenter.position.y);
                ctx.lineWidth = presenter.drawingData.thickness;

                ctx.beginPath();
                ctx.moveTo(presenter.position.pre_x, presenter.position.pre_y);
                ctx.lineTo(presenter.position.x, presenter.position.y);
                ctx.strokeStyle = createGradient(presenter.position.pre_x, presenter.position.pre_y, presenter.position.x, presenter.position.y);
                ctx.stroke();

                if (presenter.configuration.isMirror) {
                    var w = presenter.data.canvas[0].width - presenter.position.x;
                    var pre_w = presenter.data.canvas[0].width - presenter.position.pre_x;

                    ctx.beginPath();
                    ctx.moveTo(pre_w, presenter.position.pre_y);
                    ctx.lineTo(w, presenter.position.y);
                    ctx.strokeStyle = createGradient(pre_w, presenter.position.pre_y, w, presenter.position.y);
                    ctx.stroke();
                }
            }
        };

        presenter.drawPoint = function(e) {
            updateDrawingData(e);

            if (presenter.drawingData.isDrawingOn) {
                ctx.lineWidth = presenter.drawingData.thickness;

                ctx.beginPath();
                ctx.moveTo(presenter.position.x, presenter.position.y);
                ctx.lineTo(presenter.position.x+1, presenter.position.y);
                ctx.strokeStyle = createGradient(presenter.position.x, presenter.position.y, presenter.position.x+1, presenter.position.y);
                ctx.stroke();

                if (presenter.configuration.isMirror) {
                    var w = presenter.data.canvas[0].width - presenter.position.x;

                    ctx.beginPath();
                    ctx.moveTo(w, presenter.position.y);
                    ctx.lineTo(w, presenter.position.y+1);
                    ctx.strokeStyle = createGradient(w+1, presenter.position.y, w, presenter.position.y);
                    ctx.stroke();
                }
            }
        };

        canvas.on("click", function() {
            event.stopPropagation();
        });
    };

    function prepareFunctionsValues(fun) {
        fun = Helpers.splitLines(fun);
        var sensor = fun[0].toUpperCase();
        var parsedValues = [];

        if (val.sensors.indexOf(sensor) === -1) {
            return returnErrorObject("S02");
        }

        var values = fun.slice(1);

        var previousNumber = 0;
        for (var i=0; i<values.length; i++) {
            var tmp = values[i].split("%");
            var number = parseInt(tmp[0].trim(), 10);

            if (number < 0 || number > 100) {
                return returnErrorObject("F01");
            }

            if (previousNumber >= number) {
                return returnErrorObject("F02")
            }

            parsedValues.push([number, tmp[1].trim()]);
            previousNumber = number;
        }

        return returnCorrectObject({
            sensor: sensor,
            values: parsedValues
        });
    }

    presenter.parseColors = function(colors, isLearnPen) {
        function checkColor(colors) {
            if (colors[0] === '#' && !(colors.length === 7 || colors.length === 4)) {
                return returnErrorObject("C02");
            }

            if (colors[0] !== '#') {
                colors = presenter.colourNameToHex(colors);

                if (!colors) {
                    return returnErrorObject("C03");
                }
            }

            return returnCorrectObject(colors);
        }

        if (ModelValidationUtils.isStringEmpty(colors)) {
            return returnErrorObject("C01");
        }

        if (isLearnPen) {

            var parsedFunction = prepareFunctionsValues(colors);
            if (!parsedFunction.isValid) {
                return returnErrorObject(parsedFunction.errorCode);
            }

            for (var i=0; i<parsedFunction.value.values.length; i++) {
                var localColor = parsedFunction.value.values[i][1];
                var checked = checkColor(localColor);
                if (!checked.isValid) {
                    return returnErrorObject(checked.errorCode);
                }
                parsedFunction.value.values[i][1] = checked.value;
            }

            return returnCorrectObject({
                sensor: parsedFunction.value.sensor,
                values: parsedFunction.value.values
            });
        } else {
            return checkColor(colors);
        }
    };

    presenter.parseThickness = function(thickness, isSmartPen) {
        if (ModelValidationUtils.isStringEmpty(thickness)) {
            return isSmartPen ? returnErrorObject("T01") : returnCorrectObject(val.defaultThickness);
        }

        if (isSmartPen) {
            var parsedFunction = prepareFunctionsValues(thickness);
            if (!parsedFunction.isValid) {
                return returnErrorObject(parsedFunction.errorCode);
            }

            for (var i=0; i<parsedFunction.value.values.length; i++) {
                var localThickness = parsedFunction.value.values[i][1];
                if (1 > localThickness || localThickness > val.maxThickness) {
                    return returnErrorObject("T02");
                }
            }

            return returnCorrectObject({
                sensor: parsedFunction.value.sensor,
                values: parsedFunction.value.values //.map(function(a) { return [a[0], parseInt(a[1], 10)]; }) // parse 2nd value to integer
            });
        } else {
            thickness = parseInt(thickness, 10);
            if (1 > thickness || thickness > val.maxThickness) {
                return returnErrorObject("T02");
            }
            return returnCorrectObject(thickness);
        }
    };

    presenter.parseOpacity = function(opacity, isSmartPen) {
        if (ModelValidationUtils.isStringEmpty(opacity)) {
            return returnCorrectObject(isSmartPen ? { sensor: "ALL", values: [[100, 1]] } : 1);
        }

        if (isSmartPen) {
            var parsedFunction = prepareFunctionsValues(opacity);
            if (!parsedFunction.isValid) {
                return returnErrorObject(parsedFunction.errorCode);
            }

            for (var i=0; i<parsedFunction.value.values.length; i++) {
                var localOpacity = parsedFunction.value.values[i][1];
                if (0 > localOpacity || localOpacity > 1) {
                    return returnErrorObject("O02");
                }
            }

            return returnCorrectObject({
                sensor: parsedFunction.value.sensor,
                values: parsedFunction.value.values.map(function(a) { return [a[0], parseFloat(a[1])]; }) // parse 2nd value to float
            });
        } else {
            if (0 > opacity || opacity > 1) {
                return returnErrorObject("O02");
            }

            return returnCorrectObject(opacity);
        }
    };

    function parseRange(range, code) {
        function isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        if (ModelValidationUtils.isStringEmpty(range)) {
            return returnCorrectObject([0, 100]);
        }

        range = range.split(';').map($.trim).map(parseFloat);
        range = range.length === 1 ? [0].concat(range) : range;

        if (range.length !== 2) {
            return returnErrorObject(code + '01');
        }

        if (!isNumber(range[0]) || !isNumber(range[1])) {
            return returnErrorObject(code + '02');
        }

        if (range[0] >= range[1]) {
            return returnErrorObject(code + '03');
        }

        if (range[0] < 0 || range[1] < 0) {
            return returnErrorObject(code + '04');
        }

        if (range[0] > 100 || range[1] > 100) {
            return returnErrorObject(code + '05');
        }

        return returnCorrectObject(range);
    }

    presenter.parseSqueeze = function(crush) {
        return parseRange(crush, 'SQL');
    };

    presenter.parsePressure = function(pressure) {
        return parseRange(pressure, 'PL');
    };

    presenter.parseEvents = function(events) {
        function isEventEmpty(eventData) {
            return ModelValidationUtils.isStringEmpty(eventData["Sensor"]) &&
                ModelValidationUtils.isStringEmpty(eventData["Reaction scope"]) &&
                ModelValidationUtils.isStringEmpty(eventData["Item"]) &&
                ModelValidationUtils.isStringEmpty(eventData["Value"]) &&
                ModelValidationUtils.isStringEmpty(eventData["Score"]);
        }

        if (isEventEmpty(events[0])) {
            return returnCorrectObject([]);
        }

        var eventsArray = [];

        for (var i=0; i<events.length; i++) {
            var sensor = events[i]["Sensor"];
            if (ModelValidationUtils.isStringEmpty(sensor)) {
                return returnErrorObject("S01");
            }
            if (val.sensors.indexOf(sensor) === -1) {
                return returnErrorObject("S02");
            }

            var reactionScope = events[i]["Reaction scope"];
            var parsedReactionScope = parseRange(reactionScope, "RS");
            if (!parsedReactionScope.isValid) {
                return returnErrorObject(parsedReactionScope.errorCode);
            }

            var value = events[i]["Value"];
            if (value !== '1' && value !== '0') {
                return returnErrorObject("E01");
            }

            var score = events[i]["Score"];
            if (score !== '1' && score !== '0') {
                return returnErrorObject("E02");
            }

            eventsArray.push({
                sensor: sensor,
                reactionScope: parsedReactionScope.value,
                item: events[i]["Item"],
                value: value,
                score: score
            });
        }

        return returnCorrectObject(eventsArray);
    };

    presenter.parseBGColor = function(color) {
        if (ModelValidationUtils.isStringEmpty(color)) {
            return returnCorrectObject("NO_BG");
        }

        if (color[0] === '#' && !(color.length === 7)) {
            return returnErrorObject('C02');
        }

        if (color[0] !== '#') {
            color = presenter.colourNameToHex(color);

            if (!color) {
                return returnErrorObject('C03');
            }
        }

        return returnCorrectObject(color);
    };

    presenter.parseBorder = function(border) {

        if (ModelValidationUtils.isStringEmpty(border)) {
            return returnCorrectObject(0);
        }

        if (border < 0) {
            return returnErrorObject('B02');
        }

        if (border > 5) {
            return returnErrorObject('B03');
        }

        return returnCorrectObject(border);
    };

    presenter.validateModel = function(model) {
        var isSmartPen = ModelValidationUtils.validateBoolean(model["SmartPen"]);

        var parsedColors = presenter.parseColors(model["Colors"], isSmartPen);
        if (!parsedColors.isValid) {
            return returnErrorObject(parsedColors.errorCode);
        }

        var parsedThickness = presenter.parseThickness(model["Thickness"], isSmartPen);
        if (!parsedThickness.isValid) {
            return returnErrorObject(parsedThickness.errorCode);
        }

        var parsedOpacity = presenter.parseOpacity(model["Opacity"], isSmartPen);
        if (!parsedOpacity.isValid) {
            return returnErrorObject(parsedOpacity.errorCode);
        }

        var parsedSqueeze = presenter.parseSqueeze(model["Squeeze limits"]);
        if (!parsedSqueeze.isValid) {
            return returnErrorObject(parsedSqueeze.errorCode);
        }

        var parsedPressure = presenter.parsePressure(model["Pressure limits"]);
        if (!parsedPressure.isValid) {
            return returnErrorObject(parsedPressure.errorCode);
        }

        var parsedEvent = presenter.parseEvents(model["Events"]);
        if (!parsedEvent.isValid) {
            return returnErrorObject(parsedEvent.errorCode);
        }

        var parsedBGColor = presenter.parseBGColor(model["Background color"]);
        if (!parsedBGColor.isValid) {
            return returnErrorObject(parsedBGColor.errorCode);
        }

        return {
            isSmartPen: isSmartPen,
            colors: parsedColors.value, // if (isSmartPen) {sensor: String, values: [Integer, Hex color] } else String (hex color)
            thickness: parsedThickness.value, // if (isSmartPen) {sensor: String, thicknesses: [Integer, Integer] } else Integer
            opacity: parsedOpacity.value, // if (isSmartPen) {sensor: String, opacity: [Integer, Float] } else Float
            squeezeLimits: parsedSqueeze.value,
            squeezeLimitsInterpretation: ModelValidationUtils.validateOption(presenter.SQ_LIMITS_INTERPRETATION, model["Squeeze limits interpretation"]),
            pressureLimits: parsedPressure.value,
            events: parsedEvent.value,
            isMirror: ModelValidationUtils.validateBoolean(model["Mirror"]),
            backgroundColor: parsedBGColor.value,

            width: model["Width"],
            height: model["Height"],
            id: model["ID"],
            isValid: true,
            isVisible: ModelValidationUtils.validateBoolean(model["Is Visible"])
        };
    };

    presenter.presenterLogic = function(view, model, isPreview) {
        presenter.$view = $(view);
        presenter.model = model;

        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return false;
        }

        if (!presenter.configuration.isSmartPen) presenter.data.color = presenter.configuration.colors;
        presenter.data.pencilThickness = presenter.configuration.thickness;
        presenter.data.eraserThickness = presenter.configuration.thickness;

        createCanvas(isPreview);

        return false;
    };

    presenter.run = function(view, model) {
        presenter.presenterLogic(view, model, false);
    };

    presenter.createPreview = function(view, model) {
        presenter.presenterLogic(view, model, true);
    };

    presenter.executeCommand = function(name, params) {
        if (!presenter.configuration.isValid) {
            return false;
        }

        var commands = {
            'show': presenter.show,
            'hide': presenter.hide
        };

        Commands.dispatch(commands, name, params, presenter);

        return false;
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.show = function() {
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
    };

    presenter.hide = function() {
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
    };

//    presenter.setShowErrorsMode = function() {};
//    presenter.setWorkMode = function() {};

    presenter.setPlayerController = function(controller) {
        eventBus = controller.getEventBus();
    };

    presenter.reset = function() {
        presenter.$view.find('.canv').remove();
        createCanvas(false);

        presenter.data.isStarted = false;
        presenter.data.lineCounter = 0;
    };

//     presenter.getErrorCount = function() {};
//     presenter.getMaxScore = function() {};
//     presenter.getScore = function() {};

    presenter.getState = function() {
        if (!presenter.data.isStarted) {
            return;
        }

        var c = presenter.$view.find("canvas")[0];

        return JSON.stringify({
            isPencil: presenter.data.isPencil,
            color: presenter.data.color,
            pencilThickness: presenter.data.pencilThickness,
            eraserThickness: presenter.data.eraserThickness,
            data: c.toDataURL("image/png"),
            isVisible: presenter.configuration.isVisible
        });
    };

    presenter.setState = function(state) {
        if (ModelValidationUtils.isStringEmpty(state)) {
            return;
        }

        var savedImg = new Image();

        savedImg.onload = function() {
            presenter.data.context.drawImage(savedImg, 0, 0);

            presenter.data.pencilThickness = JSON.parse(state).pencilThickness;
            presenter.data.eraserThickness = JSON.parse(state).eraserThickness;
            presenter.configuration.isVisible = JSON.parse(state).isVisible;
            presenter.data.isPencil = JSON.parse(state).isPencil;
            presenter.data.isStarted = true;

            if (!presenter.configuration.isSmartPen) {
                if (presenter.data.isPencil) {
                    presenter.setColor(JSON.parse(state).color);
                } else {
                    presenter.setEraserOn();
                }
            }
        };
        savedImg.src = JSON.parse(state).data;
    };

    presenter.setColor = function(color) {
        if (!presenter.configuration.isSmartPen) {
            presenter.data.isPencil = true;
            presenter.data.context.globalCompositeOperation = "source-over";
            presenter.data.color = presenter.parseColors(color, false).value;
        }
    };

    presenter.setThickness = function(thickness) {
        if (!presenter.configuration.isSmartPen) {
            if (presenter.data.isPencil) {
                presenter.data.pencilThickness = thickness;
            } else {
                presenter.data.eraserThickness = thickness;
            }
        }
    };

    presenter.setEraserOn = function() {
        if (!presenter.configuration.isSmartPen) {
            presenter.data.isPencil = false;
            presenter.data.context.globalCompositeOperation = "destination-out";
            presenter.configuration.color = "rgba(255, 255, 255, 1)";
        }
    };

    presenter.isLearnPenConnected = function() {
        return window.LearnPen !== undefined
    };

    return presenter;
}