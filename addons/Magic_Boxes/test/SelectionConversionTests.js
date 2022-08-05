TestCase("[Magic Boxes] Selection to array conversion", {
    setUp: function () {
        this.presenter = AddonMagic_Boxes_create();
    },

    'test conversion': function () {
        var selections = [
            {row: 1, column: 0},
            {row: 1, column: 1},
            {row: 1, column: 2}
        ], selectionArray = [
            [false, false, false],
            [true, true, true],
            [false, false, false]
        ];
    
        var result = this.presenter.convertSelectionToArray(selections, 3, 3);
    
        assertEquals(selectionArray, result);
    },
    
    'test conversion from duplicated points': function () {
        var selections = [
            {row: 1, column: 0},
            {row: 1, column: 1},
            {row: 1, column: 2},
            {row: 1, column: 1}
        ], selectionArray = [
            [false, false, false],
            [true, true, true],
            [false, false, false]
        ];
    
        var result = this.presenter.convertSelectionToArray(selections, 3, 3);
    
        assertEquals(selectionArray, result);
    },
    
    'test conversion to indexes': function () {
        var selectionArray = [
            [false, false, false],
            [true,  true,  true],
            [false, false, false]
        ], selectionIndexes = [-1, -1, -1, 1, 1, 1, -1, -1, -1];
    
        var result = this.presenter.convertSelectionToIndexes(selectionArray, 3, 3);
    
        assertEquals(selectionIndexes, result);
    }
});