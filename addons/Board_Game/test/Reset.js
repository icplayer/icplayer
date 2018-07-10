TestCase("[Board Game] Reset", {
    setUp: function () {
        this.clock = sinon.useFakeTimers();

        this.presenter = AddonBoard_Game_create();

        this.presenter.boardCounters = [
            document.createElement("div"),
            document.createElement("div"),
            document.createElement("div")
        ];


        this.presenter.view = document.createElement("div");
        this.presenter.countersContainers = [document.createElement('div'), document.createElement('div'), document.createElement('div'), document.createElement('div')];

        this.presenter.fieldsPositions = [
            {Left: 10, Top: 10},
            {Left: 10, Top: 10},
            {Left: 10, Top: 10},
            {Left: 10, Top: 10},
            {Left: 10, Top: 10}
        ];

        this.presenter.counterPositions = [0, 0, 0, 0, 0];

        this.presenter.$view = $(document.createElement("div"));
        var self = this;
        this.presenter.countersContainers.forEach(function (el) {
            el.classList.add("board-game-container");
            self.presenter.$view.append(el);
        });

        this.presenter.boardCounters.forEach(function (el) {
           el.classList.add("board-game-element");
           self.presenter.$view.append(el);
        });

        this.presenter.sendEventCounterMoved = function () {};

        this.presenter.lastMove = 21;
        this.presenter.gameMode = this.presenter.gameTypes.GAME;
        this.presenter.lastSelectedCounter = 0;


    },

    tearDown: function () {
      this.clock.restore();
    },

    'test reset game mode set addon to initial state': function () {
        this.presenter.moveCountersToFirstField = sinon.spy();
        this.presenter.resetGameMode();

        assertEquals(null, this.presenter.lastMove);
        assertTrue(this.presenter.moveCountersToFirstField.calledOnce);
        assertTrue(this.presenter.boardCounters[0].classList.contains('board-game-selected'));
    },

    'test reset correctly clear last move': function () {
        for (var i = 0; i < 10; i++) {
            this.presenter.move(4);
        }

        this.clock.tick(this.presenter.ANIMATION_MOVE_TIME * 100);

        this.presenter.reset();
        this.presenter.undo();

        var self = this;

        this.presenter.boardCounters.forEach(function (el) {
            assertEquals(self.presenter.countersContainers[0], el.parentElement);
        });
    }
});