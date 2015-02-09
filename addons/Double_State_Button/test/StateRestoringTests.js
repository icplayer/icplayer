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

    'test set state to isVisible' : function() {
        this.presenter.setState(JSON.stringify({ isVisible: true, isSelected: true, isDisabled: true }));

        assertTrue(this.presenter.show.calledOnce);
        assertFalse(this.presenter.hide.calledOnce);
        assertTrue(this.presenter.toggleDisable.calledOnce);
        assertTrue(this.presenter.setElementSelection.calledOnce);

        assertTrue(this.presenter.configuration.isVisible);
        assertTrue(this.presenter.configuration.isSelected);
        assertTrue(this.presenter.configuration.isVisible);
    },

    'test set state to isVisible and not selected' : function() {
        this.presenter.setState(JSON.stringify({ isVisible: true, isSelected: false, isDisabled: true }));

        assertTrue(this.presenter.show.calledOnce);
        assertFalse(this.presenter.hide.calledOnce);
        assertTrue(this.presenter.toggleDisable.calledOnce);
        assertTrue(this.presenter.setElementSelection.calledOnce);

        assertTrue(this.presenter.configuration.isVisible);
        assertFalse(this.presenter.configuration.isSelected);
        assertTrue(this.presenter.configuration.isDisabled);
    },

    'test set state to invisible' : function() {
        this.presenter.setState(JSON.stringify({ isVisible: false, isSelected: true, isDisabled: true }));

        assertFalse(this.presenter.show.calledOnce);
        assertTrue(this.presenter.hide.calledOnce);
        assertTrue(this.presenter.toggleDisable.calledOnce);
        assertTrue(this.presenter.setElementSelection.calledOnce);

        assertFalse(this.presenter.configuration.isVisible);
        assertTrue(this.presenter.configuration.isSelected);
        assertTrue(this.presenter.configuration.isDisabled);
    },

    'test set state to invisible and isDisabled on false' : function() {
        this.presenter.setState(JSON.stringify({ isVisible: false, isSelected: true, isDisabled: false }));

        assertFalse(this.presenter.show.calledOnce);
        assertTrue(this.presenter.hide.calledOnce);
        assertTrue(this.presenter.toggleDisable.calledOnce);
        assertTrue(this.presenter.setElementSelection.calledOnce);

        assertFalse(this.presenter.configuration.isVisible);
        assertTrue(this.presenter.configuration.isSelected);
        assertFalse(this.presenter.configuration.isDisabled);
    },

    'test set state called with empty string' : function() {
        this.presenter.setState("");

        assertFalse(this.presenter.show.calledOnce);
        assertFalse(this.presenter.hide.calledOnce);
        assertFalse(this.presenter.toggleDisable.calledOnce);
        assertFalse(this.presenter.setElementSelection.calledOnce);
    }
});