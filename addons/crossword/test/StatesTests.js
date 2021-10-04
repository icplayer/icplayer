function getValidCrossword() {
    return [
        [" ", "D", " ", ],
        ["M", "A", "Y", ],
        [" ", "T", " ", ],
        [" ", "E", " ", ],
    ];
}

TestCase("[Crossword] Get state", {

    setUp: function() {
        this.presenter = Addoncrossword_create();

        this.presenter.rowCount = 4;
        this.presenter.columnCount = 3;
        this.presenter.wordNumbersHorizontal = true;
        this.presenter.wordNumbersVertical = true;
        this.presenter.crossword = getValidCrossword();

        this.view = document.createElement('div');
        this.presenter.$view = $(this.view);
        this.presenter.createGrid();

        this.expectedEmptyCellsState = [
            undefined, "", undefined,
            "", "", "",
            undefined, "", undefined,
            undefined, "", undefined,
        ];

        this.expectedCellsState = [
            undefined, "D", undefined,
            "M", "A", "",
            undefined, "", undefined,
            undefined, "E", undefined,
        ];

        sinon.stub(this.presenter, 'hideAnswers');
    },

    tearDown: function() {
        this.presenter.hideAnswers.restore();
    },

    getParsedState: function() {
        return $.parseJSON(this.presenter.getState().toString());
    },

    setValuesToCells: function() {
        this.setValueToCell(0, 1, "D");
        this.setValueToCell(1, 0, "M");
        this.setValueToCell(1, 1, "A");
        this.setValueToCell(3, 1, "E");
    },

    setValueToCell: function(rowId, colId, value) {
        this.presenter.$view.find(`.cell_${rowId}x${colId} input`).attr('value', value);
    },

    'test given addon is visible when executing get state then isVisible in returned state should be set to true': function() {
        this.presenter.isVisible = true;

        const returnedState = this.getParsedState();

        assertTrue(returnedState.isVisible);
    },

    'test given addon is not visible when executing get state then isVisible in returned state should be set to false': function() {
        this.presenter.isVisible = false;

        const returnedState = this.getParsedState();

        assertFalse(returnedState.isVisible);
    },

    'test given not filled cells when executing get state then cells in returned state should have empty sting for every input cell': function() {
        const returnedState = this.getParsedState();

        assertEquals(this.expectedEmptyCellsState, returnedState.cells);
    },

    'test given filled input cells when executing get state then cells in returned state should store provided values': function() {
        this.setValuesToCells();

        const returnedState = this.getParsedState();

        assertEquals(this.expectedCellsState, returnedState.cells);
    },

    'test given model in show answers mode when executing get state then execute method hideAnswers and continue': function() {
        this.presenter.isShowAnswersActive = true;

        this.setValuesToCells();

        const returnedState = this.getParsedState();

        assertTrue(this.presenter.hideAnswers.calledOnce);
        assertEquals(this.expectedCellsState, returnedState.cells);
    },

    'test given model in not show answers mode when executing get state then continue and do not execute method hideAnswers': function() {
        this.presenter.isShowAnswersActive = false;

        this.setValuesToCells();

        const returnedState = this.getParsedState();

        assertFalse(this.presenter.hideAnswers.called);
        assertEquals(this.expectedCellsState, returnedState.cells);
    },
});

TestCase("[Crossword] Set state", {

    setUp: function() {
        this.presenter = Addoncrossword_create();

        this.presenter.rowCount = 4;
        this.presenter.columnCount = 3;
        this.presenter.wordNumbersHorizontal = true;
        this.presenter.wordNumbersVertical = true;
        this.presenter.configuration = {
            isVisibleByDefault: false
        };
        this.presenter.crossword = getValidCrossword();
        this.view = document.createElement('div');
        this.presenter.$view = $(this.view);
        this.presenter.createGrid();

        this.inputOldState = [
            "", "", "",
            "M", "A", "",
            "", "T", "",
            "", "E", "",
        ];

        this.spies = {
            setVisibility: sinon.spy(this.presenter, 'setVisibility'),
        }
    },

    setOldState: function(state) {
        return this.presenter.setState("[\"" + state.join("\",\"") + "\"]");
    },

    setState: function(state) {
        return this.presenter.setState(JSON.stringify(state));
    },

    assertCellsValues: function() {
        assertEquals("", this.getCellValue(0, 1));
        assertEquals("M", this.getCellValue(1, 0));
        assertEquals("A", this.getCellValue(1, 1));
        assertEquals("", this.getCellValue(1, 2));
        assertEquals("T", this.getCellValue(2, 1));
        assertEquals("E", this.getCellValue(3, 1));
    },

    getCellValue: function(rowId, colId) {
        return this.presenter.$view.find(`.cell_${rowId}x${colId} input`).attr('value');
    },

    'test given addon is visible when executing set state with old state then addon visibility will not change': function() {
        this.setOldState(this.inputOldState);

        assertTrue(this.presenter.isVisible);
    },

    'test given addon is not visible when executing set state with old state then addon visibility will not change': function() {
        this.presenter.isVisible = false;

        this.setOldState(this.inputOldState);

        assertFalse(this.presenter.isVisible);
    },

    'test given addon when executing set state with old state then set cells values according to the received state': function() {
        this.setOldState(this.inputOldState);

        this.assertCellsValues();
    },

    'test given addon when executing set state with new state with visibility set to false then set cells values according to the received state and change addon visibility to false': function() {
        const inputState = {
            cells: this.inputOldState,
            isVisible: false,
        }

        this.setState(inputState);

        this.assertCellsValues();
        assertTrue(this.spies.setVisibility.calledOnce);
        assertFalse(this.presenter.isVisible);
    },

    'test given addon when executing set state with new state with visibility set to true then set cells values according to the received state and change addon visibility to true': function() {
        const inputState = {
            cells: this.inputOldState,
            isVisible: true,
        }

        this.setState(inputState);

        this.assertCellsValues();
        assertTrue(this.spies.setVisibility.calledOnce);
        assertTrue(this.presenter.isVisible);
    },
});
