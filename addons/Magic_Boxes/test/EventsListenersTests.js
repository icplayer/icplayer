TestCase("[Magic Boxes] Add event listeners to grid tests", {
    setUp: function () {
        this.presenter = AddonMagic_Boxes_create();

        this.stubs = {
            isEventSupportedStub: sinon.stub(),
            magicGridWrapperAddEventListenerStub: sinon.stub(),
            magicGridAddEventListenerStub: sinon.stub()
        };

        this.presenter.view = this.createView();

        MobileUtils.isEventSupported = this.stubs.isEventSupportedStub;
        this.stubs.isEventSupportedStub.returns(false);
    },

    createView: function () {
        const view = document.createElement("div");

        const magicGridWrapper = document.createElement("div");
        magicGridWrapper.classList.add(this.presenter.CSS_CLASSES.GRID_WRAPPER);
        magicGridWrapper.addEventListener = this.stubs.magicGridWrapperAddEventListenerStub;
        view.append(magicGridWrapper);

        const magicGrid = document.createElement("div");
        magicGrid.classList.add(this.presenter.CSS_CLASSES.GRID);
        magicGrid.addEventListener = this.stubs.magicGridAddEventListenerStub;
        magicGridWrapper.append(magicGrid);

        return view;
    },

    tearDown: function () {
        this.setPointerEventSupport(true);
    },

    setPointerEventSupport: function (hasSupport) {
        window.EventsUtils.PointingEvents._internals.refresh(hasSupport);
    },

    validateAttachedListeners: function (stub, expectedEventTypes) {
        for (let i = 0, givenEventType; i < stub.callCount; i++) {
            givenEventType = stub.getCall(i).args[0];
            assertTrue(
                `Expected event listener with one of types: [${expectedEventTypes}], but get ${givenEventType}.`,
                expectedEventTypes.includes(givenEventType)
            );
        }
    },

    'test given only touch supported window when adding event listeners to grid then add touch event listeners': function () {
        this.setPointerEventSupport(false);
        this.stubs.isEventSupportedStub.returns(true);

        this.presenter._addEventListenersToGrid();

        const expectedEventTypes = ["touchmove"];
        this.validateAttachedListeners(this.stubs.magicGridAddEventListenerStub, expectedEventTypes);
    },

    'test given only mouse supported window when adding event listeners to grid then add mouse event listeners': function () {
        this.setPointerEventSupport(false);
        this.stubs.isEventSupportedStub.returns(false);

        this.presenter._addEventListenersToGrid();

        const expectedEventTypes = ["mousedown", "mouseup", "mouseleave"];
        this.validateAttachedListeners(this.stubs.magicGridWrapperAddEventListenerStub, expectedEventTypes);
    },

    'test given only pointer supported window when adding event listeners to grid then add pointer event listeners': function () {
        this.setPointerEventSupport(true);
        this.stubs.isEventSupportedStub.returns(false);

        this.presenter._addEventListenersToGrid();

        const expectedEventTypes = ["pointerdown", "pointerup", "pointerleave"];
        this.validateAttachedListeners(this.stubs.magicGridWrapperAddEventListenerStub, expectedEventTypes);
    },

    'test given pointer and touch supported window when adding event listeners to grid then add pointer event listeners': function () {
        this.setPointerEventSupport(true);
        this.stubs.isEventSupportedStub.returns(true);

        this.presenter._addEventListenersToGrid();

        const expectedEventTypes = ["pointerdown", "pointerup", "pointerleave"];
        this.validateAttachedListeners(this.stubs.magicGridWrapperAddEventListenerStub, expectedEventTypes);
    }
});

