function getCrosswordForNavigationTests () {
    return [
        //0A   1B    2C   3D    4E    5F    6G   7H    8I   9J
        [" ", "!G", " ", "O" , " " , "S" , " ", " " , " ", " "], // 0
        ["W", "I" , "E", "L" , "O" , "K" , "Ą", "T" , " ", " "], // 1
        [" ", "L" , " ", "Y" , " " , "W" , " ", " " , " ", " "], // 2
        [" ", "M" , "O", "!M", "!B", "!A", "S", "A" , " ", " "], // 3
        [" ", "!O", "D", "P" , "Ó" , "R" , " ", " " , " ", " "], // 4
        [" ", "!U", "K", "U" , "L" , "E" , "L", "!E", " ", " "], // 5
        ["B", "R" , "U", "S" , "E" , "!K", "E", " " , "O", " "], // 6
        ["Y", " " , "P", " " , " " , " " , "K", " " , " ", " "], // 7
        ["K", " " , " ", " " , " " , " " , " ", " " , " ", " "]  // 8
    ]
}


TestCase("[Crossword] Analyze auto navigation direction tests", {
    setUp: function() {
        this.presenter = Addoncrossword_create();

        this.presenter.rowCount = 9;
        this.presenter.columnCount = 10;
        this.presenter.crossword = getCrosswordForNavigationTests();

        this.view = document.createElement('div');
        this.presenter.$view = $(this.view);
        this.presenter.createGrid();
    },

    'test given horizontal direction for auto navigation when at least one editable cell on right site then set horizontal direction': function () {
        // Algorithm 1's rule
        this.presenter.setHorizontalDirection();
        var cellInput = this.getCellInputElement(2, 3);

        this.presenter.analyzeDirectionOfMove(cellInput);

        assertTrue(this.presenter.isHorizontalDirection());
    },

    'test given horizontal direction for auto navigation when no editable cells on right site then set TabIndex direction': function () {
        // Algorithm 2's rule
        this.presenter.setHorizontalDirection();
        var cellInput = this.getCellInputElement(7, 1);

        this.presenter.analyzeDirectionOfMove(cellInput);

        assertTrue(this.presenter.isTabIndexDirection());
    },

    'test given vertical direction for auto navigation when at least one editable cell on bottom site then set vertical direction': function () {
        // Algorithm 3's rule
        this.presenter.setVerticalDirection();
        var cellInput = this.getCellInputElement(3, 2);

        this.presenter.analyzeDirectionOfMove(cellInput);

        assertTrue(this.presenter.isVerticalDirection());
    },

    'test given vertical direction for auto navigation when no editable cells on bottom site then set TabIndex direction': function () {
        // Algorithm 4's rule
        this.presenter.setVerticalDirection();
        var cellInput = this.getCellInputElement(3, 6);

        this.presenter.analyzeDirectionOfMove(cellInput);

        assertTrue(this.presenter.isTabIndexDirection());
    },

    'test not given direction for auto navigation when at least one editable cell on bottom site and right cell is blank then set vertical direction': function () {
        // Algorithm 5's rule
        var cellInput = this.getCellInputElement(3, 0);

        this.presenter.analyzeDirectionOfMove(cellInput);

        assertTrue(this.presenter.isVerticalDirection());
    },

    'test not given direction for auto navigation when at least one editable cell on right site and top cell and bottom cell are blank then set horizontal direction': function () {
        // Algorithm 6's rule
        var cellInput = this.getCellInputElement(4, 1);

        this.presenter.analyzeDirectionOfMove(cellInput);

        assertTrue(this.presenter.isHorizontalDirection());
    },

    'test not given direction for auto navigation when at least one editable cell on bottom site and top cell is blank and right cell is not blank then set vertical direction': function () {
        // Algorithm 7's rule
        var cellInput = this.getCellInputElement(2, 3);

        this.presenter.analyzeDirectionOfMove(cellInput);

        assertTrue(this.presenter.isVerticalDirection());
    },

    'test not given direction for auto navigation when at least one editable cell on bottom site and right cell is not empty and bottom cell is empty then set vertical direction': function () {
        // Algorithm 8's rule
        var notEmptyCellInput = this.getCellInputElement(3, 4);
        $(notEmptyCellInput).val('A')
        var cellInput = this.getCellInputElement(2, 4);

        this.presenter.analyzeDirectionOfMove(cellInput);

        assertTrue(this.presenter.isVerticalDirection());
    },

    'test not given direction for auto navigation when at least one editable cell on right site then set horizontal direction': function () {
        // Algorithm 9's rule
        var cellInput = this.getCellInputElement(2, 4);

        this.presenter.analyzeDirectionOfMove(cellInput);

        assertTrue(this.presenter.isHorizontalDirection());
    },

    'test not given direction for auto navigation when not any of previous rules have been met then set TabIndex direction': function () {
        // Algorithm 10's rule
        this.presenter.setVerticalDirection();
        var cellInput = this.getCellInputElement(8, 6);

        this.presenter.analyzeDirectionOfMove(cellInput);

        assertTrue(this.presenter.isTabIndexDirection());
    },

    getCellInputElement: function (x, y) {
        return this.presenter.$view.find(`.cell_row_${y}.cell_column_${x}`).find("input")[0];
    },
});
