function AddonDrawing_create() {

    var presenter = function() {};

    const ModeEnum = {
        pencil: "pencil",
        eraser: "eraser",
        imageEdition: "imageEdition",
        textEdition: "textEdition",
    };

    const AnchorEnum = {
        topLeft: 0,
        topRight: 1,
        bottomLeft: 2,
        bottomRight: 3,
    };

    presenter.playerController = null;
    presenter.imageInputElement = null;

    presenter.$textWrapper = null;

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
    };

    function setDefaultAddonMode() {
        setAddonMode(ModeEnum.pencil);
    }

    function setAddonMode(addonMode) {
        if (isOnTextEditionMode()) {
            presenter.closeTextFieldPopup();
        }
        presenter.configuration.addonMode = addonMode;
    }

    function isOnPencilMode() {
        return presenter.configuration.addonMode === ModeEnum.pencil;
    }

    function isOnEraserMode() {
        return presenter.configuration.addonMode === ModeEnum.eraser;
    }

    function isOnImageEditionMode() {
        return presenter.configuration.addonMode === ModeEnum.imageEdition;
    }

    function isOnTextEditionMode() {
        return presenter.configuration.addonMode === ModeEnum.textEdition;
    }

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

    presenter.points = [];
    presenter.pointerPosition = {x: 0, y: 0};
    presenter.isStarted = false;

    presenter.addedImage = {};
    presenter.draggingAnchor = {
        x: 0,
        y: 0
    };
    presenter.draggingImage = false;
    var pi2 = Math.PI * 2;
    var resizerRadius = 8;
    var rr = resizerRadius * resizerRadius;

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
        if (presenter.playerController) {
            const scaleInformation = presenter.playerController.getScaleInformation();
            if (scaleInformation.baseScaleX !== 1.0 ||
                scaleInformation.baseScaleY !== 1.0 ||
                scaleInformation.scaleX !== 1.0 ||
                scaleInformation.scaleY !== 1.0
            ) {
                return {X: scaleInformation.scaleX, Y: scaleInformation.scaleY};
            }
        }

        const $content = $("#content");
        if ($content.size() > 0) {
            const contentElem = $content[0];
            const scaleX = contentElem.getBoundingClientRect().width / contentElem.offsetWidth;
            const scaleY = contentElem.getBoundingClientRect().height / contentElem.offsetHeight;
            return {X: scaleX, Y: scaleY};
        } else {
            return {X: 1.0, Y: 1.0};
        }
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
        if (isOnPencilMode()) {
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

        presenter.pointerPosition.x = x;
        presenter.pointerPosition.y = y;
        presenter.onPaint(e);
    };

    presenter.onMobileImageEdition = function(e) {
        e.stopPropagation();
        e.preventDefault();
        var tmp_canvas = presenter.configuration.tmp_canvas;

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

        presenter.pointerPosition.x = x;
        presenter.pointerPosition.y = y;
        presenter.onImageEdition(e);
    };

    function anchorHitTest(x, y, image) {

        var dx, dy;
    
        // top-left
        dx = x - image.left;
        dy = y - image.top;
        if (dx * dx + dy * dy <= rr) {
            return AnchorEnum.topLeft;
        }
        // top-right
        dx = x - (image.left + image.width);
        dy = y - image.top;
        if (dx * dx + dy * dy <= rr) {
            return AnchorEnum.topRight;
        }
        // bottom-right
        dx = x - (image.left + image.width);
        dy = y - (image.top + image.height);
        if (dx * dx + dy * dy <= rr) {
            return AnchorEnum.bottomRight;
        }
        // bottom-left
        dx = x - image.left;
        dy = y - (image.top + image.height);
        if (dx * dx + dy * dy <= rr) {
            return AnchorEnum.bottomLeft;
        }
        return (-1);
    }

    function hitImage(x, y, image) {
        return (x > image.left && x < image.left + image.width && y > image.top && y < image.top + image.height);
    }

    function drawDragAnchor(x, y) {

        presenter.configuration.tmp_ctx.beginPath();
        presenter.configuration.tmp_ctx.arc(x, y, resizerRadius, 0, pi2, false);
        presenter.configuration.tmp_ctx.closePath();
        presenter.configuration.tmp_ctx.fill();
    }

    presenter.drawImage = function (tmp_ctx, tmp_canvas, withAnchors, withBorders, image) {
        // clear the canvas
        tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
        // draw image
        tmp_ctx.drawImage(image.image, 0, 0, image.originalWidth, image.originalHeight, image.left, image.top, image.width, image.height);
        
        // optionally draw the draggable anchors
        if (withAnchors) {
            drawDragAnchor(image.left, image.top);
            drawDragAnchor(image.left + image.width, image.top);
            drawDragAnchor(image.left + image.width, image.top + image.height);
            drawDragAnchor(image.left, image.top + image.height);
        }

        // optionally draw the connecting anchor lines
        if (withBorders) {
            tmp_ctx.beginPath();
            tmp_ctx.moveTo(image.left, image.top);
            tmp_ctx.lineTo(image.left + image.width, image.top);
            tmp_ctx.lineTo(image.left + image.width, image.top + image.height);
            tmp_ctx.lineTo(image.left, image.top + image.height);
            tmp_ctx.closePath();
            tmp_ctx.stroke();
        }
    };

    presenter.addImage = function (img) {
        presenter.setEraserOff();
        setAddonMode(ModeEnum.imageEdition);
        var tmp_canvas = presenter.configuration.tmp_canvas;
        var tmp_ctx = presenter.configuration.tmp_ctx;
        var image = {};
        var widthRatio = 1;
        var heightRatio = 1;
        if (img.width > tmp_canvas.width) {
            widthRatio = tmp_canvas.width / img.width;
            heightRatio = widthRatio;
        }
        if (img.height > tmp_canvas.height){
            var tempHeightRatio = tmp_canvas.height / img.height;
            if (Math.fround(tempHeightRatio) < Math.fround(heightRatio))
            {
                widthRatio = tempHeightRatio;
                heightRatio = tempHeightRatio;
            }
        }

        image.width = img.width * widthRatio;
        image.originalWidth = img.width;
        image.height = img.height * heightRatio;
        image.originalHeight = img.height;
        image.left = tmp_canvas.width / 2 - image.width / 2;
        image.top = tmp_canvas.height / 2 - image.height / 2;
        image.image = img;
        image.showUpMoment = presenter.points.length;
        presenter.addedImage = image;
        
        // draw for first time
        tmp_ctx.drawImage(image.image, 0, 0, image.originalWidth, image.originalHeight, image.left, image.top, image.width, image.height);

        drawDragAnchor(image.left, image.top);
        drawDragAnchor(image.left + image.width, image.top);
        drawDragAnchor(image.left + image.width, image.top + image.height);
        drawDragAnchor(image.left, image.top + image.height);
    };

    presenter.embedText = function(textArray, x, y, lineHeight) {
        if (presenter.configuration.font) presenter.configuration.tmp_ctx.font = presenter.configuration.font;
        presenter.configuration.tmp_ctx.clearRect(0, 0, presenter.configuration.tmp_canvas.width, presenter.configuration.tmp_canvas.height);
        presenter.configuration.tmp_ctx.fillStyle = presenter.configuration.color;
        for(var i = 0; i < textArray.length; i++) {
            presenter.configuration.tmp_ctx.fillText(textArray[i], x, y + (i+1) * lineHeight);
        }
        presenter.configuration.context.drawImage(presenter.configuration.tmp_canvas, 0, 0);
        presenter.configuration.tmp_ctx.clearRect(0, 0, presenter.configuration.tmp_canvas.width, presenter.configuration.tmp_canvas.height);
    };

    presenter.onPaint = function(e) {
        e.stopPropagation();
        e.preventDefault();
        var tmp_canvas, tmp_ctx;

        if (isOnPencilMode()) {
            tmp_canvas = presenter.configuration.tmp_canvas;
            tmp_ctx = presenter.configuration.tmp_ctx;
            tmp_ctx.globalAlpha = presenter.configuration.opacity;
        } else if (isOnEraserMode()) {
            tmp_canvas = presenter.configuration.canvas;
            tmp_ctx = presenter.configuration.context;
        }

        tmp_ctx.lineWidth = presenter.configuration.thickness;
        tmp_ctx.lineJoin = 'round';
        tmp_ctx.lineCap = 'round';
        tmp_ctx.strokeStyle = presenter.configuration.color;
        tmp_ctx.fillStyle = presenter.configuration.color;

        presenter.points.push({x: presenter.pointerPosition.x, y: presenter.pointerPosition.y});
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

    presenter.onImageEdition = function(e) {
        e.stopPropagation();
        e.preventDefault();
        var tmp_canvas, tmp_ctx;

        tmp_canvas = presenter.configuration.tmp_canvas;
        tmp_ctx = presenter.configuration.tmp_ctx;
        tmp_ctx.globalAlpha = presenter.configuration.opacity;
        presenter.points.push({x: presenter.pointerPosition.x, y: presenter.pointerPosition.y});
        if (presenter.points.length < 4) {
            presenter.draggingAnchor = anchorHitTest(presenter.points[0].x, presenter.points[0].y, presenter.addedImage);
            presenter.draggingImage = presenter.draggingAnchor < 0 && hitImage(presenter.points[0].x, presenter.points[0].y, presenter.addedImage);
            if( presenter.draggingAnchor == -1 && !presenter.draggingImage){
                presenter.finishEditImageMode(tmp_ctx, tmp_canvas, false);
            }
        } else {
            if (presenter.draggingAnchor > -1) {
                let positionX = presenter.points[presenter.points.length - 1].x;
                let positionY = presenter.points[presenter.points.length - 1].y;
                switch (presenter.draggingAnchor) {                    
                    case AnchorEnum.topLeft:
                        //top-left
                        presenter.addedImage.width = (presenter.addedImage.left + presenter.addedImage.width) - positionX;
                        presenter.addedImage.height = (presenter.addedImage.top + presenter.addedImage.height) - positionY;
                        presenter.addedImage.left = positionX;
                        presenter.addedImage.top = positionY;
                        break;
                    case AnchorEnum.topRight:
                        //top-right
                        presenter.addedImage.width = positionX - presenter.addedImage.left;
                        presenter.addedImage.height = (presenter.addedImage.top + presenter.addedImage.height) - positionY;
                        presenter.addedImage.top = positionY;
                        break;
                    case AnchorEnum.bottomRight:
                        //bottom-right
                        presenter.addedImage.width = positionX - presenter.addedImage.left;
                        presenter.addedImage.height = positionY - presenter.addedImage.top;
                        break;
                    case AnchorEnum.bottomLeft:
                        //bottom-left
                        presenter.addedImage.width = (presenter.addedImage.left + presenter.addedImage.width) - positionX;
                        presenter.addedImage.height = positionY - presenter.addedImage.top;
                        presenter.addedImage.left = positionX;
                        break;
                }

                if(presenter.addedImage.width<25){presenter.addedImage.width=25;}
                if(presenter.addedImage.height<25){presenter.addedImage.height=25;}
                
                presenter.drawImage(tmp_ctx, tmp_canvas, true, true, presenter.addedImage);

            } else if (presenter.draggingImage) {
                var dx = presenter.points[presenter.points.length - 1].x - presenter.points[presenter.points.length - 2].x;
                var dy = presenter.points[presenter.points.length - 1].y - presenter.points[presenter.points.length - 2].y;
                presenter.addedImage.left += dx;
                presenter.addedImage.top += dy;
                // draw the image
                presenter.drawImage(tmp_ctx, tmp_canvas, true, true, presenter.addedImage);
            }
        }
    };

    presenter.removeImage = function (event) {
        if (event.key === "Delete" && presenter.configuration.addonMode === ModeEnum.imageEdition) {
            presenter.finishEditImageMode(
                presenter.configuration.tmp_ctx,
                presenter.configuration.tmp_canvas,
                true
            );
        }
        event.stopPropagation();
    };

    presenter._turnOnEventListeners = function() {
        const tmp_canvas = presenter.configuration.tmp_canvas,
            tmp_ctx = presenter.configuration.tmp_ctx,
            ctx = presenter.configuration.context;


        if (EventsUtils.PointingEvents.hasPointerEventSupport() || !MobileUtils.isEventSupported('touchstart')) {
            presenter._connectPointerEvents(tmp_canvas, tmp_ctx, ctx);
        } else {
            presenter._connectTouchEvents(tmp_canvas, tmp_ctx, ctx);
        }

        tmp_canvas.addEventListener("click", presenter.onTmpCanvasClick, false);

        // KEYBOARD DELETE EDIT IMAGE 
        document.addEventListener("keydown", presenter.removeImage, false);
    };

    presenter.onTmpCanvasClick = function (event) {
        event.stopPropagation();
    };

    presenter.onMobilePaintWithoutPropagation = function (e) {
        e.stopPropagation();
        e.preventDefault();
        presenter.onMobilePaint(e);
    };

    function addImageToCanvasIfOnImageEditionMode(){
        if (isOnImageEditionMode()){
            presenter.finishEditImageMode(presenter.configuration.tmp_ctx, presenter.configuration.tmp_canvas, false);
        }
    }

    presenter.finishEditImageMode = function (tmp_ctx, tmp_canvas, rejectAdding) {
        setDefaultAddonMode();
        setOverflowWorkAround(false);
        tmp_canvas.removeEventListener(EventsUtils.PointingEvents.TYPES.MOVE, presenter.onImageEdition, false);
        tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
        if(!rejectAdding){
            presenter.drawImage(tmp_ctx, tmp_canvas, false, false, presenter.addedImage);
            presenter.configuration.context.drawImage(tmp_canvas, 0, 0);
        }
        tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
        presenter.points = [];
    };

    presenter._connectTouchEvents = function (tmp_canvas, tmp_ctx, ctx) {
        tmp_canvas.addEventListener('touchstart', function (event) {
            setOverflowWorkAround(true);

            if (isOnEraserMode()) {
                presenter.configuration.context.globalCompositeOperation = "destination-out";
            }

            presenter.zoom = getZoom();
            presenter.isStarted = true;
            if (isOnPencilMode() || isOnEraserMode()) {
                presenter.onMobilePaint(event);
                tmp_canvas.addEventListener('touchmove', presenter.onMobilePaintWithoutPropagation);
            } else if (isOnImageEditionMode()) {
                presenter.onMobileImageEdition(event);
                tmp_canvas.addEventListener('touchmove', presenter.onMobileImageEdition);
            } else if (isOnTextEditionMode()) {
                presenter.finishEditTextMode();
            }
        }, false);

        tmp_canvas.addEventListener('touchend', function (event) {
            setOverflowWorkAround(false);

            tmp_canvas.removeEventListener('touchmove', presenter.onMobilePaintWithoutPropagation, false);
            tmp_canvas.removeEventListener('touchmove', presenter.onMobileImageEdition, false);
            
            if (isOnPencilMode() || isOnEraserMode()) {
                ctx.drawImage(tmp_canvas, 0, 0);
                tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
            } else if (isOnImageEditionMode()) {
                tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
                presenter.drawImage(tmp_ctx, tmp_canvas, true, false, presenter.addedImage);
            }
            presenter.points = [];
        }, false);
    };

    presenter._connectPointerEvents = function (tmp_canvas, tmp_ctx, ctx) {
        tmp_canvas.addEventListener(EventsUtils.PointingEvents.TYPES.MOVE, function (event) {
            if (!EventsUtils.PointingEvents.isPrimaryEvent(event) || isOnTextEditionMode()) {
                return;
            }

            event.stopPropagation();
            const position = getPosition(event);
            presenter.pointerPosition.x = position.x;
            presenter.pointerPosition.y = position.y;

            presenter.configuration.tmp_canvas.style.cursor = 'crosshair';
            if (isOnImageEditionMode() && presenter.addedImage.image !== undefined) {
                if (hitImage(position.x, position.y, presenter.addedImage)) {
                    presenter.configuration.tmp_canvas.style.cursor = 'pointer';
                } else {
                    const anchorIndex = anchorHitTest(position.x, position.y, presenter.addedImage);
                    if (anchorIndex == 0 || anchorIndex == 2) {
                        presenter.configuration.tmp_canvas.style.cursor = 'nwse-resize';
                    } else if (anchorIndex == 1 || anchorIndex == 3) {
                        presenter.configuration.tmp_canvas.style.cursor = 'nesw-resize';
                    }

                }
            }
        }, false);

        tmp_canvas.addEventListener(EventsUtils.PointingEvents.TYPES.LEAVE, function (event) {
            if (!EventsUtils.PointingEvents.isPrimaryEvent(event)) {
                return;
            }

            setOverflowWorkAround(false);
            if (isOnPencilMode() || isOnEraserMode()) {
                tmp_canvas.removeEventListener(EventsUtils.PointingEvents.TYPES.MOVE, presenter.onPaint, false);
                ctx.drawImage(tmp_canvas, 0, 0);
                tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
            } else if (isOnImageEditionMode()) {
                tmp_canvas.removeEventListener(EventsUtils.PointingEvents.TYPES.MOVE, presenter.onImageEdition, false);
                tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
                presenter.drawImage(tmp_ctx, tmp_canvas, true, false, presenter.addedImage);
            }
            presenter.points = [];
        });

        tmp_canvas.addEventListener(EventsUtils.PointingEvents.TYPES.DOWN, function (event) {
            if (!EventsUtils.PointingEvents.isPrimaryEvent(event)) {
                return;
            }

            setOverflowWorkAround(true);
            if (isOnEraserMode()) {
                presenter.configuration.context.globalCompositeOperation = "destination-out";
            }

            presenter.zoom = getZoom();
            if (presenter.zoom == "" || presenter.zoom == undefined) {
                presenter.zoom = 1;
            }

            if (isOnPencilMode() || isOnEraserMode()) {
                tmp_canvas.addEventListener(EventsUtils.PointingEvents.TYPES.MOVE, presenter.onPaint, false);
            } else if (isOnImageEditionMode()) {
                tmp_canvas.addEventListener(EventsUtils.PointingEvents.TYPES.MOVE, presenter.onImageEdition, false);
            }
            presenter.isStarted = true;

            const position = getPosition(event);
            presenter.pointerPosition.x = position.x;
            presenter.pointerPosition.y = position.y;
            presenter.points.push(position);

            if (isOnPencilMode() || isOnEraserMode()) {
                presenter.onPaint(event);
            } else if (isOnImageEditionMode()) {
                presenter.onImageEdition(event);
            } else if (isOnTextEditionMode()) {
                presenter.finishEditTextMode();
            }
        }, false);

        tmp_canvas.addEventListener(EventsUtils.PointingEvents.TYPES.UP, function (event) {
            if (!EventsUtils.PointingEvents.isPrimaryEvent(event)) {
                return;
            }

            setOverflowWorkAround(false);
            if (isOnPencilMode() || isOnEraserMode()) {
                tmp_canvas.removeEventListener(EventsUtils.PointingEvents.TYPES.MOVE, presenter.onPaint, false);
                ctx.drawImage(tmp_canvas, 0, 0);
                tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
            } else if (isOnImageEditionMode()) {
                tmp_canvas.removeEventListener(EventsUtils.PointingEvents.TYPES.MOVE, presenter.onImageEdition, false);
                tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
                presenter.drawImage(tmp_ctx, tmp_canvas, true, false, presenter.addedImage);
            }
            presenter.points = [];
        }, false);
    };

    function getPosition(event) {
        let x = typeof event.offsetX !== 'undefined' ? event.offsetX : event.layerX;
        let y = typeof event.offsetY !== 'undefined' ? event.offsetY : event.layerY;

        if (presenter.zoom !== 1) {
            x = x * (1 / parseInt(presenter.zoom, 10));
            y = y * (1 / parseInt(presenter.zoom, 10));
        }

        return {x: x, y: y};
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

    presenter.handleImage = function (e) {
        var reader = new FileReader();
        reader.onload = function(event){
            var img = new Image();
            img.onload = function(){
                presenter.addImage(img);
            }
            img.src = event.target.result;
        }
        if(e.target.files[0]){
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    presenter.upgradeModel = function(model) {
        var upgradedModel = presenter.upgradeFont(model);
        return upgradedModel;
    }

    presenter.upgradeFont = function (model) {
            var upgradedModel = {};
            $.extend(true, upgradedModel, model); // Deep copy of model object

            if (upgradedModel['Font'] === undefined) {
                upgradedModel['Font'] = '';
            }

            return upgradedModel;
        };

    presenter.presenterLogic = function(view, model, isPreview) {
        presenter.view = view;
        presenter.$view = $(view);
        presenter.$pagePanel = presenter.$view.parent().parent('.ic_page_panel');

        var upgradedModel = presenter.upgradeModel(model);
        presenter.model = upgradedModel;

        presenter.configuration = presenter.validateModel(upgradedModel);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        if (presenter.configuration.font.length === 0) presenter.configuration.font = "12px Arial";

        setDefaultAddonMode()
        presenter.configuration.pencilThickness = presenter.configuration.thickness;
        presenter.opacityByDefault = presenter.configuration.opacity;

        var $drawing = presenter.$view.find('.drawing')
        var $canvas = createCanvas()
        $drawing.append($canvas)

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
            presenter._turnOnEventListeners();
            MutationObserverService.createDestroyObserver(presenter.configuration.addonID, presenter.destroy, presenter.view);
            MutationObserverService.setObserver();
        }

        presenter.setVisibility(presenter.configuration.isVisibleByDefault || isPreview);

        presenter.zoom = getZoom();
        if (presenter.zoom == "" || presenter.zoom == undefined) {
            presenter.zoom = 1;
        }
    };

    function createCanvas() {
        var $canvas = $(document.createElement('canvas'));
        $canvas.addClass('canvas');
        $canvas.html('element canvas is not supported by your browser');
        return $canvas
    }

    presenter.setColor = function(color) {
        if (!isOnTextEditionMode()) {
            setDefaultAddonMode();
        }
        if (typeof color === "object") color = color[0];
        presenter.configuration.thickness = presenter.configuration.pencilThickness;
        presenter.configuration.context.globalCompositeOperation = "source-over";
        presenter.configuration.color = presenter.parseColor(color).color;
        presenter.beforeEraserColor = presenter.configuration.color;
        if (presenter.$textWrapper) {
            presenter.$textWrapper.find('textarea').css('color', presenter.configuration.color);
        }
    };

    presenter.setThickness = function(thickness) {
        if (typeof thickness === "object") thickness = thickness[0];

        presenter.configuration.pencilThickness = presenter.parseThickness(thickness).thickness;
        if (isOnPencilMode()) {
            presenter.configuration.thickness = presenter.configuration.pencilThickness;
        }
    };

    presenter.setOpacity = function(opacity) {
        if (typeof opacity === "object") opacity = opacity[0];

        presenter.configuration.opacity = presenter.parseOpacity(opacity).opacity;
    };

    presenter.setFont = function(font) {
        if (font !== undefined) {
            presenter.configuration.font = font;
            if (font) {
                presenter.configuration.tmp_ctx.font = font;
                if (presenter.$textWrapper) {
                    var $textarea = presenter.$textWrapper.find('textarea');
                    var oldWidth = $textarea.css('width');
                    var oldHeight = $textarea.css('height');
                    $textarea.css('font', font);
                    $textarea.css('width', oldWidth);
                    $textarea.css('height', oldHeight);
                }
            }
        }
    };

    presenter.setEraserOff = function () {
        setDefaultAddonMode();
        if (presenter.beforeEraserColor == undefined) {
            presenter.setColor(presenter.configuration.color);
        } else {
            presenter.setColor(presenter.beforeEraserColor);
        }
    };

    presenter.setEraserOn = function() {
        setAddonMode(ModeEnum.eraser);

        presenter.configuration.thickness = presenter.configuration.eraserThickness;
        presenter.configuration.context.globalCompositeOperation = "destination-out";
        presenter.beforeEraserColor = presenter.configuration.color;
    };

    presenter.setEraserThickness = function(thickness) {
        presenter.configuration.eraserThickness = presenter.parseThickness(thickness).thickness;
        if (isOnEraserMode()) {
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
            addonID: model.ID,
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
            isExerciseStarted: false,
            font: model.Font
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

    function setColorToBackgroundTmpCanvas (color) {
        var tmp_ctx = presenter.configuration.tmp_ctx;
        var tmp_canvas = presenter.configuration.tmp_canvas;
        tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
        tmp_ctx.fillStyle = color;
        tmp_ctx.fillRect(0, 0, tmp_canvas.width, tmp_canvas.height);
        tmp_ctx.drawImage(presenter.$view.find("canvas")[0], 0, 0);
    }

    presenter.handleDownloadImage = function () {
        var fillStyle = presenter.configuration.tmp_ctx.fillStyle;
        setColorToBackgroundTmpCanvas('white');

        var canvas = presenter.$view.find("canvas.tmp_canvas")[0], data = canvas.toDataURL("image/png");
        data = data.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
        data = data.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Board.png');
        this.href = data;

        tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
        tmp_ctx.fillStyle = fillStyle;
    }

    presenter.downloadBoard = function () {
        
        var element = document.createElement("a");
        element.setAttribute("id", "dl");
        element.setAttribute("download", "Board.png");
        element.setAttribute("href", "#");
        element.onclick = presenter.handleDownloadImage;
        element.click();
    }

    presenter.executeCommand = function (name, params) {
        if (!presenter.configuration.isValid) {
            return;
        }

        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'setThickness': presenter.setThickness,
            'setColor': presenter.setColor,
            'setOpacity': presenter.setOpacity,
            'setEraserOn': presenter.setEraserOn,
            'setEraserOff': presenter.setEraserOff,
            'setEraserThickness': presenter.setEraserThickness,
            'addText': presenter.addText,
            'setFont': presenter.setFont,
            'uploadImage': presenter.uploadImage,
            'downloadBoard': presenter.downloadBoard
        };

        addImageToCanvasIfOnImageEditionMode();
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

    presenter.uploadImage = function() {
        var element = document.createElement("input");
        $('body')[0].append(element);
        element.style.display = 'none';
        element.setAttribute("id", "importFile");
        element.setAttribute("type", "file");
        element.setAttribute("accept", "image/png,image/jpeg");

        if (presenter.imageInputElement) presenter.imageInputElement.remove();
        presenter.imageInputElement = element;

        element.addEventListener('change', presenter.handleImage);
        element.click();
    }

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

        addImageToCanvasIfOnImageEditionMode();

        var addonMode = presenter.configuration.addonMode,
            color = presenter.configuration.color,
            pencilThickness = presenter.configuration.pencilThickness,
            eraserThickness = presenter.configuration.eraserThickness,
            c = presenter.$view.find("canvas")[0],
            data = c.toDataURL("image/png"),
            font = presenter.configuration.font;

        const textEditorResult = presenter.createTextEditorResult();

        return JSON.stringify({
            addonMode: addonMode,
            color: color,
            pencilThickness: pencilThickness,
            eraserThickness: eraserThickness,
            data: data,
            isVisible: presenter.configuration.isVisible,
            opacity: presenter.configuration.opacity,
            font: font,
            textEditorResult: textEditorResult ? textEditorResult.getState() : null
        });
    };

    presenter.upgradeStateForOpacity = function (parsedState) {
        if (parsedState.opacity == undefined) {
            parsedState.opacity = 0.9;
        }

        return parsedState;
    };

    presenter.upgradeStateForImageAndText = function (parsedState) {
        if (parsedState.font == undefined) {
            parsedState.font = "";
        }

        if (parsedState.addonMode == undefined) {
            if (parsedState.isPencil !== undefined && !parsedState.isPencil) {
                parsedState.addonMode = "eraser";
            } else {
                parsedState.addonMode = "pencil";
            }
        }

        return parsedState;
    }

    presenter.upgradeTextEditorResult = function (parsedState) {
        if (parsedState.textEditorResult == undefined) {
            parsedState.textEditorResult = null;
        }

        return parsedState;
    }

    presenter.upgradeState = function (parsedState) {
        var upgradedState = presenter.upgradeStateForOpacity(parsedState);
        upgradedState = presenter.upgradeStateForImageAndText(upgradedState);
        upgradedState = presenter.upgradeTextEditorResult(upgradedState);
        return upgradedState;
    };

    presenter.setState = function(state) {
        if (ModelValidationUtils.isStringEmpty(state)) {
            return;
        }

        var parsedState = JSON.parse(state);

        parsedState = presenter.upgradeState(parsedState);

        var data = parsedState.data,
            addonMode = parsedState.addonMode,
            color = parsedState.color,
            savedImg = new Image();

        savedImg.onload = function() {
            presenter.configuration.context.drawImage(savedImg, 0, 0);
        };
        savedImg.src = data;

        presenter.configuration.pencilThickness = parsedState.pencilThickness;
        presenter.configuration.eraserThickness = parsedState.eraserThickness;
        presenter.configuration.isVisible = parsedState.isVisible;
        presenter.isStarted = true;
        presenter.configuration.opacity = parsedState.opacity;
        presenter.configuration.addonMode = addonMode;
        const wasTextEditionMode = addonMode === ModeEnum.textEdition;
        if (wasTextEditionMode) {
            setDefaultAddonMode();
        }
        if (isOnPencilMode()) {
            presenter.setColor(color);
        } else {
            presenter.configuration.thickness = presenter.configuration.eraserThickness;
            presenter.configuration.color = "rgba(0, 0, 0, 1)";
        }
        presenter.setVisibility(presenter.configuration.isVisible);
        presenter.beforeEraserColor = color;
        presenter.setFont(parsedState.font);
        if (wasTextEditionMode) {
            if (parsedState.textEditorResult) {
                const textEditorResult = presenter.buildTextEditorResult(
                    parsedState.textEditorResult.brokenText, parsedState.textEditorResult.lineHeight,
                    parsedState.textEditorResult.x, parsedState.textEditorResult.y
                );
                textEditorResult.embed();
            }
        }
    };

    presenter.addText = function() {
        if (!isOnTextEditionMode()) {
            presenter.setEraserOff();
            setAddonMode(ModeEnum.textEdition);
            presenter.displayTextFieldPopup();
        } else {
            presenter.closeTextFieldPopup();
        }
    }

    presenter.displayTextFieldPopup = function() {
        if (presenter.$textWrapper != null) return;
        var $wrapper = $('<div></div>');
        var textareaWidth = 100;
        $wrapper.css('position', 'absolute');
        $wrapper.css('left', Math.round(presenter.configuration.canvas.width()/2 - textareaWidth/2) + 'px');
        $wrapper.css('top', '45%');
        $wrapper.css('padding', '0px');

        var $textHandle = $('<div></div>');
        $textHandle.addClass('text-handle');
        $textHandle.css('display', 'block');
        $textHandle.css('width', '14px');
        $textHandle.css('height', '14px');
        $textHandle.css('position', 'absolute');
        $textHandle.css('left', '-13px');
        $textHandle.css('top', '-13px');
        $textHandle.css('background-color', 'rgb(133,133,133)');
        $textHandle.css('cursor', 'pointer');
        $wrapper.append($textHandle);

        var $closeButton = $('<div>x</div>');
        $closeButton.addClass('text-close');
        $closeButton.css('display', 'block');
        $closeButton.css('color', 'rgb(133,133,133)');
        $closeButton.css('font-size', '16px');
        $closeButton.css('width', '0.6em');
        $closeButton.css('height', '1em');
        $closeButton.css('position', 'absolute');
        $closeButton.css('right', '0px');
        $closeButton.css('top', '-1.2em');
        $closeButton.css('cursor', 'pointer');
        $closeButton.click(presenter.closeTextFieldPopup);
        $wrapper.append($closeButton);

        var $textarea = $('<textarea></textarea>');
        $textarea.css('font',presenter.configuration.font);
        $textarea.css('color',presenter.configuration.color);
        $textarea.css('padding','0px');
        $textarea.css('background-color','#0000');
        $textarea.css('width',textareaWidth + 'px');
        $textarea.on('input', function() {
            presenter.isStarted = true;
            if ($textarea[0].scrollHeight > $textarea[0].clientHeight) {
                $textarea.css('height', $textarea[0].scrollHeight+'px');
            }
        });
        $wrapper.append($textarea);

        presenter.$view.append($wrapper);
        presenter.$textWrapper = $wrapper;
        var scale = getScale();
        $wrapper.draggable({
            handle: ".text-handle",
            containment: "parent",
            drag: function( event, ui ) {
                ui.position.left = ui.position.left / scale.X;
                ui.position.top = ui.position.top / scale.Y;
              }
        });
        $textarea.focus();
    };

    presenter.closeTextFieldPopup = function() {
        if (presenter.$textWrapper != null) {
            presenter.$textWrapper.remove();
            presenter.$textWrapper = null;
            setDefaultAddonMode();
        }
    }

    presenter.finishEditTextMode = function() {
        if (presenter.$textWrapper == null) {
            return;
        }

        const textEditorResult = presenter.createTextEditorResult();
        if (textEditorResult) {
            textEditorResult.embed();
        }

        presenter.closeTextFieldPopup();
    }

    presenter.getLineHeight = function($textarea, lineNumber) {
        var $testArea = $textarea.clone(true);
        $testArea.attr('visibility', 'hidden');
        $textarea.after($testArea);
        $testArea.css('height', '0px');
        var lineHeight = $testArea[0].scrollHeight / lineNumber;
        $testArea.remove();
        return lineHeight;
    }

    presenter.getBrokenText = function($textarea) {
        var $testArea = $textarea.clone(true);
        $testArea.attr('visibility', 'hidden');
        $testArea.attr('wrap', 'off');
        $textarea.after($testArea);
        $testArea.val('');
        var emptyWidth = $testArea[0].scrollWidth;

        var srcTextArray = $textarea.val().split(/\n/);

        function isBrokenText(text) {
            // If a scroll would show up, that means that the text is too long
            // and would end up broken into multiple lines
            $testArea.val(text);
            var result = emptyWidth < $testArea[0].scrollWidth;
            $testArea.val('');
            return result;
        }

        var resultArray = [];

        for (var i = 0; i < srcTextArray.length; i++) {
            var srcText = srcTextArray[i];
            if (srcText.length == 0) {
                // save an empty line and move on
                resultArray.push(srcText);
                continue;
            }
            var wordArray = srcText.match(/[^\s][^\s]*|\s/g); // split the current line we're working on into individual words and whitespaces
            var workString = "";
            for (var j = 0; j < wordArray.length; j++) {
                if (j > 0 && /^\s$/.test(wordArray[j]) && workString.length == 0) {
                    // if a line has been broken due to being too long, the new row should not start with whitespaces
                    continue;
                }
                if (isBrokenText(workString + wordArray[j])) {
                    if (workString.length == 0) {
                        // In this case a single word is too long to fit and needs to be broken into lines
                        var brokenString = "";
                        for (var k = 0; k < wordArray[j].length; k++) {
                            var newLetter = wordArray[j][k];
                            if (isBrokenText(brokenString + newLetter)) {
                                resultArray.push(brokenString);
                                brokenString = newLetter;
                            } else {
                                brokenString += newLetter;
                            }
                        }
                        workString += brokenString;
                    } else {
                        // the new word would cause the work string to exceed line length
                        resultArray.push(workString);
                        if (/^\s$/.test(wordArray[j])) {
                            workString = "";
                        } else {
                            workString = wordArray[j];
                        }
                    }
                } else {
                    workString += wordArray[j];
                }
            }
            if (workString.length > 0) resultArray.push(workString);
        }
        $testArea.remove();
        return resultArray;
    }

    function TextEditorResult (brokenText, lineHeight, x, y) {
        this.brokenText = brokenText;
        this.lineHeight = lineHeight;
        this.x = x;
        this.y = y;
    }

    TextEditorResult.prototype = Object.create(Object.prototype);
    TextEditorResult.prototype.constructor = TextEditorResult;

    TextEditorResult.prototype.embed = function () {
        presenter.embedText(this.brokenText, this.x, this.y, this.lineHeight);
    }

    TextEditorResult.prototype.getState = function () {
        return {
            brokenText: this.brokenText,
            lineHeight: this.lineHeight,
            x: this.x,
            y: this.y,
        }
    }

    presenter.buildTextEditorResult = function (brokenText, lineHeight, x, y) {
        return new TextEditorResult(brokenText, lineHeight, x, y);
    }

    presenter.createTextEditorResult = function() {
        if (presenter.$textWrapper == null) {
            return;
        }
        const $textarea = presenter.$textWrapper.find("textarea");
        const textArray = presenter.getBrokenText($textarea);
        if (textArray.length === 0) {
            return;
        }

        const drawingWrapper = presenter.$view.find(".drawing")[0];
        const x = presenter.$textWrapper[0].offsetLeft - drawingWrapper.offsetLeft + 1;
        const y = presenter.$textWrapper[0].offsetTop - drawingWrapper.offsetTop - 1;
        const lineHeight = presenter.getLineHeight($textarea, textArray.length);
        return presenter.buildTextEditorResult(textArray, lineHeight, x, y);
    }

    presenter.destroy = function (event) {
        if (event.target !== presenter.view) {
            return;
        }

        presenter.configuration.tmp_canvas.removeEventListener("click", presenter.onTmpCanvasClick, false);
        document.removeEventListener("keydown", presenter.removeImage, false);

        if (presenter.imageInputElement) presenter.imageInputElement.remove();
        presenter.closeTextFieldPopup();
    };

    return presenter;
}