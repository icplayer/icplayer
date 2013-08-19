TestCase('[Text Selection] States restoring', {
    setUp : function() {
        this.presenter = AddonText_Selection_create();
        this.presenter.configuration = {};

        sinon.stub(this.presenter, 'show');
        sinon.stub(this.presenter, 'hide');
    },

    tearDown : function() {
        this.presenter.show.restore();
        this.presenter.hide.restore();
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
    }
});