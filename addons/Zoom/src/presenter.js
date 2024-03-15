function AddonZoom_create() {
    var presenter = function() {};

    presenter.playerController = null;
    presenter.eventBus = null;
    presenter.configuration = null;
    presenter.isVisible = true;

    presenter.zoomConfiguration = {
        initialWindowHeight: 0,
        initialNotScaledOffset: 0,
    };

    presenter.scaleModifier = 1.0;
    let zoomedSpaceContainer = null;

    presenter.DEFAULT_ZOOM = 2;
    presenter.ERROR_CODES = {};
    presenter.CSS_CLASSES = {
        ZOOM_WRAPPER: "zoom-wrapper",
        ZOOM_BUTTON_CONTAINER: "zoom-button-container",
        ZOOM_BUTTON: "zoom-button",
        ZOOMED_SPACE_CONTAINER: "zoomed-space-container",
        ZOOM_OUT_BUTTON_CONTAINER: "zoom-out-button-container",
        ZOOM_OUT_BUTTON: "zoom-out-button",
        ZOOM_IN_CURSOR: "zoom-cursor-zoom-in",
        IC_PAGE: "ic_page",
        IC_HEADER: "ic_header",
        IC_FOOTER: "ic_footer"
    };

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;

        presenter.eventBus = controller.getEventBus();
        presenter.eventBus.addEventListener("PageLoaded", this);
        presenter.eventBus.addEventListener("ResizeWindow", this);
    };

    presenter.onEventReceived = function(eventName, eventData) {
        switch (eventName) {
            case "PageLoaded":
                presenter.loadWindowSize();
                break;
            case "ResizeWindow":
                setFinalScaleInformation();
                break;
        }
    };

    presenter.loadWindowSize = function(){
        presenter.zoomConfiguration.initialWindowHeight = window.iframeSize.windowInnerHeight;
        presenter.zoomConfiguration.initialNotScaledOffset = window.iframeSize.notScaledOffset;

        // you must repeat the data reading when they are not loaded correctly
        if (presenter.zoomConfiguration.initialWindowHeight === 0 ||
            isNaN(presenter.zoomConfiguration.initialNotScaledOffset))
        {
            setTimeout(function (e) {
                presenter.loadWindowSize();
            }, 200);
        }
    };

    presenter.createPreview = function(view, model) {
        presenter.presenterLogic(view, model, true);
    };

    presenter.run = function(view, model) {
        presenter.presenterLogic(view, model, false);
    };

    presenter.presenterLogic = function(view, model, isPreview) {
        presenter.view = view;
        presenter.$view = $(view);

        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }
        presenter.setVisibility(presenter.configuration.isVisible);

        if (!isPreview) {
            zoom.init();
            presenter.addHandlers();
        }
    };

    presenter.validateModel = function(model) {
        return {
            isValid: true,
            ID: model.ID,
            width: parseInt(model["Width"], 10),
            height: parseInt(model["Height"], 10),
            isVisible: ModelValidationUtils.validateBoolean(model["Is Visible"]),
            isTabindexEnabled: ModelValidationUtils.validateBoolean(model["Is Tabindex Enabled"])
        };
    };

    function findPage() {
        return $('.' + presenter.CSS_CLASSES.IC_PAGE);
    }

    function findHeader() {
        return $('.' + presenter.CSS_CLASSES.IC_HEADER);
    }

    function findFooter() {
        return $('.' + presenter.CSS_CLASSES.IC_FOOTER);
    }

    function findViewElement(cssClass) {
        return presenter.$view.find('.' + cssClass);
    }

    function turnOnDisplayOfZoomButtonContainer() {
        findViewElement(presenter.CSS_CLASSES.ZOOM_BUTTON_CONTAINER)[0].style.display = "block";
    }

    function turnOffDisplayOffZoomButtonContainer() {
        findViewElement(presenter.CSS_CLASSES.ZOOM_BUTTON_CONTAINER)[0].style.display = "none";
    }

    presenter.executeCommand = function (name, params) {
        const commands = {
            "show": presenter.show,
            "hide": presenter.hide,
            "zoomIn": presenter.zoomIn,
            "zoomOut": presenter.zoomOut,
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.show = function () {
        presenter.setVisibility(true);
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
    };

    presenter.setVisibility = function(isVisible) {
        presenter.isVisible = isVisible;
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.addHandlers = function () {
        presenter.view.addEventListener("DOMNodeRemoved", presenter.destroy);
        findPage().click(presenter.pageCallback);
        findViewElement(presenter.CSS_CLASSES.ZOOM_BUTTON).click(presenter.zoomButtonCallback);
    };

    presenter.removeHandlers = function () {
        presenter.view.removeEventListener("DOMNodeRemoved", presenter.destroy);
        findPage().off("click", presenter.pageCallback);
        findViewElement(presenter.CSS_CLASSES.ZOOM_BUTTON).off("click", presenter.zoomButtonCallback);
    };

    presenter.zoomButtonCallback = function (event) {
        event.stopPropagation();
        if (isZoomed()) {
            return;
        }

        if (isEnabledZoomInCursor()) {
            enableZoomInCursor(false);
        } else {
            enableZoomInCursor(true);
        }
    };

    presenter.pageCallback = function (event) {
        event.stopPropagation();
        if (!isEnabledZoomInCursor()) {
            return;
        }
        zoomIn(event.clientX, event.clientY);
    };

    presenter.zoomIn = function (x, y) {
        const rect = findPage()[0].getBoundingClientRect();
        const scaleInfo = presenter.playerController.getScaleInformation();
        let _y, _x;
        if (Array.isArray(x) && x.length === 2 && y === undefined) {
            _y = parseInt(x[1]);
            _x = parseInt(x[0]);
        } else {
            _y = y;
            _x = x;
        }
        _y = _y * scaleInfo.baseScaleY + rect.top;
        _x = _x * scaleInfo.baseScaleX + rect.left;
        zoomIn(_x, _y);
    };

    function zoomIn(x, y) {
        if (isZoomed()) {
            return;
        }

        document.body.addEventListener( "keyup", keyUpHandler);
        presenter.scaleModifier = presenter.DEFAULT_ZOOM;

        let topWindowHeight = 0;
        let iframeTopOffset = 0;
        if (window.iframeSize) {
            topWindowHeight = window.iframeSize.windowInnerHeight;
            iframeTopOffset = window.iframeSize.offsetTop - window.iframeSize.frameOffset;
        }

        let pageHeight = findPage().height();
        if (findHeader().length > 0) {
            pageHeight += findHeader().height();
        }
        if (findFooter().length > 0) {
            pageHeight += findFooter().height();
        }

        const requiredHeight = window.innerHeight / presenter.scaleModifier;
        const halfOfRequiredHeight = requiredHeight / 2;
        const minY = Math.max(
            (presenter.zoomConfiguration.initialWindowHeight/2 - window.iframeSize.frameOffset) / presenter.scaleModifier,
            halfOfRequiredHeight
        );
        const maxY = Math.min(
            pageHeight - (presenter.zoomConfiguration.initialWindowHeight/2 / presenter.scaleModifier),
            window.innerHeight - halfOfRequiredHeight
        );
        if (y < minY) {
            y = minY;
        } else if (y > maxY) {
            y = maxY;
        }

        const requiredWidth = window.innerWidth / presenter.scaleModifier;
        const halfOfRequiredWidth = requiredWidth / 2;
        const minX = halfOfRequiredWidth;
        const maxX = window.innerWidth - halfOfRequiredWidth;
        if (x < minX) {
            x = minX;
        } else if (x > maxX) {
            x = maxX;
        }

        createZoomedSpaceContainer();
        setFinalScaleInformation();
        zoom.to({
            x: x,
            y: y,
            scale: presenter.scaleModifier,
            topWindowHeight: topWindowHeight,
            iframeTopOffset: iframeTopOffset
        });

        setZoomedSpaceContainerPositionAndSize();
        enableZoomInCursor(false);
        turnOffDisplayOffZoomButtonContainer();
    }

    function setFinalScaleInformation() {
        const scaleInfo = presenter.playerController.getScaleInformation();
        presenter.playerController.setFinalScaleInformation({
            scaleX: scaleInfo.baseScaleX * presenter.scaleModifier,
            scaleY: scaleInfo.baseScaleY * presenter.scaleModifier
        });
    }

    function createZoomedSpaceContainer() {
        zoomedSpaceContainer = document.createElement("div");
        zoomedSpaceContainer.classList.add(presenter.CSS_CLASSES.ZOOMED_SPACE_CONTAINER);
        zoomedSpaceContainer.style.visibility = "hidden";

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add(presenter.CSS_CLASSES.ZOOM_OUT_BUTTON_CONTAINER);
        zoomedSpaceContainer.append(buttonContainer);

        const button = document.createElement("div");
        button.classList.add(presenter.CSS_CLASSES.ZOOM_OUT_BUTTON);
        buttonContainer.append(button);
        $(button).click(presenter.zoomOutButtonCallback);

        document.body.append(zoomedSpaceContainer);
    }

    function setZoomedSpaceContainerPositionAndSize() {
        const newWidth = window.innerWidth / presenter.scaleModifier;
        const newHeight = window.innerHeight / presenter.scaleModifier;
        zoomedSpaceContainer.style.width = newWidth + "px";
        zoomedSpaceContainer.style.height = newHeight + "px";
        zoomedSpaceContainer.style.left = 0 + "px";
        zoomedSpaceContainer.style.top = 0 + "px";

        const timeout = 900; // zoom.TRANSITION_DURATION + 100
        setTimeout(() => {
            const clientRect = $(zoomedSpaceContainer)[0].getBoundingClientRect();
            const newTop = -clientRect.top / presenter.scaleModifier;
            const newLeft = -clientRect.left / presenter.scaleModifier;
            zoomedSpaceContainer.style.top = newTop + "px";
            zoomedSpaceContainer.style.left = newLeft + "px";
            zoomedSpaceContainer.style.visibility = "visible";
        }, timeout);
    }

    function removeZoomedSpaceContainer() {
        if (zoomedSpaceContainer) {
            zoomedSpaceContainer.remove();
            zoomedSpaceContainer = null;
        }
    }

    function isZoomed() {
        const scaleInfo = presenter.playerController.getScaleInformation();
        return (scaleInfo.baseScaleX !== scaleInfo.scaleX || scaleInfo.baseScaleY !== scaleInfo.scaleY);
    }

    function enableZoomInCursor(enable) {
        const $page = findPage();
        if (enable) {
            $page.addClass(presenter.CSS_CLASSES.ZOOM_IN_CURSOR);
        } else {
            $page.removeClass(presenter.CSS_CLASSES.ZOOM_IN_CURSOR);
        }
    }

    function isEnabledZoomInCursor() {
        return findPage().hasClass(presenter.CSS_CLASSES.ZOOM_IN_CURSOR);
    }

    function keyUpHandler(event) {
        const escKeyCode = 27;
        if (event.keyCode === escKeyCode) {
            presenter.zoomOut();
        }
    }

    presenter.zoomOutButtonCallback = function (event) {
        event.stopPropagation();
        presenter.zoomOut();
    };

    presenter.zoomOut = function () {
        presenter.scaleModifier = 1.0;
        setFinalScaleInformation();
        zoom.out();
        document.body.removeEventListener("keyup", keyUpHandler);
        removeZoomedSpaceContainer();
        turnOnDisplayOfZoomButtonContainer();
    };

    presenter.getState = function() {
        return JSON.stringify({
            isVisible: presenter.isVisible
        });
    };

    presenter.setState = function(state) {
        if (ModelValidationUtils.isStringEmpty(state)) {
            return;
        }

        const parsedState = JSON.parse(state);
        presenter.setVisibility(parsedState.isVisible);
    };

    presenter.reset = function() {
        presenter.zoomOut();
        presenter.setVisibility(presenter.configuration.isVisible);
        enableZoomInCursor(false);
    };

    presenter.destroy = function (event) {
        if (event.target !== presenter.view) {
            return;
        }

        if (zoom) {
            presenter.zoomOut();
            zoom.destroy();
        }

        presenter.removeHandlers();
    };

    return presenter;
}
