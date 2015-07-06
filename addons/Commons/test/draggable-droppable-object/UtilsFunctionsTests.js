TestCase("[Commons - Draggable Droppable Object] Lock/Unlock", {
    setUp: function () {
        this.addonID = "addonID";
        this.objectID = "objectID";

        this.configuration = {
            addonID: this.addonID,
            objectID: this.objectID,
            eventBus: function () {},
            getSelectedItem: function () {}
        };

        this.templateObject = new DraggableDroppableObject(this.configuration, {});

        this.stubs = {
            droppable: sinon.stub(this.templateObject.$view, 'droppable'),
            draggable: sinon.stub(this.templateObject.$view, 'draggable'),
            unbind: sinon.stub(this.templateObject.$view, 'unbind'),
            bindClickHandler: sinon.stub(DraggableDroppableObject.prototype, 'bindClickHandler')
        };
    },

    tearDown: function () {
        DraggableDroppableObject.prototype.bindClickHandler.restore();
        this.templateObject.$view.droppable.restore();
        this.templateObject.$view.draggable.restore();
        this.templateObject.$view.unbind.restore();
    },

    'test locking object should disable droppable': function () {
        this.templateObject.lock();

        assertTrue(this.stubs.droppable.calledOnce);
        assertTrue(this.stubs.droppable.calledWith("disable"));
    },

    'test locking object should disable draggable': function () {
        this.templateObject.lock();

        assertTrue(this.stubs.draggable.calledOnce);
        assertTrue(this.stubs.draggable.calledWith("disable"));
    },

    'test locking object should unbind click': function () {
        this.templateObject.lock();

        assertTrue(this.stubs.unbind.calledOnce);
        assertTrue(this.stubs.unbind.calledWith("click"));
    },

    'test unlocking object should bind click again': function () {
        this.templateObject.unlock();

        assertTrue(this.stubs.bindClickHandler.calledOnce);
    },

    'test unlocking object should enable draggable': function () {
        this.templateObject.unlock();

        assertTrue(this.stubs.draggable.calledWith("enable"))
    },

    'test unlocking object should enable droppable': function () {
        this.templateObject.unlock();

        assertTrue(this.stubs.droppable.calledWith("enable"))
    }
});

TestCase("[Commons - Draggable Droppable Object] Validate selected item data", {
    setUp: function () {
        this.invalidData = {
        };

        this.validData = {
            type: "string",
            value: "2",
            item: "test source"
        };

    },

    'test when data is valid, it shouldnt change it type': function () {
        var validatedData = DraggableDroppableObject._internal.validateSelectedItemData(this.validData);
        assertEquals(this.validData.type, validatedData.type);
    },

    'test when data dont have type then is invalid, it type should be Empty': function () {
        var validatedData = DraggableDroppableObject._internal.validateSelectedItemData(this.invalidData);
        assertEquals("Empty", validatedData.type);
    },

    'test when data dont have value then is invalid, it type should be Empty': function () {
        this.invalidData = {
            type: 'string'
        };

        var validatedData = DraggableDroppableObject._internal.validateSelectedItemData(this.invalidData);
        assertEquals("Empty", validatedData.type);
    },

    'test when data dont have item then is invalid, it type should be Empty': function () {
        this.invalidData = {
            type: 'string',
            value: "54"
        };

        var validatedData = DraggableDroppableObject._internal.validateSelectedItemData(this.invalidData);
        assertEquals("Empty", validatedData.type);
    },

    'test when data item is equal to null, it type should be Empty': function () {
        this.validData.item = null;

        var validatedData = DraggableDroppableObject._internal.validateSelectedItemData(this.validData);
        assertEquals("Empty", validatedData.type);
    },

    'test when data value is equal to null, it type should be Empty': function () {
        this.validData.value = null;

        var validatedData = DraggableDroppableObject._internal.validateSelectedItemData(this.validData);
        assertEquals("Empty", validatedData.type);
    }
});

TestCase("[Commons - Draggable Droppable Object] Get selected item wrapped", {
    setUp: function () {
        this.configuration = {
            addonID: "addonID",
            objectID: "objectID",
            eventBus: function () {},
            getSelectedItem: function () {}
        };

        this.templateObject = new DraggableDroppableObject(this.configuration, {});

        this.stubs = {
            getSelectedItem: sinon.stub(this.templateObject, 'getSelectedItem'),
            validateSelectedItemData: sinon.stub(DraggableDroppableObject._internal, 'validateSelectedItemData')
        };
    },

    tearDown: function () {
        this.templateObject.getSelectedItem.restore();
        DraggableDroppableObject._internal.validateSelectedItemData.restore();
    },

    'test wrapper should wrap get selected item': function () {
        DraggableDroppableObject._internal.getSelectedItemWrapper.call(this.templateObject);

        assertTrue(this.stubs.getSelectedItem.calledOnce);
    },

    'test wrapper should validate data which he obtained': function () {
        var expectedData = {test: "aslkdnj.fal;3r"};

        this.stubs.getSelectedItem.returns(expectedData);

        DraggableDroppableObject._internal.getSelectedItemWrapper.call(this.templateObject);

        assertTrue(this.stubs.validateSelectedItemData.calledOnce);
        assertTrue(this.stubs.validateSelectedItemData.calledWith(expectedData));
    }
});


