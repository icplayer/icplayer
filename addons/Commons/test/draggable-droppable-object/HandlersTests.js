TestCase("[Commons - Draggable Droppable Object] Connect events", {
    setUp: function () {
        this.configuration = {
            addonID: "addonID",
            objectID: "objectID",
            eventBus: function () {},
            getSelectedItem: function () {}
        };


        this.templateObject = new DraggableDroppableObject(this.configuration, {});

        this.stubs = {
            bindClickHandler: sinon.stub(this.templateObject, 'bindClickHandler'),
            bindDropHandler: sinon.stub(this.templateObject, 'bindDropHandler'),
            bindDraggableHandler: sinon.stub(this.templateObject, 'bindDraggableHandler')
        };
    },

    tearDown: function () {
        this.templateObject.bindClickHandler.restore();
        this.templateObject.bindDropHandler.restore();
        this.templateObject.bindDraggableHandler.restore();
    },

    'test connecting events should bind click handler': function () {
        this.templateObject.connectEvents(this.templateObject);

        assertTrue(this.stubs.bindClickHandler.calledOnce);
    },

    'test connecting events should bind drop handler': function () {
        this.templateObject.connectEvents(this.templateObject);

        assertTrue(this.stubs.bindDropHandler.calledOnce);
    },

    'test connecting events shouldnt bind draggable handler': function () {
        this.templateObject.connectEvents(this.templateObject);

        assertFalse(this.stubs.bindDraggableHandler.calledOnce);
    }
});

TestCase("[Commons - Draggable Droppable Object] Binding handlers", {
    setUp: function () {
        this.configuration = {
            addonID: "addonID",
            objectID: "objectID",
            eventBus: function () {},
            getSelectedItem: function () {}
        };


        this.templateObject = new DraggableDroppableObject(this.configuration, {});

        this.stubs = {
            bindClick: sinon.stub(this.templateObject.$view, 'click'),
            bindDroppable: sinon.stub(this.templateObject.$view, 'droppable'),
            bindDraggable: sinon.stub(this.templateObject.$view, 'draggable')
        };
    },

    tearDown: function () {
        this.templateObject.$view.click.restore();
        this.templateObject.$view.droppable.restore();
        this.templateObject.$view.draggable.restore();
    },

    'test binding click handler should use jquery on with click': function () {
        this.templateObject.bindClickHandler();

        assertTrue(this.stubs.bindClick.calledOnce);
    },


    'test binding drop handler should use jquery ui droppable': function () {
        this.templateObject.bindDropHandler();

        assertTrue(this.stubs.bindDroppable.calledOnce);
    },

    'test binding draggable handler should use jquery ui draggable': function () {
        this.templateObject.bindDraggableHandler();

        assertTrue(this.stubs.bindDraggable.calledOnce);
    }
});

TestCase("[Commons - Draggable Droppable Object] Click handler", {
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
            makeGapEmpty: sinon.stub(this.templateObject, 'makeGapEmpty'),
            fillGap: sinon.stub(this.templateObject, 'fillGap'),
            sendItemReturnedEvent: sinon.stub(this.templateObject, 'sendItemReturnedEvent')
        };
    },

    tearDown: function () {
        this.templateObject.getSelectedItem.restore();
        this.templateObject.makeGapEmpty.restore();
        this.templateObject.fillGap.restore();
        this.templateObject.sendItemReturnedEvent.restore();
    },

    'test when user clicks and selected item is empty then gap should become empty': function () {
        this.stubs.getSelectedItem.returns({type: "Empty"});

        this.templateObject.clickHandler();

        assertTrue(this.stubs.makeGapEmpty.calledOnce);
    },

    'test when user clicks gap should send ItemReturned event before making gap empty': function () {
        this.stubs.getSelectedItem.returns({type: "Empty"});

        this.templateObject.clickHandler();

        assertTrue(this.stubs.sendItemReturnedEvent.calledOnce);
        assertTrue(this.stubs.sendItemReturnedEvent.calledBefore(this.stubs.makeGapEmpty));
    },

    'test when user clicks gap should send ItemReturned event before filling gap': function () {
        this.stubs.getSelectedItem.returns({type: "string"});

        this.templateObject.clickHandler();

        assertTrue(this.stubs.sendItemReturnedEvent.calledOnce);
        assertTrue(this.stubs.sendItemReturnedEvent.calledBefore(this.stubs.fillGap));
    },

    'test when user clicks and selected item is valid object then gap should get filled': function () {
        var expectedItem = {type: "string", item: "asfd", value: "asfd"};
        this.stubs.getSelectedItem.returns(expectedItem);

        this.templateObject.clickHandler();

        assertFalse(this.stubs.makeGapEmpty.called);

        assertTrue(this.stubs.fillGap.calledOnce);
        assertTrue(this.stubs.fillGap.calledWith(expectedItem));
    }
});