TestCase("[Magic Boxes] Add event listeners to selectable element tests", {
    setUp: function () {
        this.presenter = AddonMagic_Boxes_create();

        this.stubs = {
            isEventSupportedStub: sinon.stub(),
            addEventListenerStub: sinon.stub(),
            removeEventListenerStub: sinon.stub()
        };

        this.presenter.configuration = {
            columns: 2,
            rows: 2
        };

        this.presenter.view = this.createView();

        MobileUtils.isEventSupported = this.stubs.isEventSupportedStub;
        this.stubs.isEventSupportedStub.returns(false);
    },

    createView: function () {
        const view = document.createElement("div");

        const magicGridWrapper = document.createElement("div");
        magicGridWrapper.classList.add(this.presenter.CSS_CLASSES.GRID_WRAPPER);
        view.append(magicGridWrapper);

        const magicGrid = document.createElement("div");
        magicGrid.classList.add(this.presenter.CSS_CLASSES.GRID);
        magicGridWrapper.append(magicGrid);

        for (let rowId = 0; rowId < this.presenter.configuration.rows; rowId++) {
            for (let columnId = 0; columnId < this.presenter.configuration.columns; columnId++) {
                const selectableElementWrapper = document.createElement("div");
                selectableElementWrapper.classList.add(this.presenter.CSS_CLASSES.ELEMENT_WRAPPER);
                magicGrid.append(selectableElementWrapper);

                const selectableElement = document.createElement("div");
                selectableElement.classList.add(this.presenter.CSS_CLASSES.ELEMENT);
                selectableElementWrapper.append(selectableElement);
            }
        }

        return view;
    },

    tearDown: function () {
        this.setPointerEventSupport(true);
    },

    setPointerEventSupport: function (hasSupport) {
        window.EventsUtils.PointingEvents._internals.refresh(hasSupport);
    },

    prepareElement: function (row, column) {
        const index = row * this.presenter.configuration.columns + column;
        const element = this.presenter.view.getElementsByClassName(this.presenter.CSS_CLASSES.ELEMENT)[index];
        element.addEventListener = this.stubs.addEventListenerStub;
        element.removeEventListener = this.stubs.removeEventListenerStub;
        return element;
    },

    validateAttachedListeners: function (expectedEventTypes) {
        for (let i = 0, givenEventType; i < this.stubs.addEventListenerStub.callCount; i++) {
            givenEventType = this.stubs.addEventListenerStub.getCall(i).args[0];
            assertTrue(
                `Expected event listener with one of types: [${expectedEventTypes}], but get ${givenEventType}.`,
                expectedEventTypes.includes(givenEventType)
            );
        }
    },

    'test given only touch supported window when adding event listeners to element then add touch event listeners': function () {
        this.setPointerEventSupport(false);
        this.stubs.isEventSupportedStub.returns(true);
        const element = this.prepareElement(1, 1);

        this.presenter._addEventListenersToSelectableElement(element, 1, 1);

        const expectedEventTypes = ["click"];
        this.validateAttachedListeners(expectedEventTypes);
    },

    'test given only mouse supported window when adding event listeners to element then add mouse event listeners': function () {
        this.setPointerEventSupport(false);
        this.stubs.isEventSupportedStub.returns(false);
        const element = this.prepareElement(1, 1);

        this.presenter._addEventListenersToSelectableElement(element, 1, 1);

        const expectedEventTypes = ["mouseout", "mousedown", "mouseup", "mousemove"];
        this.validateAttachedListeners(expectedEventTypes);
    },

    'test given only pointer supported window when adding event listeners to element then add pointer event listeners': function () {
        this.setPointerEventSupport(true);
        this.stubs.isEventSupportedStub.returns(false);
        const element = this.prepareElement(1, 1);

        this.presenter._addEventListenersToSelectableElement(element, 1, 1);

        const expectedEventTypes = ["pointerdown", "pointerup", "pointerout", "pointermove"];
        this.validateAttachedListeners(expectedEventTypes);
    },

    'test given pointer and touch supported window when adding event listeners to element then add pointer event listeners': function () {
        this.setPointerEventSupport(true);
        this.stubs.isEventSupportedStub.returns(true);
        const element = this.prepareElement(1, 1);

        this.presenter._addEventListenersToSelectableElement(element, 1, 1);

        const expectedEventTypes = ["pointerdown", "pointerup", "pointerout", "pointermove"];
        this.validateAttachedListeners(expectedEventTypes);
    }
});
