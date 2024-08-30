function AddonZoom_create() {
    var presenter = function() {};

    presenter.playerController = null;
    presenter.eventBus = null;
    presenter.configuration = null;
    presenter.isVisible = true;
    presenter.scaleModifier = 1.0;
    presenter.zoomedAreaContainer = null;
    presenter.zoomingTimeoutID = null;

    presenter.DEFAULT_ZOOM = 2;
    presenter.ERROR_CODES = {
        "SIZE_1": "Addon must fit within page size limits",
    };

    presenter.MODE = {
        "Targeted area": "TARGETED_AREA",
        "Area around a clicked point": "AREA_AROUND_CLICKED_POINT",
        DEFAULT: "Targeted area"
    };

    presenter.CSS_CLASSES = {
        ZOOM_WRAPPER: "zoom-wrapper",
        TARGETED_AREA: "targeted-area",
        AREA_AROUND_CLICKED_POINT: "area-around-clicked-point",
        ZOOM_WRAPPER_HIGHLIGHT: "zoom-wrapper-highlight",
        ZOOM_BUTTON_CONTAINER: "zoom-button-container",
        ZOOM_BUTTON: "zoom-button",
        SELECTED: "selected",
        ZOOMED_AREA_CONTAINER: "zoomed-area-container",
        ZOOM_OUT_BUTTON_CONTAINER: "zoom-out-button-container",
        ZOOM_OUT_BUTTON: "zoom-out-button",
        ZOOM_IN_CURSOR: "zoom-cursor-zoom-in",
        ZOOM_ZOOMED_IN: "zoom-zoomed-in",
        IC_PAGE: "ic_page",
        IC_FOOTER: "ic_footer",
        IC_PAGE_PANEL: "ic_page_panel",
        IWB_ZOOM_IN: "iwb-zoom-in",
        IWB_ZOOM_OUT: "iwb-zoom-out",
        MODULES_GROUP: "modules_group",
    };

    presenter.DEFAULT_TTS_PHRASES = {
        ZOOM_IN: "Zoom in",
        ACTIVATED: "Zoom in",
        ZOOM_OUT: "Zoom out",
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
        presenter.presenterLogic(view, model);
    };

    presenter.run = function(view, model) {
        presenter.presenterLogic(view, model);
        
        if (!presenter.configuration.isValid) {
            return;
        }
        zoom.init({ elementToZoom: findPage() });
        presenter.addHandlers();
    };

    presenter.presenterLogic = function(view, model) {
        presenter.view = view;
        presenter.$view = $(view);

        const upgradedModel = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(upgradedModel);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }
        presenter.addModeCSSClassName();
        presenter.setVisibility(presenter.configuration.isVisible);
    };

    presenter.upgradeModel = function(model) {
        return presenter.upgradeModelPropertyMode(model);
    };

    presenter.upgradeModelPropertyMode = function(model) {
        const upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!upgradedModel["Mode"]) {
            upgradedModel["Mode"] = "Targeted area";
        }

        return upgradedModel;
    };

    presenter.validateModel = function(model) {
        const mode = ModelValidationUtils.validateOption(presenter.MODE, model["Mode"]);

        const validatedSize = validateSizeRelativeToPageSize(mode);
        if (!validatedSize.isValid) {
            return validatedSize;
        }

        return {
            isValid: true,
            ID: model.ID,
            width: parseInt(model["Width"], 10),
            height: parseInt(model["Height"], 10),
            isVisible: ModelValidationUtils.validateBoolean(model["Is Visible"]),
            isTabindexEnabled: ModelValidationUtils.validateBoolean(model["Is Tabindex Enabled"]),
            mode: mode
        };
    };

    function validateSizeRelativeToPageSize(mode) {
        if (mode !== "TARGETED_AREA") {
            return getCorrectObject();
        }

        const page = findPage();
        let left = presenter.view.offsetLeft;
        let top = presenter.view.offsetTop;
        if (presenter.view.parentElement.classList.contains(presenter.CSS_CLASSES.MODULES_GROUP)) {
            left += presenter.view.parentElement.offsetLeft;
            top += presenter.view.parentElement.offsetTop;
        }
        if (left < 0 || left + presenter.view.offsetWidth > page.offsetWidth) {
            return getErrorObject("SIZE_1");
        }
        if (top < 0 || top + presenter.view.offsetHeight > page.offsetHeight) {
            return getErrorObject("SIZE_1");
        }
        return getCorrectObject();
    }

    function getErrorObject (ec) { return { isValid: false, errorCode: ec }; }
    function getCorrectObject (v) { return { isValid: true, value: v }; }

    presenter.addModeCSSClassName = function () {
        const zoomWrapper = findInView(presenter.CSS_CLASSES.ZOOM_WRAPPER);
        if (!zoomWrapper) {
            return;
        }
        const modeCSSClassName = isTargetedAreaModeActive()
            ? presenter.CSS_CLASSES.TARGETED_AREA
            : presenter.CSS_CLASSES.AREA_AROUND_CLICKED_POINT;
        zoomWrapper.classList.add(modeCSSClassName);
    };

    function showZoomButtonContainer() {
        findInView(presenter.CSS_CLASSES.ZOOM_BUTTON_CONTAINER).style.display = "block";
    }

    function hideZoomButtonContainer() {
        findInView(presenter.CSS_CLASSES.ZOOM_BUTTON_CONTAINER).style.display = "none";
    }

    presenter.executeCommand = function (name, params) {
        const commands = {
            "show": presenter.show,
            "hide": presenter.hide,
            "zoomIn": presenter.zoomIn,
            "zoomInArea": presenter.zoomInArea,
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
        if (isTargetedAreaModeActive()) {
            if (!MobileUtils.isMobileUserAgent(window.navigator.userAgent)) {
                addMouseOverZoomButtonListener();
            }
        } else {
            findPage().addEventListener("click", presenter.pageCallback);
        }
        findInView(presenter.CSS_CLASSES.ZOOM_BUTTON).addEventListener("click", presenter.zoomButtonCallback);

        MutationObserverService.createDestroyObserver(presenter.configuration.ID, presenter.destroy, presenter.view);
        MutationObserverService.setObserver();
    };

    presenter.removeHandlers = function () {
        if (!isTargetedAreaModeActive()) {
            findPage()?.removeEventListener("click", presenter.pageCallback);
        }
        findInView(presenter.CSS_CLASSES.ZOOM_BUTTON).removeEventListener("click", presenter.zoomButtonCallback);
    };

    function addMouseOverZoomButtonListener() {
        const zoomButton = findInView(presenter.CSS_CLASSES.ZOOM_BUTTON);
        const zoomWrapper = findInView(presenter.CSS_CLASSES.ZOOM_WRAPPER);

        zoomButton.addEventListener("mouseover", function (event) {
            zoomWrapper.classList.add(presenter.CSS_CLASSES.ZOOM_WRAPPER_HIGHLIGHT);
        });
        zoomButton.addEventListener("mouseout", function (event) {
            zoomWrapper.classList.remove(presenter.CSS_CLASSES.ZOOM_WRAPPER_HIGHLIGHT);
        });
    }

    presenter.pageCallback = function (event) {
        event.stopPropagation();
        if (!isEnabledZoomInCursor()) {
            return;
        }
        const pageRect = findPage().getBoundingClientRect();
        const scaleInfo = presenter.playerController.getScaleInformation();
        const x = (event.clientX - pageRect.x) / scaleInfo.baseScaleX;
        const y = (event.clientY - pageRect.y) / scaleInfo.baseScaleY;
        zoomIn(x, y);
    };

    presenter.zoomButtonCallback = function (event) {
        event.stopPropagation();
        if (isZoomed()) {
            return;
        }

        if (isTargetedAreaModeActive()) {
            zoomInOwnArea();
        } else {
            if (isEnabledZoomInCursor()) {
                enableZoomInCursor(false);
            } else {
                enableZoomInCursor(true);
            }
        }
    };

    presenter.zoomIn = function (x, y) {
        if (Array.isArray(x) && x.length === 2 && y === undefined) {
            y = parseInt(x[1]);
            x = parseInt(x[0]);
        }
        zoomIn(x, y);
    };

    function zoomIn(x, y) {
        if (isZoomed()) {
            return;
        }

        presenter.scaleModifier = presenter.DEFAULT_ZOOM;
        setFinalScaleInformation();

        const page = findPage();
        const adjustedPosition = adjustSelectedPointPositionToPageBoundaries(x, y);

        zoom.to({
            x: adjustedPosition.x,
            y: adjustedPosition.y,
            scale: presenter.scaleModifier,
            topWindowHeight: page.offsetHeight,
            topWindowWidth: page.offsetWidth,
            elementToZoom: page
        });

        preventOfIncludingScrollOffsetToTransformOrigin();
        createZoomedAreaContainer();
        enableZoomInCursor(false);
        hideZoomButtonContainer();
    }

    function zoomInOwnArea() {
        let left = presenter.view.offsetLeft;
        let top = presenter.view.offsetTop;
        if (presenter.view.parentElement.classList.contains(presenter.CSS_CLASSES.MODULES_GROUP)) {
            left += presenter.view.parentElement.offsetLeft;
            top += presenter.view.parentElement.offsetTop;
        }
        zoomInArea(
            left,
            top,
            presenter.view.offsetWidth,
            presenter.view.offsetHeight
        );
    }

    presenter.zoomInArea = function (x, y, width, height) {
        if (Array.isArray(x) && x.length === 4 && y === undefined && width === undefined && height === undefined) {
            height = parseInt(x[3]);
            width = parseInt(x[2]);
            y = parseInt(x[1]);
            x = parseInt(x[0]);
        }
        const modifiedAttributes = adjustZoomInAreaCommandToRestOfFunctionality(x, y, width, height);
        zoomInArea(modifiedAttributes.left, modifiedAttributes.top, modifiedAttributes.width, modifiedAttributes.height);
    };

    /**
     * Adjust the data given by a zoomInArea command to rest of functionality.
     *
     * Prevent also, from zooming the area outside the page boundaries.
     *
     * @method adjustZoomInAreaCommandToRestOfFunctionality
     * @param x:number Center point X coordinate
     * @param y:number Center point Y coordinate
     * @param width:number Width of area to zoom
     * @param height:number Height of area to zoom
     * @return {{left: number, top: number, width: number, height: number}} adjusted data
     */
    function adjustZoomInAreaCommandToRestOfFunctionality(x, y, width, height) {
        const page = findPage();

        let left = x - width / 2;
        let top = y - height / 2;

        const pageWidth = page.offsetWidth;
        width = Math.min(width, pageWidth);
        const minLeft = 0;
        const maxLeft = pageWidth - width;
        left = Math.min(Math.max(left, minLeft), maxLeft);

        const pageHeight = page.offsetHeight;
        height = Math.min(height, pageHeight);
        const minTop = 0;
        const maxTop = pageHeight - height;
        top = Math.min(Math.max(top, minTop), maxTop);

        return {left, top, width, height};
    }

    function zoomInArea(left, top, width, height) {
        if (isZoomed()) {
            return;
        }

        const page = findPage();
        const topWindowHeight = page.offsetHeight;
        const topWindowWidth = page.offsetWidth;
        presenter.scaleModifier = calculateScaleForArea(width, height, topWindowWidth, topWindowHeight);
        setFinalScaleInformation();

        const adjustedPosition = adjustSelectedAreaPositionToPageBoundaries(left, top, width, height);

        zoom.to({
            x: adjustedPosition.left,
            y: adjustedPosition.top,
            width: width,
            height: height,
            topWindowHeight: topWindowHeight,
            topWindowWidth: topWindowWidth,
            elementToZoom: page
        });

        preventOfIncludingScrollOffsetToTransformOrigin();
        createZoomedAreaContainer();
        enableZoomInCursor(false);
        hideZoomButtonContainer();
    }

    function calculateScaleForArea(areaWidth, areaHeight, topWindowWidth, topWindowHeight) {
        let scale = Math.max( Math.min( topWindowWidth / areaWidth, topWindowHeight / areaHeight ), 1 );
        if (Math.min( topWindowWidth / areaWidth, topWindowHeight / areaHeight ) <= 1){
            scale = Math.min( topWindowWidth / areaWidth, topWindowHeight / areaHeight )+1;
        }
        return scale;
    }

    function preventOfIncludingScrollOffsetToTransformOrigin() {
        findPage().style.transformOrigin = "0px 0px";
    }

    /**
     * Adjust the position data of a selected point, which is the center point of the zoomed area, so that the zoomed
     * area is within the boundaries of the page.
     *
     * @method adjustSelectedPointPositionToPageBoundaries
     * @param centerX:number Center point X coordinate
     * @param centerY:number Center point Y coordinate
     * @return {{x: number, y: number}} Center point position for zoomed area
     */
    function adjustSelectedPointPositionToPageBoundaries(centerX, centerY) {
        const page = findPage();

        const pageWidth = page.offsetWidth;
        const zoomedAreaWidth = pageWidth / presenter.scaleModifier;
        const halfOfZoomedAreaWidth = zoomedAreaWidth / 2;
        const minX = halfOfZoomedAreaWidth;
        const maxX = pageWidth - halfOfZoomedAreaWidth;
        centerX = Math.min(Math.max(centerX, minX), maxX);

        const pageHeight = page.offsetHeight;
        const zoomedAreaHeight = pageHeight / presenter.scaleModifier;
        const halfOfZoomedAreaHeight = zoomedAreaHeight / 2;
        const minY = halfOfZoomedAreaHeight;
        const maxY = pageHeight - halfOfZoomedAreaHeight;
        centerY = Math.min(Math.max(centerY, minY), maxY);

        return {x: centerX, y: centerY};
    }

    /**
     * Adjust the position data of a selected area, which is the left top apex point of the zoomed area,
     * so that the zoomed area is within the boundaries of the page.
     *
     * @method adjustSelectedAreaPositionToPageBoundaries
     * @param left:number Left top apex point X coordinate
     * @param top:number Left top apex point Y coordinate
     * @param width:number Width of area to zoom
     * @param height:number Height of area to zoom
     * @return {{left: number, top: number}} Left top apex point position for zoomed area
     */
    function adjustSelectedAreaPositionToPageBoundaries(left, top, width, height) {
        const page = findPage();

        const pageWidth = page.offsetWidth;
        const zoomedAreaWidth = pageWidth / presenter.scaleModifier;
        const halfOfZoomedAreaWidth = zoomedAreaWidth / 2;
        const centerMinX = halfOfZoomedAreaWidth;
        const centerMaxX = pageWidth - halfOfZoomedAreaWidth;
        let centerX = left + width / 2;
        centerX = Math.min(Math.max(centerX, centerMinX), centerMaxX);
        left = centerX - width / 2;

        const pageHeight = page.offsetHeight;
        const zoomedAreaHeight = pageHeight / presenter.scaleModifier;
        const halfOfZoomedAreaHeight = zoomedAreaHeight / 2;
        const centerMinY = halfOfZoomedAreaHeight;
        const centerMaxY = pageHeight - halfOfZoomedAreaHeight;
        let centerY = top + height / 2;
        centerY = Math.min(Math.max(centerY, centerMinY), centerMaxY);
        top = centerY - height / 2;

        return {left, top};
    }

    function setFinalScaleInformation() {
        const scaleInfo = presenter.playerController.getScaleInformation();
        presenter.playerController.setFinalScaleInformation({
            scaleX: scaleInfo.baseScaleX * presenter.scaleModifier,
            scaleY: scaleInfo.baseScaleY * presenter.scaleModifier
        });
    }

    function createZoomedAreaContainer() {
        presenter.zoomedAreaContainer = document.createElement("div");
        presenter.zoomedAreaContainer.classList.add(presenter.CSS_CLASSES.ZOOMED_AREA_CONTAINER);
        presenter.zoomedAreaContainer.style.visibility = "hidden";

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add(presenter.CSS_CLASSES.ZOOM_OUT_BUTTON_CONTAINER);
        presenter.zoomedAreaContainer.append(buttonContainer);

        const button = document.createElement("div");
        button.classList.add(presenter.CSS_CLASSES.ZOOM_OUT_BUTTON);
        button.addEventListener("click", presenter.zoomOutButtonCallback);
        buttonContainer.append(button);

        document.body.append(presenter.zoomedAreaContainer);

        const timeout = 1000; // zoom.TRANSITION_DURATION + 200
        presenter.zoomingTimeoutID = setTimeout(() => {
            findPage().classList.add(presenter.CSS_CLASSES.ZOOM_ZOOMED_IN);
            setUpZoomedAreaContainerAfterZoomIn();
            presenter.zoomingTimeoutID = null;
        }, timeout);
    }

    function setUpZoomedAreaContainerAfterZoomIn() {
        const scrollElements = findScrollElements();
        let maxScrollTop = 0;
        try {
            for (let i = 0; i < scrollElements.length; i++) {
                let elementScrollTop = scrollElements[i].scrollTop();
                maxScrollTop = Math.max(elementScrollTop, maxScrollTop);
            }
        } catch(e) {}
        adjustZoomedAreaContainerCSS(undefined, maxScrollTop);
        addHandlersNeededWhenZoomed();
        presenter.zoomedAreaContainer.style.visibility = "visible";
    }

    function findScrollElements() {
        const $defaultScrollElement = $(window.parent.document);
        const $mCourserScrollElement = $defaultScrollElement.find('#lesson-view > div > div');
        const $mAuthorMobileScrollElement = $(window);
        const $mCourserMobileScrollElement = $("#content-view");
        const $mLibroDesktopScrollElement = $($("#_icplayerContent")[0]?.shadowRoot.querySelector(".inner-scroll"));
        return [
            $defaultScrollElement, $mCourserScrollElement, $mAuthorMobileScrollElement,
            $mCourserMobileScrollElement, $mLibroDesktopScrollElement
        ];
    }

    function isScreenOrientationChangeHandlerNeeded() {
        const isIOS = MobileUtils.isSafariMobile(window.navigator.userAgent);
        const isSafari = navigator.userAgent.toLowerCase().indexOf('safari/') > -1;
        return isIOS && isSafari && screen && screen.orientation;
    }

    function addHandlersNeededWhenZoomed() {
        addEscHandlerNeededWhenZoomed();
        addOnScrollHandlersNeededWhenZoomed();
        if (isScreenOrientationChangeHandlerNeeded()) {
            addOnScreenOrientationChangeHandler();
        }
    }

    function addOnScrollHandlersNeededWhenZoomed() {
        const scrollElements = findScrollElements();
        try {
            for (let i = 0; i < scrollElements.length; i++) {
                scrollElements[i].scroll(adjustZoomedAreaContainerCSS);
            }
        } catch (e) {}
    }

    function addEscHandlerNeededWhenZoomed() {
        document.body.addEventListener( "keyup", keyUpHandler);
    }

    function addOnScreenOrientationChangeHandler() {
        screen.orientation.addEventListener("change", adjustZoomedAreaContainerCSS);
    }

    function keyUpHandler(event) {
        const escKeyCode = 27;
        if (event.keyCode === escKeyCode) {
            presenter.zoomOut();
        }
    }

    function removeHandlersNeededWhenZoomed() {
        removeEscHandlerNeededWhenZoomed();
        removeOnScrollHandlersNeededWhenZoomed();
        if (isScreenOrientationChangeHandlerNeeded()) {
            removeOnScreenOrientationChangeHandler();
        }
    }

    function removeOnScrollHandlersNeededWhenZoomed() {
        const scrollElements = findScrollElements();
        try {
            for (let i = 0; i < scrollElements.length; i++) {
                scrollElements[i][0].removeEventListener("scroll", adjustZoomedAreaContainerCSS);
            }
        } catch (e) {}
    }

    function removeEscHandlerNeededWhenZoomed() {
        document.body.removeEventListener( "keyup", keyUpHandler);
    }

    function removeOnScreenOrientationChangeHandler() {
        screen.orientation.removeEventListener("change", adjustZoomedAreaContainerCSS);
    }

    function removeZoomedAreaContainer() {
        if (presenter.zoomedAreaContainer) {
            presenter.zoomedAreaContainer.remove();
            presenter.zoomedAreaContainer = null;
        }
    }

    function adjustZoomedAreaContainerCSS(event, scrollTop) {
        if (!presenter.zoomedAreaContainer) {
            return;
        }
        if (!scrollTop) {
            scrollTop = $(this).scrollTop();
        }
        setFinalScaleInformation(); // Prevent scale information from being overwritten

        const isInIframe = window.parent.location !== window.location;
        if (isInIframe) {
            adjustHeightAndVerticalPositionWhenInIframe(scrollTop);
        } else {
            adjustHeightAndVerticalPositionWhenNotInIframe();
        }
        adjustWidthAndHorizontalPosition();
        adjustZoomedAreaContainerTransform();
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

        presenter.zoomedAreaContainer.style.height = newHeight / iframeSize.scaleX + "px";
        presenter.zoomedAreaContainer.style.top = newTop / iframeSize.scaleX + "px";
    }

    function adjustHeightAndVerticalPositionWhenNotInIframe() {
        const scaleInfo = presenter.playerController.getScaleInformation();
        const pagePanelRect = findPagePanel().getBoundingClientRect();
        const footerPagePanel = findFooterPagePanel();
        let footerHeight = 0;
        if (footerPagePanel) {
            footerHeight = footerPagePanel.getBoundingClientRect().height;
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

        presenter.zoomedAreaContainer.style.height = newHeight / scaleInfo.scaleY + "px";
        presenter.zoomedAreaContainer.style.top = newTop + "px";
    }

    function adjustWidthAndHorizontalPosition() {
        const scaleInfo = presenter.playerController.getScaleInformation();
        const pagePanelRect = findPagePanel().getBoundingClientRect();

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

        presenter.zoomedAreaContainer.style.width = newWidth / scaleInfo.scaleX + "px";
        presenter.zoomedAreaContainer.style.left = newLeft + "px";
    }

    function adjustZoomedAreaContainerTransform() {
        const scaleInfo = presenter.playerController.getScaleInformation();

        presenter.zoomedAreaContainer.style.transform = "scale(" + scaleInfo.scaleX + ", " + scaleInfo.scaleY + ")";
        presenter.zoomedAreaContainer.style.transformOrigin = "left top";
    }

    function isZoomed() {
        const icPagePanel = findPagePanel();
        const isIWBToolbarActive = (icPagePanel.classList.contains(presenter.CSS_CLASSES.IWB_ZOOM_IN) ||
            icPagePanel.classList.contains(presenter.CSS_CLASSES.IWB_ZOOM_OUT));
        if (isIWBToolbarActive) {
            return true;
        }

        const scaleInfo = presenter.playerController.getScaleInformation();
        return ((scaleInfo.baseScaleX !== scaleInfo.scaleX || scaleInfo.baseScaleY !== scaleInfo.scaleY) ||
            document.body.getElementsByClassName(presenter.CSS_CLASSES.ZOOMED_AREA_CONTAINER).length > 0
        );
    }

    function enableZoomInCursor(enable) {
        const page = findPage();
        const zoomButton = findInView(presenter.CSS_CLASSES.ZOOM_BUTTON);
        if (enable) {
            page.classList.add(presenter.CSS_CLASSES.ZOOM_IN_CURSOR);
            zoomButton.classList.add(presenter.CSS_CLASSES.SELECTED);
        } else {
            page.classList.remove(presenter.CSS_CLASSES.ZOOM_IN_CURSOR);
            zoomButton.classList.remove(presenter.CSS_CLASSES.SELECTED);
        }
    }

    function isEnabledZoomInCursor() {
        return findPage().classList.contains(presenter.CSS_CLASSES.ZOOM_IN_CURSOR);
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
        removeZoomedAreaContainer();
        if (presenter.zoomingTimeoutID) {
            clearTimeout(presenter.zoomingTimeoutID);
            presenter.zoomingTimeoutID = null;
        }
        zoom.out();
        removeHandlersNeededWhenZoomed();
        findPage()?.classList.remove(presenter.CSS_CLASSES.ZOOM_ZOOMED_IN);
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

    function isTargetedAreaModeActive() {
        return presenter.configuration.mode === "TARGETED_AREA";
    }

    function findPage() {
        return presenter.view.closest('.' + presenter.CSS_CLASSES.IC_PAGE);
    }

    function findPagePanel() {
        return findPage().closest('.' + presenter.CSS_CLASSES.IC_PAGE_PANEL);
    }

    function findFooterPagePanel() {
        return document.body.querySelector('.' + presenter.CSS_CLASSES.IC_FOOTER)?.closest('.' + presenter.CSS_CLASSES.IC_PAGE_PANEL);
    }

    function findInView(cssClass) {
        return presenter.view.querySelector('.' + cssClass);
    }

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
