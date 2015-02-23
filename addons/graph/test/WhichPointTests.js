TestCase("[Graph] Which point", {
    setUp: function () {
        this.presenter = Addongraph_create();
    },

    'test near zero': function() {
        var point = this.presenter.whichPoint(20, 5, 300, 1);

        assertEquals(0, point);
    },

    'test near maximum': function () {
        var point = this.presenter.whichPoint(290, 5, 300, 1);

        assertEquals(5, point);
    },

    'test near first point': function () {
        var point = this.presenter.whichPoint(75, 5, 300, 1);

        assertEquals(1, point);
    },

    'test near middle point': function () {
        var point = this.presenter.whichPoint(180, 5, 300, 1);

        assertEquals(3, point);
    },

    'test at lower boundary': function () {
        var point = this.presenter.whichPoint(90, 5, 300, 1);

        assertEquals(2, point);
    },

    'test at upper boundary': function () {
        var point = this.presenter.whichPoint(150, 5, 300, 1);

        assertEquals(3, point);
    },

    'test interactive step is floating point and user reached first snap point': function () {
        var point = this.presenter.whichPoint(160, 10, 1000, 1.5);

        assertEquals(1.5, point);
    },

    'test interactive step is floating point and user reached second snap point': function () {
        var point = this.presenter.whichPoint(280, 10, 1000, 1.5);

        assertEquals(3, point);
    },

    'test interactive step is floating point and user reached last reachable snap point': function () {
        var point = this.presenter.whichPoint(880, 10, 1000, 1.5);

        assertEquals(9, point);
    }

});