TestCase("[Commons - Draggable Droppable Object] Make gap empty", {
    setUp: function () {
        this.configuration = {
            addonID: "addonID",
            objectID: "objectID",
            eventBus: function () {},
            value: "1",
            source: "SourceList1-2",
            getSelectedItem: function () {}
        };

        this.templateObject = new DraggableDroppableObject(this.configuration, {});

        this.stubs = {
            setValue: sinon.stub(this.templateObject, 'setValue'),
            setViewValue: sinon.stub(this.templateObject, 'setViewValue'),
            setSource: sinon.stub(DraggableDroppableObject.prototype, 'setSource'),
            notifyEdit: sinon.stub(this.templateObject, 'notifyEdit')
        };
    },

    tearDown: function () {
        this.templateObject.notifyEdit.restore();
        this.templateObject.setValue.restore();
        DraggableDroppableObject.prototype.setSource.restore();
    },

    'test making gap empty should notify state machine about edit': function () {
        this.templateObject.makeGapEmpty(this.templateObject);

        assertTrue(this.stubs.notifyEdit.calledOnce);
    },

    'test making gap empty should change its value to empty string': function () {
        this.templateObject.makeGapEmpty(this.templateObject);

        assertTrue(this.stubs.setValue.calledOnce);
        assertTrue(this.stubs.setValue.calledWith(""));
    },

    'test making gap empty should change its view value to empty string': function () {
        this.templateObject.makeGapEmpty(this.templateObject);

        assertTrue(this.stubs.setViewValue.calledOnce);
        assertTrue(this.stubs.setViewValue.calledWith(""));
    },

    'test making gap empty should change its source to empty string': function () {
        this.templateObject.makeGapEmpty(this.templateObject);

        assertTrue(this.stubs.setSource.calledOnce);
        assertTrue(this.stubs.setSource.calledWith(""));
    }
});

TestCase("[Commons - Draggable Droppable Object] Fill gap", {
    setUp: function () {
        this.item = "SourceList123";
        this.value = "1";

        this.providedItem = {
            'item': this.item,
            'value': this.value
        };

        this.configuration = {
            addonID: "addonID",
            objectID: "objectID",
            eventBus: function () {},
            value: "1",
            source: "SourceList1-2",
            getSelectedItem: function () {}
        };

        this.templateObject = new DraggableDroppableObject(this.configuration, {});

        this.stubs = {
            sendItemConsumedEvent: sinon.stub(DraggableDroppableObject.prototype, 'sendItemConsumedEvent'),
            setValue: sinon.stub(this.templateObject, 'setValue'),
            setViewValue: sinon.stub(this.templateObject, 'setViewValue'),
            setSource: sinon.stub(DraggableDroppableObject.prototype, 'setSource'),
            notifyEdit: sinon.stub(this.templateObject, 'notifyEdit')
        };
    },

    tearDown: function () {
        this.templateObject.setValue.restore();
        this.templateObject.setViewValue.restore();
        this.templateObject.notifyEdit.restore();
        DraggableDroppableObject.prototype.sendItemConsumedEvent.restore();
        DraggableDroppableObject.prototype.setSource.restore();
    },

    'test filling gap should notify state machine about editing': function () {
        DraggableDroppableObject.prototype.fillGap.call(this.templateObject, this.providedItem);

        assertTrue(this.stubs.notifyEdit.calledOnce);
    },


    'test filling gap should set value with provided item': function () {
        DraggableDroppableObject.prototype.fillGap.call(this.templateObject, this.providedItem);

        assertTrue(this.stubs.setValue.calledOnce);
        assertTrue(this.stubs.setValue.calledWith(this.value));
    },


    'test filling gap should set view value with provided item': function () {
        DraggableDroppableObject.prototype.fillGap.call(this.templateObject, this.providedItem);

        assertTrue(this.stubs.setViewValue.calledOnce);
        assertTrue(this.stubs.setViewValue.calledWith(this.value));
    },

    'test filling gap should set source of provided item': function () {
        DraggableDroppableObject.prototype.fillGap.call(this.templateObject, this.providedItem);

        assertTrue(this.stubs.setSource.calledOnce);
        assertTrue(this.stubs.setSource.calledWith(this.item));
    },

    'test filling gap should send item consumed event': function () {
        this.templateObject.fillGap.call(this.templateObject, this.providedItem);

        assertTrue(this.stubs.sendItemConsumedEvent.calledOnce);
    },

    'test filling gap should send item consumed event after changing values': function () {
        this.templateObject.fillGap.call(this.templateObject, this.providedItem);

        assertTrue(this.stubs.sendItemConsumedEvent.calledAfter(this.stubs.setValue));
        assertTrue(this.stubs.sendItemConsumedEvent.calledAfter(this.stubs.setSource));
    }
});

