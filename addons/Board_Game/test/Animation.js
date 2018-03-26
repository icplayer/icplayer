TestCase("[Board Game] Animate counter", {
    setUp: function () {
        this.clock = sinon.useFakeTimers();

        this.presenter = AddonBoard_Game_create();
        this.presenter.gameMode = this.presenter.gameTypes.GAME;
        this.presenter.boardCounters = [ document.createElement('div'), document.createElement('div') ];
        this.presenter.countersContainers = [document.createElement('div'), document.createElement('div'), document.createElement('div'), document.createElement('div')];
        this.presenter.fieldsPositions = [
            {Left: 10, Top: 10},
            {Left: 10, Top: 10},
            {Left: 10, Top: 10},
            {Left: 10, Top: 10},
            {Left: 10, Top: 10}
        ];
        this.presenter.counterPositions = [3, 0, 0, 0, 0];
        this.presenter.selectCounter(this.presenter.boardCounters[0], 0);
        this.presenter.sendEventCounterMoved = function () {};
        this.presenter.view = document.createElement("div");
    },

    tearDown: function () {
      this.clock.restore();
    },

    'test animate counter will move counter in correct order': function () {
        this.presenter.moveCounter(-2, true);

        this.clock.tick(this.presenter.ANIMATION_MOVE_TIME * 10);
        assertEquals(this.presenter.boardCounters[0].parentElement, this.presenter.countersContainers[1]);
    }
});