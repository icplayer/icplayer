TestCase("[Commons - Draggable Droppable Object] Get/Set Value", {
    setUp: function () {
        var _ = "1";
        this.value = 1;

        this.configuration = {
            addonID: "addonID",
            objectID: "objectID",
            eventBus: function () {},
            getSelectedItem: function () {}
        };

        this.templateObject = new DraggableDroppableObject(this.configuration, {});

        this.stubs = {
            html: sinon.stub(this.templateObject.$view, 'html')
        };
    },

    tearDown: function () {
        this.templateObject.$view.html.restore();
    },

    'test get value should return actual value in object': function () {
        this.templateObject.value = this.value;
        assertEquals(this.value, this.templateObject.getValue());
    },

    'test set value should change actual value in object': function () {
        var expectedValue = 5;
        this.templateObject.setValue(expectedValue);

        assertEquals(expectedValue, this.templateObject.getValue());
    }
});

TestCase("[Commons - Draggable Droppable Object] Get/set source", {
    setUp: function () {
        this.source = "asdjfhal;878234a";
        this.configSource = "configSourcea;klfdsjafdsa";

        this.configuration = {
            addonID: "addonID",
            objectID: "objectID",
            eventBus: function () {},
            getSelectedItem: function () {},
            source: this.configSource
        };
        this.templateObject = new DraggableDroppableObject(this.configuration, {});
    },

    'test when config dont have any source default should be empty string': function () {
        var undefined;

        var cfg = this.configuration;
        cfg.source = undefined;

        assertEquals("", new DraggableDroppableObject(cfg, {}).getSource())
    },

    'test get source should give provided value in configuration': function () {
        assertEquals(this.configSource, this.templateObject.getSource())
    },

    'test set source should change actual object source': function () {
        this.templateObject.setSource(this.source);

        assertEquals(this.source, this.templateObject.source);
    },

    'test get source should get actual object source': function () {
        this.templateObject.setSource(this.source);

        assertEquals(this.source, this.templateObject.getSource());
    }
});

TestCase("[Commons - Draggable Droppable Object] Get addon/object ID", {
    setUp: function () {
        this.objectID = "htmlIDa wapw 8ryua.sdfkf ";
        this.addonID = "addonIDqa342agsdf  adsf ";

        this.configuration = {
            addonID: this.addonID,
            objectID: this.objectID,
            eventBus: function () {},
            getSelectedItem: function () {}
        };

        this.templateObject = new DraggableDroppableObject(this.configuration, {});
    },

    'test get addon id should return provided addon id': function () {
        assertEquals(this.addonID, this.templateObject.getAddonID());
    },

    'test get html id should return provided html id': function () {
        assertEquals(this.objectID, this.templateObject.getObjectID());
    }
});