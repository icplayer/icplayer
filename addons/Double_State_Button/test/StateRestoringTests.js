TestCase('[Double State Button] State restoring', {
    setUp : function() {
        this.presenter = AddonDouble_State_Button_create();
        this.presenter.configuration = {};

        sinon.stub(this.presenter, 'show');
        sinon.stub(this.presenter, 'hide');
        sinon.stub(this.presenter, 'setElementSelection');
        sinon.stub(this.presenter, 'toggleDisable');
    },

    tearDown : function() {
        this.presenter.show.restore();
        this.presenter.hide.restore();
        this.presenter.setElementSelection.restore();
        this.presenter.toggleDisable.restore();
    },

    'test after restoring state addon should be visible' : function() {
        this.presenter.setState(JSON.stringify({ isVisible: true, isSelected: true, isDisabled: true }));

        assertTrue(this.presenter.show.calledOnce);
        assertFalse(this.presenter.hide.calledOnce);

        assertTrue(this.presenter.toggleDisable.calledWith(true));

        assertTrue(this.presenter.setElementSelection.called);
        assertTrue(this.presenter.configuration.isSelected);

    },

    'test after restoring state addon should be hidden' : function() {
        this.presenter.setState(JSON.stringify({ isVisible: false, isSelected: false, isDisabled: false }));

        assertFalse(this.presenter.show.calledOnce);
        assertTrue(this.presenter.hide.calledOnce);

        assertTrue(this.presenter.toggleDisable.calledWith(false));

        assertTrue(this.presenter.setElementSelection.called);
        assertFalse(this.presenter.configuration.isSelected);
    },

    'test empty state' : function() {
        this.presenter.setState("");

        assertFalse(this.presenter.show.calledOnce);
        assertFalse(this.presenter.hide.calledOnce);
        assertFalse(this.presenter.toggleDisable.calledOnce);
        assertFalse(this.presenter.setElementSelection.calledOnce);
    }
});