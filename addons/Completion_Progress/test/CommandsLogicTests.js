TestCase("Commands logic - hide/show", {
    setUp : function() {
        this.presenter = AddonCompletion_Progress_create();
        sinon.stub(this.presenter, 'setVisibility');
        this.presenter.configuration = {};
    },

    tearDown : function() {
        this.presenter.setVisibility.restore();
    },

    'test show command' : function() {
        this.presenter.show();

        assertTrue(this.presenter.setVisibility.calledOnce);
        assertTrue(this.presenter.configuration.isVisible);
    },

    'test hide command' : function() {
        this.presenter.hide();

        assertTrue(this.presenter.setVisibility.calledOnce);
        assertFalse(this.presenter.configuration.isVisible);
    }
});

TestCase("Commands logic - get/set progress", {
    setUp : function() {
        this.presenter = AddonCompletion_Progress_create();

        sinon.stub(this.presenter, 'updateProgressUI');

        this.presenter.configuration = {};
    },

    tearDown : function() {
        this.presenter.updateProgressUI.restore();
    },

    'test get progress command' : function() {
        this.presenter.currentProgress = 55;

        assertEquals(55, this.presenter.getProgress());
    },

    'test set valid progress' : function() {
        this.presenter.currentProgress = 55;

        this.presenter.setProgress(65);

        assertEquals(65, this.presenter.currentProgress);
        assertTrue(this.presenter.updateProgressUI.calledWith(65));
    },

    'test set invalid progress' : function() {
        this.presenter.currentProgress = 55;

        this.presenter.setProgress(102);

        assertEquals(55, this.presenter.currentProgress);
        assertFalse(this.presenter.updateProgressUI.called);
    },

    'test set non-numerical progress' : function() {
        this.presenter.currentProgress = 55;

        this.presenter.setProgress('aaa');

        assertEquals(55, this.presenter.currentProgress);
        assertFalse(this.presenter.updateProgressUI.called);
    },

    'test set valid progress via command' : function() {
        this.presenter.currentProgress = 55;

        this.presenter.setProgressCommand(['65']);

        assertEquals(65, this.presenter.currentProgress);
        assertTrue(this.presenter.updateProgressUI.calledWith(65));
    }
});
