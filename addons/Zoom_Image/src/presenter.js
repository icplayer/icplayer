function AddonZoom_Image_create() {

    var presenter = function() {};

    function setSmallImage(url) {
        var $image = $('<img class="small">');
        $image.attr("src", url);
        $image.attr("height", presenter.configuration.height);
        $image.attr("width", presenter.configuration.width);
        presenter.$view.find("div.content").append($image);
    }

    presenter.ERROR_CODES = {
        IMAGE01: "Property Full Screen image and Page image cannot be empty"
    };

    function returnErrorObject(ec) { return { isValid: false, errorCode: ec }; }

    function returnCorrectObject(v) { return { isValid: true, value: v }; }

    function parseImage(image) {
        if (ModelValidationUtils.isStringWithPrefixEmpty(image, "/file/")) {
            return returnErrorObject("IMAGE01");
        }

        return returnCorrectObject(image);
    }

    presenter.validateModel = function(model) {

        var validatedBigImage = parseImage(model["Full Screen image"]);
        if (!validatedBigImage.isValid) {
            return returnErrorObject(validatedBigImage.errorCode);
        }

        var validatedSmallImage = parseImage(model["Page image"]);
        if (!validatedSmallImage.isValid) {
            return returnErrorObject(validatedSmallImage.errorCode);
        }

        return {
            bigImage: validatedBigImage.value,
            smallImage: validatedSmallImage.value,

            ID: model.ID,
            width: parseInt(model["Width"], 10),
            height: parseInt(model["Height"], 10),
            isVisible: ModelValidationUtils.validateBoolean(model['Is Visible']),
            isValid: true
        }
    };

    presenter.presenterLogic = function(view, model, isPreview) {
        presenter.$view = $(view);

        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return false;
        }

        setSmallImage(presenter.configuration.smallImage);

        if (!isPreview) {
            presenter.eventType = MobileUtils.isMobileUserAgent(navigator.userAgent) ? "touchend" : "click";
            turnOnEventListeners();
        }

        presenter.setVisibility(presenter.configuration.isVisible);

        return false;
    };

    presenter.run = function(view, model) {
        presenter.presenterLogic(view, model, false);
    };

    presenter.createPreview = function(view, model) {
        presenter.presenterLogic(view, model, true);
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    function calculateImageSize(image) {
        var $player = $('#_icplayer');
        var dialog = {};
        var x = image.width;
        var y = image.height;
        var xProportion = x / $player.width();
        var yProportion = y / $player.height();

        if (xProportion < 1 && yProportion < 1) {
            dialog.width = x;
            dialog.height = y;
        } else if (xProportion > yProportion) {
            dialog.width = $player.width();
            dialog.height = y / xProportion;
        } else {
            dialog.height = $player.height();
            dialog.width = x / yProportion;
        }

        return dialog;
    }

    function turnOnEventListeners() {
        function createPopUp(e) {
            e.preventDefault();
            e.stopPropagation();

            var img = new Image();
            img.onload = function() {
                var dialogSize = calculateImageSize(this);

                presenter.$image = $("<img class='big' src='" + img.src + "'>");
                presenter.$image.appendTo(presenter.$view);
                presenter.$image.dialog({
                    height: dialogSize.height,
                    width: dialogSize.width,
                    modal: true,
                    resizable: false,
                    draggable: false,
                    show: {
                        effect: "fade",
                        duration: 1000
                    },
                    position: {
                        my: "center",
                        at: "center",
                        of: document.getElementById("_icplayer")
                    },
                    create: function() {
                        var $close = $('<div class="close-button-ui-dialog">');
                        $close.on('click', function() {
                            presenter.$image.dialog('close');
                        });

                        $(this).parents(".ui-dialog").append($close);

                        var $closeCross= $('<div class="close-cross-ui-dialog">');
                        $closeCross.html('&times;');
                        $(this).parents(".ui-dialog").children(".close-button-ui-dialog").append($closeCross);

                        $(this).parents(".ui-dialog:first").find(".ui-dialog-titlebar").css("display", "none");
                        $(this).parents(".ui-dialog").css("padding", 0);
                        $(this).parents(".ui-dialog").css("border", 0);
                        $(this).parents(".ui-dialog:first").find(".ui-dialog-content").css("padding", 0);
                    },
                    open: function() {
                        $('.ui-widget-overlay').on(presenter.eventType, remove);
                    }
                });
                presenter.$image.parent().wrap("<div class='zoom-image-wraper'></div>");
                presenter.$image.on(presenter.eventType, remove);
            };

            img.src = presenter.configuration.bigImage;

            function remove(e) {
                e.preventDefault();
                e.stopPropagation();

                $(".zoom-image-wraper").remove();
                $(".big").remove();
            }
        }
        presenter.$view.find(".icon").on(presenter.eventType, createPopUp);
    }

//    presenter.setShowErrorsMode = function() {};
//    presenter.setWorkMode = function() {};
//    presenter.reset = function() {};
//    presenter.getErrorCount = function() {};
//    presenter.getMaxScore = function() {};
//    presenter.getScore = function() {};
//    presenter.getState = function() {};
//    presenter.setState = function(state) {};

    return presenter;
}