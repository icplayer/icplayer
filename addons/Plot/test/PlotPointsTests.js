TestCase("[Plot] PlotPointsTests", {
    setUp: function() {
        this.presenter = AddonPlot_create();
        this.plot = this.presenter.getPlot();
        this.plot.freePoints = false;
        this.plot.isActivity = true;
    },
    'test not activity': function() {
        this.plot.isActivity = false;
        assertEquals(this.plot.STATE_NOT_ACTIVITY, this.plot.getPointEventScore(5,5,this.plot.STATE_SELECT_POINT));
    },
    'test free points': function() {
        this.plot.points = [];
        this.plot.freePoints = true;
        assertEquals(this.plot.STATE_NOT_ACTIVITY, this.plot.getPointEventScore(5,5,this.plot.STATE_SELECT_POINT));
    },
    'test select correct point in defined points': function() {
        var points = [
            {
                x: 5,
                y: 6,
                correct: true
            }
        ];

        this.plot.points = points;
        assertEquals(this.plot.STATE_CORRECT, this.plot.getPointEventScore(5,6,this.plot.STATE_SELECT_POINT));
    },
    'test deselect correct point in defined points': function() {
        var points = [
            {
                x: 5,
                y: 6,
                correct: true
            }
        ];

        this.plot.points = points;
        assertEquals(this.plot.STATE_NULL, this.plot.getPointEventScore(5,6,this.plot.STATE_DESELECT_POINT));
    },
    'test select wrong point outside defined points': function() {
        this.plot.points = [];
        assertEquals(this.plot.STATE_INCORRECT, this.plot.getPointEventScore(1,1,this.plot.STATE_SELECT_POINT));
    },
    'test deselect wrong point outside defined points': function() {
        this.plot.points = [];
        assertEquals(this.plot.STATE_NULL, this.plot.getPointEventScore(1,1,this.plot.STATE_DESELECT_POINT));
    },
    'test select point in defined points when correct is false': function() {
        var points = [
            {
                x: 5,
                y: 6,
                correct: false
            }
        ];
        this.plot.points = points;
        assertEquals(this.plot.STATE_INCORRECT, this.plot.getPointEventScore(5,6,this.plot.STATE_SELECT_POINT));
    },
    'test deselect point in defined points when correct is false': function() {
        var points = [
            {
                x: 5,
                y: 6,
                correct: false
            }
        ];
        this.plot.points = points;
        assertEquals(this.plot.STATE_CORRECT, this.plot.getPointEventScore(5,6,this.plot.STATE_DESELECT_POINT));
    }
});