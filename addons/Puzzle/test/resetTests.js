TestCase("[Puzzle] reset", {

    setUp: function() {
        this.presenter = AddonPuzzle_create();

        this.presenter.runEndedDeferred = new $.Deferred();
        this.presenter.runEnded = this.presenter.runEndedDeferred.promise();

        this.stubs = {
            hide: sinon.stub(),
            show: sinon.stub(),
            shuffle: sinon.stub(),
        };
        this.presenter.hide = this.stubs.hide;
        this.presenter.show = this.stubs.show;
        this.presenter.shuffle = this.stubs.shuffle;

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

    emulateEndOfInitialization: function() {
        this.presenter.runEndedDeferred.resolve();
        this.presenter.resolveDeferredCommandQueue();
    },

    'test given initialized addon when executing reset then shuffle should be called': function () {
        this.setUpAddonAsInitialized();

        this.presenter.reset();

        assertTrue(this.stubs.shuffle.calledOnce);
    },

    'test given not initialized addon when executing reset then shuffle should not be called': function () {
        this.setUpAddonAsNotInitialized();

        this.presenter.reset();

        assertFalse(this.stubs.shuffle.called);
    },

    'test given not initialized addon when executing reset then shuffle should be called after initialization': function () {
        this.setUpAddonAsNotInitialized();

        this.presenter.reset();

        assertFalse(this.stubs.shuffle.called);

        this.emulateEndOfInitialization();

        assertTrue(this.stubs.shuffle.calledOnce);
    },

    'test given initialized and not visible by default addon when executing reset then hide should be called': function () {
        this.setUpAddonAsInitialized();
        this.presenter.configuration.isVisibleByDefault = false;
        this.presenter.configuration.isVisible = true;

        this.presenter.reset();

        assertTrue(this.stubs.hide.calledOnce);
    },

    'test given not initialized and not visible by default addon when executing reset then hide should not be called': function () {
        this.setUpAddonAsNotInitialized();
        this.presenter.configuration.isVisibleByDefault = false;
        this.presenter.configuration.isVisible = true;

        this.presenter.reset();

        assertFalse(this.stubs.hide.called);
    },

    'test given not initialized and not visible by default addon when executing reset then hide should be called after initialization': function () {
        this.setUpAddonAsNotInitialized();
        this.presenter.configuration.isVisibleByDefault = false;
        this.presenter.configuration.isVisible = true;

        this.presenter.reset();

        assertFalse(this.stubs.hide.called);

        this.emulateEndOfInitialization();

        assertTrue(this.stubs.hide.calledOnce);
    },

    'test given initialized and visible by default addon when executing reset then show should be called': function () {
        this.setUpAddonAsInitialized();
        this.presenter.configuration.isVisibleByDefault = true;
        this.presenter.configuration.isVisible = false;

        this.presenter.reset();

        assertTrue(this.stubs.show.calledOnce);
    },

    'test given not initialized and visible by default addon when executing reset then show should not be called': function () {
        this.setUpAddonAsNotInitialized();
        this.presenter.configuration.isVisibleByDefault = true;
        this.presenter.configuration.isVisible = false;

        this.presenter.reset();

        assertFalse(this.stubs.show.called);
    },

    'test given not initialized and visible by default addon when executing reset then show should be called after initialization': function () {
        this.setUpAddonAsNotInitialized();
        this.presenter.configuration.isVisibleByDefault = true;
        this.presenter.configuration.isVisible = false;

        this.presenter.reset();

        assertFalse(this.stubs.show.called);

        this.emulateEndOfInitialization();

        assertTrue(this.stubs.show.calledOnce);
    },

});
