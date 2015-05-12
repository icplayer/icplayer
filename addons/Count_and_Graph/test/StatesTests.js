TestCase("[Count_and_Graph] Get/set state", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        this.presenter.isShowAnswersActive = false;
        this.presenter.configuration = {
            isVisible: true
        };

        var divMock = {
            width: function () {return 500;},
            height: function () {return 500;}
        };

        var _ = 1;
        var axisYMax = 10;

        this.presenter.graph = new this.presenter.graphObject(divMock, axisYMax, _, _, _, _, _, _, _, _, _, _);
        this.column1 = new this.presenter.columnObject(axisYMax, _, _, _, _, _);
        this.column2 = new this.presenter.columnObject(axisYMax, _, _, _, _, _);
        this.column3 = new this.presenter.columnObject(axisYMax, _, _, _, _, _);
        this.expectedColumnsPositions = [2, 0, 4];
        this.presenter.graph._columns = [this.column1, this.column2, this.column3];

        this.column1._topSelectedBarNumber = 1;
        this.column2._topSelectedBarNumber = -1;
        this.column3._topSelectedBarNumber = 3;

        this.stubs = {
            hideAnswers: sinon.stub(this.presenter, 'hideAnswers'),
            setVisibility: sinon.stub(this.presenter, 'setVisibility')
        };

        this.validState = JSON.stringify({
            isVisible: true,
            selected: [1, 1, 1]
        });
    },

    tearDown: function () {
        this.presenter.hideAnswers.restore();
        this.presenter.setVisibility.restore();
    },

    'test get state should hide answers if are showed': function () {
        this.presenter.isShowAnswersActive = true;

        this.presenter.getState();

        assertTrue(this.stubs.hideAnswers.called);
    },

    'test get state shouldnt hide answers if they are not showed': function () {
        this.presenter.isShowAnswersActive = false;

        this.presenter.getState();

        assertFalse(this.stubs.hideAnswers.called);
    },

    'test set state should hide answers if are showed': function () {
        this.presenter.isShowAnswersActive = true;

        this.presenter.setState(this.validState);

        assertTrue(this.stubs.hideAnswers.called);
    },

    'test set state shouldnt hide answers if are not showed': function () {
        this.presenter.isShowAnswersActive = false;

        this.presenter.setState(this.validState);

        assertFalse(this.stubs.hideAnswers.called);
    },

    'test get state validation': function () {
        var validationResult = JSON.parse(this.presenter.getState());

        assertTrue(validationResult.isVisible);
        assertEquals(3, validationResult.selected.length);
        assertEquals(this.expectedColumnsPositions, validationResult.selected);
    },

    'test set state validation': function () {
        var state = {
            selected: [2, 0, 4],
            isVisible: true
        };

        this.presenter.configuration.isVisible = false;
        this.presenter.setState(JSON.stringify(state));

        assertTrue(this.presenter.configuration.isVisible);
        assertEquals(1, this.column1._topSelectedBarNumber);
        assertEquals(-1, this.column2._topSelectedBarNumber);
        assertEquals(3, this.column3._topSelectedBarNumber);

        assertTrue(this.stubs.setVisibility.called);
        assertTrue(this.stubs.setVisibility.getCall(0).args[0]);
    }
});