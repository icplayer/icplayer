TestCase("[Board Game] Events Test Case", {
    setUp: function () {
        this.presenter = AddonBoard_Game_create();

        this.presenter.modelID = "testID";
        this.sendEventSpy = sinon.spy();

        this.presenter.eventBus = {
            sendEvent: this.sendEventSpy
        };

        this.presenter.lastSelectedCounter = 2;
        this.presenter.counterPositions = [4, 4, 4, 4, 4];
        var presenter = this.presenter;
        this.presenter.moveCounter = function (distance) {
            presenter.counterPositions[2] = presenter.counterPositions[2] + distance;
        };

        this.presenter.boardCounters = [document.createElement('div'), document.createElement('div')];
        this.presenter.countersContainers = [document.createElement('div'), document.createElement('div'), document.createElement('div'), document.createElement('div')];
        this.presenter.fieldsPositions = [
            {Left: 10, Top: 10},
            {Left: 10, Top: 10},
            {Left: 10, Top: 10}
        ];
        this.presenter.isDisable = false;
        this.presenter.showErrorsMode = false;
        this.presenter.showAnswersMode = false;
        this.presenter.gameMode = this.presenter.gameTypes.GAME;
    },

    'test trigger frame change event will send correct data': function () {
        this.presenter.triggerFrameChangeEvent("A", "B");

        assertTrue(this.sendEventSpy.calledWith('ValueChanged', {
            source: 'testID',
            item: 'A',
            value: 'B',
            score: ''
        }));
    },

    'test move will send event to event bus': function () {
        this.presenter.endAnimation(2, this.presenter.boardCounters[0], 0);

        assertTrue(this.sendEventSpy.calledWith('ValueChanged', {
            source: 'testID',
            item: '1',
            value: '3',
            score: ''
        }));
    }
});