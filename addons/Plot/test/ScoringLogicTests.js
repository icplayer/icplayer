TestCase("[Plot] Scoring logic", {
    setUp: function () {
        this.presenter = AddonPlot_create();
        this.plot = this.presenter.getPlot();
    },
    'test error count when not activity': function() {
        var expressions = [
            {
                id: 'p1',
                expression: 'x+2',
                correctAnswer: false,
                selected: true,
                touched: true,
                variables: {},
                selectable: true
            }
        ];
        var points = [
            {
                x: 1,
                y: 1,
                correct: true,
                touched: true,
                notScored: false,
                clickable: true
            }
        ];
        var selectedPoints = [
            {
                x: 1,
                y: 1,
                clickable: true
            }
        ];

        this.presenter.isActivity = false;
        this.plot.expressions = expressions;
        this.plot.points = points;
        this.plot.selectedPoints = selectedPoints;
        assertEquals(0, this.presenter.getErrorCount());
    },
    'test error count when 1 plot correct and 1 plot not touched': function() {
        var expressions = [
            {
                id: 'p1',
                expression: 'x+2',
                correctAnswer: true,
                selected: true,
                touched: true,
                variables: {},
                selectable: true
            },
            {
                id: 'p2',
                expression: 'x+4',
                correctAnswer: false,
                selected: true,
                touched: false,
                variables: {},
                selectable: true
            }
        ];

        this.presenter.isActivity = true;
        this.plot.expressions = expressions;

        assertEquals(0, this.presenter.getErrorCount());
    },
    'test error count when 1 plot wrong': function() {
        var expressions = [
            {
                id: 'p1',
                expression: 'x+2',
                correctAnswer: false,
                selected: true,
                touched: true,
                variables: {},
                selectable: true
            }
        ];

        this.presenter.isActivity = true;
        this.plot.expressions = expressions;

        assertEquals(1, this.presenter.getErrorCount());
    },
    'test error count when correct plot touched but deselected': function() {
        var expressions = [
            {
                id: 'p1',
                expression: 'x+2',
                correctAnswer: true,
                selected: false,
                touched: true,
                variables: {},
                selectable: true
            }
        ];

        this.presenter.isActivity = true;
        this.plot.expressions = expressions;

        assertEquals(0, this.presenter.getErrorCount());
    },
    'test error count when 2 correct points selected': function() {
        var points = [
            {
                x: 1,
                y: 1,
                correct: true,
                touched: true,
                notScored: false,
                clickable: true
            }
        ];
        var selectedPoints = [
            {
                x: 1,
                y: 1,
                clickable: true
            }
        ];
        this.presenter.isActivity = true;
        this.plot.expressions = [];
        this.plot.points = points;
        this.plot.selectedPoints = selectedPoints;

        assertEquals(0, this.presenter.getErrorCount());
    },
    'test error count when 1 wrong point in defined points selected': function() {
        var points = [
            {
                x: 1,
                y: 1,
                correct: false,
                touched: true,
                notScored: false,
                clickable: true
            }
        ];
        var selectedPoints = [
            {
                x: 1,
                y: 1,
                clickable: true
            }
        ];
        this.presenter.isActivity = true;
        this.plot.expressions = [];
        this.plot.points = points;
        this.plot.selectedPoints = selectedPoints;

        assertEquals(1, this.presenter.getErrorCount());
    },
    'test error count when 1 wrong point selected': function() {
        var points = [
            {
                x: 1,
                y: 1,
                correct: false,
                touched: false,
                notScored: false,
                clickable: true
            }
        ];
        var selectedPoints = [
            {
                x: 2,
                y: 2,
                clickable: true
            }
        ];
        this.presenter.isActivity = true;
        this.plot.expressions = [];
        this.plot.points = points;
        this.plot.selectedPoints = selectedPoints;

        assertEquals(1, this.presenter.getErrorCount());
    },
    'test error count when correct point touched but deselected': function() {
        var points = [
            {
                x: 1,
                y: 1,
                correct: true,
                touched: true,
                notScored: false,
                clickable: true
            },
            {
                x: 2,
                y: 2,
                correct: true,
                touched: true,
                notScored: false,
                clickable: true
            }
        ];
        var selectedPoints = [
            {
                x: 2,
                y: 2,
                clickable: true
            }
        ];
        this.presenter.isActivity = true;
        this.plot.expressions = [];
        this.plot.points = points;
        this.plot.selectedPoints = selectedPoints;

        assertEquals(0, this.presenter.getErrorCount());
    },
});