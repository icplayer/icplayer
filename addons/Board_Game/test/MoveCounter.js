TestCase("[Board Game] Move counter", {
    setUp: function () {
        this.presenter = AddonBoard_Game_create();
        this.presenter.gameMode = this.presenter.gameTypes.GAME;
        this.presenter.boardCounters = [ document.createElement('div'), document.createElement('div') ];
        this.presenter.countersContainers = [document.createElement('div'), document.createElement('div'), document.createElement('div'), document.createElement('div')];
        this.presenter.counterPositions = [0, 0, 0, 0, 0];
        this.presenter.selectCounter(this.presenter.boardCounters[0], 0);

        this.presenter.view = document.createElement("div");
        this.presenter.animate = sinon.spy();

    },

    'test move counter will select next counter': function () {
        this.presenter.moveCounter(1, false);

        assertTrue(this.presenter.boardCounters[1].classList.contains("board-game-selected"));
        assertEquals(1, this.presenter.lastSelectedCounter);
    }
});