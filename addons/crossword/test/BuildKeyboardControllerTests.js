TestCase("[Crossword] buildKeyboardController tests", {

    setUp: function () {
        this.presenter = new Addoncrossword_create();

        this.elements = [sinon.spy(), sinon.spy(), sinon.spy()];
    },

    'test given presenter without built keyboard controller when buildKeyboardController is called then set keyboard controller to presenter with elements returned from getElementsForKeyboardNavigation' : function () {
        this.presenter.getElementsForKeyboardNavigation = sinon.stub();
        this.presenter.getElementsForKeyboardNavigation.returns(this.elements);

        assertTrue(this.presenter.keyboardControllerObject === null);

        this.presenter.buildKeyboardController();

        assertTrue(this.presenter.keyboardControllerObject !== null);
        assertTrue(this.presenter.getElementsForKeyboardNavigation.calledOnce);
        assertEquals(this.elements, this.presenter.keyboardControllerObject.keyboardNavigationElements);
    },

    'test given crossword when buildKeyboardController is called then keyboard controller have set as elements every crossword cell' : function () {
        this.presenter.rowCount = 9;
        this.presenter.columnCount = 10;
        this.presenter.tabIndexBase = 5000;
        this.presenter.crossword = getCrosswordForNavigationTests();
        this.view = document.createElement('div');
        this.presenter.$view = $(this.view);
        this.presenter.createGrid();

        this.presenter.buildKeyboardController();

        const expectedElementsNumber = this.presenter.columnCount * this.presenter.rowCount;
        assertEquals(expectedElementsNumber, this.presenter.keyboardControllerObject.keyboardNavigationElementsLen);
    },

    'test given crossword when buildKeyboardController is called then keyboard controller columns count equals to crossword columns count' : function () {
        this.presenter.rowCount = 9;
        this.presenter.columnCount = 10;
        this.presenter.tabIndexBase = 5000;
        this.presenter.crossword = getCrosswordForNavigationTests();
        this.view = document.createElement('div');
        this.presenter.$view = $(this.view);
        this.presenter.createGrid();

        this.presenter.buildKeyboardController();

        assertEquals(this.presenter.columnCount, this.presenter.keyboardControllerObject.columnsCount);
    },
});
