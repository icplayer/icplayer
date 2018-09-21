function AddonDrawing_create() {

    var presenter = function() {};

    // work-around for double line in android browser
    function setOverflowWorkAround(turnOn) {

        if (!MobileUtils.isAndroidWebBrowser(window.navigator.userAgent)) { return false; }

        var android_ver = MobileUtils.getAndroidVersion(window.navigator.userAgent);
        if (["4.1.1", "4.1.2", "4.2.2", "4.3", "4.4.2"].indexOf(android_ver) !== -1) {

            presenter.$view.parents("*").each(function() {
                var overflow = null;
                if (turnOn) {
                    $(this).attr("data-overflow", $(this).css("overflow"));
                    $(this).css("overflow", "visible");
                } else {
                    overflow = $(this).attr("data-overflow");
                    if (overflow !== "") {
                        $(this).css("overflow", overflow);
                    }
                    $(this).removeAttr("data-overflow");
                }
            });

        }

        return true;
    }

    var element;

    presenter.points = [];
    presenter.mouse = {x: 0, y: 0};
    presenter.isStarted = false;

    function getZoom() {
        var val = $('#_icplayer').css('zoom');
        if (val == "normal" || val == "") { // IE 11
            val = 1;
        }

        val = parseInt(val, 10);
        if (val == NaN || val == undefined) {
            val = 1;
        }
        return val;
    }

    function getScale() {
        var $content = $("#content"); // the div transform css is attached to
		if($content.size()>0){
            var contentElem = $content[0];
            var scaleX = contentElem.getBoundingClientRect().width / contentElem.offsetWidth;
            var scaleY = contentElem.getBoundingClientRect().height / contentElem.offsetHeight;
            return {X:scaleX, Y:scaleY};
		};
		return {X:1.0, Y:1.0};
    }

    presenter.hexToRGBA = function(hex, opacity) {
        hex = hex.replace('#', '');
        var r = parseInt(hex.substring(0,2), 16);
        var g = parseInt(hex.substring(2,4), 16);
        var b = parseInt(hex.substring(4,6), 16);

        return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
    };

    presenter.colourNameToHex = function(color) {

        var colors = {
            "aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff","beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887","cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff","darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f","darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1","darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff","firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff","gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f","honeydew":"#f0fff0","hotpink":"#ff69b4","indianred ":"#cd5c5c","indigo ":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c","lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2","lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de","lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6","magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee","mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5","navajowhite":"#ffdead","navy":"#000080","oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6","palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1","saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4","tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0","violet":"#ee82ee","wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5","yellow":"#ffff00","yellowgreen":"#9acd32"
        };

        if (typeof colors[color.toLowerCase()] !== 'undefined') {
            return colors[color.toLowerCase()];
        }

        return false;
    };

    presenter.onMobilePaint = function(e) {
        e.stopPropagation();
        e.preventDefault();
        var tmp_canvas;
        if (presenter.configuration.isPencil) {
            tmp_canvas = presenter.configuration.tmp_canvas;
        } else {
            tmp_canvas = presenter.configuration.canvas;
        }

        var x = e.targetTouches[0].pageX - $(tmp_canvas).offset().left;
        var y = e.targetTouches[0].pageY - $(tmp_canvas).offset().top;

        if (presenter.zoom !== 1) {
            x = x * (1 / presenter.zoom);
            y = y * (1 / presenter.zoom);
        }

        var scale = getScale();
        if(scale.X!==1.0 || scale.Y!==1.0){
            x = x/scale.X;
            y = y/scale.Y;
        }

        presenter.mouse.x = x;
        presenter.mouse.y = y;
        presenter.onPaint(e);
    };

    presenter.onPaint = function(e) {
        e.stopPropagation();
        e.preventDefault();
        var tmp_canvas, tmp_ctx;

        if (presenter.configuration.isPencil) {
            tmp_canvas = presenter.configuration.tmp_canvas;
            tmp_ctx = presenter.configuration.tmp_ctx;
            tmp_ctx.globalAlpha = presenter.configuration.opacity;
        } else {
            tmp_canvas = presenter.configuration.canvas;
            tmp_ctx = presenter.configuration.context;
        }

        tmp_ctx.lineWidth = presenter.configuration.thickness;
        tmp_ctx.lineJoin = 'round';
        tmp_ctx.lineCap = 'round';
        tmp_ctx.strokeStyle = presenter.configuration.color;
        tmp_ctx.fillStyle = presenter.configuration.color;

        presenter.points.push({x: presenter.mouse.x, y: presenter.mouse.y});

        if (presenter.points.length < 3) {
            var b = presenter.points[0];
            tmp_ctx.beginPath();
            tmp_ctx.arc(b.x, b.y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
            tmp_ctx.fill();
            tmp_ctx.closePath();
        } else {
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

            tmp_ctx.beginPath();
            tmp_ctx.moveTo(presenter.points[0].x, presenter.points[0].y);

            for (var i = 1; i < presenter.points.length - 2; i++) {
                var c = (presenter.points[i].x + presenter.points[i + 1].x) / 2;
                var d = (presenter.points[i].y + presenter.points[i + 1].y) / 2;

                tmp_ctx.quadraticCurveTo(presenter.points[i].x, presenter.points[i].y, c, d);
            }

            tmp_ctx.quadraticCurveTo(
                presenter.points[i].x,
                presenter.points[i].y,
                presenter.points[i + 1].x,
                presenter.points[i + 1].y
            );
            tmp_ctx.stroke();
        }
    };

    presenter.turnOnEventListeners = function() {
        var tmp_canvas = presenter.configuration.tmp_canvas,
            tmp_ctx = presenter.configuration.tmp_ctx,
            ctx = presenter.configuration.context;

        // TOUCH
        if (MobileUtils.isEventSupported('touchstart')) {
            connectTouchEvents(tmp_canvas, tmp_ctx, ctx);
        }

        // MOUSE
        connectMouseEvents(tmp_canvas, tmp_ctx, ctx);

        tmp_canvas.addEventListener('click', function(e) {
            e.stopPropagation();
        }, false);
    };

    presenter.onMobilePaintWithoutPropagation = function (e) {
        e.stopPropagation();
        e.preventDefault();
        presenter.onMobilePaint(e);
    };

    function connectTouchEvents(tmp_canvas, tmp_ctx, ctx) {
        tmp_canvas.addEventListener('touchstart', function (e) {
            setOverflowWorkAround(true);

            if (!presenter.configuration.isPencil) {
                presenter.configuration.context.globalCompositeOperation = "destination-out";
            }

            presenter.zoom = getZoom();
            presenter.isStarted = true;
            presenter.onMobilePaint(e);
            tmp_canvas.addEventListener('touchmove', presenter.onMobilePaintWithoutPropagation);
        }, false);

        tmp_canvas.addEventListener('touchend', function (e) {
            setOverflowWorkAround(false);

            tmp_canvas.removeEventListener('touchmove', presenter.onMobilePaintWithoutPropagation, false);
            ctx.drawImage(tmp_canvas, 0, 0);
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

            presenter.points = [];
        }, false);
    }

    function connectMouseEvents(tmp_canvas, tmp_ctx, ctx) {
        tmp_canvas.addEventListener('mousemove', function (e) {
            e.stopPropagation();

            var x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            var y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

            if (presenter.zoom !== 1) {
                x = x * (1 / parseInt(presenter.zoom, 10));
                y = y * (1 / parseInt(presenter.zoom, 10));
            }

            presenter.mouse.x = x;
            presenter.mouse.y = y;

        }, false);

        $(tmp_canvas).on('mouseleave', function (e) {
            setOverflowWorkAround(false);

            tmp_canvas.removeEventListener('mousemove', presenter.onPaint, false);
            ctx.drawImage(tmp_canvas, 0, 0);
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

            presenter.points = [];
        });

        tmp_canvas.addEventListener('mousedown', function (e) {
            setOverflowWorkAround(true);

            if (!presenter.configuration.isPencil) {
                presenter.configuration.context.globalCompositeOperation = "destination-out";
            }

            presenter.zoom = getZoom();
            if (presenter.zoom == "" || presenter.zoom == undefined) {
                presenter.zoom = 1;
            }

            tmp_canvas.addEventListener('mousemove', presenter.onPaint, false);
            presenter.isStarted = true;

            var x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            var y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

            if (presenter.zoom !== 1) {
                x = x * (1 / presenter.zoom);
                y = y * (1 / presenter.zoom);
            }

            presenter.points.push({x: x, y: y});

            presenter.onPaint(e);
        }, false);

        tmp_canvas.addEventListener('mouseup', function (e) {
            setOverflowWorkAround(false);

            tmp_canvas.removeEventListener('mousemove', presenter.onPaint, false);
            ctx.drawImage(tmp_canvas, 0, 0);
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

            presenter.points = [];
        }, false);
    }

    function getErrorObject(ec) { return { isValid: false, errorCode: ec }; }

    presenter.ERROR_CODES = {
        C01: 'Property color cannot be empty',
        C02: 'Property color has wrong length in hex format, should be # and 6 digits [0 - F]',
        C03: 'Property color has wrong color name',

        T01: 'Property thickness cannot be empty',
        T02: 'Property thickness cannot be smaller than 1',
        T03: 'Property thickness cannot be bigger than 40',

        B01: 'Property border cannot be empty',
        B02: 'Property border cannot be smaller than 0',
        B03: 'Property border cannot be bigger than 5',

        O01: 'Property opacity cannot be empty',
        O02: 'Property opacity cannot be smaller than 0',
        O03: 'Property opacity cannot be bigger than 1'
    };

    presenter.run = function(view, model) {
        presenter.presenterLogic(view, model, false);
    };

    presenter.createPreview = function(view, model) {
        presenter.presenterLogic(view, model, true);
    };

    function resizeCanvas() {
        var con = presenter.$view.find('.drawing').parent(),
            canvas = presenter.configuration.canvas[0];

        canvas.width = con.width();
        canvas.height = con.height();
    }

    presenter.presenterLogic = function(view, model, isPreview) {
        presenter.$view = $(view);
        presenter.model = model;

        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        presenter.configuration.isPencil = true;
        presenter.configuration.pencilThickness = presenter.configuration.thickness;
        presenter.opacityByDefault = presenter.configuration.opacity;

        presenter.$view.find('.drawing').append("<canvas class='canvas'>element canvas is not supported by your browser</canvas>");

        var border = presenter.configuration.border;

        presenter.configuration.canvas = presenter.$view.find('canvas');
        presenter.configuration.context = presenter.configuration.canvas[0].getContext("2d");

        $(presenter.$view.find('.drawing')[0]).css('opacity', presenter.configuration.opacity);
        resizeCanvas();

        presenter.configuration.tmp_canvas = document.createElement('canvas');
        presenter.configuration.tmp_ctx = presenter.configuration.tmp_canvas.getContext('2d');
        $(presenter.configuration.tmp_canvas).addClass('tmp_canvas');
        presenter.configuration.tmp_canvas.width = presenter.configuration.canvas.width();
        presenter.configuration.tmp_canvas.height = presenter.configuration.canvas.height();

        presenter.$view.find('.drawing')[0].appendChild(presenter.configuration.tmp_canvas);

        if (presenter.configuration.border !== 0) {
            presenter.$view.find('canvas').css('border', border + 'px solid black');
        }

        if (!isPreview) {
            presenter.turnOnEventListeners();
        }

        presenter.setVisibility(presenter.configuration.isVisibleByDefault || isPreview);
    };

    presenter.setColor = function(color) {
        if (typeof color === "object") color = color[0];

        presenter.configuration.isPencil = true;
        presenter.configuration.thickness = presenter.configuration.pencilThickness;
        presenter.configuration.context.globalCompositeOperation = "source-over";
        presenter.configuration.color = presenter.parseColor(color).color;
        presenter.beforeEraserColor = presenter.configuration.color;
    };

    presenter.setThickness = function(thickness) {
        if (typeof thickness === "object") thickness = thickness[0];

        presenter.configuration.pencilThickness = presenter.parseThickness(thickness).thickness;
        if (presenter.configuration.isPencil) {
            presenter.configuration.thickness = presenter.configuration.pencilThickness;
        }
    };

    presenter.setOpacity = function(opacity) {
        if (typeof opacity === "object") opacity = opacity[0];

        presenter.configuration.opacity = presenter.parseOpacity(opacity).opacity;
    };

    presenter.setEraserOff = function () {
        if (presenter.beforeEraserColor == undefined) {
            presenter.setColor(presenter.configuration.color);
        } else {
            presenter.setColor(presenter.beforeEraserColor);
        }
    };

    presenter.setEraserOn = function() {
        presenter.configuration.isPencil = false;

        presenter.configuration.thickness = presenter.configuration.eraserThickness;

        presenter.configuration.context.globalCompositeOperation = "destination-out";
        presenter.beforeEraserColor = presenter.configuration.color;
    };

    presenter.setEraserThickness = function(thickness) {
        presenter.configuration.eraserThickness = presenter.parseThickness(thickness).thickness;
        if (!presenter.configuration.isPencil) {
            presenter.configuration.thickness = presenter.configuration.eraserThickness;
        }
    };

    presenter.validateModel = function(model) {

        if (ModelValidationUtils.isStringEmpty(model.Color)) {
            return getErrorObject('C01');
        }

        var parsedColor = presenter.parseColor(model.Color);
        if (!parsedColor.isValid) {
            return getErrorObject(parsedColor.errorCode);
        }

        if (ModelValidationUtils.isStringEmpty(model.Thickness)) {
            return getErrorObject('T01');
        }

        var parsedThickness = presenter.parseThickness(model.Thickness);
        if (!parsedThickness.isValid) {
            return getErrorObject(parsedThickness.errorCode);
        }

        if (ModelValidationUtils.isStringEmpty(model.Border)) {
            return getErrorObject('B01');
        }

        var parsedBorder = presenter.parseBorder(model.Border);
        if (!parsedBorder.isValid) {
            return getErrorObject(parsedBorder.errorCode);
        }

        if (ModelValidationUtils.isStringEmpty(model.Opacity)) {
            return getErrorObject('O01');
        }

        var parsedOpacity = presenter.parseOpacity(model.Opacity);
        if (!parsedOpacity.isValid) {
            return getErrorObject(parsedOpacity.errorCode);
        }

        var isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);

        return {
            color: parsedColor.color,
            thickness: parsedThickness.thickness,
            border: parsedBorder.border,
            opacity: parsedOpacity.opacity,

            canvas: null,
            context: null,

            width: model.Width,
            height: model.Height,
            isValid: true,
            isVisible: isVisible,
            isVisibleByDefault: isVisible,
            isExerciseStarted: false
        };
    };

    presenter.parseColor = function(color) {

        if (color[0] === '#' && !(color.length === 7)) {
            return getErrorObject('C02');
        }

        if (color[0] !== '#') {
            color = presenter.colourNameToHex(color);
        }

        if (!color) {
            return getErrorObject('C03');
        }

        return {
            color: color,
            isValid: true
        };

    };

    presenter.parseThickness = function(thickness) {

        if (thickness < 1) {
            return getErrorObject('T02');
        }

        if (thickness > 40) {
            return getErrorObject('T03');
        }

        return {
            thickness: thickness,
            isValid: true
        };

    };

    presenter.parseBorder = function(border) {

        if (border < 0) {
            return getErrorObject('B02');
        }

        if (border > 5) {
            return getErrorObject('B03');
        }

        return {
            border: border,
            isValid: true
        };

    };

    presenter.parseOpacity = function(opacity) {
        if (opacity < 0) {
            return getErrorObject('O02');
        }

        if (opacity > 1) {
            return getErrorObject('O03');
        }

        return {
            opacity: opacity,
            isValid: true
        };
    };

    presenter.executeCommand = function(name, params) {
        if (!presenter.configuration.isValid) {
            return;
        }

        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'setColor': presenter.setColor,
            'setThickness': presenter.setThickness,
            'setEraserOn': presenter.setEraserOn,
            'setEraserThickness': presenter.setEraserThickness,
            'setOpacity': presenter.setOpacity,
            'setEraserOff': presenter.setEraserOff
        };

        Commands.dispatch(commands, name, params, presenter);
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

    presenter.reset = function() {
        presenter.configuration.context.clearRect(0, 0, presenter.configuration.canvas[0].width, presenter.configuration.canvas[0].height);
        presenter.isStarted = false;

        presenter.setColor(presenter.model.Color);
        presenter.setThickness(presenter.model.Thickness);
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);
        presenter.configuration.opacity = presenter.opacityByDefault;
        presenter.beforeEraserColor = presenter.configuration.color;

        setOverflowWorkAround(true);
        setOverflowWorkAround(false);
    };

    presenter.getState = function() {
        if (!presenter.isStarted) {
            return;
        }

        var isPencil = presenter.configuration.isPencil,
            color = presenter.configuration.color,
            pencilThickness = presenter.configuration.pencilThickness,
            eraserThickness = presenter.configuration.eraserThickness,
            c = presenter.$view.find("canvas")[0],
            data = c.toDataURL("image/png");

        return JSON.stringify({
            isPencil: isPencil,
            color: color,
            pencilThickness: pencilThickness,
            eraserThickness: eraserThickness,
            data: data,
            isVisible: presenter.configuration.isVisible,
            opacity: presenter.configuration.opacity
        });
    };

    presenter.upgradeStateForOpacity = function (parsedState) {
        if (parsedState.opacity == undefined) {
            parsedState.opacity = 0.9;
        }

        return parsedState;
    };

    presenter.upgradeState = function (parsedState) {
        return presenter.upgradeStateForOpacity(parsedState);
    };

    presenter.setState = function(state) {
        if (ModelValidationUtils.isStringEmpty(state)) {
            return;
        }

        var parsedState = JSON.parse(state);

        parsedState = presenter.upgradeState(parsedState);

        var data = JSON.parse(state).data,
            isPencil = JSON.parse(state).isPencil,
            color = JSON.parse(state).color,
            savedImg = new Image();

        savedImg.onload = function() {
            presenter.configuration.context.drawImage(savedImg, 0, 0);
        };
        savedImg.src = data;

        presenter.configuration.pencilThickness = JSON.parse(state).pencilThickness;
        presenter.configuration.eraserThickness = JSON.parse(state).eraserThickness;
        presenter.configuration.isVisible = JSON.parse(state).isVisible;
        presenter.configuration.isPencil = isPencil;
        presenter.isStarted = true;
        presenter.configuration.opacity = parsedState.opacity;

        if (isPencil) {
            presenter.setColor(color);
        } else {
            presenter.configuration.thickness = presenter.configuration.eraserThickness;
            presenter.configuration.color = "rgba(0, 0, 0, 1)";
        }
        presenter.setVisibility(presenter.configuration.isVisible);
        presenter.beforeEraserColor = color;
    };

    return presenter;
}