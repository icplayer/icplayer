function AddonShape_Tracing_create() {

    var NO_POINT = 0;

    function returnErrorObject(ec) { return { isValid: false, errorCode: ec }; }

    function returnCorrectObject(v) { return { isValid: true, value: v }; }

    function getDistance(p1, p2) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }

    Array.prototype.last = Array.prototype.last || function() {
        return this.length === 0 ? null : this[this.length - 1];
    };

    Array.prototype.removeNeighbourDuplicates = Array.prototype.removeNeighbourDuplicates || function() {
        var result = [], last = null;

        for (var i=0; i<this.length; i++) {
            if (this[i] !== last) {
                result.push(this[i]);
                last = this[i];
            }
        }

        return result;
    };

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
        drawingOpacity: 1,

        pencilThickness: 0,

        shapeImageLoaded: null,
        shapeImageLoadedDeferred: null
    };

    var canvasData = {
        main: { canvas: null, context: null },
        temp: { canvas: null, context: null }
    };

    var points = [];

    presenter.cursorPosition = {
        pre_x: 0,
        pre_y: 0,
        x: 0,
        y: 0
    };

    var LINE_END_SIGN = 'Up';
    var DOT_SIGN = 'Dot';

    var eventBus;
    var isOutsideShape = false;
    var directionPoints = [];

    presenter.pointsArray = [];
    presenter.pointsHistory = [];

    // direction from p1 to p2
    function calculateDrawingDirection(p1, p2) {
        var deltaY = p1.y - p2.y;
        var deltaX = p1.x - p2.x;
        var angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
        /*
            ANGLES:
            N 90
            W 0
            E (180, -180)
            S (-90)
         */
        if (angle >= 112 && angle < 157) {
            return 'NE';
        } else if (angle >= 67 && angle < 112) {
            return 'N';
        } else if (angle >= 22 && angle < 67) {
            return 'NW';
        } else if (angle >= -22 && angle < 22) {
            return 'W';
        } else if (angle >= -67 && angle < -22) {
            return 'SW';
        } else if (angle >= -112 && angle < -67) {
            return 'S';
        } else if (angle >= -157 && angle < -112) {
            return 'SE';
        } else {
            return 'E';
        }

        return false;
    }

    function initPointsArray() {
        for (var i=0; i<presenter.configuration.points.length; i++) {
            presenter.pointsArray.push(i + 1);
        }
    }

    function initCanvasData() {
        canvasData.main.canvas = presenter.$view.find('.drawing-main')[0];
        canvasData.main.context = canvasData.main.canvas.getContext('2d');
        canvasData.temp.canvas = presenter.$view.find('.drawing')[0];
        canvasData.temp.context = canvasData.temp.canvas.getContext('2d');
    }

    function resetCanvas() {
        presenter._turnOffEventListeners();
        $(canvasData.main.canvas).remove();
        $(canvasData.temp.canvas).remove();

        var $main = $('<canvas></canvas>').addClass('drawing-main');
        var $temp = $('<canvas></canvas>').addClass('drawing');

        presenter.$view.find('.shape-tracing-wrapper').append($main);
        presenter.$view.find('.shape-tracing-wrapper').append($temp);

        initCanvasData();
        resizeCanvas(canvasData.main.canvas);
        resizeCanvas(canvasData.temp.canvas);
        presenter._turnOnEventListeners();
    }

    function resetAddon(isPencilActive) {
        presenter._turnOffEventListeners();
        presenter._turnOnEventListeners();

        canvasData.temp.context.clearRect(0, 0, presenter.data.width, presenter.data.height);
        canvasData.main.context.clearRect(0, 0, presenter.data.width, presenter.data.height);

        presenter.data.isAllPointsChecked = presenter.configuration.points.length === 0;
        presenter.data.isPencilActive = isPencilActive;
        presenter.data.isStarted = false;
        presenter.data.currentPointNumber = 1;
        presenter.data.numberOfLines = 0;
        presenter.data.numberOfDescentsFromShape = 0;
        presenter.data.pencilThickness = presenter.configuration.penThickness;
        presenter.data.incorrect = false;
        presenter.data.isAllOk = false;
        directionPoints = [];
        presenter.pointsHistory = [];
        isOutsideShape = false;
        points = [];

        initPointsArray();

        presenter.configuration.color = presenter.data.startColor;

        if (!presenter.configuration.isShowShapeImage && presenter.configuration.isShowShapeImageOnCheck) {
            presenter.layer.hide();
        }

        $(canvasData.temp.canvas).removeClass("correct wrong");
        presenter.setVisibility(presenter.visibleByDefault);
        presenter.configuration.isVisible = presenter.visibleByDefault;

        resetCanvas();

        setOverflowWorkAround(true);
        setOverflowWorkAround(false);
    }

    function createEventObject(_item, _value, _score) {
        return {
            'source': presenter.configuration.ID,
            'item': '' + _item,
            'value': '' + _value,
            'score': '' + _score
        };
    }

    function eventCreator() {
        function sendEventScore(isCorrect) {
            presenter.data.isAllOk = isCorrect;
            eventBus.sendEvent('ValueChanged', createEventObject('allOk', '', isCorrect ? '1' : '0'));
        }

        function sendEventValue(isCorrect) {
            presenter.data.isAllOk = isCorrect;
            eventBus.sendEvent('ValueChanged', createEventObject('', isCorrect ? '1' : '0', ''));
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
            return (r < 250 && g < 250 && b < 250) && a === 255;
//            return (r !== 255 || g !== 255 || b !== 255) && a === 255;
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
        var ctx = presenter.layerBG.getContext('2d');
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
        var parsedColor = Array.isArray(color) ? color[0] : color;

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

    function drawBoxPointerData(box_width, box_height) {
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
        drawBoxPointerData(52, 37);

        presenter.data.shapeImageLoaded.then(function() {
            const moduleSelector = $(`.moduleSelector[data-id="${presenter.configuration.ID}"]`)[0];
            moduleSelector.addEventListener(EventsUtils.PointingEvents.TYPES.MOVE, function(event) {
                if (!EventsUtils.PointingEvents.isPrimaryEvent(event)) {
                    return;
                }
                if (EventsUtils.PointingEvents.hasPointerEventSupport()) {
                    moduleSelector.releasePointerCapture(event.pointerId);
                }

                presenter.text.setText(prepearText(event.offsetX, event.offsetY));
                presenter.layerBG.draw();
            }, false);
        });

        const drawingElement = presenter.view.getElementsByClassName("drawing")[0];
        drawingElement.addEventListener(EventsUtils.PointingEvents.TYPES.MOVE, function(event) {
            if (!EventsUtils.PointingEvents.isPrimaryEvent(event)) {
                return;
            }
            if (EventsUtils.PointingEvents.hasPointerEventSupport()) {
                drawingElement.releasePointerCapture(event.pointerId);
            }
            event.stopPropagation();

            presenter.text.setText(prepearText(event.offsetX, event.offsetY));
            presenter.layerBG.draw();
        }, false);
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

            URLUtils.prepareImageForCanvas(presenter.playerController, backgroundImage, presenter.configuration.backgroundImage);
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
            presenter.data.shapeImageLoadedDeferred.resolve();
        };

        URLUtils.prepareImageForCanvas(presenter.playerController, image, presenter.configuration.shapeImage);
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
                x: 0, y: 0,
                image: correctImage,
                height: presenter.data.height,
                width: presenter.data.width
            });

            presenter.correctAnswerlayer.add(correctImg);
            presenter.stageCorrect.add(presenter.correctAnswerlayer);

            calculateBorderCoordinates();
        };

        URLUtils.prepareImageForCanvas(presenter.playerController, correctImage, presenter.configuration.correctAnswerImage);
    }

    function updateCursorPosition(event) {
        presenter.cursorPosition.pre_x = presenter.cursorPosition.x;
        presenter.cursorPosition.pre_y = presenter.cursorPosition.y;

        var canvas = canvasData.temp.canvas;
        var rect = canvas.getBoundingClientRect();

        const clientX = event.originalEvent ? event.originalEvent.clientX : event.clientX;
        if (clientX !== undefined) {
            const clientY = event.originalEvent ? event.originalEvent.clientY : event.clientY;
            presenter.cursorPosition.x = parseInt((clientX - rect.left) / presenter.data.zoom, 10);
            presenter.cursorPosition.y = parseInt((clientY - rect.top) / presenter.data.zoom, 10);
        } else {
            const targetTouches = event.originalEvent ? event.originalEvent.targetTouches : event.targetTouches;
            presenter.cursorPosition.x = parseInt((targetTouches[0].pageX - $(canvas).offset().left) / presenter.data.zoom, 10);
            presenter.cursorPosition.y = parseInt((targetTouches[0].pageY - $(canvas).offset().top) / presenter.data.zoom, 10);
        }

        directionPoints.push({ x: presenter.cursorPosition.x, y: presenter.cursorPosition.y });
    }

    function upDateCheckPointsHistory(x, y) {
        var point = presenter.data.activePointsPositions[y][x];
        var lastPointInArray = presenter.pointsHistory.last();

        if (point !== lastPointInArray) {
            presenter.pointsHistory.push(point);
        }
    }

    presenter.isShapeCoveredInCircle = function(x, y, r) {
        r = parseInt(r, 10);
        var increase = r < 4 ? r : 4;

        for (var i=y-r; i<=y+r; i += increase) {
            for (var j=x-r; j<=x+r; j += increase) {
                if (i > 0 && j > 0 && j < presenter.data.width && i < presenter.data.height) {
                    if (r * r >= (x-j) * (x-j) + (y-i) * (y-i)) {
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

        for (var i=y-r; i<=y+r; i += 3) {
            for (var j=x-r; j<=x+r; j += 3) {
                if (i > 0 && j > 0 && j < presenter.data.width && i < presenter.data.height) {
                    if (r * r <= (x-j) * (x-j) + (y-i) * (y-i)) {
                        upDateCheckPointsHistory(x, y);

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
        const x = parseInt(presenter.cursorPosition.x, 10);
        const y = parseInt(presenter.cursorPosition.y, 10);
        const point = scalePoint({x: x, y: y});
        if (presenter.isShapeCoveredInCircle(point.x, point.y, presenter.data.pencilThickness / 2)) {
            isOutsideShape = false;
        } else {
            if (!isOutsideShape) {
                presenter.data.numberOfDescentsFromShape++;
                isOutsideShape = true;
            }
        }

        if (presenter.isPositionInDefinedPoint(point.x, point.y, presenter.data.pencilThickness / 2)) {
            presenter.data.currentPointNumber++;
            if (presenter.data.currentPointNumber > presenter.configuration.points.length) {
                presenter.data.isAllPointsChecked = true;
            }
        }
    }

    function scalePoint({x, y}) {
        const scaledPoint = {x: x, y: y};
        if (!presenter.playerController) {
            return scaledPoint;
        }

        const scale = presenter.playerController.getScaleInformation();
        if (scale.scaleX !== 1.0 || scale.scaleY !== 1.0) {
            scaledPoint.x = Math.floor(scaledPoint.x / scale.scaleX);
            scaledPoint.y = Math.floor(scaledPoint.y / scale.scaleY);
        }
        return scaledPoint;
    }

    function draw(e, notPropagate) {
        if (notPropagate) {
            e.stopPropagation();
            e.preventDefault();
        }

        updateCursorPosition(e);

        var ctx = canvasData.temp.context;
        var can = canvasData.temp.canvas;

        ctx.globalAlpha = presenter.data.drawingOpacity;
        ctx.lineWidth = presenter.data.pencilThickness;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = presenter.configuration.color;
        ctx.fillStyle = presenter.configuration.color;


        var point = {x: presenter.cursorPosition.x, y: presenter.cursorPosition.y};
        var scale = presenter.playerController.getScaleInformation();
        if (scale.scaleX !== 1.0 || scale.scaleY !== 1.0) {
            point.x = point.x / scale.scaleX;
            point.y = point.y / scale.scaleY;
        }
        points.push(point);

        if (points.length < 3) {
            ctx.beginPath();
            ctx.arc(points[0].x, points[0].y, presenter.data.pencilThickness / 2, 0, Math.PI * 2, !0);
            ctx.fill();
            ctx.closePath();
        } else {
            ctx.clearRect(0, 0, can.width, can.height);

            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);

            for (var i=1; i<points.length-2; i++) {
                var x = (points[i].x + points[i + 1].x) / 2;
                var y = (points[i].y + points[i + 1].y) / 2;

                ctx.quadraticCurveTo(points[i].x, points[i].y, x, y);
            }

            ctx.quadraticCurveTo(
                points[i].x, points[i].y,
                points[i + 1].x, points[i + 1].y
            );
            ctx.stroke();
        }

        if (presenter.data.isPencilActive) {
            // active only on drawing, disable when eraser
            checkCorrectness();
        }
    }

    presenter._turnOnEventListeners = function () {
        const $canvas = $(canvasData.temp.canvas);
        $canvas.on('click', function(e) {
            e.stopPropagation();
        });

        if (EventsUtils.PointingEvents.hasPointerEventSupport() || !MobileUtils.isEventSupported('touchstart')) {
            presenter._connectPointerEvents($canvas);
        } else {
            presenter._connectTouchEvents($canvas);
        }
    };

    presenter._connectTouchEvents = function ($canvas) {
        var isWorkaroundOn = false;

        $canvas.on('touchstart', function(e) {
            presenter.data.numberOfLines++;

            if (presenter.data.isPencilActive) {
                presenter.data.isStarted = true;
                setOverflowWorkAround(true);
                draw(e, false);
            } else {
                resetAddon(false);
            }
        });

        $canvas.on('touchmove', function(e) {
            if (presenter.data.isPencilActive) {
                presenter.data.isStarted = true;
                if (!isWorkaroundOn) {
                    setOverflowWorkAround(true);
                }
                drawWithoutPropagation(e);
            } else {
                resetAddon(false);
            }

        });

        $canvas.on('touchend', function() {
            if (presenter.data.isPencilActive) {
                eventCreator();
            }

            canvasData.main.context.drawImage(canvasData.temp.canvas, 0, 0);
            canvasData.temp.context.clearRect(0, 0, canvasData.temp.canvas.width, canvasData.temp.canvas.height);

            points = [];
            directionPoints.push('Up');

            setOverflowWorkAround(false);
            isWorkaroundOn = false;
        });
    };
    
    function drawWithoutPropagation (e) {
        draw(e, true);
    }

    presenter._connectPointerEvents = function ($canvas) {
        var isDown = false;

        $canvas.on(EventsUtils.PointingEvents.TYPES.DOWN, function(event) {
            if (!EventsUtils.PointingEvents.isPrimaryEvent(event)) {
                return;
            }
            isDown = true;
            draw(event, false);
            $canvas.on(EventsUtils.PointingEvents.TYPES.MOVE, drawWithoutPropagation);

            if (presenter.data.isPencilActive) {
                presenter.data.isStarted = true;
                presenter.data.numberOfLines++;
            } else {
                resetAddon(false);
            }
        });

        $canvas.on(`${EventsUtils.PointingEvents.TYPES.UP} ${EventsUtils.PointingEvents.TYPES.LEAVE}`, function(event) {
            if (!EventsUtils.PointingEvents.isPrimaryEvent(event)) {
                return;
            }
            $canvas.off(EventsUtils.PointingEvents.TYPES.MOVE, drawWithoutPropagation);
            if (isDown && presenter.data.isPencilActive) {
                eventCreator();
                isDown = false;
            }

            canvasData.main.context.drawImage(canvasData.temp.canvas, 0, 0);
            canvasData.temp.context.clearRect(0, 0, canvasData.temp.canvas.width, canvasData.temp.canvas.height);

            points = [];
        });

        $canvas.on(EventsUtils.PointingEvents.TYPES.UP, function(event) {
            if (!EventsUtils.PointingEvents.isPrimaryEvent(event)) {
                return;
            }
            directionPoints.push('Up');
        });
    };

    presenter._turnOffEventListeners = function () {
        const $canvas = $(canvasData.temp.canvas);
        $canvas.off("touchstart touchend touchmove");
        $canvas.off(`${EventsUtils.PointingEvents.TYPES.DOWN} ${EventsUtils.PointingEvents.TYPES.UP} ${EventsUtils.PointingEvents.TYPES.MOVE} ${EventsUtils.PointingEvents.TYPES.LEAVE}`);
    };

    presenter.ERROR_CODES = {
        SI01: "Property Shape image cannot be empty",

        P02: "Wrong amount of numbers in every line in Points' coordinates property",
        P03: "Points' coordinates are out of canvas range",
        P04: "Non numeric value in points' coordinates property",

        C01: "Wrong value in property: Color",

        T02: "Property Thickness cannot be less then 1 and more then 40",

        O01: "Property Opacity has to be between 0 and 1",

        B01: "Property Border hat to be between 0 and 5"
    };

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
        color = color.trim();
        if (ModelValidationUtils.isStringEmpty(color)) {
            return returnCorrectObject('#000000');
        }

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
            return returnCorrectObject(10);
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
            correctAnswerImage: model["Correct Answer Image"],
            numberOfPoints: validatedPoints.value.length,

            ID: model.ID,
            isVisible: ModelValidationUtils.validateBoolean(model['Is Visible']),
            isValid: true
        }
    };

    function resizeCanvas(elem) {
        var container = $(elem).parent();

        elem.width = container.width();
        elem.height = container.height();
    }

    presenter.presenterLogic = function(view, model, isPreview) {
        presenter.data.shapeImageLoadedDeferred = new $.Deferred();
        presenter.data.shapeImageLoaded = presenter.data.shapeImageLoadedDeferred.promise();

        presenter.view = view;
        presenter.$view = $(view);

        Kinetic.pixelRatio = 1;
        var zoom = $('#_icplayer').css('zoom');
        presenter.data.zoom = zoom == "" || zoom == undefined || isNaN(zoom) ? 1 : zoom;
        presenter.data.width = parseInt(model["Width"], 10);
        presenter.data.height = parseInt(model["Height"], 10);

        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return false;
        }

        presenter.initializeCanvas(isPreview);

        if (!isPreview) {
            presenter._turnOnEventListeners();
        }

        presenter.setVisibility(presenter.configuration.isVisible || isPreview);
        presenter.visibleByDefault = presenter.configuration.isVisible;

        presenter.$view.find('div.correctImage').css('display', 'none');

        return false;
    };

    presenter.initializeCanvas = function(isPreview) {
        initPointsArray();

        presenter.data.isAllPointsChecked = presenter.configuration.points.length === 0;
        presenter.data.pencilThickness = presenter.configuration.penThickness;

        presenter.initActivePointsPositions();

        if (presenter.configuration.border !== 0) {
            presenter.$view.css('border', presenter.configuration.border + 'px solid black');
        }

        presenter.data.divID = presenter.configuration.ID + (isPreview ? "_preview" : "_run");

        presenter.$view.find("div.background").attr('id', presenter.data.divID + "_background");
        presenter.$view.find("div.shape").attr('id', presenter.data.divID + "_shape");
        presenter.$view.find("div.correctImage").attr('id', presenter.data.divID + "_correctImage");

        presenter.$view.css('opacity', presenter.configuration.opacity);

        initCanvasData();

        resizeCanvas(canvasData.main.canvas);
        resizeCanvas(canvasData.temp.canvas);

        drawBackGroundImage(isPreview);
        drawShapeImage(isPreview);

        presenter.data.shapeImageLoaded.then(function() {
            if (presenter.configuration.correctAnswerImage && !isPreview) {
                drawCorrectAnswerImage(isPreview);
            }
        });
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
        presenter.playerController = controller;
        eventBus = controller.getEventBus();
    };

    presenter.setThickness = function(thickness) {
        presenter.data.pencilThickness = parseThickness(thickness).value;
    };

    presenter.setColor = function(color) {
        presenter.data.isPencilActive = true;
        presenter.configuration.color = parseColor(color).value;
    };

    presenter.setEraserOn = function() {
        presenter.data.isPencilActive = false;
    };

    presenter.setEraserOff = function() {
        presenter.data.isPencilActive = true;
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

    presenter.setOpacity = function(opacity) {
        presenter.data.drawingOpacity = parseOpacity(opacity[0]).value;
    };

    presenter.descentsFromShape = function() {
        return presenter.data.numberOfDescentsFromShape;
    };

    presenter.numberOfLines = function() {
        return presenter.data.numberOfLines;
    };

    presenter.pointsMissed = function() {
        var points = presenter.pointsHistory.filter(function(p) { return p !== NO_POINT });
        var result = [];

        for (var i=1; i<presenter.configuration.numberOfPoints+1; i++) {
            if (points.indexOf(i) === -1) {
                result.push(i);
            }
        }

        return result.length;
    };

    function parseLinesToDots(points, distance) {
        function getLineFromIndex(points, index) {
            var result = [];

            for (var i=index; i<points.length; i++) {
                if (points[i] === LINE_END_SIGN) {
                    return result;
                } else {
                    result.push(points[i]);
                }
            }

            return result;
        }

        var result = [], i = 0;

        while (i < points.length) {
            var line = getLineFromIndex(points, i);

            if (line.length === 1 || getDistance(line[0], line.last()) < distance) {
                result.push(DOT_SIGN);
            } else {
                result = result.concat(line);
            }

            result.push(LINE_END_SIGN);

            i += line.length + 1;
        }

        return result;
    }

    presenter.getDirections = function() {
        function hasUndefinedValue() {
            for (var i=0; i<arguments.length; i++) {
                if (arguments[i] === undefined) {
                    return true;
                }
            }

            return false;
        }

        if (directionPoints.length === 0) {
            return [];
        }

        var MIN_DISTANCE = 8;
        directionPoints = parseLinesToDots(directionPoints.removeNeighbourDuplicates(), MIN_DISTANCE);

        var result = [], i = 0,
            p1 = directionPoints[0],
            p2 = directionPoints[1];

        while (i < directionPoints.length-1) {
            while (p1 === LINE_END_SIGN || p1 === DOT_SIGN) {
                result.push(p1);
                i++;
                p1 = directionPoints[i];
                p2 = directionPoints[i + 1];
            }

            if (hasUndefinedValue(p1, p2)) {
                break;
            }

            if (getDistance(p1, p2) > MIN_DISTANCE) {
                result.push(calculateDrawingDirection(p1, p2));
                p1 = directionPoints[i + 1];
            }

            p2 = directionPoints[i + 2];

            while (p2 === LINE_END_SIGN || p2 === DOT_SIGN) {
                result.push(p2);
                i++;
                p1 = directionPoints[i];
                p2 = directionPoints[i + 1];
            }

            i++;
        }

        return result.removeNeighbourDuplicates();
    };

    function getDrawnUniqueValues() {
        var uniqueValues = [];
        var points = presenter.pointsHistory.filter(function(p) { return p !== NO_POINT });

        for (var i = 0; i < points.length; i++) {
            if (uniqueValues.indexOf(points[i]) === -1) {
                uniqueValues.push(points[i]);
            }
        }

        return uniqueValues;
    }

    presenter.isOrderCorrect = function(skipPoints) {
        skipPoints = skipPoints === 'true' || skipPoints === true;

        var i, previous = -1;
        var drawnPoints = getDrawnUniqueValues();
        if (skipPoints) {
            for (i = 0; i < drawnPoints.length; i++) {
                if (previous > drawnPoints[i]) {
                    return false;
                }
                previous = drawnPoints[i];
            }
        } else {
            for (i = 0; i < drawnPoints.length; i++) {
                if (drawnPoints[i] !== i + 1) {
                    return false;
                }
            }
        }

        return true;
    };

    presenter.isOrderCorrectCommand = function(params) {
        return presenter.isOrderCorrect(params[0]);
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
            "setEraserOff": presenter.setEraserOff,
            "setThickness": presenter.setThickness,
            "showAnswers": presenter.showAnswers,
            "hideAnswers": presenter.hideAnswers,
            "setColor": presenter.setColor,
            "setOpacity": presenter.setOpacity,
            "isOrderCorrect": presenter.isOrderCorrectCommand
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

        presenter._turnOffEventListeners();

        if (presenter.data.isStarted) {
            $(canvasData.temp.canvas).addClass(countScore() === 1 ? "correct" : "wrong");
            if (!presenter.configuration.isShowShapeImage && presenter.configuration.isShowShapeImageOnCheck) {
                presenter.layer.show();
            }
        }
    };

    presenter.setWorkMode = function() {
        presenter._turnOffEventListeners();
        presenter._turnOnEventListeners();

        if (!presenter.configuration.isShowShapeImage) {
            presenter.layer.hide();
        }

        $(canvasData.temp.canvas).removeClass("correct wrong");
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
            imgData: canvasData.main.canvas.toDataURL("image/png"),
            isPencilActive: presenter.data.isPencilActive,
            color: presenter.configuration.color,
            currentPointNumber: presenter.data.currentPointNumber,
            numberOfLines: presenter.data.numberOfLines,
            numberOfDescentsFromShape: presenter.data.numberOfDescentsFromShape,
            isAllPointsChecked: presenter.data.isAllPointsChecked,
            isAllOk: presenter.data.isAllOk,
            pointsArray: presenter.pointsArray,
            isVisible: presenter.configuration.isVisible,
            directionPoints: directionPoints
        });
    };

    presenter.upgradeStateForVisibility = function(state) {
        if (state.isVisible === undefined) {
            state.isVisible = true;
        }

        return state;
    };

    presenter.upgradeStateForOpacity = function(state) {
        if (state.opacity === undefined) {
            state.opacity = 0.9;
        }

        return state;
    };

    presenter.upgradeStateForDirectionPoints = function(state) {
        if (state.directionPoints === undefined) {
            state.directionPoints = [];
        }

        return state;
    };

    presenter.upgradeState = function (parsedState) {
        parsedState = presenter.upgradeStateForVisibility(parsedState);
        parsedState = presenter.upgradeStateForOpacity(parsedState);
        parsedState = presenter.upgradeStateForDirectionPoints(parsedState);

        return parsedState;
    };

    presenter.setState = function(state) {
        if (ModelValidationUtils.isStringEmpty(state)) {
            return;
        }

        var parsedState = presenter.upgradeState(JSON.parse(state));

        presenter.data.isStarted = true; // state is non empty => exercise is started
        presenter.data.currentPointNumber = parsedState.currentPointNumber;
        presenter.data.numberOfLines = parsedState.numberOfLines;
        presenter.data.numberOfDescentsFromShape = parsedState.numberOfDescentsFromShape;
        presenter.data.isAllPointsChecked = parsedState.isAllPointsChecked;
        presenter.data.isAllOk = parsedState.isAllOk || false;
        presenter.pointsArray = parsedState.pointsArray;
        presenter.configuration.isVisible = parsedState.isVisible;
        directionPoints = parsedState.directionPoints;

        var savedImg = new Image();
        savedImg.onload = function() {
            canvasData.main.context.drawImage(savedImg, 0, 0);

            presenter.configuration.color = JSON.parse(state).color;
            if (!JSON.parse(state).isPencilActive) {
                presenter.setEraserOn();
            }

            setOverflowWorkAround(true);
            setOverflowWorkAround(false);
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

    presenter.showAnswers = function() {
        presenter.isShowAnswersActive = true;
        presenter.setWorkMode();
        presenter._turnOffEventListeners();

        if (presenter.configuration.correctAnswerImage) {
            presenter.layer.hide();
            presenter.$view.find('.correctImage').css('display', 'block');
        } else {
            presenter.layer.show();
        }

        presenter.$view.find('.background').addClass('shape-tracing-show-answers');
    };

    presenter.hideAnswers = function() {
        if (!presenter.isShowAnswersActive) {
            return;
        }

        presenter.$view.find('.background').removeClass('shape-tracing-show-answers');

        if (presenter.correctAnswerlayer) {
            presenter.$view.find('.correctImage').css('display', 'none');
        }
        if (presenter.configuration.isShowShapeImage) {
            presenter.layer.show();
        } else {
            presenter.layer.hide();
        }
        presenter._turnOffEventListeners();
        presenter._turnOnEventListeners();
        presenter.isShowAnswersActive = false;
    };

    return presenter;
}