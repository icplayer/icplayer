TestCase("[Dice] Rolling Test Case", {

    setUp: function () {
        this.clock = sinon.useFakeTimers();
        this.presenter = AddonDice_create();

        this.sendEventSpy = sinon.spy();

        this.presenter.eventBus = {
            sendEvent: this.sendEventSpy
        };

        this.presenter.state.isLoaded = true;
        this.presenter.configuration.animationLength = 0;


    },

    tearDown: function () {
      this.clock.restore();
    },

    'test rolling elements will roll in reverse order when animation length is 0': function () {
        var bindIndex = 0;
        var executeIndex = 0;

        this.presenter.onDiceRoll = function (originalIndex) {
            executeIndex = executeIndex + 1;
            assertEquals(executeIndex, bindIndex - originalIndex + 1);
        };

        var self = this;

        this.presenter.onDiceRoll.bind = function () {
            bindIndex = bindIndex + 1;
            var index = bindIndex;
            return function () {
                self.presenter.onDiceRoll(index);
            }
        };

        this.presenter.roll();
        this.clock.tick(100);
    },

    'test rolling elements will roll in reverse order when animation length is 2000': function () {
        this.presenter.configuration.animationLength = 2000;
        var bindIndex = 0;
        var executeIndex = 0;

        this.presenter.onDiceRoll = function (originalIndex) {
            executeIndex = executeIndex + 1;
            assertEquals(executeIndex, bindIndex - originalIndex + 1);
        };

        var self = this;

        this.presenter.onDiceRoll.bind = function () {
            bindIndex = bindIndex + 1;
            var index = bindIndex;
            return function () {
                self.presenter.onDiceRoll(index);
            }
        };

        this.presenter.roll();
        this.clock.tick(3000);
    }
});