TestCase("[Crossword] Utils", {
    setUp: function() {
        this.presenter = Addoncrossword_create();
    },

    'test proper model': function() {
        var $element, position;

        $element = $('<div class="cell cell_2x5 cell_row_2 cell_column_5 cell_letter"></div>');
        position = this.presenter.getPosition($element);
        assertEquals(5, position.x);
        assertEquals(2, position.y);

        $element = $('<div class="cell cell_2x5 cell_row_0 cell_column_0 cell_letter"></div>');
        position = this.presenter.getPosition($element);
        assertEquals(0, position.x);
        assertEquals(0, position.y);

        $element = $('<div class="cell cell_2x5 cell_row_7 cell_column_1 cell_letter"></div>');
        position = this.presenter.getPosition($element);
        assertEquals(1, position.x);
        assertEquals(7, position.y);

        $element = $('<div class="cell cell_2x5 cell_row_100 cell_column_75 cell_letter"></div>');
        position = this.presenter.getPosition($element);
        assertEquals(75, position.x);
        assertEquals(100, position.y);
    }
});