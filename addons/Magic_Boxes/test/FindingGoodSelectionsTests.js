TestCase("[Magic Boxes] Finding good selections in grid", {
    setUp: function () {
        this.presenter = AddonMagic_Boxes_create();
    },

    'test given grid with horizontal answer when looking for the answer then the answer will be found': function () {
        var grid = [
            ['a', 'b', 'c'],
            ['k', 'o', 't'],
            ['i', 'j', 'k']
        ], selections = [
            [false, false, false],
            [true,  true,  true],
            [false, false, false]
        ], answers = ["kot"];
        this.presenter.GSAcorrectAnswerLocations["kot"] = {
            row: [],
            column: [],
        };

        var result = this.presenter.findGoodSelections(grid, answers);

        assertEquals(selections, result);
    },

    'test given grid with realistic horizontal answer when looking for the answer then the answer will be found': function () {
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
        this.presenter.GSAcorrectAnswerLocations["biomass"] = {
            row: [],
            column: [],
        };

        var result = this.presenter.findGoodSelections(grid, answers);

        assertEquals(selections, result);
    },

    'test given grid with vertical answer when looking for the answer then the answer will be found': function () {
        var grid = [
            ['a', 'b', 'c'],
            ['k', 'o', 't'],
            ['i', 'j', 'k']
        ], selections = [
            [false, true, false],
            [false, true, false],
            [false, true, false]
        ], answers = ["boj"];
        this.presenter.GSAcorrectAnswerLocations["boj"] = {
            row: [],
            column: [],
        };

        var result = this.presenter.findGoodSelections(grid, answers);

        assertEquals(selections, result);
    },

    'test given grid with diagonal answer when looking for the answer then the answer will be found': function () {
        var grid = [
            ['a', 'b', 'c'],
            ['k', 'o', 't'],
            ['i', 'j', 'k']
        ], selections = [
            [true, false, false],
            [false, true, false],
            [false, false, true]
        ], answers = ["aok"];
        this.presenter.GSAcorrectAnswerLocations["aok"] = {
            row: [],
            column: [],
        };

        var result = this.presenter.findGoodSelections(grid, answers);

        assertEquals(selections, result);
    },

    'test given grid with reverse diagonal answer when looking for the answer then the answer will be found': function () {
        var grid = [
            ['a', 'b', 'c'],
            ['k', 'o', 't'],
            ['i', 'j', 'k']
        ], selections = [
            [false, false, true],
            [false, true, false],
            [true, false, false]
        ], answers = ["ioc"];
        this.presenter.GSAcorrectAnswerLocations["ioc"] = {
            row: [],
            column: [],
        };

        var result = this.presenter.findGoodSelections(grid, answers);

        assertEquals(selections, result);
    },

    'test given grid with reverse diagonal answer not starting in a corner when looking for the answer then the answer will be found': function () {
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
        this.presenter.GSAcorrectAnswerLocations["mie"] = {
            row: [],
            column: [],
        };

        var result = this.presenter.findGoodSelections(grid, answers);

        assertEquals(selections, result);
    },

    'test given grid with mixed answers when looking for the answers then the answers will be found': function () {
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
        for (var i in answers) {
            let ans = answers[i];
            this.presenter.GSAcorrectAnswerLocations[ans] = {
                row: [],
                column: []
            };
        }

        var result = this.presenter.findGoodSelections(grid, answers);

        assertEquals(selections, result);
    },

    'test given grid without correct answers when looking for answers then the answer will NOT be found': function () {
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