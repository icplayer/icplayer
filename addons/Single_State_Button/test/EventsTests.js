TestCase("[Single State Button] Event data creation", {
    setUp : function() {
        this.presenter = AddonSingle_State_Button_create();
        this.presenter.addonID = 'SSB1';
    },

    'test event has been created' : function() {
        var eventData = this.presenter.createEventData();

        assertEquals('SSB1', eventData.source);
        assertEquals('', eventData.item);
        assertEquals('1', eventData.value);
        assertEquals('', eventData.score);
    }
});

TestCase("[Single State Button] User event code execution", {
    setUp : function() {
        this.presenter = AddonSingle_State_Button_create();
        this.presenter.configuration = {
            onClickEvent: { value: "Text1.setText('SSB selected!');", isEmpty: false },
        };

        var commands = this.commands = {
            executeEventCode: function () {}
        };

        this.presenter.playerController = {
            getCommands: function () {
                return commands
            }
        };

        sinon.stub(this.commands, 'executeEventCode');
    },

    tearDown: function () {
        this.commands.executeEventCode.restore();
    },

    'test successful user event execution' : function() {
        this.presenter.executeUserEventCode();

        assertTrue(this.commands.executeEventCode.calledWith("Text1.setText('SSB selected!');"));
    },

    'test user event code is empty' : function() {
        this.presenter.configuration.onClickEvent.isEmpty = true;

        this.presenter.executeUserEventCode();

        assertFalse(this.commands.executeEventCode.called);
    },

    'test Player Controller is not defined' : function() {
        this.presenter.playerController = null;

        this.presenter.executeUserEventCode();

        assertFalse(this.commands.executeEventCode.called);
    }
});

TestCase("[Single State Button] Button clicked event triggering", {
    setUp : function() {
        this.presenter = AddonSingle_State_Button_create();
        this.presenter.addonID = 'SSB1';

        var eventBus = this.eventBus = {
            sendEvent: function () {}
        };

        this.presenter.playerController = {
            getEventBus: function () {
                return eventBus
            }
        };

        sinon.stub(this.eventBus, 'sendEvent');
    },

    tearDown: function () {
        this.eventBus.sendEvent.restore();
    },

    'test successful event sending' : function() {
        this.presenter.triggerButtonClickedEvent();

        assertTrue(this.eventBus.sendEvent.called);
    },

    'test Player Controller is not defined' : function() {
        this.presenter.playerController = null;

        this.presenter.triggerButtonClickedEvent();

        assertFalse(this.eventBus.sendEvent.called);
    }
});