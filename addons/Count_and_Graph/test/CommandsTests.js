TestCase("[Count_and_Graph] Show / hide commands", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();

        this.presenter.configuration = {
            isVisible: []
        };

        this.stubs = {
            setVisibility: sinon.stub(this.presenter, 'setVisibility')
        };
    },

    tearDown: function () {
        this.presenter.setVisibility.restore();
    },

    'test show validation': function () {
        this.presenter.show();

        assertTrue(this.stubs.setVisibility.calledWith(true));
        assertEquals(true, this.presenter.configuration.isVisible);
    },

    'test hide validation': function () {
        this.presenter.hide();

        assertTrue(this.stubs.setVisibility.calledWith(false));
        assertEquals(false, this.presenter.configuration.isVisible);
    }
});

TestCase("[Count_and_Graph] Show / hide answers", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        this.presenter.isShowAnswersActive = false;
        var _ = 1;
        var numberOfColumns = 2;

        this.divMock = {
            width: function () {return 500;},
            height: function () {return 500;}
        };

        this.presenter.graph = new this.presenter.graphObject(
            this.divMock, _, numberOfColumns, _, _, _, _, _, _, _, _, _, _, _, _, []
        );


        this.columns = [
            new this.presenter.columnObject(5, "red", _, _, 1),
            new this.presenter.columnObject(5, "red", _, _, 2)
        ];

        this.spies = this.getSpies(this.columns);

        this.presenter.graph._columns = this.columns;
        this.presenter.graph._columns[0]._topSelectedBarNumber = 3;
        this.presenter.graph._columns[1]._topSelectedBarNumber = 2;

        this.presenter.configuration = {
            isNotActivity: false
        };
    },

    getSpies: function (columns) {
        return {
            column1: {
                setOff: sinon.spy(columns[0], '_setOffBar'),
                setOn: sinon.spy(columns[0], '_setOnBar'),
                cleanSelection: sinon.spy(columns[0], 'cleanSelection'),
                showAnswer: sinon.spy(columns[0], 'showAnswer'),
                hideAnswer: sinon.spy(columns[0], 'hideAnswer'),
                block: sinon.spy(columns[0], 'block'),
                unblock: sinon.spy(columns[0], 'unblock'),
                drawCorrectAnswer: sinon.spy(columns[0], '_drawCorrectAnswer'),
                drawUserAnswer: sinon.spy(columns[0], '_drawUserAnswer')
            },

            column2: {
                setOff: sinon.spy(columns[1], '_setOffBar'),
                setOn: sinon.spy(columns[1], '_setOnBar'),
                cleanSelection: sinon.spy(columns[1], 'cleanSelection'),
                showAnswer: sinon.spy(columns[1], 'showAnswer'),
                hideAnswer: sinon.spy(columns[1], 'hideAnswer'),
                block: sinon.spy(columns[1], 'block'),
                unblock: sinon.spy(columns[1], 'unblock'),
                drawCorrectAnswer: sinon.spy(columns[1], '_drawCorrectAnswer'),
                drawUserAnswer: sinon.spy(columns[1], '_drawUserAnswer')
            },

            graph: {
                showAnswers: sinon.spy(this.presenter.graph, 'showAnswers'),
                hideAnswers: sinon.spy(this.presenter.graph, 'hideAnswers')
            }
        };

    },

    restoreColumn1Functions: function () {
        this.columns[0]._setOffBar.restore();
        this.columns[0]._setOnBar.restore();
        this.columns[0].cleanSelection.restore();
        this.columns[0].showAnswer.restore();
        this.columns[0].hideAnswer.restore();
        this.columns[0].block.restore();
        this.columns[0].unblock.restore();
        this.columns[0]._drawCorrectAnswer.restore();
        this.columns[0]._drawUserAnswer.restore();
    },

    restoreColumn2Functions: function () {
        this.columns[1]._setOffBar.restore();
        this.columns[1]._setOnBar.restore();
        this.columns[1].cleanSelection.restore();
        this.columns[1].showAnswer.restore();
        this.columns[1].hideAnswer.restore();
        this.columns[1].block.restore();
        this.columns[1].unblock.restore();
        this.columns[1]._drawCorrectAnswer.restore();
        this.columns[1]._drawUserAnswer.restore();
    },

    tearDown: function () {
        this.restoreColumn1Functions();
        this.restoreColumn2Functions();

        this.presenter.graph.showAnswers.restore();
        this.presenter.graph.hideAnswers.restore();
    },

    checkColumn1ShowAnswers: function () {
        assertTrue(this.spies.column1.cleanSelection.called);
        assertTrue(this.spies.column1.cleanSelection.calledBefore(this.spies.column1.drawCorrectAnswer));
        assertTrue(this.spies.column1.showAnswer.called);

        assertTrue(this.spies.column1.block.called);

        assertTrue(this.spies.column1.setOn.calledWith(0));
        assertEquals(1, this.spies.column1.setOn.callCount);
    },

    checkColumn2ShowAnswers: function () {
        assertTrue(this.spies.column2.cleanSelection.called);
        assertTrue(this.spies.column2.cleanSelection.calledBefore(this.spies.column2.drawCorrectAnswer));
        assertTrue(this.spies.column2.showAnswer.called);

        assertTrue(this.spies.column2.block.called);

        assertTrue(this.spies.column2.setOn.calledWith(0));
        assertTrue(this.spies.column2.setOn.calledWith(1));
        assertEquals(2, this.spies.column2.setOn.callCount);
    },

    checkColumn1HideAnswers: function () {
        assertTrue(this.spies.column1.cleanSelection.called);
        assertTrue(this.spies.column1.cleanSelection.calledBefore(this.spies.column1.drawUserAnswer));
        assertTrue(this.spies.column1.hideAnswer.called);
        assertTrue(this.spies.column1.unblock.called);


        assertTrue(this.spies.column1.setOn.calledWith(0));
        assertTrue(this.spies.column1.setOn.calledWith(1));
        assertTrue(this.spies.column1.setOn.calledWith(2));
        assertTrue(this.spies.column1.setOn.calledWith(3));
        assertEquals(4, this.spies.column1.setOn.callCount);
    },

    checkColumn2HideAnswers: function () {
        assertTrue(this.spies.column2.cleanSelection.called);
        assertTrue(this.spies.column2.cleanSelection.calledBefore(this.spies.column2.drawUserAnswer));
        assertTrue(this.spies.column2.hideAnswer.called);

        assertTrue(this.spies.column2.unblock.called);

        assertTrue(this.spies.column2.setOn.calledWith(0));
        assertTrue(this.spies.column2.setOn.calledWith(1));
        assertTrue(this.spies.column2.setOn.calledWith(2));
        assertEquals(3, this.spies.column2.setOn.callCount);
    },

    'test show answers validation': function () {
        this.presenter.showAnswers();

        assertTrue(this.spies.graph.showAnswers.called);

        this.checkColumn1ShowAnswers();
        this.checkColumn2ShowAnswers();
    },

    'test hide answers validation': function () {
        this.presenter.graph._isBlocked = true;
        this.presenter.isShowAnswersActive = true;
        this.presenter.hideAnswers();

        assertTrue(this.spies.graph.hideAnswers.called);

        this.checkColumn1HideAnswers();
        this.checkColumn2HideAnswers();
    }
});