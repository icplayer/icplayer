TestCase("[Magic Boxes] Score calculation", {
    setUp: function () {
        this.presenter = AddonMagic_Boxes_create();
    },

    'test no score': function () {
        var goodSelections = [
            [true,  true,  true, false, false],
            [false, false, true, false, false],
            [true,  false, true, false, false],
            [false, false, true, false, false]
        ], selections = [
            [false, false, false, false, false],
            [false, false, false, false, false],
            [false, false, false, false, false],
            [false, false, false, false, false]
        ];

        var score = this.presenter.calculateScore(goodSelections, selections);

        assertEquals(0, score.correct);
        assertEquals(0, score.errors);
    },

    'test perfect score': function () {
        var goodSelections = [
            [true,  true,  true, false, false],
            [false, false, true, false, false],
            [true,  false, true, false, false],
            [false, false, true, false, false]
        ], selections = [
            [true,  true,  true, false, false],
            [false, false, true, false, false],
            [true,  false, true, false, false],
            [false, false, true, false, false]
        ];

        var score = this.presenter.calculateScore(goodSelections, selections);

        assertEquals(7, score.correct);
        assertEquals(0, score.errors);
    },

    'test maximum error count': function () {
        var goodSelections = [
            [true,  true,  true, false, false],
            [false, false, true, false, false],
            [true,  false, true, false, false],
            [false, false, true, false, false]
        ], selections = [
            [false, false, false, true, true],
            [true,  true,  false, true, true],
            [false, true,  false, true, true],
            [true,  true,  false, true, true]
        ];

        var score = this.presenter.calculateScore(goodSelections, selections);

        assertEquals(0, score.correct);
        assertEquals(13, score.errors);
    },

    'test mixed score': function () {
        var goodSelections = [
            [true,  true,  true, false, false],
            [false, false, true, false, false],
            [true,  false, true, false, false],
            [false, false, true, false, false]
        ], selections = [
            [true,  true,  false, false, false],
            [true,  true,  true,  false, true],
            [false, false, true,  false, true],
            [false, false, true,  false, true]
        ];

        var score = this.presenter.calculateScore(goodSelections, selections);

        assertEquals(5, score.correct);
        assertEquals(5, score.errors);
    }
});