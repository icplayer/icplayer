function AddonZoom_create() {
    var presenter = function() {};

    presenter.playerController = null;
    presenter.eventBus = null;
    presenter.configuration = null;
    presenter.isVisible = true;
    presenter.scaleModifier = 1.0;
    presenter.zoomedSpaceContainer = null;
    presenter.zoomingTimeoutID = null;

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

    function findPagePanel() {
        return presenter.$view.parent().parent('.' + presenter.CSS_CLASSES.IC_PAGE_PANEL);
    }

    function findPageElement() {
        return findPage()[0];
    }

    function findPage() {
        return presenter.$view.parent('.' + presenter.CSS_CLASSES.IC_PAGE);
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
        if (isInIframe()) {
            window.removeEventListener("message", adjustZoomedSpaceContainerCSSWhenInIframe);
        } else {
            window.removeEventListener("scroll", adjustZoomedSpaceContainerCSSWhenNotInIframe);
        }
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

    function preventOfIncludingScrollOffsetToTransformOrigin() {
        findPageElement().style.transformOrigin = "0px 0px";
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
        presenter.zoomedSpaceContainer = document.createElement("div");
        presenter.zoomedSpaceContainer.classList.add(presenter.CSS_CLASSES.ZOOMED_SPACE_CONTAINER);
        presenter.zoomedSpaceContainer.style.visibility = "hidden";
        presenter.zoomedSpaceContainer.style.width = "1px";
        presenter.zoomedSpaceContainer.style.height = "1px";
        presenter.zoomedSpaceContainer.style.left = "0px";
        presenter.zoomedSpaceContainer.style.top = "0px";

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add(presenter.CSS_CLASSES.ZOOM_OUT_BUTTON_CONTAINER);
        presenter.zoomedSpaceContainer.append(buttonContainer);

        const button = document.createElement("div");
        button.classList.add(presenter.CSS_CLASSES.ZOOM_OUT_BUTTON);
        buttonContainer.append(button);
        $(button).click(presenter.zoomOutButtonCallback);

        document.body.append(presenter.zoomedSpaceContainer);

        const timeout = 1000; // zoom.TRANSITION_DURATION + 200 (+ additional delay in adjustment methods)
        presenter.zoomingTimeoutID = setTimeout(() => {
            if (isInIframe()) {
                window.addEventListener("message", adjustZoomedSpaceContainerCSSWhenInIframe);
                adjustZoomedSpaceContainerCSSWhenInIframe(null, true);
            } else {
                window.addEventListener("scroll", adjustZoomedSpaceContainerCSSWhenNotInIframe);
                adjustZoomedSpaceContainerCSSWhenNotInIframe();
            }
            presenter.zoomedSpaceContainer.style.visibility = "visible";
            presenter.zoomingTimeoutID = null;
        }, timeout);
    }

    function removeZoomedSpaceContainer() {
        if (presenter.zoomedSpaceContainer) {
            presenter.zoomedSpaceContainer.remove();
            presenter.zoomedSpaceContainer = null;
        }
    }

    function isInIframe() {
        return window.isFrameInDifferentDomain || window.isInIframe;
    }

    /**
     * Set zoomed space container positions, size, visibility and transform when player is in iframe
     *
     * @method adjustZoomedSpaceContainerCSSWhenInIframe
     * @param event event send to player after size of iframe changed
     * @param withoutEventCheck when set to True then execute method without checking event data
     * @return undefined
     */
    function adjustZoomedSpaceContainerCSSWhenInIframe(event, withoutEventCheck = false) {
        if (!withoutEventCheck) {
            if (!(typeof event.data === "string" || event.data instanceof String) ||
                event.data.indexOf("I_FRAME_SIZES:") !== 0
            ) {
                return;
            }
        }
        const icPlayerRect = $(document.body).find("#_icplayer")[0].getBoundingClientRect();

        adjustHeightAndVerticalPositionWhenInIframe();
        adjustWidthAndHorizontalPosition(icPlayerRect);
        adjustZoomedSpaceContainerTransform();
    }

    /**
     * Set zoomed space container positions, size, visibility and transform when player is not in iframe
     *
     * @method setZoomedSpaceContainerPositionAndSizeWhenNotInIframe
     * @return undefined
     */
    function adjustZoomedSpaceContainerCSSWhenNotInIframe() {
        const icPlayerRect = $(document.body).find("#_icplayer")[0].getBoundingClientRect();

        adjustHeightAndVerticalPositionWhenNotInIframe(icPlayerRect);
        adjustWidthAndHorizontalPosition(icPlayerRect);
        adjustZoomedSpaceContainerTransform();
    }

    function adjustHeightAndVerticalPositionWhenInIframe() {
        const scaleInfo = presenter.playerController.getScaleInformation();

        const scroll = window.iframeSize.offsetTop;
        let playerOffset = window.iframeSize.frameOffset || 64;
        if (window.iframeSize.isEditorPreview) {
            playerOffset = 0;
        }
        let iframeScale = 1.0;
        if (window.iframeSize.frameScale !== null && window.iframeSize.frameScale !== undefined) {
            iframeScale = window.iframeSize.frameScale;
        }
        let newHeight = window.iframeSize.height;
        if (window.iframeSize.windowInnerHeight < window.iframeSize.height + window.iframeSize.frameOffset) {
            newHeight = window.iframeSize.windowInnerHeight;
            if (window.iframeSize.offsetTop < window.iframeSize.frameOffset) {
                newHeight -= window.iframeSize.frameOffset - window.iframeSize.offsetTop;
            }
        }
        const newTop = scroll > playerOffset ? (scroll - playerOffset) / iframeScale : 0;

        presenter.zoomedSpaceContainer.style.height = newHeight / scaleInfo.scaleY + "px";
        presenter.zoomedSpaceContainer.style.top = newTop + "px";
    }

    function adjustHeightAndVerticalPositionWhenNotInIframe(icPlayerRect) {
        const scaleInfo = presenter.playerController.getScaleInformation();

        const topOffset = icPlayerRect.top;
        const bottomOffset = window.innerHeight - icPlayerRect.height - topOffset;

        let newHeight = icPlayerRect.height;
        let newTop = topOffset;
        if (topOffset < 0) {
            newTop = 0;
            newHeight += topOffset;
        }
        if (bottomOffset < 0) {
            newHeight += bottomOffset;
        }

        presenter.zoomedSpaceContainer.style.height = newHeight / scaleInfo.scaleY + "px";
        presenter.zoomedSpaceContainer.style.top = newTop + "px";
    }

    function adjustWidthAndHorizontalPosition(icPlayerRect) {
        const scaleInfo = presenter.playerController.getScaleInformation();

        const leftOffset = icPlayerRect.left;
        const rightOffset = window.innerWidth - icPlayerRect.width - leftOffset;

        let newWidth = icPlayerRect.width;
        let newLeft = leftOffset;
        if (leftOffset < 0) {
            newLeft = 0;
            newWidth += leftOffset;
        }
        if (rightOffset < 0) {
            newWidth += rightOffset;
        }

        presenter.zoomedSpaceContainer.style.width = newWidth / scaleInfo.scaleX + "px";
        presenter.zoomedSpaceContainer.style.left = newLeft + "px";
    }

    function adjustZoomedSpaceContainerTransform() {
        const scaleInfo = presenter.playerController.getScaleInformation();

        presenter.zoomedSpaceContainer.style.transform = "scale(" + scaleInfo.scaleX + ", " + scaleInfo.scaleY + ")";
        presenter.zoomedSpaceContainer.style.transformOrigin = "left top";
    }

    function isZoomed() {
        const $icPagePanel = findPagePanel();
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
        if (presenter.scaleModifier === 1.0) {
            return;
        }
        presenter.scaleModifier = 1.0;
        setFinalScaleInformation();
        removeZoomedSpaceContainer();
        if (presenter.zoomingTimeoutID) {
            clearTimeout(presenter.zoomingTimeoutID);
            presenter.zoomingTimeoutID = null;
        }
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
