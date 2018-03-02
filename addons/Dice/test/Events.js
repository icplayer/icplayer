TestCase("[Dice] Events Test Case", {

    setUp: function () {
        this.presenter = AddonDice_create();

        this.presenter.setRandomElement = function () {
            return 2;
        };

        this.presenter.state.elements = [];

        this.presenter.callExternalAddon = function () {};
        this.presenter.configuration.elementsList = [
            null, {name: null}, {name: "asdf"}
        ];

        this.sendEventSpy = sinon.spy();

        this.presenter.eventBus = {
            sendEvent: this.sendEventSpy
        };

        this.presenter.configuration.ID = "testID";

        this.presenter.executeRoll = function () {};
        this.presenter.state.isDisabled = false;
        this.presenter.state.isLoaded = true;
        this.presenter.state.isRolling = false;
        this.presenter.state.disabledByEvent = false;
    },

    'test rolled element will send event': function () {
        this.presenter.onDiceRoll(true);

        assertTrue(this.sendEventSpy.calledWith('ValueChanged', {
            source: "testID",
            item: '3',
            value: 'asdf'
        }));
    },

    'test rolled element will send item index if number is not defined': function () {
        this.presenter.setRandomElement = function () {
            return 1;
        };

        this.presenter.onDiceRoll(true);

        assertTrue(this.sendEventSpy.calledWith('ValueChanged', {
            source: "testID",
            item: '2',
            value: '2'
        }));
    },

    'test roll click should send event': function () {
        this.presenter.roll();

        assertTrue(this.sendEventSpy.calledWith('ValueChanged', {
            source: "testID",
            item: '',
            value: 'start'
        }));
    }
});