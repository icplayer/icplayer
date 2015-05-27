TestCase('[Text Selection] States restoring', {
    setUp : function() {
        this.presenter = AddonText_Selection_create();
        this.presenter.configuration = {
            isExerciseStarted: false,
            isActivity: true
        };
        this.presenter.markers = {
            markedCorrect: [],
            markedWrong: []
        };

        sinon.stub(this.presenter, 'show');
        sinon.stub(this.presenter, 'hide');
        sinon.stub(this.presenter, 'turnOffEventListeners');
        sinon.stub(this.presenter, 'sendEvent');
    },

    tearDown : function() {
        this.presenter.show.restore();
        this.presenter.hide.restore();
        this.presenter.turnOffEventListeners.restore();
    },

    'test set state to visible' : function() {
        this.presenter.setState(JSON.stringify({ numbers: [], isVisible: true }));

        assertTrue(this.presenter.show.calledOnce);
        assertFalse(this.presenter.hide.calledOnce);

        assertTrue(this.presenter.configuration.isVisible);
    },

    'test set state to invisible' : function() {
        this.presenter.setState(JSON.stringify({ numbers: [], isVisible: false }));

        assertFalse(this.presenter.show.calledOnce);
        assertTrue(this.presenter.hide.calledOnce);

        assertFalse(this.presenter.configuration.isVisible);
    },

    'test set state called on empty state' : function() {
        this.presenter.setState("");

        assertFalse(this.presenter.show.calledOnce);
        assertFalse(this.presenter.hide.calledOnce);
    },

    'test scoring blocked' : function() {
        var isStarted = this.presenter.configuration.isExerciseStarted;

        this.presenter.setShowErrorsMode();

        assertTrue(this.presenter.turnOffEventListeners.calledOnce);
        assertFalse(isStarted);
    },

    'test scoring available' : function() {
        this.presenter.$view = $('<div><div class="text_selection"></div></div>');
        this.presenter.$view.find('.text_selection').append($('<span number="4" class="selectable">a</span>'));

        this.presenter.turnOnEventListeners();

        this.presenter.$view.find('.selectable').trigger('mouseup');

        var isStarted = this.presenter.configuration.isExerciseStarted;

        this.presenter.setShowErrorsMode();

        assertTrue(this.presenter.turnOffEventListeners.calledOnce);
        assertTrue(isStarted);
    }
});