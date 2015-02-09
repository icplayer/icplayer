TestCase('[Single State Button] Reset command', {
    setUp : function() {
        this.presenter = AddonSingle_State_Button_create();
        this.presenter.$view = $('<div></div>');
        this.presenter.configuration = {};

        sinon.stub(this.presenter, 'show');
        sinon.stub(this.presenter, 'hide');
    },

    tearDown : function() {
        this.presenter.show.restore();
        this.presenter.hide.restore();
    },

    'test reset command invisible to invisible' : function() {
        this.presenter.configuration.isVisibleByDefault = false;
        this.presenter.configuration.isVisible = false;

        this.presenter.reset();

        assertFalse(this.presenter.configuration.isVisible);
        assertFalse(this.presenter.show.calledOnce);
        assertTrue(this.presenter.hide.calledOnce);
        assertFalse(this.presenter.configuration.isErrorMode);
    },

    'test reset command invisible to visible' : function() {
        this.presenter.configuration.isVisibleByDefault = true;
        this.presenter.configuration.isVisible = false;

        this.presenter.reset();

        assertTrue(this.presenter.configuration.isVisible);
        assertTrue(this.presenter.show.calledOnce);
        assertFalse(this.presenter.hide.calledOnce);
        assertFalse(this.presenter.configuration.isErrorMode);
    },

    'test reset command visible to invisible' : function() {
        this.presenter.configuration.isVisibleByDefault = false;
        this.presenter.configuration.isVisible = true;

        this.presenter.reset();

        assertFalse(this.presenter.configuration.isVisible);
        assertFalse(this.presenter.show.calledOnce);
        assertTrue(this.presenter.hide.calledOnce);
        assertFalse(this.presenter.configuration.isErrorMode);
    },

    'test reset command visible to visible' : function() {
        this.presenter.configuration.isVisibleByDefault = true;
        this.presenter.configuration.isVisible = true;

        this.presenter.reset();

        assertTrue(this.presenter.configuration.isVisible);
        assertTrue(this.presenter.show.calledOnce);
        assertFalse(this.presenter.hide.calledOnce);
        assertFalse(this.presenter.configuration.isErrorMode);
    }
});