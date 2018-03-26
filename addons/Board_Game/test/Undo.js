TestCase("[Board Game] Undo command", {
    setUp: function () {
        this.presenter = AddonBoard_Game_create();
        this.presenter.gameMode = this.presenter.gameTypes.GAME;

        this.lastMove = {
            counterNumber: 1,
            position: 2
        };

        this.presenter.lastMove = this.lastMove;

        this.presenter.boardCounters = [ document.createElement('div'), document.createElement('div') ];
        this.presenter.countersContainers = [document.createElement('div'), document.createElement('div'), document.createElement('div'), document.createElement('div')];
        this.presenter.counterPositions = [0, 0, 0, 0, 0];

        this.presenter.setUndoCorrectCSSPosition = sinon.spy();
    },

    'test undo command set correct counter position in presenter model': function () {
        this.presenter.undo();

        assertEquals(this.presenter.lastMove, null);
        assertEquals(this.presenter.countersContainers[this.lastMove.position], this.presenter.boardCounters[this.lastMove.counterNumber].parentElement);
        assertTrue(this.presenter.setUndoCorrectCSSPosition.calledOnce);
        assertEquals(this.lastMove.position, this.presenter.counterPositions[this.lastMove.counterNumber]);
    }
});