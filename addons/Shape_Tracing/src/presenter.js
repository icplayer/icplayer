function AddonShape_Tracing_create() {

    var presenter = function(){};

    presenter.data = {
        divID: "",
        width: 0,
        height: 0,
        zoom: 1,

        startColor: "black",
        borderPositions: [],
        activePointsPositions: [],
        isPencilActive: true,
        isStarted: false,
        isAllPointsChecked: false,
        currentPointNumber: 1,
        numberOfLines: 0,
        numberOfDescentsFromShape: 0,
        isShowErrorOn: false,
        incorrect: false,
        isAllOk: false,

        pencilThickness: 0
    };

    presenter.cursorPosition = {
        pre_x: 0,
        pre_y: 0,
        x: 0,
        y: 0
    };

    var eventBus;
    var isOutsideShape = false;
    presenter.pointsArray = [];

    function initPointsArray() {
        for (var i=0; i<presenter.configuration.points.length; i++) {
            presenter.pointsArray.push(i + 1);
        }
    }

    function resetAddon(isPencilActive) {
        turnOffEventListeners();
        turnOnEventListeners();

        presenter.$view.find(".drawing")[0].getContext("2d").clearRect(0, 0, presenter.data.width, presenter.data.height);

        presenter.data.isAllPointsChecked = presenter.configuration.points.length === 0;
        presenter.data.isPencilActive = isPencilActive;
        presenter.data.isStarted = false;
        presenter.data.currentPointNumber = 1;
        presenter.data.numberOfLines = 0;
        presenter.data.numberOfDescentsFromShape = 0;
        presenter.data.pencilThickness = presenter.configuration.penThickness;
        presenter.data.incorrect = false;
        presenter.configuration.opacity = presenter.opacityByDefault;
        initPointsArray();
        isOutsideShape = false;

        presenter.configuration.color = presenter.data.startColor;
        presenter.beforeEraserColor = isPencilActive ? presenter.configuration.color : presenter.beforeEraserColor;

        if (!presenter.configuration.isShowShapeImage && presenter.configuration.isShowShapeImageOnCheck) {
            presenter.layer.hide();
        }

        presenter.$view.find(".drawing").removeClass("correct wrong");
        presenter.setVisibility(presenter.visibleByDefault);
        presenter.configuration.isVisible = presenter.visibleByDefault;
    }

    function eventCreator() {
        function sendEventScore(isCorrect) {
            presenter.data.isAllOk = isCorrect;
            eventBus.sendEvent('ValueChanged', {
                'source': presenter.configuration.ID,
                'item': 'allOk',
                'value': '',
                'score': isCorrect ? '1' : '0'
            });
        }

        function sendEventValue(isCorrect) {
            presenter.data.isAllOk = isCorrect;
            eventBus.sendEvent('ValueChanged', {
                'source': presenter.configuration.ID,
                'item': '',
                'value': isCorrect ? '1' : '0',
                'score': ''
            });
        }

        var pointsLength = presenter.configuration.points.length;
        var correctNumOfLines = presenter.configuration.numberOfLines;
        var descentsFromShape = presenter.data.numberOfDescentsFromShape;
        var isAllPointsChecked = presenter.data.isAllPointsChecked;

        function isCorrectNumberOfLines() {
            var numOfDrawLines = presenter.data.numberOfLines;
            return numOfDrawLines >= correctNumOfLines[0] && correctNumOfLines[1] <= numOfDrawLines;
        }

        if (pointsLength === 0 && correctNumOfLines.length === 0) {
            if (descentsFromShape === 0) {
                sendEventScore(true);
            } else {
                sendEventValue(false);
            }
        } else if (pointsLength !== 0 && correctNumOfLines.length === 0) {
            if (descentsFromShape === 0 && isAllPointsChecked) {
                sendEventScore(true);
            } else {
                sendEventValue(false);
            }
        } else if (pointsLength === 0 && correctNumOfLines.length !== 0) {
            if (isCorrectNumberOfLines() && descentsFromShape === 0) {
                sendEventScore(true);
            } else {
                sendEventValue(false);
            }
        } else {
            if (isAllPointsChecked && !isCorrectNumberOfLines()) {
                // to remember that user was on all points in incorrect number of lines
                presenter.data.incorrect = true;
            }

            if (isCorrectNumberOfLines() && isAllPointsChecked && descentsFromShape === 0 && !presenter.data.incorrect) {
                sendEventScore(true);
            } else {
                sendEventValue(false);
            }
        }
    }

    presenter.initActivePointsPositions = function() {
        // init 2D array filled with zeros
        for (var col=0; col<presenter.data.height; col++) {
            var row = [];
            for (var ro=0; ro<presenter.data.width; ro++) {
                row.push(0);
            }
            presenter.data.activePointsPositions.push(row);
        }

        // mark o=points on array
        for (var pointNumber=0; pointNumber<presenter.configuration.points.length; pointNumber++) {
            var x = presenter.configuration.points[pointNumber][0];
            var y = presenter.configuration.points[pointNumber][1];
            var r = presenter.configuration.points[pointNumber][2];

            for (var i=y-r; i<=y+r; i++) {
                for (var j=x-r; j<=x+r; j++) {
                    if (i >= 0 && j >= 0 && j < presenter.data.width && i < presenter.data.height) {
                        if (r * r >= (x-j) * (x-j) + (y-i) * (y-i)) {
                            presenter.data.activePointsPositions[i][j] = pointNumber + 1;
                        }
                    }
                }
            }
        }
    };

    function calculateBorderCoordinates() {
        function isBoundaryColor(r, g, b, a) {
            //return (r < 200 && g < 200 && b < 200) && a === 255;
            return (r !== 255 || g !== 255 || b !== 255) && a === 255;
        }

        //var ctx = presenter.layer.getContext('2d');
        var ctx = presenter.layer.getCanvas().getContext();
        var pt = ctx.getImageData(0, 0, presenter.data.width, presenter.data.height);
        var data = pt.data;
        var row;

        for (var y=0; y<presenter.data.height; y++) {
            row = [];
            for (var x=0; x<presenter.data.width; x++) {
                var index = 4 * ((presenter.data.width * y) + x);
                row.push(isBoundaryColor(data[index+0], data[index+1], data[index+2], data[index+3]));
            }
            presenter.data.borderPositions.push(row);
        }
    }

    function showFoundBoundaryPoints() {
        var ctx = presenter.layer.getContext('2d');
        var imgData = ctx.getImageData(0, 0, presenter.data.width, presenter.data.height);

        for (var i=0; i<presenter.data.height; i++) {
            for (var j=0; j<presenter.data.width; j++) {
                if (presenter.data.borderPositions[i][j]) {
                    var index = 4 * (i * presenter.data.width + j);
                    imgData.data[index + 0] = 255;
                    imgData.data[index + 1] = 0;
                    imgData.data[index + 2] = 0;
                    imgData.data[index + 3] = 255;
                }
            }
        }

        ctx.putImageData(imgData, 0, 0, presenter.data.width, presenter.data.height);
    }

    function colorNameToHex(color) {
        var colors = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff","beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887","cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff","darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f","darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1","darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff","firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff","gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f","honeydew":"#f0fff0","hotpink":"#ff69b4","indianred ":"#cd5c5c","indigo ":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c","lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2","lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de","lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6","magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee","mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5","navajowhite":"#ffdead","navy":"#000080","oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6","palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1","saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4","tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0","violet":"#ee82ee","wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5","yellow":"#ffff00","yellowgreen":"#9acd32"};

        var parsedColor;
        if(Array.isArray(color)){
            parsedColor = color[0];
        }else{
            parsedColor = color;
        }

        if (typeof colors[parsedColor.toLowerCase()] !== 'undefined') {
            return colors[parsedColor.toLowerCase()];
        } else {
            return false;
        }
    }

    function drawActivePoints() {
        for (var i=0; i<presenter.configuration.points.length; i++) {
            var point = new Kinetic.Circle({
                x: presenter.configuration.points[i][0],
                y: presenter.configuration.points[i][1],
                radius: presenter.configuration.points[i][2],
                fill: 'rgba(0,255,0,0.25)',
                stroke: 'green',
                strokeWidth: 2
            });
            presenter.layerBG.add(point);
        }

        presenter.stageBG.add(presenter.layerBG);
    }

    function drawBoxMouseData(box_width, box_height) {
        var position = -4;
        presenter.box = new Kinetic.Rect({
            x: position, y: position,
            stroke: '#555',
            fill: '#ddd',
            width: box_width,
            height: box_height,
            cornerRadius: 7,
            opacity: 0.6
        });
        presenter.text = new Kinetic.Text({
            x: position, y: position,
            text: prepearText(0, 0),
            fontSize: 15,
            fontFamily: 'Calibri',
            fill: '#555',
            width: box_width,
            padding: 4,
            align: 'center'
        });

        presenter.layerBG.add(presenter.box);
        presenter.layerBG.add(presenter.text);
        presenter.stageBG.add(presenter.layerBG);
    }

    function prepearText(x, y) {
        function addZerosToNumber(n) {
            switch (n.toString().length) {
                case 1: return "000" + n;
                case 2: return "00" + n;
                case 3: return "0" + n;
                default: return "" + n;
            }
        }

        return "X:" + addZerosToNumber(x) + "\nY:" + addZerosToNumber(y);
    }

    function cursorCoordinates() {
        drawBoxMouseData(50, 37);

        presenter.$view.find(".drawing").on('mousemove', function(e) {
            e.stopPropagation();

            var x = e.offsetX,
                y = e.offsetY;

            presenter.text.setText(prepearText(x, y));
            presenter.layerBG.draw();
        });
    }

    function drawBackGroundImage(isPreview) {
        presenter.stageBG = new Kinetic.Stage({
            container: presenter.data.divID + "_background",
            height: presenter.data.height,
            width: presenter.data.width
        });

        presenter.layerBG = new Kinetic.Layer();
        if (presenter.configuration.backgroundImage !== '') {
            var backgroundImage = new Image();
            backgroundImage.onload = function() {
                var BGimg = new Kinetic.Image({
                    x: 0,
                    y: 0,
                    height: presenter.data.height,
                    width: presenter.data.width,
                    image: backgroundImage
                });

                presenter.layerBG.add(BGimg);
                presenter.stageBG.add(presenter.layerBG);

                if (isPreview) {
                    cursorCoordinates();
                    drawActivePoints();
                }
            };
            //backgroundImage.crossOrigin = "anonymous";
            backgroundImage.src = presenter.configuration.backgroundImage;
        } else {
            if (isPreview) {
                cursorCoordinates();
                drawActivePoints();
            }
        }
    }

    function drawShapeImage(isPreview) {
        presenter.stage = new Kinetic.Stage({
            container: presenter.data.divID + "_shape",
            height: presenter.data.height,
            width: presenter.data.width
        });
        presenter.layer = new Kinetic.Layer();
        var image = new Image();
        image.onload = function() {
            var img = new Kinetic.Image({
                x: 0,
                y: 0,
                image: image,
                height: presenter.data.height,
                width: presenter.data.width
            });

            presenter.layer.add(img);
            presenter.stage.add(presenter.layer);

            calculateBorderCoordinates();

            if (!presenter.configuration.isShowShapeImage) {
                presenter.layer.hide();
            }

            if (isPreview) {
                if (presenter.configuration.isShowFoundBoundaries) {
                    showFoundBoundaryPoints();
                }
            }
        };
        //image.crossOrigin = "anonymous";
        image.src = presenter.configuration.shapeImage;
    }

    function drawCorrectAnswerImage(isPreview) {
        presenter.stageCorrect = new Kinetic.Stage({
        container: presenter.data.divID + "_correctImage",
        height: presenter.data.height,
        width: presenter.data.width
        });
        presenter.correctAnswerlayer = new Kinetic.Layer();
        var correctImage = new Image();
        correctImage.onload = function() {
            var correctImg = new Kinetic.Image({
            x: 0,
            y: 0,
            image: correctImage,
            height: presenter.data.height,
            width: presenter.data.width
        });

        presenter.correctAnswerlayer.add(correctImg);
        presenter.stageCorrect.add(presenter.correctAnswerlayer);

        calculateBorderCoordinates();
    };
    correctImage.src = presenter.configuration.correctAnswerImage;
    //presenter.correctAnswerlayer.hide();&#13;
}

    function updateCursorPosition(e) {
        presenter.cursorPosition.pre_x = presenter.cursorPosition.x;
        presenter.cursorPosition.pre_y = presenter.cursorPosition.y;

        var canvas = presenter.$view.find(".drawing")[0];
        var rect = canvas.getBoundingClientRect();

        if (e.clientX === undefined) {
            presenter.cursorPosition.x = parseInt((event.targetTouches[0].pageX - $(canvas).offset().left) / presenter.data.zoom, 10);
            presenter.cursorPosition.y = parseInt((event.targetTouches[0].pageY - $(canvas).offset().top) / presenter.data.zoom, 10);
        } else {
            presenter.cursorPosition.x = parseInt((e.clientX - rect.left) / presenter.data.zoom, 10);
            presenter.cursorPosition.y = parseInt((e.clientY - rect.top) / presenter.data.zoom, 10);
        }
    }

    presenter.isShapeCoveredInCircle = function(x, y, r) {
        r = parseInt(r, 10);

        for (var i=y-r; i<=y+r; i++) {
            for (var j=x-r; j<=x+r; j++) {
                if (i > 0 && j > 0 && j < presenter.data.width && i < presenter.data.height) {
                    if (r * r <= (x-j) * (x-j) + (y-i) * (y-i)) {
                        if (!presenter.data.borderPositions[i][j]) return false;
                    }
                }
            }
        }

        return true;
    };

    presenter.isThisActivePointAndCheck = function(x, y) {
        // check if point is in array
        var result = presenter.pointsArray.indexOf(presenter.data.activePointsPositions[x][y]) !== -1;

        // remove point from array
        presenter.pointsArray = presenter.pointsArray.filter(function(n) { return n !== presenter.data.activePointsPositions[x][y] });

        return result;
    };

    presenter.isPositionInDefinedPoint = function(x, y, r) {
        r = parseInt(r, 10);

        for (var i=y-r; i<=y+r; i++) {
            for (var j=x-r; j<=x+r; j++) {
                if (i > 0 && j > 0 && j < presenter.data.width && i < presenter.data.height) {
                    if (r * r <= (x-j) * (x-j) + (y-i) * (y-i)) {
                        // if points' order does matter
                        if (presenter.configuration.isCheckPointsOrder) {
                            if (presenter.data.activePointsPositions[i][j] === presenter.data.currentPointNumber) {
                                return true;
                            }
                        // if not then find any point
                        } else {
                            if (presenter.isThisActivePointAndCheck(i, j)) {
                                return true;
                            }
                        }
                    }
                }
            }
        }

        return false;
    };

    function checkCorrectness() {
        var x = parseInt(presenter.mouse.x, 10);
        var y = parseInt(presenter.mouse.y, 10);
        if (presenter.isShapeCoveredInCircle(x, y, presenter.data.pencilThickness / 2)) {
            isOutsideShape = false;
        } else {
            if (!isOutsideShape) {
                presenter.data.numberOfDescentsFromShape++;
                isOutsideShape = true;
            }
        }
        if (presenter.isPositionInDefinedPoint(x, y, presenter.data.pencilThickness / 2)) {
            presenter.data.currentPointNumber++;
            if (presenter.data.currentPointNumber > presenter.configuration.points.length) {
                presenter.data.isAllPointsChecked = true;
            }
        }
    }

    function drawDot() {
        if (presenter.data.isPencilActive) {
            var ctx = presenter.$view.find(".drawing")[0].getContext("2d");
            var grad = ctx.createLinearGradient(0, 0, presenter.data.width, 0);
            grad.addColorStop(0, presenter.configuration.color);
            grad.addColorStop(1, presenter.configuration.color);
            ctx.lineWidth = presenter.data.pencilThickness;

            ctx.beginPath();
            ctx.moveTo(presenter.cursorPosition.x, presenter.cursorPosition.y);
            ctx.lineTo(presenter.cursorPosition.x, presenter.cursorPosition.y + 1);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = grad;
            ctx.stroke();

            // active only on drawing, disable when eraser
            checkCorrectness();
        }
    }

    presenter.onMobilePaint = function(e) {
        var tmp_canvas;
            tmp_canvas = presenter.configuration.tmp_canvas;

        e.preventDefault();
        e.stopPropagation();

        var x = e.targetTouches[0].pageX - $(tmp_canvas).offset().left;
        var y = e.targetTouches[0].pageY - $(tmp_canvas).offset().top;

        presenter.mouse.x = x;
        presenter.mouse.y = y;
        presenter.onPaint(e);
    };

    presenter.onPaint = function(e) {
        var tmp_canvas, tmp_ctx;

        tmp_canvas = presenter.configuration.tmp_canvas;
        tmp_ctx = presenter.configuration.tmp_ctx;
        tmp_ctx.globalAlpha = presenter.configuration.opacity;

        tmp_ctx.lineWidth = presenter.data.pencilThickness;
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

        if (presenter.data.isPencilActive) {
            // active only on drawing, disable when eraser
            checkCorrectness();
        }
    };

    function draw(e) {
        updateCursorPosition(e);

        var ctx = presenter.$view.find(".drawing")[0].getContext("2d");
        var grad = ctx.createLinearGradient(0, 0, presenter.data.width, 0);
        grad.addColorStop(0, presenter.configuration.color);
        grad.addColorStop(1, presenter.configuration.color);
        ctx.lineWidth = presenter.data.pencilThickness;
        ctx.globalAlpha = presenter.configuration.opacity;

        ctx.beginPath();
        ctx.moveTo(presenter.cursorPosition.pre_x, presenter.cursorPosition.pre_y);
        ctx.lineTo(presenter.cursorPosition.x, presenter.cursorPosition.y);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = grad;
        ctx.stroke();

        if (presenter.data.isPencilActive) {
            // active only on drawing, disable when eraser
            checkCorrectness();
        }
    }

    presenter.points = [];
    presenter.mouse = {x: 0, y: 0};

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

    function turnOnEventListeners () {
        presenter.tmp_canvas = presenter.configuration.tmp_canvas;
        presenter.tmp_ctx = presenter.configuration.tmp_ctx;
        presenter.ctx = presenter.configuration.context;
        presenter.isDown = false;

        // TOUCH
        if (MobileUtils.isEventSupported('touchstart')) {
            presenter.tmp_canvas.addEventListener('touchstart', presenter.onTouchStartCallback, false);

            presenter.tmp_canvas.addEventListener('touchend', presenter.onTouchEndEventCallback, false);
        } else {
            // MOUSE
            presenter.tmp_canvas.addEventListener('mousemove', presenter.onMouseMoveCallback, false);

            $(presenter.tmp_canvas).on('mouseleave', presenter.onMouseUpCallback);

            presenter.tmp_canvas.addEventListener('mousedown', presenter.onMouseDownCallback, false);


            presenter.tmp_canvas.addEventListener('mouseup', presenter.onMouseUpCallback, false);

        }

        presenter.tmp_canvas.addEventListener('click', function(e) {
            e.stopPropagation();
        }, false);
    }

    presenter.onMouseDownCallback = function (e) {
        e.stopPropagation();

        setOverflowWorkAround(true);

        if (presenter.data.isPencilActive) {
            presenter.tmp_canvas.addEventListener('mousemove', presenter.onPaint, false);
        }

        var x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
        var y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

        presenter.points.push({x: x, y: y});

        if (presenter.data.isPencilActive) {
            presenter.onPaint(e);
        }
        if (presenter.data.isPencilActive) {
            presenter.data.isStarted = true;
            presenter.data.numberOfLines++;
        } else {
            resetAddon(false);
        }
    };

    presenter.onTouchStartCallback = function (e) {
        e.preventDefault();
        e.stopPropagation();

        setOverflowWorkAround(true);

        if (presenter.data.isPencilActive) {
            presenter.onMobilePaint(e);
            presenter.tmp_canvas.addEventListener('touchmove', presenter.onMobilePaint);
        }
        if (presenter.data.isPencilActive) {
            presenter.data.isStarted = true;
            presenter.data.numberOfLines++;
        } else {
            resetAddon(false);
        }
    };

    presenter.onTouchEndEventCallback = function (e) {
        e.stopPropagation();

        setOverflowWorkAround(false);

        presenter.tmp_canvas.removeEventListener('touchmove', presenter.onMobilePaint, false);
        presenter.ctx.drawImage(presenter.tmp_canvas, 0, 0);
        presenter.tmp_ctx.clearRect(0, 0, presenter.tmp_canvas.width, presenter.tmp_canvas.height);

        presenter.points = [];

        if (presenter.data.isPencilActive) {
            eventCreator();
        }
    };

    presenter.onMouseMoveCallback = function (e) {
        e.stopPropagation();

        var x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
        var y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

        presenter.mouse.x = x;
        presenter.mouse.y = y;
    };

    presenter.onMouseUpCallback = function (e) {
        e.stopPropagation();

        setOverflowWorkAround(false);

        presenter.tmp_canvas.removeEventListener('mousemove', presenter.onPaint, false);
        presenter.ctx.drawImage(presenter.tmp_canvas, 0, 0);
        presenter.tmp_ctx.clearRect(0, 0, presenter.tmp_canvas.width, presenter.tmp_canvas.height);

        presenter.points = [];

        if (presenter.isDown && presenter.data.isPencilActive) {
            eventCreator();
            presenter.isDown = false;
        }
    };

    function turnOffEventListeners() {
        if (MobileUtils.isEventSupported('touchstart')) {
            presenter.tmp_canvas.removeEventListener('touchstart', presenter.onTouchStartCallback, false);
            presenter.tmp_canvas.removeEventListener('touchend', presenter.onTouchEndEventCallback, false);
        }else{
            presenter.tmp_canvas.removeEventListener('mouseup', presenter.onMouseUpCallback, false);
            presenter.tmp_canvas.removeEventListener('mousedown', presenter.onMouseDownCallback, false);
            presenter.tmp_canvas.removeEventListener('mousemove', presenter.onMouseMoveCallback, false);
        }
    }

    presenter.ERROR_CODES = {
        SI01: "Property Shape image cannot be empty",

        P02: "Wrong amount of numbers in every line in Points' coordinates property",
        P03: "Points' coordinates are out of canvas range",
        P04: "Non numeric value in points' coordinates property",

        C01: "Wrong value or empty property Color",

        T01: "Property Thickness cannot be empty",
        T02: "Property Thickness cannot be less then 1 and more then 40",

        O01: "Property Opacity has to be between 0 and 1",

        B01: "Property Border hat to be between 0 and 5"
    };

    function returnErrorObject(ec) {
        return { isValid: false, errorCode: ec };
    }

    function returnCorrectObject(v) {
        return { isValid: true, value: v };
    }

    function parseImage(img) {
        if (ModelValidationUtils.isStringWithPrefixEmpty(img, "/file/")) {
            return returnErrorObject("SI01");
        }

        return returnCorrectObject(img);
    }

    function parseBGImage(BGImage) {
        return returnCorrectObject(BGImage);
    }

    function parseNumberOfLines(lines) {
        if (ModelValidationUtils.isStringEmpty(lines)) {
            return returnCorrectObject([]);
        }

        lines = lines.split(';').map(function (num) { return parseInt(num, 10); });
        lines = lines.length === 1 ? lines.concat(lines) : lines;

        return returnCorrectObject(lines);
    }

    function parsePoints(points) {
        if (ModelValidationUtils.isStringEmpty(points)) {
            return returnCorrectObject([]);
        }

        // e.g. "1;1;1\n2;2;2\n3;3;3" => [[1,1,1], [2,2,2], [3,3,3]]
        points = Helpers.splitLines(points).map(function(line) { return line.split(';').map(function(num){ return parseInt(num, 10) }) });

        for (var i=0, len=points.length; i<len; i++) {
            if (points[i].length !== 3) {
                return returnErrorObject("P02");
            }

            if (points[i][0] < 0 || points[i][1] < 0 || points[i][0] > presenter.data.width || points[i][1] > presenter.data.height) {
                return returnErrorObject("P03");
            }
        }

        return returnCorrectObject(points);
    }

    function parseColor(color) {
        if (color[0] === '#' && !(color.length === 7 || color.length === 4)) {
            return returnErrorObject("C01");
        }

        if (color[0] !== '#') {
            color = colorNameToHex(color);
            if (!color) return returnErrorObject("C01");
        }

        return returnCorrectObject(color);
    }

    function parseThickness(thickness) {
        if (ModelValidationUtils.isStringEmpty(thickness)) {
            return returnErrorObject("T01");
        }

        thickness = parseInt(thickness, 10);

        if (1 > thickness || thickness > 40) {
            return returnErrorObject("T02");
        }

        return returnCorrectObject(thickness);
    }

    function parseOpacity(opacity) {
        opacity = opacity || 1;
        opacity = parseFloat(opacity);

        if (0 > opacity || opacity > 1) {
            return returnErrorObject("O01");
        }

        return returnCorrectObject(opacity);
    }

    function parseBorder(border) {
        border = border || 0;
        border = parseInt(border, 10);

        if (0 > border || border > 5) {
            return returnErrorObject("B01");
        }

        return returnCorrectObject(border);
    }

    presenter.validateModel = function(model) {
        var validatedShapeImage = parseImage(model["Shape image"]);
        if (!validatedShapeImage.isValid) {
            return returnErrorObject(validatedShapeImage.errorCode);
        }

        var validatedBGImage = parseBGImage(model["Background image"]);
        if (!validatedBGImage.isValid) {
            return returnErrorObject(validatedBGImage.errorCode);
        }

        var validatedCorrectNumberOfLines = parseNumberOfLines(model["Correct number of lines"]);
        if (!validatedCorrectNumberOfLines.isValid) {
            return returnErrorObject(validatedCorrectNumberOfLines.errorCode);
        }

        var validatedPoints = parsePoints(model["Points' coordinates"]);
        if (!validatedPoints.isValid) {
            return returnErrorObject(validatedPoints.errorCode);
        }

        var validatedColor = parseColor(model["Color"]);
        if (!validatedColor.isValid) {
            return returnErrorObject(validatedColor.errorCode);
        }

        presenter.data.startColor = validatedColor.value;

        var validatedThickness_Pen = parseThickness(model["Pen Thickness"]);
        if (!validatedThickness_Pen.isValid) {
            return returnErrorObject(validatedThickness_Pen.errorCode);
        }

        var validatedOpacity = parseOpacity(model["Opacity"]);
        if (!validatedOpacity.isValid) {
            return returnErrorObject(validatedOpacity.errorCode);
        }

        var validatedBorder = parseBorder(model["Border"]);
        if (!validatedBorder.isValid) {
            return returnErrorObject(validatedBorder.errorCode);
        }

        var correctAnswerImg = model["Correct Answer Image"];

        return {
            shapeImage: validatedShapeImage.value,
            isShowShapeImage: ModelValidationUtils.validateBoolean(model["Show Shape image"]),
            isShowShapeImageOnCheck: !ModelValidationUtils.validateBoolean(model["Hide Shape image on check"]),
            isShowFoundBoundaries: ModelValidationUtils.validateBoolean(model["Show Boundaries (editor)"]),
            backgroundImage: validatedBGImage.value,
            numberOfLines: validatedCorrectNumberOfLines.value,
            points: validatedPoints.value,
            isCheckPointsOrder: ModelValidationUtils.validateBoolean(model["isPointsOrder"]),
            color: validatedColor.value,
            penThickness: validatedThickness_Pen.value,
            opacity: validatedOpacity.value,
            border: validatedBorder.value,
            correctAnswerImage: correctAnswerImg,

            ID: model["ID"],
            isVisible: ModelValidationUtils.validateBoolean(model['Is Visible']),
            isValid: true
        }
    };

    function resizeCanvas() {
        var con = presenter.$view.find('.drawing').parent(),
            canvas = presenter.$view.find('.drawing')[0];

        canvas.width = con.width();
        canvas.height = con.height();
    }

    presenter.presenterLogic = function(view, model, isPreview) {
        presenter.$view = $(view);

        Kinetic.pixelRatio = 1;
        var zoom = $('#_icplayer').css('zoom');
        presenter.data.zoom = zoom == "" || zoom == undefined || isNaN(zoom) ? 1 : zoom;
        presenter.data.width = parseInt(model["Width"], 10);
        presenter.data.height = parseInt(model["Height"], 10);

        presenter.$view.find('.shape-tracing-wrapper').append("<canvas class='drawing'>element canvas is not supported by your browser</canvas>");

        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return false;
        }

        initPointsArray();

        presenter.data.isAllPointsChecked = presenter.configuration.points.length === 0;
        presenter.data.pencilThickness = presenter.configuration.penThickness;
        presenter.opacityByDefault = presenter.configuration.opacity;

        presenter.initActivePointsPositions();

        if (presenter.configuration.border !== 0) {
            presenter.$view.css('border', presenter.configuration.border + 'px solid black');
        }

        presenter.data.divID = presenter.configuration.ID + (isPreview ? "_preview" : "_run");

        presenter.$view.find("div.background").attr('id', presenter.data.divID + "_background");
        presenter.$view.find("div.shape").attr('id', presenter.data.divID + "_shape");
        presenter.$view.find("div.correctImage").attr('id', presenter.data.divID + "_correctImage");

        presenter.configuration.canvas = presenter.$view.find('.drawing');
        presenter.configuration.context = presenter.configuration.canvas[0].getContext("2d");

        presenter.configuration.tmp_canvas = document.createElement('canvas');
        presenter.configuration.tmp_ctx = presenter.configuration.tmp_canvas.getContext('2d');
        $(presenter.configuration.tmp_canvas).addClass('tmp_canvas');
        presenter.configuration.tmp_canvas.width = presenter.configuration.canvas.width();
        presenter.configuration.tmp_canvas.height = presenter.configuration.canvas.height();

        presenter.$view.find('.shape-tracing-wrapper')[0].appendChild(presenter.configuration.tmp_canvas);


        presenter.$view.css('opacity', presenter.configuration.opacity);

        resizeCanvas();
        drawBackGroundImage(isPreview);
        drawShapeImage(isPreview);

        if(presenter.configuration.correctAnswerImage && !isPreview){
            drawCorrectAnswerImage(isPreview);
        }

        if (!isPreview) {
            turnOnEventListeners();
        }

        presenter.setVisibility(presenter.configuration.isVisible);
        presenter.visibleByDefault = presenter.configuration.isVisible;

        presenter.$view.find('.correctImage').css('display', 'none');

        return false;
    };

    presenter.run = function(view, model) {
        presenter.presenterLogic(view, model, false);

        eventBus.addEventListener('ShowAnswers', this);
        eventBus.addEventListener('HideAnswers', this);
    };

    presenter.createPreview = function(view, model) {
        presenter.presenterLogic(view, model, true);
    };

    presenter.setPlayerController = function(controller) {
        eventBus = controller.getEventBus();
    };

    presenter.setThickness = function(thickness) {
        presenter.data.pencilThickness = parseThickness(thickness).value;
    };

    presenter.setColor = function(color) {
        presenter.data.isPencilActive = true;
        presenter.configuration.color = parseColor(color).value;
        presenter.beforeEraserColor = presenter.configuration.color;
    };

    presenter.setOpacity = function(opacity) {
        presenter.configuration.opacity = parseOpacity(opacity).value;
    };

    presenter.setEraserOn = function() {
        presenter.beforeEraserColor = presenter.configuration.color;
        presenter.data.isPencilActive = false;
    };

    presenter.setEraserOff = function () {
        if(presenter.beforeEraserColor == undefined){
            presenter.setColor(presenter.configuration.color);
        }else{
            presenter.setColor(presenter.beforeEraserColor);
        }
    };

    presenter.setVisibility = function (isVisible) {
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

    presenter.executeCommand = function(name, params) {
        if (!presenter.configuration.isValid) {
            return;
        }

        var commands = {
            "reset": presenter.reset,
            "show": presenter.show,
            "hide": presenter.hide,
            "setEraserOn": presenter.setEraserOn,
            "setThickness": presenter.setThickness,
            "showAnswers": presenter.showAnswers,
            "hideAnswers": presenter.hideAnswers,
            "setColor": presenter.setColor,
            "setOpacity": presenter.setOpacity,
            "setEraserOff": presenter.setEraserOff
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    function countScore() {
        var correctLinesNum = presenter.configuration.numberOfLines;
        var linesNum = presenter.data.numberOfLines;
        var numOfDesc = presenter.data.numberOfDescentsFromShape;

        if (correctLinesNum.length === 0) {
            if (numOfDesc === 0 && presenter.data.isAllPointsChecked) {
                return 1;
            } else {
                return 0;
            }
        } else {
            if (correctLinesNum[0] <= linesNum && linesNum <= correctLinesNum[1] && numOfDesc === 0 && presenter.data.isAllPointsChecked) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    presenter.setShowErrorsMode = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        turnOffEventListeners();

        if (presenter.data.isStarted) {
            var $drawing = presenter.$view.find(".drawing");

            if (countScore() === 1) {
                $drawing.addClass("correct");
            } else {
                $drawing.addClass("wrong");
            }

            if (!presenter.configuration.isShowShapeImage && presenter.configuration.isShowShapeImageOnCheck) {
                presenter.layer.show();
            }
        }
    };

    presenter.setWorkMode = function() {
        turnOffEventListeners();
        turnOnEventListeners();

        if (!presenter.configuration.isShowShapeImage) {
            presenter.layer.hide();
        }

        presenter.$view.find(".drawing").removeClass("correct wrong");
    };

    presenter.reset = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        resetAddon(true);
    };

    presenter.getErrorCount = function() {
        if (!presenter.data.isStarted) {
            return 0;
        }

        return countScore() === 0 ? 1 : 0;
    };

    presenter.getMaxScore = function() {
        return 1;
    };

    presenter.getScore = function() {
        if (!presenter.data.isStarted) {
            return 0;
        }

        return countScore();
    };
    presenter.getState = function() {
        return JSON.stringify({
            imgData: presenter.$view.find(".drawing")[0].toDataURL("image/png"),
            isPencilActive: presenter.data.isPencilActive,
            color: presenter.configuration.color,

            currentPointNumber: presenter.data.currentPointNumber,
            numberOfLines: presenter.data.numberOfLines,
            numberOfDescentsFromShape: presenter.data.numberOfDescentsFromShape,
            isAllPointsChecked: presenter.data.isAllPointsChecked,
            pointsArray: presenter.pointsArray,
            isVisible: presenter.configuration.isVisible,
            opacity: presenter.configuration.opacity,
            beforeEraserColor: presenter.beforeEraserColor
        });
    };

    presenter.upgradeStateForVisibility = function (parsedState) {
        if (parsedState.isVisible == undefined) {
            parsedState.isVisible = true;
        }

        return parsedState;
    };

    presenter.upgradeStateForOpacity = function (parsedState) {
        if (parsedState.opacity == undefined) {
            parsedState.opacity = 0.9;
        }

        return parsedState;
    };

    presenter.upgradeStateForBeforeEraserColor = function (parsedState) {
        if (parsedState.beforeEraserColor == undefined) {
            parsedState.beforeEraserColor = presenter.data.startColor;
        }

        return parsedState;
    };

    presenter.upgradeState = function (parsedState) {
        var upgradedState = presenter.upgradeStateForVisibility(parsedState);
        upgradedState = presenter.upgradeStateForOpacity(upgradedState);
        upgradedState = presenter.upgradeStateForBeforeEraserColor(upgradedState);

        return  upgradedState;
    };

    presenter.setState = function(state) {
        if (ModelValidationUtils.isStringEmpty(state)) {
            return;
        }

        var parsedState = JSON.parse(state);

        parsedState = presenter.upgradeState(parsedState);

        presenter.data.isStarted = true; // state is non empty => exercise is started
        presenter.data.currentPointNumber = JSON.parse(state).currentPointNumber;
        presenter.data.numberOfLines = JSON.parse(state).numberOfLines;
        presenter.data.numberOfDescentsFromShape = JSON.parse(state).numberOfDescentsFromShape;
        presenter.data.isAllPointsChecked = JSON.parse(state).isAllPointsChecked;
        presenter.pointsArray = JSON.parse(state).pointsArray;
        presenter.configuration.isVisible = parsedState.isVisible;
        presenter.configuration.opacity = parsedState.opacity;

        var savedImg = new Image();
        savedImg.onload = function() {
            presenter.$view.find(".drawing")[0].getContext("2d").drawImage(savedImg, 0, 0);

            presenter.configuration.color = JSON.parse(state).color;
            if (!JSON.parse(state).isPencilActive) {
                presenter.setEraserOn();
            }
            presenter.beforeEraserColor = parsedState.beforeEraserColor;
        };
        savedImg.src = JSON.parse(state).imgData;
        presenter.setVisibility(presenter.configuration.isVisible);
    };

    presenter.isAllOk = function() {
        return presenter.data.isAllOk;
    };

    presenter.onEventReceived = function (eventName) {
        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        }

        if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        }
    };

    presenter.showAnswers = function () {
        presenter.isShowAnswersActive = true;
        presenter.setWorkMode();
        turnOffEventListeners();

        presenter.$view.find(".drawing").css('display', 'none');

        if(presenter.configuration.correctAnswerImage){
            presenter.layer.hide();
            presenter.$view.find('.correctImage').css('display', 'block');
        }else{
            presenter.layer.show();
        }

        presenter.$view.find('.background').addClass('shape-tracing-show-answers');
    };

    presenter.hideAnswers = function () {
        presenter.$view.find('.background').removeClass('shape-tracing-show-answers');

        if(presenter.correctAnswerlayer){
            presenter.$view.find('.correctImage').css('display', 'none');
        }
        if (presenter.configuration.isShowShapeImage) {
            presenter.layer.show();
        }else{
            presenter.layer.hide();
        }
        presenter.$view.find(".drawing").css('display', 'block');
        turnOffEventListeners();
        turnOnEventListeners();
        presenter.isShowAnswersActive = false;
    };

    return presenter;
}
