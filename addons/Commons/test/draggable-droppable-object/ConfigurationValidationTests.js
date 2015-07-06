TestCase("[Commons - Draggable Droppable Object] Configuration validation", {
    setUp: function () {
        this.validConfiguration = {
            eventBus: function () {},
            getSelectedItem: function () {},
            addonID: "addonID",
            objectID: "objectID"
        };

        this.validConfigurationWithView = {
            eventBus: function () {},
            getSelectedItem: function () {},
            addonID: "addonID",
            objectID: "objectID",
            createView: function () {},
            connectEvents: function () {},
            fillGap: function () {},
            makeGapEmpty: function () {},
            setValue: function () {},
            setViewValue: function () {}
        };
    },

    'test should throw no exceptions if configuration object is valid': function () {
        try {
            DraggableDroppableObject._internal.validateConfiguration(this.validConfiguration);
        } catch (exc) {
            fail("It shouldnt throw exception");
        }
    },

    'test undefined event bus should throw NoEventBus error': function () {
        var undefined;
        this.validConfiguration.eventBus = undefined;

        try {
            DraggableDroppableObject._internal.validateConfiguration(this.validConfiguration);
            fail("It should throw UndefinedEventBusError");
        } catch (exc) {
        }
    },

    'test event bus should be a event bus object otherwise throw TypeError': function () {
        this.validConfiguration.eventBus = "asdfkjhlna34w";

        try {
            DraggableDroppableObject._internal.validateConfiguration(this.validConfiguration);
            fail("It should throw TypeError");
        } catch (exc) {}
    },

    'test undefined get selected item should throw UndefinedGetSelectedItemError': function () {
        this.validConfiguration.getSelectedItem = undefined;

        try {
            DraggableDroppableObject._internal.validateConfiguration(this.validConfiguration);
            fail("It should throw UndefinedGetSelectedItemError");
        } catch (exc) {}
    },

    'test get selected item should be a function otherwise should throw TypeError': function () {
        this.validConfiguration.getSelectedItem = "asdfkjhlna34w";

        try {
            DraggableDroppableObject._internal.validateConfiguration(this.validConfiguration);
            fail("It should throw TypeError");
        } catch (exc) {}
    },

    'test undefined addonID should throw expcetion UndefinedAddonIDError': function () {
        this.validConfiguration.addonID = undefined;

        try {
            DraggableDroppableObject._internal.validateConfiguration(this.validConfiguration);
            fail("It should throw UndefinedAddonIDError");
        } catch (exc) {}

    },

    'test addonID should be a string otherwise should throw a TypeError error': function () {
        this.validConfiguration.addonID = function () {};

        try {
            DraggableDroppableObject._internal.validateConfiguration(this.validConfiguration);
            fail("It should throw TypeError");
        } catch (exc) {}
    },

    'test undefined objectID should throw UndefinedObjectIDError': function () {
        this.validConfiguration.objectID = undefined;

        try {
            DraggableDroppableObject._internal.validateConfiguration(this.validConfiguration);
            fail("It should throw UndefinedObjectIDError");
        } catch (exc) {}
    },

    'test objectID should be a string otherwise throw exception TypeError': function () {
        this.validConfiguration.objectID = {};

        try {
            DraggableDroppableObject._internal.validateConfiguration(this.validConfiguration);
            fail("It should throw TypeError");
        } catch (exc) {}
    },

    'test createView have to be a function otherwise should throw error': function () {
        this.validConfigurationWithView.createView = "asfddla";

        try {
            DraggableDroppableObject._internal.validateConfiguration(this.validConfigurationWithView);
            fail("It should throw TypeError");
        } catch (exc) {}
    },

    'test setValue have to be a function otherwise should throw error': function () {
        this.validConfigurationWithView.setValue = "as.dfhj.fa";

        try {
            DraggableDroppableObject._internal.validateConfiguration(this.validConfigurationWithView);
            fail("It should throw TypeError");
        } catch (exc) {}
    },

    'test setViewValue have to be a function otherwise should throw error': function () {
        this.validConfigurationWithView.setViewValue = "asllfdsa";

        try {
            DraggableDroppableObject._internal.validateConfiguration(this.validConfigurationWithView);
            fail("It should throw TypeError");
        } catch (exc) {}
    },

    'test fillGap have to be a function otherwise should throw error': function () {
        this.validConfigurationWithView.fillGap = "sadjflas8r3wa";

        try {
            DraggableDroppableObject._internal.validateConfiguration(this.validConfigurationWithView);
            fail("It should throw TypeError");
        } catch (exc) {}
    },

    'test makeGapEmpty have to be a function otherwise should throw error': function () {
        this.validConfigurationWithView.makeGapEmpty = "asdjkf;a34";

        try {
            DraggableDroppableObject._internal.validateConfiguration(this.validConfigurationWithView);
            fail("It should throw TypeError");
        } catch (exc) {}
    },

    'test connectEvents have to be a function otherwise should throw error': function () {
        this.validConfigurationWithView.connectEvents = "asdjkf;a34";

        try {
            DraggableDroppableObject._internal.validateConfiguration(this.validConfigurationWithView);
            fail("It should throw TypeError");
        } catch (exc) {}
    }
});