TestCase("[Commons - Draggable Droppable Object] Click dispatcher", {
    setUp: function () {
        this.configuration = {
            addonID: "addonID",
            objectID: "objectID",
            eventBus: function () {},
            value: "1",
            source: "SourceList1-2",
            getSelectedItem: function () {}
        };

        this.templateObject = new DraggableDroppableObject(this.configuration, {});

        this.stubs = {
            clickHandler: sinon.stub(DraggableDroppableObject.prototype, 'clickHandler')
        };
    },

    tearDown: function () {
        DraggableDroppableObject.prototype.clickHandler.restore();
    },

    'test when object is clickable it should call click handler': function () {
        this.templateObject.clickDispatcher();

        assertTrue(this.stubs.clickHandler.calledOnce);
    },

    'test when object is not clickable it shouldnt call click handler': function () {
        this.templateObject._isClickable = false;

        this.templateObject.clickDispatcher();

        assertFalse(this.stubs.clickHandler.called);
    },

    'test when object is not clickable it should restore its state to clickable': function () {
        this.templateObject._isClickable = false;

        this.templateObject.clickDispatcher();

        assertTrue(this.templateObject._isClickable);
    }
});

TestCase("[Commons - Draggable Droppable Object] onReset", {
    setUp: function () {
        this.configuration = {
            addonID: "addonID",
            objectID: "objectID",
            eventBus: function () {},
            value: "1",
            source: "SourceList1-2",
            getSelectedItem: function () {}
        };

        this.templateObject = new DraggableDroppableObject(this.configuration, {});

        this.stubs = {
            setValue: sinon.stub(this.templateObject, 'setValue'),
            setViewValue: sinon.stub(this.templateObject, 'setViewValue'),
            setSource: sinon.stub(DraggableDroppableObject.prototype, 'setSource')
        };
    },

    tearDown: function () {
        this.templateObject.setValue.restore();
        this.templateObject.setViewValue.restore();
        DraggableDroppableObject.prototype.setSource.restore();
    },

    'test onReset should set value of object with empty string': function () {
        this.templateObject.onReset();

        assertTrue(this.stubs.setValue.calledOnce);
        assertTrue(this.stubs.setValue.calledWith(""));
    },

    'test onReset should set view value of object with empty string': function () {
        this.templateObject.onReset();

        assertTrue(this.stubs.setViewValue.calledOnce);
        assertTrue(this.stubs.setViewValue.calledWith(""));
    },

    'test onReset should set source of object with to empty string': function () {
        this.templateObject.onReset();

        assertTrue(this.stubs.setSource.calledOnce);
        assertTrue(this.stubs.setSource.calledWith(""));
    }
});

TestCase("[Commons - Draggable Droppable Object] Set state", {
    setUp: function () {
        this.configuration = {
            addonID: "addonID",
            objectID: "objectID",
            eventBus: function () {},
            value: "1",
            source: "SourceList1-2",
            getSelectedItem: function () {}
        };

        this.templateObject = new DraggableDroppableObject(this.configuration, {});

        this.stubs = {
            setValue: sinon.stub(this.templateObject, 'setValue'),
            setViewValue: sinon.stub(this.templateObject, 'setViewValue'),
            setSource: sinon.stub(DraggableDroppableObject.prototype, 'setSource'),
            bindDraggableHandler: sinon.stub(DraggableDroppableObject.prototype, 'bindDraggableHandler'),
            notifyEdit: sinon.stub(this.templateObject, 'notifyEdit')
        };

        this.expectedValue = "asdf.hja3w";
        this.expectedSource = "asdf.SourceListlha423yasdf";
    },

    tearDown: function () {
        this.templateObject.setValue.restore();
        this.templateObject.setViewValue.restore();
        this.templateObject.notifyEdit.restore();
        DraggableDroppableObject.prototype.setSource.restore();
        DraggableDroppableObject.prototype.bindDraggableHandler.restore();
    },

    'test set state should set object model with provided value': function () {
        this.templateObject.setState(this.expectedValue, this.expectedSource);

        assertTrue(this.stubs.setValue.calledOnce);
        assertTrue(this.stubs.setValue.calledWith(this.expectedValue));
    },

    'test set state should set object view with provided value': function () {
        this.templateObject.setState(this.expectedValue, this.expectedSource);

        assertTrue(this.stubs.setViewValue.calledOnce);
        assertTrue(this.stubs.setViewValue.calledWith(this.expectedValue));
    },

    'test set state should set object model with a provided source': function () {
        this.templateObject.setState(this.expectedValue, this.expectedSource);


        assertTrue(this.stubs.setSource.calledOnce);
        assertTrue(this.stubs.setSource.calledWith(this.expectedSource));
    },

    'test set state should bind object draggable handler': function () {
        this.templateObject.setState(this.expectedValue, this.expectedSource);

        assertTrue(this.stubs.bindDraggableHandler.calledOnce);
    },

    'test set state should notifyEdit': function () {
        this.templateObject.setState(this.expectedValue, this.expectedSource);

        assertTrue(this.stubs.notifyEdit.calledOnce);
    }
});