TestCase("[Text Identification] Event sending on commands", {
    setUp : function() {
        this.presenter = Addontext_identification_create();
        this.presenter.configuration = {
            addonID: 'TextIdent1',
            isSelected: true,
            shouldBeSelected: true
        };

        this.stubs = {
            sendEventStub: sinon.stub(),
            getEventBusStub: sinon.stub(),
            executeUserEventCodeStub: sinon.stub(),
            applySelectionStyleStub: sinon.stub()
        };

        this.presenter.eventBus = {
            sendEvent: this.stubs.sendEventStub
        };

        var eventBus = this.presenter.eventBus;
        this.presenter.playerController = {
            getEventBus: function () {
                return eventBus;
            }
        };

        this.presenter.executeUserEventCode = this.stubs.executeUserEventCodeStub;
        this.presenter.applySelectionStyle = this.stubs.applySelectionStyleStub;
    },

    'test should send event on deselect when isSelected is true and shouldSendEventOnCommand is True' : function() {
        this.presenter.configuration.shouldSendEventsOnCommands = true;
        this.presenter.configuration.isSelected = true;
        this.presenter.deselect();

        assertTrue(this.stubs.sendEventStub.called);
    },

    'test should not send event on deselect when isSelected is false and shouldSendEventOnCommand is True' : function() {
        this.presenter.configuration.shouldSendEventsOnCommands = true;
        this.presenter.configuration.isSelected = false;
        this.presenter.deselect();

        assertFalse(this.stubs.sendEventStub.called);
    },

    'test should not send event on deselect when isSelected is true and shouldSendEventOnCommand is false' : function() {
        this.presenter.configuration.shouldSendEventsOnCommands = false;
        this.presenter.configuration.isSelected = true;
        this.presenter.deselect();

        assertFalse(this.stubs.sendEventStub.called);
    },

    'test should not send event on deselect when isSelected is false and shouldSendEventOnCommand is false' : function() {
        this.presenter.configuration.shouldSendEventsOnCommands = false;
        this.presenter.configuration.isSelected = false;
        this.presenter.deselect();

        assertFalse(this.stubs.sendEventStub.called);
    },

    'test should send event on select when shouldSendEveontOnCommand is true and it wasnt selected' : function() {
        this.presenter.configuration.shouldSendEventsOnCommands = true;
        this.presenter.configuration.isSelected = false;
        this.presenter.select();

        assertTrue(this.stubs.sendEventStub.called);
    },

    'test should not send event on select when shouldSendEveontOnCommand is false and it wasnt selected' : function() {
        this.presenter.configuration.shouldSendEventsOnCommands = false;
        this.presenter.configuration.isSelected = false;
        this.presenter.select();

        assertFalse(this.stubs.sendEventStub.called);
    },

     'test should not send event on select when shouldSendEveontOnCommand is false and it was selected' : function() {
        this.presenter.configuration.shouldSendEventsOnCommands = false;
        this.presenter.configuration.isSelected = true;
        this.presenter.select();

        assertFalse(this.stubs.sendEventStub.called);
    },

    'test should not send event on select when shouldSendEventOnCommand is true and isSelected is true' : function() {
        this.presenter.configuration.shouldSendEventsOnCommands = true;
        this.presenter.configuration.isSelected = true;
        this.presenter.select();

        assertFalse(this.stubs.sendEventStub.called);
    }
});