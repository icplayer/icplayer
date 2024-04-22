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
        IC_FOOTER: "ic_footer",
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

    function findPage() {
        return presenter.$view.parent('.' + presenter.CSS_CLASSES.IC_PAGE);
    }

    function findPageElement() {
        return findPage()[0];
    }

    function findPagePanel() {
        return findPage().parent('.' + presenter.CSS_CLASSES.IC_PAGE_PANEL);
    }

    function findFooterPagePanel() {
        return $(document.body)
            .find('.' + presenter.CSS_CLASSES.IC_FOOTER)
            .parent('.' + presenter.CSS_CLASSES.IC_PAGE_PANEL);
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

        const timeout = 1000; // zoom.TRANSITION_DURATION + 200
        presenter.zoomingTimeoutID = setTimeout(() => {
            setUpZoomedSpaceContainerAfterZoomIn();
            presenter.zoomingTimeoutID = null;
        }, timeout);
    }

    function setUpZoomedSpaceContainerAfterZoomIn() {
        const scrollElements = findScrollElements();
        let maxScrollTop = 0;
        try {
            for (let i = 0; i < scrollElements.length; i++) {
                let elementScrollTop = scrollElements[i].scrollTop();
                if (elementScrollTop > maxScrollTop) {
                    maxScrollTop = elementScrollTop;
                }
            }
        } catch(e) {}
        adjustZoomedSpaceContainerCSS(undefined, maxScrollTop);
        addHandlersNeededInZoomedPage();
        presenter.zoomedSpaceContainer.style.visibility = "visible";
    }

    function findScrollElements() {
        const $defaultScrollElement = $(window.parent.document);
        const $mCourserScrollElement = $defaultScrollElement.find('#lesson-view > div > div');
        const $mAuthorMobileScrollElement = $(window);
        const $mCourserMobileScrollElement = $("#content-view");
        return [$defaultScrollElement, $mCourserScrollElement, $mAuthorMobileScrollElement, $mCourserMobileScrollElement];
    }

    function addHandlersNeededInZoomedPage() {
        if (!presenter.playerController || presenter.playerController.isPlayerInCrossDomain()) {
            return;
        }
        addOnScrollHandlers();
    }

    function addOnScrollHandlers() {
        const scrollElements = findScrollElements();
        try {
            for (let i = 0; i < scrollElements.length; i++) {
                scrollElements[i].scroll(adjustZoomedSpaceContainerCSS);
            }
        } catch(e) {}
    }

    function removeHandlersNeededInZoomedPage() {
        if (!presenter.playerController || presenter.playerController.isPlayerInCrossDomain()) {
            return;
        }
        removeOnScrollHandlers();
    }

    function removeOnScrollHandlers() {
        const scrollElements = findScrollElements();
        try {
            for (let i = 0; i < scrollElements.length; i++) {
                scrollElements[i][0].removeEventListener("scroll", adjustZoomedSpaceContainerCSS);
            }
        } catch(e) {}
    }

    function removeZoomedSpaceContainer() {
        if (presenter.zoomedSpaceContainer) {
            presenter.zoomedSpaceContainer.remove();
            presenter.zoomedSpaceContainer = null;
        }
    }

    function adjustZoomedSpaceContainerCSS(event, scrollTop) {
        if (!presenter.zoomedSpaceContainer) {
            return;
        }
        if (!scrollTop) {
            scrollTop = $(this).scrollTop();
        }
        setFinalScaleInformation();
        const isInIframe = window.parent.location !== window.location;
        if (isInIframe) {
            adjustHeightAndVerticalPositionWhenInIframe(scrollTop);
        } else {
            adjustHeightAndVerticalPositionWhenNotInIframe();
        }
        adjustWidthAndHorizontalPosition();
        adjustZoomedSpaceContainerTransform();
    }

    function adjustHeightAndVerticalPositionWhenInIframe(scrollTop) {
        const scaleInfo = presenter.playerController.getScaleInformation();
        const iframeSize = {
            height: window.document.body.clientHeight,
            innerHeight: window.parent.innerHeight,
            offsetTop: window.frameElement.offsetTop,
            scaleX: window.frameElement.getBoundingClientRect().height / window.frameElement.offsetHeight
        };

        let newHeight = iframeSize.height;
        if (iframeSize.innerHeight < iframeSize.height + iframeSize.offsetTop) {
            newHeight = iframeSize.innerHeight;
            if (scrollTop < iframeSize.offsetTop) {
                newHeight -= iframeSize.offsetTop - scrollTop;
            }
        }
        newHeight = newHeight / scaleInfo.scaleY;
        let newTop = 0;
        if (scrollTop > iframeSize.offsetTop) {
            newTop = scrollTop - iframeSize.offsetTop;
        }

        presenter.zoomedSpaceContainer.style.height = newHeight / iframeSize.scaleX + "px";
        presenter.zoomedSpaceContainer.style.top = newTop / iframeSize.scaleX + "px";
    }

    function adjustHeightAndVerticalPositionWhenNotInIframe() {
        const scaleInfo = presenter.playerController.getScaleInformation();
        const pagePanelRect = findPagePanel()[0].getBoundingClientRect();
        const $footerPagePanel = findFooterPagePanel();
        let footerHeight = 0;
        if ($footerPagePanel.length > 0) {
            footerHeight = $footerPagePanel[0].getBoundingClientRect().height;
        }

        const topOffset = pagePanelRect.top;
        const bottomOffset = window.innerHeight - (pagePanelRect.height + footerHeight) - topOffset;

        let newHeight = pagePanelRect.height + footerHeight;
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

    function adjustWidthAndHorizontalPosition() {
        const scaleInfo = presenter.playerController.getScaleInformation();
        const pagePanelRect = findPagePanel()[0].getBoundingClientRect();

        const leftOffset = pagePanelRect.left;
        const rightOffset = window.innerWidth - pagePanelRect.width - leftOffset;

        let newWidth = pagePanelRect.width;
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
        removeHandlersNeededInZoomedPage();
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
