TestCase('[Crossword] Visibility tests', {
    setUp: function () {
        this.presenter = Addoncrossword_create();

        this.model = {
            ID: "crossword1",
        }

        this.stubs = {
            initializeLogic: sinon.stub(),
            setVisibility: sinon.stub(),
        };

        this.presenter.initializeLogic = this.stubs.initializeLogic;
        this.presenter.setVisibility = this.stubs.setVisibility;

        this.view = document.createElement('div');
        this.presenter.$view = $(this.view);
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

    'test when in preview mode, setVisibility should be called with true': function () {
        this.generateConfiguration(true, false);

        this.createPreview();

        assertTrue(this.stubs.setVisibility.calledWith(true));
    },

    'test when in preview mode and addon is not visible, setVisibility should be called with true': function () {
        this.generateConfiguration(false, false);

        this.createPreview();

        assertTrue(this.stubs.setVisibility.calledWith(true));
    },

    'test when in preview mode and error in configuration, setVisibility should not be called': function () {
        this.generateConfiguration(undefined, true);

        this.createPreview();

        assertFalse(this.stubs.setVisibility.called);
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        this.generateConfiguration(true, false);

        this.run();

        assertTrue(this.stubs.setVisibility.calledWith(true));
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        this.generateConfiguration(false, false);

        this.run();

        assertTrue(this.stubs.setVisibility.calledWith(false));
    },

    'test when not in preview mode and error in configuration, setVisibility should not be called': function () {
        this.generateConfiguration(undefined, true);

        this.run();

        assertFalse(this.stubs.setVisibility.called);
    }
});
