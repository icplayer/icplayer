function AddonSmart_Pen_Data_create() {

    var presenter = function() {};

    presenter.isWorking = false;

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.presentation = controller.getPresentation();
        presenter.commander = controller.getCommands();
        presenter.pageCount = controller.getPresentation().getPageCount();
        presenter.currentIndex = controller.getCurrentPageIndex();
    };

    presenter.createGraph = function(type, labels, colors, data) {
        switch (type) {
            case 'GAUGE': createGauge(labels, colors, data); break;
            case 'H_P_BAR': createHorizontalProgressBar(labels, colors, data); break;
            case 'BARS': createBars(labels, colors, data); break;
            case 'H_BARS': createHBars(labels, colors, data); break;
            case 'LINE': createLine(labels, colors, data); break;
            case 'RADAR': createRadar(labels, colors, data); break;
            case 'ROSE': createRose(labels, colors, data); break;
            default: break;
        }
    };

    presenter.hexToRGBA = function(hex, opacity) {
        var r = parseInt(hex.substring(1,3), 16),
            g = parseInt(hex.substring(3,5), 16),
            b = parseInt(hex.substring(5,7), 16);

        return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
    };

    presenter.colorNameToHex = function(color) {
        var colors = {
            "aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
            "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff",
            "blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887","cadetblue":"#5f9ea0","chartreuse":"#7fff00",
            "chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c",
            "cyan":"#00ffff","darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9",
            "darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
            "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a",
            "darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
            "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969",
            "dodgerblue":"#1e90ff","firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22",
            "fuchsia":"#ff00ff","gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520",
            "gray":"#808080","green":"#008000","greenyellow":"#adff2f","honeydew":"#f0fff0","hotpink":"#ff69b4",
            "indianred ":"#cd5c5c","indigo ":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c","lavender":"#e6e6fa",
            "lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6",
            "lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2","lightgrey":"#d3d3d3",
            "lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa",
            "lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de","lightyellow":"#ffffe0",
            "lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6","magenta":"#ff00ff","maroon":"#800000",
            "mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8",
            "mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee","mediumspringgreen":"#00fa9a",
            "mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa",
            "mistyrose":"#ffe4e1","moccasin":"#ffe4b5","navajowhite":"#ffdead","navy":"#000080","oldlace":"#fdf5e6",
            "olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
            "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093",
            "papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd",
            "powderblue":"#b0e0e6","purple":"#800080","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
            "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee",
            "sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090",
            "snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4","tan":"#d2b48c","teal":"#008080",
            "thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0","violet":"#ee82ee","wheat":"#f5deb3",
            "white":"#ffffff","whitesmoke":"#f5f5f5","yellow":"#ffff00","yellowgreen":"#9acd32"
        };

        if (typeof colors[color.toLowerCase()] !== 'undefined') {
            return colors[color.toLowerCase()];
        }

        return false;
    };

    function interval(func, wait, times) {
        var interv = function(w, t) {
            return function() {
                if(typeof t === "undefined" || t-->0) {
                    setTimeout(interv, w);
                    try {
                        func.call(null);
                    } catch(e) {
                        t = 0;
                        throw e.toString();
                    }
                }
            };
        }(wait, times);

        if (presenter.isWorking) presenter.time_out = setTimeout(interv, wait);
    }

    presenter.CHART_TYPE = {
        'Gauge': 'GAUGE',
        'Horizontal progress bar': 'H_P_BAR',
        'Bars': 'BARS',
        'Horizontal Bars': 'H_BARS',
        'Line': 'LINE',
        'Radar': 'RADAR',
        'Rose': 'ROSE',
        DEFAULT: 'Gauge'
    };

    presenter.MODE = {
        'All': 'ALL',
        'Sum from squeezes': 'SUM_S',
        'Sum from squeezes + pressure': 'SUM_S_P',
        'Max from squeezes': 'MAX_S',
        'Max from squeezes + pressure': 'MAX_S_P',
        'Pressure': 'PRESSURE',
        'Squeeze A': 'SQUEEZE_A',
        'Squeeze B': 'SQUEEZE_B',
        'Squeeze C': 'SQUEEZE_C',
        DEFAULT: 'All'
    };

    function getDataFromSmartPen() {
        if (window.SmartPen === undefined) {
            return [
                Math.floor((Math.random() * 1000) + 1),
                Math.floor((Math.random() * 1000) + 1),
                Math.floor((Math.random() * 1000) + 1),
                Math.floor((Math.random() * 1000) + 1)
            ];
        } else {
            return [
                parseInt(window.LearnPen.getA(), 10),
                parseInt(window.LearnPen.getB(), 10),
                parseInt(window.LearnPen.getC(), 10),
                parseInt(window.LearnPen.getP(), 10)
            ];
        }
    }

    function reDrawChart() {
        try {
            RGraph.Clear(document.getElementById(presenter.configuration.id));
            var data = getDataFromSmartPen();
            presenter.createGraph(presenter.configuration.type, presenter.configuration.labels, presenter.configuration.colors, data);
        } catch(err) {
            //console.log(err);
        }
    }

    presenter.evalData = function(data) {
        var parsedMax, parsedData, tmpData = [].concat(data);

        switch(presenter.configuration.mode) {
            case 'ALL': parsedMax = 4000; parsedData = data.reduce(function (a, b) { return a + b; }, 0); break;
            case 'SUM_S': parsedMax = 3000; tmpData.pop(); parsedData = tmpData.reduce(function (a, b) { return a + b; }, 0); break;
            case 'SUM_S_P': parsedMax = 4000; parsedData = data.reduce(function (a, b) { return a + b; }, 0); break;
            case 'MAX_S': parsedMax = 1000; tmpData.pop(); parsedData = tmpData.reduce(function (a, b) { return a > b ? a : b; }, 0); break;
            case 'MAX_S_P': parsedMax = 1000; parsedData = data.reduce(function (a, b) { return a > b ? a : b; }, 0); break;
            case 'PRESSURE': parsedMax = 1000; parsedData = data[3]; break;
            case 'SQUEEZE_A': parsedMax = 1000; parsedData = data[0]; break;
            case 'SQUEEZE_B': parsedMax = 1000; parsedData = data[1]; break;
            case 'SQUEEZE_C': parsedMax = 1000; parsedData = data[2]; break;
            default: parsedMax = 4000; parsedData = data.reduce(function (a, b) { return a + b; }, 0); break;
        }

        return {
            max: parsedMax,
            data: parsedData
        }
    };

    function createGauge(labels, colors, data) {
        var values = presenter.evalData(data);

        var gauge = new RGraph.Gauge(presenter.configuration.id, 0, values.max, values.data)
            .Set('title.top', labels[0])
            .Set('title.bottom', labels[1])
            .Set('labels.count', 0)

            .Set('background.color', colors[0])
            .Set('title.top.color', colors[1])
            .Set('title.bottom.color', colors[1])
            .Set('green.color', colors[2])
            .Set('yellow.color', colors[3])
            .Set('red.color', colors[4])

            .Set('tickmarks.small', 10)
            .Set('shadow', true);

        if (colors[5] !== '') {
            gauge
                .Set('needle.color', [colors[5], '', '', ''])
                .Set('centerpin.color', colors[5])
        }
        gauge.Draw();
    }

    function createHorizontalProgressBar(labels, colors, data) {
        var values = presenter.evalData(data);

        var hpb = new RGraph.HProgress(presenter.configuration.id, 0, values.max, values.data)
            .Set('title', labels[0])
            .Set('labels.count', 1)
            .Set('labels.axes', '')

            .Set('gutter.top', 45)
            .Set('gutter.bottom', 45)

            .Set('tickmarks', true)
            .Set('arrows', false)
            .Set('bevel', true)
            .Set('shadow', true);

        if (colors[0] !== '') hpb.Set('background.color', colors[0]);
        //if (colors[1] !== '') hpb.Set('title.color', colors[1]);
        if (colors[2] !== '') hpb.Set('colors', colors.slice(2, 3));

        hpb.Draw();
    }

    function createBars(labels, colors, data) {
        var bars = new RGraph.Bar(presenter.configuration.id, data)
            .Set('labels', labels)

            .Set('colors.sequential', 'true')

            .Set('background.grid', false)
            .Set('ymax', 1000)
            .Set('numyticks', 4)
            .Set('ylabels.count', 0);

        if (colors[0] !== '') bars.Set('background.color', colors[0]);
        if (colors[1] !== '') bars.Set('text.color', colors[1]);
        if (colors[2] !== '' || colors[3] !== '' || colors[4] !== '' || colors[5] !== '') bars.Set('colors', colors.slice(2));

        bars.Draw();
    }

    function createHBars(labels, colors, data) {
        var h_bars = new RGraph.HBar(presenter.configuration.id, data)
            .Set('labels', labels)

            .Set('colors.sequential', 'true')

            .Set('background.grid', false)
            .Set('xmax', 1000)
            .Set('numyticks', 4)
            .Set('xlabels.count', 0);

        if (colors[0] !== '') h_bars.Set('background.color', colors[0]);
        if (colors[1] !== '') h_bars.Set('text.color', colors[1]);
        if (colors[2] !== '' || colors[3] !== '' || colors[4] !== '' || colors[5] !== '') h_bars.Set('colors', colors.slice(2));

        h_bars.Draw();
    }

    function createLine(labels, colors, data) {
        var line = new RGraph.Line(presenter.configuration.id, data)
            .Set('labels', labels)
            .Set('background.grid', false)
            .Set('colors.sequential', 'true')
            .Set('linewidth', 2)
            .Set('filled', true)
            .Set('hmargin', 5)
            .Set('ymax', 1000)
            .Set('ylabels.count', 0)
            .Set('shadow', true);

        if (colors[0] !== '') line.Set('background.color', colors[0]);
        if (colors[1] !== '') line.Set('text.color', colors[1]);
        if (colors[2] !== '' || colors[3] !== '' || colors[4] !== '' || colors[5] !== '') line.Set('colors', colors.slice(2));

        line.Draw();
    }

    function createRadar(labels, colors, data) {
        var radar = new RGraph.Radar(presenter.configuration.id, data)
            .Set('labels', labels)
            .Set('colors.sequential', 'true')
            .Set('background.circles', true)
            .Set('circle', 20)
            .Set('ymax', 1000);

        if (colors[0] !== '') radar.Set('background.fill', colors[0]);
        if (colors[1] !== '') radar.Set('text.color', colors[1]);
        if (colors[2] !== '') radar.Set('colors', [presenter.hexToRGBA(colors[2], 0.5)]);

        radar.Draw();
    }

    function createRose(labels, colors, data) {
        var rose = new RGraph.Rose(presenter.configuration.id, data)
            .Set('labels', labels)
            .Set('labels.axes', '')
            .Set('margin', 5)
            .Set('colors.sequential', true)
            .Set('background.grid', false)
            .Set('ymax', 1000)
            .Set('labels.count', 0);

        if (colors[0] !== '') rose.Set('background.grid.color', colors[0]);
        if (colors[1] !== '') rose.Set('text.color', colors[1]);
        if (colors[2] !== '' || colors[3] !== '' || colors[4] !== '' || colors[5] !== '') rose.Set('colors', colors.slice(2));

        rose.Draw();
    }

    presenter.ERROR_CODES = {
        C01: 'One of the colors\' property has wrong length in hex format, it should be # and then 6 digits [0 - F]',
        C02: 'One of the colors\' property has wrong color name',

        T01: 'Property Refresh time cannot be lower then 50ms and higher then 2000',

        M01: 'Mode different then "all" is available only for graphs: "Gauge" and "Horizonal prograss bar"',

        S01: 'Values of width and height cannot be lower then 100px'
    };

    function returnErrorObject(errorCode) {
        return { is_valid: false, errorCode: errorCode };
    }

    presenter.validateModel = function(model) {

        var labels = [];
        labels.push(model['1st label']);
        labels.push(model['2nd label']);
        labels.push(model['3rd label']);
        labels.push(model['4th label']);

        var colors = [];
        colors.push(model['Background color']);
        colors.push(model['Text color']);
        colors.push(model['1st color']);
        colors.push(model['2nd color']);
        colors.push(model['3rd color']);
        colors.push(model['4th color']);
        var parsedColors = presenter.parseColors(colors);
        if (!parsedColors.is_valid) {
            return returnErrorObject(parsedColors.errorCode);
        }

        var parsedTime = presenter.parseTime(model['Refresh time']);
        if (!parsedTime.is_valid) {
            return returnErrorObject(parsedTime.errorCode);
        }

        var type = ModelValidationUtils.validateOption(presenter.CHART_TYPE, model['Chart type']);

        var parsedMode = presenter.parseMode(ModelValidationUtils.validateOption(presenter.MODE, model['Mode']), type);
        if (!parsedMode.is_valid) {
            return returnErrorObject(parsedMode.errorCode);
        }

        return {
            id: model.ID + '_' + presenter.currentIndex + '_canv',
            is_disable: ModelValidationUtils.validateBoolean(model['Is Disable']),
            type: type,
            labels: labels,
            colors: parsedColors.value, // [0] - background, [1] - text, rest - variously
            refresh_time: parsedTime.value,
            mode: parsedMode.value,

            is_visible: ModelValidationUtils.validateBoolean(model['Is Visible']),
            is_valid: true
        };
    };

    presenter.parseColors = function(colors) {
        for (var i in colors) {
            if (colors[i] !== '') {
                if (colors[i][0] === '#' && !(colors[i].length === 7)) {
                    return returnErrorObject('C01');
                }

                if (colors[i][0] !== '#') {
                    if (!presenter.colorNameToHex(colors[i])) {
                        return returnErrorObject('C02');
                    } else {
                        colors[i] = presenter.colorNameToHex(colors[i]);
                    }
                }

                if (!colors[i]) {
                    return returnErrorObject('C02');
                }
            }
        }

        return {
            value: colors,
            is_valid: true
        };
    };

    presenter.parseTime = function(time) {
        time = time || 1000;
        time = parseInt(time, 10);

        if (time < 50 || time > 2000) {
            return returnErrorObject('T01');
        }

        return {
            value: time,
            is_valid: true
        }
    };

    presenter.parseMode = function(mode, type) {
        if (mode !== 'ALL' && type !== 'GAUGE' && type !== 'H_P_BAR') {
            return returnErrorObject('M01');
        }

        return {
            value: mode,
            is_valid: true
        }
    };

    presenter.presenterLogic = function(view, model, isPreview) {
        presenter.$view = $(view);
        presenter.model = model;

        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.is_valid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return false;
        }

        presenter.$chart = presenter.$view.find('.chart');
        presenter.$chart.attr('id', presenter.configuration.id);
        presenter.$chart[0].width = presenter.$chart.parent().width();
        presenter.$chart[0].height = presenter.$chart.parent().height();

        if (presenter.$chart.parent().width() < 100 || presenter.$chart.parent().height() < 100) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, 'S01');
            return false;
        }

        presenter.createGraph(presenter.configuration.type, presenter.configuration.labels, presenter.configuration.colors, [0, 0, 0, 0]);

        if (!isPreview && !presenter.configuration.is_disable && presenter.configuration.is_visible) {
            presenter.isWorking = true;
            interval(reDrawChart, presenter.configuration.refresh_time);
        }

        presenter.setVisibility(presenter.configuration.is_visible);
    };

    presenter.run = function(view, model) {
        presenter.presenterLogic(view, model, false);
    };

    presenter.createPreview = function(view, model) {
        presenter.presenterLogic(view, model, true);
    };

    presenter.setVisibility = function(is_visible) {
        presenter.$view.css("visibility", is_visible ? "visible" : "hidden");
    };

//    presenter.setShowErrorsMode = function() {};
//    presenter.setWorkMode = function() {};
//    presenter.reset = function() {};
//    presenter.getErrorCount = function() {};
//    presenter.getMaxScore = function() {};
//    presenter.getScore = function() {};

    presenter.getState = function() {
        presenter.isWorking = true;
    };

    presenter.setState = function() {
        clearTimeout(presenter.time_out);
        presenter.isWorking = false;
    };

    return presenter;
}