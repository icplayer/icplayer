TestCase("[Magic Boxes] Finding words in grid rows", {
    setUp: function () {
        this.presenter = AddonMagic_Boxes_create();
    },

    'test horizontal word too long': function () {
        var grid = [
            ['a', 'b', 'c'],
            ['k', 'o', 't'],
            ['i', 'j', 'k']
        ];

        var result = this.presenter.isWordInRow(grid, 0, "kaka");

        assertFalse(result.wordFound);
        assertArray(result.positions);
    },

    'test horizontal found': function () {
        var grid = [
            ['a', 'b', 'c'],
            ['k', 'o', 't'],
            ['i', 'j', 'k']
        ];

        var result = this.presenter.isWordInRow(grid, 1, "kot");

        assertTrue(result.wordFound);
        assertEquals([0], result.positions);
    },

    'test horizontal found upper case grid': function () {
        var grid = [
            ['A', 'B', 'C'],
            ['K', 'O', 'T'],
            ['I', 'J', 'K']
        ];

        var result = this.presenter.isWordInRow(grid, 1, "kot");

        assertTrue(result.wordFound);
        assertEquals([0], result.positions);
    },

    'test horizontal found upper case answer': function () {
        var grid = [
            ['a', 'b', 'c'],
            ['k', 'o', 't'],
            ['i', 'j', 'k']
        ];

        var result = this.presenter.isWordInRow(grid, 1, "KOT");

        assertTrue(result.wordFound);
        assertEquals([0], result.positions);
    },

    'test horizontal reverse order found': function () {
        var grid = [
            ['a', 'b', 'c'],
            ['t', 'o', 'k'],
            ['i', 'j', 'k']
        ];

        var result = this.presenter.isWordInRow(grid, 1, "kot");

        assertTrue(result.wordFound);
        assertEquals([0], result.positions);
    },

    'test horizontal multiple occurrence': function () {
        var grid = [
            ['a', 'b', 'c', 'd', 'e'],
            ['k', 'o', 'h', 'o', 'k'],
            ['i', 'j', 'o', 'k', 'r']
        ];

        var result = this.presenter.isWordInRow(grid, 1, "ko");

        assertTrue(result.wordFound);
        assertEquals([0, 3], result.positions);
    },

    'test horizontal single character word': function () {
        var grid = [
            ['a', 'b', 'c', 'd'],
            ['k', 'k', 'k', 'k'],
            ['i', 'j', 'k', 'l']
        ];

        var result = this.presenter.isWordInRow(grid, 1, "k");

        assertTrue(result.wordFound);
        assertEquals([0, 1, 2, 3], result.positions);
    },

    'test vertical word too long': function () {
        var grid = [
            ['a', 'b', 'c', 'd'],
            ['k', 'o', 't', 'a'],
            ['i', 'j', 'k', 'l']
        ];

        var result = this.presenter.isWordInColumn(grid, 0,  "kaka");

        assertFalse(result.wordFound);
        assertArray(result.positions);
    },

    'test vertical found': function () {
        var grid = [
            ['a', 'b', 'c'],
            ['k', 'o', 't'],
            ['i', 'j', 'k']
        ];

        var result = this.presenter.isWordInColumn(grid, 1, "boj");

        assertTrue(result.wordFound);
        assertEquals([0], result.positions);
    },

    'test vertical found upper case grid': function () {
        var grid = [
            ['A', 'B', 'C'],
            ['K', 'O', 'T'],
            ['I', 'J', 'K']
        ];

        var result = this.presenter.isWordInColumn(grid, 1, "boj");

        assertTrue(result.wordFound);
        assertEquals([0], result.positions);
    },

    'test vertical found upper case answer': function () {
        var grid = [
            ['a', 'b', 'c'],
            ['k', 'o', 't'],
            ['i', 'j', 'k']
        ];

        var result = this.presenter.isWordInColumn(grid, 1, "BOJ");

        assertTrue(result.wordFound);
        assertEquals([0], result.positions);
    },

    'test vertical reverse order found': function () {
        var grid = [
            ['a', 'j', 'c'],
            ['k', 'o', 't'],
            ['i', 'b', 'k']
        ];

        var result = this.presenter.isWordInColumn(grid, 1, "boj");

        assertTrue(result.wordFound);
        assertEquals([0], result.positions);
    },

    'test vertical multiple occurrence': function () {
        var grid = [
            ['a', 'b', 'c', 'd'],
            ['k', 'o', 'k', 'o'],
            ['i', 'x', 'k', 'l'],
            ['i', 'o', 'k', 'l'],
            ['i', 'b', 'k', 'l']
        ];

        var result = this.presenter.isWordInColumn(grid, 1, "bo");

        assertTrue(result.wordFound);
        assertEquals([0, 3], result.positions);
    },

    'test vertical single character word': function () {
        var grid = [
            ['a', 'b', 'c', 'd'],
            ['k', 'b', 'k', 'k'],
            ['i', 'b', 'k', 'l']
        ];

        var result = this.presenter.isWordInColumn(grid, 1, "b");

        assertTrue(result.wordFound);
        assertEquals([0, 1, 2], result.positions);
    },

    'test diagonal too long': function () {
        var grid = [
            ['d', 'b', 'c', 'd'],
            ['k', 'o', 'k', 'o'],
            ['i', 'b', 'm', 'l'],
            ['i', 'o', 'k', 'l']
        ];

        var result = this.presenter.isWordOnDiagonals(grid, "domek", this.presenter.DIAGONALS.NORMAL);

        assertFalse(result.wordFound);
        assertArray(result.positions);
    },

    'test diagonal too long and grid to low': function () {
        var grid = [
            ['d', 'b', 'c', 'd'],
            ['k', 'o', 'k', 'o']
        ];

        var result = this.presenter.isWordOnDiagonals(grid, "dom", this.presenter.DIAGONALS.NORMAL);

        assertFalse(result.wordFound);
        assertArray(result.positions);
    },

    'test diagonal found': function () {
        var grid = [
            ['a', 'b', 'c', 'd'],
            ['k', 'd', 'k', 'o'],
            ['i', 'b', 'o', 'l'],
            ['i', 'o', 'k', 'm'],
            ['i', 'o', 'k', 'm']
        ];

        var result = this.presenter.isWordOnDiagonals(grid, "dom", this.presenter.DIAGONALS.NORMAL);

        assertTrue(result.wordFound);
        assertEquals([{row: 1, column: 1}], result.positions);
    },

    'test diagonal found upper case grid': function () {
        var grid = [
            ['A', 'B', 'C', 'D'],
            ['K', 'D', 'K', 'O'],
            ['I', 'B', 'O', 'L'],
            ['I', 'O', 'K', 'M'],
            ['I', 'O', 'K', 'M']
        ];

        var result = this.presenter.isWordOnDiagonals(grid, "dom", this.presenter.DIAGONALS.NORMAL);

        assertTrue(result.wordFound);
        assertEquals([{row: 1, column: 1}], result.positions);
    },

    'test diagonal found upper case answer': function () {
        var grid = [
            ['a', 'b', 'c', 'd'],
            ['k', 'd', 'k', 'o'],
            ['i', 'b', 'o', 'l'],
            ['i', 'o', 'k', 'm'],
            ['i', 'o', 'k', 'm']
        ];

        var result = this.presenter.isWordOnDiagonals(grid, "DOM", this.presenter.DIAGONALS.NORMAL);

        assertTrue(result.wordFound);
        assertEquals([{row: 1, column: 1}], result.positions);
    },

    'test diagonal reverse order found': function () {
        var grid = [
            ['a', 'b', 'c', 'd'],
            ['k', 'm', 'k', 'o'],
            ['i', 'b', 'o', 'l'],
            ['i', 'o', 'k', 'd'],
            ['i', 'o', 'k', 'm']
        ];

        var result = this.presenter.isWordOnDiagonals(grid, "dom", this.presenter.DIAGONALS.NORMAL);

        assertTrue(result.wordFound);
        assertEquals([{row: 1, column: 1}], result.positions);
    },

    'test diagonal multiple occurrence': function () {
        var grid = [
            ['d', 'b', 'd', 'd', 'e'],
            ['k', 'o', 'k', 'o', 'o'],
            ['i', 'b', 'g', 'l', 'z'],
            ['i', 'o', 'k', 'o', 'z'],
            ['i', 'o', 'k', 'o', 'd']
        ], positions = [
            {row: 0, column: 0},
            {row: 0, column: 2},
            {row: 0, column: 3},
            {row: 3, column: 3}
        ];

        var result = this.presenter.isWordOnDiagonals(grid, "do", this.presenter.DIAGONALS.NORMAL);

        assertTrue(result.wordFound);
        assertEquals(positions, result.positions);
    },

    'test reverse too long': function () {
        var grid = [
            ['d', 'b', 'c', 'd'],
            ['k', 'o', 'k', 'o'],
            ['i', 'b', 'm', 'l'],
            ['i', 'o', 'k', 'l']
        ];

        var result = this.presenter.isWordOnDiagonals(grid, "domek", this.presenter.DIAGONALS.REVERSED);

        assertFalse(result.wordFound);
        assertArray(result.positions);
    },

    'test reverse too long and grid too low': function () {
        var grid = [
            ['d', 'b', 'c', 'd'],
            ['k', 'o', 'k', 'o']
        ];

        var result = this.presenter.isWordOnDiagonals(grid, "dom", this.presenter.DIAGONALS.REVERSED);

        assertFalse(result.wordFound);
        assertArray(result.positions);
    },

    'test reverse diagonal found': function () {
        var grid = [
            ['d', 'b', 'd', 'd'],
            ['k', 'o', 'k', 'o'],
            ['m', 'b', 'l', 'l'],
            ['i', 'o', 'k', 'l']
        ];

        var result = this.presenter.isWordOnDiagonals(grid, "dom", this.presenter.DIAGONALS.REVERSED);

        assertTrue(result.wordFound);
        assertEquals([{row: 0, column: 2}], result.positions);
    },

    'test reverse diagonal reverse order found': function () {
        var grid = [
            ['d', 'b', 'm', 'd'],
            ['k', 'o', 'k', 'o'],
            ['d', 'b', 'l', 'l'],
            ['i', 'o', 'k', 'l']
        ];

        var result = this.presenter.isWordOnDiagonals(grid, "dom", this.presenter.DIAGONALS.REVERSED);

        assertTrue(result.wordFound);
        assertEquals([{row: 0, column: 2}], result.positions);
    },

    'test reverse diagonal multiple occurrence': function () {
        var grid = [
            ['d', 'b', 'd', 'd'],
            ['k', 'o', 'm', 'o'],
            ['m', 'o', 'l', 'l'],
            ['d', 'o', 'k', 'l']
        ];
        var positions = [
            {row: 0, column: 2},
            {row: 1, column: 2}
        ];

        var result = this.presenter.isWordOnDiagonals(grid, "dom", this.presenter.DIAGONALS.REVERSED);

        assertTrue(result.wordFound);
        assertEquals(positions, result.positions);
    }
});