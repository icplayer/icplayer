TestCase("Commands logic - hide/show", {
    setUp : function() {
        this.presenter = AddonLesson_Error_Counter_create();

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
