TestCase("[Magic Boxes] Max score calculation", {
    setUp: function () {
        this.presenter = AddonMagic_Boxes_create();
    },

    'test zero max score': function () {
        var selections = [
            [false, false, false, false, false],
            [false, false, false, false, false],
            [false, false, false, false, false],
            [false, false, false, false, false]
        ];

        var maxScore = this.presenter.calculateMaxScore(selections);

        assertEquals(0, maxScore);
    },

    'test positive score': function () {
        var selections = [
            [false, false, false, false, false],
            [true,  true,  false, true,  false],
            [false, false, false, true,  false],
            [false, false, false, true,  false]
        ];

        var maxScore = this.presenter.calculateMaxScore(selections);

        assertEquals(5, maxScore);
    },

    'test maximum': function () {
        var selections = [
            [true, true, true, true, true],
            [true, true, true, true, true],
            [true, true, true, true, true],
            [true, true, true, true, true]
        ];

        var maxScore = this.presenter.calculateMaxScore(selections);

        assertEquals(20, maxScore);
    }
});