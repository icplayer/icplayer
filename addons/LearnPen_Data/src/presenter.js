function AddonLearnPen_Data_create() {

    function getErrorObject(ec) { return { isValid: false, errorCode: ec }; }
    function getCorrectObject(val) { return { isValid: true, value: val }; }
    function getStep(col, val) { return { color: col, value: val }; }

    Number.prototype.half = Number.prototype.half || function() {
        return Math.round(this / 2);
    };

    var DATA_LENGTH = 12;
    var ON_MODE_CLASS = 'on-mode';

    var isIntervalOn = false;

    var presenter = function() {};

    function recording(on) {
        if (on) {
            if (!isIntervalOn) {
                presenter.intervalId = setInterval(updateDataOnGraph, presenter.configuration.refreshTime);
            }
        } else {
            if (isIntervalOn) {
                clearInterval(presenter.intervalId);
            }
        }
        isIntervalOn = on;
    }

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    function getCurrentDataFromSensor() {
        function toPercent(val) { return Math.round(val / 1024 * 100); }
        var learnPenData = window.LearnPen;

        return {
            a: learnPenData ? toPercent(learnPenData.getA()) : 0, // Math.round(Math.floor(Math.random() * 100)),
            b: learnPenData ? toPercent(learnPenData.getB()) : 0, // Math.round(Math.floor(Math.random() * 100)),
            c: learnPenData ? toPercent(learnPenData.getC()) : 0, // Math.round(Math.floor(Math.random() * 100)),
            p: learnPenData ? toPercent(learnPenData.getP()) : 0 // Math.round(Math.floor(Math.random() * 100))
        };
    }

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
    };

    function colorNameToHex(color) {
        var colors = {
            "aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff","beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887","cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff","darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f","darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1","darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff","firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff","gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f","honeydew":"#f0fff0","hotpink":"#ff69b4","indianred ":"#cd5c5c","indigo ":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c","lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2","grey":"#808080","lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de","lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6","magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee","mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5","navajowhite":"#ffdead","navy":"#000080","oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6","palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1","saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4","tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0","violet":"#ee82ee","wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5","yellow":"#ffff00","yellowgreen":"#9acd32"
        };

        if (typeof colors[color.toLowerCase()] !== 'undefined') {
            return colors[color.toLowerCase()];
        }

        return color;
    }

    presenter.ERROR_CODES = {
        S01: 'Wrong values in Steps and colors property',
        S02: 'Wrong number of values in Steps and colors property. 12 values for every sensor',
        S03: 'Percentage values in Steps and colors property have to be in descend order',

        T01: 'Property Refresh time cannot be lower then 50 and higher then 2000',
        T02: 'Property Refresh time has to be numeric'
    };

    presenter.isSensorLine = function(line) {
        return line.split(';').every(function(v) {
            return /^[A-CP]$/.test(v.trim());
        });
    };

    presenter.isValueLine = function(line) {
        // 50%;red | 90% ; blue | 3%;#111111 | 77%;#333
        return /^[0-9]{1,3}%\s*;\s*.*([a-zA-Z]|#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})$/.test(line);
    };

    function validateLines(lines) {
        if (lines.length % (DATA_LENGTH + 1) !== 0) return getErrorObject('S02');

        var previous = 0;
        for (var i=0; i<lines.length; i++) {
            if (i % (DATA_LENGTH + 1) === 0) {
                previous = 0;
                if (!presenter.isSensorLine(lines[i])) {
                    return getErrorObject('S01');
                }
            } else {
                if (!presenter.isValueLine(lines[i])) {
                    return getErrorObject('S02');
                }

                var currentPercent = parseInt(lines[i].split(';')[0].trim(), 10);
                if (previous > currentPercent) {
                    return getErrorObject('S03');
                }
                previous = currentPercent;
            }
        }

        return getCorrectObject(null);
    }

    function getDataFromLines(lines, sensor) {
        var sensorSteps = [];

        function findSensorInLine() {
            for (var i=0; i<lines.length; i++) {
                var values = lines[i].split(';');

                if (values.indexOf(sensor) !== -1) {
                    return i;
                }
            }
            return -1;
        }

        var firstValuePosition = findSensorInLine() + 1;

        for (var i=firstValuePosition; i<firstValuePosition+DATA_LENGTH; i++) {
            var stepAndColor = lines[i].split(';').map(function(a) { return a.trim(); });
            var value = parseInt(stepAndColor[0], 10); // removes implicitly % sign
            var color = colorNameToHex(stepAndColor[1]);
            sensorSteps.push(getStep(color, value));
        }

        return sensorSteps;
    }

    function validateColorsAndSteps(data) {
        if (ModelValidationUtils.isStringEmpty(data)) {
            // #ff0000 - red
            // #ffff00 - yellow
            // #008000 - green
            // #ffa500 - orange
            // #90ee90 - lightgreen
            var squeeze = [
                getStep("#ffff00", 10), getStep("#ffff00", 20), getStep("#ffff00", 30),
                getStep("#ffff00", 32),
                getStep("#008000", 33), getStep("#008000", 40), getStep("#008000", 50),
                getStep("#008000", 66),
                getStep("#ff0000", 67),
                getStep("#ff0000", 70), getStep("#ff0000", 80), getStep("#ff0000", 95)
            ];

            return getCorrectObject({
                a: squeeze,
                b: squeeze,
                c: squeeze,
                p: squeeze
            });
        }

        var lines = Helpers.splitLines(data).map(function(line) { return line.trim(); }).filter(function(line) { return line !== '' });

        var validationData = validateLines(lines);
        if (!validationData.isValid) {
            return getErrorObject(validationData.errorCode);
        }

        return getCorrectObject({
            a: getDataFromLines(lines, 'A'),
            b: getDataFromLines(lines, 'B'),
            c: getDataFromLines(lines, 'C'),
            p: getDataFromLines(lines, 'P')
        });
    }

    function validateTime(time) {
        if (ModelValidationUtils.isStringEmpty(time)) {
            return getCorrectObject(100);
        }

        if (!/^[0-9]+$/.test(time)) {
            return getErrorObject('T02');
        }

        time = parseInt(time, 10);

        if (time < 50 || time > 2000) {
            return getErrorObject('T01');
        }

        return getCorrectObject(time);
    }

    presenter.validateModel = function(model) {
        var validatedStepsAndColors = validateColorsAndSteps(model.stepsAndColors);
        if (!validatedStepsAndColors.isValid) return getErrorObject(validatedStepsAndColors.errorCode);

        var validatedTime = validateTime(model.refreshTime);
        if (!validatedTime.isValid) return getErrorObject(validatedTime.errorCode);

        return {
            isValid: true,
            isDisable: ModelValidationUtils.validateBoolean(model.isDisable),
            stepsAndColors: validatedStepsAndColors.value,
            refreshTime: validatedTime.value,
            width: parseInt(model.Width, 10),
            height: parseInt(model.Height, 10),

            id: model.ID,
            isVisible: ModelValidationUtils.validateBoolean(model["Is Visible"])
        };
    };

    function colorSteps(stepsAndColors) {
        function setBackGroundColor($sensor, step, color) {
            $sensor.find('div.box[data-step="' + step + '"]').css('background-color', color);
            $sensor.find('div.box[data-step="' + step + '"]').attr('data-color', color);
        }

        for (var i=0; i<DATA_LENGTH; i++) {
            setBackGroundColor(presenter.$a, i, stepsAndColors.a[i].color);
            setBackGroundColor(presenter.$b, i, stepsAndColors.b[i].color);
            setBackGroundColor(presenter.$c, i, stepsAndColors.c[i].color);
            setBackGroundColor(presenter.$p, i, stepsAndColors.p[i].color);
        }
    }

    function updateDataOnGraph() {
        function setDataForSensor($sensor, steps, value) {
            var color, index;

            for (var i=0; i<DATA_LENGTH; i++) {
                if (steps[i].value < value) {
                    index = i;
                }
            }
            color = $sensor.find('div.box[data-step="' + index + '"]').attr("data-color");

            for (var i=0; i<DATA_LENGTH; i++) {
                if (steps[i].value < value) {
                    $sensor.find('div.box[data-step="' + i + '"]').css("background-color", color);
                } else {
                    $sensor.find('div.box[data-step="' + i + '"]').css("background-color", "white");
                }
            }
        }

        presenter.$view.find('div.' + ON_MODE_CLASS).each(function() {
            $(this).removeClass(ON_MODE_CLASS);
        });

        var data = getCurrentDataFromSensor();

        setDataForSensor(presenter.$a, presenter.configuration.stepsAndColors.a, data.a);
        setDataForSensor(presenter.$b, presenter.configuration.stepsAndColors.b, data.b);
        setDataForSensor(presenter.$c, presenter.configuration.stepsAndColors.c, data.c);
        setDataForSensor(presenter.$p, presenter.configuration.stepsAndColors.p, data.p);
    }

    presenter.presenterLogic = function(view, model, isPreview) {
        presenter.$view = $(view);

        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return false;
        }

        presenter.$a = presenter.$view.find('div.sensor-a');
        presenter.$b = presenter.$view.find('div.sensor-b');
        presenter.$c = presenter.$view.find('div.sensor-c');
        presenter.$p = presenter.$view.find('div.sensor-p');

        colorSteps(presenter.configuration.stepsAndColors);

        if (!isPreview && !presenter.configuration.isDisable) {
            presenter.intervalId = setInterval(updateDataOnGraph, presenter.configuration.refreshTime);
            isIntervalOn = true;
        }

        presenter.setVisibility(presenter.configuration.isVisible || isPreview);

        return true;
    };

    presenter.run = function(view, model) {
        presenter.presenterLogic(view, model, false);
    };

    presenter.createPreview = function(view, model) {
        presenter.presenterLogic(view, model, true);
    };

    presenter.setShowErrorsMode = function() {
        recording(false);
    };

    presenter.setWorkMode = function() {
        recording(true);
    };

    presenter.getState = function() {
        recording(false);
    };

    presenter.setState = function(_) {
        recording(true);
    };

//    presenter.reset = function() { };
//    presenter.getErrorCount = function() { return 0; };
//    presenter.getMaxScore = function() { return 0; };
//    presenter.getScore = function() { return 0; };

    return presenter;
}