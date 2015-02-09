TestCase('[Single State Button] States restoring', {
    setUp : function() {
        this.presenter = AddonSingle_State_Button_create();
        this.presenter.configuration = {};

        sinon.stub(this.presenter, 'show');
        sinon.stub(this.presenter, 'hide');
        sinon.stub(this.presenter, 'toggleDisable');
    },

    tearDown : function() {
        this.presenter.show.restore();
        this.presenter.hide.restore();
        this.presenter.toggleDisable.restore();
    },

    'test set state to visible' : function() {
        this.presenter.setState(JSON.stringify({ "isDisabled" : true, "isVisible" : true }));

        assertTrue(this.presenter.show.calledOnce);
        assertFalse(this.presenter.hide.calledOnce);
        assertTrue(this.presenter.toggleDisable.calledOnce);

        assertTrue(this.presenter.configuration.isDisabled);
        assertTrue(this.presenter.configuration.isVisible);
    },

    'test set state to invisible' : function() {
        this.presenter.setState(JSON.stringify({ "isDisabled" : true, "isVisible" : false }));

        assertFalse(this.presenter.show.calledOnce);
        assertTrue(this.presenter.hide.calledOnce);
        assertTrue(this.presenter.toggleDisable.calledOnce);

        assertTrue(this.presenter.configuration.isDisabled);
        assertFalse(this.presenter.configuration.isVisible);
    },

    'test set state to invisible and disable on false' : function() {
        this.presenter.setState(JSON.stringify({ "isDisabled" : false, "isVisible" : false }));

        assertFalse(this.presenter.show.calledOnce);
        assertTrue(this.presenter.hide.calledOnce);
        assertTrue(this.presenter.toggleDisable.calledOnce);

        assertFalse(this.presenter.configuration.isDisabled);
        assertFalse(this.presenter.configuration.isVisible);
    },

    'test set state called on empty state' : function() {
        this.presenter.setState("");

        assertFalse(this.presenter.show.calledOnce);
        assertFalse(this.presenter.hide.calledOnce);
        assertFalse(this.presenter.toggleDisable.calledOnce);
    }
});