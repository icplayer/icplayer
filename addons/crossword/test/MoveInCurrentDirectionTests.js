TestCase("[Crossword] Move in current direction tests", {
    setUp: function() {
        this.presenter = Addoncrossword_create();

        this.presenter.rowCount = 9;
        this.presenter.columnCount = 10;
        this.presenter.tabIndexBase = 5000;
        this.presenter.crossword = getCrosswordForNavigationTests();

        this.focusedCellInputPosition = undefined;
        this.bluredCellInputPosition = undefined;

        this.presenter.onCellInputFocus = sinon.spy((event) => this.newOnCellInputFocus(event));
        this.presenter.onCellInputFocusOut = sinon.spy((event) => this.newCellBlurEventHandler(event));

        this.view = document.createElement('div');
        this.presenter.$view = $(this.view);
        this.presenter.createGrid();
    },

    newOnCellInputFocus: function (event) {
        this.focusedCellInputPosition = this.presenter.getPosition($(event.target).parent(''));
    },

    newCellBlurEventHandler: function (event) {
        this.bluredCellInputPosition = this.presenter.getPosition($(event.target).parent(''));
    },

    // Horizontal direction tests

    'test given horizontal direction for navigation when moving and right cell is editable then move to right cell': function () {
        this.presenter.setHorizontalDirection();
        var cellInput = this.getCellInputElement(2, 4);

        this.presenter.moveInCurrentDirection(cellInput);

        this.validateIsCellInputElementFocused(3, 4);
    },

    'test given horizontal direction for navigation when moving and at least one cell on right site is editable then move to first editable right cell': function () {
        this.presenter.setHorizontalDirection();
        var cellInput = this.getCellInputElement(2, 3);

        this.presenter.moveInCurrentDirection(cellInput);

        this.validateIsCellInputElementFocused(6, 3);
    },

    'test given horizontal direction for navigation when moving and no editable or constant cells on right site then blur current element': function () {
        this.presenter.setHorizontalDirection();
        var cellInput = this.getCellInputElement(7, 1);

        this.presenter.moveInCurrentDirection(cellInput);

        this.validateIsCellInputElementBlurred(7, 1);
    },

    'test given horizontal direction for navigation when moving and no editable cells on right site then blur current element': function () {
        this.presenter.setHorizontalDirection();
        var cellInput = this.getCellInputElement(6, 5);

        this.presenter.moveInCurrentDirection(cellInput);

        this.validateIsCellInputElementBlurred(6, 5);
    },

    // Vertical direction tests

    'test given vertical direction for navigation when moving and bottom cell is editable then move to bottom cell': function () {
        this.presenter.setVerticalDirection();
        var cellInput = this.getCellInputElement(5, 4);

        this.presenter.moveInCurrentDirection(cellInput);

        this.validateIsCellInputElementFocused(5, 5);
    },

    'test given vertical direction for navigation when moving and at least one cell on bottom site is editable then move to first editable bottom cell': function () {
        this.presenter.setVerticalDirection();
        var cellInput = this.getCellInputElement(3, 2);

        this.presenter.moveInCurrentDirection(cellInput);

        this.validateIsCellInputElementFocused(3, 4);
    },

    'test given vertical direction for navigation when moving and no editable or constant cells on bottom site then blur current element': function () {
        this.presenter.setVerticalDirection();
        var cellInput = this.getCellInputElement(4, 6);

        this.presenter.moveInCurrentDirection(cellInput);

        this.validateIsCellInputElementBlurred(4, 6);
    },

    'test given vertical direction for navigation when moving and no editable cells on bottom site then blur current element': function () {
        this.presenter.setVerticalDirection();
        var cellInput = this.getCellInputElement(5, 5);

        this.presenter.moveInCurrentDirection(cellInput);

        this.validateIsCellInputElementBlurred(5, 5);
    },

    // TabIndex direction tests

    'test given TabIndex direction for navigation when moving and next cell is editable then move to next cell': function () {
        this.presenter.setTabIndexDirection();
        var cellInput = this.getCellInputElement(3, 4);

        this.presenter.moveInCurrentDirection(cellInput);

        this.validateIsCellInputElementFocused(4, 4);
    },

    'test given TabIndex direction for navigation when moving and next cell is blank then move to first editable cell': function () {
        this.presenter.setTabIndexDirection();
        var cellInput = this.getCellInputElement(5, 2);

        this.presenter.moveInCurrentDirection(cellInput);

        this.validateIsCellInputElementFocused(1, 3);
    },

    'test given TabIndex direction for navigation when moving and next cell is constant then move to first editable cell': function () {
        this.presenter.setTabIndexDirection();
        var cellInput = this.getCellInputElement(2, 3);

        this.presenter.moveInCurrentDirection(cellInput);

        this.validateIsCellInputElementFocused(6, 3);
    },

    'test given TabIndex direction for navigation when moving and next cells are blank and constant then move to first editable cell': function () {
        this.presenter.setTabIndexDirection();
        var cellInput = this.getCellInputElement(7, 3);

        this.presenter.moveInCurrentDirection(cellInput);

        this.validateIsCellInputElementFocused(2, 4);
    },

    'test given TabIndex direction for navigation when moving and then there are no editable cells then blur current element': function () {
        this.presenter.setTabIndexDirection();
        var cellInput = this.getCellInputElement(0, 8);

        this.presenter.moveInCurrentDirection(cellInput);

        this.validateIsCellInputElementBlurred(0, 8);
    },

    // NextVerticalAnswerDirection tests

    'test given findNextColumn when next column has answers then return first available gap': function () {
        this.presenter.$view.find(`.cell_row_1.cell_column_6`).addClass("cell_word_begin_vertical cell_column_6")
        this.presenter.isNextVerticalAnswerDirection = () => true;

        const res = this.presenter.findNextColumn({ x: 5, y: 5 })

        const expected = JSON.stringify({ y: 1, x: 6 })
        const actual = JSON.stringify(res);

        assertTrue(expected === actual);
    },

    'test not given direction for auto navigation when moving then blur current element': function () {
        this.presenter.resetDirection();
        var cellInput = this.getCellInputElement(3, 4);

        this.presenter.moveInCurrentDirection(cellInput);

        this.validateIsCellInputElementBlurred(3, 4);
    },

    getCellInputElement: function (x, y) {
        return this.presenter.$view.find(`.cell_row_${y}.cell_column_${x}`).find("input")[0];
    },

    validateIsCellInputElementFocused: function (x, y) {
        assertTrue(!!this.focusedCellInputPosition
            && (this.focusedCellInputPosition.x === x
                && this.focusedCellInputPosition.y === y));
    },

    validateIsCellInputElementBlurred: function (x, y) {
        assertTrue(!!this.bluredCellInputPosition
            && (this.bluredCellInputPosition.x === x
                && this.bluredCellInputPosition.y === y));
    },
});
