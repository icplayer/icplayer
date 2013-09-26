TestCase("[Plot] PlotPlotTests", {
    setUp: function() {
        this.presenter = AddonPlot_create();
        this.plot = this.presenter.getPlot();
    },
    'test not activity': function() {
        this.plot.isActivity = false;
        assertEquals(this.plot.STATE_NOT_ACTIVITY, this.plot.getPlotEventScore('p1'));
    },
    'test select correct plot': function() {
        var expressions = [
            {
                id: 'p1',
                expression: 'x+2',
                correctAnswer: true,
                selected: true
            }
        ];

        this.plot.isActivity = true;
        this.plot.expressions = expressions;
        assertEquals(this.plot.STATE_CORRECT, this.plot.getPlotEventScore('p1'));
    },
    'test deselect correct plot': function() {
        var expressions = [
            {
                id: 'p1',
                expression: 'x+2',
                correctAnswer: true,
                selected: false
            }
        ];

        this.plot.isActivity = true;
        this.plot.expressions = expressions;
        assertEquals(0, this.plot.getPlotEventScore('p1'));
    },
    'test select wrong plot': function() {
        var expressions = [
            {
                id: 'p1',
                expression: 'x+2',
                correctAnswer: false,
                selected: true
            }
        ];

        this.plot.isActivity = true;
        this.plot.expressions = expressions;
        assertEquals(this.plot.STATE_INCORRECT, this.plot.getPlotEventScore('p1'));
    },
    'test deselect wrong plot': function() {
        var expressions = [
            {
                id: 'p1',
                expression: 'x+2',
                correctAnswer: false,
                selected: false
            }
        ];

        this.plot.isActivity = true;
        this.plot.expressions = expressions;
        assertEquals(this.plot.STATE_NULL, this.plot.getPlotEventScore('p1'));
    }
});