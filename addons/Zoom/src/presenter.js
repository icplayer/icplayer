function AddonZoom_create() {
    var presenter = function() {};

    presenter.playerController = null;
    presenter.eventBus = null;
    presenter.configuration = null;
    presenter.isVisible = true;
    presenter.scaleModifier = 1.0;

    presenter.DEFAULT_ZOOM = 2;
    presenter.ERROR_CODES = {};
    presenter.CSS_CLASSES = {
        ZOOM_WRAPPER: "zoom-wrapper",
        ZOOM_BUTTON_CONTAINER: "zoom-button-container",
        ZOOM_BUTTON: "zoom-button",
        SELECTED: "selected",
        ZOOMED_SPACE_CONTAINER: "zoomed-space-container",
        ZOOM_OUT_BUTTON_CONTAINER: "zoom-out-button-container",
        ZOOM_OUT_BUTTON: "zoom-out-button",
        ZOOM_IN_CURSOR: "zoom-cursor-zoom-in",
        ZOOM_ZOOMED_IN: "zoom-zoomed-in",
        IC_PAGE: "ic_page",
        IC_PAGE_PANEL: "ic_page_panel",
        IWB_ZOOM_IN: "iwb-zoom-in",
        IWB_ZOOM_OUT: "iwb-zoom-out",
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
            zoom.init({
                elementToZoom: findPageElement()
            });
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

    function findPageElement() {
        return findPage()[0];
    }

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
        const pageRect = findPageElement().getBoundingClientRect();
        const scaleInfo = presenter.playerController.getScaleInformation();
        const x = (event.clientX - pageRect.x) / scaleInfo.baseScaleX;
        const y = (event.clientY - pageRect.y) / scaleInfo.baseScaleY;
        zoomIn(x, y, false);
    };

    presenter.zoomIn = function (x, y) {
        let _y, _x;
        if (Array.isArray(x) && x.length === 2 && y === undefined) {
            _y = parseInt(x[1]);
            _x = parseInt(x[0]);
        } else {
            _y = y;
            _x = x;
        }
        zoomIn(_x, _y);
    };

    function zoomIn(x, y) {
        if (isZoomed()) {
            return;
        }

        document.body.addEventListener( "keyup", keyUpHandler);

        presenter.scaleModifier = presenter.DEFAULT_ZOOM;
        setFinalScaleInformation();
        const scaleInfo = presenter.playerController.getScaleInformation();

        const adjustedPosition = adjustSelectedPositionToPageBoundaries(x, y);
        const page = findPageElement();
        const pageRect = page.getBoundingClientRect();

        page.classList.add(presenter.CSS_CLASSES.ZOOM_ZOOMED_IN);
        zoom.to({
            x: adjustedPosition.x,
            y: adjustedPosition.y,
            scale: presenter.scaleModifier,
            topWindowHeight: pageRect.height / scaleInfo.baseScaleY,
            topWindowWidth: pageRect.width / scaleInfo.baseScaleX,
            elementToZoom: page
        });

        preventOfIncludingScrollOffsetToTransformOrigin();
        createZoomedSpaceContainer();
        enableZoomInCursor(false);
        hideZoomButtonContainer();
    }

    /**
     * Adjust selected position to get center of zoomed space, that will not exit boundaries of page
     *
     * @method adjustSelectedPositionToPageBoundaries
     * @return {{x: number, y: number}} zoomed space center position
     */
    function adjustSelectedPositionToPageBoundaries(x, y) {
        const scaleInfo = presenter.playerController.getScaleInformation();
        const pageRect = findPageElement().getBoundingClientRect();

        const pageHeight = pageRect.height / scaleInfo.baseScaleY;
        const zoomedSpaceHeight = pageHeight / presenter.scaleModifier;
        const halfOfZoomedSpaceHeight = zoomedSpaceHeight / 2;
        const minY = halfOfZoomedSpaceHeight;
        const maxY = pageHeight - halfOfZoomedSpaceHeight;
        if (y < minY) {
            y = minY;
        } else if (y > maxY) {
            y = maxY;
        }

        const pageWidth = pageRect.width / scaleInfo.baseScaleX;
        const zoomedScapeWidth = pageWidth / presenter.scaleModifier;
        const halfOfZoomedSpaceWidth = zoomedScapeWidth / 2;
        const minX = halfOfZoomedSpaceWidth;
        const maxX = pageWidth - halfOfZoomedSpaceWidth;
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
        const zoomedSpaceContainer = document.createElement("div");
        zoomedSpaceContainer.classList.add(presenter.CSS_CLASSES.ZOOMED_SPACE_CONTAINER);
        zoomedSpaceContainer.style.visibility = "hidden";
        zoomedSpaceContainer.style.width = "1px";
        zoomedSpaceContainer.style.height = "1px";
        zoomedSpaceContainer.style.left = "0px";
        zoomedSpaceContainer.style.top = "0px";

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add(presenter.CSS_CLASSES.ZOOM_OUT_BUTTON_CONTAINER);
        zoomedSpaceContainer.append(buttonContainer);

        const button = document.createElement("div");
        button.classList.add(presenter.CSS_CLASSES.ZOOM_OUT_BUTTON);
        buttonContainer.append(button);
        $(button).click(presenter.zoomOutButtonCallback);

        document.body.append(zoomedSpaceContainer);

        setZoomedSpaceContainerPositionAndSize(zoomedSpaceContainer);
    }

    function removeZoomedSpaceContainer() {
        const elements = document.body.getElementsByClassName(presenter.CSS_CLASSES.ZOOMED_SPACE_CONTAINER);
        for (let i = elements.length - 1; i >= 0; i--) {
            elements[i].remove();
        }
    }

    /**
     * Set zoomed space container positions, size, visibility and scale
     *
     * Method must be executed after completed zoomIn
     *
     * @method setZoomedSpaceContainerPositionAndSize
     * @param zoomedSpaceContainer HTML element
     * @return null
     */
    function setZoomedSpaceContainerPositionAndSize(zoomedSpaceContainer) {
        const timeout = 900; // zoom.TRANSITION_DURATION + 100
        setTimeout(() => {
            const scaleInfo = presenter.playerController.getScaleInformation();
            const playerRect = $("#_icplayer")[0].getBoundingClientRect();

            let newWidth = playerRect.width;
            let newHeight = playerRect.height;

            const leftOffset = playerRect.left;
            const rightOffset = window.innerWidth - playerRect.width - leftOffset;
            let newLeft = playerRect.left;
            if (leftOffset < 0) {
                newLeft = 0;
                newWidth += leftOffset;
            }
            if (rightOffset < 0) {
                newWidth += rightOffset;
            }

            const topOffset = playerRect.top;
            const bottomOffset = window.innerHeight - playerRect.height - topOffset;
            let newTop = topOffset;
            if (topOffset < 0) {
                newTop = 0;
                newHeight += topOffset;
            }
            if (bottomOffset < 0) {
                newHeight += bottomOffset;
            }

            zoomedSpaceContainer.style.width = newWidth / scaleInfo.scaleX + "px";
            zoomedSpaceContainer.style.height = newHeight / scaleInfo.scaleY + "px";
            zoomedSpaceContainer.style.left = newLeft + "px";
            zoomedSpaceContainer.style.top = newTop + "px";
            zoomedSpaceContainer.style.transform = "scale(" + scaleInfo.scaleX + ", " + scaleInfo.scaleY + ")";
            zoomedSpaceContainer.style.transformOrigin = "left top";
            zoomedSpaceContainer.style.visibility = "visible";
        }, timeout);
    }

    function preventOfIncludingScrollOffsetToTransformOrigin() {
        findPageElement().style.transformOrigin = "0px 0px";
    }

    function isZoomed() {
        const $icPagePanel = presenter.$view.parent().parent('.ic_page_panel');
        const isIWBToolbarActive = ($icPagePanel.hasClass(presenter.CSS_CLASSES.IWB_ZOOM_IN) ||
            $icPagePanel.hasClass(presenter.CSS_CLASSES.IWB_ZOOM_OUT));
        if (isIWBToolbarActive) {
            return true;
        }

        const scaleInfo = presenter.playerController.getScaleInformation();
        return ((scaleInfo.baseScaleX !== scaleInfo.scaleX || scaleInfo.baseScaleY !== scaleInfo.scaleY) ||
            document.body.getElementsByClassName(presenter.CSS_CLASSES.ZOOMED_SPACE_CONTAINER).length > 0
        );
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
        if (presenter.scaleModifier == 1.0) {
            return;
        }
        presenter.scaleModifier = 1.0;
        setFinalScaleInformation();
        removeZoomedSpaceContainer();
        zoom.out();
        findPage().removeClass(presenter.CSS_CLASSES.ZOOM_ZOOMED_IN);
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
