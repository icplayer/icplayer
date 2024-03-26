function AddonZoom_create() {
    var presenter = function() {};

    presenter.playerController = null;
    presenter.eventBus = null;
    presenter.configuration = null;
    presenter.isVisible = true;
    presenter.scaleModifier = 1.0;
    let zoomedSpaceContainer = null;
    let bodyExtender = null;

    presenter.DEFAULT_ZOOM = 2;
    presenter.ERROR_CODES = {};
    presenter.CSS_CLASSES = {
        ZOOM_WRAPPER: "zoom-wrapper",
        ZOOM_BUTTON_CONTAINER: "zoom-button-container",
        ZOOM_BUTTON: "zoom-button",
        SELECTED: "selected",
        ZOOMED_SPACE_CONTAINER: "zoomed-space-container",
        ZOOM_BODY_EXTENDER: "zoom-body-extender",
        ZOOM_OUT_BUTTON_CONTAINER: "zoom-out-button-container",
        ZOOM_OUT_BUTTON: "zoom-out-button",
        ZOOM_IN_CURSOR: "zoom-cursor-zoom-in",
        IC_PAGE: "ic_page"
    };

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;

        presenter.eventBus = controller.getEventBus();
        presenter.eventBus.addEventListener("ResizeWindow", this);
    };

    presenter.onEventReceived = function(eventName) {
        switch (eventName) {
            case "ResizeWindow":
                setFinalScaleInformation();
                break;
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

    function findViewElement(cssClass) {
        return presenter.$view.find('.' + cssClass);
    }

    function showZoomButtonContainer() {
        findViewElement(presenter.CSS_CLASSES.ZOOM_BUTTON_CONTAINER)[0].style.display = "block";
    }

    function hideZoomButtonContainer() {
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
        const pageRect = findPage()[0].getBoundingClientRect();
        const scaleInfo = presenter.playerController.getScaleInformation();
        let _y, _x;
        if (Array.isArray(x) && x.length === 2 && y === undefined) {
            _y = parseInt(x[1]);
            _x = parseInt(x[0]);
        } else {
            _y = y;
            _x = x;
        }
        _y = _y * scaleInfo.baseScaleY + pageRect.top;
        _x = _x * scaleInfo.baseScaleX + pageRect.left;
        zoomIn(_x, _y);
    };

    function zoomIn(x, y) {
        if (isZoomed()) {
            return;
        }

        document.body.addEventListener( "keyup", keyUpHandler);
        presenter.scaleModifier = presenter.DEFAULT_ZOOM;
        setFinalScaleInformation();

        createZoomedSpaceContainer();
        const adjustedPosition = adjustSelectedPositionToAvailableSize(x, y);
        zoom.to({
            x: adjustedPosition.x,
            y: adjustedPosition.y,
            scale: presenter.scaleModifier
        });

        setZoomedSpaceContainerPositionAndSize();
        enableZoomInCursor(false);
        hideZoomButtonContainer();
    }

    function adjustSelectedPositionToAvailableSize(x, y) {
        const pageRect = findPage()[0].getBoundingClientRect(); // Include to set boundary relative to ic_page

        const documentHeight = getDocumentBodyHeight();
        const zoomedSpaceHeight = calculateZoomedSpaceHeight();
        const halfOfZoomedSpaceHeight = zoomedSpaceHeight / 2;
        const pageTopOffset = pageRect.y;
        const pageBottomOffset = documentHeight - pageRect.height - pageTopOffset;
        const minY = pageTopOffset + halfOfZoomedSpaceHeight;
        const maxY = documentHeight - pageBottomOffset - halfOfZoomedSpaceHeight;
        if (y < minY) {
            y = minY;
        } else if (y > maxY) {
            y = maxY;
        }

        const documentWidth = getDocumentBodyWidth();
        const zoomedScapeWidth = calculateZoomedSpaceWidth();
        const halfOfZoomedSpaceWidth = zoomedScapeWidth / 2;
        const pageLeftOffset = pageRect.x;
        const pageRightOffset = documentWidth - pageRect.width - pageLeftOffset;
        const minX = pageLeftOffset + halfOfZoomedSpaceWidth;
        const maxX = documentWidth - pageRightOffset - halfOfZoomedSpaceWidth;
        if (x < minX) {
            x = minX;
        } else if (x > maxX) {
            x = maxX;
        }
        return {x, y};
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

    function removeZoomedSpaceContainer() {
        if (zoomedSpaceContainer) {
            zoomedSpaceContainer.remove();
            zoomedSpaceContainer = null;
        }
    }

    function setZoomedSpaceContainerPositionAndSize() {
        const scaleInfo = presenter.playerController.getScaleInformation();
        const newWidth = calculateZoomedSpaceWidth() / scaleInfo.baseScaleY;
        const newHeight = calculateZoomedSpaceHeight() / scaleInfo.baseScaleX;
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
            zoomedSpaceContainer.style.transform = "scale(" + scaleInfo.baseScaleX + ")";
            zoomedSpaceContainer.style.transformOrigin = "0px 0px";

            const bottom = newTop + newHeight;
            const extenderHeight = bottom - document.body.offsetHeight;
            if (extenderHeight > 0) {
                createBodyExtender(extenderHeight);
            }
        }, timeout);
    }

    function createBodyExtender(height) {
        // To prevent the zoomedSpaceContainer from not being fully displayed,
        // an extender is created to properly extend the body of the document.
        //
        // Fixes issue with zoomOut button not displaying on mAuthor for mobile devices
        bodyExtender = document.createElement("div");
        bodyExtender.classList.add(presenter.CSS_CLASSES.ZOOM_BODY_EXTENDER);
        bodyExtender.style.height = height + "px";

        document.body.append(bodyExtender);
    }

    function removeBodyExtender() {
        if (bodyExtender) {
            bodyExtender.remove();
            bodyExtender = null;
        }
    }

    /**
     * Get document body height and get zoomed space height.
     *
     * In order to determine the size of the zoomed area, it is necessary to obtain the height of the user's visible
     * area: window.innerHeight . When calculating the zoom center, this value cannot be used, as it is only
     * to be limited by the height of visible area, not the document.
     * Example. On a mobile device, not the entire page of the lesson will be visible, but it is still supposed to
     * be possible to create the center of the zoom area even in an area that is not visible to the user
     * (for example, using the zoomIn(x, y) command).
     *
     * The same logic is used to calculate the width.
     *
     * @methods getDocumentBodyHeight, getZoomedSpaceHeight
     * @return {int} Available height
     */
    function getDocumentBodyHeight() {
        return document.body.offsetHeight;
    }

    function getZoomedSpaceHeight() {
        return window.innerHeight;
    }

    function getDocumentBodyWidth() {
        return document.body.offsetWidth;
    }

    function getZoomedSpaceWidth() {
        return window.innerWidth;
    }

    function calculateZoomedSpaceHeight() {
        return getZoomedSpaceHeight() / presenter.scaleModifier;
    }

    function calculateZoomedSpaceWidth() {
        return getZoomedSpaceWidth() / presenter.scaleModifier;
    }

    function isZoomed() {
        const scaleInfo = presenter.playerController.getScaleInformation();
        return (scaleInfo.baseScaleX !== scaleInfo.scaleX || scaleInfo.baseScaleY !== scaleInfo.scaleY);
    }

    function enableZoomInCursor(enable) {
        const $page = findPage();
        const $zoomButton = findViewElement(presenter.CSS_CLASSES.ZOOM_BUTTON);
        if (enable) {
            $page.addClass(presenter.CSS_CLASSES.ZOOM_IN_CURSOR);
            $zoomButton.addClass(presenter.CSS_CLASSES.SELECTED);
        } else {
            $page.removeClass(presenter.CSS_CLASSES.ZOOM_IN_CURSOR);
            $zoomButton.removeClass(presenter.CSS_CLASSES.SELECTED);
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
        removeZoomedSpaceContainer();
        removeBodyExtender();
        zoom.out();
        document.body.removeEventListener("keyup", keyUpHandler);
        showZoomButtonContainer();
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