TestCase("[Commons - Draggable Droppable Object] Drop handler", {
    setUp: function () {
        this.configuration = {
            addonID: "addonID",
            objectID: "objectID",
            eventBus: function () {},
            value: "1",
            source: "SourceList1-2",
            getSelectedItem: function () {}
        };

        this.expectedItem = {
            type: "string",
            value: "1",
            source: "SourceList1-2"
        };

        this.templateObject = new DraggableDroppableObject(this.configuration, {});

        this.stubs = {
            getSelectedItem: sinon.stub(this.templateObject, 'getSelectedItem'),
            fillGap: sinon.stub(this.templateObject, 'fillGap'),
            sendItemReturnedEvent: sinon.stub(this.templateObject, 'sendItemReturnedEvent'),
            setDroppedElement: sinon.stub(this.templateObject, 'setDroppedElement')
        };
    },

    tearDown: function () {
        this.templateObject.getSelectedItem.restore();
        this.templateObject.fillGap.restore();
        this.templateObject.sendItemReturnedEvent.restore();
        this.templateObject.setDroppedElement.restore();
    },

    'test when user drops object on gap it should at first send item returned event': function () {
        this.stubs.getSelectedItem.returns(this.expectedItem);

        var ui = {
            draggable: []
        };

        DraggableDroppableObject.prototype.dropHandler.call(this.templateObject, '', ui);

        assertTrue(this.stubs.sendItemReturnedEvent.calledOnce);
        assertTrue(this.stubs.sendItemReturnedEvent.calledBefore(this.stubs.fillGap));
    },

    'test when user drops object on gap it should get filled with provided item': function () {
        this.stubs.getSelectedItem.returns(this.expectedItem);

        var ui = {
            draggable: []
        };

        DraggableDroppableObject.prototype.dropHandler.call(this.templateObject, '', ui);

        assertTrue(this.stubs.fillGap.calledOnce);
        assertEquals(this.expectedItem, this.stubs.fillGap.getCall(0).args[0]);
    },

    'test drop handler should first get selected item': function () {
        this.stubs.getSelectedItem.returns({});

        var ui = {
            draggable: []
        };

        DraggableDroppableObject.prototype.dropHandler.call(this.templateObject, '', ui);

        assertTrue(this.stubs.getSelectedItem.calledOnce);
        assertTrue(this.stubs.getSelectedItem.calledBefore(this.stubs.fillGap));
    }
});

TestCase("[Commons - Draggable Droppable Object] Stop dragging handler", {
    setUp: function () {
        this.addonID = "addonID";
        this.htmlID = "htmlID";
        this.value = "1";
        this.source = "SourceList1-2";

        this.configuration = {
            addonID: this.addonID,
            objectID: this.htmlID,
            eventBus: function () {},
            value: this.value,
            source: this.source,
            getSelectedItem: function () {}
        };

        this.expectedItem = {
            type: "string",
            value: this.value,
            source: this.source
        };

        this.templateObject = new DraggableDroppableObject(this.configuration, {});


        this.stubs = {
            sendItemStoppedEvent: sinon.stub(DraggableDroppableObject.prototype, 'sendItemStoppedEvent'),
            setValue: sinon.stub(this.templateObject, 'setValue'),
            setSource: sinon.stub(DraggableDroppableObject.prototype, 'setSource'),
            makeGapEmpty: sinon.stub(this.templateObject, 'makeGapEmpty')
        };

        this.mockUI = {
            helper: [
                {remove: function () {}}
            ]
        };
    },

    tearDown: function () {
        DraggableDroppableObject.prototype.sendItemStoppedEvent.restore();
        DraggableDroppableObject.prototype.setSource.restore();

        this.templateObject.makeGapEmpty.restore();
        this.templateObject.setValue.restore();
    },

    'test when user stops dragging gap it should send item stopped event': function () {
        this.templateObject.stopDraggingHandler("", this.mockUI);

        assertTrue(this.stubs.sendItemStoppedEvent.calledOnce);
    },

    'test when user stops dragging gap it should change gap to empty': function () {
        this.templateObject.stopDraggingHandler("", this.mockUI);

        assertTrue(this.stubs.makeGapEmpty.calledOnce);
    }
});

TestCase("[Commons - Draggable Droppable Object] Start dragging handler", {
    setUp: function () {
        this.addonID = "addonID";
        this.htmlID = "htmlID";
        this.value = "1";
        this.source = "SourceList1-2";

        this.configuration = {
            addonID: this.addonID,
            objectID: this.htmlID,
            eventBus: function () {},
            value: this.value,
            source: this.source,
            getSelectedItem: function () {}
        };

        this.expectedItem = {
            type: "string",
            value: this.value,
            source: this.source
        };

        this.templateObject = new DraggableDroppableObject(this.configuration, {});

        this.uiMock = {
            helper: {
                zIndex: sinon.stub()
            }
        };

        this.stubs = {
            sendItemReturnedEvent: sinon.stub(DraggableDroppableObject.prototype, 'sendItemReturnedEvent'),
            sendItemDraggedEvent: sinon.stub(DraggableDroppableObject.prototype, 'sendItemDraggedEvent'),
            setViewValue: sinon.stub(this.templateObject, 'setViewValue')
        };
    },

    tearDown: function () {
        DraggableDroppableObject.prototype.sendItemDraggedEvent.restore();
        DraggableDroppableObject.prototype.sendItemReturnedEvent.restore();
        this.templateObject.setViewValue.restore();
    },

    'test when gap is started dragged it should send item returned event': function () {
        this.templateObject.startDraggingHandler("", this.uiMock);

        assertTrue(this.stubs.sendItemReturnedEvent.calledOnce);
    },

    'test when gap is started dragged it should send item returned before start dragged': function () {
        this.templateObject.startDraggingHandler("", this.uiMock);

        assertTrue(this.stubs.sendItemReturnedEvent.calledBefore(this.stubs.sendItemDraggedEvent));
    },

    'test when gap is started dragged should send item dragged event': function () {
        this.templateObject.startDraggingHandler("", this.uiMock);

        assertTrue(this.stubs.sendItemDraggedEvent.calledOnce);
    },

    'test when gap is started dragged should view be empty': function () {
        this.templateObject.startDraggingHandler("", this.uiMock);

        assertTrue(this.stubs.setViewValue.calledOnce);
        assertTrue(this.stubs.setViewValue.calledWith(""));
    },

    'test when gap is started dragged should helper zIndex change to 100': function () {
        this.templateObject.startDraggingHandler("", this.uiMock);

        assertTrue(this.uiMock.helper.zIndex.calledOnce);
        assertTrue(this.uiMock.helper.zIndex.calledWith(100));
    }
});