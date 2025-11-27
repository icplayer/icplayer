TestCase("[Puzzle] setState", {

    setUp: function() {
        this.presenter = AddonPuzzle_create();

        this.presenter.runEndedDeferred = new $.Deferred();
        this.presenter.runEnded = this.presenter.runEndedDeferred.promise();

        this.stubs = {
            prepareBoardFromSavedState: sinon.stub(),
            hide: sinon.stub(),
            show: sinon.stub(),
        };
        this.presenter.prepareBoardFromSavedState = this.stubs.prepareBoardFromSavedState;
        this.presenter.hide = this.stubs.hide;
        this.presenter.show = this.stubs.show;

        this.notStringifyStateExample = {
            "visible":true,
            "board":[
                {"row":0,"col":0,"position":"0-1"},
                {"row":0,"col":1,"position":"0-0"},
                {"row":0,"col":2,"position":"0-2"},
                {"row":1,"col":0,"position":"1-1"},
                {"row":1,"col":1,"position":"1-0"},
                {"row":1,"col":2,"position":"1-2"}
            ],
            "shouldCalcScore":true,
            "score":0,
            "errors":4
        }
        this.stateExample = JSON.stringify(this.notStringifyStateExample);
        this.presenter.configuration = {
            isVisible: false,
            isVisibleByDefault: false,
            shouldCalcScore: false,
            isNotActivity: false
        };
    },

    tearDown: function () {
        if (!this.presenter.runEndedDeferred.isResolved()) {
            this.presenter.runEndedDeferred.reject();
        }
    },

    setUpAddonAsInitialized: function () {
        this.presenter.runEndedDeferred.resolve();
    },

    setUpAddonAsNotInitialized: function () {
        // Do nothing, addon is not initialized by default
    },

    'test given initialized addon when executing setState with undefined then do nothing': function () {
        this.setUpAddonAsInitialized();

        this.presenter.setState(undefined);

        assertFalse(this.stubs.prepareBoardFromSavedState.called);
    },

    'test given not initialized addon when executing setState with undefined then do nothing': function () {
        this.setUpAddonAsNotInitialized();

        this.presenter.setState(undefined);

        assertFalse(this.stubs.prepareBoardFromSavedState.called);
    },

    'test given initialized addon when executing setState with empty string then do nothing': function () {
        this.setUpAddonAsInitialized();

        this.presenter.setState('');

        assertFalse(this.stubs.prepareBoardFromSavedState.called);
    },

    'test given not initialized addon when executing setState with empty string then do nothing': function () {
        this.setUpAddonAsNotInitialized();

        this.presenter.setState('');

        assertFalse(this.stubs.prepareBoardFromSavedState.called);
    },

    'test given initialized addon when executing setState with correct state then call method to initialize board should be called': function () {
        this.setUpAddonAsInitialized();

        this.presenter.setState(this.stateExample);

        assertTrue(this.stubs.prepareBoardFromSavedState.calledOnce);
    },

    'test given not initialized addon when executing setState with correct state then do not call method to initialize board should be called': function () {
        this.setUpAddonAsNotInitialized();

        this.presenter.setState(this.stateExample);

        assertFalse(this.stubs.prepareBoardFromSavedState.called);
    },

    'test given not initialized addon when executing setState with correct state then call method to initialize board should be called after initialization ends': function () {
        this.setUpAddonAsNotInitialized();

        this.presenter.setState(this.stateExample);
        this.setUpAddonAsInitialized();

        assertTrue(this.stubs.prepareBoardFromSavedState.calledOnce);
    },

    'test given initialized addon when executing setState with state of invisible addon then call method hide should be called': function () {
        this.setUpAddonAsInitialized();
        this.notStringifyStateExample.visible = false;
        this.stateExample = JSON.stringify(this.notStringifyStateExample);

        this.presenter.setState(this.stateExample);

        assertTrue(this.stubs.hide.calledOnce);
    },

    'test given initialized addon when executing setState with state of visible addon then call method show should be called': function () {
        this.setUpAddonAsInitialized();
        this.notStringifyStateExample.visible = true;
        this.stateExample = JSON.stringify(this.notStringifyStateExample);

        this.presenter.setState(this.stateExample);

        assertTrue(this.stubs.show.calledOnce);
    },

    'test given not initialized addon when executing setState with correct state then call method getState should return given arg from setState': function () {
        this.setUpAddonAsNotInitialized();

        this.presenter.setState(this.stateExample);

        assertEquals(this.stateExample, this.presenter.getState());
    },

    'test given not initialized addon when executing setState and getScore then score should be equal to score from state': function () {
        this.setUpAddonAsNotInitialized();
        this.notStringifyStateExample.score = 1;
        this.notStringifyStateExample.errors = 0;
        this.stateExample = JSON.stringify(this.notStringifyStateExample);

        this.presenter.setState(this.stateExample);
        const score = this.presenter.getScore();

        assertEquals(score, 1);
    },

    'test given not initialized addon when executing setState and getErrors then errors number should be equal to errors number from state': function () {
        this.setUpAddonAsNotInitialized();
        this.notStringifyStateExample.score = 0;
        this.notStringifyStateExample.errors = 3;
        this.stateExample = JSON.stringify(this.notStringifyStateExample);

        this.presenter.setState(this.stateExample);
        const errors = this.presenter.getErrorCount();

        assertEquals(errors, 3);
    }

});
