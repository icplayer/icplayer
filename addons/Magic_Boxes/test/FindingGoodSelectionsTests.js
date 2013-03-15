TestCase("Finding good selections in grid", {
    setUp: function () {
        this.presenter = AddonMagic_Boxes_create();
    },

    'test horizontal answer': function () {
        var grid = [
            ['a', 'b', 'c'],
            ['k', 'o', 't'],
            ['i', 'j', 'k']
        ], selections = [
            [false, false, false],
            [true,  true,  true],
            [false, false, false]
        ], answers = ["kot"];

        var result = this.presenter.findGoodSelections(grid, answers);

        assertEquals(selections, result);
    },

    'test horizontal answer real example': function () {
        var grid = [
            ['s', 'w', 'i', 'o', 'w', 'k', 'l'],
            ['b', 'i', 'o', 'm', 'a', 's', 's'],
            ['y', 'n', 'h', 'a', 'v', 'l', 'i'],
            ['x', 'd', 'm', 'n', 'e', 'c', 'o'],
            ['g', 'a', 'v', 'a', 's', 'u', 'n'],
            ['l', 'i', 't', 'i', 'd', 'e', 's'],
            ['b', 'a', 'r', 'j', 'g', 'n', 'o'],
            ['g', 'l', 'w', 'a', 't', 'e', 'r']
        ], selections = [
            [false, false, false, false, false, false, false],
            [true,  true,  true,  true,  true,  true,  true],
            [false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false]
        ], answers = ["biomass"];

        var result = this.presenter.findGoodSelections(grid, answers);

        assertEquals(selections, result);
    },

    'test vertical answer': function () {
        var grid = [
            ['a', 'b', 'c'],
            ['k', 'o', 't'],
            ['i', 'j', 'k']
        ], selections = [
            [false, true, false],
            [false, true, false],
            [false, true, false]
        ], answers = ["boj"];

        var result = this.presenter.findGoodSelections(grid, answers);

        assertEquals(selections, result);
    },

    'test diagonal answer': function () {
        var grid = [
            ['a', 'b', 'c'],
            ['k', 'o', 't'],
            ['i', 'j', 'k']
        ], selections = [
            [true, false, false],
            [false, true, false],
            [false, false, true]
        ], answers = ["aok"];

        var result = this.presenter.findGoodSelections(grid, answers);

        assertEquals(selections, result);
    },

    'test reverse diagonal answer': function () {
        var grid = [
            ['a', 'b', 'c'],
            ['k', 'o', 't'],
            ['i', 'j', 'k']
        ], selections = [
            [false, false, true],
            [false, true, false],
            [true, false, false]
        ], answers = ["ioc"];

        var result = this.presenter.findGoodSelections(grid, answers);

        assertEquals(selections, result);
    },

    'test reverse diagonal answer not starting in corner': function () {
        var grid = [
            ['a', 'b', 'c', 'd', 'e'],
            ['f', 'g', 'h', 'i', 'j'],
            ['k', 'l', 'm', 'n', 'o'],
            ['p', 'r', 's', 't', 'w']
        ], selections = [
            [false, false, false, false, true],
            [false, false, false, true, false],
            [false, false, true, false, false],
            [false, false, false, false, false]
        ], answers = ["mie"];

        var result = this.presenter.findGoodSelections(grid, answers);

        assertEquals(selections, result);
    },

    'test mixed answer': function () {
        var grid = [
            ['a', 'b', 'c', 'd', 'e'],
            ['f', 'g', 'h', 'i', 'j'],
            ['k', 'l', 'm', 'n', 'o'],
            ['p', 'r', 's', 't', 'w']
        ], selections = [
            [true,  true,  true,  false, false],
            [false, false, true,  true,  false],
            [true,  true,  false, true,  false],
            [true,  true,  true,  true,  false]
        ], answers = ["abc", "kr", "rs", "int", "plh"];


        var result = this.presenter.findGoodSelections(grid, answers);

        assertEquals(selections, result);
    },

    'test answer not present in grid': function () {
        var grid = [
            ['a', 'b', 'c'],
            ['k', 'o', 't'],
            ['i', 'j', 'k']
        ], selections = [
            [false, false, false],
            [false, false, false],
            [false, false, false]
        ], answers = ["bub"];

        var result = this.presenter.findGoodSelections(grid, answers);

        assertEquals(selections, result);
    }
});