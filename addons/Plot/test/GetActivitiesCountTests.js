TestCase("[Plot] getActivitiesCount function", {
    setUp: function () {
        this.presenter = AddonPlot_create();
        this.plot = this.presenter.getPlot();
        this.presenter.isActivity = true;
    },

    createExpressions: function () {
        this.plot.expressions = [
            {
                id: 'p2',
                expression: 'x+2',
                correctAnswer: false,
                selected: true,
                touched: true,
                variables: {},
                selectable: true
            },
            {
                id: 'p1',
                expression: 'x+3',
                correctAnswer: true,
                selected: true,
                touched: true,
                variables: {},
                selectable: true
            }
        ];
    },

    createPoints: function () {
        this.plot.points = [
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
                y: 1,
                correct: false,
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
    },

    'test given not active addon then return 0': function () {
        this.presenter.isActivity = false;
        this.createExpressions();
        this.createPoints();

        assertEquals(0, this.presenter.getActivitiesCount());
    },

    'test given addon with correct points then return number of correct points': function () {
        this.createPoints();

        assertEquals(2, this.presenter.getActivitiesCount());
    },

    'test given addon with correct expressions then return number of correct expressions': function () {
        this.createExpressions();

        assertEquals(1, this.presenter.getActivitiesCount());
    },

    'test given addon with correct points and expressions then return sum of correct points and expressions': function () {
        this.createPoints();
        this.createExpressions();

        assertEquals(3, this.presenter.getActivitiesCount());
    }
});
