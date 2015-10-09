TestCase("[Count_and_Graph] Max score", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var divMock = {
            width: function () {return 500;},
            height: function () {return 500;}
        };
        var _ = 1;

        this.presenter.graph = new this.presenter.graphObject(divMock, _, [1, 2, 3, 4, 5], _, _, _, _, _, _, _, _, _, _);
        this.presenter.configuration = {
            isNotActivity: false
        };

    },

    'test max score should be equal to number of columns in graph': function () {
        var validationResult = this.presenter.getMaxScore();

        assertEquals(5, validationResult);
    }
});

TestCase("[Count_and_Graph] Score", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var _ = 1;
        var mockDiv = {
            width: function () {return 500;},
            height: function () {return 500;}
        };

        this.presenter.graph = new this.presenter.graphObject(mockDiv, _, _, _, _, _, _, _, _, _, _, _);
        this.column1 = new this.presenter.columnObject(_, _, _, _, 1);
        this.column2 = new this.presenter.columnObject(_, _, _, _, 2);
        this.column3 = new this.presenter.columnObject(_, _, _, _, 3);

        this.presenter.graph._columns = [this.column1, this.column2, this.column3];

        this.spies = {
            getScoreColumn1: sinon.spy(this.column1, 'getScore'),
            getScoreColumn2: sinon.spy(this.column2, 'getScore'),
            getScoreColumn3: sinon.spy(this.column3, 'getScore')
        };

        this.presenter.configuration = {
            isNotActivity: false
        };
    },

    tearDown: function () {
        this.column1.getScore.restore();
        this.column2.getScore.restore();
        this.column3.getScore.restore();
    },

    'test all columns marked correctly': function () {
        this.column1._topSelectedBarNumber = 0;
        this.column2._topSelectedBarNumber = 1;
        this.column3._topSelectedBarNumber = 2;

        var validatedScore = this.presenter.getScore();

        assertEquals(3, validatedScore);
        assertTrue(this.spies.getScoreColumn1.called);
        assertTrue(this.spies.getScoreColumn2.called);
        assertTrue(this.spies.getScoreColumn3.called);
    },

    'test no column marked correctly': function () {
        this.column1._topSelectedBarNumber = 3;
        this.column2._topSelectedBarNumber = 2;
        this.column3._topSelectedBarNumber = 1;

        var validatedScore = this.presenter.getScore();

        assertEquals(0, validatedScore);
        assertTrue(this.spies.getScoreColumn1.called);
        assertTrue(this.spies.getScoreColumn2.called);
        assertTrue(this.spies.getScoreColumn3.called);
    },

    'test some columns marked correctly': function () {
        this.column1._topSelectedBarNumber = 0;
        this.column2._topSelectedBarNumber = 0;
        this.column3._topSelectedBarNumber = 2;

        var validatedScore = this.presenter.getScore();

        assertEquals(2, validatedScore);
        assertTrue(this.spies.getScoreColumn1.called);
        assertTrue(this.spies.getScoreColumn2.called);
        assertTrue(this.spies.getScoreColumn3.called);
    }
});

TestCase("[Count_and_Graph] Error count", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var _ = 1;
        var divMock = {
            width: function () {return 500;},
            height: function () {return 500;}
        };

        this.presenter.graph = new this.presenter.graphObject(divMock, 5 , [1, 2, 3], _, _, _, _, _, _, _, _, _);
        this.column1 = new this.presenter.columnObject(_, _, _, _, 1);
        this.column2 = new this.presenter.columnObject(_, _, _, _, 2);
        this.column3 = new this.presenter.columnObject(_, _, _, _, 3);

        this.presenter.graph._columns = [this.column1, this.column2, this.column3];

        sinon.stub(this.presenter.graph, 'isAttempted');
        this.presenter.configuration = {
            isNotActivity: false
        };
    },

    'test when all columns marked correctly it should be 0': function () {
        this.column1._topSelectedBarNumber = 0;
        this.column2._topSelectedBarNumber = 1;
        this.column3._topSelectedBarNumber = 2;

        assertEquals(0, this.presenter.getErrorCount());
    },

    'test should be sum of length of every wrongly marked column': function () {
        this.column1._topSelectedBarNumber = -1;
        this.column2._topSelectedBarNumber = 1;
        this.column3._topSelectedBarNumber = -1;

        this.presenter.graph.isAttempted.returns(true);

        assertEquals(2, this.presenter.getErrorCount());
    },

    'test when addon is attempted': function () {
        this.column1._topSelectedBarNumber = 2;
        this.column2._topSelectedBarNumber = 4;
        this.column3._topSelectedBarNumber = 3;

        this.presenter.graph.isAttempted.returns(true);

        assertEquals(3, this.presenter.getErrorCount());
    },
    'test when addon is not attempted': function () {
        this.column1._topSelectedBarNumber = -1;
        this.column2._topSelectedBarNumber = 1;
        this.column3._topSelectedBarNumber = -1;

        this.presenter.graph.isAttempted.returns(false);

        assertEquals(0, this.presenter.getErrorCount());
    }
});