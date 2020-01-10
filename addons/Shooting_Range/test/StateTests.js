TestCase("[Shooting_Range - state tests] set state", {
    setUp: function () {
        this.presenter = AddonShooting_Range_create();

        this.mocks = {
            level1: {
                getElapsedTime: sinon.spy(),
                getClicked: sinon.spy(),
                destroy: sinon.spy(),
                start: sinon.spy(),
                setElapsedTime: sinon.spy(),
                setClicked: sinon.spy(),
                actualize: sinon.spy(),
                pause: sinon.spy()
            },
            level2: {
                getElapsedTime: sinon.spy(),
                getClicked: sinon.spy(),
                destroy: sinon.spy(),
                start: sinon.spy(),
                setElapsedTime: sinon.spy(),
                setClicked: sinon.spy(),
                actualize: sinon.spy(),
                pause: sinon.spy()
            }

        };
        this.presenter.state.levels = [this.mocks.level1, this.mocks.level2];
        this.presenter.state.$answersWrapper = {
            css: sinon.spy()
        };

        this.presenter.state.$questionDiv = {
            height: sinon.spy()
        };

        this.presenter.state.$levelDiv = {
            height: sinon.spy()
        };

        this.presenter.state.$view = {
            height: sinon.spy(),
            css: sinon.spy()
        };

        this.presenter.state.actualLevel = 0;

        this.state1 = "{\"actualLevel\":1,\"actualLevelTimeElapsed\":23,\"isFinished\":false,\"isVisible\":false,\"score\":5,\"wholeErrorCount\": 2,\"errorCount\":2,\"clickedElements\":[1,2], \"isStarted\":true, \"resultsList\":[{\"score\":3,\"errors\":4},{\"score\":2,\"errors\":4}]}";
        this.state2 = "{\"actualLevel\":1,\"actualLevelTimeElapsed\":2000,\"isFinished\":true,\"isVisible\":false,\"score\":5,\"wholeErrorCount\": 2,\"errorCount\":2,\"clickedElements\":[1,2], \"isStarted\":true, \"resultsList\":[{\"score\":3,\"errors\":4},{\"score\":2,\"errors\":4}]}";

    },

    'test setState will properly set actual level': function () {
        this.presenter.setState(this.state1);

        assertTrue(this.mocks.level1.destroy.calledOnce);
        assertEquals(1, this.presenter.state.actualLevel);
        assertTrue(this.mocks.level2.start.calledOnce);
        assertEquals(23, this.mocks.level2.start.getCall(0).args[0]);
        assertEquals([1,2], this.mocks.level2.start.getCall(0).args[1]);
        assertTrue(this.mocks.level2.actualize.calledOnce);
        assertTrue(this.mocks.level2.pause.calledOnce);
        assertTrue(this.mocks.level2.pause.getCall(0).args[0]);
        assertEquals([{"score":3,"errors":4},{"score":2,"errors":4}], this.presenter.state.resultsList);
    },

    'test set score and errorCount': function () {
        this.presenter.setState(this.state1);

        assertEquals(5, this.presenter.state.score);
        assertEquals(2, this.presenter.state.errorCount);
    },

    'test set isVisible': function () {
        this.presenter.state.isVisible = true;

        this.presenter.setState(this.state1);

        assertFalse(this.presenter.state.isVisible)
    },

    'test if is finished then level should be finished': function () {
        this.presenter.setState(this.state2);

        assertTrue(this.mocks.level2.destroy.calledOnce);
        assertEquals(2, this.presenter.state.actualLevel);
    },

    'test given results in state field and level was finished when calling set state then set the results to the addon state': function () {
        this.presenter.setState(this.state2);

        assertEquals([
            {"score":3,"errors":4},
            {"score":2,"errors":4}
        ], this.presenter.state.resultsList);
    },

    'test given finished as true in state field when calling set state then the addon wont call actualize and pause methods': function () {
        this.presenter.setState(this.state2);

        assertTrue(this.mocks.level2.actualize.notCalled);
        assertTrue(this.mocks.level2.pause.notCalled);
    }
});

TestCase("[Shooting_Range - state tests] get state", {
    setUp: function () {
        this.presenter = AddonShooting_Range_create();
        this.presenter.state.errorCount = 2;
        this.presenter.state.score = 5;

        this.mocks = {
            level1: {
                getElapsedTime: sinon.stub(),
                getClicked: sinon.stub(),
                getCorrected: sinon.stub(),
                getWronged: sinon.stub(),
            }
        };

        this.mocks.level1.getElapsedTime.returns(23);
        this.mocks.level1.getClicked.returns([1,2]);

        this.presenter.state.levels = [this.mocks.level1];
    },

    'test getState returns score and errorCount': function () {
        this.presenter.state.actualLevel = 2;
        this.presenter.state.levels = [];

        var state = JSON.parse(this.presenter.getState());

        assertEquals(2, state.errorCount);
        assertEquals(5, state.score);
    },

    'test if actual level is above available then getState returns finished': function () {
        this.presenter.state.actualLevel = 2;
        this.presenter.state.levels = [];

        var state = JSON.parse(this.presenter.getState());

        assertTrue(state.isFinished);
    },

    'test getState returns indexes of clicked elements in last level': function () {
        this.presenter.state.actualLevel = 0;

        var state = JSON.parse(this.presenter.getState());

        assertEquals([1,2], state.clickedElements);
    },

    'test getState returns last level elapsed time': function () {
        this.presenter.state.actualLevel = 0;

        var state = JSON.parse(this.presenter.getState());

        assertEquals(23, state.actualLevelTimeElapsed);
    },

    'test getState returns actual level index': function () {
        this.presenter.state.actualLevel = 0;

        var state = JSON.parse(this.presenter.getState());
        assertEquals(0, state.actualLevel);
    }


});
