TestCase('[Crossword] Visibility tests', {
    setUp: function () {
        this.presenter = Addoncrossword_create();

        this.model = {
            ID: "crossword1",
        };

        sinon.stub(this.presenter, 'initializeLogic');
        sinon.stub(this.presenter, 'setVisibility');

        this.view = document.createElement('div');
        this.presenter.$view = $(this.view);
    },

    tearDown: function() {
        this.presenter.initializeLogic.restore();
        this.presenter.setVisibility.restore();
    },

    generateConfiguration: function(isVisible, isError) {
        this.presenter.configuration  = {
            isVisibleByDefault: isVisible,
            isError: isError,
        }
    },

    run: function() {
        this.presenter.run(this.view, this.model);
    },

    createPreview: function() {
        this.presenter.createPreview(this.view, this.model);
    },

    'test given model with visibility set to true when in preview mode then setVisibility should be called with true': function () {
        this.generateConfiguration(true, false);

        this.createPreview();

        assertTrue(this.presenter.setVisibility.calledWith(true));
    },

    'test given model with visibility set to false when in preview mode then setVisibility should be called with true': function () {
        this.generateConfiguration(false, false);

        this.createPreview();

        assertTrue(this.presenter.setVisibility.calledWith(true));
    },

    'test given error in configuration when in preview mode then setVisibility should not be called': function () {
        this.generateConfiguration(undefined, true);

        this.createPreview();

        assertFalse(this.presenter.setVisibility.called);
    },

    'test given model with visibility set to true when not in preview mode then setVisibility should be called with true': function () {
        this.generateConfiguration(true, false);

        this.run();

        assertTrue(this.presenter.setVisibility.calledWith(true));
    },

    'test given model with visibility set to false when not in preview mode then setVisibility should be called with false': function () {
        this.generateConfiguration(false, false);

        this.run();

        assertTrue(this.presenter.setVisibility.calledWith(false));
    },

    'test given error in configuration when not in preview mode then setVisibility should not be called': function () {
        this.generateConfiguration(undefined, true);

        this.run();

        assertFalse(this.presenter.setVisibility.called);
    }
});
