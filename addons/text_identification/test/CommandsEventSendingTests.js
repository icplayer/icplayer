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

    'test should send event on deselect when isSelected is true' : function() {
        this.presenter.deselect();

        assertTrue(this.stubs.sendEventStub.called);
    },

    'test should not send event on deselect when isSelected is false' : function() {
        this.presenter.configuration.isSelected = false;
        this.presenter.deselect();

        assertFalse(this.stubs.sendEventStub.called);
    },

    'test should send event on select' : function() {
        this.presenter.select();

        assertTrue(this.stubs.sendEventStub.called);
    }
});