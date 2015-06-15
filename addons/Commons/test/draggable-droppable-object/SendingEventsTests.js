TestCase("[Commons - Draggable Droppable Object] Sending events", {
    setUp: function () {
        this.addonID = "addonID";
        this.objectID = "objectID";
        this.value = "1";
        this.source = "SourceList1-2";

        this.eventData = {
            source: this.addonID,
            value: this.value,
            item: this.source,
            type: "string"
        };

        this.mockEventBus = function () {};
        this.mockEventBus.sendEvent = function () {};
        
        this.configuration = {
            addonID: this.addonID,
            objectID: this.objectID,
            eventBus: this.mockEventBus,
            getSelectedItem: function () {},
            value: this.value,
            source: this.source
        };

        this.templateObject = new DraggableDroppableObject(this.configuration, {});
        
        this.stubs = {
            sendEvent: sinon.stub(this.mockEventBus, 'sendEvent')
        };
    },

    tearDown: function () {
        this.mockEventBus.sendEvent.restore();
    },

    'test sending item dragged should use send event of provided event bus object with proper data': function () {
        this.templateObject.sendItemDraggedEvent();

        assertTrue(this.stubs.sendEvent.calledOnce);
        assertEquals("itemDragged", this.stubs.sendEvent.getCall(0).args[0]);
        assertEquals(this.eventData, this.stubs.sendEvent.getCall(0).args[1]);
    },

    'test sending item stopped should use send event of provided event bus object with proper data': function () {
        this.templateObject.sendItemStoppedEvent();

        assertEquals("itemStopped", this.stubs.sendEvent.getCall(0).args[0]);
        assertEquals(this.eventData, this.stubs.sendEvent.getCall(0).args[1]);
    },

    'test sending item returned should use send event of provided event bus object with proper data': function () {
        this.templateObject.sendItemReturnedEvent();

        assertEquals("ItemReturned", this.stubs.sendEvent.getCall(0).args[0]);
        assertEquals(this.eventData, this.stubs.sendEvent.getCall(0).args[1]);
    },

    'test sending item consumed should use send event of provided event bus object with proper data': function () {
        this.templateObject.sendItemConsumedEvent();

        assertEquals("ItemConsumed", this.stubs.sendEvent.getCall(0).args[0]);
        assertEquals(this.eventData, this.stubs.sendEvent.getCall(0).args[1]);
    }
});
