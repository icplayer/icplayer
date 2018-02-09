function AddonZoom_Image_create() {

    var presenter = function() {};
    var eventBus;
    presenter.isOpened = false;

    function setup_presenter() {
        presenter.$player = null;
        presenter.view = null;
        presenter.$view = null;
        presenter.$image = null;
        presenter.removeOpenedDialog = null;
        presenter.bigImageCreated = null;
        presenter.bigImageLoaded = null;
        presenter.createPopUp = null;
    }

    setup_presenter();

    function setSmallImage(url) {
        var $image = $('<img class="small">');
        $image.attr("src", url);
        $image.attr("height", presenter.configuration.height);
        $image.attr("width", presenter.configuration.width);
        $image.attr("alt", presenter.configuration.alt);
        presenter.$view.find("div.content").append($image);
        if ( presenter.configuration.isTabindexEnabled) {$image.attr('tabindex', '0');}
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

    presenter.setPlayerController = function(controller) {
        eventBus = controller.getEventBus();
    };

    presenter.validateModel = function(model) {

        var validatedBigImage = parseImage(model["Full Screen image"]);
        if (!validatedBigImage.isValid) {
            return returnErrorObject(validatedBigImage.errorCode);
        }

        var validatedSmallImage = parseImage(model["Page image"]);
        if (!validatedSmallImage.isValid) {
            return returnErrorObject(validatedSmallImage.errorCode);
        }

        var isVisible = ModelValidationUtils.validateBoolean(model['Is Visible']);

        var isTabindexEnabled = ModelValidationUtils.validateBoolean(model['Is Tabindex Enabled']);

        return {
            bigImage: validatedBigImage.value,
            smallImage: validatedSmallImage.value,
            ID: model.ID,
            width: parseInt(model["Width"], 10),
            height: parseInt(model["Height"], 10),
            isVisible: isVisible,
            isVisibleByDefault: isVisible,
            isValid: true,
            alt: model['Alternative text'],
            isTabindexEnabled: isTabindexEnabled
        }
    };

    presenter.presenterLogic = function(view, model, isPreview) {
        presenter.view = view;
        presenter.$view = $(view);

        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return false;
        }

        setSmallImage(presenter.configuration.smallImage);

        if (!isPreview) {
            presenter.eventType = MobileUtils.isMobileUserAgent(navigator.userAgent) ? "touchend" : "click";
            presenter.$view.find(".icon").on(presenter.eventType, presenter.createPopUp);
        }

        presenter.setVisibility(presenter.configuration.isVisible);

        presenter.view.addEventListener('DOMNodeRemoved', function onDOMNodeRemoved(ev) {
            if (ev.target === this) {
                presenter.destroy();
            }
        });

        return false;
    };

    presenter.destroy = function () {
        presenter.view.removeEventListener('DOMNodeRemoved', presenter.destroy);
        presenter.$view.find(".icon").off(presenter.eventType, presenter.createPopUp);
        if (presenter.$image !== null) {
            presenter.$image.off();
        }
        setup_presenter();
        setup_presenter = null;

    };

    presenter.run = function(view, model) {
        presenter.$view = $(view);
        presenter.presenterLogic(view, model, false);
    };

    presenter.createPreview = function(view, model) {
        presenter.presenterLogic(view, model, true);
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
        presenter.configuration.isVisible = isVisible;
    };

    function calculateImageSize(image) {
        var $player;
        if(document.getElementById('_icplayer') != null){
            $player = $('#_icplayer');
        }else{
            $player = $('.ic_page_panel');
        }

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

    function sendEvent(value) {
        var eventData = {
            source: presenter.configuration.ID,
            value: value
        };
        eventBus.sendEvent('ValueChanged', eventData);
    }

    presenter.removeOpenedDialog = function (e) {
        if(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        $(".zoom-image-wraper").remove();
        $(".big").remove();
        sendEvent(0);
        presenter.isOpened = false;
    };

    presenter.bigImageCreated = function() {
        var $close = $('<div class="close-button-ui-dialog">');
        $close.on('click', presenter.removeOpenedDialog);

        $(this).parents(".ui-dialog").append($close);

        var $closeCross= $('<div class="close-cross-ui-dialog">');
        $closeCross.html('&times;');
        $(this).parents(".ui-dialog").children(".close-button-ui-dialog").append($closeCross);

        $(this).parents(".ui-dialog:first").find(".ui-dialog-titlebar").css("display", "none");
        $(this).parents(".ui-dialog").css("padding", 0);
        $(this).parents(".ui-dialog").css("border", 0);
        $(this).parents(".ui-dialog:first").find(".ui-dialog-content").css("padding", 0);
        sendEvent(1);
    };

    presenter.bigImageLoaded = function(){
        if(document.getElementById('_icplayer') != null){
            presenter.$player  = document.getElementById('_icplayer');
        }else{
            presenter.$player  = document.getElementsByClassName('ic_page_panel');
        }

        var dialogSize = calculateImageSize(this);

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
                of: presenter.$player
            },
            create: presenter.bigImageCreated,
            open: function() {
                $('.ui-widget-overlay').on(presenter.eventType, presenter.removeOpenedDialog);
            }
        });
        presenter.$image.parent().wrap("<div class='zoom-image-wraper'></div>");
        presenter.$image.on(presenter.eventType, presenter.removeOpenedDialog);
    };

    presenter.createPopUp = function createPopUp(e) {
        if(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        presenter.$image = $("<img class='big' src='" + presenter.configuration.bigImage + "' alt='"+presenter.configuration.alt+"'>");
        presenter.$image.on("load", presenter.bigImageLoaded);
        presenter.isOpened = true;
    };

    presenter.executeCommand = function (name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
    };

    presenter.show = function () {
        presenter.setVisibility(true);
    };

    presenter.reset = function() {
        presenter.configuration.isVisibleByDefault ? presenter.show() : presenter.hide();
    };

    presenter.getState = function () {
        return JSON.stringify({
            isVisible: presenter.configuration.isVisible
        });
    };

    presenter.upgradeStateForVisibility = function (parsedState) {
        if (parsedState.isVisible == undefined) {
            parsedState.isVisible = true;
        }

        return parsedState;
    };

    presenter.upgradeState = function(parsedState) {
        return presenter.upgradeStateForVisibility(parsedState);
    };

    presenter.setState = function (state) {
        if (!state) {
            return;
        }

        var parsedState = JSON.parse(state),
            upgradedState = presenter.upgradeState(parsedState);

        presenter.setVisibility(upgradedState.isVisible);
    };

    presenter.keyboardController = function(keyCode) {
        if (keyCode === 13) {
            if (!presenter.isOpened) {
                presenter.createPopUp();
            }
        }

        if (keyCode === 27) {
            presenter.removeOpenedDialog();
        }
    };

    return presenter;
}