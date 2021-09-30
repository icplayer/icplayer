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
        this.presenter.$view.find('.cell_' + rowId + 'x' + colId + ' input').attr('value', value);
    },

    'test get state when addon is visible': function() {
        this.presenter.isVisible = true;

        const returnedState = this.getParsedState();

        assertTrue(returnedState.isVisible);
    },

    'test get state when addon is not visible': function() {
        this.presenter.isVisible = false;

        const returnedState = this.getParsedState();

        assertFalse(returnedState.isVisible);
    },

    'test get state when empty cells': function() {
        const returnedState = this.getParsedState();

        assertEquals(this.expectedEmptyCellsState, returnedState.cells);
    },

    'test get state when table is filled': function() {
        this.setValuesToCells();

        const returnedState = this.getParsedState();

        assertEquals(this.expectedCellsState, returnedState.cells);
    },

    'test get state execute hideAnswers when show answers is active and continue': function() {
        this.presenter.isShowAnswersActive = true;

        this.setValuesToCells();

        const returnedState = this.getParsedState();

        assertTrue(this.presenter.hideAnswers.calledOnce);
        assertEquals(this.expectedCellsState, returnedState.cells);
    },

    'test get state execute hideAnswers when show answers is not active and continue': function() {
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
        this.presenter.isVisible = true;
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

    getCellValue: function(rowId, colId) {
        return this.presenter.$view.find('.cell_' + rowId + 'x' + colId + ' input').attr('value');
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

    'test isVisible not changed when set state old state': function() {
        this.presenter.isVisible = false;

        this.setOldState(this.inputOldState);

        assertFalse(this.presenter.isVisible);

        this.presenter.isVisible = true;

        this.setOldState(this.inputOldState);

        assertTrue(this.presenter.isVisible);
    },

    'test view when set state old state': function() {
        this.setOldState(this.inputOldState);

        this.assertCellsValues();
    },

    'test set state when is Visible is false': function() {
        const inputState = {
            cells: this.inputOldState,
            isVisible: false,
        }

        this.setState(inputState);

        this.assertCellsValues();
        assertTrue(this.spies.setVisibility.calledOnce);
        assertFalse(this.presenter.isVisible);
    },

    'test set state when is Visible is true': function() {
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
